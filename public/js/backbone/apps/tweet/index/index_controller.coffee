@Competitor.module "TweetApp.Index", (Index, App, Backbone, Mariontte, $, _) ->
  
  Index.Controller =
    
    showIndex: ->
      tweets = App.request "get:index:tweets"
      
      @layout = @getIndexLayout()
      
      tweets.fetch().done =>
        App.mainRegion.show @layout
        
      @layout.on "show", =>
        tweets = tweets.models[0] #todo move to entities
        console.log tweets
        @showHeaderRegion tweets
        @showMainRegion tweets
      
    ### layout ###
    ############## 
    getIndexLayout: ->
      new Index.Layout
      
    ### header ###
    ############## 
    showHeaderRegion: (tweets) ->
      headerView = @getHeaderView tweets
      @layout.headerRegion.show headerView
      
    getHeaderView: (tweets) ->
      new Index.Header
        model: tweets
        
    ### tweets ###
    ############## 
    showMainRegion: (tweets) ->
      mainView = @getMainView tweets
      @layout.mainRegion.show mainView
      
    getMainView: (tweets) ->
      new Index.Tweet
        model: tweets