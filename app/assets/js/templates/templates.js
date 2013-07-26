(function () {
var root = this, exports = {};

// The jade runtime:
var jade=function(exports){Array.isArray||(Array.isArray=function(arr){return"[object Array]"==Object.prototype.toString.call(arr)}),Object.keys||(Object.keys=function(obj){var arr=[];for(var key in obj)obj.hasOwnProperty(key)&&arr.push(key);return arr}),exports.merge=function merge(a,b){var ac=a["class"],bc=b["class"];if(ac||bc)ac=ac||[],bc=bc||[],Array.isArray(ac)||(ac=[ac]),Array.isArray(bc)||(bc=[bc]),ac=ac.filter(nulls),bc=bc.filter(nulls),a["class"]=ac.concat(bc).join(" ");for(var key in b)key!="class"&&(a[key]=b[key]);return a};function nulls(val){return val!=null}return exports.attrs=function attrs(obj,escaped){var buf=[],terse=obj.terse;delete obj.terse;var keys=Object.keys(obj),len=keys.length;if(len){buf.push("");for(var i=0;i<len;++i){var key=keys[i],val=obj[key];"boolean"==typeof val||null==val?val&&(terse?buf.push(key):buf.push(key+'="'+key+'"')):0==key.indexOf("data")&&"string"!=typeof val?buf.push(key+"='"+JSON.stringify(val)+"'"):"class"==key&&Array.isArray(val)?buf.push(key+'="'+exports.escape(val.join(" "))+'"'):escaped&&escaped[key]?buf.push(key+'="'+exports.escape(val)+'"'):buf.push(key+'="'+val+'"')}}return buf.join(" ")},exports.escape=function escape(html){return String(html).replace(/&(?!(\w+|\#\d+);)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},exports.rethrow=function rethrow(err,filename,lineno){if(!filename)throw err;var context=3,str=require("fs").readFileSync(filename,"utf8"),lines=str.split("\n"),start=Math.max(lineno-context,0),end=Math.min(lines.length,lineno+context),context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?"  > ":"    ")+curr+"| "+line}).join("\n");throw err.path=filename,err.message=(filename||"Jade")+":"+lineno+"\n"+context+"\n\n"+err.message,err},exports}({});

// create our folder objects
exports.footer = {};
exports.header = {};
exports.tweet = {};
exports.user = {};
exports.tweet.includes = {};

// footer.jade compiled template
exports.footer.footer = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<div class="row"><h6 class="subheader">© MMIX – MMXIII Own Group, Inc. All rights reserved.</h6></div>');
    }
    return buf.join("");
};

// header.jade compiled template
exports.header.header = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<div class="contain-to-grid"><nav data-options="is_hover:true" class="top-bar">       <ul class="title-area"></ul><section class="top-bar-section"><!--<Left>Nav Section</Left>--><ul class="left"><li class="has-dropdown"><a href="#">Competitors</a><ul class="dropdown"><li class="divider hide-for-small"></li><li><a href="#">McDonalds</a></li><li class="divider"></li><li><a href="#">Edit Competitors</a></li></ul></li><li class="divider"></li><li><a href="/">Home</a></li><li class="divider"></li><li><a href="/explore">Explore</a></li><li class="divider"></li><li><a href="/activity">Activity</a></li><li class="divider">           </li></ul><!--<Right>Nav Section </Right>--><ul class="right"><li class="divider hide-for-small"></li><li class="has-form"><form><div class="row collapse"><div class="small-8 columns"><input type="text" placeholder="Search live..."/></div><div class="small-4 columns"><a href="#" class="alert button">Search </a></div></div></form></li><li class="divider"></li><li class="has-dropdown"><a href="#">Profile</a><ul class="dropdown"><li class="divider hide-for-small"></li><li><label>Your profile</label></li><li><a href="/users/">Edit Profile</a></li><li><a href="/logout">Logout</a></li></ul></li></ul></section></nav></div>');
    }
    return buf.join("");
};

// chart.jade compiled template
exports.tweet.chart = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<h4 id="chart-header">Pie chart</h4><h6 id="chart-subheader" class="subheader">Pie charts are great at comparing proportions within a single data set.</h6><div class="current-chart"><canvas id="tweet-chart"></canvas></div><div class="current-chart-legend"></div>');
    }
    return buf.join("");
};

// chartlegend.jade compiled template
exports.tweet.chartlegend = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push("<table><tbody>");
        (function() {
            var $$obj = chartData;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var dataPoint = $$obj[$index];
                    if (activeKeywords.indexOf(dataPoint.keyword) !== -1) {
                        buf.push("<tr><td><div" + jade.attrs({
                            style: "background-color:" + dataPoint.color + ";",
                            "class": "chartBox"
                        }, {
                            style: true
                        }) + "></div></td><td>" + jade.escape(null == (jade.interp = dataPoint.keyword) ? "" : jade.interp) + "</td><td>" + jade.escape(null == (jade.interp = dataPoint.value + " tweets") ? "" : jade.interp) + "</td><td>" + jade.escape(null == (jade.interp = dataPoint.percentage + "%") ? "" : jade.interp) + "</td></tr>");
                    }
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var dataPoint = $$obj[$index];
                        if (activeKeywords.indexOf(dataPoint.keyword) !== -1) {
                            buf.push("<tr><td><div" + jade.attrs({
                                style: "background-color:" + dataPoint.color + ";",
                                "class": "chartBox"
                            }, {
                                style: true
                            }) + "></div></td><td>" + jade.escape(null == (jade.interp = dataPoint.keyword) ? "" : jade.interp) + "</td><td>" + jade.escape(null == (jade.interp = dataPoint.value + " tweets") ? "" : jade.interp) + "</td><td>" + jade.escape(null == (jade.interp = dataPoint.percentage + "%") ? "" : jade.interp) + "</td></tr>");
                        }
                    }
                }
            }
        }).call(this);
        buf.push("</tbody></table>");
    }
    return buf.join("");
};

