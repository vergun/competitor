# chart.js
jQuery ($) ->
  UI =
    maxDate: new Date()
    setupElements: ->
      
      #from datepicker
      $("#from").datepicker
        dateFormat: "yy-mm-dd"
        defaultDate: "+1w"
        changeMonth: true
        numberOfMonths: 1
        maxDate: @maxDate
        onClose: (selectedDate) ->
          $("#to").datepicker "option", "minDate", selectedDate

      
      #to datepicker
      $("#to").datepicker(
        dateFormat: "yy-mm-dd"
        defaultDate: "+1w"
        changeMonth: true
        numberOfMonths: 1
        maxDate: @maxDate
        onClose: (selectedDate) ->
          $("#from").datepicker "option", "maxDate", selectedDate
      )
      
      #progressbar animation
      $("#progressbar").progressbar(value: 37)

    groupChart: ->
      $(".chart-types").bind "click", ->
        _this = this
        $(".chart-types").each ->
          $(this).parent().removeClass "active"

        $(_this).parent().addClass "active"


    groupKeywords: ->
      $(".update-keyword").bind "click", (e) ->
        $(this).toggleClass "active"
        UI.showLoading()
        UI.getData e, "totals"


    
    # on/off style elements
    # groupToggle: function() {
    #   $('.group-toggle').bind('click', function() {
    #     $(this).toggleClass('selected');
    #   })
    # },
    
    #create an array from keywords
    getKeywords: ->
      keywords = []
      $(".update-keyword.active").each ->
        keywords.push $(this).data("keyword")

      keywords

    getSince: ->
      $("#chart-since").val()

    setSince: (tweetId) ->
      $("#chart-since").val tweetId

    
    #click 'go' on datepicker or new chart
    getChart: ->
      $(document).delegate ".update-chart", "click", (e) ->
        UI.showLoading()
        UI.getData e, "totals"


    setDates: ->
      $(document).delegate "#submit-date-range", "click", (e) ->
        UI.showLoading()
        $(".close-reveal-modal").click()
        UI.getData e, "totals"


    getTweetsPaginate: ->
      $(document).delegate "a.pagination", "click", (e) ->
        UI.showLoading()
        UI.getData e, "tweets"


    showLoading: ->
      loading = "<div data-alert class=\"alert-box\">Loading new data.<a href=\"#\" class=\"close\">&times;</a></div>"
      element = $("#footer-region")
      element.prepend loading

    removeLoading: ->
      loading = $(".alert-box")
      loading.each ->
        $(this).find("a").click()


    getData: (e, context) ->
      e.preventDefault()
      dates = $("#from").val() + "." + $("#to").val()
      dates = "date=" + dates  if dates.length > 1
      dates = "date="  if dates.length is 1
      chart = $(".chart-types").parent(".active").data("chart")
      chart = "&chart=" + chart
      keywords = UI.getKeywords()
      keywords = "&keywords=" + keywords.join(";").replace(RegExp(" ", "g"), "_")
      since = UI.getSince()
      since = "&since=" + since
      context = context
      context = "&context=" + context
      Charts.getChartData dates, chart, keywords, since, context, Charts.receivedChartData

  Charts =
    
    #initial chart
    bindRemoveFormattedDatesCancelButton: ->
      $("#cancel-remove-date-filter").bind("click", ->
        $(".close-reveal-modal").click()
      )
      $("#remove-date-filter").bind("click", ->
        console.log "removed"
      )

    removeFormattedDates: ->
      $(document).on "click", ".formatted-dates"

    setupFirstChart: ->
      ctx = document.getElementById("myChart").getContext("2d")
      new Chart(ctx).Pie eval_("(" + document.getElementById("chart-data").value + ")"),
        animation: true


    receivedChartData: (dates, chart, keywords, data) ->
      since = data.since
      displayedTweets = data.displayedTweets
      formattedDates = data.formattedDates
      data = data.chartData
      chart = chart.split("=")[1]
      unless typeof data is "undefined"
        console.log since #todo fix
        #todo set source and language to update also
        Charts.replaceChart dates, chart, keywords, data
        Charts.replaceChartHeader chart
        Charts.replaceChartLegend chart, data
        Charts.replaceTotalTweets chart, data
        Charts.replaceDates formattedDates
        Charts.replaceTweets displayedTweets
        UI.setSince since
      data = data.datasets  if chart is "Bar" or chart is "Line" or chart is "Radar" #todo radar is undefined
      if typeof data is "undefined" or data.length is 0
        
        #Charts.replaceChart(dates, chart, keywords, data);
        $("#myChart").html "<h2>No tweets found.</h2><h4 class='subheader'>Try adding keywords or searching a different time range.</h4>"
        $(".current-chart-legend").html "<h6 class=\"subheader\">No results found, try adding keywords or choosing a different date range.</h6>"
        $("#tweets-total").text "No tweets found"
        $(".tweets-list").html "<h6 class=\"subheader\">No results found, try adding keywords or choosing a different date range.</h6>"
      UI.removeLoading()

    
    # ajax call to fetch new data
    getChartData: (dates, chart, keywords, since, context, callback) ->
      $.ajax "/tweets/chart/" + dates + chart + keywords + since + context + "/",
        type: "GET"
        dataType: "json"
        success: (data) ->
          callback dates, chart, keywords, data  if callback

        error: ->
          callback null  if callback


    
    # replaces current chart todo expand to replace page content
    replaceChart: (dates, chart, keywords, data) ->
      ctx = document.getElementById("myChart").getContext("2d")
      new Chart(ctx)[chart] data,
        animation: true


    replaceChartLegend: (chart, data) ->
      data = data.datasets  if chart is "Bar" or chart is "Line" or chart is "Radar"
      container = $(".current-chart-legend")
      content = ""
      $(data).each (index, dataPoint) ->
        content = content + "<ul class='inline-list'><li class='chartBox', style='background-color:" + dataPoint.color + ";'></li>" + "<li>" + dataPoint.keyword + "</li><li>" + dataPoint.value + " tweets</li><li>" + dataPoint.percentage + "%</li></ul>"

      container.html content

    replaceTotalTweets: (chart, data) ->
      total = 0
      data = data.datasets  if chart is "Bar" or chart is "Line" or chart is "Radar"
      $.each data, (index, element) ->
        total = total + element.value

      $("#tweets-total").text " " + total + " Tweets"

    replaceDates: (formattedDates) ->
      $(".formatted-dates").each ->
        $tmp = $(this).children(":first").children().remove()
        $(this).children(":first").text(formattedDates + "     ").append $tmp #todo change five spaces to &ensp;


    addModalToDate: ->
      $(".active.formatted-dates").data "data-reveal-id", "remove-date-modal"

    replaceChartHeader: (chart) ->
      $("#chart-header").text chart + " chart"
      subtext = ""
      subtext = "Pie charts are great at comparing proportions within a single data set."  if chart is "Pie"
      subtext = "Similar to pie charts, doughnut charts are great for showing proportional data."  if chart is "Doughnut"
      subtext = "Bar graphs are great at showing trend data."  if chart is "Bar"
      subtext = "Line graphs are most widely used graph for showing trends."  if chart is "Line"
      subtext = "Polar area charts are similar to pie charts, but the variable isn't the circumference of the segment, but the radius of it."  if chart is "PolarArea"
      subtext = "Radar charts are good for comparing a selection of different pieces of data."  if chart is "Radar"
      $("#chart-subheader").text subtext

    replaceTweets: (displayedTweets) ->
      $("ul.tweets-list").html ""
      i = 0

      while i < displayedTweets.length
        $("ul.tweets-list").append "<li class=\"tweet\">" + "<div class=\"row\">" + "<div class=\"small-3 columns\">" + "<img src=\"" + displayedTweets[i].user.profile_image_url + "\">" + "</div>" + "<div class=\"small-8 columns\">" + "<h6>" + "<a class=\"user-name\" href=\"http://www.twitter.com/" + displayedTweets[i].user.screen_name + "\" target=\"_blank\">" + displayedTweets[i].user.name + "</a> said:" + "</h6>" + "<span class=\"text\">" + displayedTweets[i].text + "</span>" + "</div>" + "<hr>" + "</div>" + "</li>"
        i += 1

  Charts.setupFirstChart()
  Charts.bindRemoveFormattedDatesCancelButton()
  UI.setupElements()
  UI.getChart()
  UI.setDates()
  UI.groupChart()
  UI.groupKeywords()
