@Competitor.module "TweetApp.Index", (Index, App, backbone, Marionette, $, _) ->
  
  ### Layout ###    
  ############## 
  class Index.Layout extends App.Views.Layout
    template: templatizer.tweet.layout
    
    regions:
      headerRegion: "#tweets-header-region"
      mainRegion: "#tweets-main-region"
      footerRegion: "#tweets-footer-region"
      
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

  ### Tweets ###   
  ############## 
  class Index.Tweet extends App.Views.ItemView
    template: templatizer.tweet.tweets
    
    ui:
      chart: "#myChart"
      
    templateHelpers:
      addChart: ->
        if this.chart is "Bar" or this.chart is "Line" or this.chart is "Radar"
          data = this.chartData.datasets
        else
          data = this.chartData
        # ctx = $("myChart").get(0).getContext('2d')
        # console.log ctx
        # return new Chart(ctx)[this.chart] this.chartData, { animation: true }
        # - var ctx = document.getElementById("myChart").getContext("2d")
        # - new Chart(ctx)[chart](chartData, { animation: true })
      
  class Index.TweetEmpty extends App.Views.ItemView
    template: templatizer.tweet.includes._tweets_empty
      
  class Index.Tweets extends App.Views.CompositeView
    template: templatizer.tweet.tweets   
    itemViewContainer: '.tweets-list'
    itemView: Index.Tweet
    emptyView: Index.TweetEmpty
    
    
    
    
    
  