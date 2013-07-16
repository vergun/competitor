@Competitor.module "TweetApp.Index", (Index, App, Backbone, Mariontte, $, _, Chart) ->
  
  Index.Controller =
    
    showIndex: ->
      tweets = App.request "get:index:tweets"
      
      @layout = @getIndexLayout()
      
      tweets.fetch().done =>
        App.mainRegion.show @layout
        
      @layout.on "show", =>
        tweets = tweets.models[0] #todo move to entities
        @showHeader tweets
        @showHeaderNav tweets
        @showLeftNav tweets
        @showTweetList tweets
        @showChart tweets
        @showChartLegend tweets
      
    ### layout ###
    ############## 
    getIndexLayout: ->
      new Index.Layout
      
    ### header ###
    ############## 
    showHeader: (tweets) ->
      @headerView = @getHeaderView tweets
      
      @headerView.on "update:chart", (args) ->
        console.log args.model
        
      @layout.headerRegion.show @headerView
      
    showHeaderNav: (tweets) ->
      @headernavView = @getHeaderNavView tweets
      @layout.headerNavRegion.show @headernavView
      
    getHeaderView: (tweets) ->
      new Index.Header
        model: tweets
        
    getHeaderNavView: (tweets) ->
      new Index.HeaderNav
        model: tweets
        
    ### left  ###
    #############
    showLeftNav: (tweets) ->
      @sidenavView = @getLeftNavView tweets
      @layout.sideNavRegion.show @sidenavView
      
    getLeftNavView: (tweets) ->
      new Index.LeftNav
        model: tweets
        
    ###  tweet list  ###
    ####################
    showTweetList: (tweets) ->
      @tweetListView = @getTweetListView tweets
      @layout.tweestListRegion.show @tweetListView
        
    getTweetListView: (tweets) ->
      new Index.TweetList
        model: tweets
      
    ###  right side  ###
    ####################
    showChart: (tweets) ->
      @chartView = @getChartView
      @layout.chartRegion.show @chartView tweets
      
    showChartLegend: (data) ->
      console.log data
      @chartLegendView = @getChartLegendView data
      @layout.chartLegendRegion.show @chartLegendView
      
    getChartView: (data) ->
      new Index.Chart
        model: data
        
    getChartLegendView: (data) ->
      new Index.ChartLegend
        model: data