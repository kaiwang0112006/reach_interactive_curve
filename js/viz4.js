function vizDraw(){
	/* Reset the div */
    $("#viz").html('')

    /* Parsing the parameters which will be fetched by 3 select tag. */
    var fetchR = fetchChoice();
    var  year = fetchR[0];
         market = 'national';
         TA = 'Total';
         Publisher = 'Total';
         brand = fetchR[4];

	d3.csv("bpi.csv", function(error, data){
		// Set svg object
	    var svg = dimple.newSvg("#viz", 1000, 1000);
	    var histdata = parseData(data, year, market, TA, Publisher,brand)
      plotrun(histdata);

      // Bind select on change
      var selectids = ['year', 'market', 'TA', 'Publisher','brand']
      for (i in selectids){
          $("#"+selectids[i]).change(function(){
          	/* Parsing the parameters which will be fetched by 3 select tag. */
          	fetchR = fetchChoice();
          	year = fetchR[0];
              market = fetchR[1];
              TA = fetchR[2];
              Publisher = fetchR[3];
              brand = fetchR[4];
          	//update plot
          	histdata = parseData(data,year, market, TA, Publisher,brand);
          	plotrun(histdata);
          })
      }
	} );
}

function plotrun(data){
  var dom = document.getElementById("viz");
  var myChart = echarts.init(dom);
  var app = {};
  option = null;

  // See https://github.com/ecomfe/echarts-stat
  var myRegression = ecStat.regression('polynomial', data);

  myRegression.points.sort(function(a, b) {
      return a[0] - b[0];
  });

  option = {
      title: {
          text: 'Reach Curve of BPI',
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

function fetchChoice(){
	if ($('#year option:selected').val()!=undefined){
		var year = $('#year option:selected').val();
	}else{
		var year = "all";
	}

	if ($('#market option:selected').val()!=undefined){
		var market = $('#market option:selected').val();
	}else{
		var market = "national"
	}

	if ($('#TA option:selected').val()!=undefined){
		var TA = $('#TA option:selected').val();
	}else{
		var TA = "all"
	}

  if ($('#Publisher option:selected').val()!=undefined){
		var Publisher = $('#Publisher option:selected').val();
	}else{
		var Publisher = "all"
	}

  if ($('#brand option:selected').val()!=undefined){
		var brand = $('#brand option:selected').val();
	}else{
		var brand = "all"
	}

	return [year, market, TA, Publisher, brand]
}


function parseData(data,year, market, TA, Publisher, brand){
	/* parse data */
  if (TA == 'Total by Campaign'){
    TA = 'Total'
  }
  if (Publisher == 'Total by Campaign'){
    Publisher = 'Total'
  }
  /* filter data */
	if (year != 'all'){
		data = dimple.filterData(data, "Year", year);
	};

	if (market != 'all'){
		data = dimple.filterData(data, "Market", market);
	}else{
    var filterdata = [];
    for (i in data){
      if (data[i]['Market']!='Total'){
        filterdata.push(data[i])
      }
    }
    data = filterdata;
  };

  if (TA != 'all'){
		data = dimple.filterData(data, "TA", TA);
	}else{
    var filterdata = [];
    for (i in data){
      if (data[i]['TA']!='Total'){
        filterdata.push(data[i])
      }
    }
    data = filterdata;
  }

  if (Publisher != 'all'){
		data = dimple.filterData(data, "Publisher", Publisher);
	}else{
    var filterdata = [];
    for (i in data){
      if (data[i]['Publisher']!='Total'){
        filterdata.push(data[i])
      }
    }
    data = filterdata;
  }

  if (brand != 'all'){
		data = dimple.filterData(data, "Brand", brand);
	};

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