// header.jade compiled template
exports.tweet.header = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<div class="row"><p><div class="formatted-dates"><h2 class="subheader">' + jade.escape((jade.interp = formattedDates) == null ? "" : jade.interp) + '&emsp;     <span id="tweets-total" class="secondary label radius">' + jade.escape(null == (jade.interp = " " + tweetsCount()) ? "" : jade.interp) + "</span></h2></div></p></div>");
    }
    return buf.join("");
};

// headernav.jade compiled template
exports.tweet.headernav = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<div class="row"><dl class="sub-nav"><dt>Tracking keywords:</dt>');
        (function() {
            var $$obj = keywords;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var keyword = $$obj[$index];
                    buf.push("<dd" + jade.attrs({
                        "data-keyword": keyword,
                        "class": "active" + " " + "update-keyword"
                    }, {
                        "data-keyword": true
                    }) + '><a href="#" class="keyword-types">' + jade.escape(null == (jade.interp = keyword) ? "" : jade.interp) + "</a></dd>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var keyword = $$obj[$index];
                        buf.push("<dd" + jade.attrs({
                            "data-keyword": keyword,
                            "class": "active" + " " + "update-keyword"
                        }, {
                            "data-keyword": true
                        }) + '><a href="#" class="keyword-types">' + jade.escape(null == (jade.interp = keyword) ? "" : jade.interp) + "</a></dd>");
                    }
                }
            }
        }).call(this);
        buf.push('<dd><a>|</a></dd><dd data-chart="Pie" class="active"><a href="#" class="update-chart chart-types">Pie</a></dd><dd data-chart="Doughnut"><a href="#" class="update-chart chart-types">Doughnut</a></dd><dd data-chart="PolarArea"><a href="#" class="update-chart chart-types">PolarArea</a></dd><dd data-chart="Bar"><a href="#" class="update-chart chart-types">Bar</a></dd><dd data-chart="Line"><a href="#" class="update-chart chart-types">Line</a></dd><dd data-chart="Radar"><a href="#" class="update-chart chart-types">Radar</a></dd><dd><a>|</a></dd><dd><a href="#" data-reveal-id="date-modal">Date range</a></dd><dd class="active formatted-dates"><a href="#" data-reveal-id="remove-date-modal">' + jade.escape(null == (jade.interp = formattedDates) ? "" : jade.interp) + "</a></dd></dl></div>");
    }
    return buf.join("");
};

// _language.jade compiled template
exports.tweet.includes._language = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {}
    return buf.join("");
};

// _loading.jade compiled template
exports.tweet.includes._loading = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<div data-alert="data-alert" class="alert-box">Loading new data.<a href="#" class="close">&times;</a></div>');
    }
    return buf.join("");
};

// _source.jade compiled template
exports.tweet.includes._source = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {}
    return buf.join("");
};

