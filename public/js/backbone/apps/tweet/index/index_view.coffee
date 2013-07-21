@Competitor.module "TweetApp.Index", (Index, App, backbone, Marionette, $, _) ->
  
  ### Layout ###    
  ############## 
  class Index.Layout extends App.Views.Layout
    template: templatizer.tweet.layout
    
    regions:
      headerRegion: "#tweetApp-header"
      loadingRegion: "#tweetApp-loading"
      headerNavRegion: "#tweetApp-headerNav"
      sideNavRegion: "#tweetApp-sideNav"
      tweestListRegion: "#tweetApp-list"
      chartRegion: "#tweetApp-chart"
      chartLegendRegion: "#tweetApp-chartLegend"
      mapRegion: "#tweetApp-map"
      sourceRegion: "#tweetApp-source"
      footerRegion: "#tweetApp-footer"
      
  ### Header ###    
  ############## 
  ## todo add sample data structure up here to comments
  class Index.Header extends App.Views.ItemView
    template: templatizer.tweet.header
    ui:
      tweetsTotal: "#tweets-total"

    templateHelpers: ## todo move this logic to controller is this is htat
      tweetsCount: ->
        total = 0
        if this.chart is "Bar" or this.chart is "Line" or this.chart is "Radar"
          data = this.chartData.datasets
        else
          data = this.chartData
        $.each data, (index, element) ->
          total = total + element.value
        return " " + total + " Tweets"
    
    modelEvents:
      "change" : "render"
      
  class Index.Loading extends App.Views.ItemView
    template: templatizer.tweet.includes._loading
    className: "row"
      
  class Index.HeaderNav extends App.Views.ItemView
    template: templatizer.tweet.headernav
    events:
      "click .update-chart" : "charts"
      "click .update-keyword" : "keywords"
      "click #submit-date-range" : "submitDateRange"
      
    ui:
      type: ".chart-types"
      keywords: ".update-keyword"
      closeModal: ".close-reveal-modal"
      from: "#from"
      to: "#to"

    onShow: ->
      @datepicker()
  
    maxDate: ->
      new Date()
      
    charts: (e) ->
      @ui.type.each ->
        $(this).parent().removeClass('active')
      $(e.currentTarget).parent().addClass('active')
      @updateChart()
      
    updateChart: ->
      options = { type: @ui.type.parent('.active').data('chart') }
      @trigger "update:chart",
        options
      
    keywords: (e) ->
      e = $(e.currentTarget)
      e.toggleClass('active')
      @dispatchKeywords()
    
    dispatchKeywords: ->
      data = _.map @ui.keywords.filter('.active'), (el) -> 
        $(el).data('keyword')
      @trigger "update:keywords", 
        data: data  
        
    datepicker: ->
      @ui.from.datepicker
        dateFormat: "yy-mm-dd"
        defaultDate: "+1w"
        changeMonth: true
        numberOfMonths: 1
        maxDate: @maxDate()
        onClose: ( selectedDate ) =>
          @ui.to.datepicker( "option", "minDate", selectedDate )
      @ui.to.datepicker
        dateFormat: "yy-mm-dd"
        defaultDate: "+1w"
        changeMonth: true
        numberOfMonths: 1
        maxDate: @maxDate()
        onClose: ( selectedDate ) =>
          @ui.from.datepicker( "option", "maxDate", selectedDate )
          
    submitDateRange: ->
      @setDates()
      
      App.vent.trigger "show:loading"
      App.vent.trigger "update:tweets",
        chart: @model.get("chart")
        dates: @model.get("dates")
        keywords: @model.get("keywords").join(";")
      @ui.closeModal.click()      
      # UI.getData(e, "totals");
      
    setDates: ->
      dates = @ui.from.val() + "." + @ui.to.val()
      dates = "" if dates.length <= 1
      @model.set "dates", dates
      
  ### left ###   
  ##############
    
  class Index.LeftNav extends App.Views.ItemView
    template: templatizer.tweet.sidenav
    
    events:
      'click .side-nav a': 'switchApps'
      
    switchApps: (e) ->
      e = $(e.currentTarget)
      if !e.parent().hasClass(' c')
        $.each e.parent().parent().children(), (i, el) ->
          $(el).removeClass('active')
        e.parent().addClass('active')
    
  ### tweet list ###   
  ##############

  class Index.TweetList extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.tweetlist
    
    ui:
      updateChart: ".update-chart"
      updateKeyword: ".update-keyword"
      submitDateRange: "#submit-date-range"
    
  ### main graph area ###
  #######################
  
  class Index.Right extends App.Views.ItemView
    template: templatizer.tweet.right
    
  class Index.Chart extends App.Views.ItemView
    template: templatizer.tweet.chart
    ui: 
      type: '.update-chart'
      context: '#tweet-chart'
      
    onShow: ->
      @addOrUpdateChart()
    
    addOrUpdateChart: (options = {})  ->
      data = @filterChart @model
      data = @filterKeywords( data, @model.get('activeKeywords') )
      $.extend options, { data: data, chart: @model.get('chart') }
      # console.log options.data
      # console.log options.chart
      @showChart @ui.context.get(0).getContext('2d'), options.data, options.chart
    
    filterChart: (model, chart) ->
      data = if @easyChart() then model.get('chartData') else model.get('complex')
      data
      
    filterKeywords: (data, activeKeywords) ->
      tempdata = @getTempData data, activeKeywords
      if @easyChart() then ( data = tempdata ) else ( data.datasets = tempdata )
      data
      
    getTempData: (data, activeKeywords) ->
      tempdata = if @easyChart() then data else data.datasets
      tempdata = _.compact _.map tempdata, (set) -> return set if _.indexOf(activeKeywords, set.keyword) isnt -1
      tempdata
    
    easyChart: ->
      result = if (_.indexOf ["Bar", "Line", "Radar"], @model.get('chart')) is -1 then true else false
      result
      
    showChart: (context, data, chart, options = {}) ->
      $.extend options, { animation: true }
      new window.Chart(context)[chart] data, options
    
  class Index.ChartLegend extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.chartlegend
  
  class Index.Map extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.map
  
  class Index.Source extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.source
  
    
    
    
  