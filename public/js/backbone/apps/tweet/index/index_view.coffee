@Competitor.module "TweetApp.Index", (Index, App, backbone, Marionette, $, _) ->
  
  ### Layout ###    
  ############## 
  class Index.Layout extends App.Views.Layout
    template: templatizer.tweet.layout
    
    regions:
      headerRegion: "#tweetApp-header"
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

    templateHelpers:
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
      
  class Index.HeaderNav extends App.Views.ItemView
    template: templatizer.tweet.headernav
    events:
      "click .update-chart" : "charts"
      "click .update-keyword" : "keywords"
    ui:
      type: '.chart-types'
      
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
      
  ### left ###   
  ##############
    
  class Index.LeftNav extends App.Views.ItemView
    template: templatizer.tweet.sidenav
    
    events:
      'click .side-nav a': 'switchApps'
      
    switchApps: (e) ->
      e = $(e.currentTarget)
      if !e.parent().hasClass('active')
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
      @addOrUpdateChart { model: @model }
    
    addOrUpdateChart: (options)  ->
      $.extend options, { chart: @model.get('chart'), data: @model.get('chartData') }
      options.data = @validate options.data, options.chart
      @showChart @ui.context.get(0).getContext('2d'), options.chart, options.data
    
    validate: (data, chart) ->
      data = data.chartData if _.indexOf(["Bar", "Line", "Radar"], chart) isnt -1
      console.log "Data:"
      console.log data
      data

    showChart: (context, chart, data, options) ->
      options or= {}
      $.extend options, { animation: true }
      new window.Chart(context)[chart] data, options
    
  class Index.ChartLegend extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.chartlegend
  
  class Index.Map extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.map
  
  class Index.Source extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.source
  
    
    
    
  