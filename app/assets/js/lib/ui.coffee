defaults =
  keywords: []
  keywordsCounter: {}
  total: 0

socket = io.connect()
jQuery ($) ->
  tweetList = $("ul.tweets.streaming")
  analytics = $("ul.analytics")
  firstField = $("input#email-login")
  login = addFocus: ->
    firstField.focus()  if firstField.length

  tweet =
    removeTweets: ->
      limit = 5
      list = tweetList.children("li:gt(" + limit + ")")
      list.remove()

    prependTweet: (data) ->
      url = (if data.username then "<a href=\"" + "http://www.twitter.com/" + data.user + "\">" + data.username + "</a>" else data.username)
      content = "<li><div class=\"row\"><div class=\"small-3 columns\"><img src=" + data.avatar + " /></div>" + "<div class=\"small-8 columns\"><h6>" + url + " said: </h6>" + data.text + "</div><hr></li>"
      tweetList.prepend content #todo remove tweets from bottom of the list

    updateTotal: (data) ->
      defaults.total++

    updateAnalytics: (data) ->
      for key of defaults.keywordsCounter
        cstr = primitive_types.prepare_string(key)
        ckey = defaults.keywordsCounter[key]
        ctotal = defaults.total
        cp = (Math.round(((ckey / ctotal) * 100) * 10) / 10)
        $("." + cstr + ".meter").css "width", cp + "%"
        $("." + cstr + " span.number").text ckey
        $("." + cstr + " span:not(\".number\")").text cp + "%"

    updateNumbers: (data, k, c) ->
      i = 0

      while i < k.length
        if data.text.indexOf(k[i]) isnt -1
          (if c[k[i]] then c[k[i]]++ else c[k[i]] = 1)
          @updateTotal()
        i++

  primitive_types =
    prepare_string: (string) ->
      @change_white_space_to_hyphens string

    change_white_space_to_hyphens: (string) ->
      string.replace RegExp(" ", "g"), "-"

    styleKeyword: (keywords) ->
      holder = ""
      i = 0

      while i < keywords.length
        holder += "<span class='radius secondary label'>" + keywords[i] + "</span>"
        i += 1
      holder

  setup =
    bindSubmit: ->
      $("#login-button").click ->
        $(".login").submit()


    addPanelClass: ->

    
    # analytics.addClass('panel')
    header: ->
      header = $("#tracking")
      header.html "<h2>Competitive Intelligence</h2><h3 class='subheader'>Stay informed on your competition</h3><p>Live example: Tracking " + primitive_types.styleKeyword(defaults.keywords) + "</p>"

    
    # todo add pause/play feature
    analytics: ->
      i = 0

      while i < defaults.keywords.length
        analytics.prepend "<ul class=\"inline-list " + primitive_types.prepare_string(defaults.keywords[i]) + "\"" + "><li class=\"" + primitive_types.prepare_string(defaults.keywords[i]) + "\">" + defaults.keywords[i] + "</li><li><span class=\"number\">0</span></li><li><span>0%</span></li></ul>" + "<div class=\"progress small-12 radius\"><span class=\"meter" + " " + primitive_types.prepare_string(defaults.keywords[i]) + "\" style=\"width: 40%\"></span></div>"
        i++

    keywords: (keywords) ->
      defaults.keywords = keywords.keywords

  socket.on "connect", ->
    login.addFocus()
    setup.bindSubmit()

  socket.on "keywords", (keywords) ->
    unless defaults.keywords.length
      setup.addPanelClass()
      setup.keywords keywords
      setup.analytics()
      setup.header()

  socket.on "tweet", (data) ->
    tweet.updateAnalytics data
    tweet.updateNumbers data, defaults.keywords, defaults.keywordsCounter
    tweet.prependTweet data
    tweet.removeTweets()


#jQuery