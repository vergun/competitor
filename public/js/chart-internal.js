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
    
    //click 'go' on datepicker or new chart
    getChart: function() {
      
      $(document).delegate('#submit-date-range, .update-chart', 'click', function(e){
        
        e.preventDefault();
        
        var dates = $("#from").val() + "." + $("#to").val();
        if (dates.length > 1) dates = "date=" + dates
        if (dates.length == 1) dates = "date="
        
        var chart = $('.chart-types').children('.selected').data('chart');
        chart = "&chart=" + chart;
        console.log(chart);
        
        Charts.getChartData(dates, chart, Charts.receivedChartData); 
        
      })
    }

    
  }
  
  var Charts = {
    
    //initial chart
    
    setupFirstChart: function() {
      var ctx = document.getElementById("myChart").getContext("2d");
      new Chart(ctx).Pie(eval("(" + document.getElementById("chart-data").value + ")"), { animation: true } );  
    },
    receivedChartData: function(dates, chart, data) {
      var data = data.chartData;  
      Charts.replaceChart(dates, chart, data);
      
    },
    // ajax call to fetch new data
    getChartData: function(dates, chart, callback) {
      $.ajax('/tweets/chart/' + dates + chart + '/', {
        type: 'GET',
        dataType: 'json',
        success: function(data) { if ( callback ) callback(dates, chart, data); },
        error: function()       { if ( callback ) callback(null); }
      })   
    },
    
    // replaces current chart todo expand to replace page content
    replaceChart: function(dates, chart, data) {
      var chart = chart.split("=")[1]
        , ctx = document.getElementById("myChart").getContext("2d");
                
      new Chart(ctx)[chart](data, { animation: true } );  
    }
    
  }
  

  
  Charts.setupFirstChart();
  UI.setupElements();
  UI.getChart();
  UI.groupRadial();
  UI.groupToggle();
  
});