   // chart.js
   
  jQuery(function($){
  
  var UI = {
    
    maxDate: new Date(),
    
    setupElements: function() {
      //from datepicker
      $( "#from" ).datepicker({
        dateFormat: "yy-mm-dd",
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        maxDate: this.maxDate,
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
        maxDate: this.maxDate,
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
    // groupRadial: function() {
    //   $('.group-radial').bind('click', function() {
    //     $(this).siblings().each(function() {
    //       $(this).removeClass('selected');
    //     })
    //     $(this).addClass('selected');
    //   })
    // },
    
    
    groupChart: function() {
      $('.chart-types').bind('click', function() {
        var _this = this;
        $('.chart-types').each(function() {
          $(this).parent().removeClass('active');
        });
        $(_this).parent().addClass('active');
      })
    },
    
    groupKeywords: function() {
      $('.update-keyword').bind('click', function(e) {
        $(this).toggleClass('active');
        UI.showLoading();
        UI.getData(e, "totals");
      })
    },
    
    // on/off style elements
    // groupToggle: function() {
    //   $('.group-toggle').bind('click', function() {
    //     $(this).toggleClass('selected');
    //   })
    // },
    
    //create an array from keywords
    getKeywords: function() {
      var keywords = []
      $('.update-keyword.active').each(function() {
        keywords.push($(this).data('keyword'));
      })
      return keywords;
    },
    
    getSince: function() {
      return $('#chart-since').val();
    },
    
    setSince: function(tweetId) {
      $('#chart-since').val(tweetId)      
    },
    
    //click 'go' on datepicker or new chart
    getChart: function() {
      $(document).delegate('.update-chart', 'click', function(e){
        UI.showLoading();
        UI.getData(e, "totals");
      })
      
    },
    
    setDates: function() {
      $(document).delegate('#submit-date-range', 'click', function(e) {
        UI.showLoading();
        $('.close-reveal-modal').click();
        UI.getData(e, "totals");
      })
    },
    
    getTweetsPaginate: function() {
      $(document).delegate('a.pagination', 'click', function(e) {
        UI.showLoading();
        UI.getData(e, "tweets");
      })
      
    },
    
    showLoading: function() {
      var loading = '<div data-alert class="alert-box">Loading new data.<a href="#" class="close">&times;</a></div>'
        , element = $('#footer-region');
      element.prepend(loading)
    },
    
    removeLoading: function() {
      var loading = $('.alert-box');
      loading.each(function() {
        $(this).find('a').click();
      })
    },
    
    getData: function ( e, context ) {
      
      e.preventDefault();
      
      var dates = $("#from").val() + "." + $("#to").val();
      console.log(dates);
      
      if (dates.length > 1) dates = "date=" + dates
      if (dates.length == 1) dates = "date="
      
      var chart = $('.chart-types').parent('.active').data('chart');
      chart = "&chart=" + chart;
      console.log(chart)
      
      var keywords = UI.getKeywords();
      keywords = "&keywords=" + keywords.join(";").replace(/ /g, "_");
      console.log(keywords)
      
      var since = UI.getSince();
      since = "&since=" + since
      
      var context = context;
      context = "&context=" + context
            
      Charts.getChartData(dates, chart, keywords, since, context, Charts.receivedChartData); 
      
    }

    
  }
  
  var Charts = {
    
    //initial chart
    
    setupFirstChart: function() {
      var ctx = document.getElementById("myChart").getContext("2d");
      new Chart(ctx).Pie(eval("(" + document.getElementById("chart-data").value + ")"), { animation: true } );  
    },
    
    receivedChartData: function(dates, chart, keywords, data) { 
      var since = data.since
        , displayedTweets = data.displayedTweets
        , formattedDates = data.formattedDates
        , data = data.chartData
        , chart = chart.split("=")[1]
      
        if (data.length) {
          console.log(since); //todo fix
          Charts.replaceChart(dates, chart, keywords, data);
          Charts.replaceChartLegend(chart, data);       
          Charts.replaceTotalTweets(chart, data);  
          Charts.replaceDates(formattedDates);
          Charts.replaceTweets(displayedTweets);
          UI.setSince(since); 
        }
        
        if (!data.length) {
          console.log(displayedTweets);
          Charts.replaceChart(dates, chart, keywords, data);
          $('#myChart').html("<h2>No tweets found.</h2><h4 class='subheader'>Try adding keywords or searching a different time range.</h4>")
          $('.current-chart-legend').html('');
          $("#tweets-total").text(" No tweets found");
        }
                  
        
      UI.removeLoading();
      
    },
    // ajax call to fetch new data
    getChartData: function(dates, chart, keywords, since, context, callback) {      
      $.ajax('/tweets/chart/' + dates + chart + keywords + since + context + '/', {
        type: 'GET',
        dataType: 'json',
        success: function(data) { if ( callback ) callback(dates, chart, keywords, data); },
        error: function()       { if ( callback ) callback(null); }
      })   
    },
    
    // replaces current chart todo expand to replace page content
    replaceChart: function(dates, chart, keywords, data) {
      var ctx = document.getElementById("myChart").getContext("2d");
      new Chart(ctx)[chart](data, { animation: true } ); 
    },
    
    replaceChartLegend: function(chart, data) {
      if (chart === "Bar" || chart === "Line" || chart === "Radar") data = data.datasets;
      
      var container = $('.current-chart-legend')
        , content = ""
      
      $(data).each(function(index, dataPoint) {
        content = content 
                + "<ul class='inline-list'><li class='chartBox', style='background-color:" + dataPoint.color + ";'></li>"
                + "<li>" + dataPoint.keyword + "</li><li>" + dataPoint.value + " tweets</li><li>" + dataPoint.percentage + "%</li></ul>";
      });
            
      container.html(content);
    },
    
    replaceTotalTweets: function(chart, data) {
      var total = 0;
      if (chart === "Bar" || chart === "Line" || chart === "Radar") data = data.datasets;
      
      $.each(data, function(index, element) {
        total = total + element.value;
      });
      $("#tweets-total").text(" " + total + " Tweets");
    },
    
    replaceDates: function(formattedDates) {
      $('.formatted-dates').each(function() {
        var $tmp = $(this).children(':first').children().remove();
        $(this).children(':first').text(formattedDates).append($tmp);
      })
    },
    
    replaceTweets: function(displayedTweets) {
      console.log(displayedTweets);
      $('ul.tweets').html('');
      for (var i=0; i<displayedTweets.length; i+=1) {
        console.log(displayedTweets[i]);
        $('ul.tweets').append(
          '<li class="tweet">' 
          + '<div class="row">'
          + '<div class="small-3 columns">'
          + '<img src="' + displayedTweets[i].user.profile_image_url + '">'
          + '</div>'
          + '<div class="small-8 columns">'
          + '<h6>'
          + '<a class="user-name" href="http://www.twitter.com/' + displayedTweets[i].user.screen_name + '" target="_blank">'
          + displayedTweets[i].user.name + ' said:' + '</a>' 
          + '</h6>'
          + '<span class="text">' + displayedTweets[i].text + '</span>'
          + '</div>'
          + '<hr>'
          + '</div>'
          + '</li>')
      }    
    }
    
  }
  

  
  Charts.setupFirstChart();
  UI.setupElements();
  UI.getChart();
  UI.setDates();
  UI.groupChart();
  UI.groupKeywords();
  
});