// _tweet_list.jade compiled template
exports.tweet.includes._tweet_list = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        (function() {
            var $$obj = displayedTweets;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var tweet = $$obj[$index];
                    buf.push('<li class="tweet"> <div class="row"><div class="small-3 columns"><img' + jade.attrs({
                        src: tweet.user.profile_image_url
                    }, {
                        src: true
                    }) + '/></div><div class="small-8 columns"><h6><a' + jade.attrs({
                        href: "http://www.twitter.com/" + tweet.user.screen_name + "",
                        target: "_blank",
                        "class": "user-name"
                    }, {
                        href: true,
                        target: true
                    }) + ">" + jade.escape(null == (jade.interp = tweet.user.name) ? "" : jade.interp) + '</a><span> said: </span></h6><span class="text">' + jade.escape(null == (jade.interp = tweet.text) ? "" : jade.interp) + '</span></div><hr/><!-- <span class="keywords">Tracked by: ' + jade.escape((jade.interp = keywords) == null ? "" : jade.interp) + '</span><span class="lang">' + jade.escape(null == (jade.interp = lang) ? "" : jade.interp) + '</span><span class="source">' + jade.escape(null == (jade.interp = source) ? "" : jade.interp) + '</span><span class="user-friends-count">' + jade.escape(null == (jade.interp = user.friends_count + " Friends") ? "" : jade.interp) + "</span>--></div></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var tweet = $$obj[$index];
                        buf.push('<li class="tweet"> <div class="row"><div class="small-3 columns"><img' + jade.attrs({
                            src: tweet.user.profile_image_url
                        }, {
                            src: true
                        }) + '/></div><div class="small-8 columns"><h6><a' + jade.attrs({
                            href: "http://www.twitter.com/" + tweet.user.screen_name + "",
                            target: "_blank",
                            "class": "user-name"
                        }, {
                            href: true,
                            target: true
                        }) + ">" + jade.escape(null == (jade.interp = tweet.user.name) ? "" : jade.interp) + '</a><span> said: </span></h6><span class="text">' + jade.escape(null == (jade.interp = tweet.text) ? "" : jade.interp) + '</span></div><hr/><!-- <span class="keywords">Tracked by: ' + jade.escape((jade.interp = keywords) == null ? "" : jade.interp) + '</span><span class="lang">' + jade.escape(null == (jade.interp = lang) ? "" : jade.interp) + '</span><span class="source">' + jade.escape(null == (jade.interp = source) ? "" : jade.interp) + '</span><span class="user-friends-count">' + jade.escape(null == (jade.interp = user.friends_count + " Friends") ? "" : jade.interp) + "</span>--></div></li>");
                    }
                }
            }
        }).call(this);
    }
    return buf.join("");
};

// _tweets_empty.jade compiled template
exports.tweet.includes._tweets_empty = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<h2>No tweets found.</h2><h4 class="subheader">Try adding keywords or searching a different time range.</h4>');
    }
    return buf.join("");
};

// layout.jade compiled template
exports.tweet.layout = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<div id="tweetApp-header"></div><div id="tweetApp-loading"></div><div id="tweetApp-headerNav"></div><div class="row"><div id="tweetApp-sideNav" class="small-1 columns"></div><div id="tweetApp-list" class="small-7 columns"></div><div class="small-4 columns"><div data-section="tabs" class="section-container tabs"><section><p data-section-title="data-section-title" class="title"><a href="#panel1">Graph</a></p><div data-section-content="data-section-content" class="content"><div id="tweetApp-chart"></div><div id="tweetApp-chartLegend"></div></div></section><section><p data-section-title="data-section-title" class="title"><a href="#panel2">Map</a></p><div data-section-content="data-section-content" class="content"><div id="tweetApp-map"></div></div></section><section><p data-section-title="data-section-title" class="title"><a href="#panel2">Source</a></p><div data-section-content="data-section-content" class="content"><div id="tweetApp-source"></div></div></section></div></div></div><div class="row"><div id="tweetApp-footer"></div></div>');
    }
    return buf.join("");
};

// map.jade compiled template
exports.tweet.map = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<h4>Tweets by language</h4><h6 class="subheader">Sorted in descending order</h6><ul class="tweets"><table><thead><tr><th>Language</th><th>Count</th><th>Percentage</th></tr></thead><tbody> ');
        (function() {
            var $$obj = lang;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var val = $$obj[$index];
                    buf.push("<tr><td>" + jade.escape(null == (jade.interp = val[0]) ? "" : jade.interp) + "</td><td>" + jade.escape(null == (jade.interp = val[1]) ? "" : jade.interp) + '</td><!-- td= (Math.round((val[1]/tweets.length)*100)).toString() + "%"--></tr>');
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var val = $$obj[$index];
                        buf.push("<tr><td>" + jade.escape(null == (jade.interp = val[0]) ? "" : jade.interp) + "</td><td>" + jade.escape(null == (jade.interp = val[1]) ? "" : jade.interp) + '</td><!-- td= (Math.round((val[1]/tweets.length)*100)).toString() + "%"--></tr>');
                    }
                }
            }
        }).call(this);
        buf.push("</tbody></table></ul>");
    }
    return buf.join("");
};

