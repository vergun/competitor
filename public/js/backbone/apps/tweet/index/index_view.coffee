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
      
    events:
      "click .update-chart" : "charts"
    
    ui:
      tweetsTotal: "#tweets-total"
      chartTypes: ".chart-types"
      
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
      
    charts: (e) ->
      @ui.chartTypes.each ->
        $(this).parent().removeClass('active')
      $(e.currentTarget).parent().addClass('active')
      @trigger "update:chart"
      # @updateCharts ech
      
    updateCharts: (e) ->
      chart = $('.chart-types').parent('.active').data('chart')
      model = @model
      App.vent.trigger "update:charts", chart, model
      
  class Index.HeaderNav extends App.Views.ItemView
    template: templatizer.tweet.headernav
    
  ### left ###   
  ##############
    
  class Index.LeftNav extends App.Views.ItemView
    template: templatizer.tweet.sidenav
    
  ### tweet list ###   
  ##############

  class Index.TweetList extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.tweetlist
    
    ui:
      chart: "#myChart"
      updateChart: ".update-chart"
      updateKeyword: ".update-keyword"
      submitDateRange: "#submit-date-range"
      
    onRender: ->
      # @addOrUpdateChart()
      
    addOrUpdateChart: (chart, model, view)  ->
      chart = if typeof chart isnt "undefined" then chart else this.model.get('chart')
      data = if typeof model isnt "undefined" then model.get('chartData') else this.model.get('chartData')
      data = if chart is "Bar" or chart is "Line" or chart is "Radar" then data.datasets else data
      console.log this.ui.chart
      ctx = this.ui.chart.get(0).getContext('2d') #failing because changed index to only tweet list not everything
      new window.Chart(ctx)[chart] data, { animation: true }
      
    App.vent.on "update:charts", (chart, model) =>
      this.prototype.addOrUpdateChart chart, model
    
  ### main graph area ###
  #######################
  
  class Index.Right extends App.Views.ItemView
    template: templatizer.tweet.right
    
  class Index.Chart extends App.Views.ItemView
    template: templatizer.tweet.chart
    
  class Index.ChartLegend extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.chartlegend
  
  class Index.Map extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.map
  
  class Index.Source extends App.Views.ItemView #turn to compositeview
    template: templatizer.tweet.source
  
    
    
    
  