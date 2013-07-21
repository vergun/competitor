// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Competitor.module("TweetApp.Index", function(Index, App, backbone, Marionette, $, _) {
    /* Layout*/

    var _ref, _ref1, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    Index.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        _ref = Layout.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Layout.prototype.template = templatizer.tweet.layout;

      Layout.prototype.regions = {
        headerRegion: "#tweetApp-header",
        loadingRegion: "#tweetApp-loading",
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
    Index.Loading = (function(_super) {
      __extends(Loading, _super);

      function Loading() {
        _ref2 = Loading.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      Loading.prototype.template = templatizer.tweet.includes._loading;

      Loading.prototype.className = "row";

      return Loading;

    })(App.Views.ItemView);
    Index.HeaderNav = (function(_super) {
      __extends(HeaderNav, _super);

      function HeaderNav() {
        _ref3 = HeaderNav.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      HeaderNav.prototype.template = templatizer.tweet.headernav;

      HeaderNav.prototype.events = {
        "click .update-chart": "charts",
        "click .update-keyword": "keywords",
        "click #submit-date-range": "submitDateRange"
      };

      HeaderNav.prototype.ui = {
        type: ".chart-types",
        keywords: ".update-keyword",
        closeModal: ".close-reveal-modal",
        from: "#from",
        to: "#to"
      };

      HeaderNav.prototype.onShow = function() {
        return this.datepicker();
      };

      HeaderNav.prototype.maxDate = function() {
        return new Date();
      };

      HeaderNav.prototype.charts = function(e) {
        this.ui.type.each(function() {
          return $(this).parent().removeClass('active');
        });
        $(e.currentTarget).parent().addClass('active');
        return this.updateChart();
      };

      HeaderNav.prototype.updateChart = function() {
        var options;
        options = {
          type: this.ui.type.parent('.active').data('chart')
        };
        return this.trigger("update:chart", options);
      };

      HeaderNav.prototype.keywords = function(e) {
        e = $(e.currentTarget);
        e.toggleClass('active');
        return this.dispatchKeywords();
      };

      HeaderNav.prototype.dispatchKeywords = function() {
        var data;
        data = _.map(this.ui.keywords.filter('.active'), function(el) {
          return $(el).data('keyword');
        });
        return this.trigger("update:keywords", {
          data: data
        });
      };

      HeaderNav.prototype.datepicker = function() {
        var _this = this;
        this.ui.from.datepicker({
          dateFormat: "yy-mm-dd",
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1,
          maxDate: this.maxDate(),
          onClose: function(selectedDate) {
            return _this.ui.to.datepicker("option", "minDate", selectedDate);
          }
        });
        return this.ui.to.datepicker({
          dateFormat: "yy-mm-dd",
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1,
          maxDate: this.maxDate(),
          onClose: function(selectedDate) {
            return _this.ui.from.datepicker("option", "maxDate", selectedDate);
          }
        });
      };

      HeaderNav.prototype.submitDateRange = function() {
        this.setDates();
        App.vent.trigger("show:loading");
        App.vent.trigger("update:tweets", {
          chart: this.model.get("chart"),
          dates: this.model.get("dates"),
          keywords: this.model.get("keywords").join(";")
        });
        return this.ui.closeModal.click();
      };

      HeaderNav.prototype.setDates = function() {
        var dates;
        dates = this.ui.from.val() + "." + this.ui.to.val();
        if (dates.length <= 1) {
          dates = "";
        }
        return this.model.set("dates", dates);
      };

      return HeaderNav;

    })(App.Views.ItemView);
    /* left*/

    Index.LeftNav = (function(_super) {
      __extends(LeftNav, _super);

      function LeftNav() {
        _ref4 = LeftNav.__super__.constructor.apply(this, arguments);
        return _ref4;
      }

      LeftNav.prototype.template = templatizer.tweet.sidenav;

      LeftNav.prototype.events = {
        'click .side-nav a': 'switchApps'
      };

      LeftNav.prototype.switchApps = function(e) {
        e = $(e.currentTarget);
        if (!e.parent().hasClass(' c')) {
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
      __extends(TweetList, _super);

      function TweetList() {
        _ref5 = TweetList.__super__.constructor.apply(this, arguments);
        return _ref5;
      }

      TweetList.prototype.template = templatizer.tweet.tweetlist;

      TweetList.prototype.ui = {
        updateChart: ".update-chart",
        updateKeyword: ".update-keyword",
        submitDateRange: "#submit-date-range"
      };

      return TweetList;

    })(App.Views.ItemView);
    /* main graph area*/

    Index.Right = (function(_super) {
      __extends(Right, _super);

      function Right() {
        _ref6 = Right.__super__.constructor.apply(this, arguments);
        return _ref6;
      }

      Right.prototype.template = templatizer.tweet.right;

      return Right;

    })(App.Views.ItemView);
    Index.Chart = (function(_super) {
      __extends(Chart, _super);

      function Chart() {
        _ref7 = Chart.__super__.constructor.apply(this, arguments);
        return _ref7;
      }

      Chart.prototype.template = templatizer.tweet.chart;

      Chart.prototype.ui = {
        type: '.update-chart',
        context: '#tweet-chart'
      };

      Chart.prototype.onShow = function() {
        return this.addOrUpdateChart();
      };

      Chart.prototype.addOrUpdateChart = function(options) {
        var data;
        if (options == null) {
          options = {};
        }
        data = this.filterChart(this.model);
        data = this.filterKeywords(data, this.model.get('activeKeywords'));
        $.extend(options, {
          data: data,
          chart: this.model.get('chart')
        });
        return this.showChart(this.ui.context.get(0).getContext('2d'), options.data, options.chart);
      };

      Chart.prototype.filterChart = function(model, chart) {
        var data;
        data = this.easyChart() ? model.get('chartData') : model.get('complex');
        return data;
      };

      Chart.prototype.filterKeywords = function(data, activeKeywords) {
        var tempdata;
        tempdata = this.getTempData(data, activeKeywords);
        if (this.easyChart()) {
          data = tempdata;
        } else {
          data.datasets = tempdata;
        }
        return data;
      };

      Chart.prototype.getTempData = function(data, activeKeywords) {
        var tempdata;
        tempdata = this.easyChart() ? data : data.datasets;
        tempdata = _.compact(_.map(tempdata, function(set) {
          if (_.indexOf(activeKeywords, set.keyword) !== -1) {
            return set;
          }
        }));
        return tempdata;
      };

      Chart.prototype.easyChart = function() {
        var result;
        result = (_.indexOf(["Bar", "Line", "Radar"], this.model.get('chart'))) === -1 ? true : false;
        return result;
      };

      Chart.prototype.showChart = function(context, data, chart, options) {
        if (options == null) {
          options = {};
        }
        $.extend(options, {
          animation: true
        });
        return new window.Chart(context)[chart](data, options);
      };

      return Chart;

    })(App.Views.ItemView);
    Index.ChartLegend = (function(_super) {
      __extends(ChartLegend, _super);

      function ChartLegend() {
        _ref8 = ChartLegend.__super__.constructor.apply(this, arguments);
        return _ref8;
      }

      ChartLegend.prototype.template = templatizer.tweet.chartlegend;

      return ChartLegend;

    })(App.Views.ItemView);
    Index.Map = (function(_super) {
      __extends(Map, _super);

      function Map() {
        _ref9 = Map.__super__.constructor.apply(this, arguments);
        return _ref9;
      }

      Map.prototype.template = templatizer.tweet.map;

      return Map;

    })(App.Views.ItemView);
    return Index.Source = (function(_super) {
      __extends(Source, _super);

      function Source() {
        _ref10 = Source.__super__.constructor.apply(this, arguments);
        return _ref10;
      }

      Source.prototype.template = templatizer.tweet.source;

      return Source;

    })(App.Views.ItemView);
  });

}).call(this);