// sidenav.jade compiled template
exports.tweet.sidenav = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<ul class="side-nav"><li class="active"><a href="#">List</a></li><li><a href="#">Intelligence</a></li></ul>');
    }
    return buf.join("");
};

// source.jade compiled template
exports.tweet.source = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<h4>Tweets by source</h4><h6 class="subheader">Sorted in descending order</h6><ul class="tweets"><table><thead><tr><th>Source</th><th>Count</th><th>Percentage</th></tr></thead><tbody>');
        (function() {
            var $$obj = source;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var val = $$obj[$index];
                    buf.push("<tr>");
                    if (val[0]) {
                        buf.push("<td> \n" + ((jade.interp = val[0].charAt(0).toUpperCase() + val[0].slice(1)) == null ? "" : jade.interp) + "</td>");
                    } else {
                        buf.push("<td></td>");
                    }
                    buf.push("<td>" + jade.escape(null == (jade.interp = val[1]) ? "" : jade.interp) + '</td><!-- td= (Math.round((val[1]/tweets.length)*100)).toString() + "%"--></tr>');
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var val = $$obj[$index];
                        buf.push("<tr>");
                        if (val[0]) {
                            buf.push("<td> \n" + ((jade.interp = val[0].charAt(0).toUpperCase() + val[0].slice(1)) == null ? "" : jade.interp) + "</td>");
                        } else {
                            buf.push("<td></td>");
                        }
                        buf.push("<td>" + jade.escape(null == (jade.interp = val[1]) ? "" : jade.interp) + '</td><!-- td= (Math.round((val[1]/tweets.length)*100)).toString() + "%"--></tr>');
                    }
                }
            }
        }).call(this);
        buf.push("</tbody></table></ul>");
    }
    return buf.join("");
};

// tweetlist.jade compiled template
exports.tweet.tweetlist = function anonymous(locals) {
    var buf = [];
    with (locals || {}) {
        buf.push('<h3 class="subheader">Individual tweets</h3><ul class="tweets tweets-list">');
        (function() {
            var $$obj = displayedTweets;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var tweet = $$obj[$index];
                    buf.push('<li class="tweet"> <div class="row"><div class="small-3 columns"><img' + jade.attrs({
                        src: tweet.user.profile_image_url
                    }, {
                        src: true
                    }) + '/></div><div class="small-8 columns"><h6><a' + jade.attrs({
                        href: "http://www.twitter.com/" + tweet.user.screen_name + "",
                        target: "_blank",
                        "class": "user-name"
                    }, {
                        href: true,
                        target: true
                    }) + ">" + jade.escape(null == (jade.interp = tweet.user.name) ? "" : jade.interp) + '</a><span> said: </span></h6><span class="text">' + jade.escape(null == (jade.interp = tweet.text) ? "" : jade.interp) + "</span></div><hr/></div></li>");
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    if ($$obj.hasOwnProperty($index)) {
                        var tweet = $$obj[$index];
                        buf.push('<li class="tweet"> <div class="row"><div class="small-3 columns"><img' + jade.attrs({
                            src: tweet.user.profile_image_url
                        }, {
                            src: true
                        }) + '/></div><div class="small-8 columns"><h6><a' + jade.attrs({
                            href: "http://www.twitter.com/" + tweet.user.screen_name + "",
                            target: "_blank",
                            "class": "user-name"
                        }, {
                            href: true,
                            target: true
                        }) + ">" + jade.escape(null == (jade.interp = tweet.user.name) ? "" : jade.interp) + '</a><span> said: </span></h6><span class="text">' + jade.escape(null == (jade.interp = tweet.text) ? "" : jade.interp) + "</span></div><hr/></div></li>");
                    }
                }
            }
        }).call(this);
        buf.push("</ul>");
    }
    return buf.join("");
};


// attach to window or export with commonJS
if (typeof module !== "undefined") {
    module.exports = exports;
} else if (typeof define === "function" && define.amd) {
    define(exports);
} else {
    root.templatizer = exports;
}

})();