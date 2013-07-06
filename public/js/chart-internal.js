   // chart.js
   
  jQuery(function($){
  
  var UI = {
    
    setupElements: function() {
      //from datepicker
      $( "#from" ).datepicker({
        dateFormat: "yy-mm-dd",
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
          $( "#to" ).datepicker( "option", "minDate", selectedDate );
        }
      });
      //to datepicker
      $( "#to" ).datepicker({
        dateFormat: "yy-mm-dd",
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
          $( "#from" ).datepicker( "option", "maxDate", selectedDate );
        }
      }),
      //progressbar animation
      $( "#progressbar" ).progressbar({
        value: 37
      });
    },
     
    // only one selection elements
    groupRadial: function() {
      $('.group-radial').bind('click', function() {
        $(this).siblings().each(function() {
          $(this).removeClass('selected');
        })
        $(this).addClass('selected');
      })
    },
    
    // on/off style elements
    groupToggle: function() {
      $('.group-toggle').bind('click', function() {
        $(this).toggleClass('selected');
      })
    },
    
    //create an array from keywords
    getKeywords: function() {
      var keywords = []
      $('button.update-keyword.selected').each(function() {
        keywords.push($(this).text());
      })
      return keywords;
    },
    
    //click 'go' on datepicker or new chart
    getChart: function() {
      
      $(document).delegate('#submit-date-range, .update-chart', 'click', function(e){
        
        e.preventDefault();
        
        var dates = $("#from").val() + "." + $("#to").val();
        if (dates.length > 1) dates = "date=" + dates
        if (dates.length == 1) dates = "date="
        
        var chart = $('.chart-types').children('.selected').data('chart');
        chart = "&chart=" + chart;
        
        var keywords = UI.getKeywords();
        //remove spaces combine with ';'
        keywords = "&keywords=" + keywords.join(";").replace(/ /g, "_");
        Charts.getChartData(dates, chart, keywords, Charts.receivedChartData); 
        
      })
    }

    
  }
  
  var Charts = {
    
    //initial chart
    
    setupFirstChart: function() {
      var ctx = document.getElementById("myChart").getContext("2d");
      new Chart(ctx).Pie(eval("(" + document.getElementById("chart-data").value + ")"), { animation: true } );  
    },
    receivedChartData: function(dates, chart, keywords, data) {
      var data = data.chartData;  
      Charts.replaceChart(dates, chart, keywords, data);
      
    },
    // ajax call to fetch new data
    getChartData: function(dates, chart, keywords, callback) {
      $.ajax('/tweets/chart/' + dates + chart + keywords + '/', {
        type: 'GET',
        dataType: 'json',
        success: function(data) { if ( callback ) callback(dates, chart, keywords, data); },
        error: function()       { if ( callback ) callback(null); }
      })   
    },
    
    // replaces current chart todo expand to replace page content
    replaceChart: function(dates, chart, keywords, data) {
      var chart = chart.split("=")[1]
        , ctx = document.getElementById("myChart").getContext("2d");
                
      new Chart(ctx)[chart](data, { animation: true } ); 
      Charts.replaceChartLegend(chart, data); 
    },
    replaceChartLegend: function(chart, data) {
      var container = $('.current-chart-legend');
      var content = "<br />"
      if (chart === "Bar" || chart === "Line" || chart == "Radar") data = data.datasets;
      if (chart === "Doughnut" || chart === "Pie" || chart === "PolarArea") data = data;
      
      $(data).each(function(index, dataPoint) {
        content = content 
                + "<div class='chartBox', style='background-color:" + dataPoint.color + "; display:inline-block'></div>"
                + "<span>" + dataPoint.keyword + " (" + dataPoint.value + " tweets  " + dataPoint.percentage + "%)" + "</span><br />";
      });
      console.log(data);
      
      container.html(content);
    }
    
  }
  // .current-chart-legend
  //   each dataPoint in chartData
  //     br
  //     .chartBox(style= "background-color:" + dataPoint.color + "; display:inline-block")
  //     span= dataPoint.keyword + " (" + dataPoint.value + " tweets  " + dataPoint.percentage + "%)"
  

  
  Charts.setupFirstChart();
  UI.setupElements();
  UI.getChart();
  UI.groupRadial();
  UI.groupToggle();
  
});