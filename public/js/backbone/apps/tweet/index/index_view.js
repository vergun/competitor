// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Competitor.module("TweetApp.Index", function(Index, App, backbone, Marionette, $, _) {
    /* Layout*/

    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    Index.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        _ref = Layout.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Layout.prototype.template = templatizer.tweet.layout;

      Layout.prototype.regions = {
        headerRegion: "#tweetApp-header",
        headerNavRegion: "#tweetApp-headerNav",
        sideNavRegion: "#tweetApp-sideNav",
        tweestListRegion: "#tweetApp-list",
        chartRegion: "#tweetApp-chart",
        chartLegendRegion: "#tweetApp-chartLegend",
        mapRegion: "#tweetApp-map",
        sourceRegion: "#tweetApp-source",
        footerRegion: "#tweetApp-footer"
      };

      return Layout;

    })(App.Views.Layout);
    /* Header*/

    Index.Header = (function(_super) {
      __extends(Header, _super);

      function Header() {
        _ref1 = Header.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Header.prototype.template = templatizer.tweet.header;

      Header.prototype.ui = {
        tweetsTotal: "#tweets-total"
      };

      Header.prototype.templateHelpers = {
        tweetsCount: function() {
          var data, total;
          total = 0;
          if (this.chart === "Bar" || this.chart === "Line" || this.chart === "Radar") {
            data = this.chartData.datasets;
          } else {
            data = this.chartData;
          }
          $.each(data, function(index, element) {
            return total = total + element.value;
          });
          return " " + total + " Tweets";
        }
      };

      Header.prototype.modelEvents = {
        "change": "render"
      };

      return Header;

    })(App.Views.ItemView);
    Index.HeaderNav = (function(_super) {
      __extends(HeaderNav, _super);

      function HeaderNav() {
        _ref2 = HeaderNav.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      HeaderNav.prototype.template = templatizer.tweet.headernav;

      HeaderNav.prototype.events = {
        "click .update-chart": "charts",
        "click .update-keyword": "keywords"
      };

      HeaderNav.prototype.ui = {
        chartTypes: ".chart-types"
      };

      HeaderNav.prototype.charts = function(e) {
        this.ui.chartTypes.each(function() {
          return $(this).parent().removeClass('active');
        });
        return $(e.currentTarget).parent().addClass('active');
      };

      HeaderNav.prototype.keywords = function(e) {
        e = $(e.currentTarget);
        return e.toggleClass('active');
      };

      HeaderNav.prototype.updateCharts = function(e) {
        var chart, model;
        chart = $('.chart-types').parent('.active').data('chart');
        model = this.model;
        return App.vent.trigger("update:charts", chart, model);
      };

      return HeaderNav;

    })(App.Views.ItemView);
    /* left*/

    Index.LeftNav = (function(_super) {
      __extends(LeftNav, _super);

      function LeftNav() {
        _ref3 = LeftNav.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      LeftNav.prototype.template = templatizer.tweet.sidenav;

      LeftNav.prototype.events = {
        'click .side-nav a': 'switchApps'
      };

      LeftNav.prototype.switchApps = function(e) {
        e = $(e.currentTarget);
        if (!e.parent().hasClass('active')) {
          $.each(e.parent().parent().children(), function(i, el) {
            return $(el).removeClass('active');
          });
          return e.parent().addClass('active');
        }
      };

      return LeftNav;

    })(App.Views.ItemView);
    /* tweet list*/

    Index.TweetList = (function(_super) {
      var _this = this;

      __extends(TweetList, _super);

      function TweetList() {
        _ref4 = TweetList.__super__.constructor.apply(this, arguments);
        return _ref4;
      }

      TweetList.prototype.template = templatizer.tweet.tweetlist;

      TweetList.prototype.ui = {
        chart: "#myChart",
        updateChart: ".update-chart",
        updateKeyword: ".update-keyword",
        submitDateRange: "#submit-date-range"
      };

      TweetList.prototype.onRender = function() {};

      TweetList.prototype.addOrUpdateChart = function(chart, model, view) {
        var ctx, data;
        chart = typeof chart !== "undefined" ? chart : this.model.get('chart');
        data = typeof model !== "undefined" ? model.get('chartData') : this.model.get('chartData');
        data = chart === "Bar" || chart === "Line" || chart === "Radar" ? data.datasets : data;
        console.log(this.ui.chart);
        ctx = this.ui.chart.get(0).getContext('2d');
        return new window.Chart(ctx)[chart](data, {
          animation: true
        });
      };

      App.vent.on("update:charts", function(chart, model) {
        return TweetList.prototype.addOrUpdateChart(chart, model);
      });

      return TweetList;

    }).call(this, App.Views.ItemView);
    /* main graph area*/

    Index.Right = (function(_super) {
      __extends(Right, _super);

      function Right() {
        _ref5 = Right.__super__.constructor.apply(this, arguments);
        return _ref5;
      }

      Right.prototype.template = templatizer.tweet.right;

      return Right;

    })(App.Views.ItemView);
    Index.Chart = (function(_super) {
      __extends(Chart, _super);

      function Chart() {
        _ref6 = Chart.__super__.constructor.apply(this, arguments);
        return _ref6;
      }

      Chart.prototype.template = templatizer.tweet.chart;

      return Chart;

    })(App.Views.ItemView);
    Index.ChartLegend = (function(_super) {
      __extends(ChartLegend, _super);

      function ChartLegend() {
        _ref7 = ChartLegend.__super__.constructor.apply(this, arguments);
        return _ref7;
      }

      ChartLegend.prototype.template = templatizer.tweet.chartlegend;

      return ChartLegend;

    })(App.Views.ItemView);
    Index.Map = (function(_super) {
      __extends(Map, _super);

      function Map() {
        _ref8 = Map.__super__.constructor.apply(this, arguments);
        return _ref8;
      }

      Map.prototype.template = templatizer.tweet.map;

      return Map;

    })(App.Views.ItemView);
    return Index.Source = (function(_super) {
      __extends(Source, _super);

      function Source() {
        _ref9 = Source.__super__.constructor.apply(this, arguments);
        return _ref9;
      }

      Source.prototype.template = templatizer.tweet.source;

      return Source;

    })(App.Views.ItemView);
  });

}).call(this);
