function vizDraw(){
	/* Reset the div */
    $("#viz").html('')
    
    /* Parsing the parameters which will be fetched by 3 select tag. */
    
	if ($('#pclass option:selected').val()!=undefined){
		var pclass = $('#pclass option:selected').val();
	}else{
		var pclass = "all";
	}
	
	if ($('#age option:selected').val()!=undefined){
		var age = $('#age option:selected').val();
	}else{
		var age = "all"
	}
	
	if ($('#gender option:selected').val()!=undefined){
		var gender = $('#gender option:selected').val();
	}else{
		var gender = "all"
	}
	
	d3.csv("data.csv", function(error, data){
		// Set svg object
	    var svg = dimple.newSvg("#viz", 600, 600);
	    var cleardata = []
		
		/* filter data */
		if (pclass != 'all'){
			data = dimple.filterData(data, "Pclass", pclass);			
		}
		if (gender != 'all'){
			data = dimple.filterData(data, "Sex", gender);			
		}
		
		for (i in data){
			data[i]['Age'] = parseFloat(data[i]['Age'])
			if ((age === "child" && data[i]['Age']<=18) || (age === "adult" && data[i]['Age']>18) || (age === "all")){
				cleardata.push({"Age":data[i]['Age'],"Survived":data[i]['Survived'],"Pclass":data[i]['Pclass']});
			}
		}
		/* aggregate data */
		var Survived = 0
		for (i in cleardata){
			if (cleardata[i]['Survived'] == '1'){
				Survived += 1;
			}
		}

		var histdata = [{"status":"Survived","Person":Survived},{"status":"Unsurvived","Person":cleardata.length-Survived}]
        //plot bar plot
		var myChart = new dimple.chart(svg, histdata);
        myChart.setBounds(60, 130, 510, 330);
        var xaxis = myChart.addCategoryAxis("x", "status");
        var yaxis = myChart.addMeasureAxis("y", "Person");
        xaxis.title = "Survived or not"
        yaxis.title = "Person Count"
        var s = myChart.addSeries(null, dimple.plot.bar);
        
        // Handle the hover event - overriding the default behaviour
        s.addEventHandler("mouseover", onHover);
        // Handle the leave event - overriding the default behaviour
        s.addEventHandler("mouseleave", onLeave);
        myChart.draw();
        
        // Event to handle mouse enter
        function onHover(e) {

            // Get the properties of the selected shape
            var cx = parseFloat(e.selectedShape.attr("x")),
                cy = parseFloat(e.selectedShape.attr("y")),
                r = parseFloat(e.selectedShape.attr("r"))
            // Set the size and position of the popup
            var width = 150,
                height = 70,
                x = cx+20;
                  y = cy-20;

            // Create a group for the popup objects
            popup = svg.append("g");

            // Add a rectangle surrounding the text
            popup
                .append("rect")
                .attr("x", x + 5)
                .attr("y", y - 5)
                .attr("width", 150)
                .attr("height", height/1.5)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", 'rgb(253, 208, 162)')
                .style("stroke", 'rgb(251, 128, 114)')
                .style("box-shadow", '4px 4px 10px rgba(0, 0, 0, 0.4)')
                .style("stroke-width", 2);

            // Add multiple lines of text
            popup
                .append('text')
                .attr('x', x + 10)
                .attr('y', y + 10)
                .append('tspan')
                .attr('x', x + 10)
                .attr('y', y + 20)
                .text(e.xValue + " Persons: " + e.yValue)
                .style("font-family", "sans-serif")
                .style("font-size", 10)
        }

        // Event to handle mouse exit
        function onLeave(e) {
            // Remove the popup
            if (popup !== null) {
                popup.remove();
            }
        }
        

	} );
}