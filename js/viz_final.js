function vizDraw(){
	/* Reset the div */
    $("#viz").html('');
    
    /* Parsing the parameters which will be fetched by 3 select tag. */
    var fetchR = fetchChoice();
    var pclass = fetchR[0];
    var age = fetchR[1];
    var gender = fetchR[2];
	
	d3.csv("data.csv", function(error, data){
		// Set svg object
	    var svg = dimple.newSvg("#viz", 600, 600);
	    var histdata = parseData(data, pclass, age, gender)

        //plot bar plot
		var myChart = new dimple.chart(svg, histdata);
        myChart.setBounds(60, 130, 510, 330);
        var xaxis = myChart.addCategoryAxis("x", "status");
        xaxis.addOrderRule(["Survived","Unsurvived"])
        var yaxis = myChart.addMeasureAxis("y", "Person");
        xaxis.title = "Survived or not";
        yaxis.title = "Person Count";
        
        var maxy = Math.max(histdata[0]['Person'], histdata[1]['Person']);
        if (maxy <= 5){
        	yaxis.ticks = maxy;
        }
        
        var s = myChart.addSeries(["status"], dimple.plot.bar);

        // Handle the hover event - overriding the default behaviour
        s.addEventHandler("mouseover", onHover);
        // Handle the leave event - overriding the default behaviour
        s.addEventHandler("mouseleave", onLeave);
        myChart.draw(1000);

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
        
        // Bind select on change
        var selectids = ["pclass",'gender','age']
        for (i in selectids){
            $("#"+selectids[i]).change(function(){
            	/* Parsing the parameters which will be fetched by 3 select tag. */
            	fetchR = fetchChoice();
            	pclass = fetchR[0];
                age = fetchR[1];
                gender = fetchR[2];
            	//update plot
            	myChart.data = parseData(data,pclass, age, gender);
                var maxy = Math.max(myChart.data[0]['Person'],myChart.data[1]['Person']);
                if (maxy <= 5){
                	yaxis.ticks = maxy;
                }
            	myChart.draw(1000);
            	updatemsgs(megs,myChart.data,pclass,gender,age)
            })       	
        }
        
        // update survival rate
        var megs = $("#megs");
        updatemsgs(megs,histdata,pclass,gender,age)

	} );
}

function fetchChoice(){
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

	return [pclass, age, gender]
}

function updatemsgs(megs,histdata,pclass,gender,age){
	megs.html('');
    var surRate = parseFloat(histdata[0]["Person"])/parseFloat(histdata[0]["Person"] + histdata[1]["Person"]);
    surRate = (surRate*100).toFixed(2);
    var megtop = $("<p>Survival Rate:  " + surRate + "%</p>");
    var meggroup = $("<p>for passengers of</p>");
    var pclassgroup = $("<p>pclass:" + pclass + "</p>") ;
    var gendergroup = $("<p>gender:" + gender + "</p>") ;
    var agegroup = $("<p>age:" + age + "</p>");
    
    megtop.appendTo(megs);
    meggroup.appendTo(megs);
    pclassgroup.appendTo(megs);
    gendergroup.appendTo(megs);
    agegroup.appendTo(megs);	
}

function parseData(data,pclass, age, gender){
	var cleandata = []
	var histdata = []
	// pclass can have multiple class type ("1 and 2", "2 and 3", "1 and 3")
	if (pclass === '1 and 2'){
		pclass = ['1','2']
	}else if (pclass === '2 and 3'){
		pclass = ['2','3']
	}else if (pclass === '1 and 3'){
		pclass = ['1','3']
	}
	/* filter data */

	if (pclass != 'all'){
		data = dimple.filterData(data, "Pclass", pclass);			
	}
	if (gender != 'all'){
		data = dimple.filterData(data, "Sex", gender);			
	}
	
	for (i in data){
		data[i]['Age'] = parseFloat(data[i]['Age'])
		if ((age === "<18" && data[i]['Age']<=18) || (age === ">=18" && data[i]['Age']>18) || (age === "all")){
			cleandata.push({"Age":data[i]['Age'],"Survived":data[i]['Survived'],"Pclass":data[i]['Pclass']});
		}
	}
	/* aggregate data */
	var Survived = 0
	for (i in cleandata){
		if (cleandata[i]['Survived'] == '1'){
			Survived += 1;
		}
	}

	var histdata = [{"status":"Survived","Person":Survived},{"status":"Unsurvived","Person":cleandata.length-Survived}]	
	return histdata
}