@Competitor.module "TweetApp.Index", (Index, App, Backbone, Mariontte, $, _, Chart) ->
  
  Index.Controller =
    
    showIndex: ->
      tweets = @getTweets()
      
      @layout = @getIndexLayout()
      
      tweets.fetch().done =>
        App.mainRegion.show @layout        
        
      @layout.on "show", =>
        tweets = tweets.models[0] #todo move to entities
        tweets.set 'activeKeywords', tweets.get('keywords') #todo move someplace else
        @showHeader tweets
        @showHeaderNav tweets
        @showLeftNav tweets
        @showTweetList tweets
        @showChart tweets
        @showChartLegend tweets
        @showMap tweets
        @showSource tweets
        
    updateIndex: (options = {}) ->
      tweets = @getTweets( options )
      tweets.fetch().done =>
        tweets = tweets.models[0] #todo move to entities
        tweets.set 'activeKeywords', tweets.get('keywords') #todo move someplace else
        @showHeader tweets
        @showTweetList tweets
        @showChart tweets
        @showChartLegend tweets
        
        
        App.vent.trigger "remove:loading"
                
    getTweets: (options = {}) ->
      App.request "get:index:tweets", options
        
    ### layout ###
    ############## 
    getIndexLayout: ->
      new Index.Layout
      
    ### header ###
    ############## 
    showHeader: (tweets) ->
      @headerView = @getHeaderView tweets
      @layout.headerRegion.show @headerView
      
    showHeaderNav: (tweets) ->
      @headernavView = @getHeaderNavView tweets
      
      @headernavView.on "update:chart", (options) ->
        @model.set('chart', options.type)
        $.extend options, { model: @model }
        App.vent.trigger "update:chart", 
          options
          
      @headernavView.on "update:keywords", (options) ->
        $.extend options, { model: @model}
        @model.set 'activeKeywords', options.data
        App.vent.trigger "update:chart",
          options

      @layout.headerNavRegion.show @headernavView
      
    showLoading: ->
      @loadingView = @getLoadingView()
      @layout.loadingRegion.show @loadingView
      
    getLoadingView: ->
      new Index.Loading
      
    removeLoading: ->
      @layout.loadingRegion.close()
      
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
      @chartView = @getChartView tweets
      @layout.chartRegion.show @chartView
      
    showChartLegend: (data) ->
      @chartLegendView = @getChartLegendView data
      @layout.chartLegendRegion.show @chartLegendView
      
    getChartView: (data) ->
      new Index.Chart
        model: data
        
    getChartLegendView: (data) ->
      new Index.ChartLegend
        model: data
        
    showMap: (tweets) ->
      @mapView = @getMapView tweets
      @layout.mapRegion.show @mapView
      
    showSource: (tweets) ->
      @sourceView = @getSourceView tweets
      @layout.sourceRegion.show @sourceView
      
    getMapView: (data) ->
      new Index.Map
        model: data
        
    getSourceView: (data) ->
      new Index.Source
        model: data