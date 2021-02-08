function vizDraw(){
	/* Reset the div */
    $("#viz").html('')

    /* Parsing the parameters which will be fetched by 3 select tag. */
    var fetchR = fetchChoice();
    var  year = fetchR[0];
         market = "City Group Buy";
         CoreTA = "P13-35";
         class2 = fetchR[3];
         platform = "Mobile";
         brand = fetchR[5];

	d3.csv("foundation.csv", function(error, data){
		// Set svg object
	    var svg = dimple.newSvg("#viz", 1000, 1000);
	    var histdata = parseData(data, year, market, CoreTA, class2, platform,brand);
      plotrun(histdata);
        //plot bar plot
        // Bind select on change
        var selectids = ["year",'market','CoreTA','class2','platform','brand']
        for (i in selectids){
            $("#"+selectids[i]).change(function(){
            	/* Parsing the parameters which will be fetched by 3 select tag. */
            	fetchR = fetchChoice();
            	year = fetchR[0];
                market = fetchR[1];
                CoreTA = fetchR[2];
                class2 = fetchR[3];
                platform = fetchR[4];
                brand = fetchR[5];
            	//update plot
            	histdata = parseData(data,year, market, CoreTA, class2,platform,brand);
              plotrun(histdata);
            })
        }
	} );
}

function fetchChoice(){
	if ($('#year option:selected').val()!=undefined){
		var year = $('#year option:selected').val();
	}else{
		var year = "all";
	}

	if ($('#market option:selected').val()!=undefined){
		var market = $('#market option:selected').val();
	}else{
		var market = "all"
	}

	if ($('#CoreTA option:selected').val()!=undefined){
		var CoreTA = $('#CoreTA option:selected').val();
	}else{
		var CoreTA = "all"
	}

  if ($('#class2 option:selected').val()!=undefined){
		var class2 = $('#class2 option:selected').val();
	}else{
		var class2 = "all"
	}

  if ($('#platform option:selected').val()!=undefined){
		var platform = $('#platform option:selected').val();
	}else{
		var platform = "all"
	}

  if ($('#brand option:selected').val()!=undefined){
		var brand = $('#brand option:selected').val();
	}else{
		var brand = "all"
	}

	return [year, market, CoreTA, class2,platform,brand]
}

function plotrun(data){
  var dom = document.getElementById("viz");
  var myChart = echarts.init(dom);
  var app = {};
  option = null;

  // See https://github.com/ecomfe/echarts-stat
  var myRegression = ecStat.regression('polynomial', data);
  //var myRegression = ecStat.regression('logarithmic', data);
  //var myRegression = ecStat.regression('exponential', data);

  myRegression.points.sort(function(a, b) {
      return a[0] - b[0];
  });

  option = {
      title: {
          text: 'Reach Curve of Foundation',
          subtext: 'By ecStat.regression',
          sublink: null,
          left: 'center'
      },
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross'
          }
      },
      grid: {
          top: 80,
          bottom: 90
      },
      xAxis: {
          type: 'value',
          splitLine: {
              lineStyle: {
                  type: 'dashed'
              }
          },
      },
      yAxis: {
          type: 'value',
          splitLine: {
              lineStyle: {
                  type: 'dashed'
              }
          },
      },
      series: [{
          name: 'reach curve',
          type: 'scatter',
          emphasis: {
              label: {
                  show: true,
                  formatter: function(param) {
                      return param.data[1];
                  },
                  position: 'top'
              }
          },
          itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              shadowOffsetY: 5,
              color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
              }, {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
              }])
          },
          data: data
      }, {
          name: 'line',
          type: 'line',
          lineStyle: {
              normal: {
                  color: '#2f4554'
              }
          },
          smooth: true,
          showSymbol: false,
          data: myRegression.points,
          markPoint: {
              itemStyle: {
                  color: 'transparent'
              },
              label: {
                  show: true,
                  position: 'left',
                  formatter: myRegression.expression,
                  color: '#333',
                  fontSize: 14
              },
              data: [{
                  coord: myRegression.points[myRegression.points.length - 1]
              }]
          }
      }]
  };;
  if (option && typeof option === "object") {
      myChart.setOption(option, true);
  }
}

function parseData(data,year, market, CoreTA, class2, platform,brand){
	var cleandata = []
	var histdata = []
	/* filter data */

	if (year != 'all'){
		data = dimple.filterData(data, "Year", year);
	}
	if (market != 'all'){
		data = dimple.filterData(data, "market", market);
	}
  if (CoreTA != 'all'){
		data = dimple.filterData(data, "CoreTA", CoreTA);
	}
  if (class2 != 'all'){
		data = dimple.filterData(data, "class2", class2);
	}
  if (platform != 'all'){
		data = dimple.filterData(data, "platform", platform);
	}
  if (brand != 'all'){
		data = dimple.filterData(data, "Brand", brand);
	}

  var hisdata = []
  for (i in data){
    hisdata.push([data[i]['cost'],data[i]['reach']])
  }

  return hisdata
}


function countProperties (obj) {

    var count = 0;

    for (var key in obj) {

        //if (Object.prototype.hasOwnProperty.call(obj, key)) {//感觉好像没必要，希望有人能探讨一下
        //if (obj.hasOwnProperty(key)) {//同上简写
            count++;  //直接加
        //}

    }

    return count;

}
