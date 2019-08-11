(function() {
  var fTimescale;
  var time;
  var index;
  var statsTemplate;
  var a32;
  var duration;
  var children;
  var rtagName;
  var l0;
  var d;
  var scale;
  var TextBoxObserver;
  var config;
  var c;
  var uHostName;
  var property;
  var g;
  var addClass;
  var create;
  var complete;
  var now;
  var removeClass;
  var synchronize;
  var round;
  var style;
  var callback;
  var f;
  var onComplete;
  var F;
  var _onreadystatechange;
  var root;
  var t;
  /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
  var __slice = [].slice;

  /** @type {string} */
  g = '<span class="odometer-value"></span>';
  /** @type {string} */
  c = '<span class="odometer-ribbon"><span class="odometer-ribbon-inner">' + g + "</span></span>";
  /** @type {string} */
  statsTemplate = '<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">' + c + "</span></span>";
  /** @type {string} */
  children = '<span class="odometer-formatting-mark"></span>';
  /** @type {string} */
  index = "(,ddd).dd";
  /** @type {RegExp} */
  rtagName = /^\(?([^)]*)\)?(?:(.)(d+))?$/;
  /** @type {number} */
  l0 = 30;
  /** @type {number} */
  duration = 2E3;
  /** @type {number} */
  fTimescale = 20;
  /** @type {number} */
  d = 2;
  /** @type {number} */
  a32 = 0.5;
  /** @type {number} */
  scale = 1E3 / l0;
  /** @type {number} */
  time = 1E3 / fTimescale;
  /** @type {string} */
  uHostName = "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd";
  /** @type {(CSSStyleDeclaration|null)} */
  style = document.createElement("div").style;
  /** @type {boolean} */
  property = null != style.transition || (null != style.webkitTransition || (null != style.mozTransition || null != style.oTransition));
  /** @type {function (this:Window, function (number): ?, (Element|null)=): number} */
  synchronize = window.requestAnimationFrame || (window.mozRequestAnimationFrame || (window.webkitRequestAnimationFrame || window.msRequestAnimationFrame));
  TextBoxObserver = window.MutationObserver || (window.WebKitMutationObserver || window.MozMutationObserver);
  /**
   * @param {string} html
   * @return {?}
   */

  create = function(html) {
    var container;
    return container = document.createElement("div"), container.innerHTML = html, container.children[0];
  };
  /**
   * @param {Element} el
   * @param {string} className
   * @return {?}
   */
  removeClass = function(el, className) {
    return el.className = el.className.replace(new RegExp("(^| )" + className.split(" ").join("|") + "( |$)", "gi"), " ");
  };
  /**
   * @param {Element} el
   * @param {string} className
   * @return {?}
   */
  addClass = function(el, className) {
    return removeClass(el, className), el.className += " " + className;
  };
  /**
   * @param {EventTarget} element
   * @param {string} name
   * @return {?}
   */
  callback = function(element, name) {
    var oEvent;
    return null != document.createEvent ? (oEvent = document.createEvent("HTMLEvents"), oEvent.initEvent(name, true, true), element.dispatchEvent(oEvent)) : void 0;
  };
  /**
   * @return {?}
   */
  now = function() {
    var t;
    var getNow;
    return null != (t = null != (getNow = window.performance) && "function" == typeof getNow.now ? getNow.now() : void 0) ? t : +new Date;
  };
  /**
   * @param {number} t
   * @param {boolean} decimals
   * @return {?}
   */
  round = function(t, decimals) {
    return null == decimals && (decimals = 0), decimals ? (t *= Math.pow(10, decimals), t += 0.5, t = Math.floor(t), t /= Math.pow(10, decimals)) : Math.round(t);
  };
  /**
   * @param {number} from
   * @return {?}
   */
  f = function(from) {
    return 0 > from ? Math.ceil(from) : Math.floor(from);
  };
  /**
   * @param {number} v
   * @return {?}
   */
  complete = function(v) {
    return v - round(v);
  };
  /** @type {boolean} */
  F = false;
  (onComplete = function() {
    var paths;
    var i;
    var len;
    var rawParams;
    var rulesets;
    if (!F && null != window.jQuery) {
      /** @type {boolean} */
      F = true;
      /** @type {Array} */
      rawParams = ["html", "text"];
      /** @type {Array} */
      rulesets = [];
      /** @type {number} */
      i = 0;
      /** @type {number} */
      len = rawParams.length;
      for (;len > i;i++) {
        paths = rawParams[i];
        rulesets.push(function(name) {
          var matcherFunction;
          return matcherFunction = window.jQuery.fn[name], window.jQuery.fn[name] = function(dataAndEvents) {
            var sample;
            return null == dataAndEvents || null == (null != (sample = this[0]) ? sample.odometer : void 0) ? matcherFunction.apply(this, arguments) : this[0].odometer.update(dataAndEvents);
          };
        }(paths));
      }
      return rulesets;
    }
  })();
  setTimeout(onComplete, 0);
  config = function() {
    /**
     * @param {Object} options
     * @return {?}
     */
    function o(options) {
      var bulk;
      var key;
      var query;
      var value;
      var opts;
      var last;
      var offset;
      var _ref1;
      var name;
      var data;
      var parent = this;
      if (this.options = options, this.el = this.options.el, null != this.el.odometer) {
        return this.el.odometer;
      }
      this.el.odometer = this;
      _ref1 = o.options;
      for (key in _ref1) {
        value = _ref1[key];
        if (null == this.options[key]) {
          this.options[key] = value;
        }
      }
      if (null == (opts = this.options).duration) {
        opts.duration = duration;
      }
      /** @type {number} */
      this.MAX_VALUES = this.options.duration / scale / d | 0;
      this.resetFormat();
      this.value = this.cleanValue(null != (name = this.options.value) ? name : "");
      this.renderInside();
      this.render();
      try {
        /** @type {Array} */
        data = ["innerHTML", "innerText", "textContent"];
        /** @type {number} */
        last = 0;
        /** @type {number} */
        offset = data.length;
        for (;offset > last;last++) {
          query = data[last];
          if (null != this.el[query]) {
            !function(chain) {
              return Object.defineProperty(parent.el, chain, {
                /**
                 * @return {?}
                 */
                get : function() {
                  var tagName;
                  return "innerHTML" === chain ? parent.inside.outerHTML : null != (tagName = parent.inside.innerText) ? tagName : parent.inside.textContent;
                },
                /**
                 * @param {boolean} node
                 * @return {?}
                 */
                set : function(node) {
                  return parent.update(node);
                }
              });
            }(query);
          }
        }
      } catch (fn) {
        bulk = fn;
        this.watchForMutations();
      }
    }
    return o.prototype.renderInside = function() {
      return this.inside = document.createElement("div"), this.inside.className = "odometer-inside", this.el.innerHTML = "", this.el.appendChild(this.inside);
    }, o.prototype.watchForMutations = function() {
      var bulk;
      var that = this;
      if (null != TextBoxObserver) {
        try {
          return null == this.observer && (this.observer = new TextBoxObserver(function(dataAndEvents) {
            var node;
            return node = that.el.innerText, that.renderInside(), that.render(that.value), that.update(node);
          })), this.watchMutations = true, this.startWatchingMutations();
        } catch (fn) {
          bulk = fn;
        }
      }
    }, o.prototype.startWatchingMutations = function() {
      return this.watchMutations ? this.observer.observe(this.el, {
        childList : true
      }) : void 0;
    }, o.prototype.stopWatchingMutations = function() {
      var connect;
      return null != (connect = this.observer) ? connect.disconnect() : void 0;
    }, o.prototype.cleanValue = function(arg) {
      var text;
      return "string" == typeof arg && (arg = arg.replace(null != (text = this.format.radix) ? text : ".", "<radix>"), arg = arg.replace(/[.,]/g, ""), arg = arg.replace("<radix>", "."), arg = parseFloat(arg, 10) || 0), round(arg, this.format.precision);
    }, o.prototype.bindTransitionEnd = function() {
      var key;
      var e;
      var j;
      var len;
      var keys;
      var buffer;
      var view = this;
      if (!this.transitionEndBound) {
        /** @type {boolean} */
        this.transitionEndBound = true;
        /** @type {boolean} */
        e = false;
        keys = uHostName.split(" ");
        /** @type {Array} */
        buffer = [];
        /** @type {number} */
        j = 0;
        len = keys.length;
        for (;len > j;j++) {
          key = keys[j];
          buffer.push(this.el.addEventListener(key, function() {
            return e ? true : (e = true, setTimeout(function() {
              return view.render(), e = false, callback(view.el, "odometerdone");
            }, 0), true);
          }, false));
        }
        return buffer;
      }
    }, o.prototype.resetFormat = function() {
      var value;
      var opacity;
      var temp;
      var precision;
      var property;
      var val;
      var _ref1;
      var properties;
      if (value = null != (_ref1 = this.options.format) ? _ref1 : index, value || (value = "d"), temp = rtagName.exec(value), !temp) {
        throw new Error("Odometer: Unparsable digit format");
      }
      return properties = temp.slice(1, 4), val = properties[0], property = properties[1], opacity = properties[2], precision = (null != opacity ? opacity.length : void 0) || 0, this.format = {
        repeating : val,
        radix : property,
        precision : precision
      };
    }, o.prototype.render = function(elt) {
      var rawParams;
      var cssText;
      var tree;
      var headers;
      var value;
      var i;
      var len;
      if (null == elt) {
        elt = this.value;
      }
      this.stopWatchingMutations();
      this.resetFormat();
      /** @type {string} */
      this.inside.innerHTML = "";
      value = this.options.theme;
      rawParams = this.el.className.split(" ");
      /** @type {Array} */
      headers = [];
      /** @type {number} */
      i = 0;
      len = rawParams.length;
      for (;len > i;i++) {
        cssText = rawParams[i];
        if (cssText.length) {
          if (tree = /^odometer-theme-(.+)$/.exec(cssText)) {
            /** @type {string} */
            value = tree[1];
          } else {
            if (!/^odometer(-|$)/.test(cssText)) {
              headers.push(cssText);
            }
          }
        }
      }
      return headers.push("odometer"), property || headers.push("odometer-no-transitions"), value ? headers.push("odometer-theme-" + value) : headers.push("odometer-auto-theme"), this.el.className = headers.join(" "), this.ribbons = {}, this.formatDigits(elt), this.startWatchingMutations();
    }, o.prototype.formatDigits = function(err) {
      var node;
      var css;
      var s;
      var oldconfig;
      var view;
      var path;
      var valsLength;
      var _len;
      var heights;
      var scripts;
      if (this.digits = [], this.options.formatFunction) {
        s = this.options.formatFunction(err);
        heights = s.split("").reverse();
        /** @type {number} */
        view = 0;
        valsLength = heights.length;
        for (;valsLength > view;view++) {
          css = heights[view];
          if (css.match(/0-9/)) {
            node = this.renderDigit();
            node.querySelector(".odometer-value").innerHTML = css;
            this.digits.push(node);
            this.insertDigit(node);
          } else {
            this.addSpacer(css);
          }
        }
      } else {
        /** @type {boolean} */
        oldconfig = !this.format.precision || (!complete(err) || false);
        scripts = err.toString().split("").reverse();
        /** @type {number} */
        path = 0;
        _len = scripts.length;
        for (;_len > path;path++) {
          node = scripts[path];
          if ("." === node) {
            /** @type {boolean} */
            oldconfig = true;
          }
          this.addDigit(node, oldconfig);
        }
      }
    }, o.prototype.update = function(dataAndEvents) {
      var delta;
      var self = this;
      return dataAndEvents = this.cleanValue(dataAndEvents), (delta = dataAndEvents - this.value) ? (removeClass(this.el, "odometer-animating-up odometer-animating-down odometer-animating"), delta > 0 ? addClass(this.el, "odometer-animating-up") : addClass(this.el, "odometer-animating-down"), this.stopWatchingMutations(), this.animate(dataAndEvents), this.startWatchingMutations(), setTimeout(function() {
        return self.el.offsetHeight, addClass(self.el, "odometer-animating");
      }, 0), this.value = dataAndEvents) : void 0;
    }, o.prototype.renderDigit = function() {
      return create(statsTemplate);
    }, o.prototype.insertDigit = function(context, recurring) {
      return null != recurring ? this.inside.insertBefore(context, recurring) : this.inside.children.length ? this.inside.insertBefore(context, this.inside.children[0]) : this.inside.appendChild(context);
    }, o.prototype.addSpacer = function(html, recurring, className) {
      var node;
      return node = create(children), node.innerHTML = html, className && addClass(node, className), this.insertDigit(node, recurring);
    }, o.prototype.addDigit = function(n, b) {
      var statsTemplate;
      var fragment;
      var o;
      var addSpacer;
      if (null == b && (b = true), "-" === n) {
        return this.addSpacer(n, null, "odometer-negation-mark");
      }
      if ("." === n) {
        return this.addSpacer(null != (addSpacer = this.format.radix) ? addSpacer : ".", null, "odometer-radix-mark");
      }
      if (b) {
        /** @type {boolean} */
        o = false;
        for (;;) {
          if (!this.format.repeating.length) {
            if (o) {
              throw new Error("Bad odometer format without digits");
            }
            this.resetFormat();
            /** @type {boolean} */
            o = true;
          }
          if (statsTemplate = this.format.repeating[this.format.repeating.length - 1], this.format.repeating = this.format.repeating.substring(0, this.format.repeating.length - 1), "d" === statsTemplate) {
            break;
          }
          this.addSpacer(statsTemplate);
        }
      }
      return fragment = this.renderDigit(), fragment.querySelector(".odometer-value").innerHTML = n, this.digits.push(fragment), this.insertDigit(fragment);
    }, o.prototype.animate = function(prop) {
      return property && "count" !== this.options.animation ? this.animateSlide(prop) : this.animateCount(prop);
    }, o.prototype.animateCount = function(args) {
      var val;
      var t;
      var last;
      var stamp;
      var run;
      var _this = this;
      if (t = +args - this.value) {
        return stamp = last = now(), val = this.value, (run = function() {
          var elapsed;
          var ty;
          var ticSpacing;
          return now() - stamp > _this.options.duration ? (_this.value = args, _this.render(), void callback(_this.el, "odometerdone")) : (elapsed = now() - last, elapsed > time && (last = now(), ticSpacing = elapsed / _this.options.duration, ty = t * ticSpacing, val += ty, _this.render(Math.round(val))), null != synchronize ? synchronize(run) : setTimeout(run, time));
        })();
      }
    }, o.prototype.getDigitCount = function() {
      var i;
      var r;
      var value;
      var args;
      var _i;
      var _len;
      /** @type {Array.<?>} */
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      /** @type {number} */
      i = _i = 0;
      /** @type {number} */
      _len = args.length;
      for (;_len > _i;i = ++_i) {
        value = args[i];
        /** @type {number} */
        args[i] = Math.abs(value);
      }
      return r = Math.max.apply(Math, args), Math.ceil(Math.log(r + 1) / Math.log(10));
    }, o.prototype.getFractionalDigitCount = function() {
      var key;
      var args;
      var codeSegments;
      var val;
      var properties;
      var _i;
      var _len2;
      /** @type {Array.<?>} */
      properties = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      /** @type {RegExp} */
      args = /^\-?\d*\.(\d*?)0*$/;
      /** @type {number} */
      key = _i = 0;
      /** @type {number} */
      _len2 = properties.length;
      for (;_len2 > _i;key = ++_i) {
        val = properties[key];
        properties[key] = val.toString();
        /** @type {(Array.<string>|null)} */
        codeSegments = args.exec(properties[key]);
        if (null == codeSegments) {
          /** @type {number} */
          properties[key] = 0;
        } else {
          /** @type {number} */
          properties[key] = codeSegments[1].length;
        }
      }
      return Math.max.apply(Math, properties);
    }, o.prototype.resetDigits = function() {
      return this.digits = [], this.ribbons = [], this.inside.innerHTML = "", this.resetFormat();
    }, o.prototype.animateSlide = function(k) {
      var a11;
      var val;
      var kCurr;
      var y;
      var matched;
      var oDelta;
      var cur;
      var v;
      var p;
      var path;
      var i;
      var real;
      var j;
      var testNode;
      var el;
      var value;
      var prev;
      var prevSources;
      var x;
      var _i;
      var _j;
      var plen;
      var ln;
      var _len;
      var _k;
      var styleSheets;
      var assigns;
      if (value = this.value, v = this.getFractionalDigitCount(value, k), v && (k *= Math.pow(10, v), value *= Math.pow(10, v)), kCurr = k - value) {
        this.bindTransitionEnd();
        y = this.getDigitCount(value, k);
        /** @type {Array} */
        matched = [];
        /** @type {number} */
        a11 = 0;
        /** @type {number} */
        i = x = 0;
        for (;y >= 0 ? y > x : x > y;i = y >= 0 ? ++x : --x) {
          if (prev = f(value / Math.pow(10, y - i - 1)), cur = f(k / Math.pow(10, y - i - 1)), oDelta = cur - prev, Math.abs(oDelta) > this.MAX_VALUES) {
            /** @type {Array} */
            path = [];
            /** @type {number} */
            real = oDelta / (this.MAX_VALUES + this.MAX_VALUES * a11 * a32);
            val = prev;
            for (;oDelta > 0 && cur > val || 0 > oDelta && val > cur;) {
              path.push(Math.round(val));
              val += real;
            }
            if (path[path.length - 1] !== cur) {
              path.push(cur);
            }
            a11++;
          } else {
            path = function() {
              /** @type {Array} */
              assigns = [];
              var vvar = prev;
              for (;cur >= prev ? cur >= vvar : vvar >= cur;cur >= prev ? vvar++ : vvar--) {
                assigns.push(vvar);
              }
              return assigns;
            }.apply(this);
          }
          /** @type {number} */
          i = _i = 0;
          plen = path.length;
          for (;plen > _i;i = ++_i) {
            p = path[i];
            /** @type {number} */
            path[i] = Math.abs(p % 10);
          }
          matched.push(path);
        }
        this.resetDigits();
        styleSheets = matched.reverse();
        /** @type {number} */
        i = _j = 0;
        ln = styleSheets.length;
        for (;ln > _j;i = ++_j) {
          path = styleSheets[i];
          if (!this.digits[i]) {
            this.addDigit(" ", i >= v);
          }
          if (null == (prevSources = this.ribbons)[i]) {
            prevSources[i] = this.digits[i].querySelector(".odometer-ribbon-inner");
          }
          /** @type {string} */
          this.ribbons[i].innerHTML = "";
          if (0 > kCurr) {
            path = path.reverse();
          }
          /** @type {number} */
          j = _k = 0;
          _len = path.length;
          for (;_len > _k;j = ++_k) {
            p = path[j];
            /** @type {Element} */
            el = document.createElement("div");
            /** @type {string} */
            el.className = "odometer-value";
            el.innerHTML = p;
            this.ribbons[i].appendChild(el);
            if (j === path.length - 1) {
              addClass(el, "odometer-last-value");
            }
            if (0 === j) {
              addClass(el, "odometer-first-value");
            }
          }
        }
        return 0 > prev && this.addDigit("-"), testNode = this.inside.querySelector(".odometer-radix-mark"), null != testNode && testNode.parent.removeChild(testNode), v ? this.addSpacer(this.format.radix, this.digits[v - 1], "odometer-radix-mark") : void 0;
      }
    }, o;
  }();
  config.options = null != (root = window.odometerOptions) ? root : {};
  setTimeout(function() {
    var key;
    var value;
    var attrs;
    var _ref1;
    var eventPath;
    if (window.odometerOptions) {
      _ref1 = window.odometerOptions;
      /** @type {Array} */
      eventPath = [];
      for (key in _ref1) {
        value = _ref1[key];
        eventPath.push(null != (attrs = config.options)[key] ? (attrs = config.options)[key] : attrs[key] = value);
      }
      return eventPath;
    }
  }, 0);
  /**
   * @return {?}
   */
  config.init = function() {
    var element;
    var elements;
    var i;
    var _len;
    var ret;
    var _results;
    if (null != document.querySelectorAll) {
      /** @type {NodeList} */
      elements = document.querySelectorAll(config.options.selector || ".odometer");
      /** @type {Array} */
      _results = [];
      /** @type {number} */
      i = 0;
      /** @type {number} */
      _len = elements.length;
      for (;_len > i;i++) {
        element = elements[i];
        _results.push(element.odometer = new config({
          el : element,
          value : null != (ret = element.innerText) ? ret : element.textContent
        }));
      }
      return _results;
    }
  };
  if (null != (null != (t = document.documentElement) ? t.doScroll : void 0) && null != document.createEventObject) {
    /** @type {function (): ?} */
    _onreadystatechange = document.onreadystatechange;
    /**
     * @return {?}
     */
    document.onreadystatechange = function() {
      return "complete" === document.readyState && (config.options.auto !== false && config.init()), null != _onreadystatechange ? _onreadystatechange.apply(this, arguments) : void 0;
    };
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      return config.options.auto !== false ? config.init() : void 0;
    }, false);
  }
  if ("function" == typeof define && define.amd) {
    define(["jquery"], function() {
      return config;
    });
  } else {
    if ("undefined" != typeof exports && null !== exports) {
      module.exports = config;
    } else {
      window.Odometer = config;
    }
  }
}).call(this);
!function(dataAndEvents, definition) {
  if ("function" == typeof define && define.amd) {
    define(definition);
  } else {
    if ("object" == typeof exports) {
      module.exports = definition();
    } else {
      dataAndEvents.ScrollMagic = definition();
    }
  }
}(this, function() {
  /**
   * @return {undefined}
   */
  var exports = function() {
    $.log(2, "(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use 'new ScrollMagic.Controller()' to create a new controller instance. Use 'new ScrollMagic.Scene()' to instance a scene.");
  };
  /** @type {string} */
  exports.version = "2.0.5";
  window.addEventListener("mousewheel", function() {
  });
  /** @type {string} */
  var attribute = "data-scrollmagic-pin-spacer";
  /**
   * @param {?} settings
   * @return {?}
   */
  exports.Controller = function(settings) {
    var originalEvent;
    var timeoutTimer;
    /** @type {string} */
    var l = "ScrollMagic.Controller";
    /** @type {string} */
    var s = "FORWARD";
    /** @type {string} */
    var $0 = "REVERSE";
    /** @type {string} */
    var expr = "PAUSED";
    var defaults = $button.defaults;
    var self = this;
    var options = $.extend({}, defaults, settings);
    /** @type {Array} */
    var result = [];
    /** @type {boolean} */
    var ret = false;
    /** @type {number} */
    var len = 0;
    /** @type {string} */
    var old = expr;
    /** @type {boolean} */
    var isDocument = true;
    /** @type {number} */
    var params = 0;
    /** @type {boolean} */
    var node = true;
    /**
     * @return {undefined}
     */
    var init = function() {
      var i;
      for (i in options) {
        if (!defaults.hasOwnProperty(i)) {
          log(2, 'WARNING: Unknown option "' + i + '"');
          delete options[i];
        }
      }
      if (options.container = $.get.elements(options.container)[0], !options.container) {
        throw log(1, "ERROR creating object " + l + ": No valid scroll container supplied"), l + " init failed.";
      }
      /** @type {boolean} */
      isDocument = options.container === window || (options.container === document.body || !document.body.contains(options.container));
      if (isDocument) {
        /** @type {Window} */
        options.container = window;
      }
      params = extend();
      options.container.addEventListener("resize", resize);
      options.container.addEventListener("scroll", resize);
      /** @type {number} */
      options.refreshInterval = parseInt(options.refreshInterval) || defaults.refreshInterval;
      fix();
      log(3, "added new " + l + " controller (v" + exports.version + ")");
    };
    /**
     * @return {undefined}
     */
    var fix = function() {
      if (options.refreshInterval > 0) {
        /** @type {number} */
        timeoutTimer = window.setTimeout(handler, options.refreshInterval);
      }
    };
    /**
     * @return {?}
     */
    var bind = function() {
      return options.vertical ? $.get.scrollTop(options.container) : $.get.scrollLeft(options.container);
    };
    /**
     * @return {?}
     */
    var extend = function() {
      return options.vertical ? $.get.height(options.container) : $.get.width(options.container);
    };
    /** @type {function (number): undefined} */
    var callback = this._setScrollPos = function(val) {
      if (options.vertical) {
        if (isDocument) {
          window.scrollTo($.get.scrollLeft(), val);
        } else {
          /** @type {number} */
          options.container.scrollTop = val;
        }
      } else {
        if (isDocument) {
          window.scrollTo(val, $.get.scrollTop());
        } else {
          /** @type {number} */
          options.container.scrollLeft = val;
        }
      }
    };
    /**
     * @return {undefined}
     */
    var parse = function() {
      if (node && ret) {
        var matched = $.type.Array(ret) ? ret : result.slice(0);
        /** @type {boolean} */
        ret = false;
        var i = len;
        len = self.scrollPos();
        /** @type {number} */
        var n = len - i;
        if (0 !== n) {
          /** @type {string} */
          old = n > 0 ? s : $0;
        }
        if (old === $0) {
          matched.reverse();
        }
        matched.forEach(function(vec, dataAndEvents) {
          log(3, "updating Scene " + (dataAndEvents + 1) + "/" + matched.length + " (" + result.length + " total)");
          vec.update(true);
        });
        if (0 === matched.length) {
          if (options.loglevel >= 3) {
            log(3, "updating 0 Scenes (nothing added to controller)");
          }
        }
      }
    };
    /**
     * @return {undefined}
     */
    var requestAnimationFrame = function() {
      originalEvent = $.rAF(parse);
    };
    /**
     * @param {Event} event
     * @return {undefined}
     */
    var resize = function(event) {
      log(3, "event fired causing an update:", event.type);
      if ("resize" == event.type) {
        params = extend();
        /** @type {string} */
        old = expr;
      }
      if (ret !== true) {
        /** @type {boolean} */
        ret = true;
        requestAnimationFrame();
      }
    };
    /**
     * @return {undefined}
     */
    var handler = function() {
      if (!isDocument && params != extend()) {
        var event;
        try {
          /** @type {Event} */
          event = new Event("resize", {
            bubbles : false,
            cancelable : false
          });
        } catch (t) {
          /** @type {(Event|null)} */
          event = document.createEvent("Event");
          event.initEvent("resize", false, false);
        }
        options.container.dispatchEvent(event);
      }
      result.forEach(function(target, dataAndEvents) {
        target.refresh();
      });
      fix();
    };
    /** @type {function (number, string): undefined} */
    var log = this._log = function(expectedNumberOfNonCommentArgs, msg) {
      if (options.loglevel >= expectedNumberOfNonCommentArgs) {
        Array.prototype.splice.call(arguments, 1, 0, "(" + l + ") ->");
        $.log.apply(window, arguments);
      }
    };
    this._options = options;
    /**
     * @param {Object} first
     * @return {?}
     */
    var merge = function(first) {
      if (first.length <= 1) {
        return first;
      }
      var bProperties = first.slice(0);
      return bProperties.sort(function(dataAndEvents, adapter) {
        return dataAndEvents.scrollOffset() > adapter.scrollOffset() ? 1 : -1;
      }), bProperties;
    };
    return this.addScene = function(object) {
      if ($.type.Array(object)) {
        object.forEach(function(which, dataAndEvents) {
          self.addScene(which);
        });
      } else {
        if (object instanceof exports.Scene) {
          if (object.controller() !== self) {
            object.addTo(self);
          } else {
            if (result.indexOf(object) < 0) {
              result.push(object);
              result = merge(result);
              object.on("shift.controller_sort", function() {
                result = merge(result);
              });
              var key;
              for (key in options.globalSceneOptions) {
                if (object[key]) {
                  object[key].call(object, options.globalSceneOptions[key]);
                }
              }
              log(3, "adding Scene (now " + result.length + " total)");
            }
          }
        } else {
          log(1, "ERROR: invalid argument supplied for '.addScene()'");
        }
      }
      return self;
    }, this.removeScene = function(item) {
      if ($.type.Array(item)) {
        item.forEach(function(isSorted, dataAndEvents) {
          self.removeScene(isSorted);
        });
      } else {
        var index = result.indexOf(item);
        if (index > -1) {
          item.off("shift.controller_sort");
          result.splice(index, 1);
          log(3, "removing Scene (now " + result.length + " left)");
          item.remove();
        }
      }
      return self;
    }, this.updateScene = function(object, recurring) {
      return $.type.Array(object) ? object.forEach(function(which, dataAndEvents) {
        self.updateScene(which, recurring);
      }) : recurring ? object.update(true) : ret !== true && (object instanceof exports.Scene && (ret = ret || [], -1 == ret.indexOf(object) && ret.push(object), ret = merge(ret), requestAnimationFrame())), self;
    }, this.update = function(dataAndEvents) {
      return resize({
        type : "resize"
      }), dataAndEvents && parse(), self;
    }, this.scrollTo = function(node, value) {
      if ($.type.Number(node)) {
        callback.call(options.container, node, value);
      } else {
        if (node instanceof exports.Scene) {
          if (node.controller() === self) {
            self.scrollTo(node.scrollOffset(), value);
          } else {
            log(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", node);
          }
        } else {
          if ($.type.Function(node)) {
            /** @type {Object} */
            callback = node;
          } else {
            var qualifier = $.get.elements(node)[0];
            if (qualifier) {
              for (;qualifier.parentNode.hasAttribute(attribute);) {
                qualifier = qualifier.parentNode;
              }
              /** @type {string} */
              var prop = options.vertical ? "top" : "left";
              var initVars = $.get.offset(options.container);
              var vars = $.get.offset(qualifier);
              if (!isDocument) {
                initVars[prop] -= self.scrollPos();
              }
              self.scrollTo(vars[prop] - initVars[prop], value);
            } else {
              log(2, "scrollTo(): The supplied argument is invalid. Scroll cancelled.", node);
            }
          }
        }
      }
      return self;
    }, this.scrollPos = function(walkers) {
      return arguments.length ? ($.type.Function(walkers) ? bind = walkers : log(2, "Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'."), self) : bind.call(self);
    }, this.info = function(name) {
      var data = {
        size : params,
        vertical : options.vertical,
        scrollPos : len,
        scrollDirection : old,
        container : options.container,
        isDocument : isDocument
      };
      return arguments.length ? void 0 !== data[name] ? data[name] : void log(1, 'ERROR: option "' + name + '" is not available') : data;
    }, this.loglevel = function(value) {
      return arguments.length ? (options.loglevel != value && (options.loglevel = value), self) : options.loglevel;
    }, this.enabled = function(root) {
      return arguments.length ? (node != root && (node = !!root, self.updateScene(result, true)), self) : node;
    }, this.destroy = function(next) {
      window.clearTimeout(timeoutTimer);
      var index = result.length;
      for (;index--;) {
        result[index].destroy(next);
      }
      return options.container.removeEventListener("resize", resize), options.container.removeEventListener("scroll", resize), $.cAF(originalEvent), log(3, "destroyed " + l + " (reset: " + (next ? "true" : "false") + ")"), null;
    }, init(), self;
  };
  var $button = {
    defaults : {
      container : window,
      vertical : true,
      globalSceneOptions : {},
      loglevel : 2,
      refreshInterval : 100
    }
  };
  /**
   * @param {?} option
   * @param {?} value
   * @return {undefined}
   */
  exports.Controller.addOption = function(option, value) {
    $button.defaults[option] = value;
  };
  /**
   * @param {?} opt_attributes
   * @return {undefined}
   */
  exports.Controller.extend = function(opt_attributes) {
    var base = this;
    /**
     * @return {?}
     */
    exports.Controller = function() {
      return base.apply(this, arguments), this.$super = $.extend({}, this), opt_attributes.apply(this, arguments) || this;
    };
    $.extend(exports.Controller, base);
    exports.Controller.prototype = base.prototype;
    /** @type {function (): ?} */
    exports.Controller.prototype.constructor = exports.Controller;
  };
  /**
   * @param {?} opts
   * @return {?}
   */
  exports.Scene = function(opts) {
    var css;
    var that;
    /** @type {string} */
    var l = "ScrollMagic.Scene";
    /** @type {string} */
    var key = "BEFORE";
    /** @type {string} */
    var _id = "DURING";
    /** @type {string} */
    var id = "AFTER";
    var defaults = config.defaults;
    var self = this;
    var result = $.extend({}, defaults, opts);
    /** @type {string} */
    var k = key;
    /** @type {number} */
    var x = 0;
    var params = {
      start : 0,
      end : 0
    };
    /** @type {number} */
    var dest = 0;
    /** @type {boolean} */
    var list = true;
    /**
     * @return {undefined}
     */
    var add = function() {
      var prop;
      for (prop in result) {
        if (!defaults.hasOwnProperty(prop)) {
          callback(2, 'WARNING: Unknown option "' + prop + '"');
          delete result[prop];
        }
      }
      var datum;
      for (datum in defaults) {
        text(datum);
      }
      push();
    };
    var variables = {};
    /**
     * @param {string} e
     * @param {Function} handler
     * @return {?}
     */
    this.on = function(e, handler) {
      return $.type.Function(handler) ? (e = e.trim().split(" "), e.forEach(function(pair) {
        var match = pair.split(".");
        var variable = match[0];
        var eventName = match[1];
        if ("*" != variable) {
          if (!variables[variable]) {
            /** @type {Array} */
            variables[variable] = [];
          }
          variables[variable].push({
            namespace : eventName || "",
            /** @type {Function} */
            callback : handler
          });
        }
      })) : callback(1, "ERROR when calling '.on()': Supplied callback for '" + e + "' is not a valid function!"), self;
    };
    /**
     * @param {string} e
     * @param {Function} x
     * @return {?}
     */
    this.off = function(e, x) {
      return e ? (e = e.trim().split(" "), e.forEach(function(pair, dataAndEvents) {
        var segmentMatch = pair.split(".");
        var key = segmentMatch[0];
        var value = segmentMatch[1] || "";
        /** @type {Array} */
        var asserterNames = "*" === key ? Object.keys(variables) : [key];
        asserterNames.forEach(function(k) {
          var fns = variables[k] || [];
          var i = fns.length;
          for (;i--;) {
            var that = fns[i];
            if (!!that) {
              if (!(value !== that.namespace && "*" !== value)) {
                if (!(x && x != that.callback)) {
                  fns.splice(i, 1);
                }
              }
            }
          }
          if (!fns.length) {
            delete variables[k];
          }
        });
      }), self) : (callback(1, "ERROR: Invalid event name supplied."), self);
    };
    /**
     * @param {string} event
     * @param {string} expectedNumberOfNonCommentArgs
     * @return {?}
     */
    this.trigger = function(event, expectedNumberOfNonCommentArgs) {
      if (event) {
        var def = event.trim().split(".");
        var name = def[0];
        var val = def[1];
        var set = variables[name];
        callback(3, "event fired:", name, expectedNumberOfNonCommentArgs ? "->" : "", expectedNumberOfNonCommentArgs || "");
        if (set) {
          set.forEach(function(event, dataAndEvents) {
            if (!(val && val !== event.namespace)) {
              event.callback.call(self, new exports.Event(name, event.namespace, self, expectedNumberOfNonCommentArgs));
            }
          });
        }
      } else {
        callback(1, "ERROR: Invalid event name supplied.");
      }
      return self;
    };
    self.on("change.internal", function(_arg) {
      if ("loglevel" !== _arg.what) {
        if ("tweenChanges" !== _arg.what) {
          if ("triggerElement" === _arg.what) {
            load();
          } else {
            if ("reverse" === _arg.what) {
              self.update();
            }
          }
        }
      }
    }).on("shift.internal", function(dataAndEvents) {
      show();
      self.update();
    });
    /** @type {function (number, string): undefined} */
    var callback = this._log = function(expectedNumberOfNonCommentArgs, msg) {
      if (result.loglevel >= expectedNumberOfNonCommentArgs) {
        Array.prototype.splice.call(arguments, 1, 0, "(" + l + ") ->");
        $.log.apply(window, arguments);
      }
    };
    /**
     * @param {?} game
     * @return {?}
     */
    this.addTo = function(game) {
      return game instanceof exports.Controller ? that != game && (that && that.removeScene(self), that = game, push(), set(true), load(true), show(), that.info("container").addEventListener("resize", mouseup), game.addScene(self), self.trigger("add", {
        controller : that
      }), callback(3, "added " + l + " to controller"), self.update()) : callback(1, "ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller"), self;
    };
    /**
     * @param {?} root
     * @return {?}
     */
    this.enabled = function(root) {
      return arguments.length ? (list != root && (list = !!root, self.update(true)), self) : list;
    };
    /**
     * @return {?}
     */
    this.remove = function() {
      if (that) {
        that.info("container").removeEventListener("resize", mouseup);
        var game = that;
        that = void 0;
        game.removeScene(self);
        self.trigger("remove");
        callback(3, "removed " + l + " from controller");
      }
      return self;
    };
    /**
     * @param {(boolean|number|string)} next
     * @return {?}
     */
    this.destroy = function(next) {
      return self.trigger("destroy", {
        reset : next
      }), self.remove(), self.off("*.*"), callback(3, "destroyed " + l + " (reset: " + (next ? "true" : "false") + ")"), null;
    };
    /**
     * @param {boolean} dataAndEvents
     * @return {?}
     */
    this.update = function(dataAndEvents) {
      if (that) {
        if (dataAndEvents) {
          if (that.enabled() && list) {
            var progress;
            var i = that.info("scrollPos");
            /** @type {number} */
            progress = result.duration > 0 ? (i - params.start) / (params.end - params.start) : i >= params.start ? 1 : 0;
            self.trigger("update", {
              startPos : params.start,
              endPos : params.end,
              scrollPos : i
            });
            self.progress(progress);
          } else {
            if (node) {
              if (k === _id) {
                start(true);
              }
            }
          }
        } else {
          that.updateScene(self, false);
        }
      }
      return self;
    };
    /**
     * @return {?}
     */
    this.refresh = function() {
      return set(), load(), self;
    };
    /**
     * @param {number} value
     * @return {?}
     */
    this.progress = function(value) {
      if (arguments.length) {
        /** @type {boolean} */
        var j = false;
        var r = k;
        var scrollDirection = that ? that.info("scrollDirection") : "PAUSED";
        var _powerSaveEnabled = result.reverse || value >= x;
        if (0 === result.duration ? (j = x != value, x = 1 > value && _powerSaveEnabled ? 0 : 1, k = 0 === x ? key : _id) : 0 > value && (k !== key && _powerSaveEnabled) ? (x = 0, k = key, j = true) : value >= 0 && (1 > value && _powerSaveEnabled) ? (x = value, k = _id, j = true) : value >= 1 && k !== id ? (x = 1, k = id, j = true) : k !== _id || (_powerSaveEnabled || start()), j) {
          var expectedNumberOfNonCommentArgs = {
            progress : x,
            state : k,
            scrollDirection : scrollDirection
          };
          /** @type {boolean} */
          var e = k != r;
          /**
           * @param {string} qualifier
           * @return {undefined}
           */
          var animate = function(qualifier) {
            self.trigger(qualifier, expectedNumberOfNonCommentArgs);
          };
          if (e) {
            if (r !== _id) {
              animate("enter");
              animate(r === key ? "start" : "end");
            }
          }
          animate("progress");
          if (e) {
            if (k !== _id) {
              animate(k === key ? "start" : "end");
              animate("leave");
            }
          }
        }
        return self;
      }
      return x;
    };
    /**
     * @return {undefined}
     */
    var show = function() {
      params = {
        start : dest + result.offset
      };
      if (that) {
        if (result.triggerElement) {
          params.start -= that.info("size") * result.triggerHook;
        }
      }
      params.end = params.start + result.duration;
    };
    /**
     * @param {boolean} opt_isCancel
     * @return {undefined}
     */
    var set = function(opt_isCancel) {
      if (css) {
        /** @type {string} */
        var item = "duration";
        if (fn(item, css.call(self))) {
          if (!opt_isCancel) {
            self.trigger("change", {
              what : item,
              newval : result[item]
            });
            self.trigger("shift", {
              reason : item
            });
          }
        }
      }
    };
    /**
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    var load = function(dataAndEvents) {
      /** @type {number} */
      var mat = 0;
      var qualifier = result.triggerElement;
      if (that && qualifier) {
        var o = that.info();
        var initVars = $.get.offset(o.container);
        /** @type {string} */
        var prop = o.vertical ? "top" : "left";
        for (;qualifier.parentNode.hasAttribute(attribute);) {
          qualifier = qualifier.parentNode;
        }
        var vars = $.get.offset(qualifier);
        if (!o.isDocument) {
          initVars[prop] -= that.scrollPos();
        }
        /** @type {number} */
        mat = vars[prop] - initVars[prop];
      }
      /** @type {boolean} */
      var u = mat != dest;
      /** @type {number} */
      dest = mat;
      if (u) {
        if (!dataAndEvents) {
          self.trigger("shift", {
            reason : "triggerElementPosition"
          });
        }
      }
    };
    /**
     * @param {?} e
     * @return {undefined}
     */
    var mouseup = function(e) {
      if (result.triggerHook > 0) {
        self.trigger("shift", {
          reason : "containerResize"
        });
      }
    };
    var scrubbed = $.extend(config.validate, {
      /**
       * @param {number} value
       * @return {?}
       */
      duration : function(value) {
        if ($.type.String(value) && value.match(/^(\.|\d)*\d+%$/)) {
          /** @type {number} */
          var size = parseFloat(value) / 100;
          /**
           * @return {?}
           */
          value = function() {
            return that ? that.info("size") * size : 0;
          };
        }
        if ($.type.Function(value)) {
          /** @type {number} */
          css = value;
          try {
            /** @type {number} */
            value = parseFloat(css());
          } catch (n) {
            /** @type {number} */
            value = -1;
          }
        }
        if (value = parseFloat(value), !$.type.Number(value) || 0 > value) {
          throw css ? (css = void 0, ['Invalid return value of supplied function for option "duration":', value]) : ['Invalid value for option "duration":', value];
        }
        return value;
      }
    });
    /**
     * @param {Object} name
     * @return {undefined}
     */
    var push = function(name) {
      /** @type {Array} */
      name = arguments.length ? [name] : Object.keys(scrubbed);
      name.forEach(function(name, dataAndEvents) {
        var value;
        if (scrubbed[name]) {
          try {
            value = scrubbed[name](result[name]);
          } catch (data) {
            value = defaults[name];
            var a = $.type.String(data) ? [data] : data;
            if ($.type.Array(a)) {
              a[0] = "ERROR: " + a[0];
              a.unshift(1);
              callback.apply(this, a);
            } else {
              callback(1, "ERROR: Problem executing validation callback for option '" + name + "':", data.message);
            }
          } finally {
            result[name] = value;
          }
        }
      });
    };
    /**
     * @param {string} key
     * @param {?} value
     * @return {?}
     */
    var fn = function(key, value) {
      /** @type {boolean} */
      var errorGiven = false;
      var error = result[key];
      return result[key] != value && (result[key] = value, push(key), errorGiven = error != result[key]), errorGiven;
    };
    /**
     * @param {string} item
     * @return {undefined}
     */
    var text = function(item) {
      if (!self[item]) {
        /**
         * @param {?} isXML
         * @return {?}
         */
        self[item] = function(isXML) {
          return arguments.length ? ("duration" === item && (css = void 0), fn(item, isXML) && (self.trigger("change", {
            what : item,
            newval : result[item]
          }), config.shifts.indexOf(item) > -1 && self.trigger("shift", {
            reason : item
          })), self) : result[item];
        };
      }
    };
    /**
     * @return {?}
     */
    this.controller = function() {
      return that;
    };
    /**
     * @return {?}
     */
    this.state = function() {
      return k;
    };
    /**
     * @return {?}
     */
    this.scrollOffset = function() {
      return params.start;
    };
    /**
     * @return {?}
     */
    this.triggerPosition = function() {
      var start = result.offset;
      return that && (start += result.triggerElement ? dest : that.info("size") * self.triggerHook()), start;
    };
    var node;
    var options;
    self.on("shift.internal", function(err) {
      /** @type {boolean} */
      var sameTrigger = "duration" === err.reason;
      if (k === id && sameTrigger || k === _id && 0 === result.duration) {
        start();
      }
      if (sameTrigger) {
        init();
      }
    }).on("progress.internal", function(dataAndEvents) {
      start();
    }).on("add.internal", function(dataAndEvents) {
      init();
    }).on("destroy.internal", function(record) {
      self.removePin(record.reset);
    });
    /**
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    var start = function(dataAndEvents) {
      if (node && that) {
        var settings = that.info();
        var textarea = options.spacer.firstChild;
        if (dataAndEvents || k !== _id) {
          var style = {
            position : options.inFlow ? "relative" : "absolute",
            top : 0,
            left : 0
          };
          /** @type {boolean} */
          var i = $.css(textarea, "position") != style.position;
          if (options.pushFollowers) {
            if (result.duration > 0) {
              if (k === id && 0 === parseFloat($.css(options.spacer, "padding-top"))) {
                /** @type {boolean} */
                i = true;
              } else {
                if (k === key) {
                  if (0 === parseFloat($.css(options.spacer, "padding-bottom"))) {
                    /** @type {boolean} */
                    i = true;
                  }
                }
              }
            }
          } else {
            /** @type {number} */
            style[settings.vertical ? "top" : "left"] = result.duration * x;
          }
          $.css(textarea, style);
          if (i) {
            init();
          }
        } else {
          if ("fixed" != $.css(textarea, "position")) {
            $.css(textarea, {
              position : "fixed"
            });
            init();
          }
          var pos = $.get.offset(options.spacer, true);
          /** @type {number} */
          var trunkLen = result.reverse || 0 === result.duration ? settings.scrollPos - params.start : Math.round(x * result.duration * 10) / 10;
          pos[settings.vertical ? "top" : "left"] += trunkLen;
          $.css(options.spacer.firstChild, {
            top : pos.top,
            left : pos.left
          });
        }
      }
    };
    /**
     * @return {undefined}
     */
    var init = function() {
      if (node && (that && options.inFlow)) {
        /** @type {boolean} */
        var layer = k === _id;
        var reverse = that.info("vertical");
        var start = options.spacer.firstChild;
        var height = $.isMarginCollapseType($.css(options.spacer, "display"));
        var style = {};
        if (options.relSize.width || options.relSize.autoFullWidth) {
          if (layer) {
            $.css(node, {
              width : $.get.width(options.spacer)
            });
          } else {
            $.css(node, {
              width : "100%"
            });
          }
        } else {
          style["min-width"] = $.get.width(reverse ? node : start, true, true);
          style.width = layer ? style["min-width"] : "auto";
        }
        if (options.relSize.height) {
          if (layer) {
            $.css(node, {
              height : $.get.height(options.spacer) - (options.pushFollowers ? result.duration : 0)
            });
          } else {
            $.css(node, {
              height : "100%"
            });
          }
        } else {
          style["min-height"] = $.get.height(reverse ? start : node, true, !height);
          style.height = layer ? style["min-height"] : "auto";
        }
        if (options.pushFollowers) {
          /** @type {number} */
          style["padding" + (reverse ? "Top" : "Left")] = result.duration * x;
          /** @type {number} */
          style["padding" + (reverse ? "Bottom" : "Right")] = result.duration * (1 - x);
        }
        $.css(options.spacer, style);
      }
    };
    /**
     * @return {undefined}
     */
    var completed = function() {
      if (that) {
        if (node) {
          if (k === _id) {
            if (!that.info("isDocument")) {
              start();
            }
          }
        }
      }
    };
    /**
     * @return {undefined}
     */
    var onWindowResize = function() {
      if (that) {
        if (node) {
          if (k === _id) {
            if ((options.relSize.width || options.relSize.autoFullWidth) && $.get.width(window) != $.get.width(options.spacer.parentNode) || options.relSize.height && $.get.height(window) != $.get.height(options.spacer.parentNode)) {
              init();
            }
          }
        }
      }
    };
    /**
     * @param {Object} event
     * @return {undefined}
     */
    var handler = function(event) {
      if (that) {
        if (node) {
          if (k === _id) {
            if (!that.info("isDocument")) {
              event.preventDefault();
              that._setScrollPos(that.info("scrollPos") - ((event.wheelDelta || event[that.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || 30 * -event.detail));
            }
          }
        }
      }
    };
    /**
     * @param {(Object|string)} elem
     * @param {Text} vars
     * @return {?}
     */
    this.setPin = function(elem, vars) {
      var defaults = {
        pushFollowers : true,
        spacerClass : "scrollmagic-pin-spacer"
      };
      if (vars = $.extend({}, defaults, vars), elem = $.get.elements(elem)[0], !elem) {
        return callback(1, "ERROR calling method 'setPin()': Invalid pin element supplied."), self;
      }
      if ("fixed" === $.css(elem, "position")) {
        return callback(1, "ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'."), self;
      }
      if (node) {
        if (node === elem) {
          return self;
        }
        self.removePin();
      }
      /** @type {(Object|string)} */
      node = elem;
      var gutterDisplay = node.parentNode.style.display;
      /** @type {Array} */
      var directions = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
      /** @type {string} */
      node.parentNode.style.display = "none";
      /** @type {boolean} */
      var _mustShow = "absolute" != $.css(node, "position");
      var attributes = $.css(node, directions.concat(["display"]));
      var file = $.css(node, ["width", "height"]);
      node.parentNode.style.display = gutterDisplay;
      if (!_mustShow) {
        if (vars.pushFollowers) {
          callback(2, "WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled.");
          /** @type {boolean} */
          vars.pushFollowers = false;
        }
      }
      window.setTimeout(function() {
        if (node) {
          if (0 === result.duration) {
            if (vars.pushFollowers) {
              callback(2, "WARNING: pushFollowers =", true, "has no effect, when scene duration is 0.");
            }
          }
        }
      }, 0);
      var el = node.parentNode.insertBefore(document.createElement("div"), node);
      var keys = $.extend(attributes, {
        position : _mustShow ? "relative" : "absolute",
        boxSizing : "content-box",
        mozBoxSizing : "content-box",
        webkitBoxSizing : "content-box"
      });
      if (_mustShow || $.extend(keys, $.css(node, ["width", "height"])), $.css(el, keys), el.setAttribute(attribute, ""), $.addClass(el, vars.spacerClass), options = {
        spacer : el,
        relSize : {
          width : "%" === file.width.slice(-1),
          height : "%" === file.height.slice(-1),
          autoFullWidth : "auto" === file.width && (_mustShow && $.isMarginCollapseType(attributes.display))
        },
        pushFollowers : vars.pushFollowers,
        inFlow : _mustShow
      }, !node.___origStyle) {
        node.___origStyle = {};
        var s = node.style;
        /** @type {Array} */
        var asserterNames = directions.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
        asserterNames.forEach(function(prop) {
          node.___origStyle[prop] = s[prop] || "";
        });
      }
      return options.relSize.width && $.css(el, {
        width : file.width
      }), options.relSize.height && $.css(el, {
        height : file.height
      }), el.appendChild(node), $.css(node, {
        position : _mustShow ? "relative" : "absolute",
        margin : "auto",
        top : "auto",
        left : "auto",
        bottom : "auto",
        right : "auto"
      }), (options.relSize.width || options.relSize.autoFullWidth) && $.css(node, {
        boxSizing : "border-box",
        mozBoxSizing : "border-box",
        webkitBoxSizing : "border-box"
      }), window.addEventListener("scroll", completed), window.addEventListener("resize", completed), window.addEventListener("resize", onWindowResize), node.addEventListener("mousewheel", handler), node.addEventListener("DOMMouseScroll", handler), callback(3, "added pin"), start(), self;
    };
    /**
     * @param {boolean} object
     * @return {?}
     */
    this.removePin = function(object) {
      if (node) {
        if (k === _id && start(true), object || !that) {
          var el = options.spacer.firstChild;
          if (el.hasAttribute(attribute)) {
            var elemStyle = options.spacer.style;
            /** @type {Array} */
            var asserterNames = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
            margins = {};
            asserterNames.forEach(function(key) {
              margins[key] = elemStyle[key] || "";
            });
            $.css(el, margins);
          }
          options.spacer.parentNode.insertBefore(el, options.spacer);
          options.spacer.parentNode.removeChild(options.spacer);
          if (!node.parentNode.hasAttribute(attribute)) {
            $.css(node, node.___origStyle);
            delete node.___origStyle;
          }
        }
        window.removeEventListener("scroll", completed);
        window.removeEventListener("resize", completed);
        window.removeEventListener("resize", onWindowResize);
        node.removeEventListener("mousewheel", handler);
        node.removeEventListener("DOMMouseScroll", handler);
        node = void 0;
        callback(3, "removed pin (reset: " + (object ? "true" : "false") + ")");
      }
      return self;
    };
    var className;
    /** @type {Array} */
    var data = [];
    return self.on("destroy.internal", function(record) {
      self.removeClassToggle(record.reset);
    }), this.setClassToggle = function(selector, isXML) {
      var tmp = $.get.elements(selector);
      return 0 !== tmp.length && $.type.String(isXML) ? (data.length > 0 && self.removeClassToggle(), className = isXML, data = tmp, self.on("enter.internal_class leave.internal_class", function(event) {
        var text = "enter" === event.type ? $.addClass : $.removeClass;
        data.forEach(function(passes, dataAndEvents) {
          text(passes, className);
        });
      }), self) : (callback(1, "ERROR calling method 'setClassToggle()': Invalid " + (0 === tmp.length ? "element" : "classes") + " supplied."), self);
    }, this.removeClassToggle = function(dataAndEvents) {
      return dataAndEvents && data.forEach(function(passes, dataAndEvents) {
        $.removeClass(passes, className);
      }), self.off("start.internal_class end.internal_class"), className = void 0, data = [], self;
    }, add(), self;
  };
  var config = {
    defaults : {
      duration : 0,
      offset : 0,
      triggerElement : void 0,
      triggerHook : 0.5,
      reverse : true,
      loglevel : 2
    },
    validate : {
      /**
       * @param {string} event
       * @return {?}
       */
      offset : function(event) {
        if (event = parseFloat(event), !$.type.Number(event)) {
          throw['Invalid value for option "offset":', event];
        }
        return event;
      },
      /**
       * @param {string} event
       * @return {?}
       */
      triggerElement : function(event) {
        if (event = event || void 0) {
          var ev = $.get.elements(event)[0];
          if (!ev) {
            throw['Element defined in option "triggerElement" was not found:', event];
          }
          event = ev;
        }
        return event;
      },
      /**
       * @param {(number|string)} m
       * @return {?}
       */
      triggerHook : function(m) {
        var o = {
          onCenter : 0.5,
          onEnter : 1,
          onLeave : 0
        };
        if ($.type.Number(m)) {
          /** @type {number} */
          m = Math.max(0, Math.min(parseFloat(m), 1));
        } else {
          if (!(m in o)) {
            throw['Invalid value for option "triggerHook": ', m];
          }
          m = o[m];
        }
        return m;
      },
      /**
       * @param {?} pos
       * @return {?}
       */
      reverse : function(pos) {
        return!!pos;
      },
      /**
       * @param {number} mode
       * @return {?}
       */
      loglevel : function(mode) {
        if (mode = parseInt(mode), !$.type.Number(mode) || (0 > mode || mode > 3)) {
          throw['Invalid value for option "loglevel":', mode];
        }
        return mode;
      }
    },
    shifts : ["duration", "offset", "triggerHook"]
  };
  /**
   * @param {string} key
   * @param {?} value
   * @param {?} val
   * @param {?} selectbox
   * @return {undefined}
   */
  exports.Scene.addOption = function(key, value, val, selectbox) {
    if (key in config.defaults) {
      exports._util.log(1, "[static] ScrollMagic.Scene -> Cannot add Scene option '" + key + "', because it already exists.");
    } else {
      config.defaults[key] = value;
      config.validate[key] = val;
      if (selectbox) {
        config.shifts.push(key);
      }
    }
  };
  /**
   * @param {?} opt_attributes
   * @return {undefined}
   */
  exports.Scene.extend = function(opt_attributes) {
    var base = this;
    /**
     * @return {?}
     */
    exports.Scene = function() {
      return base.apply(this, arguments), this.$super = $.extend({}, this), opt_attributes.apply(this, arguments) || this;
    };
    $.extend(exports.Scene, base);
    exports.Scene.prototype = base.prototype;
    /** @type {function (): ?} */
    exports.Scene.prototype.constructor = exports.Scene;
  };
  /**
   * @param {string} type
   * @param {string} opt_attributes
   * @param {?} target
   * @param {Object} helper
   * @return {?}
   */
  exports.Event = function(type, opt_attributes, target, helper) {
    helper = helper || {};
    var key;
    for (key in helper) {
      this[key] = helper[key];
    }
    return this.type = type, this.target = this.currentTarget = target, this.namespace = opt_attributes || "", this.timeStamp = this.timestamp = Date.now(), this;
  };
  var $ = exports._util = function(win) {
    var i;
    var me = {};
    /**
     * @param {?} val
     * @return {?}
     */
    var toPixel = function(val) {
      return parseFloat(val) || 0;
    };
    /**
     * @param {Object} el
     * @return {?}
     */
    var getComputedStyle = function(el) {
      return el.currentStyle ? el.currentStyle : win.getComputedStyle(el);
    };
    /**
     * @param {string} name
     * @param {Object} element
     * @param {boolean} expectedNumberOfNonCommentArgs
     * @param {boolean} deepDataAndEvents
     * @return {?}
     */
    var log = function(name, element, expectedNumberOfNonCommentArgs, deepDataAndEvents) {
      if (element = element === document ? win : element, element === win) {
        /** @type {boolean} */
        deepDataAndEvents = false;
      } else {
        if (!$.DomElement(element)) {
          return 0;
        }
      }
      name = name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
      var n = (expectedNumberOfNonCommentArgs ? element["offset" + name] || element["outer" + name] : element["client" + name] || element["inner" + name]) || 0;
      if (expectedNumberOfNonCommentArgs && deepDataAndEvents) {
        var style = getComputedStyle(element);
        n += "Height" === name ? toPixel(style.marginTop) + toPixel(style.marginBottom) : toPixel(style.marginLeft) + toPixel(style.marginRight);
      }
      return n;
    };
    /**
     * @param {string} s
     * @return {?}
     */
    var camelize = function(s) {
      return s.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, function(m) {
        return m[1].toUpperCase();
      });
    };
    /**
     * @param {?} opt_attributes
     * @return {?}
     */
    me.extend = function(opt_attributes) {
      opt_attributes = opt_attributes || {};
      /** @type {number} */
      i = 1;
      for (;i < arguments.length;i++) {
        if (arguments[i]) {
          var opt;
          for (opt in arguments[i]) {
            if (arguments[i].hasOwnProperty(opt)) {
              opt_attributes[opt] = arguments[i][opt];
            }
          }
        }
      }
      return opt_attributes;
    };
    /**
     * @param {?} existingFn
     * @return {?}
     */
    me.isMarginCollapseType = function(existingFn) {
      return["block", "flex", "list-item", "table", "-webkit-box"].indexOf(existingFn) > -1;
    };
    /** @type {number} */
    var lastTime = 0;
    /** @type {Array} */
    var vendors = ["ms", "moz", "webkit", "o"];
    /** @type {function (this:Window, function (number): ?, (Element|null)=): number} */
    var raf = win.requestAnimationFrame;
    /** @type {function (this:Window, number): ?} */
    var cancelAnimationFrame = win.cancelAnimationFrame;
    /** @type {number} */
    i = 0;
    for (;!raf && i < vendors.length;++i) {
      raf = win[vendors[i] + "RequestAnimationFrame"];
      cancelAnimationFrame = win[vendors[i] + "CancelAnimationFrame"] || win[vendors[i] + "CancelRequestAnimationFrame"];
    }
    if (!raf) {
      /**
       * @param {?} callback
       * @return {?}
       */
      raf = function(callback) {
        /** @type {number} */
        var currTime = (new Date).getTime();
        /** @type {number} */
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        /** @type {number} */
        var id = win.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        return lastTime = currTime + timeToCall, id;
      };
    }
    if (!cancelAnimationFrame) {
      /**
       * @param {?} id
       * @return {undefined}
       */
      cancelAnimationFrame = function(id) {
        win.clearTimeout(id);
      };
    }
    me.rAF = raf.bind(win);
    me.cAF = cancelAnimationFrame.bind(win);
    /** @type {Array} */
    var codeSegments = ["error", "warn", "log"];
    /** @type {(Console|{})} */
    var object = win.console || {};
    /** @type {function (this:Console, ...[*]): ?} */
    object.log = object.log || function() {
    };
    /** @type {number} */
    i = 0;
    for (;i < codeSegments.length;i++) {
      var k = codeSegments[i];
      if (!object[k]) {
        /** @type {function (this:Console, ...[*]): ?} */
        object[k] = object.log;
      }
    }
    /**
     * @param {number} expectedNumberOfNonCommentArgs
     * @return {undefined}
     */
    me.log = function(expectedNumberOfNonCommentArgs) {
      if (expectedNumberOfNonCommentArgs > codeSegments.length || 0 >= expectedNumberOfNonCommentArgs) {
        /** @type {number} */
        expectedNumberOfNonCommentArgs = codeSegments.length;
      }
      /** @type {Date} */
      var d = new Date;
      /** @type {string} */
      var source = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2) + ":" + ("00" + d.getMilliseconds()).slice(-3);
      var method = codeSegments[expectedNumberOfNonCommentArgs - 1];
      /** @type {Array.<?>} */
      var args = Array.prototype.splice.call(arguments, 1);
      /** @type {Function} */
      var __method = Function.prototype.bind.call(object[method], object);
      args.unshift(source);
      __method.apply(object, args);
    };
    /** @type {function (Object): ?} */
    var $ = me.type = function(obj) {
      return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
    };
    /**
     * @param {Object} value
     * @return {?}
     */
    $.String = function(value) {
      return "string" === $(value);
    };
    /**
     * @param {Object} obj
     * @return {?}
     */
    $.Function = function(obj) {
      return "function" === $(obj);
    };
    /**
     * @param {Object} obj
     * @return {?}
     */
    $.Array = function(obj) {
      return Array.isArray(obj);
    };
    /**
     * @param {string} value
     * @return {?}
     */
    $.Number = function(value) {
      return!$.Array(value) && value - parseFloat(value) + 1 >= 0;
    };
    /**
     * @param {Node} object
     * @return {?}
     */
    $.DomElement = function(object) {
      return "object" == typeof HTMLElement ? object instanceof HTMLElement : object && ("object" == typeof object && (null !== object && (1 === object.nodeType && "string" == typeof object.nodeName)));
    };
    var ele = me.get = {};
    return ele.elements = function(value) {
      /** @type {Array} */
      var result = [];
      if ($.String(value)) {
        try {
          /** @type {NodeList} */
          value = document.querySelectorAll(value);
        } catch (r) {
          return result;
        }
      }
      if ("nodelist" === $(value) || $.Array(value)) {
        /** @type {number} */
        var key = 0;
        var id = result.length = value.length;
        for (;id > key;key++) {
          var selector = value[key];
          result[key] = $.DomElement(selector) ? selector : ele.elements(selector);
        }
      } else {
        if ($.DomElement(value) || (value === document || value === win)) {
          /** @type {Array} */
          result = [value];
        }
      }
      return result;
    }, ele.scrollTop = function(e) {
      return e && "number" == typeof e.scrollTop ? e.scrollTop : win.pageYOffset || 0;
    }, ele.scrollLeft = function(el) {
      return el && "number" == typeof el.scrollLeft ? el.scrollLeft : win.pageXOffset || 0;
    }, ele.width = function(event, expectedNumberOfNonCommentArgs, deepDataAndEvents) {
      return log("width", event, expectedNumberOfNonCommentArgs, deepDataAndEvents);
    }, ele.height = function(event, expectedNumberOfNonCommentArgs, deepDataAndEvents) {
      return log("height", event, expectedNumberOfNonCommentArgs, deepDataAndEvents);
    }, ele.offset = function(event, expectedNumberOfNonCommentArgs) {
      var pos = {
        top : 0,
        left : 0
      };
      if (event && event.getBoundingClientRect) {
        var box = event.getBoundingClientRect();
        pos.top = box.top;
        pos.left = box.left;
        if (!expectedNumberOfNonCommentArgs) {
          pos.top += ele.scrollTop();
          pos.left += ele.scrollLeft();
        }
      }
      return pos;
    }, me.addClass = function(el, className) {
      if (className) {
        if (el.classList) {
          el.classList.add(className);
        } else {
          el.className += " " + className;
        }
      }
    }, me.removeClass = function(el, className) {
      if (className) {
        if (el.classList) {
          el.classList.remove(className);
        } else {
          el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
        }
      }
    }, me.css = function(el, value) {
      if ($.String(value)) {
        return getComputedStyle(el)[camelize(value)];
      }
      if ($.Array(value)) {
        var to_instance = {};
        var computed = getComputedStyle(el);
        return value.forEach(function(property, dataAndEvents) {
          to_instance[property] = computed[camelize(property)];
        }), to_instance;
      }
      var p;
      for (p in value) {
        var val = value[p];
        if (val == parseFloat(val)) {
          val += "px";
        }
        el.style[camelize(p)] = val;
      }
    }, me;
  }(window || {});
  return exports.Scene.prototype.addIndicators = function() {
    return exports._util.log(1, "(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js"), this;
  }, exports.Scene.prototype.removeIndicators = function() {
    return exports._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js"), this;
  }, exports.Scene.prototype.setTween = function() {
    return exports._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js"), this;
  }, exports.Scene.prototype.removeTween = function() {
    return exports._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js"), this;
  }, exports.Scene.prototype.setVelocity = function() {
    return exports._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js"), this;
  }, exports.Scene.prototype.removeVelocity = function() {
    return exports._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js"), this;
  }, exports;
});
!function(root, factory) {
  if ("function" == typeof define && define.amd) {
    define(["ScrollMagic", "jquery"], factory);
  } else {
    if ("object" == typeof exports) {
      factory(require("scrollmagic"), require("jquery"));
    } else {
      factory(root.ScrollMagic, root.jQuery);
    }
  }
}(this, function(self, $) {
  /** @type {string} */
  var r = "jquery.ScrollMagic";
  /** @type {(Console|{})} */
  var logger = window.console || {};
  var throttledUpdate = Function.prototype.bind.call(logger.error || (logger.log || function() {
  }), logger);
  if (!self) {
    throttledUpdate("(" + r + ") -> ERROR: The ScrollMagic main module could not be found. Please make sure it's loaded before this plugin or use an asynchronous loader like requirejs.");
  }
  if (!$) {
    throttledUpdate("(" + r + ") -> ERROR: jQuery could not be found. Please make sure it's loaded before ScrollMagic or use an asynchronous loader like requirejs.");
  }
  /**
   * @param {Object} selector
   * @return {?}
   */
  self._util.get.elements = function(selector) {
    return $(selector).toArray();
  };
  /**
   * @param {string} el
   * @param {string} selector
   * @return {undefined}
   */
  self._util.addClass = function(el, selector) {
    $(el).addClass(selector);
  };
  /**
   * @param {string} el
   * @param {string} selector
   * @return {undefined}
   */
  self._util.removeClass = function(el, selector) {
    $(el).removeClass(selector);
  };
  $.ScrollMagic = self;
});
!function(root, factory) {
  if ("function" == typeof define && define.amd) {
    define([], factory(root));
  } else {
    if ("object" == typeof exports) {
      module.exports = factory(root);
    } else {
      root.gumshoe = factory(root);
    }
  }
}("undefined" != typeof global ? global : this.window || this.global, function(w) {
  var options;
  var abortTimeout;
  var scroll;
  var base;
  var popWidth;
  var self;
  var sprite = {};
  /** @type {boolean} */
  var i = "querySelector" in document && ("addEventListener" in w && "classList" in document.createElement("_"));
  /** @type {Array} */
  var values = [];
  var defaults = {
    selector : "[data-gumshoe] a",
    selectorHeader : "[data-gumshoe-header]",
    offset : 0,
    activeClass : "active",
    /**
     * @return {undefined}
     */
    callback : function() {
    }
  };
  /**
   * @param {Object} obj
   * @param {Function} fn
   * @param {?} thisv
   * @return {undefined}
   */
  var forEach = function(obj, fn, thisv) {
    if ("[object Object]" === Object.prototype.toString.call(obj)) {
      var key;
      for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(thisv, obj[key], key, obj);
        }
      }
    } else {
      /** @type {number} */
      var i = 0;
      var l = obj.length;
      for (;l > i;i++) {
        fn.call(thisv, obj[i], i, obj);
      }
    }
  };
  /**
   * @return {?}
   */
  var extend = function() {
    var object = {};
    /** @type {boolean} */
    var actionArgs = false;
    /** @type {number} */
    var argsIndex = 0;
    /** @type {number} */
    var argLength = arguments.length;
    if ("[object Boolean]" === Object.prototype.toString.call(arguments[0])) {
      actionArgs = arguments[0];
      argsIndex++;
    }
    /**
     * @param {Object} iterable
     * @return {undefined}
     */
    var isArray = function(iterable) {
      var key;
      for (key in iterable) {
        if (Object.prototype.hasOwnProperty.call(iterable, key)) {
          if (actionArgs && "[object Object]" === Object.prototype.toString.call(iterable[key])) {
            object[key] = extend(true, object[key], iterable[key]);
          } else {
            object[key] = iterable[key];
          }
        }
      }
    };
    for (;argLength > argsIndex;argsIndex++) {
      var iterable = arguments[argsIndex];
      isArray(iterable);
    }
    return object;
  };
  /**
   * @param {Object} body
   * @return {?}
   */
  var describe = function(body) {
    return Math.max(body.scrollHeight, body.offsetHeight, body.clientHeight);
  };
  /**
   * @return {?}
   */
  var getDocumentHeight = function() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
  };
  /**
   * @param {Object} obj
   * @return {?}
   */
  var log = function(obj) {
    /** @type {number} */
    var result = 0;
    if (obj.offsetParent) {
      do {
        result += obj.offsetTop;
        obj = obj.offsetParent;
      } while (obj);
    }
    return result = result - popWidth - options.offset, result >= 0 ? result : 0;
  };
  /**
   * @return {undefined}
   */
  var objectToString = function() {
    values.sort(function(a, b) {
      return a.distance > b.distance ? -1 : a.distance < b.distance ? 1 : 0;
    });
  };
  /**
   * @return {undefined}
   */
  sprite.setDistances = function() {
    scroll = getDocumentHeight();
    popWidth = base ? describe(base) + log(base) : 0;
    forEach(values, function(ev) {
      ev.distance = log(ev.target);
    });
    objectToString();
  };
  /**
   * @return {undefined}
   */
  var init = function() {
    /** @type {NodeList} */
    var suiteView = document.querySelectorAll(options.selector);
    forEach(suiteView, function(el) {
      if (el.hash) {
        values.push({
          nav : el,
          target : document.querySelector(el.hash),
          parent : "li" === el.parentNode.tagName.toLowerCase() ? el.parentNode : null,
          distance : 0
        });
      }
    });
  };
  /**
   * @param {Object} item
   * @return {undefined}
   */
  var addItem = function(item) {
    if (self) {
      self.nav.classList.remove(options.activeClass);
      if (self.parent) {
        self.parent.classList.remove(options.activeClass);
      }
    }
    item.nav.classList.add(options.activeClass);
    if (item.parent) {
      item.parent.classList.add(options.activeClass);
    }
    options.callback(item);
    self = {
      nav : item.nav,
      parent : item.parent
    };
  };
  /**
   * @return {?}
   */
  sprite.getCurrentNav = function() {
    var height = w.pageYOffset;
    if (w.innerHeight + height >= scroll) {
      return addItem(values[0]);
    }
    /** @type {number} */
    var css = 0;
    var valuesLen = values.length;
    for (;valuesLen > css;css++) {
      var value = values[css];
      if (value.distance < height) {
        return addItem(value);
      }
    }
  };
  /**
   * @return {undefined}
   */
  var show = function() {
    forEach(values, function(item) {
      if (item.nav.classList.contains(options.activeClass)) {
        self = {
          nav : item.nav,
          parent : item.parent
        };
      }
    });
  };
  /**
   * @return {undefined}
   */
  sprite.destroy = function() {
    if (options) {
      w.removeEventListener("resize", initialize, false);
      w.removeEventListener("scroll", initialize, false);
      /** @type {Array} */
      values = [];
      /** @type {null} */
      options = null;
      /** @type {null} */
      abortTimeout = null;
      /** @type {null} */
      scroll = null;
      /** @type {null} */
      base = null;
      /** @type {null} */
      popWidth = null;
      /** @type {null} */
      self = null;
    }
  };
  /**
   * @param {Event} control
   * @return {undefined}
   */
  var initialize = function(control) {
    if (!abortTimeout) {
      /** @type {number} */
      abortTimeout = setTimeout(function() {
        /** @type {null} */
        abortTimeout = null;
        if ("scroll" === control.type) {
          sprite.getCurrentNav();
        }
        if ("resize" === control.type) {
          sprite.setDistances();
          sprite.getCurrentNav();
        }
      }, 66);
    }
  };
  return sprite.init = function(opts) {
    if (i) {
      sprite.destroy();
      options = extend(defaults, opts || {});
      /** @type {(Element|null)} */
      base = document.querySelector(options.selectorHeader);
      init();
      if (0 !== values.length) {
        show();
        sprite.setDistances();
        sprite.getCurrentNav();
        w.addEventListener("resize", initialize, false);
        w.addEventListener("scroll", initialize, false);
      }
    }
  }, sprite;
});
!function(root, factory) {
  if ("function" == typeof define && define.amd) {
    define([], factory(root));
  } else {
    if ("object" == typeof exports) {
      module.exports = factory(root);
    } else {
      root.smoothScroll = factory(root);
    }
  }
}("undefined" != typeof global ? global : this.window || this.global, function(win) {
  var params;
  var abortTimeout;
  var x;
  var i;
  var id;
  var self = {};
  /** @type {boolean} */
  var u = "querySelector" in document && "addEventListener" in win;
  var defaults = {
    selector : "[data-scroll]",
    selectorHeader : "[data-scroll-header]",
    speed : 500,
    easing : "easeInOutCubic",
    offset : 0,
    updateURL : true,
    /**
     * @return {undefined}
     */
    callback : function() {
    }
  };
  /**
   * @return {?}
   */
  var extend = function() {
    var object = {};
    /** @type {boolean} */
    var actionArgs = false;
    /** @type {number} */
    var argsIndex = 0;
    /** @type {number} */
    var argLength = arguments.length;
    if ("[object Boolean]" === Object.prototype.toString.call(arguments[0])) {
      actionArgs = arguments[0];
      argsIndex++;
    }
    /**
     * @param {Object} iterable
     * @return {undefined}
     */
    var isArray = function(iterable) {
      var key;
      for (key in iterable) {
        if (Object.prototype.hasOwnProperty.call(iterable, key)) {
          if (actionArgs && "[object Object]" === Object.prototype.toString.call(iterable[key])) {
            object[key] = extend(true, object[key], iterable[key]);
          } else {
            object[key] = iterable[key];
          }
        }
      }
    };
    for (;argLength > argsIndex;argsIndex++) {
      var iterable = arguments[argsIndex];
      isArray(iterable);
    }
    return object;
  };
  /**
   * @param {Object} body
   * @return {?}
   */
  var cb = function(body) {
    return Math.max(body.scrollHeight, body.offsetHeight, body.clientHeight);
  };
  /**
   * @param {Object} target
   * @param {string} selector
   * @return {?}
   */
  var init = function(target, selector) {
    var attrs;
    var r;
    var inputStr = selector.charAt(0);
    /** @type {boolean} */
    var hasClassListProperty = "classList" in document.documentElement;
    if ("[" === inputStr) {
      selector = selector.substr(1, selector.length - 2);
      attrs = selector.split("=");
      if (attrs.length > 1) {
        /** @type {boolean} */
        r = true;
        attrs[1] = attrs[1].replace(/"/g, "").replace(/'/g, "");
      }
    }
    for (;target && target !== document;target = target.parentNode) {
      if ("." === inputStr) {
        if (hasClassListProperty) {
          if (target.classList.contains(selector.substr(1))) {
            return target;
          }
        } else {
          if ((new RegExp("(^|\\s)" + selector.substr(1) + "(\\s|$)")).test(target.className)) {
            return target;
          }
        }
      }
      if ("#" === inputStr && target.id === selector.substr(1)) {
        return target;
      }
      if ("[" === inputStr && target.hasAttribute(attrs[0])) {
        if (!r) {
          return target;
        }
        if (target.getAttribute(attrs[0]) === attrs[1]) {
          return target;
        }
      }
      if (target.tagName.toLowerCase() === selector) {
        return target;
      }
    }
    return null;
  };
  /**
   * @param {string} text
   * @return {?}
   */
  self.escapeCharacters = function(text) {
    if ("#" === text.charAt(0)) {
      text = text.substr(1);
    }
    var x;
    /** @type {string} */
    var code = String(text);
    /** @type {number} */
    var len = code.length;
    /** @type {number} */
    var i = -1;
    /** @type {string} */
    var lhs = "";
    /** @type {number} */
    var c = code.charCodeAt(0);
    for (;++i < len;) {
      if (x = code.charCodeAt(i), 0 === x) {
        throw new InvalidCharacterError("Invalid character: the input contains U+0000.");
      }
      lhs += x >= 1 && 31 >= x || (127 == x || (0 === i && (x >= 48 && 57 >= x) || 1 === i && (x >= 48 && (57 >= x && 45 === c)))) ? "\\" + x.toString(16) + " " : x >= 128 || (45 === x || (95 === x || (x >= 48 && 57 >= x || (x >= 65 && 90 >= x || x >= 97 && 122 >= x)))) ? code.charAt(i) : "\\" + code.charAt(i);
    }
    return "#" + lhs;
  };
  /**
   * @param {string} dataAndEvents
   * @param {number} k
   * @return {?}
   */
  var setEasingByName = function(dataAndEvents, k) {
    var property;
    return "easeInQuad" === dataAndEvents && (property = k * k), "easeOutQuad" === dataAndEvents && (property = k * (2 - k)), "easeInOutQuad" === dataAndEvents && (property = 0.5 > k ? 2 * k * k : -1 + (4 - 2 * k) * k), "easeInCubic" === dataAndEvents && (property = k * k * k), "easeOutCubic" === dataAndEvents && (property = --k * k * k + 1), "easeInOutCubic" === dataAndEvents && (property = 0.5 > k ? 4 * k * k * k : (k - 1) * (2 * k - 2) * (2 * k - 2) + 1), "easeInQuart" === dataAndEvents && (property =
    k * k * k * k), "easeOutQuart" === dataAndEvents && (property = 1 - --k * k * k * k), "easeInOutQuart" === dataAndEvents && (property = 0.5 > k ? 8 * k * k * k * k : 1 - 8 * --k * k * k * k), "easeInQuint" === dataAndEvents && (property = k * k * k * k * k), "easeOutQuint" === dataAndEvents && (property = 1 + --k * k * k * k * k), "easeInOutQuint" === dataAndEvents && (property = 0.5 > k ? 16 * k * k * k * k * k : 1 + 16 * --k * k * k * k * k), property || k;
  };
  /**
   * @param {Object} elem
   * @param {number} n
   * @param {number} opt_y
   * @return {?}
   */
  var offset = function(elem, n, opt_y) {
    /** @type {number} */
    var pos = 0;
    if (elem.offsetParent) {
      do {
        pos += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return pos = pos - n - opt_y, pos >= 0 ? pos : 0;
  };
  /**
   * @return {?}
   */
  var setup = function() {
    return Math.max(win.document.body.scrollHeight, win.document.documentElement.scrollHeight, win.document.body.offsetHeight, win.document.documentElement.offsetHeight, win.document.body.clientHeight, win.document.documentElement.clientHeight);
  };
  /**
   * @param {boolean} string
   * @return {?}
   */
  var parseJSON = function(string) {
    return string && ("object" == typeof JSON && "function" == typeof JSON.parse) ? JSON.parse(string) : {};
  };
  /**
   * @param {string} name
   * @param {boolean} value
   * @return {undefined}
   */
  var load = function(name, value) {
    if (win.history.pushState) {
      if (value || "true" === value) {
        if ("file:" !== win.location.protocol) {
          win.history.pushState(null, null, [win.location.protocol, "//", win.location.host, win.location.pathname, win.location.search, name].join(""));
        }
      }
    }
  };
  /**
   * @param {Object} e
   * @return {?}
   */
  var always = function(e) {
    return null === e ? 0 : cb(e) + e.offsetTop;
  };
  /**
   * @param {string} value
   * @param {Element} el
   * @param {Object} o
   * @return {undefined}
   */
  self.animateScroll = function(value, el, o) {
    var data = parseJSON(el ? el.getAttribute("data-options") : null);
    var settings = extend(settings || defaults, o || {}, data);
    /** @type {boolean} */
    var raw = "[object Number]" === Object.prototype.toString.call(value) ? true : false;
    var text = raw ? null : "#" === value ? win.document.documentElement : win.document.querySelector(value);
    if (raw || text) {
      var start = win.pageYOffset;
      if (!x) {
        x = win.document.querySelector(settings.selectorHeader);
      }
      if (!i) {
        i = always(x);
      }
      var elapsed;
      var startY;
      var date = raw ? value : offset(text, i, parseInt(settings.offset, 10));
      /** @type {number} */
      var diff = date - start;
      var options = setup();
      /** @type {number} */
      var cur_width = 0;
      if (!raw) {
        load(value, settings.updateURL);
      }
      /**
       * @param {?} y
       * @param {?} models
       * @param {number} id
       * @return {undefined}
       */
      var reset = function(y, models, id) {
        var start = win.pageYOffset;
        if (y == models || (start == models || win.innerHeight + start >= options)) {
          clearInterval(id);
          if (!raw) {
            text.focus();
          }
          settings.callback(value, el);
        }
      };
      /**
       * @return {undefined}
       */
      var draw = function() {
        cur_width += 16;
        /** @type {number} */
        elapsed = cur_width / parseInt(settings.speed, 10);
        /** @type {number} */
        elapsed = elapsed > 1 ? 1 : elapsed;
        startY = start + diff * setEasingByName(settings.easing, elapsed);
        win.scrollTo(0, Math.floor(startY));
        reset(startY, date, id);
      };
      /**
       * @return {undefined}
       */
      var animate = function() {
        clearInterval(id);
        /** @type {number} */
        id = setInterval(draw, 16);
      };
      if (0 === win.pageYOffset) {
        win.scrollTo(0, 0);
      }
      animate();
    }
  };
  /**
   * @param {Event} opts
   * @return {undefined}
   */
  var process = function(opts) {
    var a = init(opts.target, params.selector);
    if (a && "a" === a.tagName.toLowerCase()) {
      opts.preventDefault();
      var udataCur = self.escapeCharacters(a.hash);
      self.animateScroll(udataCur, a, params);
    }
  };
  /**
   * @param {?} srcFile
   * @return {undefined}
   */
  var handle = function(srcFile) {
    if (!abortTimeout) {
      /** @type {number} */
      abortTimeout = setTimeout(function() {
        /** @type {null} */
        abortTimeout = null;
        i = always(x);
      }, 66);
    }
  };
  return self.destroy = function() {
    if (params) {
      win.document.removeEventListener("click", process, false);
      win.removeEventListener("resize", handle, false);
      /** @type {null} */
      params = null;
      /** @type {null} */
      abortTimeout = null;
      /** @type {null} */
      x = null;
      /** @type {null} */
      i = null;
      /** @type {null} */
      id = null;
    }
  }, self.init = function(options) {
    if (u) {
      self.destroy();
      params = extend(defaults, options || {});
      x = win.document.querySelector(params.selectorHeader);
      i = always(x);
      win.document.addEventListener("click", process, false);
      if (x) {
        win.addEventListener("resize", handle, false);
      }
    }
  }, self;
});
!function(dataAndEvents, factory) {
  if ("function" == typeof define && define.amd) {
    define(factory);
  } else {
    if ("object" == typeof exports) {
      module.exports = factory(require, exports, module);
    } else {
      dataAndEvents.Tether = factory();
    }
  }
}(this, function(it, a, module) {
  /**
   * @param {?} dataAndEvents
   * @param {Function} init
   * @return {undefined}
   */
  function animate(dataAndEvents, init) {
    if (!(dataAndEvents instanceof init)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  /**
   * @param {?} element
   * @return {?}
   */
  function initialize(element) {
    var styles = getComputedStyle(element);
    var i = styles.position;
    if ("fixed" === i) {
      return element;
    }
    var target = element;
    for (;target = target.parentNode;) {
      var n = void 0;
      try {
        n = getComputedStyle(target);
      } catch (r) {
      }
      if ("undefined" == typeof n || null === n) {
        return target;
      }
      var style = n;
      var content = style.overflow;
      var type = style.overflowX;
      var left = style.overflowY;
      if (/(auto|scroll)/.test(content + left + type) && ("absolute" !== i || ["relative", "absolute", "fixed"].indexOf(n.position) >= 0)) {
        return target;
      }
    }
    return document.body;
  }
  /**
   * @param {Object} element
   * @return {?}
   */
  function getVisibleRectForElement(element) {
    var doc = void 0;
    if (element === document) {
      doc = document;
      element = document.documentElement;
    } else {
      doc = element.ownerDocument;
    }
    var docEl = doc.documentElement;
    var rect = {};
    var iterable = element.getBoundingClientRect();
    var key;
    for (key in iterable) {
      rect[key] = iterable[key];
    }
    var offset = f(doc);
    return rect.top -= offset.top, rect.left -= offset.left, "undefined" == typeof rect.width && (rect.width = document.body.scrollWidth - rect.left - rect.right), "undefined" == typeof rect.height && (rect.height = document.body.scrollHeight - rect.top - rect.bottom), rect.top = rect.top - docEl.clientTop, rect.left = rect.left - docEl.clientLeft, rect.right = doc.body.clientWidth - rect.width - rect.left, rect.bottom = doc.body.clientHeight - rect.height - rect.top, rect;
  }
  /**
   * @param {?} element
   * @return {?}
   */
  function listener(element) {
    return element.offsetParent || document.documentElement;
  }
  /**
   * @return {?}
   */
  function init() {
    /** @type {Element} */
    var f = document.createElement("div");
    /** @type {string} */
    f.style.width = "100%";
    /** @type {string} */
    f.style.height = "200px";
    /** @type {Element} */
    var element = document.createElement("div");
    extend(element.style, {
      position : "absolute",
      top : 0,
      left : 0,
      pointerEvents : "none",
      visibility : "hidden",
      width : "200px",
      height : "150px",
      overflow : "hidden"
    });
    element.appendChild(f);
    document.body.appendChild(element);
    var a = f.offsetWidth;
    /** @type {string} */
    element.style.overflow = "scroll";
    var b = f.offsetWidth;
    if (a === b) {
      /** @type {number} */
      b = element.clientWidth;
    }
    document.body.removeChild(element);
    /** @type {number} */
    var diff = a - b;
    return{
      width : diff,
      height : diff
    };
  }
  /**
   * @return {?}
   */
  function extend() {
    var object = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
    /** @type {Array} */
    var missing = [];
    return Array.prototype.push.apply(missing, arguments), missing.slice(1).forEach(function(iterable) {
      if (iterable) {
        var key;
        for (key in iterable) {
          if ({}.hasOwnProperty.call(iterable, key)) {
            object[key] = iterable[key];
          }
        }
      }
    }), object;
  }
  /**
   * @param {string} el
   * @param {string} className
   * @return {undefined}
   */
  function removeClass(el, className) {
    if ("undefined" != typeof el.classList) {
      className.split(" ").forEach(function(range) {
        if (range.trim()) {
          el.classList.remove(range);
        }
      });
    } else {
      /** @type {RegExp} */
      var rclass = new RegExp("(^| )" + className.split(" ").join("|") + "( |$)", "gi");
      var indents = classes(el).replace(rclass, " ");
      isObject(el, indents);
    }
  }
  /**
   * @param {string} el
   * @param {string} className
   * @return {undefined}
   */
  function addClass(el, className) {
    if ("undefined" != typeof el.classList) {
      className.split(" ").forEach(function(deepDataAndEvents) {
        if (deepDataAndEvents.trim()) {
          el.classList.add(deepDataAndEvents);
        }
      });
    } else {
      removeClass(el, className);
      /** @type {string} */
      var indents = classes(el) + (" " + className);
      isObject(el, indents);
    }
  }
  /**
   * @param {string} el
   * @param {string} selector
   * @return {?}
   */
  function hasClass(el, selector) {
    if ("undefined" != typeof el.classList) {
      return el.classList.contains(selector);
    }
    var cls = classes(el);
    return(new RegExp("(^| )" + selector + "( |$)", "gi")).test(cls);
  }
  /**
   * @param {Node} el
   * @return {?}
   */
  function classes(el) {
    return el.className instanceof SVGAnimatedString ? el.className.baseVal : el.className;
  }
  /**
   * @param {Element} obj
   * @param {string} val
   * @return {undefined}
   */
  function isObject(obj, val) {
    obj.setAttribute("class", val);
  }
  /**
   * @param {string} passes
   * @param {Array} arr
   * @param {Array} results
   * @return {undefined}
   */
  function next(passes, arr, results) {
    results.forEach(function(className) {
      if (-1 === arr.indexOf(className)) {
        if (hasClass(passes, className)) {
          removeClass(passes, className);
        }
      }
    });
    arr.forEach(function(className) {
      if (!hasClass(passes, className)) {
        addClass(passes, className);
      }
    });
  }
  /**
   * @param {?} dataAndEvents
   * @param {Function} init
   * @return {undefined}
   */
  function animate(dataAndEvents, init) {
    if (!(dataAndEvents instanceof init)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  /**
   * @param {?} a
   * @param {number} c
   * @return {?}
   */
  function match(a, c) {
    var b = arguments.length <= 2 || void 0 === arguments[2] ? 1 : arguments[2];
    return a + b >= c && c >= a - b;
  }
  /**
   * @return {?}
   */
  function now() {
    return "undefined" != typeof performance && "undefined" != typeof performance.now ? performance.now() : +new Date;
  }
  /**
   * @return {?}
   */
  function normalize() {
    var offset = {
      top : 0,
      left : 0
    };
    /** @type {number} */
    var l = arguments.length;
    /** @type {Array} */
    var args = Array(l);
    /** @type {number} */
    var i = 0;
    for (;l > i;i++) {
      args[i] = arguments[i];
    }
    return args.forEach(function(parentOffset) {
      var top = parentOffset.top;
      var left = parentOffset.left;
      if ("string" == typeof top) {
        /** @type {number} */
        top = parseFloat(top, 10);
      }
      if ("string" == typeof left) {
        /** @type {number} */
        left = parseFloat(left, 10);
      }
      offset.top += top;
      offset.left += left;
    }), offset;
  }
  /**
   * @param {?} style
   * @param {?} buffer
   * @return {?}
   */
  function callback(style, buffer) {
    return "string" == typeof style.left && (-1 !== style.left.indexOf("%") && (style.left = parseFloat(style.left, 10) / 100 * buffer.width)), "string" == typeof style.top && (-1 !== style.top.indexOf("%") && (style.top = parseFloat(style.top, 10) / 100 * buffer.height)), style;
  }
  /**
   * @param {?} args
   * @param {Object} element
   * @return {?}
   */
  function move(args, element) {
    return "scrollParent" === element ? element = args.scrollParent : "window" === element && (element = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset]), element === document && (element = element.documentElement), "undefined" != typeof element.nodeType && !function() {
      var b = getVisibleRectForElement(element);
      var c = b;
      var s = getComputedStyle(element);
      /** @type {Array} */
      element = [c.left, c.top, b.width + c.left, b.height + c.top];
      positions.forEach(function(dir, propName) {
        dir = dir[0].toUpperCase() + dir.substr(1);
        if ("Top" === dir || "Left" === dir) {
          element[propName] += parseFloat(s["border" + dir + "Width"]);
        } else {
          element[propName] -= parseFloat(s["border" + dir + "Width"]);
        }
      });
    }(), element;
  }
  var make = function() {
    /**
     * @param {Function} object
     * @param {Array} d
     * @return {undefined}
     */
    function defineProperty(object, d) {
      /** @type {number} */
      var i = 0;
      for (;i < d.length;i++) {
        var desc = d[i];
        desc.enumerable = desc.enumerable || false;
        /** @type {boolean} */
        desc.configurable = true;
        if ("value" in desc) {
          /** @type {boolean} */
          desc.writable = true;
        }
        Object.defineProperty(object, desc.key, desc);
      }
    }
    return function(x, current, a) {
      return current && defineProperty(x.prototype, current), a && defineProperty(x, a), x;
    };
  }();
  var settings = void 0;
  if ("undefined" == typeof settings) {
    settings = {
      modules : []
    };
  }
  var _safe = function() {
    /** @type {number} */
    var t = 0;
    return function() {
      return++t;
    };
  }();
  var replacement_positions = {};
  /**
   * @param {Document} view
   * @return {?}
   */
  var f = function(view) {
    var el = view._tetherZeroElement;
    if ("undefined" == typeof el) {
      el = view.createElement("div");
      el.setAttribute("data-tether-id", _safe());
      extend(el.style, {
        top : 0,
        left : 0,
        position : "absolute"
      });
      view.body.appendChild(el);
      view._tetherZeroElement = el;
    }
    var CURRENT_LEVEL = el.getAttribute("data-tether-id");
    if ("undefined" == typeof replacement_positions[CURRENT_LEVEL]) {
      replacement_positions[CURRENT_LEVEL] = {};
      var iterable = el.getBoundingClientRect();
      var key;
      for (key in iterable) {
        replacement_positions[CURRENT_LEVEL][key] = iterable[key];
      }
      defer(function() {
        delete replacement_positions[CURRENT_LEVEL];
      });
    }
    return replacement_positions[CURRENT_LEVEL];
  };
  /** @type {Array} */
  var eventPath = [];
  /**
   * @param {Function} parent
   * @return {undefined}
   */
  var defer = function(parent) {
    eventPath.push(parent);
  };
  /**
   * @return {undefined}
   */
  var flush = function() {
    var i = void 0;
    for (;i = eventPath.pop();) {
      i();
    }
  };
  var proto = function() {
    /**
     * @return {undefined}
     */
    function init() {
      animate(this, init);
    }
    return make(init, [{
      key : "on",
      /**
       * @param {string} event
       * @param {?} expectedNumberOfNonCommentArgs
       * @param {Object} dataAndEvents
       * @return {undefined}
       */
      value : function(event, expectedNumberOfNonCommentArgs, dataAndEvents) {
        var once = arguments.length <= 3 || void 0 === arguments[3] ? false : arguments[3];
        if ("undefined" == typeof this.bindings) {
          this.bindings = {};
        }
        if ("undefined" == typeof this.bindings[event]) {
          /** @type {Array} */
          this.bindings[event] = [];
        }
        this.bindings[event].push({
          handler : expectedNumberOfNonCommentArgs,
          ctx : dataAndEvents,
          once : once
        });
      }
    }, {
      key : "once",
      /**
       * @param {string} event
       * @param {?} expectedNumberOfNonCommentArgs
       * @param {boolean} data
       * @return {undefined}
       */
      value : function(event, expectedNumberOfNonCommentArgs, data) {
        this.on(event, expectedNumberOfNonCommentArgs, data, true);
      }
    }, {
      key : "off",
      /**
       * @param {string} event
       * @param {?} expectedNumberOfNonCommentArgs
       * @return {undefined}
       */
      value : function(event, expectedNumberOfNonCommentArgs) {
        if ("undefined" == typeof this.bindings || "undefined" == typeof this.bindings[event]) {
          if ("undefined" == typeof expectedNumberOfNonCommentArgs) {
            delete this.bindings[event];
          } else {
            /** @type {number} */
            var i = 0;
            for (;i < this.bindings[event].length;) {
              if (this.bindings[event][i].handler === expectedNumberOfNonCommentArgs) {
                this.bindings[event].splice(i, 1);
              } else {
                ++i;
              }
            }
          }
        }
      }
    }, {
      key : "trigger",
      /**
       * @param {string} event
       * @return {undefined}
       */
      value : function(event) {
        if ("undefined" != typeof this.bindings && this.bindings[event]) {
          /** @type {number} */
          var i = 0;
          /** @type {number} */
          var len = arguments.length;
          /** @type {Array} */
          var a = Array(len > 1 ? len - 1 : 0);
          /** @type {number} */
          var n = 1;
          for (;len > n;n++) {
            a[n - 1] = arguments[n];
          }
          for (;i < this.bindings[event].length;) {
            var obj = this.bindings[event][i];
            var fn = obj.handler;
            var context = obj.ctx;
            var terse = obj.once;
            var that = context;
            if ("undefined" == typeof that) {
              that = this;
            }
            fn.apply(that, a);
            if (terse) {
              this.bindings[event].splice(i, 1);
            } else {
              ++i;
            }
          }
        }
      }
    }]), init;
  }();
  settings.Utils = {
    /** @type {function (?): ?} */
    getScrollParent : initialize,
    /** @type {function (Object): ?} */
    getBounds : getVisibleRectForElement,
    /** @type {function (?): ?} */
    getOffsetParent : listener,
    /** @type {function (): ?} */
    extend : extend,
    /** @type {function (string, string): undefined} */
    addClass : addClass,
    /** @type {function (string, string): undefined} */
    removeClass : removeClass,
    /** @type {function (string, string): ?} */
    hasClass : hasClass,
    /** @type {function (string, Array, Array): undefined} */
    updateClasses : next,
    /** @type {function (Function): undefined} */
    defer : defer,
    /** @type {function (): undefined} */
    flush : flush,
    uniqueId : _safe,
    Evented : proto,
    /** @type {function (): ?} */
    getScrollBarSize : init
  };
  var get = function() {
    /**
     * @param {?} dataAndEvents
     * @param {number} deepDataAndEvents
     * @return {?}
     */
    function clone(dataAndEvents, deepDataAndEvents) {
      /** @type {Array} */
      var res = [];
      /** @type {boolean} */
      var callback2 = true;
      /** @type {boolean} */
      var n = false;
      var bulk = void 0;
      try {
        var next;
        var exports = dataAndEvents[Symbol.iterator]();
        for (;!(callback2 = (next = exports.next()).done) && (res.push(next.value), !deepDataAndEvents || res.length !== deepDataAndEvents);callback2 = true) {
        }
      } catch (fn) {
        /** @type {boolean} */
        n = true;
        bulk = fn;
      } finally {
        try {
          if (!callback2) {
            if (exports["return"]) {
              exports["return"]();
            }
          }
        } finally {
          if (n) {
            throw bulk;
          }
        }
      }
      return res;
    }
    return function(object, deepDataAndEvents) {
      if (Array.isArray(object)) {
        return object;
      }
      if (Symbol.iterator in Object(object)) {
        return clone(object, deepDataAndEvents);
      }
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
  }();
  make = function() {
    /**
     * @param {Function} object
     * @param {Array} d
     * @return {undefined}
     */
    function defineProperty(object, d) {
      /** @type {number} */
      var i = 0;
      for (;i < d.length;i++) {
        var desc = d[i];
        desc.enumerable = desc.enumerable || false;
        /** @type {boolean} */
        desc.configurable = true;
        if ("value" in desc) {
          /** @type {boolean} */
          desc.writable = true;
        }
        Object.defineProperty(object, desc.key, desc);
      }
    }
    return function(x, current, a) {
      return current && defineProperty(x.prototype, current), a && defineProperty(x, a), x;
    };
  }();
  if ("undefined" == typeof settings) {
    throw new Error("You must include the utils.js file before tether.js");
  }
  var options = settings.Utils;
  /** @type {function (?): ?} */
  initialize = options.getScrollParent;
  /** @type {function (Object): ?} */
  getVisibleRectForElement = options.getBounds;
  /** @type {function (?): ?} */
  listener = options.getOffsetParent;
  /** @type {function (): ?} */
  extend = options.extend;
  /** @type {function (string, string): undefined} */
  addClass = options.addClass;
  /** @type {function (string, string): undefined} */
  removeClass = options.removeClass;
  /** @type {function (string, Array, Array): undefined} */
  next = options.updateClasses;
  /** @type {function (Function): undefined} */
  defer = options.defer;
  /** @type {function (): undefined} */
  flush = options.flush;
  /** @type {function (): ?} */
  init = options.getScrollBarSize;
  var prefixed = function() {
    if ("undefined" == typeof document) {
      return "";
    }
    /** @type {Element} */
    var elem = document.createElement("div");
    /** @type {Array} */
    var props = ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"];
    /** @type {number} */
    var i = 0;
    for (;i < props.length;++i) {
      var prop = props[i];
      if (void 0 !== elem.style[prop]) {
        return prop;
      }
    }
  }();
  /** @type {Array} */
  var xs = [];
  /**
   * @return {undefined}
   */
  var end = function() {
    xs.forEach(function($position) {
      $position.position(false);
    });
    flush();
  };
  !function() {
    /** @type {null} */
    var last = null;
    /** @type {null} */
    var y = null;
    /** @type {null} */
    var u = null;
    /**
     * @return {?}
     */
    var completed = function next() {
      return "undefined" != typeof y && y > 16 ? (y = Math.min(y - 16, 250), void(u = setTimeout(next, 250))) : void("undefined" != typeof last && now() - last < 10 || ("undefined" != typeof u && (clearTimeout(u), u = null), last = now(), end(), y = now() - last));
    };
    if ("undefined" != typeof window) {
      ["resize", "scroll", "touchmove"].forEach(function(eventName) {
        window.addEventListener(eventName, completed);
      });
    }
  }();
  var SIDES = {
    center : "center",
    left : "right",
    right : "left"
  };
  var position = {
    middle : "middle",
    top : "bottom",
    bottom : "top"
  };
  var re = {
    top : 0,
    left : 0,
    middle : "50%",
    center : "50%",
    bottom : "100%",
    right : "100%"
  };
  /**
   * @param {?} cfg
   * @param {?} pointer
   * @return {?}
   */
  var update = function(cfg, pointer) {
    var left = cfg.left;
    var top = cfg.top;
    return "auto" === left && (left = SIDES[pointer.left]), "auto" === top && (top = position[pointer.top]), {
      left : left,
      top : top
    };
  };
  /**
   * @param {?} cfg
   * @return {?}
   */
  var fn = function(cfg) {
    var left = cfg.left;
    var top = cfg.top;
    return "undefined" != typeof re[cfg.left] && (left = re[cfg.left]), "undefined" != typeof re[cfg.top] && (top = re[cfg.top]), {
      left : left,
      top : top
    };
  };
  /**
   * @param {?} rules
   * @return {?}
   */
  var func = function(rules) {
    var key = rules.split(" ");
    var values = get(key, 2);
    var b = values[0];
    var value = values[1];
    return{
      top : b,
      left : value
    };
  };
  /** @type {function (?): ?} */
  var white = func;
  var attributes = function() {
    /**
     * @param {?} options
     * @return {undefined}
     */
    function init(options) {
      var uniqs = this;
      animate(this, init);
      this.position = this.position.bind(this);
      xs.push(this);
      /** @type {Array} */
      this.history = [];
      this.setOptions(options, false);
      settings.modules.forEach(function(module) {
        if ("undefined" != typeof module.initialize) {
          module.initialize.call(uniqs);
        }
      });
      this.position();
    }
    return make(init, [{
      key : "getClass",
      /**
       * @return {?}
       */
      value : function() {
        var index = arguments.length <= 0 || void 0 === arguments[0] ? "" : arguments[0];
        var classes = this.options.classes;
        return "undefined" != typeof classes && classes[index] ? this.options.classes[index] : this.options.classPrefix ? this.options.classPrefix + "-" + index : index;
      }
    }, {
      key : "setOptions",
      /**
       * @param {string} event
       * @return {undefined}
       */
      value : function(event) {
        var values = this;
        var lock = arguments.length <= 1 || void 0 === arguments[1] ? true : arguments[1];
        var attributes = {
          offset : "0 0",
          targetOffset : "0 0",
          targetAttachment : "auto auto",
          classPrefix : "tether"
        };
        this.options = extend(attributes, event);
        var options = this.options;
        var element = options.element;
        var target = options.target;
        var async = options.targetModifier;
        if (this.element = element, this.target = target, this.targetModifier = async, "viewport" === this.target ? (this.target = document.body, this.targetModifier = "visible") : "scroll-handle" === this.target && (this.target = document.body, this.targetModifier = "scroll-handle"), ["element", "target"].forEach(function(i) {
          if ("undefined" == typeof values[i]) {
            throw new Error("Tether Error: Both element and target must be defined");
          }
          if ("undefined" != typeof values[i].jquery) {
            values[i] = values[i][0];
          } else {
            if ("string" == typeof values[i]) {
              /** @type {(Element|null)} */
              values[i] = document.querySelector(values[i]);
            }
          }
        }), addClass(this.element, this.getClass("element")), this.options.addTargetClasses !== false && addClass(this.target, this.getClass("target")), !this.options.attachment) {
          throw new Error("Tether Error: You must provide an attachment");
        }
        this.targetAttachment = white(this.options.targetAttachment);
        this.attachment = white(this.options.attachment);
        this.offset = func(this.options.offset);
        this.targetOffset = func(this.options.targetOffset);
        if ("undefined" != typeof this.scrollParent) {
          this.disable();
        }
        if ("scroll-handle" === this.targetModifier) {
          this.scrollParent = this.target;
        } else {
          this.scrollParent = initialize(this.target);
        }
        if (this.options.enabled !== false) {
          this.enable(lock);
        }
      }
    }, {
      key : "getTargetBounds",
      /**
       * @return {?}
       */
      value : function() {
        if ("undefined" == typeof this.targetModifier) {
          return getVisibleRectForElement(this.target);
        }
        if ("visible" === this.targetModifier) {
          if (this.target === document.body) {
            return{
              top : pageYOffset,
              left : pageXOffset,
              height : innerHeight,
              width : innerWidth
            };
          }
          var rect = getVisibleRectForElement(this.target);
          var style = {
            height : rect.height,
            width : rect.width,
            top : rect.top,
            left : rect.left
          };
          return style.height = Math.min(style.height, rect.height - (pageYOffset - rect.top)), style.height = Math.min(style.height, rect.height - (rect.top + rect.height - (pageYOffset + innerHeight))), style.height = Math.min(innerHeight, style.height), style.height -= 2, style.width = Math.min(style.width, rect.width - (pageXOffset - rect.left)), style.width = Math.min(style.width, rect.width - (rect.left + rect.width - (pageXOffset + innerWidth))), style.width = Math.min(innerWidth, style.width),
          style.width -= 2, style.top < pageYOffset && (style.top = pageYOffset), style.left < pageXOffset && (style.left = pageXOffset), style;
        }
        if ("scroll-handle" === this.targetModifier) {
          rect = void 0;
          var el = this.target;
          if (el === document.body) {
            /** @type {Element} */
            el = document.documentElement;
            rect = {
              left : pageXOffset,
              top : pageYOffset,
              height : innerHeight,
              width : innerWidth
            };
          } else {
            rect = getVisibleRectForElement(el);
          }
          var css = getComputedStyle(el);
          /** @type {boolean} */
          var n = el.scrollWidth > el.clientWidth || ([css.overflow, css.overflowX].indexOf("scroll") >= 0 || this.target !== document.body);
          /** @type {number} */
          var clientY = 0;
          if (n) {
            /** @type {number} */
            clientY = 15;
          }
          /** @type {number} */
          var y = rect.height - parseFloat(css.borderTopWidth) - parseFloat(css.borderBottomWidth) - clientY;
          style = {
            width : 15,
            height : 0.975 * y * (y / el.scrollHeight),
            left : rect.left + rect.width - parseFloat(css.borderLeftWidth) - 15
          };
          /** @type {number} */
          var height = 0;
          if (408 > y) {
            if (this.target === document.body) {
              /** @type {number} */
              height = -1.1E-4 * Math.pow(y, 2) - 0.00727 * y + 22.58;
            }
          }
          if (this.target !== document.body) {
            /** @type {number} */
            style.height = Math.max(style.height, 24);
          }
          /** @type {number} */
          var quadWidth = this.target.scrollTop / (el.scrollHeight - y);
          return style.top = quadWidth * (y - style.height - height) + rect.top + parseFloat(css.borderTopWidth), this.target === document.body && (style.height = Math.max(style.height, 24)), style;
        }
      }
    }, {
      key : "clearCache",
      /**
       * @return {undefined}
       */
      value : function() {
        this._cache = {};
      }
    }, {
      key : "cache",
      /**
       * @param {string} event
       * @param {?} expectedNumberOfNonCommentArgs
       * @return {?}
       */
      value : function(event, expectedNumberOfNonCommentArgs) {
        return "undefined" == typeof this._cache && (this._cache = {}), "undefined" == typeof this._cache[event] && (this._cache[event] = expectedNumberOfNonCommentArgs.call(this)), this._cache[event];
      }
    }, {
      key : "enable",
      /**
       * @return {undefined}
       */
      value : function() {
        var t = arguments.length <= 0 || void 0 === arguments[0] ? true : arguments[0];
        if (this.options.addTargetClasses !== false) {
          addClass(this.target, this.getClass("enabled"));
        }
        addClass(this.element, this.getClass("enabled"));
        /** @type {boolean} */
        this.enabled = true;
        if (this.scrollParent !== document) {
          this.scrollParent.addEventListener("scroll", this.position);
        }
        if (t) {
          this.position();
        }
      }
    }, {
      key : "disable",
      /**
       * @return {undefined}
       */
      value : function() {
        removeClass(this.target, this.getClass("enabled"));
        removeClass(this.element, this.getClass("enabled"));
        /** @type {boolean} */
        this.enabled = false;
        if ("undefined" != typeof this.scrollParent) {
          this.scrollParent.removeEventListener("scroll", this.position);
        }
      }
    }, {
      key : "destroy",
      /**
       * @return {undefined}
       */
      value : function() {
        var bup = this;
        this.disable();
        xs.forEach(function(a, x) {
          return a === bup ? void xs.splice(x, 1) : void 0;
        });
      }
    }, {
      key : "updateAttachClasses",
      /**
       * @param {string} event
       * @param {Object} expectedNumberOfNonCommentArgs
       * @return {undefined}
       */
      value : function(event, expectedNumberOfNonCommentArgs) {
        var self = this;
        event = event || this.attachment;
        expectedNumberOfNonCommentArgs = expectedNumberOfNonCommentArgs || this.targetAttachment;
        /** @type {Array} */
        var props = ["left", "top", "bottom", "right", "middle", "center"];
        if ("undefined" != typeof this._addAttachClasses) {
          if (this._addAttachClasses.length) {
            this._addAttachClasses.splice(0, this._addAttachClasses.length);
          }
        }
        if ("undefined" == typeof this._addAttachClasses) {
          /** @type {Array} */
          this._addAttachClasses = [];
        }
        var eventPath = this._addAttachClasses;
        if (event.top) {
          eventPath.push(this.getClass("element-attached") + "-" + event.top);
        }
        if (event.left) {
          eventPath.push(this.getClass("element-attached") + "-" + event.left);
        }
        if (expectedNumberOfNonCommentArgs.top) {
          eventPath.push(this.getClass("target-attached") + "-" + expectedNumberOfNonCommentArgs.top);
        }
        if (expectedNumberOfNonCommentArgs.left) {
          eventPath.push(this.getClass("target-attached") + "-" + expectedNumberOfNonCommentArgs.left);
        }
        /** @type {Array} */
        var matched = [];
        props.forEach(function(day) {
          matched.push(self.getClass("element-attached") + "-" + day);
          matched.push(self.getClass("target-attached") + "-" + day);
        });
        defer(function() {
          if ("undefined" != typeof self._addAttachClasses) {
            next(self.element, self._addAttachClasses, matched);
            if (self.options.addTargetClasses !== false) {
              next(self.target, self._addAttachClasses, matched);
            }
            delete self._addAttachClasses;
          }
        });
      }
    }, {
      key : "position",
      /**
       * @return {?}
       */
      value : function() {
        var self = this;
        var e = arguments.length <= 0 || void 0 === arguments[0] ? true : arguments[0];
        if (this.enabled) {
          this.clearCache();
          var el = update(this.targetAttachment, this.attachment);
          this.updateAttachClasses(this.attachment, el);
          var element = this.cache("element-bounds", function() {
            return getVisibleRectForElement(self.element);
          });
          var originalWidth = element.width;
          var originalHeight = element.height;
          if (0 === originalWidth && (0 === originalHeight && "undefined" != typeof this.lastSize)) {
            var preloader = this.lastSize;
            originalWidth = preloader.width;
            originalHeight = preloader.height;
          } else {
            this.lastSize = {
              width : originalWidth,
              height : originalHeight
            };
          }
          var offset = this.cache("target-bounds", function() {
            return self.getTargetBounds();
          });
          var pos = offset;
          var ret = callback(fn(this.attachment), {
            width : originalWidth,
            height : originalHeight
          });
          var bounds = callback(fn(el), pos);
          var value = callback(this.offset, {
            width : originalWidth,
            height : originalHeight
          });
          var parentName = callback(this.targetOffset, pos);
          ret = normalize(ret, value);
          bounds = normalize(bounds, parentName);
          /** @type {number} */
          var l = offset.left + bounds.left - ret.left;
          /** @type {number} */
          var scrollTop = offset.top + bounds.top - ret.top;
          /** @type {number} */
          var j = 0;
          for (;j < settings.modules.length;++j) {
            var rule = settings.modules[j];
            var name = rule.position.call(this, {
              left : l,
              top : scrollTop,
              targetAttachment : el,
              targetPos : offset,
              elementPos : element,
              offset : ret,
              targetOffset : bounds,
              manualOffset : value,
              manualTargetOffset : parentName,
              scrollbarSize : relativeRect,
              attachment : this.attachment
            });
            if (name === false) {
              return false;
            }
            if ("undefined" != typeof name) {
              if ("object" == typeof name) {
                scrollTop = name.top;
                l = name.left;
              }
            }
          }
          var t = {
            page : {
              top : scrollTop,
              left : l
            },
            viewport : {
              top : scrollTop - pageYOffset,
              bottom : pageYOffset - scrollTop - originalHeight + innerHeight,
              left : l - pageXOffset,
              right : pageXOffset - l - originalWidth + innerWidth
            }
          };
          var relativeRect = void 0;
          return document.body.scrollWidth > window.innerWidth && (relativeRect = this.cache("scrollbar-size", init), t.viewport.bottom -= relativeRect.height), document.body.scrollHeight > window.innerHeight && (relativeRect = this.cache("scrollbar-size", init), t.viewport.right -= relativeRect.width), (-1 === ["", "static"].indexOf(document.body.style.position) || -1 === ["", "static"].indexOf(document.body.parentElement.style.position)) && (t.page.bottom = document.body.scrollHeight - scrollTop -
          originalHeight, t.page.right = document.body.scrollWidth - l - originalWidth), "undefined" != typeof this.options.optimizations && (this.options.optimizations.moveElement !== false && ("undefined" == typeof this.targetModifier && !function() {
            var e = self.cache("target-offsetparent", function() {
              return listener(self.target);
            });
            var bounds = self.cache("target-offsetparent-bounds", function() {
              return getVisibleRectForElement(e);
            });
            var styles = getComputedStyle(e);
            var b2 = bounds;
            var r = {};
            if (["Top", "Left", "Bottom", "Right"].forEach(function(b) {
              /** @type {number} */
              r[b.toLowerCase()] = parseFloat(styles["border" + b + "Width"]);
            }), bounds.right = document.body.scrollWidth - bounds.left - b2.width + r.right, bounds.bottom = document.body.scrollHeight - bounds.top - b2.height + r.bottom, t.page.top >= bounds.top + r.top && (t.page.bottom >= bounds.bottom && (t.page.left >= bounds.left + r.left && t.page.right >= bounds.right))) {
              var top = e.scrollTop;
              var left = e.scrollLeft;
              t.offset = {
                top : t.page.top - bounds.top + top - r.top,
                left : t.page.left - bounds.left + left - r.left
              };
            }
          }())), this.move(t), this.history.unshift(t), this.history.length > 3 && this.history.pop(), e && flush(), true;
        }
      }
    }, {
      key : "move",
      /**
       * @param {Object} event
       * @return {undefined}
       */
      value : function(event) {
        var self = this;
        if ("undefined" != typeof this.element.parentNode) {
          var data = {};
          var type;
          for (type in event) {
            data[type] = {};
            var key;
            for (key in event[type]) {
              /** @type {boolean} */
              var r = false;
              /** @type {number} */
              var i = 0;
              for (;i < this.history.length;++i) {
                var def = this.history[i];
                if ("undefined" != typeof def[type] && !match(def[type][key], event[type][key])) {
                  /** @type {boolean} */
                  r = true;
                  break;
                }
              }
              if (!r) {
                /** @type {boolean} */
                data[type][key] = true;
              }
            }
          }
          var style = {
            top : "",
            left : "",
            right : "",
            bottom : ""
          };
          /**
           * @param {?} _
           * @param {?} frame
           * @return {undefined}
           */
          var callback = function(_, frame) {
            /** @type {boolean} */
            var showMessage = "undefined" != typeof self.options.optimizations;
            var body = showMessage ? self.options.optimizations.gpu : null;
            if (body !== false) {
              var minY = void 0;
              var value = void 0;
              if (_.top) {
                /** @type {number} */
                style.top = 0;
                minY = frame.top;
              } else {
                /** @type {number} */
                style.bottom = 0;
                /** @type {number} */
                minY = -frame.bottom;
              }
              if (_.left) {
                /** @type {number} */
                style.left = 0;
                value = frame.left;
              } else {
                /** @type {number} */
                style.right = 0;
                /** @type {number} */
                value = -frame.right;
              }
              /** @type {string} */
              style[prefixed] = "translateX(" + Math.round(value) + "px) translateY(" + Math.round(minY) + "px)";
              if ("msTransform" !== prefixed) {
                style[prefixed] += " translateZ(0)";
              }
            } else {
              if (_.top) {
                /** @type {string} */
                style.top = frame.top + "px";
              } else {
                /** @type {string} */
                style.bottom = frame.bottom + "px";
              }
              if (_.left) {
                /** @type {string} */
                style.left = frame.left + "px";
              } else {
                /** @type {string} */
                style.right = frame.right + "px";
              }
            }
          };
          /** @type {boolean} */
          var u = false;
          if ((data.page.top || data.page.bottom) && (data.page.left || data.page.right) ? (style.position = "absolute", callback(data.page, event.page)) : (data.viewport.top || data.viewport.bottom) && (data.viewport.left || data.viewport.right) ? (style.position = "fixed", callback(data.viewport, event.viewport)) : "undefined" != typeof data.offset && (data.offset.top && data.offset.left) ? !function() {
            /** @type {string} */
            style.position = "absolute";
            var body = self.cache("target-offsetparent", function() {
              return listener(self.target);
            });
            if (listener(self.element) !== body) {
              defer(function() {
                self.element.parentNode.removeChild(self.element);
                body.appendChild(self.element);
              });
            }
            callback(data.offset, event.offset);
            /** @type {boolean} */
            u = true;
          }() : (style.position = "absolute", callback({
            top : true,
            left : true
          }, event.page)), !u) {
            /** @type {boolean} */
            var p = true;
            var target = this.element.parentNode;
            for (;target && "BODY" !== target.tagName;) {
              if ("static" !== getComputedStyle(target).position) {
                /** @type {boolean} */
                p = false;
                break;
              }
              target = target.parentNode;
            }
            if (!p) {
              this.element.parentNode.removeChild(this.element);
              document.body.appendChild(this.element);
            }
          }
          var flags = {};
          /** @type {boolean} */
          var v = false;
          for (key in style) {
            var value = style[key];
            var currentValue = this.element.style[key];
            if ("" !== currentValue) {
              if ("" !== value) {
                if (["top", "left", "bottom", "right"].indexOf(key) >= 0) {
                  /** @type {number} */
                  currentValue = parseFloat(currentValue);
                  /** @type {number} */
                  value = parseFloat(value);
                }
              }
            }
            if (currentValue !== value) {
              /** @type {boolean} */
              v = true;
              flags[key] = value;
            }
          }
          if (v) {
            defer(function() {
              extend(self.element.style, flags);
            });
          }
        }
      }
    }]), init;
  }();
  /** @type {Array} */
  attributes.modules = [];
  /** @type {function (): undefined} */
  settings.position = end;
  var oldconfig = extend(attributes, settings);
  get = function() {
    /**
     * @param {?} dataAndEvents
     * @param {number} deepDataAndEvents
     * @return {?}
     */
    function clone(dataAndEvents, deepDataAndEvents) {
      /** @type {Array} */
      var res = [];
      /** @type {boolean} */
      var callback2 = true;
      /** @type {boolean} */
      var n = false;
      var bulk = void 0;
      try {
        var next;
        var exports = dataAndEvents[Symbol.iterator]();
        for (;!(callback2 = (next = exports.next()).done) && (res.push(next.value), !deepDataAndEvents || res.length !== deepDataAndEvents);callback2 = true) {
        }
      } catch (fn) {
        /** @type {boolean} */
        n = true;
        bulk = fn;
      } finally {
        try {
          if (!callback2) {
            if (exports["return"]) {
              exports["return"]();
            }
          }
        } finally {
          if (n) {
            throw bulk;
          }
        }
      }
      return res;
    }
    return function(object, deepDataAndEvents) {
      if (Array.isArray(object)) {
        return object;
      }
      if (Symbol.iterator in Object(object)) {
        return clone(object, deepDataAndEvents);
      }
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
  }();
  options = settings.Utils;
  /** @type {function (Object): ?} */
  getVisibleRectForElement = options.getBounds;
  /** @type {function (): ?} */
  extend = options.extend;
  /** @type {function (string, Array, Array): undefined} */
  next = options.updateClasses;
  /** @type {function (Function): undefined} */
  defer = options.defer;
  /** @type {Array} */
  var positions = ["left", "top", "right", "bottom"];
  settings.modules.push({
    /**
     * @param {Object} o
     * @return {?}
     */
    position : function(o) {
      var that = this;
      var a = o.top;
      var x = o.left;
      var args = o.targetAttachment;
      if (!this.options.constraints) {
        return true;
      }
      var div = this.cache("element-bounds", function() {
        return getVisibleRectForElement(that.element);
      });
      var b = div.height;
      var width = div.width;
      if (0 === width && (0 === b && "undefined" != typeof this.lastSize)) {
        var item = this.lastSize;
        width = item.width;
        b = item.height;
      }
      var context = this.cache("target-bounds", function() {
        return that.getTargetBounds();
      });
      var j = context.height;
      var itemWidth = context.width;
      /** @type {Array} */
      var matched = [this.getClass("pinned"), this.getClass("out-of-bounds")];
      this.options.constraints.forEach(function(event) {
        var cur = event.outOfBoundsClass;
        var next = event.pinnedClass;
        if (cur) {
          matched.push(cur);
        }
        if (next) {
          matched.push(next);
        }
      });
      matched.forEach(function(x) {
        ["left", "top", "right", "bottom"].forEach(function(y) {
          matched.push(x + "-" + y);
        });
      });
      /** @type {Array} */
      var results = [];
      var options = extend({}, args);
      var s = extend({}, this.attachment);
      return this.options.constraints.forEach(function(event) {
        var t = event.to;
        var current = event.attachment;
        var type = event.pin;
        if ("undefined" == typeof current) {
          /** @type {string} */
          current = "";
        }
        var win = void 0;
        var container = void 0;
        if (current.indexOf(" ") >= 0) {
          var self = current.split(" ");
          var children = get(self, 2);
          container = children[0];
          win = children[1];
        } else {
          win = container = current;
        }
        var p = move(that, t);
        if ("target" === container || "both" === container) {
          if (a < p[1]) {
            if ("top" === options.top) {
              a += j;
              /** @type {string} */
              options.top = "bottom";
            }
          }
          if (a + b > p[3]) {
            if ("bottom" === options.top) {
              a -= j;
              /** @type {string} */
              options.top = "top";
            }
          }
        }
        if ("together" === container) {
          if (a < p[1]) {
            if ("top" === options.top) {
              if ("bottom" === s.top) {
                a += j;
                /** @type {string} */
                options.top = "bottom";
                a += b;
                /** @type {string} */
                s.top = "top";
              } else {
                if ("top" === s.top) {
                  a += j;
                  /** @type {string} */
                  options.top = "bottom";
                  a -= b;
                  /** @type {string} */
                  s.top = "bottom";
                }
              }
            }
          }
          if (a + b > p[3]) {
            if ("bottom" === options.top) {
              if ("top" === s.top) {
                a -= j;
                /** @type {string} */
                options.top = "top";
                a -= b;
                /** @type {string} */
                s.top = "bottom";
              } else {
                if ("bottom" === s.top) {
                  a -= j;
                  /** @type {string} */
                  options.top = "top";
                  a += b;
                  /** @type {string} */
                  s.top = "top";
                }
              }
            }
          }
          if ("middle" === options.top) {
            if (a + b > p[3] && "top" === s.top) {
              a -= b;
              /** @type {string} */
              s.top = "bottom";
            } else {
              if (a < p[1]) {
                if ("bottom" === s.top) {
                  a += b;
                  /** @type {string} */
                  s.top = "top";
                }
              }
            }
          }
        }
        if ("target" === win || "both" === win) {
          if (x < p[0]) {
            if ("left" === options.left) {
              x += itemWidth;
              /** @type {string} */
              options.left = "right";
            }
          }
          if (x + width > p[2]) {
            if ("right" === options.left) {
              x -= itemWidth;
              /** @type {string} */
              options.left = "left";
            }
          }
        }
        if ("together" === win) {
          if (x < p[0] && "left" === options.left) {
            if ("right" === s.left) {
              x += itemWidth;
              /** @type {string} */
              options.left = "right";
              x += width;
              /** @type {string} */
              s.left = "left";
            } else {
              if ("left" === s.left) {
                x += itemWidth;
                /** @type {string} */
                options.left = "right";
                x -= width;
                /** @type {string} */
                s.left = "right";
              }
            }
          } else {
            if (x + width > p[2] && "right" === options.left) {
              if ("left" === s.left) {
                x -= itemWidth;
                /** @type {string} */
                options.left = "left";
                x -= width;
                /** @type {string} */
                s.left = "right";
              } else {
                if ("right" === s.left) {
                  x -= itemWidth;
                  /** @type {string} */
                  options.left = "left";
                  x += width;
                  /** @type {string} */
                  s.left = "left";
                }
              }
            } else {
              if ("center" === options.left) {
                if (x + width > p[2] && "left" === s.left) {
                  x -= width;
                  /** @type {string} */
                  s.left = "right";
                } else {
                  if (x < p[0]) {
                    if ("right" === s.left) {
                      x += width;
                      /** @type {string} */
                      s.left = "left";
                    }
                  }
                }
              }
            }
          }
        }
        if ("element" === container || "both" === container) {
          if (a < p[1]) {
            if ("bottom" === s.top) {
              a += b;
              /** @type {string} */
              s.top = "top";
            }
          }
          if (a + b > p[3]) {
            if ("top" === s.top) {
              a -= b;
              /** @type {string} */
              s.top = "bottom";
            }
          }
        }
        if ("element" === win || "both" === win) {
          if (x < p[0]) {
            if ("right" === s.left) {
              x += width;
              /** @type {string} */
              s.left = "left";
            }
          }
          if (x + width > p[2]) {
            if ("left" === s.left) {
              x -= width;
              /** @type {string} */
              s.left = "right";
            }
          }
        }
        if ("string" == typeof type) {
          /** @type {Array.<?>} */
          type = type.split(",").map(function(buf) {
            return buf.trim();
          });
        } else {
          if (type === true) {
            /** @type {Array} */
            type = ["top", "left", "right", "bottom"];
          }
        }
        type = type || [];
        /** @type {Array} */
        var left = [];
        /** @type {Array} */
        var aTiles = [];
        if (a < p[1]) {
          if (type.indexOf("top") >= 0) {
            a = p[1];
            left.push("top");
          } else {
            aTiles.push("top");
          }
        }
        if (a + b > p[3]) {
          if (type.indexOf("bottom") >= 0) {
            /** @type {number} */
            a = p[3] - b;
            left.push("bottom");
          } else {
            aTiles.push("bottom");
          }
        }
        if (x < p[0]) {
          if (type.indexOf("left") >= 0) {
            x = p[0];
            left.push("left");
          } else {
            aTiles.push("left");
          }
        }
        if (x + width > p[2]) {
          if (type.indexOf("right") >= 0) {
            /** @type {number} */
            x = p[2] - width;
            left.push("right");
          } else {
            aTiles.push("right");
          }
        }
        if (left.length) {
          !function() {
            var x = void 0;
            x = "undefined" != typeof that.options.pinnedClass ? that.options.pinnedClass : that.getClass("pinned");
            results.push(x);
            left.forEach(function(y) {
              results.push(x + "-" + y);
            });
          }();
        }
        if (aTiles.length) {
          !function() {
            var x = void 0;
            x = "undefined" != typeof that.options.outOfBoundsClass ? that.options.outOfBoundsClass : that.getClass("out-of-bounds");
            results.push(x);
            aTiles.forEach(function(y) {
              results.push(x + "-" + y);
            });
          }();
        }
        if (left.indexOf("left") >= 0 || left.indexOf("right") >= 0) {
          /** @type {boolean} */
          s.left = options.left = false;
        }
        if (left.indexOf("top") >= 0 || left.indexOf("bottom") >= 0) {
          /** @type {boolean} */
          s.top = options.top = false;
        }
        if (options.top !== args.top || (options.left !== args.left || (s.top !== that.attachment.top || s.left !== that.attachment.left))) {
          that.updateAttachClasses(s, options);
        }
      }), defer(function() {
        if (that.options.addTargetClasses !== false) {
          next(that.target, results, matched);
        }
        next(that.element, results, matched);
      }), {
        top : a,
        left : x
      };
    }
  });
  options = settings.Utils;
  /** @type {function (Object): ?} */
  getVisibleRectForElement = options.getBounds;
  /** @type {function (string, Array, Array): undefined} */
  next = options.updateClasses;
  /** @type {function (Function): undefined} */
  defer = options.defer;
  settings.modules.push({
    /**
     * @param {Object} offset
     * @return {?}
     */
    position : function(offset) {
      var self = this;
      var top = offset.top;
      var l = offset.left;
      var map = this.cache("element-bounds", function() {
        return getVisibleRectForElement(self.element);
      });
      var height = map.height;
      var len = map.width;
      var s = this.getTargetBounds();
      var y = top + height;
      var x = l + len;
      /** @type {Array} */
      var keys = [];
      if (top <= s.bottom) {
        if (y >= s.top) {
          ["left", "right"].forEach(function(k) {
            var c = s[k];
            if (c === l || c === x) {
              keys.push(k);
            }
          });
        }
      }
      if (l <= s.right) {
        if (x >= s.left) {
          ["top", "bottom"].forEach(function(k) {
            var key = s[k];
            if (key === top || key === y) {
              keys.push(k);
            }
          });
        }
      }
      /** @type {Array} */
      var matched = [];
      /** @type {Array} */
      var results = [];
      /** @type {Array} */
      var positions = ["left", "top", "right", "bottom"];
      return matched.push(this.getClass("abutted")), positions.forEach(function(day) {
        matched.push(self.getClass("abutted") + "-" + day);
      }), keys.length && results.push(this.getClass("abutted")), keys.forEach(function(value) {
        results.push(self.getClass("abutted") + "-" + value);
      }), defer(function() {
        if (self.options.addTargetClasses !== false) {
          next(self.target, results, matched);
        }
        next(self.element, results, matched);
      }), true;
    }
  });
  get = function() {
    /**
     * @param {?} dataAndEvents
     * @param {number} deepDataAndEvents
     * @return {?}
     */
    function clone(dataAndEvents, deepDataAndEvents) {
      /** @type {Array} */
      var res = [];
      /** @type {boolean} */
      var callback2 = true;
      /** @type {boolean} */
      var n = false;
      var bulk = void 0;
      try {
        var next;
        var exports = dataAndEvents[Symbol.iterator]();
        for (;!(callback2 = (next = exports.next()).done) && (res.push(next.value), !deepDataAndEvents || res.length !== deepDataAndEvents);callback2 = true) {
        }
      } catch (fn) {
        /** @type {boolean} */
        n = true;
        bulk = fn;
      } finally {
        try {
          if (!callback2) {
            if (exports["return"]) {
              exports["return"]();
            }
          }
        } finally {
          if (n) {
            throw bulk;
          }
        }
      }
      return res;
    }
    return function(object, deepDataAndEvents) {
      if (Array.isArray(object)) {
        return object;
      }
      if (Symbol.iterator in Object(object)) {
        return clone(object, deepDataAndEvents);
      }
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
  }();
  return settings.modules.push({
    /**
     * @param {Object} cursor
     * @return {?}
     */
    position : function(cursor) {
      var pos = cursor.top;
      var posLeft = cursor.left;
      if (this.options.shift) {
        var o = this.options.shift;
        if ("function" == typeof this.options.shift) {
          o = this.options.shift.call(this, {
            top : pos,
            left : posLeft
          });
        }
        var n = void 0;
        var value = void 0;
        if ("string" == typeof o) {
          /** @type {Array.<string>} */
          o = o.split(" ");
          /** @type {string} */
          o[1] = o[1] || o[0];
          /** @type {Array.<string>} */
          var obj = o;
          var x = get(obj, 2);
          n = x[0];
          value = x[1];
          /** @type {number} */
          n = parseFloat(n, 10);
          /** @type {number} */
          value = parseFloat(value, 10);
        } else {
          n = o.top;
          value = o.left;
        }
        return pos += n, posLeft += value, {
          top : pos,
          left : posLeft
        };
      }
    }
  }), oldconfig;
});
if ("undefined" == typeof jQuery) {
  throw new Error("Bootstrap's JavaScript requires jQuery");
}
+function($) {
  var t = $.fn.jquery.split(" ")[0].split(".");
  if (t[0] < 2 && t[1] < 9 || (1 == t[0] && (9 == t[1] && t[2] < 1) || t[0] >= 3)) {
    throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v3.0.0");
  }
}(jQuery), +function($) {
  /**
   * @param {Object} x
   * @param {Object} b
   * @return {undefined}
   */
  function f(x, b) {
    if ("function" != typeof b && null !== b) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof b);
    }
    /** @type {Object} */
    x.prototype = Object.create(b && b.prototype, {
      constructor : {
        value : x,
        enumerable : false,
        writable : true,
        configurable : true
      }
    });
    if (b) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(x, b);
      } else {
        /** @type {Object} */
        x.__proto__ = b;
      }
    }
  }
  /**
   * @param {?} item
   * @param {Function} object
   * @return {undefined}
   */
  function toString(item, object) {
    if (!(item instanceof object)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  /**
   * @param {Object} bulk
   * @param {(Element|string)} target
   * @param {?} name
   * @return {?}
   */
  var defineProperty = function(bulk, target, name) {
    /** @type {boolean} */
    var i = true;
    for (;i;) {
      /** @type {Object} */
      var proto = bulk;
      /** @type {(Element|string)} */
      var uuid = target;
      var it = name;
      /** @type {boolean} */
      i = false;
      if (null === proto) {
        proto = Function.prototype;
      }
      /** @type {(ObjectPropertyDescriptor|undefined)} */
      var obj = Object.getOwnPropertyDescriptor(proto, uuid);
      if (void 0 !== obj) {
        if ("value" in obj) {
          return obj.value;
        }
        /** @type {(function (): ?|undefined)} */
        var ostring = obj.get;
        if (void 0 === ostring) {
          return;
        }
        return ostring.call(it);
      }
      /** @type {(Object|null)} */
      var fn = Object.getPrototypeOf(proto);
      if (null === fn) {
        return;
      }
      /** @type {Object} */
      bulk = fn;
      target = uuid;
      name = it;
      /** @type {boolean} */
      i = true;
      obj = fn = void 0;
    }
  };
  var lookupIterator = function() {
    /**
     * @param {Function} object
     * @param {?} d
     * @return {undefined}
     */
    function defineProperty(object, d) {
      /** @type {number} */
      var i = 0;
      for (;i < d.length;i++) {
        var desc = d[i];
        desc.enumerable = desc.enumerable || false;
        /** @type {boolean} */
        desc.configurable = true;
        if ("value" in desc) {
          /** @type {boolean} */
          desc.writable = true;
        }
        Object.defineProperty(object, desc.key, desc);
      }
    }
    return function(x, current, a) {
      return current && defineProperty(x.prototype, current), a && defineProperty(x, a), x;
    };
  }();
  var self = function($) {
    /**
     * @param {?} obj
     * @return {?}
     */
    function type(obj) {
      return{}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }
    /**
     * @param {(Array|HTMLCollection|HTMLElement)} val
     * @return {?}
     */
    function encodeUriQuery(val) {
      return(val[0] || val).nodeType;
    }
    /**
     * @return {?}
     */
    function addListener() {
      return{
        bindType : config.end,
        delegateType : config.end,
        /**
         * @param {Event} event
         * @return {?}
         */
        handle : function(event) {
          return $(event.target).is(this) ? event.handleObj.handler.apply(this, arguments) : void 0;
        }
      };
    }
    /**
     * @return {?}
     */
    function transitionEnd() {
      if (window.QUnit) {
        return false;
      }
      /** @type {Element} */
      var el = document.createElement("bootstrap");
      var name;
      for (name in transEndEventNames) {
        if (void 0 !== el.style[name]) {
          return{
            end : transEndEventNames[name]
          };
        }
      }
      return false;
    }
    /**
     * @param {number} wait
     * @return {?}
     */
    function ready(wait) {
      var failuresLink = this;
      /** @type {boolean} */
      var i = false;
      return $(this).one(event.TRANSITION_END, function() {
        /** @type {boolean} */
        i = true;
      }), setTimeout(function() {
        if (!i) {
          event.triggerTransitionEnd(failuresLink);
        }
      }, wait), this;
    }
    /**
     * @return {undefined}
     */
    function handler() {
      config = transitionEnd();
      /** @type {function (number): ?} */
      $.fn.emulateTransitionEnd = ready;
      if (event.supportsTransitionEnd()) {
        $.event.special[event.TRANSITION_END] = addListener();
      }
    }
    /** @type {boolean} */
    var config = false;
    var transEndEventNames = {
      WebkitTransition : "webkitTransitionEnd",
      MozTransition : "transitionend",
      OTransition : "oTransitionEnd otransitionend",
      transition : "transitionend"
    };
    var event = {
      TRANSITION_END : "bsTransitionEnd",
      /**
       * @param {number} id
       * @return {?}
       */
      getUID : function(id) {
        do {
          id += ~~(1E6 * Math.random());
        } while (document.getElementById(id));
        return id;
      },
      /**
       * @param {Node} attr
       * @return {?}
       */
      getSelectorFromElement : function(attr) {
        var selector = attr.getAttribute("data-target");
        return selector || (selector = attr.getAttribute("href") || "", selector = /^#[a-z]/i.test(selector) ? selector : null), selector;
      },
      /**
       * @param {Element} e
       * @return {undefined}
       */
      reflow : function(e) {
        (new Function("bs", "return bs"))(e.offsetHeight);
      },
      /**
       * @param {?} el
       * @return {undefined}
       */
      triggerTransitionEnd : function(el) {
        $(el).trigger(config.end);
      },
      /**
       * @return {?}
       */
      supportsTransitionEnd : function() {
        return Boolean(config);
      },
      /**
       * @param {string} keepData
       * @param {(Object|string)} types
       * @param {Object} params
       * @return {undefined}
       */
      typeCheckConfig : function(keepData, types, params) {
        var i;
        for (i in params) {
          if (params.hasOwnProperty(i)) {
            var param = params[i];
            var value = types[i];
            var nType = void 0;
            if (nType = value && encodeUriQuery(value) ? "element" : type(value), !(new RegExp(param)).test(nType)) {
              throw new Error(keepData.toUpperCase() + ": " + ('Option "' + i + '" provided type "' + nType + '" ') + ('but expected type "' + param + '".'));
            }
          }
        }
      }
    };
    return handler(), event;
  }(jQuery);
  var item = (function($) {
    /** @type {string} */
    var name = "alert";
    /** @type {string} */
    var entries = "4.0.0-alpha";
    /** @type {string} */
    var key = "bs.alert";
    /** @type {string} */
    var ep = "." + key;
    /** @type {string} */
    var event_cleanup = ".data-api";
    var ref = $.fn[name];
    /** @type {number} */
    var wait = 150;
    var binding = {
      DISMISS : '[data-dismiss="alert"]'
    };
    var events = {
      CLOSE : "close" + ep,
      CLOSED : "closed" + ep,
      CLICK_DATA_API : "click" + ep + event_cleanup
    };
    var node = {
      ALERT : "alert",
      FADE : "fade",
      IN : "in"
    };
    var Constructor = function() {
      /**
       * @param {Object} anElement
       * @return {undefined}
       */
      function value(anElement) {
        toString(this, value);
        /** @type {Object} */
        this._element = anElement;
      }
      return lookupIterator(value, [{
        key : "close",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          event = event || this._element;
          var element = this._getRootElement(event);
          var evt = this._triggerCloseEvent(element);
          if (!evt.isDefaultPrevented()) {
            this._removeElement(element);
          }
        }
      }, {
        key : "dispose",
        /**
         * @return {undefined}
         */
        value : function() {
          $.removeData(this._element, key);
          /** @type {null} */
          this._element = null;
        }
      }, {
        key : "_getRootElement",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          var e = self.getSelectorFromElement(event);
          /** @type {boolean} */
          var t = false;
          return e && (t = $(e)[0]), t || (t = $(event).closest("." + node.ALERT)[0]), t;
        }
      }, {
        key : "_triggerCloseEvent",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          var qualifier = $.Event(events.CLOSE);
          return $(event).trigger(qualifier), qualifier;
        }
      }, {
        key : "_removeElement",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return $(event).removeClass(node.IN), self.supportsTransitionEnd() && $(event).hasClass(node.FADE) ? void $(event).one(self.TRANSITION_END, $.proxy(this._destroyElement, this, event)).emulateTransitionEnd(wait) : void this._destroyElement(event);
        }
      }, {
        key : "_destroyElement",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          $(event).detach().trigger(events.CLOSED).remove();
        }
      }], [{
        key : "_jQueryInterface",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this.each(function() {
            var orig = $(this);
            var target = orig.data(key);
            if (!target) {
              target = new value(this);
              orig.data(key, target);
            }
            if ("close" === event) {
              target[event](this);
            }
          });
        }
      }, {
        key : "_handleDismiss",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return function(types) {
            if (types) {
              types.preventDefault();
            }
            event.close(this);
          };
        }
      }, {
        key : "VERSION",
        /**
         * @return {?}
         */
        get : function() {
          return entries;
        }
      }]), value;
    }();
    return $(document).on(events.CLICK_DATA_API, binding.DISMISS, Constructor._handleDismiss(new Constructor)), $.fn[name] = Constructor._jQueryInterface, $.fn[name].Constructor = Constructor, $.fn[name].noConflict = function() {
      return $.fn[name] = ref, Constructor._jQueryInterface;
    }, Constructor;
  }(jQuery), function($) {
    /** @type {string} */
    var name = "button";
    /** @type {string} */
    var entries = "4.0.0-alpha";
    /** @type {string} */
    var key = "bs.button";
    /** @type {string} */
    var NS = "." + key;
    /** @type {string} */
    var event_cleanup = ".data-api";
    var ref = $.fn[name];
    var CLASSES = {
      ACTIVE : "active",
      BUTTON : "btn",
      FOCUS : "focus"
    };
    var handleObj = {
      DATA_TOGGLE_CARROT : '[data-toggle^="button"]',
      DATA_TOGGLE : '[data-toggle="buttons"]',
      INPUT : "input",
      ACTIVE : ".active",
      BUTTON : ".btn"
    };
    var h = {
      CLICK_DATA_API : "click" + NS + event_cleanup,
      FOCUS_BLUR_DATA_API : "focus" + NS + event_cleanup + " " + ("blur" + NS + event_cleanup)
    };
    var config = function() {
      /**
       * @param {?} anElement
       * @return {undefined}
       */
      function value(anElement) {
        toString(this, value);
        this._element = anElement;
      }
      return lookupIterator(value, [{
        key : "toggle",
        /**
         * @return {undefined}
         */
        value : function() {
          /** @type {boolean} */
          var t = true;
          var sourceContainer = $(this._element).closest(handleObj.DATA_TOGGLE)[0];
          if (sourceContainer) {
            var elem = $(this._element).find(handleObj.INPUT)[0];
            if (elem) {
              if ("radio" === elem.type) {
                if (elem.checked && $(this._element).hasClass(CLASSES.ACTIVE)) {
                  /** @type {boolean} */
                  t = false;
                } else {
                  var fromPage = $(sourceContainer).find(handleObj.ACTIVE)[0];
                  if (fromPage) {
                    $(fromPage).removeClass(CLASSES.ACTIVE);
                  }
                }
              }
              if (t) {
                /** @type {boolean} */
                elem.checked = !$(this._element).hasClass(CLASSES.ACTIVE);
                $(this._element).trigger("change");
              }
            }
          } else {
            this._element.setAttribute("aria-pressed", !$(this._element).hasClass(CLASSES.ACTIVE));
          }
          if (t) {
            $(this._element).toggleClass(CLASSES.ACTIVE);
          }
        }
      }, {
        key : "dispose",
        /**
         * @return {undefined}
         */
        value : function() {
          $.removeData(this._element, key);
          /** @type {null} */
          this._element = null;
        }
      }], [{
        key : "_jQueryInterface",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this.each(function() {
            var camelKey = $(this).data(key);
            if (!camelKey) {
              camelKey = new value(this);
              $(this).data(key, camelKey);
            }
            if ("toggle" === event) {
              camelKey[event]();
            }
          });
        }
      }, {
        key : "VERSION",
        /**
         * @return {?}
         */
        get : function() {
          return entries;
        }
      }]), value;
    }();
    return $(document).on(h.CLICK_DATA_API, handleObj.DATA_TOGGLE_CARROT, function(e) {
      e.preventDefault();
      var el = e.target;
      if (!$(el).hasClass(CLASSES.BUTTON)) {
        el = $(el).closest(handleObj.BUTTON);
      }
      config._jQueryInterface.call($(el), "toggle");
    }).on(h.FOCUS_BLUR_DATA_API, handleObj.DATA_TOGGLE_CARROT, function(e) {
      var disclosure = $(e.target).closest(handleObj.BUTTON)[0];
      $(disclosure).toggleClass(CLASSES.FOCUS, /^focus(in)?$/.test(e.type));
    }), $.fn[name] = config._jQueryInterface, $.fn[name].Constructor = config, $.fn[name].noConflict = function() {
      return $.fn[name] = ref, config._jQueryInterface;
    }, config;
  }(jQuery), function($) {
    /** @type {string} */
    var name = "carousel";
    /** @type {string} */
    var entries = "4.0.0-alpha";
    /** @type {string} */
    var datakey = "bs.carousel";
    /** @type {string} */
    var NS = "." + datakey;
    /** @type {string} */
    var event_cleanup = ".data-api";
    var ref = $.fn[name];
    /** @type {number} */
    var wait = 600;
    var options = {
      interval : 5E3,
      keyboard : true,
      slide : false,
      pause : "hover",
      wrap : true
    };
    var count = {
      interval : "(number|boolean)",
      keyboard : "boolean",
      slide : "(boolean|string)",
      pause : "(string|boolean)",
      wrap : "boolean"
    };
    var IMESpecialKey = {
      NEXT : "next",
      PREVIOUS : "prev"
    };
    var obj = {
      SLIDE : "slide" + NS,
      SLID : "slid" + NS,
      KEYDOWN : "keydown" + NS,
      MOUSEENTER : "mouseenter" + NS,
      MOUSELEAVE : "mouseleave" + NS,
      LOAD_DATA_API : "load" + NS + event_cleanup,
      CLICK_DATA_API : "click" + NS + event_cleanup
    };
    var CLASS = {
      CAROUSEL : "carousel",
      ACTIVE : "active",
      SLIDE : "slide",
      RIGHT : "right",
      LEFT : "left",
      ITEM : "carousel-item"
    };
    var o = {
      ACTIVE : ".active",
      ACTIVE_ITEM : ".active.carousel-item",
      ITEM : ".carousel-item",
      NEXT_PREV : ".next, .prev",
      INDICATORS : ".carousel-indicators",
      DATA_SLIDE : "[data-slide], [data-slide-to]",
      DATA_RIDE : '[data-ride="carousel"]'
    };
    var config = function() {
      /**
       * @param {?} newContent
       * @param {?} opts
       * @return {undefined}
       */
      function value(newContent, opts) {
        toString(this, value);
        /** @type {null} */
        this._items = null;
        /** @type {null} */
        this._interval = null;
        /** @type {null} */
        this._activeElement = null;
        /** @type {boolean} */
        this._isPaused = false;
        /** @type {boolean} */
        this._isSliding = false;
        this._config = this._getConfig(opts);
        this._element = $(newContent)[0];
        this._indicatorsElement = $(this._element).find(o.INDICATORS)[0];
        this._addEventListeners();
      }
      return lookupIterator(value, [{
        key : "next",
        /**
         * @return {undefined}
         */
        value : function() {
          if (!this._isSliding) {
            this._slide(IMESpecialKey.NEXT);
          }
        }
      }, {
        key : "nextWhenVisible",
        /**
         * @return {undefined}
         */
        value : function() {
          if (!document.hidden) {
            this.next();
          }
        }
      }, {
        key : "prev",
        /**
         * @return {undefined}
         */
        value : function() {
          if (!this._isSliding) {
            this._slide(IMESpecialKey.PREVIOUS);
          }
        }
      }, {
        key : "pause",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          if (!event) {
            /** @type {boolean} */
            this._isPaused = true;
          }
          if ($(this._element).find(o.NEXT_PREV)[0]) {
            if (self.supportsTransitionEnd()) {
              self.triggerTransitionEnd(this._element);
              this.cycle(true);
            }
          }
          clearInterval(this._interval);
          /** @type {null} */
          this._interval = null;
        }
      }, {
        key : "cycle",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          if (!event) {
            /** @type {boolean} */
            this._isPaused = false;
          }
          if (this._interval) {
            clearInterval(this._interval);
            /** @type {null} */
            this._interval = null;
          }
          if (this._config.interval) {
            if (!this._isPaused) {
              /** @type {number} */
              this._interval = setInterval($.proxy(document.visibilityState ? this.nextWhenVisible : this.next, this), this._config.interval);
            }
          }
        }
      }, {
        key : "to",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          var that = this;
          this._activeElement = $(this._element).find(o.ACTIVE_ITEM)[0];
          var data = this._getItemIndex(this._activeElement);
          if (!(event > this._items.length - 1 || 0 > event)) {
            if (this._isSliding) {
              return void $(this._element).one(obj.SLID, function() {
                return that.to(event);
              });
            }
            if (data === event) {
              return this.pause(), void this.cycle();
            }
            /** @type {string} */
            var inBetween = event > data ? IMESpecialKey.NEXT : IMESpecialKey.PREVIOUS;
            this._slide(inBetween, this._items[event]);
          }
        }
      }, {
        key : "dispose",
        /**
         * @return {undefined}
         */
        value : function() {
          $(this._element).off(NS);
          $.removeData(this._element, datakey);
          /** @type {null} */
          this._items = null;
          /** @type {null} */
          this._config = null;
          /** @type {null} */
          this._element = null;
          /** @type {null} */
          this._interval = null;
          /** @type {null} */
          this._isPaused = null;
          /** @type {null} */
          this._isSliding = null;
          /** @type {null} */
          this._activeElement = null;
          /** @type {null} */
          this._indicatorsElement = null;
        }
      }, {
        key : "_getConfig",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return event = $.extend({}, options, event), self.typeCheckConfig(name, event, count), event;
        }
      }, {
        key : "_addEventListeners",
        /**
         * @return {undefined}
         */
        value : function() {
          if (this._config.keyboard) {
            $(this._element).on(obj.KEYDOWN, $.proxy(this._keydown, this));
          }
          if (!("hover" !== this._config.pause)) {
            if (!("ontouchstart" in document.documentElement)) {
              $(this._element).on(obj.MOUSEENTER, $.proxy(this.pause, this)).on(obj.MOUSELEAVE, $.proxy(this.cycle, this));
            }
          }
        }
      }, {
        key : "_keydown",
        /**
         * @param {Object} event
         * @return {undefined}
         */
        value : function(event) {
          if (event.preventDefault(), !/input|textarea/i.test(event.target.tagName)) {
            switch(event.which) {
              case 37:
                this.prev();
                break;
              case 39:
                this.next();
                break;
              default:
                return;
            }
          }
        }
      }, {
        key : "_getItemIndex",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this._items = $.makeArray($(event).parent().find(o.ITEM)), this._items.indexOf(event);
        }
      }, {
        key : "_getItemByDirection",
        /**
         * @param {string} event
         * @param {?} expectedNumberOfNonCommentArgs
         * @return {?}
         */
        value : function(event, expectedNumberOfNonCommentArgs) {
          /** @type {boolean} */
          var result = event === IMESpecialKey.NEXT;
          /** @type {boolean} */
          var target = event === IMESpecialKey.PREVIOUS;
          var idx = this._getItemIndex(expectedNumberOfNonCommentArgs);
          /** @type {number} */
          var value = this._items.length - 1;
          /** @type {boolean} */
          var o = target && 0 === idx || result && idx === value;
          if (o && !this._config.wrap) {
            return expectedNumberOfNonCommentArgs;
          }
          /** @type {number} */
          var count = event === IMESpecialKey.PREVIOUS ? -1 : 1;
          /** @type {number} */
          var i = (idx + count) % this._items.length;
          return-1 === i ? this._items[this._items.length - 1] : this._items[i];
        }
      }, {
        key : "_triggerSlideEvent",
        /**
         * @param {string} event
         * @param {?} expectedNumberOfNonCommentArgs
         * @return {?}
         */
        value : function(event, expectedNumberOfNonCommentArgs) {
          var qualifier = $.Event(obj.SLIDE, {
            relatedTarget : event,
            direction : expectedNumberOfNonCommentArgs
          });
          return $(this._element).trigger(qualifier), qualifier;
        }
      }, {
        key : "_setActiveIndicatorElement",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          if (this._indicatorsElement) {
            $(this._indicatorsElement).find(o.ACTIVE).removeClass(CLASS.ACTIVE);
            var reset = this._indicatorsElement.children[this._getItemIndex(event)];
            if (reset) {
              $(reset).addClass(CLASS.ACTIVE);
            }
          }
        }
      }, {
        key : "_slide",
        /**
         * @param {string} event
         * @param {Object} expectedNumberOfNonCommentArgs
         * @return {?}
         */
        value : function(event, expectedNumberOfNonCommentArgs) {
          var that = this;
          var item = $(this._element).find(o.ACTIVE_ITEM)[0];
          var target = expectedNumberOfNonCommentArgs || item && this._getItemByDirection(event, item);
          /** @type {boolean} */
          var has_search_bar = Boolean(this._interval);
          /** @type {string} */
          var failuresLink = event === IMESpecialKey.NEXT ? CLASS.LEFT : CLASS.RIGHT;
          if (target && $(target).hasClass(CLASS.ACTIVE)) {
            return void(this._isSliding = false);
          }
          var targets = this._triggerSlideEvent(target, failuresLink);
          if (!targets.isDefaultPrevented() && (item && target)) {
            /** @type {boolean} */
            this._isSliding = true;
            if (has_search_bar) {
              this.pause();
            }
            this._setActiveIndicatorElement(target);
            var qualifier = $.Event(obj.SLID, {
              relatedTarget : target,
              direction : failuresLink
            });
            if (self.supportsTransitionEnd() && $(this._element).hasClass(CLASS.SLIDE)) {
              $(target).addClass(event);
              self.reflow(target);
              $(item).addClass(failuresLink);
              $(target).addClass(failuresLink);
              $(item).one(self.TRANSITION_END, function() {
                $(target).removeClass(failuresLink).removeClass(event);
                $(target).addClass(CLASS.ACTIVE);
                $(item).removeClass(CLASS.ACTIVE).removeClass(event).removeClass(failuresLink);
                /** @type {boolean} */
                that._isSliding = false;
                setTimeout(function() {
                  return $(that._element).trigger(qualifier);
                }, 0);
              }).emulateTransitionEnd(wait);
            } else {
              $(item).removeClass(CLASS.ACTIVE);
              $(target).addClass(CLASS.ACTIVE);
              /** @type {boolean} */
              this._isSliding = false;
              $(this._element).trigger(qualifier);
            }
            if (has_search_bar) {
              this.cycle();
            }
          }
        }
      }], [{
        key : "_jQueryInterface",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this.each(function() {
            var data = $(this).data(datakey);
            var attributes = $.extend({}, options, $(this).data());
            if ("object" == typeof event) {
              $.extend(attributes, event);
            }
            var args = "string" == typeof event ? event : attributes.slide;
            if (data || (data = new value(this, attributes), $(this).data(datakey, data)), "number" == typeof event) {
              data.to(event);
            } else {
              if ("string" == typeof args) {
                if (void 0 === data[args]) {
                  throw new Error('No method named "' + args + '"');
                }
                data[args]();
              } else {
                if (attributes.interval) {
                  data.pause();
                  data.cycle();
                }
              }
            }
          });
        }
      }, {
        key : "_dataApiClickHandler",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          var statsTemplate = self.getSelectorFromElement(this);
          if (statsTemplate) {
            var elem = $(statsTemplate)[0];
            if (elem && $(elem).hasClass(CLASS.CAROUSEL)) {
              var evt = $.extend({}, $(elem).data(), $(this).data());
              var pdataOld = this.getAttribute("data-slide-to");
              if (pdataOld) {
                /** @type {boolean} */
                evt.interval = false;
              }
              value._jQueryInterface.call($(elem), evt);
              if (pdataOld) {
                $(elem).data(datakey).to(pdataOld);
              }
              event.preventDefault();
            }
          }
        }
      }, {
        key : "VERSION",
        /**
         * @return {?}
         */
        get : function() {
          return entries;
        }
      }, {
        key : "Default",
        /**
         * @return {?}
         */
        get : function() {
          return options;
        }
      }]), value;
    }();
    return $(document).on(obj.CLICK_DATA_API, o.DATA_SLIDE, config._dataApiClickHandler), $(window).on(obj.LOAD_DATA_API, function() {
      $(o.DATA_RIDE).each(function() {
        var $t = $(this);
        config._jQueryInterface.call($t, $t.data());
      });
    }), $.fn[name] = config._jQueryInterface, $.fn[name].Constructor = config, $.fn[name].noConflict = function() {
      return $.fn[name] = ref, config._jQueryInterface;
    }, config;
  }(jQuery), function($) {
    /** @type {string} */
    var name = "collapse";
    /** @type {string} */
    var entries = "4.0.0-alpha";
    /** @type {string} */
    var dataKey = "bs.collapse";
    /** @type {string} */
    var evSuffix = "." + dataKey;
    /** @type {string} */
    var event_cleanup = ".data-api";
    var ref = $.fn[name];
    /** @type {number} */
    var wait = 600;
    var options = {
      toggle : true,
      parent : ""
    };
    var params = {
      toggle : "boolean",
      parent : "string"
    };
    var events = {
      SHOW : "show" + evSuffix,
      SHOWN : "shown" + evSuffix,
      HIDE : "hide" + evSuffix,
      HIDDEN : "hidden" + evSuffix,
      CLICK_DATA_API : "click" + evSuffix + event_cleanup
    };
    var c = {
      IN : "in",
      COLLAPSE : "collapse",
      COLLAPSING : "collapsing",
      COLLAPSED : "collapsed"
    };
    var settings = {
      WIDTH : "width",
      HEIGHT : "height"
    };
    var data = {
      ACTIVES : ".panel > .in, .panel > .collapsing",
      DATA_TOGGLE : '[data-toggle="collapse"]'
    };
    var config = function() {
      /**
       * @param {Object} element
       * @param {?} success
       * @return {undefined}
       */
      function callback(element, success) {
        toString(this, callback);
        /** @type {boolean} */
        this._isTransitioning = false;
        /** @type {Object} */
        this._element = element;
        this._config = this._getConfig(success);
        this._triggerArray = $.makeArray($('[data-toggle="collapse"][href="#' + element.id + '"],' + ('[data-toggle="collapse"][data-target="#' + element.id + '"]')));
        this._parent = this._config.parent ? this._getParent() : null;
        if (!this._config.parent) {
          this._addAriaAndCollapsedClass(this._element, this._triggerArray);
        }
        if (this._config.toggle) {
          this.toggle();
        }
      }
      return lookupIterator(callback, [{
        key : "toggle",
        /**
         * @return {undefined}
         */
        value : function() {
          if ($(this._element).hasClass(c.IN)) {
            this.hide();
          } else {
            this.show();
          }
        }
      }, {
        key : "show",
        /**
         * @return {?}
         */
        value : function() {
          var img = this;
          if (!this._isTransitioning && !$(this._element).hasClass(c.IN)) {
            var elem = void 0;
            var d = void 0;
            if (this._parent && (elem = $.makeArray($(data.ACTIVES)), elem.length || (elem = null)), !(elem && (d = $(elem).data(dataKey), d && d._isTransitioning))) {
              var qualifier = $.Event(events.SHOW);
              if ($(this._element).trigger(qualifier), !qualifier.isDefaultPrevented()) {
                if (elem) {
                  callback._jQueryInterface.call($(elem), "hide");
                  if (!d) {
                    $(elem).data(dataKey, null);
                  }
                }
                var prop = this._getDimension();
                $(this._element).removeClass(c.COLLAPSE).addClass(c.COLLAPSING);
                /** @type {number} */
                this._element.style[prop] = 0;
                this._element.setAttribute("aria-expanded", true);
                if (this._triggerArray.length) {
                  $(this._triggerArray).removeClass(c.COLLAPSED).attr("aria-expanded", true);
                }
                this.setTransitioning(true);
                /**
                 * @return {undefined}
                 */
                var complete = function() {
                  $(img._element).removeClass(c.COLLAPSING).addClass(c.COLLAPSE).addClass(c.IN);
                  /** @type {string} */
                  img._element.style[prop] = "";
                  img.setTransitioning(false);
                  $(img._element).trigger(events.SHOWN);
                };
                if (!self.supportsTransitionEnd()) {
                  return void complete();
                }
                var name = prop[0].toUpperCase() + prop.slice(1);
                /** @type {string} */
                var key = "scroll" + name;
                $(this._element).one(self.TRANSITION_END, complete).emulateTransitionEnd(wait);
                this._element.style[prop] = this._element[key] + "px";
              }
            }
          }
        }
      }, {
        key : "hide",
        /**
         * @return {?}
         */
        value : function() {
          var that = this;
          if (!this._isTransitioning && $(this._element).hasClass(c.IN)) {
            var qualifier = $.Event(events.HIDE);
            if ($(this._element).trigger(qualifier), !qualifier.isDefaultPrevented()) {
              var i = this._getDimension();
              /** @type {string} */
              var dim = i === settings.WIDTH ? "offsetWidth" : "offsetHeight";
              this._element.style[i] = this._element[dim] + "px";
              self.reflow(this._element);
              $(this._element).addClass(c.COLLAPSING).removeClass(c.COLLAPSE).removeClass(c.IN);
              this._element.setAttribute("aria-expanded", false);
              if (this._triggerArray.length) {
                $(this._triggerArray).addClass(c.COLLAPSED).attr("aria-expanded", false);
              }
              this.setTransitioning(true);
              /**
               * @return {undefined}
               */
              var complete = function() {
                that.setTransitioning(false);
                $(that._element).removeClass(c.COLLAPSING).addClass(c.COLLAPSE).trigger(events.HIDDEN);
              };
              return this._element.style[i] = 0, self.supportsTransitionEnd() ? void $(this._element).one(self.TRANSITION_END, complete).emulateTransitionEnd(wait) : void complete();
            }
          }
        }
      }, {
        key : "setTransitioning",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          /** @type {string} */
          this._isTransitioning = event;
        }
      }, {
        key : "dispose",
        /**
         * @return {undefined}
         */
        value : function() {
          $.removeData(this._element, dataKey);
          /** @type {null} */
          this._config = null;
          /** @type {null} */
          this._parent = null;
          /** @type {null} */
          this._element = null;
          /** @type {null} */
          this._triggerArray = null;
          /** @type {null} */
          this._isTransitioning = null;
        }
      }, {
        key : "_getConfig",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return event = $.extend({}, options, event), event.toggle = Boolean(event.toggle), self.typeCheckConfig(name, event, params), event;
        }
      }, {
        key : "_getDimension",
        /**
         * @return {?}
         */
        value : function() {
          var isFirst = $(this._element).hasClass(settings.WIDTH);
          return isFirst ? settings.WIDTH : settings.HEIGHT;
        }
      }, {
        key : "_getParent",
        /**
         * @return {?}
         */
        value : function() {
          var bulk = this;
          var sourceContainer = $(this._config.parent)[0];
          /** @type {string} */
          var sel = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]';
          return $(sourceContainer).find(sel).each(function(dataAndEvents, elem) {
            bulk._addAriaAndCollapsedClass(callback._getTargetFromElement(elem), [elem]);
          }), sourceContainer;
        }
      }, {
        key : "_addAriaAndCollapsedClass",
        /**
         * @param {string} event
         * @param {?} expectedNumberOfNonCommentArgs
         * @return {undefined}
         */
        value : function(event, expectedNumberOfNonCommentArgs) {
          if (event) {
            var val = $(event).hasClass(c.IN);
            event.setAttribute("aria-expanded", val);
            if (expectedNumberOfNonCommentArgs.length) {
              $(expectedNumberOfNonCommentArgs).toggleClass(c.COLLAPSED, !val).attr("aria-expanded", val);
            }
          }
        }
      }], [{
        key : "_getTargetFromElement",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          var pointer = self.getSelectorFromElement(event);
          return pointer ? $(pointer)[0] : null;
        }
      }, {
        key : "_jQueryInterface",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this.each(function() {
            var $this = $(this);
            var data = $this.data(dataKey);
            var opts = $.extend({}, options, $this.data(), "object" == typeof event && event);
            if (!data && (opts.toggle && (/show|hide/.test(event) && (opts.toggle = false))), data || (data = new callback(this, opts), $this.data(dataKey, data)), "string" == typeof event) {
              if (void 0 === data[event]) {
                throw new Error('No method named "' + event + '"');
              }
              data[event]();
            }
          });
        }
      }, {
        key : "VERSION",
        /**
         * @return {?}
         */
        get : function() {
          return entries;
        }
      }, {
        key : "Default",
        /**
         * @return {?}
         */
        get : function() {
          return options;
        }
      }]), callback;
    }();
    return $(document).on(events.CLICK_DATA_API, data.DATA_TOGGLE, function(types) {
      types.preventDefault();
      var elem = config._getTargetFromElement(this);
      var data = $(elem).data(dataKey);
      var option = data ? "toggle" : $(this).data();
      config._jQueryInterface.call($(elem), option);
    }), $.fn[name] = config._jQueryInterface, $.fn[name].Constructor = config, $.fn[name].noConflict = function() {
      return $.fn[name] = ref, config._jQueryInterface;
    }, config;
  }(jQuery), function($) {
    /** @type {string} */
    var name = "dropdown";
    /** @type {string} */
    var entries = "4.0.0-alpha";
    /** @type {string} */
    var namespace = "bs.dropdown";
    /** @type {string} */
    var eventNamespace = "." + namespace;
    /** @type {string} */
    var keypress = ".data-api";
    var ref = $.fn[name];
    var events = {
      HIDE : "hide" + eventNamespace,
      HIDDEN : "hidden" + eventNamespace,
      SHOW : "show" + eventNamespace,
      SHOWN : "shown" + eventNamespace,
      CLICK : "click" + eventNamespace,
      CLICK_DATA_API : "click" + eventNamespace + keypress,
      KEYDOWN_DATA_API : "keydown" + eventNamespace + keypress
    };
    var c = {
      BACKDROP : "dropdown-backdrop",
      DISABLED : "disabled",
      OPEN : "open"
    };
    var o = {
      BACKDROP : ".dropdown-backdrop",
      DATA_TOGGLE : '[data-toggle="dropdown"]',
      FORM_CHILD : ".dropdown form",
      ROLE_MENU : '[role="menu"]',
      ROLE_LISTBOX : '[role="listbox"]',
      NAVBAR_NAV : ".navbar-nav",
      VISIBLE_ITEMS : '[role="menu"] li:not(.disabled) a, [role="listbox"] li:not(.disabled) a'
    };
    var module = function() {
      /**
       * @param {?} anElement
       * @return {undefined}
       */
      function value(anElement) {
        toString(this, value);
        this._element = anElement;
        this._addEventListeners();
      }
      return lookupIterator(value, [{
        key : "toggle",
        /**
         * @return {?}
         */
        value : function() {
          if (this.disabled || $(this).hasClass(c.DISABLED)) {
            return false;
          }
          var el = value._getParentFromElement(this);
          var i = $(el).hasClass(c.OPEN);
          if (value._clearMenus(), i) {
            return false;
          }
          if ("ontouchstart" in document.documentElement && !$(el).closest(o.NAVBAR_NAV).length) {
            /** @type {Element} */
            var template = document.createElement("div");
            /** @type {string} */
            template.className = c.BACKDROP;
            $(template).insertBefore(this);
            $(template).on("click", value._clearMenus);
          }
          var evtOptions = {
            relatedTarget : this
          };
          var qualifier = $.Event(events.SHOW, evtOptions);
          return $(el).trigger(qualifier), qualifier.isDefaultPrevented() ? false : (this.focus(), this.setAttribute("aria-expanded", "true"), $(el).toggleClass(c.OPEN), $(el).trigger($.Event(events.SHOWN, evtOptions)), false);
        }
      }, {
        key : "dispose",
        /**
         * @return {undefined}
         */
        value : function() {
          $.removeData(this._element, namespace);
          $(this._element).off(eventNamespace);
          /** @type {null} */
          this._element = null;
        }
      }, {
        key : "_addEventListeners",
        /**
         * @return {undefined}
         */
        value : function() {
          $(this._element).on(events.CLICK, this.toggle);
        }
      }], [{
        key : "_jQueryInterface",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this.each(function() {
            var data = $(this).data(namespace);
            if (data || $(this).data(namespace, data = new value(this)), "string" == typeof event) {
              if (void 0 === data[event]) {
                throw new Error('No method named "' + event + '"');
              }
              data[event].call(this);
            }
          });
        }
      }, {
        key : "_clearMenus",
        /**
         * @param {Object} event
         * @return {undefined}
         */
        value : function(event) {
          if (!event || 3 !== event.which) {
            var tabPage = $(o.BACKDROP)[0];
            if (tabPage) {
              tabPage.parentNode.removeChild(tabPage);
            }
            var codeSegments = $.makeArray($(o.DATA_TOGGLE));
            /** @type {number} */
            var i = 0;
            for (;i < codeSegments.length;i++) {
              var target = value._getParentFromElement(codeSegments[i]);
              var evtOptions = {
                relatedTarget : codeSegments[i]
              };
              if ($(target).hasClass(c.OPEN) && !(event && ("click" === event.type && (/input|textarea/i.test(event.target.tagName) && $.contains(target, event.target))))) {
                var qualifier = $.Event(events.HIDE, evtOptions);
                $(target).trigger(qualifier);
                if (!qualifier.isDefaultPrevented()) {
                  codeSegments[i].setAttribute("aria-expanded", "false");
                  $(target).removeClass(c.OPEN).trigger($.Event(events.HIDDEN, evtOptions));
                }
              }
            }
          }
        }
      }, {
        key : "_getParentFromElement",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          var element = void 0;
          var pointer = self.getSelectorFromElement(event);
          return pointer && (element = $(pointer)[0]), element || event.parentNode;
        }
      }, {
        key : "_dataApiKeydownHandler",
        /**
         * @param {Object} event
         * @return {?}
         */
        value : function(event) {
          if (/(38|40|27|32)/.test(event.which) && (!/input|textarea/i.test(event.target.tagName) && (event.preventDefault(), event.stopPropagation(), !this.disabled && !$(this).hasClass(c.DISABLED)))) {
            var step = value._getParentFromElement(this);
            var r = $(step).hasClass(c.OPEN);
            if (!r && 27 !== event.which || r && 27 === event.which) {
              if (27 === event.which) {
                var $el = $(step).find(o.DATA_TOGGLE)[0];
                $($el).trigger("focus");
              }
              return void $(this).trigger("click");
            }
            var that = $.makeArray($(o.VISIBLE_ITEMS));
            if (that = that.filter(function(el) {
              return el.offsetWidth || el.offsetHeight;
            }), that.length) {
              var key = that.indexOf(event.target);
              if (38 === event.which) {
                if (key > 0) {
                  key--;
                }
              }
              if (40 === event.which) {
                if (key < that.length - 1) {
                  key++;
                }
              }
              if (!~key) {
                /** @type {number} */
                key = 0;
              }
              that[key].focus();
            }
          }
        }
      }, {
        key : "VERSION",
        /**
         * @return {?}
         */
        get : function() {
          return entries;
        }
      }]), value;
    }();
    return $(document).on(events.KEYDOWN_DATA_API, o.DATA_TOGGLE, module._dataApiKeydownHandler).on(events.KEYDOWN_DATA_API, o.ROLE_MENU, module._dataApiKeydownHandler).on(events.KEYDOWN_DATA_API, o.ROLE_LISTBOX, module._dataApiKeydownHandler).on(events.CLICK_DATA_API, module._clearMenus).on(events.CLICK_DATA_API, o.DATA_TOGGLE, module.prototype.toggle).on(events.CLICK_DATA_API, o.FORM_CHILD, function(event) {
      event.stopPropagation();
    }), $.fn[name] = module._jQueryInterface, $.fn[name].Constructor = module, $.fn[name].noConflict = function() {
      return $.fn[name] = ref, module._jQueryInterface;
    }, module;
  }(jQuery), function($) {
    /** @type {string} */
    var name = "modal";
    /** @type {string} */
    var entries = "4.0.0-alpha";
    /** @type {string} */
    var dataKey = "bs.modal";
    /** @type {string} */
    var NS = "." + dataKey;
    /** @type {string} */
    var event_cleanup = ".data-api";
    var ref = $.fn[name];
    /** @type {number} */
    var wait = 300;
    /** @type {number} */
    var selector = 150;
    var defaults = {
      backdrop : true,
      keyboard : true,
      focus : true,
      show : true
    };
    var opts = {
      backdrop : "(boolean|string)",
      keyboard : "boolean",
      focus : "boolean",
      show : "boolean"
    };
    var events = {
      HIDE : "hide" + NS,
      HIDDEN : "hidden" + NS,
      SHOW : "show" + NS,
      SHOWN : "shown" + NS,
      FOCUSIN : "focusin" + NS,
      RESIZE : "resize" + NS,
      CLICK_DISMISS : "click.dismiss" + NS,
      KEYDOWN_DISMISS : "keydown.dismiss" + NS,
      MOUSEUP_DISMISS : "mouseup.dismiss" + NS,
      MOUSEDOWN_DISMISS : "mousedown.dismiss" + NS,
      CLICK_DATA_API : "click" + NS + event_cleanup
    };
    var node = {
      SCROLLBAR_MEASURER : "modal-scrollbar-measure",
      BACKDROP : "modal-backdrop",
      OPEN : "modal-open",
      FADE : "fade",
      IN : "in"
    };
    var o = {
      DIALOG : ".modal-dialog",
      DATA_TOGGLE : '[data-toggle="modal"]',
      DATA_DISMISS : '[data-dismiss="modal"]',
      FIXED_CONTENT : ".navbar-fixed-top, .navbar-fixed-bottom, .is-fixed"
    };
    var config = function() {
      /**
       * @param {?} element
       * @param {?} opts
       * @return {undefined}
       */
      function value(element, opts) {
        toString(this, value);
        this._config = this._getConfig(opts);
        this._element = element;
        this._dialog = $(element).find(o.DIALOG)[0];
        /** @type {null} */
        this._backdrop = null;
        /** @type {boolean} */
        this._isShown = false;
        /** @type {boolean} */
        this._isBodyOverflowing = false;
        /** @type {boolean} */
        this._ignoreBackdropClick = false;
        /** @type {number} */
        this._originalBodyPadding = 0;
        /** @type {number} */
        this._scrollbarWidth = 0;
      }
      return lookupIterator(value, [{
        key : "toggle",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this._isShown ? this.hide() : this.show(event);
        }
      }, {
        key : "show",
        /**
         * @param {Object} event
         * @return {undefined}
         */
        value : function(event) {
          var self = this;
          var qualifier = $.Event(events.SHOW, {
            relatedTarget : event
          });
          $(this._element).trigger(qualifier);
          if (!this._isShown) {
            if (!qualifier.isDefaultPrevented()) {
              /** @type {boolean} */
              this._isShown = true;
              this._checkScrollbar();
              this._setScrollbar();
              $(document.body).addClass(node.OPEN);
              this._setEscapeEvent();
              this._setResizeEvent();
              $(this._element).on(events.CLICK_DISMISS, o.DATA_DISMISS, $.proxy(this.hide, this));
              $(this._dialog).on(events.MOUSEDOWN_DISMISS, function() {
                $(self._element).one(events.MOUSEUP_DISMISS, function(ev) {
                  if ($(ev.target).is(self._element)) {
                    /** @type {boolean} */
                    self._ignoreBackdropClick = true;
                  }
                });
              });
              this._showBackdrop($.proxy(this._showElement, this, event));
            }
          }
        }
      }, {
        key : "hide",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          if (event) {
            event.preventDefault();
          }
          var qualifier = $.Event(events.HIDE);
          $(this._element).trigger(qualifier);
          if (this._isShown) {
            if (!qualifier.isDefaultPrevented()) {
              /** @type {boolean} */
              this._isShown = false;
              this._setEscapeEvent();
              this._setResizeEvent();
              $(document).off(events.FOCUSIN);
              $(this._element).removeClass(node.IN);
              $(this._element).off(events.CLICK_DISMISS);
              $(this._dialog).off(events.MOUSEDOWN_DISMISS);
              if (self.supportsTransitionEnd() && $(this._element).hasClass(node.FADE)) {
                $(this._element).one(self.TRANSITION_END, $.proxy(this._hideModal, this)).emulateTransitionEnd(wait);
              } else {
                this._hideModal();
              }
            }
          }
        }
      }, {
        key : "dispose",
        /**
         * @return {undefined}
         */
        value : function() {
          $.removeData(this._element, dataKey);
          $(window).off(NS);
          $(document).off(NS);
          $(this._element).off(NS);
          $(this._backdrop).off(NS);
          /** @type {null} */
          this._config = null;
          /** @type {null} */
          this._element = null;
          /** @type {null} */
          this._dialog = null;
          /** @type {null} */
          this._backdrop = null;
          /** @type {null} */
          this._isShown = null;
          /** @type {null} */
          this._isBodyOverflowing = null;
          /** @type {null} */
          this._ignoreBackdropClick = null;
          /** @type {null} */
          this._originalBodyPadding = null;
          /** @type {null} */
          this._scrollbarWidth = null;
        }
      }, {
        key : "_getConfig",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return event = $.extend({}, defaults, event), self.typeCheckConfig(name, event, opts), event;
        }
      }, {
        key : "_showElement",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          var that = this;
          var i = self.supportsTransitionEnd() && $(this._element).hasClass(node.FADE);
          if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE)) {
            document.body.appendChild(this._element);
          }
          /** @type {string} */
          this._element.style.display = "block";
          /** @type {number} */
          this._element.scrollTop = 0;
          if (i) {
            self.reflow(this._element);
          }
          $(this._element).addClass(node.IN);
          if (this._config.focus) {
            this._enforceFocus();
          }
          var qualifier = $.Event(events.SHOWN, {
            relatedTarget : event
          });
          /**
           * @return {undefined}
           */
          var complete = function() {
            if (that._config.focus) {
              that._element.focus();
            }
            $(that._element).trigger(qualifier);
          };
          if (i) {
            $(this._dialog).one(self.TRANSITION_END, complete).emulateTransitionEnd(wait);
          } else {
            complete();
          }
        }
      }, {
        key : "_enforceFocus",
        /**
         * @return {undefined}
         */
        value : function() {
          var item = this;
          $(document).off(events.FOCUSIN).on(events.FOCUSIN, function(e) {
            if (!(item._element === e.target)) {
              if (!$(item._element).has(e.target).length) {
                item._element.focus();
              }
            }
          });
        }
      }, {
        key : "_setEscapeEvent",
        /**
         * @return {undefined}
         */
        value : function() {
          var poster = this;
          if (this._isShown && this._config.keyboard) {
            $(this._element).on(events.KEYDOWN_DISMISS, function(event) {
              if (27 === event.which) {
                poster.hide();
              }
            });
          } else {
            if (!this._isShown) {
              $(this._element).off(events.KEYDOWN_DISMISS);
            }
          }
        }
      }, {
        key : "_setResizeEvent",
        /**
         * @return {undefined}
         */
        value : function() {
          if (this._isShown) {
            $(window).on(events.RESIZE, $.proxy(this._handleUpdate, this));
          } else {
            $(window).off(events.RESIZE);
          }
        }
      }, {
        key : "_hideModal",
        /**
         * @return {undefined}
         */
        value : function() {
          var self = this;
          /** @type {string} */
          this._element.style.display = "none";
          this._showBackdrop(function() {
            $(document.body).removeClass(node.OPEN);
            self._resetAdjustments();
            self._resetScrollbar();
            $(self._element).trigger(events.HIDDEN);
          });
        }
      }, {
        key : "_removeBackdrop",
        /**
         * @return {undefined}
         */
        value : function() {
          if (this._backdrop) {
            $(this._backdrop).remove();
            /** @type {null} */
            this._backdrop = null;
          }
        }
      }, {
        key : "_showBackdrop",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          var that = this;
          /** @type {string} */
          var failuresLink = $(this._element).hasClass(node.FADE) ? node.FADE : "";
          if (this._isShown && this._config.backdrop) {
            var r = self.supportsTransitionEnd() && failuresLink;
            if (this._backdrop = document.createElement("div"), this._backdrop.className = node.BACKDROP, failuresLink && $(this._backdrop).addClass(failuresLink), $(this._backdrop).appendTo(document.body), $(this._element).on(events.CLICK_DISMISS, function(e) {
              return that._ignoreBackdropClick ? void(that._ignoreBackdropClick = false) : void(e.target === e.currentTarget && ("static" === that._config.backdrop ? that._element.focus() : that.hide()));
            }), r && self.reflow(this._backdrop), $(this._backdrop).addClass(node.IN), !event) {
              return;
            }
            if (!r) {
              return void event();
            }
            $(this._backdrop).one(self.TRANSITION_END, event).emulateTransitionEnd(selector);
          } else {
            if (!this._isShown && this._backdrop) {
              $(this._backdrop).removeClass(node.IN);
              /**
               * @return {undefined}
               */
              var complete = function() {
                that._removeBackdrop();
                if (event) {
                  event();
                }
              };
              if (self.supportsTransitionEnd() && $(this._element).hasClass(node.FADE)) {
                $(this._backdrop).one(self.TRANSITION_END, complete).emulateTransitionEnd(selector);
              } else {
                complete();
              }
            } else {
              if (event) {
                event();
              }
            }
          }
        }
      }, {
        key : "_handleUpdate",
        /**
         * @return {undefined}
         */
        value : function() {
          this._adjustDialog();
        }
      }, {
        key : "_adjustDialog",
        /**
         * @return {undefined}
         */
        value : function() {
          /** @type {boolean} */
          var e = this._element.scrollHeight > document.documentElement.clientHeight;
          if (!this._isBodyOverflowing) {
            if (e) {
              /** @type {string} */
              this._element.style.paddingLeft = this._scrollbarWidth + "px";
            }
          }
          if (this._isBodyOverflowing) {
            if (!e) {
              /** @type {string} */
              this._element.style.paddingRight = this._scrollbarWidth + "px~";
            }
          }
        }
      }, {
        key : "_resetAdjustments",
        /**
         * @return {undefined}
         */
        value : function() {
          /** @type {string} */
          this._element.style.paddingLeft = "";
          /** @type {string} */
          this._element.style.paddingRight = "";
        }
      }, {
        key : "_checkScrollbar",
        /**
         * @return {undefined}
         */
        value : function() {
          /** @type {number} */
          var windowInnerWidth = window.innerWidth;
          if (!windowInnerWidth) {
            /** @type {(ClientRect|null)} */
            var d = document.documentElement.getBoundingClientRect();
            /** @type {number} */
            windowInnerWidth = d.right - Math.abs(d.left);
          }
          /** @type {boolean} */
          this._isBodyOverflowing = document.body.clientWidth < windowInnerWidth;
          this._scrollbarWidth = this._getScrollbarWidth();
        }
      }, {
        key : "_setScrollbar",
        /**
         * @return {undefined}
         */
        value : function() {
          /** @type {number} */
          var maxWidth = parseInt($(o.FIXED_CONTENT).css("padding-right") || 0, 10);
          /** @type {(number|string)} */
          this._originalBodyPadding = document.body.style.paddingRight || "";
          if (this._isBodyOverflowing) {
            /** @type {string} */
            document.body.style.paddingRight = maxWidth + this._scrollbarWidth + "px";
          }
        }
      }, {
        key : "_resetScrollbar",
        /**
         * @return {undefined}
         */
        value : function() {
          document.body.style.paddingRight = this._originalBodyPadding;
        }
      }, {
        key : "_getScrollbarWidth",
        /**
         * @return {?}
         */
        value : function() {
          /** @type {Element} */
          var n = document.createElement("div");
          /** @type {string} */
          n.className = node.SCROLLBAR_MEASURER;
          document.body.appendChild(n);
          /** @type {number} */
          var e = n.offsetWidth - n.clientWidth;
          return document.body.removeChild(n), e;
        }
      }], [{
        key : "_jQueryInterface",
        /**
         * @param {string} event
         * @param {?} expectedNumberOfNonCommentArgs
         * @return {?}
         */
        value : function(event, expectedNumberOfNonCommentArgs) {
          return this.each(function() {
            var data = $(this).data(dataKey);
            var options = $.extend({}, value.Default, $(this).data(), "object" == typeof event && event);
            if (data || (data = new value(this, options), $(this).data(dataKey, data)), "string" == typeof event) {
              if (void 0 === data[event]) {
                throw new Error('No method named "' + event + '"');
              }
              data[event](expectedNumberOfNonCommentArgs);
            } else {
              if (options.show) {
                data.show(expectedNumberOfNonCommentArgs);
              }
            }
          });
        }
      }, {
        key : "VERSION",
        /**
         * @return {?}
         */
        get : function() {
          return entries;
        }
      }, {
        key : "Default",
        /**
         * @return {?}
         */
        get : function() {
          return defaults;
        }
      }]), value;
    }();
    return $(document).on(events.CLICK_DATA_API, o.DATA_TOGGLE, function(types) {
      var targetElement = this;
      var elem = void 0;
      var statsTemplate = self.getSelectorFromElement(this);
      if (statsTemplate) {
        elem = $(statsTemplate)[0];
      }
      var option = $(elem).data(dataKey) ? "toggle" : $.extend({}, $(elem).data(), $(this).data());
      if ("A" === this.tagName) {
        types.preventDefault();
      }
      var el = $(elem).one(events.SHOW, function(event) {
        if (!event.isDefaultPrevented()) {
          el.one(events.HIDDEN, function() {
            if ($(targetElement).is(":visible")) {
              targetElement.focus();
            }
          });
        }
      });
      config._jQueryInterface.call($(elem), option, this);
    }), $.fn[name] = config._jQueryInterface, $.fn[name].Constructor = config, $.fn[name].noConflict = function() {
      return $.fn[name] = ref, config._jQueryInterface;
    }, config;
  }(jQuery), function($) {
    /** @type {string} */
    var name = "scrollspy";
    /** @type {string} */
    var entries = "4.0.0-alpha";
    /** @type {string} */
    var key = "bs.scrollspy";
    /** @type {string} */
    var e = "." + key;
    /** @type {string} */
    var extension = ".data-api";
    var ref = $.fn[name];
    var defaults = {
      offset : 10,
      method : "auto",
      target : ""
    };
    var params = {
      offset : "number",
      method : "string",
      target : "(string|element)"
    };
    var me = {
      ACTIVATE : "activate" + e,
      SCROLL : "scroll" + e,
      LOAD_DATA_API : "load" + e + extension
    };
    var CLASS = {
      DROPDOWN_ITEM : "dropdown-item",
      DROPDOWN_MENU : "dropdown-menu",
      NAV_LINK : "nav-link",
      NAV : "nav",
      ACTIVE : "active"
    };
    var self = {
      DATA_SPY : '[data-spy="scroll"]',
      ACTIVE : ".active",
      LIST_ITEM : ".list-item",
      LI : "li",
      LI_DROPDOWN : "li.dropdown",
      NAV_LINKS : ".nav-link",
      DROPDOWN : ".dropdown",
      DROPDOWN_ITEMS : ".dropdown-item",
      DROPDOWN_TOGGLE : ".dropdown-toggle"
    };
    var gl = {
      OFFSET : "offset",
      POSITION : "position"
    };
    var config = function() {
      /**
       * @param {HTMLElement} node
       * @param {?} opts
       * @return {undefined}
       */
      function value(node, opts) {
        toString(this, value);
        /** @type {HTMLElement} */
        this._element = node;
        this._scrollElement = "BODY" === node.tagName ? window : node;
        this._config = this._getConfig(opts);
        /** @type {string} */
        this._selector = this._config.target + " " + self.NAV_LINKS + "," + (this._config.target + " " + self.DROPDOWN_ITEMS);
        /** @type {Array} */
        this._offsets = [];
        /** @type {Array} */
        this._targets = [];
        /** @type {null} */
        this._activeTarget = null;
        /** @type {number} */
        this._scrollHeight = 0;
        $(this._scrollElement).on(me.SCROLL, $.proxy(this._process, this));
        this.refresh();
        this._process();
      }
      return lookupIterator(value, [{
        key : "refresh",
        /**
         * @return {undefined}
         */
        value : function() {
          var p = this;
          /** @type {string} */
          var type_ = this._scrollElement !== this._scrollElement.window ? gl.POSITION : gl.OFFSET;
          var type = "auto" === this._config.method ? type_ : this._config.method;
          var nub_height = type === gl.POSITION ? this._getScrollTop() : 0;
          /** @type {Array} */
          this._offsets = [];
          /** @type {Array} */
          this._targets = [];
          this._scrollHeight = this._getScrollHeight();
          var mod = $.makeArray($(this._selector));
          mod.map(function(key) {
            var el = void 0;
            var camelKey = self.getSelectorFromElement(key);
            return camelKey && (el = $(camelKey)[0]), el && (el.offsetWidth || el.offsetHeight) ? [$(el)[type]().top + nub_height, camelKey] : void 0;
          }).filter(function(argument) {
            return argument;
          }).sort(function(mat0, mat1) {
            return mat0[0] - mat1[0];
          }).forEach(function(tail) {
            p._offsets.push(tail[0]);
            p._targets.push(tail[1]);
          });
        }
      }, {
        key : "dispose",
        /**
         * @return {undefined}
         */
        value : function() {
          $.removeData(this._element, key);
          $(this._scrollElement).off(e);
          /** @type {null} */
          this._element = null;
          /** @type {null} */
          this._scrollElement = null;
          /** @type {null} */
          this._config = null;
          /** @type {null} */
          this._selector = null;
          /** @type {null} */
          this._offsets = null;
          /** @type {null} */
          this._targets = null;
          /** @type {null} */
          this._activeTarget = null;
          /** @type {null} */
          this._scrollHeight = null;
        }
      }, {
        key : "_getConfig",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          if (event = $.extend({}, defaults, event), "string" != typeof event.target) {
            var r = $(event.target).attr("id");
            if (!r) {
              r = self.getUID(name);
              $(event.target).attr("id", r);
            }
            /** @type {string} */
            event.target = "#" + r;
          }
          return self.typeCheckConfig(name, event, params), event;
        }
      }, {
        key : "_getScrollTop",
        /**
         * @return {?}
         */
        value : function() {
          return this._scrollElement === window ? this._scrollElement.scrollY : this._scrollElement.scrollTop;
        }
      }, {
        key : "_getScrollHeight",
        /**
         * @return {?}
         */
        value : function() {
          return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        }
      }, {
        key : "_process",
        /**
         * @return {?}
         */
        value : function() {
          var index = this._getScrollTop() + this._config.offset;
          var n = this._getScrollHeight();
          /** @type {number} */
          var inputLength = this._config.offset + n - this._scrollElement.offsetHeight;
          if (this._scrollHeight !== n && this.refresh(), index >= inputLength) {
            var selectedIndex = this._targets[this._targets.length - 1];
            if (this._activeTarget !== selectedIndex) {
              this._activate(selectedIndex);
            }
          }
          if (this._activeTarget && index < this._offsets[0]) {
            return this._activeTarget = null, void this._clear();
          }
          var i = this._offsets.length;
          for (;i--;) {
            /** @type {boolean} */
            var s = this._activeTarget !== this._targets[i] && (index >= this._offsets[i] && (void 0 === this._offsets[i + 1] || index < this._offsets[i + 1]));
            if (s) {
              this._activate(this._targets[i]);
            }
          }
        }
      }, {
        key : "_activate",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          /** @type {string} */
          this._activeTarget = event;
          this._clear();
          var paths = this._selector.split(",");
          paths = paths.map(function(eventPrefix) {
            return eventPrefix + '[data-target="' + event + '"],' + (eventPrefix + '[href="' + event + '"]');
          });
          var target = $(paths.join(","));
          if (target.hasClass(CLASS.DROPDOWN_ITEM)) {
            target.closest(self.DROPDOWN).find(self.DROPDOWN_TOGGLE).addClass(CLASS.ACTIVE);
            target.addClass(CLASS.ACTIVE);
          } else {
            target.parents(self.LI).find(self.NAV_LINKS).addClass(CLASS.ACTIVE);
          }
          $(this._scrollElement).trigger(me.ACTIVATE, {
            relatedTarget : event
          });
        }
      }, {
        key : "_clear",
        /**
         * @return {undefined}
         */
        value : function() {
          $(this._selector).filter(self.ACTIVE).removeClass(CLASS.ACTIVE);
        }
      }], [{
        key : "_jQueryInterface",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this.each(function() {
            var child = $(this).data(key);
            var name = "object" == typeof event && event || null;
            if (child || (child = new value(this, name), $(this).data(key, child)), "string" == typeof event) {
              if (void 0 === child[event]) {
                throw new Error('No method named "' + event + '"');
              }
              child[event]();
            }
          });
        }
      }, {
        key : "VERSION",
        /**
         * @return {?}
         */
        get : function() {
          return entries;
        }
      }, {
        key : "Default",
        /**
         * @return {?}
         */
        get : function() {
          return defaults;
        }
      }]), value;
    }();
    return $(window).on(me.LOAD_DATA_API, function() {
      var tags = $.makeArray($(self.DATA_SPY));
      var index = tags.length;
      for (;index--;) {
        var $t = $(tags[index]);
        config._jQueryInterface.call($t, $t.data());
      }
    }), $.fn[name] = config._jQueryInterface, $.fn[name].Constructor = config, $.fn[name].noConflict = function() {
      return $.fn[name] = ref, config._jQueryInterface;
    }, config;
  }(jQuery), function($) {
    /** @type {string} */
    var name = "tab";
    /** @type {string} */
    var entries = "4.0.0-alpha";
    /** @type {string} */
    var className = "bs.tab";
    /** @type {string} */
    var evSuffix = "." + className;
    /** @type {string} */
    var event_cleanup = ".data-api";
    var ref = $.fn[name];
    /** @type {number} */
    var wait = 150;
    var events = {
      HIDE : "hide" + evSuffix,
      HIDDEN : "hidden" + evSuffix,
      SHOW : "show" + evSuffix,
      SHOWN : "shown" + evSuffix,
      CLICK_DATA_API : "click" + evSuffix + event_cleanup
    };
    var CLASS = {
      DROPDOWN_MENU : "dropdown-menu",
      ACTIVE : "active",
      FADE : "fade",
      IN : "in"
    };
    var obj = {
      A : "a",
      LI : "li",
      DROPDOWN : ".dropdown",
      UL : "ul:not(.dropdown-menu)",
      FADE_CHILD : "> .nav-item .fade, > .fade",
      ACTIVE : ".active",
      ACTIVE_CHILD : "> .nav-item > .active, > .active",
      DATA_TOGGLE : '[data-toggle="tab"], [data-toggle="pill"]',
      DROPDOWN_TOGGLE : ".dropdown-toggle",
      DROPDOWN_ACTIVE_CHILD : "> .dropdown-menu .active"
    };
    var config = function() {
      /**
       * @param {?} anElement
       * @return {undefined}
       */
      function value(anElement) {
        toString(this, value);
        this._element = anElement;
      }
      return lookupIterator(value, [{
        key : "show",
        /**
         * @return {undefined}
         */
        value : function() {
          var that = this;
          if (!this._element.parentNode || (this._element.parentNode.nodeType !== Node.ELEMENT_NODE || !$(this._element).hasClass(CLASS.ACTIVE))) {
            var insertAt = void 0;
            var previous = void 0;
            var sourceContainer = $(this._element).closest(obj.UL)[0];
            var point = self.getSelectorFromElement(this._element);
            if (sourceContainer) {
              previous = $.makeArray($(sourceContainer).find(obj.ACTIVE));
              previous = previous[previous.length - 1];
            }
            var qualifier = $.Event(events.HIDE, {
              relatedTarget : this._element
            });
            var endEvent = $.Event(events.SHOW, {
              relatedTarget : previous
            });
            if (previous && $(previous).trigger(qualifier), $(this._element).trigger(endEvent), !endEvent.isDefaultPrevented() && !qualifier.isDefaultPrevented()) {
              if (point) {
                insertAt = $(point)[0];
              }
              this._activate(this._element, sourceContainer);
              /**
               * @return {undefined}
               */
              var add = function() {
                var qualifier = $.Event(events.HIDDEN, {
                  relatedTarget : that._element
                });
                var endEvent = $.Event(events.SHOWN, {
                  relatedTarget : previous
                });
                $(previous).trigger(qualifier);
                $(that._element).trigger(endEvent);
              };
              if (insertAt) {
                this._activate(insertAt, insertAt.parentNode, add);
              } else {
                add();
              }
            }
          }
        }
      }, {
        key : "dispose",
        /**
         * @return {undefined}
         */
        value : function() {
          $.removeClass(this._element, className);
          /** @type {null} */
          this._element = null;
        }
      }, {
        key : "_activate",
        /**
         * @param {string} event
         * @param {?} expectedNumberOfNonCommentArgs
         * @param {boolean} b
         * @return {undefined}
         */
        value : function(event, expectedNumberOfNonCommentArgs, b) {
          var v = $(expectedNumberOfNonCommentArgs).find(obj.ACTIVE_CHILD)[0];
          var bup = b && (self.supportsTransitionEnd() && (v && $(v).hasClass(CLASS.FADE) || Boolean($(expectedNumberOfNonCommentArgs).find(obj.FADE_CHILD)[0])));
          var complete = $.proxy(this._transitionComplete, this, event, v, bup, b);
          if (v && bup) {
            $(v).one(self.TRANSITION_END, complete).emulateTransitionEnd(wait);
          } else {
            complete();
          }
          if (v) {
            $(v).removeClass(CLASS.IN);
          }
        }
      }, {
        key : "_transitionComplete",
        /**
         * @param {string} event
         * @param {?} expectedNumberOfNonCommentArgs
         * @param {boolean} dataAndEvents
         * @param {?} func
         * @return {undefined}
         */
        value : function(event, expectedNumberOfNonCommentArgs, dataAndEvents, func) {
          if (expectedNumberOfNonCommentArgs) {
            $(expectedNumberOfNonCommentArgs).removeClass(CLASS.ACTIVE);
            var fromPage = $(expectedNumberOfNonCommentArgs).find(obj.DROPDOWN_ACTIVE_CHILD)[0];
            if (fromPage) {
              $(fromPage).removeClass(CLASS.ACTIVE);
            }
            expectedNumberOfNonCommentArgs.setAttribute("aria-expanded", false);
          }
          if ($(event).addClass(CLASS.ACTIVE), event.setAttribute("aria-expanded", true), dataAndEvents ? (self.reflow(event), $(event).addClass(CLASS.IN)) : $(event).removeClass(CLASS.FADE), event.parentNode && $(event.parentNode).hasClass(CLASS.DROPDOWN_MENU)) {
            var sourceContainer = $(event).closest(obj.DROPDOWN)[0];
            if (sourceContainer) {
              $(sourceContainer).find(obj.DROPDOWN_TOGGLE).addClass(CLASS.ACTIVE);
            }
            event.setAttribute("aria-expanded", true);
          }
          if (func) {
            func();
          }
        }
      }], [{
        key : "_jQueryInterface",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this.each(function() {
            var self = $(this);
            var instance = self.data(className);
            if (instance || (instance = instance = new value(this), self.data(className, instance)), "string" == typeof event) {
              if (void 0 === instance[event]) {
                throw new Error('No method named "' + event + '"');
              }
              instance[event]();
            }
          });
        }
      }, {
        key : "VERSION",
        /**
         * @return {?}
         */
        get : function() {
          return entries;
        }
      }]), value;
    }();
    return $(document).on(events.CLICK_DATA_API, obj.DATA_TOGGLE, function(types) {
      types.preventDefault();
      config._jQueryInterface.call($(this), "show");
    }), $.fn[name] = config._jQueryInterface, $.fn[name].Constructor = config, $.fn[name].noConflict = function() {
      return $.fn[name] = ref, config._jQueryInterface;
    }, config;
  }(jQuery), function($) {
    if (void 0 === window.Tether) {
      throw new Error("Bootstrap tooltips require Tether (http://github.hubspot.com/tether/)");
    }
    /** @type {string} */
    var name = "tooltip";
    /** @type {string} */
    var opt_val = "4.0.0-alpha";
    /** @type {string} */
    var elem = "bs.tooltip";
    /** @type {string} */
    var NS = "." + elem;
    var ref = $.fn[name];
    /** @type {number} */
    var wait = 150;
    /** @type {string} */
    var classPrefix = "bs-tether";
    var options = {
      animation : true,
      template : '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
      trigger : "hover focus",
      title : "",
      delay : 0,
      html : false,
      selector : false,
      placement : "top",
      offset : "0 0",
      constraints : []
    };
    var defaults = {
      animation : "boolean",
      template : "string",
      title : "(string|element|function)",
      trigger : "string",
      delay : "(number|object)",
      html : "boolean",
      selector : "(string|boolean)",
      placement : "(string|function)",
      offset : "string",
      constraints : "array"
    };
    var PLAYER = {
      TOP : "bottom center",
      RIGHT : "middle left",
      BOTTOM : "top center",
      LEFT : "middle right"
    };
    var signature = {
      IN : "in",
      OUT : "out"
    };
    var entries = {
      HIDE : "hide" + NS,
      HIDDEN : "hidden" + NS,
      SHOW : "show" + NS,
      SHOWN : "shown" + NS,
      INSERTED : "inserted" + NS,
      CLICK : "click" + NS,
      FOCUSIN : "focusin" + NS,
      FOCUSOUT : "focusout" + NS,
      MOUSEENTER : "mouseenter" + NS,
      MOUSELEAVE : "mouseleave" + NS
    };
    var node = {
      FADE : "fade",
      IN : "in"
    };
    var env = {
      TOOLTIP : ".tooltip",
      TOOLTIP_INNER : ".tooltip-inner"
    };
    var classes = {
      element : false,
      enabled : false
    };
    var e = {
      HOVER : "hover",
      FOCUS : "focus",
      CLICK : "click",
      MANUAL : "manual"
    };
    var Constructor = function() {
      /**
       * @param {string} element
       * @param {?} config
       * @return {undefined}
       */
      function constructor(element, config) {
        toString(this, constructor);
        /** @type {boolean} */
        this._isEnabled = true;
        /** @type {number} */
        this._timeout = 0;
        /** @type {string} */
        this._hoverState = "";
        this._activeTrigger = {};
        /** @type {null} */
        this._tether = null;
        /** @type {string} */
        this.element = element;
        this.config = this._getConfig(config);
        /** @type {null} */
        this.tip = null;
        this._setListeners();
      }
      return lookupIterator(constructor, [{
        key : "enable",
        /**
         * @return {undefined}
         */
        value : function() {
          /** @type {boolean} */
          this._isEnabled = true;
        }
      }, {
        key : "disable",
        /**
         * @return {undefined}
         */
        value : function() {
          /** @type {boolean} */
          this._isEnabled = false;
        }
      }, {
        key : "toggleEnabled",
        /**
         * @return {undefined}
         */
        value : function() {
          /** @type {boolean} */
          this._isEnabled = !this._isEnabled;
        }
      }, {
        key : "toggle",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          if (event) {
            var index = this.constructor.DATA_KEY;
            var self = $(event.currentTarget).data(index);
            if (!self) {
              self = new this.constructor(event.currentTarget, this._getDelegateConfig());
              $(event.currentTarget).data(index, self);
            }
            /** @type {boolean} */
            self._activeTrigger.click = !self._activeTrigger.click;
            if (self._isWithActiveTrigger()) {
              self._enter(null, self);
            } else {
              self._leave(null, self);
            }
          } else {
            if ($(this.getTipElement()).hasClass(node.IN)) {
              return void this._leave(null, this);
            }
            this._enter(null, this);
          }
        }
      }, {
        key : "dispose",
        /**
         * @return {undefined}
         */
        value : function() {
          clearTimeout(this._timeout);
          this.cleanupTether();
          $.removeData(this.element, this.constructor.DATA_KEY);
          $(this.element).off(this.constructor.EVENT_KEY);
          if (this.tip) {
            $(this.tip).remove();
          }
          /** @type {null} */
          this._isEnabled = null;
          /** @type {null} */
          this._timeout = null;
          /** @type {null} */
          this._hoverState = null;
          /** @type {null} */
          this._activeTrigger = null;
          /** @type {null} */
          this._tether = null;
          /** @type {null} */
          this.element = null;
          /** @type {null} */
          this.config = null;
          /** @type {null} */
          this.tip = null;
        }
      }, {
        key : "show",
        /**
         * @return {?}
         */
        value : function() {
          var me = this;
          var qualifier = $.Event(this.constructor.Event.SHOW);
          if (this.isWithContent() && this._isEnabled) {
            $(this.element).trigger(qualifier);
            var items = $.contains(this.element.ownerDocument.documentElement, this.element);
            if (qualifier.isDefaultPrevented() || !items) {
              return;
            }
            var elem = this.getTipElement();
            var id = self.getUID(this.constructor.NAME);
            elem.setAttribute("id", id);
            this.element.setAttribute("aria-describedby", id);
            this.setContent();
            if (this.config.animation) {
              $(elem).addClass(node.FADE);
            }
            var r20 = "function" == typeof this.config.placement ? this.config.placement.call(this, elem, this.element) : this.config.placement;
            var attachment = this._getAttachment(r20);
            $(elem).data(this.constructor.DATA_KEY, this).appendTo(document.body);
            $(this.element).trigger(this.constructor.Event.INSERTED);
            this._tether = new Tether({
              attachment : attachment,
              element : elem,
              target : this.element,
              classes : classes,
              classPrefix : classPrefix,
              offset : this.config.offset,
              constraints : this.config.constraints,
              addTargetClasses : false
            });
            self.reflow(elem);
            this._tether.position();
            $(elem).addClass(node.IN);
            /**
             * @return {undefined}
             */
            var next = function() {
              var modified = me._hoverState;
              /** @type {null} */
              me._hoverState = null;
              $(me.element).trigger(me.constructor.Event.SHOWN);
              if (modified === signature.OUT) {
                me._leave(null, me);
              }
            };
            if (self.supportsTransitionEnd() && $(this.tip).hasClass(node.FADE)) {
              return void $(this.tip).one(self.TRANSITION_END, next).emulateTransitionEnd(constructor._TRANSITION_DURATION);
            }
            next();
          }
        }
      }, {
        key : "hide",
        /**
         * @param {string} event
         * @return {undefined}
         */
        value : function(event) {
          var ev = this;
          var el = this.getTipElement();
          var qualifier = $.Event(this.constructor.Event.HIDE);
          /**
           * @return {undefined}
           */
          var init = function() {
            if (ev._hoverState !== signature.IN) {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
            }
            ev.element.removeAttribute("aria-describedby");
            $(ev.element).trigger(ev.constructor.Event.HIDDEN);
            ev.cleanupTether();
            if (event) {
              event();
            }
          };
          $(this.element).trigger(qualifier);
          if (!qualifier.isDefaultPrevented()) {
            $(el).removeClass(node.IN);
            if (self.supportsTransitionEnd() && $(this.tip).hasClass(node.FADE)) {
              $(el).one(self.TRANSITION_END, init).emulateTransitionEnd(wait);
            } else {
              init();
            }
            /** @type {string} */
            this._hoverState = "";
          }
        }
      }, {
        key : "isWithContent",
        /**
         * @return {?}
         */
        value : function() {
          return Boolean(this.getTitle());
        }
      }, {
        key : "getTipElement",
        /**
         * @return {?}
         */
        value : function() {
          return this.tip = this.tip || $(this.config.template)[0];
        }
      }, {
        key : "setContent",
        /**
         * @return {undefined}
         */
        value : function() {
          var that = $(this.getTipElement());
          this.setElementContent(that.find(env.TOOLTIP_INNER), this.getTitle());
          that.removeClass(node.FADE).removeClass(node.IN);
          this.cleanupTether();
        }
      }, {
        key : "setElementContent",
        /**
         * @param {string} event
         * @param {Object} expectedNumberOfNonCommentArgs
         * @return {undefined}
         */
        value : function(event, expectedNumberOfNonCommentArgs) {
          var html = this.config.html;
          if ("object" == typeof expectedNumberOfNonCommentArgs && (expectedNumberOfNonCommentArgs.nodeType || expectedNumberOfNonCommentArgs.jquery)) {
            if (html) {
              if (!$(expectedNumberOfNonCommentArgs).parent().is(event)) {
                event.empty().append(expectedNumberOfNonCommentArgs);
              }
            } else {
              event.text($(expectedNumberOfNonCommentArgs).text());
            }
          } else {
            event[html ? "html" : "text"](expectedNumberOfNonCommentArgs);
          }
        }
      }, {
        key : "getTitle",
        /**
         * @return {?}
         */
        value : function() {
          var content = this.element.getAttribute("data-original-title");
          return content || (content = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title), content;
        }
      }, {
        key : "cleanupTether",
        /**
         * @return {undefined}
         */
        value : function() {
          if (this._tether) {
            this._tether.destroy();
          }
        }
      }, {
        key : "_getAttachment",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return PLAYER[event.toUpperCase()];
        }
      }, {
        key : "_setListeners",
        /**
         * @return {undefined}
         */
        value : function() {
          var self = this;
          var asserterNames = this.config.trigger.split(" ");
          asserterNames.forEach(function(el) {
            if ("click" === el) {
              $(self.element).on(self.constructor.Event.CLICK, self.config.selector, $.proxy(self.toggle, self));
            } else {
              if (el !== e.MANUAL) {
                var button = el === e.HOVER ? self.constructor.Event.MOUSEENTER : self.constructor.Event.FOCUSIN;
                var e2 = el === e.HOVER ? self.constructor.Event.MOUSELEAVE : self.constructor.Event.FOCUSOUT;
                $(self.element).on(button, self.config.selector, $.proxy(self._enter, self)).on(e2, self.config.selector, $.proxy(self._leave, self));
              }
            }
          });
          if (this.config.selector) {
            this.config = $.extend({}, this.config, {
              trigger : "manual",
              selector : ""
            });
          } else {
            this._fixTitle();
          }
        }
      }, {
        key : "_fixTitle",
        /**
         * @return {undefined}
         */
        value : function() {
          /** @type {string} */
          var expression = typeof this.element.getAttribute("data-original-title");
          if (this.element.getAttribute("title") || "string" !== expression) {
            this.element.setAttribute("data-original-title", this.element.getAttribute("title") || "");
            this.element.setAttribute("title", "");
          }
        }
      }, {
        key : "_enter",
        /**
         * @param {string} event
         * @param {?} expectedNumberOfNonCommentArgs
         * @return {?}
         */
        value : function(event, expectedNumberOfNonCommentArgs) {
          var p = this.constructor.DATA_KEY;
          return expectedNumberOfNonCommentArgs = expectedNumberOfNonCommentArgs || $(event.currentTarget).data(p), expectedNumberOfNonCommentArgs || (expectedNumberOfNonCommentArgs = new this.constructor(event.currentTarget, this._getDelegateConfig()), $(event.currentTarget).data(p, expectedNumberOfNonCommentArgs)), event && (expectedNumberOfNonCommentArgs._activeTrigger["focusin" === event.type ? e.FOCUS : e.HOVER] = true), $(expectedNumberOfNonCommentArgs.getTipElement()).hasClass(node.IN) ||
          expectedNumberOfNonCommentArgs._hoverState === signature.IN ? void(expectedNumberOfNonCommentArgs._hoverState = signature.IN) : (clearTimeout(expectedNumberOfNonCommentArgs._timeout), expectedNumberOfNonCommentArgs._hoverState = signature.IN, expectedNumberOfNonCommentArgs.config.delay && expectedNumberOfNonCommentArgs.config.delay.show ? void(expectedNumberOfNonCommentArgs._timeout = setTimeout(function() {
            if (expectedNumberOfNonCommentArgs._hoverState === signature.IN) {
              expectedNumberOfNonCommentArgs.show();
            }
          }, expectedNumberOfNonCommentArgs.config.delay.show)) : void expectedNumberOfNonCommentArgs.show());
        }
      }, {
        key : "_leave",
        /**
         * @param {string} event
         * @param {?} expectedNumberOfNonCommentArgs
         * @return {?}
         */
        value : function(event, expectedNumberOfNonCommentArgs) {
          var p = this.constructor.DATA_KEY;
          return expectedNumberOfNonCommentArgs = expectedNumberOfNonCommentArgs || $(event.currentTarget).data(p), expectedNumberOfNonCommentArgs || (expectedNumberOfNonCommentArgs = new this.constructor(event.currentTarget, this._getDelegateConfig()), $(event.currentTarget).data(p, expectedNumberOfNonCommentArgs)), event && (expectedNumberOfNonCommentArgs._activeTrigger["focusout" === event.type ? e.FOCUS : e.HOVER] = false), expectedNumberOfNonCommentArgs._isWithActiveTrigger() ? void 0 : (clearTimeout(expectedNumberOfNonCommentArgs._timeout),
          expectedNumberOfNonCommentArgs._hoverState = signature.OUT, expectedNumberOfNonCommentArgs.config.delay && expectedNumberOfNonCommentArgs.config.delay.hide ? void(expectedNumberOfNonCommentArgs._timeout = setTimeout(function() {
            if (expectedNumberOfNonCommentArgs._hoverState === signature.OUT) {
              expectedNumberOfNonCommentArgs.hide();
            }
          }, expectedNumberOfNonCommentArgs.config.delay.hide)) : void expectedNumberOfNonCommentArgs.hide());
        }
      }, {
        key : "_isWithActiveTrigger",
        /**
         * @return {?}
         */
        value : function() {
          var unlock;
          for (unlock in this._activeTrigger) {
            if (this._activeTrigger[unlock]) {
              return true;
            }
          }
          return false;
        }
      }, {
        key : "_getConfig",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return event = $.extend({}, this.constructor.Default, $(this.element).data(), event), event.delay && ("number" == typeof event.delay && (event.delay = {
            show : event.delay,
            hide : event.delay
          })), self.typeCheckConfig(name, event, this.constructor.DefaultType), event;
        }
      }, {
        key : "_getDelegateConfig",
        /**
         * @return {?}
         */
        value : function() {
          var old = {};
          if (this.config) {
            var name;
            for (name in this.config) {
              if (this.constructor.Default[name] !== this.config[name]) {
                old[name] = this.config[name];
              }
            }
          }
          return old;
        }
      }], [{
        key : "_jQueryInterface",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this.each(function() {
            var item = $(this).data(elem);
            var itemData = "object" == typeof event ? event : null;
            if ((item || !/destroy|hide/.test(event)) && (item || (item = new constructor(this, itemData), $(this).data(elem, item)), "string" == typeof event)) {
              if (void 0 === item[event]) {
                throw new Error('No method named "' + event + '"');
              }
              item[event]();
            }
          });
        }
      }, {
        key : "VERSION",
        /**
         * @return {?}
         */
        get : function() {
          return opt_val;
        }
      }, {
        key : "Default",
        /**
         * @return {?}
         */
        get : function() {
          return options;
        }
      }, {
        key : "NAME",
        /**
         * @return {?}
         */
        get : function() {
          return name;
        }
      }, {
        key : "DATA_KEY",
        /**
         * @return {?}
         */
        get : function() {
          return elem;
        }
      }, {
        key : "Event",
        /**
         * @return {?}
         */
        get : function() {
          return entries;
        }
      }, {
        key : "EVENT_KEY",
        /**
         * @return {?}
         */
        get : function() {
          return NS;
        }
      }, {
        key : "DefaultType",
        /**
         * @return {?}
         */
        get : function() {
          return defaults;
        }
      }]), constructor;
    }();
    return $.fn[name] = Constructor._jQueryInterface, $.fn[name].Constructor = Constructor, $.fn[name].noConflict = function() {
      return $.fn[name] = ref, Constructor._jQueryInterface;
    }, Constructor;
  }(jQuery));
  (function($) {
    /** @type {string} */
    var name = "popover";
    /** @type {string} */
    var opt_val = "4.0.0-alpha";
    /** @type {string} */
    var elem = "bs.popover";
    /** @type {string} */
    var NS = "." + elem;
    var ref = $.fn[name];
    var OUTPUT = $.extend({}, item.Default, {
      placement : "right",
      trigger : "click",
      content : "",
      template : '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });
    var fn = $.extend({}, item.DefaultType, {
      content : "(string|element|function)"
    });
    var opts = {
      FADE : "fade",
      IN : "in"
    };
    var env = {
      TITLE : ".popover-title",
      CONTENT : ".popover-content",
      ARROW : ".popover-arrow"
    };
    var entries = {
      HIDE : "hide" + NS,
      HIDDEN : "hidden" + NS,
      SHOW : "show" + NS,
      SHOWN : "shown" + NS,
      INSERTED : "inserted" + NS,
      CLICK : "click" + NS,
      FOCUSIN : "focusin" + NS,
      FOCUSOUT : "focusout" + NS,
      MOUSEENTER : "mouseenter" + NS,
      MOUSELEAVE : "mouseleave" + NS
    };
    var object = function(v2) {
      /**
       * @return {undefined}
       */
      function value() {
        toString(this, value);
        defineProperty(Object.getPrototypeOf(value.prototype), "constructor", this).apply(this, arguments);
      }
      return f(value, v2), lookupIterator(value, [{
        key : "isWithContent",
        /**
         * @return {?}
         */
        value : function() {
          return this.getTitle() || this._getContent();
        }
      }, {
        key : "getTipElement",
        /**
         * @return {?}
         */
        value : function() {
          return this.tip = this.tip || $(this.config.template)[0];
        }
      }, {
        key : "setContent",
        /**
         * @return {undefined}
         */
        value : function() {
          var dialog = $(this.getTipElement());
          this.setElementContent(dialog.find(env.TITLE), this.getTitle());
          this.setElementContent(dialog.find(env.CONTENT), this._getContent());
          dialog.removeClass(opts.FADE).removeClass(opts.IN);
          this.cleanupTether();
        }
      }, {
        key : "_getContent",
        /**
         * @return {?}
         */
        value : function() {
          return this.element.getAttribute("data-content") || ("function" == typeof this.config.content ? this.config.content.call(this.element) : this.config.content);
        }
      }], [{
        key : "_jQueryInterface",
        /**
         * @param {string} event
         * @return {?}
         */
        value : function(event) {
          return this.each(function() {
            var events = $(this).data(elem);
            var touchItem = "object" == typeof event ? event : null;
            if ((events || !/destroy|hide/.test(event)) && (events || (events = new value(this, touchItem), $(this).data(elem, events)), "string" == typeof event)) {
              if (void 0 === events[event]) {
                throw new Error('No method named "' + event + '"');
              }
              events[event]();
            }
          });
        }
      }, {
        key : "VERSION",
        /**
         * @return {?}
         */
        get : function() {
          return opt_val;
        }
      }, {
        key : "Default",
        /**
         * @return {?}
         */
        get : function() {
          return OUTPUT;
        }
      }, {
        key : "NAME",
        /**
         * @return {?}
         */
        get : function() {
          return name;
        }
      }, {
        key : "DATA_KEY",
        /**
         * @return {?}
         */
        get : function() {
          return elem;
        }
      }, {
        key : "Event",
        /**
         * @return {?}
         */
        get : function() {
          return entries;
        }
      }, {
        key : "EVENT_KEY",
        /**
         * @return {?}
         */
        get : function() {
          return NS;
        }
      }, {
        key : "DefaultType",
        /**
         * @return {?}
         */
        get : function() {
          return fn;
        }
      }]), value;
    }(item);
    return $.fn[name] = object._jQueryInterface, $.fn[name].Constructor = object, $.fn[name].noConflict = function() {
      return $.fn[name] = ref, object._jQueryInterface;
    }, object;
  })(jQuery);
}(jQuery);
!function(root, factory) {
  if ("object" == typeof exports && "undefined" != typeof module) {
    module.exports = factory();
  } else {
    if ("function" == typeof define && define.amd) {
      define(factory);
    } else {
      root.moment = factory();
    }
  }
}(this, function() {
  /**
   * @return {?}
   */
  function moment() {
    return matcherFunction.apply(null, arguments);
  }
  /**
   * @param {Function} code
   * @return {undefined}
   */
  function factory(code) {
    /** @type {Function} */
    matcherFunction = code;
  }
  /**
   * @param {?} input
   * @return {?}
   */
  function isArray(input) {
    return "[object Array]" === Object.prototype.toString.call(input);
  }
  /**
   * @param {?} input
   * @return {?}
   */
  function isDate(input) {
    return input instanceof Date || "[object Date]" === Object.prototype.toString.call(input);
  }
  /**
   * @param {Array} codeSegments
   * @param {Function} fn
   * @return {?}
   */
  function describe(codeSegments, fn) {
    var i;
    /** @type {Array} */
    var result = [];
    /** @type {number} */
    i = 0;
    for (;i < codeSegments.length;++i) {
      result.push(fn(codeSegments[i], i));
    }
    return result;
  }
  /**
   * @param {Object} obj
   * @param {string} key
   * @return {?}
   */
  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  /**
   * @param {Object} a
   * @param {Object} b
   * @return {?}
   */
  function forEach(a, b) {
    var key;
    for (key in b) {
      if (hasOwn(b, key)) {
        a[key] = b[key];
      }
    }
    return hasOwn(b, "toString") && (a.toString = b.toString), hasOwn(b, "valueOf") && (a.valueOf = b.valueOf), a;
  }
  /**
   * @param {?} b
   * @param {string} options
   * @param {?} deepDataAndEvents
   * @param {?} start
   * @return {?}
   */
  function slice(b, options, deepDataAndEvents, start) {
    return clone(b, options, deepDataAndEvents, start, true).utc();
  }
  /**
   * @return {?}
   */
  function makeMap() {
    return{
      empty : false,
      unusedTokens : [],
      unusedInput : [],
      overflow : -2,
      charsLeftOver : 0,
      nullInput : false,
      invalidMonth : null,
      invalidFormat : false,
      userInvalidated : false,
      iso : false
    };
  }
  /**
   * @param {Object} a
   * @return {?}
   */
  function req(a) {
    return null == a._pf && (a._pf = makeMap()), a._pf;
  }
  /**
   * @param {number} m
   * @return {?}
   */
  function isValid(m) {
    if (null == m._isValid) {
      var list = req(m);
      /** @type {boolean} */
      m._isValid = !(isNaN(m._d.getTime()) || (!(list.overflow < 0) || (list.empty || (list.invalidMonth || (list.invalidWeekday || (list.nullInput || (list.invalidFormat || list.userInvalidated)))))));
      if (m._strict) {
        /** @type {boolean} */
        m._isValid = m._isValid && (0 === list.charsLeftOver && (0 === list.unusedTokens.length && void 0 === list.bigHour));
      }
    }
    return m._isValid;
  }
  /**
   * @param {Object} callback
   * @return {?}
   */
  function server(callback) {
    var a = slice(NaN);
    return null != callback ? forEach(req(a), callback) : req(a).userInvalidated = true, a;
  }
  /**
   * @param {string} a
   * @return {?}
   */
  function extend(a) {
    return void 0 === a;
  }
  /**
   * @param {?} config
   * @param {Function} m
   * @return {?}
   */
  function send(config, m) {
    var i;
    var name;
    var base;
    if (extend(m._isAMomentObject) || (config._isAMomentObject = m._isAMomentObject), extend(m._i) || (config._i = m._i), extend(m._f) || (config._f = m._f), extend(m._l) || (config._l = m._l), extend(m._strict) || (config._strict = m._strict), extend(m._tzm) || (config._tzm = m._tzm), extend(m._isUTC) || (config._isUTC = m._isUTC), extend(m._offset) || (config._offset = m._offset), extend(m._pf) || (config._pf = req(m)), extend(m._locale) || (config._locale = m._locale), attrNames.length > 0) {
      for (i in attrNames) {
        name = attrNames[i];
        base = m[name];
        if (!extend(base)) {
          config[name] = base;
        }
      }
    }
    return config;
  }
  /**
   * @param {Function} m
   * @return {undefined}
   */
  function f(m) {
    send(this, m);
    /** @type {Date} */
    this._d = new Date(null != m._d ? m._d.getTime() : NaN);
    if (Bn === false) {
      /** @type {boolean} */
      Bn = true;
      moment.updateOffset(this);
      /** @type {boolean} */
      Bn = false;
    }
  }
  /**
   * @param {?} s
   * @return {?}
   */
  function isString(s) {
    return s instanceof f || null != s && null != s._isAMomentObject;
  }
  /**
   * @param {number} startAt
   * @return {?}
   */
  function indexOf(startAt) {
    return 0 > startAt ? Math.ceil(startAt) : Math.floor(startAt);
  }
  /**
   * @param {?} dataAndEvents
   * @return {?}
   */
  function toInt(dataAndEvents) {
    /** @type {number} */
    var cur = +dataAndEvents;
    /** @type {number} */
    var val = 0;
    return 0 !== cur && (isFinite(cur) && (val = indexOf(cur))), val;
  }
  /**
   * @param {Array} array1
   * @param {Array} array2
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  function compareArrays(array1, array2, dataAndEvents) {
    var i;
    /** @type {number} */
    var l = Math.min(array1.length, array2.length);
    /** @type {number} */
    var arr = Math.abs(array1.length - array2.length);
    /** @type {number} */
    var inner = 0;
    /** @type {number} */
    i = 0;
    for (;l > i;i++) {
      if (dataAndEvents && array1[i] !== array2[i] || !dataAndEvents && toInt(array1[i]) !== toInt(array2[i])) {
        inner++;
      }
    }
    return inner + arr;
  }
  /**
   * @return {undefined}
   */
  function Button() {
  }
  /**
   * @param {Object} key
   * @return {?}
   */
  function func(key) {
    return key ? key.toLowerCase().replace("_", "-") : key;
  }
  /**
   * @param {Array} buffer
   * @return {?}
   */
  function run(buffer) {
    var j;
    var next;
    var app;
    var split;
    /** @type {number} */
    var i = 0;
    for (;i < buffer.length;) {
      split = func(buffer[i]).split("-");
      j = split.length;
      next = func(buffer[i + 1]);
      next = next ? next.split("-") : null;
      for (;j > 0;) {
        if (app = require(split.slice(0, j).join("-"))) {
          return app;
        }
        if (next && (next.length >= j && compareArrays(split, next, true) >= j - 1)) {
          break;
        }
        j--;
      }
      i++;
    }
    return null;
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function require(key) {
    /** @type {null} */
    var camelKey = null;
    if (!$cookies[key] && ("undefined" != typeof module && (module && module.exports))) {
      try {
        camelKey = r._abbr;
        require("./locale/" + key);
        resolve(camelKey);
      } catch (n) {
      }
    }
    return $cookies[key];
  }
  /**
   * @param {string} key
   * @param {string} obj
   * @return {?}
   */
  function resolve(key, obj) {
    var n;
    return key && (n = extend(obj) ? getLangDefinition(key) : add(key, obj), n && (r = n)), r._abbr;
  }
  /**
   * @param {string} key
   * @param {Object} obj
   * @return {?}
   */
  function add(key, obj) {
    return null !== obj ? (obj.abbr = key, $cookies[key] = $cookies[key] || new Button, $cookies[key].set(obj), resolve(key), $cookies[key]) : (delete $cookies[key], null);
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function getLangDefinition(key) {
    var lang;
    if (key && (key._locale && (key._locale._abbr && (key = key._locale._abbr))), !key) {
      return r;
    }
    if (!isArray(key)) {
      if (lang = require(key)) {
        return lang;
      }
      /** @type {Array} */
      key = [key];
    }
    return run(key);
  }
  /**
   * @param {string} key
   * @param {string} name
   * @return {undefined}
   */
  function _getRangeAroundTestsForRangeSize(key, name) {
    var base = key.toLowerCase();
    groups[base] = groups[base + "s"] = groups[name] = key;
  }
  /**
   * @param {string} b
   * @return {?}
   */
  function walk(b) {
    return "string" == typeof b ? groups[b] || groups[b.toLowerCase()] : void 0;
  }
  /**
   * @param {Object} obj
   * @return {?}
   */
  function normalizeObjectUnits(obj) {
    var field;
    var key;
    var res = {};
    for (key in obj) {
      if (hasOwn(obj, key)) {
        field = walk(key);
        if (field) {
          res[field] = obj[key];
        }
      }
    }
    return res;
  }
  /**
   * @param {?} obj
   * @return {?}
   */
  function isFunction(obj) {
    return obj instanceof Function || "[object Function]" === Object.prototype.toString.call(obj);
  }
  /**
   * @param {string} name
   * @param {boolean} recurring
   * @return {?}
   */
  function setTick(name, recurring) {
    return function(deepDataAndEvents) {
      return null != deepDataAndEvents ? (setInput(this, name, deepDataAndEvents), moment.updateOffset(this, recurring), this) : get(this, name);
    };
  }
  /**
   * @param {string} input
   * @param {string} name
   * @return {?}
   */
  function get(input, name) {
    return input.isValid() ? input._d["get" + (input._isUTC ? "UTC" : "") + name]() : NaN;
  }
  /**
   * @param {string} input
   * @param {string} name
   * @param {string} deepDataAndEvents
   * @return {undefined}
   */
  function setInput(input, name, deepDataAndEvents) {
    if (input.isValid()) {
      input._d["set" + (input._isUTC ? "UTC" : "") + name](deepDataAndEvents);
    }
  }
  /**
   * @param {Object} prop
   * @param {string} node
   * @return {?}
   */
  function create(prop, node) {
    var n;
    if ("object" == typeof prop) {
      for (n in prop) {
        this.set(n, prop[n]);
      }
    } else {
      if (prop = walk(prop), isFunction(this[prop])) {
        return this[prop](node);
      }
    }
    return this;
  }
  /**
   * @param {number} dir
   * @param {number} opt_attributes
   * @param {boolean} ok
   * @return {?}
   */
  function next(dir, opt_attributes, ok) {
    /** @type {string} */
    var fracPart = "" + Math.abs(dir);
    /** @type {number} */
    var r2 = opt_attributes - fracPart.length;
    /** @type {boolean} */
    var sign = dir >= 0;
    return(sign ? ok ? "+" : "" : "-") + Math.pow(10, Math.max(0, r2)).toString().substr(1) + fracPart;
  }
  /**
   * @param {?} x
   * @param {?} expectedHashCode
   * @param {number} mayParseLabeledStatementInstead
   * @param {Function} key
   * @return {undefined}
   */
  function parseInt(x, expectedHashCode, mayParseLabeledStatementInstead, key) {
    /** @type {Function} */
    var matcherFunction = key;
    if ("string" == typeof key) {
      /**
       * @return {?}
       */
      matcherFunction = function() {
        return this[key]();
      };
    }
    if (x) {
      keys[x] = matcherFunction;
    }
    if (expectedHashCode) {
      /**
       * @return {?}
       */
      keys[expectedHashCode[0]] = function() {
        return next(matcherFunction.apply(this, arguments), expectedHashCode[1], expectedHashCode[2]);
      };
    }
    if (mayParseLabeledStatementInstead) {
      /**
       * @return {?}
       */
      keys[mayParseLabeledStatementInstead] = function() {
        return this.localeData().ordinal(matcherFunction.apply(this, arguments), x);
      };
    }
  }
  /**
   * @param {string} lastLine
   * @return {?}
   */
  function removeFormattingTokens(lastLine) {
    return lastLine.match(/\[[\s\S]/) ? lastLine.replace(/^\[|\]$/g, "") : lastLine.replace(/\\/g, "");
  }
  /**
   * @param {string} format
   * @return {?}
   */
  function makeFormatFunction(format) {
    var i;
    var _len;
    var array = format.match(formattingTokens);
    /** @type {number} */
    i = 0;
    _len = array.length;
    for (;_len > i;i++) {
      if (keys[array[i]]) {
        array[i] = keys[array[i]];
      } else {
        array[i] = removeFormattingTokens(array[i]);
      }
    }
    return function(mom) {
      /** @type {string} */
      var output = "";
      /** @type {number} */
      i = 0;
      for (;_len > i;i++) {
        output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
      }
      return output;
    };
  }
  /**
   * @param {?} m
   * @param {string} format
   * @return {?}
   */
  function formatMoment(m, format) {
    return m.isValid() ? (format = expandFormat(format, m.localeData()), formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format), formatFunctions[format](m)) : m.localeData().invalidDate();
  }
  /**
   * @param {string} format
   * @param {?} lang
   * @return {?}
   */
  function expandFormat(format, lang) {
    /**
     * @param {string} input
     * @return {?}
     */
    function replaceLongDateFormatTokens(input) {
      return lang.longDateFormat(input) || input;
    }
    /** @type {number} */
    var i = 5;
    /** @type {number} */
    localFormattingTokens.lastIndex = 0;
    for (;i >= 0 && localFormattingTokens.test(format);) {
      format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
      /** @type {number} */
      localFormattingTokens.lastIndex = 0;
      i -= 1;
    }
    return format;
  }
  /**
   * @param {string} name
   * @param {Object} value
   * @param {Object} data
   * @return {undefined}
   */
  function pad(name, value, data) {
    context[name] = isFunction(value) ? value : function(totalCount, dataAndEvents) {
      return totalCount && data ? data : value;
    };
  }
  /**
   * @param {string} key
   * @param {number} options
   * @return {?}
   */
  function cb(key, options) {
    return hasOwn(context, key) ? context[key](options._strict, options._locale) : new RegExp(clean(key));
  }
  /**
   * @param {string} selector
   * @return {?}
   */
  function clean(selector) {
    return escapeHTML(selector.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(dataAndEvents, error, e, err, err2) {
      return error || (e || (err || err2));
    }));
  }
  /**
   * @param {string} st
   * @return {?}
   */
  function escapeHTML(st) {
    return st.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  /**
   * @param {?} opt_attributes
   * @param {Function} index
   * @return {undefined}
   */
  function checkNext(opt_attributes, index) {
    var i;
    /** @type {Function} */
    var start = index;
    if ("string" == typeof opt_attributes) {
      /** @type {Array} */
      opt_attributes = [opt_attributes];
    }
    if ("number" == typeof index) {
      /**
       * @param {?} node
       * @param {Object} args
       * @return {undefined}
       */
      start = function(node, args) {
        args[index] = toInt(node);
      };
    }
    /** @type {number} */
    i = 0;
    for (;i < opt_attributes.length;i++) {
      nodes[opt_attributes[i]] = start;
    }
  }
  /**
   * @param {?} opt_attributes
   * @param {Function} next
   * @return {undefined}
   */
  function sendKeys(opt_attributes, next) {
    checkNext(opt_attributes, function(err, dataAndEvents, stat, compiled) {
      stat._w = stat._w || {};
      next(err, stat._w, stat, compiled);
    });
  }
  /**
   * @param {string} key
   * @param {string} value
   * @param {number} b
   * @return {undefined}
   */
  function min(key, value, b) {
    if (null != value) {
      if (hasOwn(nodes, key)) {
        nodes[key](value, b._a, b, key);
      }
    }
  }
  /**
   * @param {string} year
   * @param {number} month
   * @return {?}
   */
  function daysInMonth(year, month) {
    return(new Date(Date.UTC(year, month + 1, 0))).getUTCDate();
  }
  /**
   * @param {string} ar
   * @param {string} prefix
   * @return {?}
   */
  function remove(ar, prefix) {
    return isArray(this._months) ? this._months[ar.month()] : this._months[rbracket.test(prefix) ? "format" : "standalone"][ar.month()];
  }
  /**
   * @param {string} obj
   * @param {string} prefix
   * @return {?}
   */
  function buildParams(obj, prefix) {
    return isArray(this._monthsShort) ? this._monthsShort[obj.month()] : this._monthsShort[rbracket.test(prefix) ? "format" : "standalone"][obj.month()];
  }
  /**
   * @param {(boolean|number|string)} s
   * @param {string} string
   * @param {string} smartCase
   * @return {?}
   */
  function parseQuery(s, string, smartCase) {
    var i;
    var c;
    var requestUrl;
    if (!this._monthsParse) {
      /** @type {Array} */
      this._monthsParse = [];
      /** @type {Array} */
      this._longMonthsParse = [];
      /** @type {Array} */
      this._shortMonthsParse = [];
    }
    /** @type {number} */
    i = 0;
    for (;12 > i;i++) {
      if (c = slice([2E3, i]), smartCase && (!this._longMonthsParse[i] && (this._longMonthsParse[i] = new RegExp("^" + this.months(c, "").replace(".", "") + "$", "i"), this._shortMonthsParse[i] = new RegExp("^" + this.monthsShort(c, "").replace(".", "") + "$", "i"))), smartCase || (this._monthsParse[i] || (requestUrl = "^" + this.months(c, "") + "|^" + this.monthsShort(c, ""), this._monthsParse[i] = new RegExp(requestUrl.replace(".", ""), "i"))), smartCase && ("MMMM" === string && this._longMonthsParse[i].test(s))) {
        return i;
      }
      if (smartCase && ("MMM" === string && this._shortMonthsParse[i].test(s))) {
        return i;
      }
      if (!smartCase && this._monthsParse[i].test(s)) {
        return i;
      }
    }
  }
  /**
   * @param {string} input
   * @param {number} value
   * @return {?}
   */
  function check(input, value) {
    var r20;
    return input.isValid() ? "string" == typeof value && (value = input.localeData().monthsParse(value), "number" != typeof value) ? input : (r20 = Math.min(input.date(), daysInMonth(input.year(), value)), input._d["set" + (input._isUTC ? "UTC" : "") + "Month"](value, r20), input) : input;
  }
  /**
   * @param {number} callback
   * @return {?}
   */
  function value(callback) {
    return null != callback ? (check(this, callback), moment.updateOffset(this, true), this) : get(this, "Month");
  }
  /**
   * @return {?}
   */
  function Clndr() {
    return daysInMonth(this.year(), this.month());
  }
  /**
   * @param {?} common
   * @return {?}
   */
  function merge(common) {
    return this._monthsParseExact ? (hasOwn(this, "_monthsRegex") || filter.call(this), common ? this._monthsShortStrictRegex : this._monthsShortRegex) : this._monthsShortStrictRegex && common ? this._monthsShortStrictRegex : this._monthsShortRegex;
  }
  /**
   * @param {?} str
   * @return {?}
   */
  function isEmpty(str) {
    return this._monthsParseExact ? (hasOwn(this, "_monthsRegex") || filter.call(this), str ? this._monthsStrictRegex : this._monthsRegex) : this._monthsStrictRegex && str ? this._monthsStrictRegex : this._monthsRegex;
  }
  /**
   * @return {undefined}
   */
  function filter() {
    /**
     * @param {Array} b
     * @param {Array} a
     * @return {?}
     */
    function e(b, a) {
      return a.length - b.length;
    }
    var i;
    var value;
    /** @type {Array} */
    var data = [];
    /** @type {Array} */
    var results = [];
    /** @type {Array} */
    var errors = [];
    /** @type {number} */
    i = 0;
    for (;12 > i;i++) {
      value = slice([2E3, i]);
      data.push(this.monthsShort(value, ""));
      results.push(this.months(value, ""));
      errors.push(this.months(value, ""));
      errors.push(this.monthsShort(value, ""));
    }
    data.sort(e);
    results.sort(e);
    errors.sort(e);
    /** @type {number} */
    i = 0;
    for (;12 > i;i++) {
      data[i] = escapeHTML(data[i]);
      results[i] = escapeHTML(results[i]);
      errors[i] = escapeHTML(errors[i]);
    }
    /** @type {RegExp} */
    this._monthsRegex = new RegExp("^(" + errors.join("|") + ")", "i");
    /** @type {RegExp} */
    this._monthsShortRegex = this._monthsRegex;
    /** @type {RegExp} */
    this._monthsStrictRegex = new RegExp("^(" + results.join("|") + ")$", "i");
    /** @type {RegExp} */
    this._monthsShortStrictRegex = new RegExp("^(" + data.join("|") + ")$", "i");
  }
  /**
   * @param {number} config
   * @return {?}
   */
  function checkOverflow(config) {
    var overflow;
    var datePartArray = config._a;
    return datePartArray && (-2 === req(config).overflow && (overflow = datePartArray[MONTH] < 0 || datePartArray[MONTH] > 11 ? MONTH : datePartArray[DATE] < 1 || datePartArray[DATE] > daysInMonth(datePartArray[index], datePartArray[MONTH]) ? DATE : datePartArray[YEAR] < 0 || (datePartArray[YEAR] > 24 || 24 === datePartArray[YEAR] && (0 !== datePartArray[HOUR] || (0 !== datePartArray[MILLISECOND] || 0 !== datePartArray[SECOND]))) ? YEAR : datePartArray[HOUR] < 0 || datePartArray[HOUR] > 59 ? HOUR :
    datePartArray[MILLISECOND] < 0 || datePartArray[MILLISECOND] > 59 ? MILLISECOND : datePartArray[SECOND] < 0 || datePartArray[SECOND] > 999 ? SECOND : -1, req(config)._overflowDayOfYear && ((index > overflow || overflow > DATE) && (overflow = DATE)), req(config)._overflowWeeks && (-1 === overflow && (overflow = visible)), req(config)._overflowWeekday && (-1 === overflow && (overflow = hidden)), req(config).overflow = overflow)), config;
  }
  /**
   * @param {string} reason
   * @return {undefined}
   */
  function fail(reason) {
    if (moment.suppressDeprecationWarnings === false) {
      if ("undefined" != typeof console) {
        if (console.warn) {
          console.warn("Deprecation warning: " + reason);
        }
      }
    }
  }
  /**
   * @param {string} selfObj
   * @param {Function} callback
   * @return {?}
   */
  function bind(selfObj, callback) {
    /** @type {boolean} */
    var n = true;
    return forEach(function() {
      return n && (fail(selfObj + "\nArguments: " + Array.prototype.slice.call(arguments).join(", ") + "\n" + (new Error).stack), n = false), callback.apply(this, arguments);
    }, callback);
  }
  /**
   * @param {string} path
   * @param {string} args
   * @return {undefined}
   */
  function exec(path, args) {
    if (!scripts[path]) {
      fail(args);
      /** @type {boolean} */
      scripts[path] = true;
    }
  }
  /**
   * @param {number} config
   * @return {?}
   */
  function makeDateFromString(config) {
    var i;
    var len;
    var val;
    var name;
    var prefix;
    var format;
    var string = config._i;
    /** @type {(Array.<string>|null)} */
    var types = spaceRe.exec(string) || isoDateExpression.exec(string);
    if (types) {
      /** @type {boolean} */
      req(config).iso = true;
      /** @type {number} */
      i = 0;
      /** @type {number} */
      len = rawParams.length;
      for (;len > i;i++) {
        if (rawParams[i][1].exec(types[1])) {
          name = rawParams[i][0];
          /** @type {boolean} */
          val = rawParams[i][2] !== false;
          break;
        }
      }
      if (null == name) {
        return void(config._isValid = false);
      }
      if (types[3]) {
        /** @type {number} */
        i = 0;
        /** @type {number} */
        len = codeSegments.length;
        for (;len > i;i++) {
          if (codeSegments[i][1].exec(types[3])) {
            prefix = (types[2] || " ") + codeSegments[i][0];
            break;
          }
        }
        if (null == prefix) {
          return void(config._isValid = false);
        }
      }
      if (!val && null != prefix) {
        return void(config._isValid = false);
      }
      if (types[4]) {
        if (!rtypenamespace.exec(types[4])) {
          return void(config._isValid = false);
        }
        /** @type {string} */
        format = "Z";
      }
      /** @type {string} */
      config._f = name + (prefix || "") + (format || "");
      makeDateFromStringAndFormat(config);
    } else {
      /** @type {boolean} */
      config._isValid = false;
    }
  }
  /**
   * @param {number} config
   * @return {?}
   */
  function dateFromArray(config) {
    /** @type {(Array.<string>|null)} */
    var n = functionName.exec(config._i);
    return null !== n ? void(config._d = new Date(+n[1])) : (makeDateFromString(config), void(config._isValid === false && (delete config._isValid, moment.createFromInputFallback(config))));
  }
  /**
   * @param {number} y
   * @param {number} recurring
   * @param {number} d
   * @param {number} h
   * @param {number} M
   * @param {number} s
   * @param {number} ms
   * @return {?}
   */
  function makeDate(y, recurring, d, h, M, s, ms) {
    /** @type {Date} */
    var date = new Date(y, recurring, d, h, M, s, ms);
    return 100 > y && (y >= 0 && (isFinite(date.getFullYear()) && date.setFullYear(y))), date;
  }
  /**
   * @param {number} y
   * @return {?}
   */
  function makeUTCDate(y) {
    /** @type {Date} */
    var date = new Date(Date.UTC.apply(null, arguments));
    return 100 > y && (y >= 0 && (isFinite(date.getUTCFullYear()) && date.setUTCFullYear(y))), date;
  }
  /**
   * @param {number} year
   * @return {?}
   */
  function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
  }
  /**
   * @param {number} year
   * @return {?}
   */
  function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }
  /**
   * @return {?}
   */
  function readyState() {
    return isLeapYear(this.year());
  }
  /**
   * @param {number} d
   * @param {number} deepDataAndEvents
   * @param {number} opt_attributes
   * @return {?}
   */
  function Number(d, deepDataAndEvents, opt_attributes) {
    /** @type {number} */
    var height = 7 + deepDataAndEvents - opt_attributes;
    /** @type {number} */
    var y = (7 + makeUTCDate(d, 0, height).getUTCDay() - deepDataAndEvents) % 7;
    return-y + height - 1;
  }
  /**
   * @param {number} year
   * @param {number} keepData
   * @param {number} weekday
   * @param {number} deepDataAndEvents
   * @param {number} attributes
   * @return {?}
   */
  function dayOfYearFromWeeks(year, keepData, weekday, deepDataAndEvents, attributes) {
    var newYear;
    var index;
    /** @type {number} */
    var g = (7 + weekday - deepDataAndEvents) % 7;
    var b = Number(year, deepDataAndEvents, attributes);
    var start = 1 + 7 * (keepData - 1) + g + b;
    return 0 >= start ? (newYear = year - 1, index = daysInYear(newYear) + start) : start > daysInYear(year) ? (newYear = year + 1, index = start - daysInYear(year)) : (newYear = year, index = start), {
      year : newYear,
      dayOfYear : index
    };
  }
  /**
   * @param {?} m
   * @param {number} deepDataAndEvents
   * @param {number} opt_attributes
   * @return {?}
   */
  function weekOfYear(m, deepDataAndEvents, opt_attributes) {
    var end;
    var year;
    var b = Number(m.year(), deepDataAndEvents, opt_attributes);
    /** @type {number} */
    var start = Math.floor((m.dayOfYear() - b - 1) / 7) + 1;
    return 1 > start ? (year = m.year() - 1, end = start + getDay(year, deepDataAndEvents, opt_attributes)) : start > getDay(m.year(), deepDataAndEvents, opt_attributes) ? (end = start - getDay(m.year(), deepDataAndEvents, opt_attributes), year = m.year() + 1) : (year = m.year(), end = start), {
      week : end,
      year : year
    };
  }
  /**
   * @param {number} year
   * @param {number} deepDataAndEvents
   * @param {number} opt_attributes
   * @return {?}
   */
  function getDay(year, deepDataAndEvents, opt_attributes) {
    var YEAR = Number(year, deepDataAndEvents, opt_attributes);
    var b = Number(year + 1, deepDataAndEvents, opt_attributes);
    return(daysInYear(year) - YEAR + b) / 7;
  }
  /**
   * @param {string} yr
   * @param {Object} dataAndEvents
   * @param {Object} val
   * @return {?}
   */
  function fixYear(yr, dataAndEvents, val) {
    return null != yr ? yr : null != dataAndEvents ? dataAndEvents : val;
  }
  /**
   * @param {number} config
   * @return {?}
   */
  function currentDateArray(config) {
    /** @type {Date} */
    var today = new Date(moment.now());
    return config._useUTC ? [today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()] : [today.getFullYear(), today.getMonth(), today.getDate()];
  }
  /**
   * @param {number} config
   * @return {undefined}
   */
  function addTimeToArrayFromToken(config) {
    var i;
    var date;
    var currentDate;
    var yearToUse;
    /** @type {Array} */
    var input = [];
    if (!config._d) {
      currentDate = currentDateArray(config);
      if (config._w) {
        if (null == config._a[DATE]) {
          if (null == config._a[MONTH]) {
            dateFromConfig(config);
          }
        }
      }
      if (config._dayOfYear) {
        yearToUse = fixYear(config._a[index], currentDate[index]);
        if (config._dayOfYear > daysInYear(yearToUse)) {
          /** @type {boolean} */
          req(config)._overflowDayOfYear = true;
        }
        date = makeUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
      }
      /** @type {number} */
      i = 0;
      for (;3 > i && null == config._a[i];++i) {
        config._a[i] = input[i] = currentDate[i];
      }
      for (;7 > i;i++) {
        config._a[i] = input[i] = null == config._a[i] ? 2 === i ? 1 : 0 : config._a[i];
      }
      if (24 === config._a[YEAR]) {
        if (0 === config._a[HOUR]) {
          if (0 === config._a[MILLISECOND]) {
            if (0 === config._a[SECOND]) {
              /** @type {boolean} */
              config._nextDay = true;
              /** @type {number} */
              config._a[YEAR] = 0;
            }
          }
        }
      }
      config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
      if (null != config._tzm) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
      }
      if (config._nextDay) {
        /** @type {number} */
        config._a[YEAR] = 24;
      }
    }
  }
  /**
   * @param {number} config
   * @return {undefined}
   */
  function dateFromConfig(config) {
    var w;
    var i;
    var week;
    var weekday;
    var deepDataAndEvents;
    var attributes;
    var temp;
    var u;
    w = config._w;
    if (null != w.GG || (null != w.W || null != w.E)) {
      /** @type {number} */
      deepDataAndEvents = 1;
      /** @type {number} */
      attributes = 4;
      i = fixYear(w.GG, config._a[index], weekOfYear($(), 1, 4).year);
      week = fixYear(w.W, 1);
      weekday = fixYear(w.E, 1);
      if (1 > weekday || weekday > 7) {
        /** @type {boolean} */
        u = true;
      }
    } else {
      deepDataAndEvents = config._locale._week.dow;
      attributes = config._locale._week.doy;
      i = fixYear(w.gg, config._a[index], weekOfYear($(), deepDataAndEvents, attributes).year);
      week = fixYear(w.w, 1);
      if (null != w.d) {
        weekday = w.d;
        if (0 > weekday || weekday > 6) {
          /** @type {boolean} */
          u = true;
        }
      } else {
        if (null != w.e) {
          weekday = w.e + deepDataAndEvents;
          if (w.e < 0 || w.e > 6) {
            /** @type {boolean} */
            u = true;
          }
        } else {
          weekday = deepDataAndEvents;
        }
      }
    }
    if (1 > week || week > getDay(i, deepDataAndEvents, attributes)) {
      /** @type {boolean} */
      req(config)._overflowWeeks = true;
    } else {
      if (null != u) {
        /** @type {boolean} */
        req(config)._overflowWeekday = true;
      } else {
        temp = dayOfYearFromWeeks(i, week, weekday, deepDataAndEvents, attributes);
        config._a[index] = temp.year;
        config._dayOfYear = temp.dayOfYear;
      }
    }
  }
  /**
   * @param {number} config
   * @return {?}
   */
  function makeDateFromStringAndFormat(config) {
    if (config._f === moment.ISO_8601) {
      return void makeDateFromString(config);
    }
    /** @type {Array} */
    config._a = [];
    /** @type {boolean} */
    req(config).empty = true;
    var i;
    var parsedInput;
    var codeSegments;
    var x;
    var copies;
    /** @type {string} */
    var string = "" + config._i;
    /** @type {number} */
    var stringLength = string.length;
    /** @type {number} */
    var totalParsedInputLength = 0;
    codeSegments = expandFormat(config._f, config._locale).match(formattingTokens) || [];
    /** @type {number} */
    i = 0;
    for (;i < codeSegments.length;i++) {
      x = codeSegments[i];
      parsedInput = (string.match(cb(x, config)) || [])[0];
      if (parsedInput) {
        /** @type {string} */
        copies = string.substr(0, string.indexOf(parsedInput));
        if (copies.length > 0) {
          req(config).unusedInput.push(copies);
        }
        /** @type {string} */
        string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
        totalParsedInputLength += parsedInput.length;
      }
      if (keys[x]) {
        if (parsedInput) {
          /** @type {boolean} */
          req(config).empty = false;
        } else {
          req(config).unusedTokens.push(x);
        }
        min(x, parsedInput, config);
      } else {
        if (config._strict) {
          if (!parsedInput) {
            req(config).unusedTokens.push(x);
          }
        }
      }
    }
    /** @type {number} */
    req(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
      req(config).unusedInput.push(string);
    }
    if (req(config).bigHour === true) {
      if (config._a[YEAR] <= 12) {
        if (config._a[YEAR] > 0) {
          req(config).bigHour = void 0;
        }
      }
    }
    config._a[YEAR] = serverMru(config._locale, config._a[YEAR], config._meridiem);
    addTimeToArrayFromToken(config);
    checkOverflow(config);
  }
  /**
   * @param {?} angular
   * @param {number} orderBy
   * @param {(number|string)} value
   * @return {?}
   */
  function serverMru(angular, orderBy, value) {
    var isFunction;
    return null == value ? orderBy : null != angular.meridiemHour ? angular.meridiemHour(orderBy, value) : null != angular.isPM ? (isFunction = angular.isPM(value), isFunction && (12 > orderBy && (orderBy += 12)), isFunction || (12 !== orderBy || (orderBy = 0)), orderBy) : orderBy;
  }
  /**
   * @param {Object} config
   * @return {?}
   */
  function makeDateFromStringAndArray(config) {
    var tempConfig;
    var bestMoment;
    var scoreToBeat;
    var i;
    var currentScore;
    if (0 === config._f.length) {
      return req(config).invalidFormat = true, void(config._d = new Date(NaN));
    }
    /** @type {number} */
    i = 0;
    for (;i < config._f.length;i++) {
      /** @type {number} */
      currentScore = 0;
      tempConfig = send({}, config);
      if (null != config._useUTC) {
        tempConfig._useUTC = config._useUTC;
      }
      tempConfig._f = config._f[i];
      makeDateFromStringAndFormat(tempConfig);
      if (isValid(tempConfig)) {
        currentScore += req(tempConfig).charsLeftOver;
        currentScore += 10 * req(tempConfig).unusedTokens.length;
        req(tempConfig).score = currentScore;
        if (null == scoreToBeat || scoreToBeat > currentScore) {
          scoreToBeat = currentScore;
          bestMoment = tempConfig;
        }
      }
    }
    forEach(config, bestMoment || tempConfig);
  }
  /**
   * @param {number} config
   * @return {undefined}
   */
  function dateFromObject(config) {
    if (!config._d) {
      var o = normalizeObjectUnits(config._i);
      config._a = describe([o.year, o.month, o.day || o.date, o.hour, o.minute, o.second, o.millisecond], function(ttl) {
        return ttl && parseInt(ttl, 10);
      });
      addTimeToArrayFromToken(config);
    }
  }
  /**
   * @param {number} object
   * @return {?}
   */
  function debug(object) {
    var scope = new f(checkOverflow(makeMoment(object)));
    return scope._nextDay && (scope.add(1, "d"), scope._nextDay = void 0), scope;
  }
  /**
   * @param {number} config
   * @return {?}
   */
  function makeMoment(config) {
    var input = config._i;
    var format = config._f;
    return config._locale = config._locale || getLangDefinition(config._l), null === input || void 0 === format && "" === input ? server({
      nullInput : true
    }) : ("string" == typeof input && (config._i = input = config._locale.preparse(input)), isString(input) ? new f(checkOverflow(input)) : (isArray(format) ? makeDateFromStringAndArray(config) : format ? makeDateFromStringAndFormat(config) : isDate(input) ? config._d = input : makeDateFromInput(config), isValid(config) || (config._d = null), config));
  }
  /**
   * @param {number} config
   * @return {undefined}
   */
  function makeDateFromInput(config) {
    var input = config._i;
    if (void 0 === input) {
      /** @type {Date} */
      config._d = new Date(moment.now());
    } else {
      if (isDate(input)) {
        /** @type {Date} */
        config._d = new Date(+input);
      } else {
        if ("string" == typeof input) {
          dateFromArray(config);
        } else {
          if (isArray(input)) {
            config._a = describe(input.slice(0), function(m1) {
              return parseInt(m1, 10);
            });
            addTimeToArrayFromToken(config);
          } else {
            if ("object" == typeof input) {
              dateFromObject(config);
            } else {
              if ("number" == typeof input) {
                /** @type {Date} */
                config._d = new Date(input);
              } else {
                moment.createFromInputFallback(config);
              }
            }
          }
        }
      }
    }
  }
  /**
   * @param {Object} target
   * @param {string} other
   * @param {?} deepDataAndEvents
   * @param {?} date
   * @param {string} dataAndEvents
   * @return {?}
   */
  function clone(target, other, deepDataAndEvents, date, dataAndEvents) {
    var config = {};
    return "boolean" == typeof deepDataAndEvents && (date = deepDataAndEvents, deepDataAndEvents = void 0), config._isAMomentObject = true, config._useUTC = config._isUTC = dataAndEvents, config._l = deepDataAndEvents, config._i = target, config._f = other, config._strict = date, debug(config);
  }
  /**
   * @param {?} value
   * @param {string} options
   * @param {?} deepDataAndEvents
   * @param {?} d
   * @return {?}
   */
  function $(value, options, deepDataAndEvents, d) {
    return clone(value, options, deepDataAndEvents, d, false);
  }
  /**
   * @param {string} name
   * @param {Array} args
   * @return {?}
   */
  function getData(name, args) {
    var items;
    var i;
    if (1 === args.length && (isArray(args[0]) && (args = args[0])), !args.length) {
      return $();
    }
    items = args[0];
    /** @type {number} */
    i = 1;
    for (;i < args.length;++i) {
      if (!args[i].isValid() || args[i][name](items)) {
        items = args[i];
      }
    }
    return items;
  }
  /**
   * @return {?}
   */
  function isObject() {
    /** @type {Array.<?>} */
    var expectedArgs = [].slice.call(arguments, 0);
    return getData("isBefore", expectedArgs);
  }
  /**
   * @return {?}
   */
  function d() {
    /** @type {Array.<?>} */
    var expectedArgs = [].slice.call(arguments, 0);
    return getData("isAfter", expectedArgs);
  }
  /**
   * @param {Object} walkers
   * @return {undefined}
   */
  function calculateInterval(walkers) {
    var normalizedInput = normalizeObjectUnits(walkers);
    var n = normalizedInput.year || 0;
    var _oneDayInMilliseconds = normalizedInput.quarter || 0;
    var _now = normalizedInput.month || 0;
    var isAdding = normalizedInput.week || 0;
    var mom = normalizedInput.day || 0;
    var o = normalizedInput.hour || 0;
    var u = normalizedInput.minute || 0;
    var HOUR_MS = normalizedInput.second || 0;
    var d = normalizedInput.millisecond || 0;
    /** @type {number} */
    this._milliseconds = +d + 1E3 * HOUR_MS + 6E4 * u + 36E5 * o;
    /** @type {number} */
    this._days = +mom + 7 * isAdding;
    /** @type {number} */
    this._months = +_now + 3 * _oneDayInMilliseconds + 12 * n;
    this._data = {};
    this._locale = getLangDefinition();
    this._bubble();
  }
  /**
   * @param {number} el
   * @return {?}
   */
  function matcher(el) {
    return el instanceof calculateInterval;
  }
  /**
   * @param {string} c
   * @param {string} url
   * @return {undefined}
   */
  function init(c, url) {
    parseInt(c, 0, 0, function() {
      var a = this.utcOffset();
      /** @type {string} */
      var message = "+";
      return 0 > a && (a = -a, message = "-"), message + next(~~(a / 60), 2) + url + next(~~a % 60, 2);
    });
  }
  /**
   * @param {RegExp} args
   * @param {string} value
   * @return {?}
   */
  function mixin(args, value) {
    var codeSegments = (value || "").match(args) || [];
    var tzchunk = codeSegments[codeSegments.length - 1] || [];
    /** @type {Array} */
    var parts = (tzchunk + "").match(parseTimezoneChunker) || ["-", 0, 0];
    var r = +(60 * parts[1]) + toInt(parts[2]);
    return "+" === parts[0] ? r : -r;
  }
  /**
   * @param {?} input
   * @param {?} value
   * @return {?}
   */
  function set(input, value) {
    var mom;
    var ms;
    return value._isUTC ? (mom = value.clone(), ms = (isString(input) || isDate(input) ? +input : +$(input)) - +mom, mom._d.setTime(+mom._d + ms), moment.updateOffset(mom, false), mom) : $(input).local();
  }
  /**
   * @param {?} input
   * @return {?}
   */
  function apply(input) {
    return 15 * -Math.round(input._d.getTimezoneOffset() / 15);
  }
  /**
   * @param {Object} value
   * @param {?} obj
   * @return {?}
   */
  function animate(value, obj) {
    var p;
    var offset = this._offset || 0;
    return this.isValid() ? null != value ? ("string" == typeof value ? value = mixin(width, value) : Math.abs(value) < 16 && (value = 60 * value), !this._isUTC && (obj && (p = apply(this))), this._offset = value, this._isUTC = true, null != p && this.add(p, "m"), offset !== value && (!obj || this._changeInProgress ? addOrSubtractDurationFromMoment(this, append(value - offset, "m"), 1, false) : this._changeInProgress || (this._changeInProgress = true, moment.updateOffset(this, true), this._changeInProgress =
    null)), this) : this._isUTC ? offset : apply(this) : null != value ? this : NaN;
  }
  /**
   * @param {number} v
   * @param {?} walkers
   * @return {?}
   */
  function query(v, walkers) {
    return null != v ? ("string" != typeof v && (v = -v), this.utcOffset(v, walkers), this) : -this.utcOffset();
  }
  /**
   * @param {?} o
   * @return {?}
   */
  function css(o) {
    return this.utcOffset(0, o);
  }
  /**
   * @param {(Error|string)} source
   * @return {?}
   */
  function color(source) {
    return this._isUTC && (this.utcOffset(0, source), this._isUTC = false, source && this.subtract(apply(this), "m")), this;
  }
  /**
   * @return {?}
   */
  function fire() {
    return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(mixin(typePattern, this._i)), this;
  }
  /**
   * @param {Element} comment
   * @return {?}
   */
  function id(comment) {
    return this.isValid() ? (comment = comment ? $(comment).utcOffset() : 0, (this.utcOffset() - comment) % 60 === 0) : false;
  }
  /**
   * @return {?}
   */
  function DateRangePicker() {
    return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
  }
  /**
   * @return {?}
   */
  function execute() {
    if (!extend(this._isDSTShifted)) {
      return this._isDSTShifted;
    }
    var response = {};
    if (send(response, this), response = makeMoment(response), response._a) {
      var cursor = response._isUTC ? slice(response._a) : $(response._a);
      this._isDSTShifted = this.isValid() && compareArrays(response._a, cursor.toArray()) > 0;
    } else {
      /** @type {boolean} */
      this._isDSTShifted = false;
    }
    return this._isDSTShifted;
  }
  /**
   * @return {?}
   */
  function isLocal() {
    return this.isValid() ? !this._isUTC : false;
  }
  /**
   * @return {?}
   */
  function text() {
    return this.isValid() ? this._isUTC : false;
  }
  /**
   * @return {?}
   */
  function makeAs() {
    return this.isValid() ? this._isUTC && 0 === this._offset : false;
  }
  /**
   * @param {number} input
   * @param {(Object|string)} key
   * @return {?}
   */
  function append(input, key) {
    var sign;
    var ret;
    var d;
    /** @type {number} */
    var duration = input;
    /** @type {null} */
    var match = null;
    return matcher(input) ? duration = {
      ms : input._milliseconds,
      d : input._days,
      M : input._months
    } : "number" == typeof input ? (duration = {}, key ? duration[key] = input : duration.milliseconds = input) : (match = re.exec(input)) ? (sign = "-" === match[1] ? -1 : 1, duration = {
      y : 0,
      d : toInt(match[DATE]) * sign,
      h : toInt(match[YEAR]) * sign,
      m : toInt(match[HOUR]) * sign,
      s : toInt(match[MILLISECOND]) * sign,
      ms : toInt(match[SECOND]) * sign
    }) : (match = string.exec(input)) ? (sign = "-" === match[1] ? -1 : 1, duration = {
      y : parseIso(match[2], sign),
      M : parseIso(match[3], sign),
      d : parseIso(match[4], sign),
      h : parseIso(match[5], sign),
      m : parseIso(match[6], sign),
      s : parseIso(match[7], sign),
      w : parseIso(match[8], sign)
    }) : null == duration ? duration = {} : "object" == typeof duration && (("from" in duration || "to" in duration) && (d = resize($(duration.from), $(duration.to)), duration = {}, duration.ms = d.milliseconds, duration.M = d.months)), ret = new calculateInterval(duration), matcher(input) && (hasOwn(input, "_locale") && (ret._locale = input._locale)), ret;
  }
  /**
   * @param {string} inp
   * @param {?} sign
   * @return {?}
   */
  function parseIso(inp, sign) {
    var res = inp && parseFloat(inp.replace(",", "."));
    return(isNaN(res) ? 0 : res) * sign;
  }
  /**
   * @param {Object} obj
   * @param {Object} a
   * @return {?}
   */
  function gg(obj, a) {
    var d = {
      milliseconds : 0,
      months : 0
    };
    return d.months = a.month() - obj.month() + 12 * (a.year() - obj.year()), obj.clone().add(d.months, "M").isAfter(a) && --d.months, d.milliseconds = +a - +obj.clone().add(d.months, "M"), d;
  }
  /**
   * @param {Object} b
   * @param {Object} c
   * @return {?}
   */
  function resize(b, c) {
    var d;
    return b.isValid() && c.isValid() ? (c = set(c, b), b.isBefore(c) ? d = gg(b, c) : (d = gg(c, b), d.milliseconds = -d.milliseconds, d.months = -d.months), d) : {
      milliseconds : 0,
      months : 0
    };
  }
  /**
   * @param {number} deepDataAndEvents
   * @param {string} cb
   * @return {?}
   */
  function format(deepDataAndEvents, cb) {
    return function(arg, value) {
      var result;
      var copy;
      return null === value || (isNaN(+value) || (exec(cb, "moment()." + cb + "(period, number) is deprecated. Please use moment()." + cb + "(number, period)."), copy = arg, arg = value, value = copy)), arg = "string" == typeof arg ? +arg : arg, result = append(arg, value), addOrSubtractDurationFromMoment(this, result, deepDataAndEvents), this;
    };
  }
  /**
   * @param {string} mom
   * @param {?} duration
   * @param {?} deepDataAndEvents
   * @param {boolean} count
   * @return {undefined}
   */
  function addOrSubtractDurationFromMoment(mom, duration, deepDataAndEvents, count) {
    var milliseconds = duration._milliseconds;
    var days = duration._days;
    var months = duration._months;
    if (mom.isValid()) {
      count = null == count ? true : count;
      if (milliseconds) {
        mom._d.setTime(+mom._d + milliseconds * deepDataAndEvents);
      }
      if (days) {
        setInput(mom, "Date", get(mom, "Date") + days * deepDataAndEvents);
      }
      if (months) {
        check(mom, get(mom, "Month") + months * deepDataAndEvents);
      }
      if (count) {
        moment.updateOffset(mom, days || months);
      }
    }
  }
  /**
   * @param {(Object|boolean|number|string)} target
   * @param {Object} value
   * @return {?}
   */
  function draw(target, value) {
    var result = target || $();
    var from = set(result, this).startOf("day");
    var diff = this.diff(from, "days", true);
    /** @type {string} */
    var name = -6 > diff ? "sameElse" : -1 > diff ? "lastWeek" : 0 > diff ? "lastDay" : 1 > diff ? "sameDay" : 2 > diff ? "nextDay" : 7 > diff ? "nextWeek" : "sameElse";
    var attrNames = value && (isFunction(value[name]) ? value[name]() : value[name]);
    return this.format(attrNames || this.localeData().calendar(name, this, $(result)));
  }
  /**
   * @return {?}
   */
  function $options() {
    return new f(this);
  }
  /**
   * @param {Object} selector
   * @param {string} t
   * @return {?}
   */
  function setup(selector, t) {
    var parsed = isString(selector) ? selector : $(selector);
    return this.isValid() && parsed.isValid() ? (t = walk(extend(t) ? "millisecond" : t), "millisecond" === t ? +this > +parsed : +parsed < +this.clone().startOf(t)) : false;
  }
  /**
   * @param {?} selector
   * @param {string} t
   * @return {?}
   */
  function push(selector, t) {
    var parsed = isString(selector) ? selector : $(selector);
    return this.isValid() && parsed.isValid() ? (t = walk(extend(t) ? "millisecond" : t), "millisecond" === t ? +parsed > +this : +this.clone().endOf(t) < +parsed) : false;
  }
  /**
   * @param {Object} a
   * @param {?} b
   * @param {string} value
   * @return {?}
   */
  function array(a, b, value) {
    return this.isAfter(a, value) && this.isBefore(b, value);
  }
  /**
   * @param {Object} body
   * @param {string} ast
   * @return {?}
   */
  function process(body, ast) {
    var number;
    var value = isString(body) ? body : $(body);
    return this.isValid() && value.isValid() ? (ast = walk(ast || "millisecond"), "millisecond" === ast ? +this === +value : (number = +value, +this.clone().startOf(ast) <= number && number <= +this.clone().endOf(ast))) : false;
  }
  /**
   * @param {Object} elem
   * @param {string} key
   * @return {?}
   */
  function dataAttr(elem, key) {
    return this.isSame(elem, key) || this.isAfter(elem, key);
  }
  /**
   * @param {Object} elem
   * @param {string} key
   * @return {?}
   */
  function disabled(elem, key) {
    return this.isSame(elem, key) || this.isBefore(elem, key);
  }
  /**
   * @param {?} value
   * @param {string} right
   * @param {boolean} raw
   * @return {?}
   */
  function Timestring(value, right, raw) {
    var target;
    var b;
    var a;
    var result;
    return this.isValid() ? (target = set(value, this), target.isValid() ? (b = 6E4 * (target.utcOffset() - this.utcOffset()), right = walk(right), "year" === right || ("month" === right || "quarter" === right) ? (result = render(this, target), "quarter" === right ? result /= 3 : "year" === right && (result /= 12)) : (a = this - target, result = "second" === right ? a / 1E3 : "minute" === right ? a / 6E4 : "hour" === right ? a / 36E5 : "day" === right ? (a - b) / 864E5 : "week" === right ? (a - b) /
    6048E5 : a), raw ? result : indexOf(result)) : NaN) : NaN;
  }
  /**
   * @param {Object} now
   * @param {string} a
   * @return {?}
   */
  function render(now, a) {
    var c;
    var p;
    /** @type {number} */
    var d = 12 * (a.year() - now.year()) + (a.month() - now.month());
    var b = now.clone().add(d, "months");
    return 0 > a - b ? (c = now.clone().add(d - 1, "months"), p = (a - b) / (b - c)) : (c = now.clone().add(d + 1, "months"), p = (a - b) / (c - b)), -(d + p);
  }
  /**
   * @return {?}
   */
  function display() {
    return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
  }
  /**
   * @return {?}
   */
  function start() {
    var m = this.clone().utc();
    return 0 < m.year() && m.year() <= 9999 ? isFunction(Date.prototype.toISOString) ? this.toDate().toISOString() : formatMoment(m, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : formatMoment(m, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
  }
  /**
   * @param {string} inputString
   * @return {?}
   */
  function type(inputString) {
    var output = formatMoment(this, inputString || moment.defaultFormat);
    return this.localeData().postformat(output);
  }
  /**
   * @param {Object} value
   * @param {?} textStatus
   * @return {?}
   */
  function error(value, textStatus) {
    return this.isValid() && (isString(value) && value.isValid() || $(value).isValid()) ? append({
      to : this,
      from : value
    }).locale(this.locale()).humanize(!textStatus) : this.localeData().invalidDate();
  }
  /**
   * @param {?} textStatus
   * @return {?}
   */
  function success(textStatus) {
    return this.from($(), textStatus);
  }
  /**
   * @param {string} value
   * @param {?} textStatus
   * @return {?}
   */
  function complete(value, textStatus) {
    return this.isValid() && (isString(value) && value.isValid() || $(value).isValid()) ? append({
      from : this,
      to : value
    }).locale(this.locale()).humanize(!textStatus) : this.localeData().invalidDate();
  }
  /**
   * @param {?} textStatus
   * @return {?}
   */
  function to(textStatus) {
    return this.to($(), textStatus);
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function right(key) {
    var lang;
    return void 0 === key ? this._locale._abbr : (lang = getLangDefinition(key), null != lang && (this._locale = lang), this);
  }
  /**
   * @return {?}
   */
  function uri() {
    return this._locale;
  }
  /**
   * @param {string} t
   * @return {?}
   */
  function startOf(t) {
    switch(t = walk(t)) {
      case "year":
        this.month(0);
      case "quarter":
      ;
      case "month":
        this.date(1);
      case "week":
      ;
      case "isoWeek":
      ;
      case "day":
        this.hours(0);
      case "hour":
        this.minutes(0);
      case "minute":
        this.seconds(0);
      case "second":
        this.milliseconds(0);
    }
    return "week" === t && this.weekday(0), "isoWeek" === t && this.isoWeekday(1), "quarter" === t && this.month(3 * Math.floor(this.month() / 3)), this;
  }
  /**
   * @param {string} t
   * @return {?}
   */
  function update(t) {
    return t = walk(t), void 0 === t || "millisecond" === t ? this : this.startOf(t).add(1, "isoWeek" === t ? "week" : t).subtract(1, "ms");
  }
  /**
   * @return {?}
   */
  function key() {
    return+this._d - 6E4 * (this._offset || 0);
  }
  /**
   * @return {?}
   */
  function parent() {
    return Math.floor(+this / 1E3);
  }
  /**
   * @return {?}
   */
  function replace() {
    return this._offset ? new Date(+this) : this._d;
  }
  /**
   * @return {?}
   */
  function parseTimePeriod() {
    var a = this;
    return[a.year(), a.month(), a.date(), a.hour(), a.minute(), a.second(), a.millisecond()];
  }
  /**
   * @return {?}
   */
  function setNewEventDate() {
    var m = this;
    return{
      years : m.year(),
      months : m.month(),
      date : m.date(),
      hours : m.hours(),
      minutes : m.minutes(),
      seconds : m.seconds(),
      milliseconds : m.milliseconds()
    };
  }
  /**
   * @return {?}
   */
  function serialize() {
    return this.isValid() ? this.toISOString() : "null";
  }
  /**
   * @return {?}
   */
  function target() {
    return isValid(this);
  }
  /**
   * @return {?}
   */
  function _forEach() {
    return forEach({}, req(this));
  }
  /**
   * @return {?}
   */
  function newVal() {
    return req(this).overflow;
  }
  /**
   * @return {?}
   */
  function bar() {
    return{
      input : this._i,
      format : this._f,
      locale : this._locale,
      isUTC : this._isUTC,
      strict : this._strict
    };
  }
  /**
   * @param {string} ob
   * @param {?} mod
   * @return {undefined}
   */
  function w(ob, mod) {
    parseInt(0, [ob, ob.length], 0, mod);
  }
  /**
   * @param {?} options
   * @return {?}
   */
  function end(options) {
    return model.call(this, options, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
  }
  /**
   * @param {?} options
   * @return {?}
   */
  function content(options) {
    return model.call(this, options, this.isoWeek(), this.isoWeekday(), 1, 4);
  }
  /**
   * @return {?}
   */
  function nextindex() {
    return getDay(this.year(), 1, 4);
  }
  /**
   * @return {?}
   */
  function userid() {
    var settings = this.localeData()._week;
    return getDay(this.year(), settings.dow, settings.doy);
  }
  /**
   * @param {number} i
   * @param {number} data
   * @param {?} capture
   * @param {number} deepDataAndEvents
   * @param {number} attributes
   * @return {?}
   */
  function model(i, data, capture, deepDataAndEvents, attributes) {
    var obj;
    return null == i ? weekOfYear(this, deepDataAndEvents, attributes).year : (obj = getDay(i, deepDataAndEvents, attributes), data > obj && (data = obj), str.call(this, i, data, capture, deepDataAndEvents, attributes));
  }
  /**
   * @param {number} a
   * @param {number} key
   * @param {number} weekday
   * @param {number} deepDataAndEvents
   * @param {number} opt_attributes
   * @return {?}
   */
  function str(a, key, weekday, deepDataAndEvents, opt_attributes) {
    var tmp = dayOfYearFromWeeks(a, key, weekday, deepDataAndEvents, opt_attributes);
    var today = makeUTCDate(tmp.year, 0, tmp.dayOfYear);
    return this.year(today.getUTCFullYear()), this.month(today.getUTCMonth()), this.date(today.getUTCDate()), this;
  }
  /**
   * @param {number} startOrEnd
   * @return {?}
   */
  function range(startOrEnd) {
    return null == startOrEnd ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (startOrEnd - 1) + this.month() % 3);
  }
  /**
   * @param {?} mom
   * @return {?}
   */
  function week(mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
  }
  /**
   * @return {?}
   */
  function compassResult() {
    return this._week.dow;
  }
  /**
   * @return {?}
   */
  function description() {
    return this._week.doy;
  }
  /**
   * @param {number} max
   * @return {?}
   */
  function loop(max) {
    var min = this.localeData().week(this);
    return null == max ? min : this.add(7 * (max - min), "d");
  }
  /**
   * @param {number} max
   * @return {?}
   */
  function limit(max) {
    var min = weekOfYear(this, 1, 4).week;
    return null == max ? min : this.add(7 * (max - min), "d");
  }
  /**
   * @param {number} val
   * @param {?} v
   * @return {?}
   */
  function isNumber(val, v) {
    return "string" != typeof val ? val : isNaN(val) ? (val = v.weekdaysParse(val), "number" == typeof val ? val : null) : parseInt(val, 10);
  }
  /**
   * @param {Object} m
   * @param {string} val
   * @return {?}
   */
  function attr(m, val) {
    return isArray(this._weekdays) ? this._weekdays[m.day()] : this._weekdays[this._weekdays.isFormat.test(val) ? "format" : "standalone"][m.day()];
  }
  /**
   * @param {Object} m
   * @return {?}
   */
  function weekdaysCaseReplace(m) {
    return this._weekdaysShort[m.day()];
  }
  /**
   * @param {Object} m
   * @return {?}
   */
  function progress(m) {
    return this._weekdaysMin[m.day()];
  }
  /**
   * @param {(boolean|number|string)} attr
   * @param {string} deepDataAndEvents
   * @param {(Array|string)} property
   * @return {?}
   */
  function has(attr, deepDataAndEvents, property) {
    var i;
    var mom;
    var requestUrl;
    if (!this._weekdaysParse) {
      /** @type {Array} */
      this._weekdaysParse = [];
      /** @type {Array} */
      this._minWeekdaysParse = [];
      /** @type {Array} */
      this._shortWeekdaysParse = [];
      /** @type {Array} */
      this._fullWeekdaysParse = [];
    }
    /** @type {number} */
    i = 0;
    for (;7 > i;i++) {
      if (mom = $([2E3, 1]).day(i), property && (!this._fullWeekdaysParse[i] && (this._fullWeekdaysParse[i] = new RegExp("^" + this.weekdays(mom, "").replace(".", ".?") + "$", "i"), this._shortWeekdaysParse[i] = new RegExp("^" + this.weekdaysShort(mom, "").replace(".", ".?") + "$", "i"), this._minWeekdaysParse[i] = new RegExp("^" + this.weekdaysMin(mom, "").replace(".", ".?") + "$", "i"))), this._weekdaysParse[i] || (requestUrl = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") +
      "|^" + this.weekdaysMin(mom, ""), this._weekdaysParse[i] = new RegExp(requestUrl.replace(".", ""), "i")), property && ("dddd" === deepDataAndEvents && this._fullWeekdaysParse[i].test(attr))) {
        return i;
      }
      if (property && ("ddd" === deepDataAndEvents && this._shortWeekdaysParse[i].test(attr))) {
        return i;
      }
      if (property && ("dd" === deepDataAndEvents && this._minWeekdaysParse[i].test(attr))) {
        return i;
      }
      if (!property && this._weekdaysParse[i].test(attr)) {
        return i;
      }
    }
  }
  /**
   * @param {number} d
   * @return {?}
   */
  function test(d) {
    if (!this.isValid()) {
      return null != d ? this : NaN;
    }
    var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    return null != d ? (d = isNumber(d, this.localeData()), this.add(d - b, "d")) : b;
  }
  /**
   * @param {number} max
   * @return {?}
   */
  function config(max) {
    if (!this.isValid()) {
      return null != max ? this : NaN;
    }
    /** @type {number} */
    var min = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return null == max ? min : this.add(max - min, "d");
  }
  /**
   * @param {number} dataAndEvents
   * @return {?}
   */
  function nodeId(dataAndEvents) {
    return this.isValid() ? null == dataAndEvents ? this.day() || 7 : this.day(this.day() % 7 ? dataAndEvents : dataAndEvents - 7) : null != dataAndEvents ? this : NaN;
  }
  /**
   * @param {number} max
   * @return {?}
   */
  function parse(max) {
    /** @type {number} */
    var min = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864E5) + 1;
    return null == max ? min : this.add(max - min, "d");
  }
  /**
   * @return {?}
   */
  function camelKey() {
    return this.hours() % 12 || 12;
  }
  /**
   * @param {string} string
   * @param {boolean} recurring
   * @return {undefined}
   */
  function parser(string, recurring) {
    parseInt(string, 0, 0, function() {
      return this.localeData().meridiem(this.hours(), this.minutes(), recurring);
    });
  }
  /**
   * @param {?} deepDataAndEvents
   * @param {?} dataAndEvents
   * @return {?}
   */
  function udataCur(deepDataAndEvents, dataAndEvents) {
    return dataAndEvents._meridiemParse;
  }
  /**
   * @param {(number|string)} data
   * @return {?}
   */
  function handle(data) {
    return "p" === (data + "").toLowerCase().charAt(0);
  }
  /**
   * @param {number} formatString
   * @param {?} heur
   * @param {boolean} isLower
   * @return {?}
   */
  function formatTime(formatString, heur, isLower) {
    return formatString > 11 ? isLower ? "pm" : "PM" : isLower ? "am" : "AM";
  }
  /**
   * @param {string} dataAndEvents
   * @param {Array} datePartArray
   * @return {undefined}
   */
  function activeIndex(dataAndEvents, datePartArray) {
    datePartArray[SECOND] = toInt(1E3 * ("0." + dataAndEvents));
  }
  /**
   * @return {?}
   */
  function fullPath() {
    return this._isUTC ? "UTC" : "";
  }
  /**
   * @return {?}
   */
  function username() {
    return this._isUTC ? "Coordinated Universal Time" : "";
  }
  /**
   * @param {number} context
   * @return {?}
   */
  function jQuery(context) {
    return $(1E3 * context);
  }
  /**
   * @return {?}
   */
  function CB() {
    return $.apply(null, arguments).parseZone();
  }
  /**
   * @param {string} key
   * @param {?} node
   * @param {?} fn
   * @return {?}
   */
  function post(key, node, fn) {
    var a = this._calendar[key];
    return isFunction(a) ? a.call(node, fn) : a;
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function header(key) {
    var end = this._longDateFormat[key];
    var escaped = this._longDateFormat[key.toUpperCase()];
    return end || !escaped ? end : (this._longDateFormat[key] = escaped.replace(/MMMM|MM|DD|dddd/g, function(models) {
      return models.slice(1);
    }), this._longDateFormat[key]);
  }
  /**
   * @return {?}
   */
  function user() {
    return this._invalidDate;
  }
  /**
   * @param {?} n
   * @return {?}
   */
  function n(n) {
    return this._ordinal.replace("%d", n);
  }
  /**
   * @param {?} object
   * @return {?}
   */
  function seal(object) {
    return object;
  }
  /**
   * @param {?} path
   * @param {boolean} item
   * @param {?} name
   * @param {?} arr
   * @return {?}
   */
  function load(path, item, name, arr) {
    var fn = this._relativeTime[name];
    return isFunction(fn) ? fn(path, item, name, arr) : fn.replace(/%d/i, path);
  }
  /**
   * @param {number} total
   * @param {?} data
   * @return {?}
   */
  function done(total, data) {
    var view = this._relativeTime[total > 0 ? "future" : "past"];
    return isFunction(view) ? view(data) : view.replace(/%s/i, data);
  }
  /**
   * @param {Object} src
   * @return {undefined}
   */
  function template(src) {
    var copy;
    var name;
    for (name in src) {
      copy = src[name];
      if (isFunction(copy)) {
        this[name] = copy;
      } else {
        this["_" + name] = copy;
      }
    }
    /** @type {RegExp} */
    this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source);
  }
  /**
   * @param {string} name
   * @param {string} array
   * @param {string} style
   * @param {Object} obj
   * @return {?}
   */
  function callback(name, array, style, obj) {
    var $ = getLangDefinition();
    var ret = slice().set(obj, array);
    return $[style](ret, name);
  }
  /**
   * @param {string} value
   * @param {string} val
   * @param {string} key
   * @param {number} opt_attributes
   * @param {string} array
   * @return {?}
   */
  function write(value, val, key, opt_attributes, array) {
    if ("number" == typeof value && (val = value, value = void 0), value = value || "", null != val) {
      return callback(value, val, key, array);
    }
    var index;
    /** @type {Array} */
    var result = [];
    /** @type {number} */
    index = 0;
    for (;opt_attributes > index;index++) {
      result[index] = callback(value, index, key, array);
    }
    return result;
  }
  /**
   * @param {string} obj
   * @param {string} bytes
   * @return {?}
   */
  function read(obj, bytes) {
    return write(obj, bytes, "months", 12, "month");
  }
  /**
   * @param {string} ar
   * @param {string} bytes
   * @return {?}
   */
  function exports(ar, bytes) {
    return write(ar, bytes, "monthsShort", 12, "month");
  }
  /**
   * @param {string} m
   * @param {string} bytes
   * @return {?}
   */
  function setModifiers(m, bytes) {
    return write(m, bytes, "weekdays", 7, "day");
  }
  /**
   * @param {string} m
   * @param {string} selector
   * @return {?}
   */
  function prev(m, selector) {
    return write(m, selector, "weekdaysShort", 7, "day");
  }
  /**
   * @param {string} m
   * @param {string} bytes
   * @return {?}
   */
  function lt(m, bytes) {
    return write(m, bytes, "weekdaysMin", 7, "day");
  }
  /**
   * @return {?}
   */
  function Duration() {
    var d = this._data;
    return this._milliseconds = plurality(this._milliseconds), this._days = plurality(this._days), this._months = plurality(this._months), d.milliseconds = plurality(d.milliseconds), d.seconds = plurality(d.seconds), d.minutes = plurality(d.minutes), d.hours = plurality(d.hours), d.months = plurality(d.months), d.years = plurality(d.years), this;
  }
  /**
   * @param {?} input
   * @param {number} deepDataAndEvents
   * @param {string} arr
   * @param {number} expectedNumberOfNonCommentArgs
   * @return {?}
   */
  function sort(input, deepDataAndEvents, arr, expectedNumberOfNonCommentArgs) {
    var duration = append(deepDataAndEvents, arr);
    return input._milliseconds += expectedNumberOfNonCommentArgs * duration._milliseconds, input._days += expectedNumberOfNonCommentArgs * duration._days, input._months += expectedNumberOfNonCommentArgs * duration._months, input._bubble();
  }
  /**
   * @param {number} deepDataAndEvents
   * @param {string} n
   * @return {?}
   */
  function times(deepDataAndEvents, n) {
    return sort(this, deepDataAndEvents, n, 1);
  }
  /**
   * @param {number} deepDataAndEvents
   * @param {string} str
   * @return {?}
   */
  function password(deepDataAndEvents, str) {
    return sort(this, deepDataAndEvents, str, -1);
  }
  /**
   * @param {number} from
   * @return {?}
   */
  function compute(from) {
    return 0 > from ? Math.floor(from) : Math.ceil(from);
  }
  /**
   * @return {?}
   */
  function populate() {
    var seconds;
    var minutes;
    var hours;
    var i;
    var rvar;
    var milliseconds = this._milliseconds;
    var data = this._days;
    var months = this._months;
    var d = this._data;
    return milliseconds >= 0 && (data >= 0 && months >= 0) || (0 >= milliseconds && (0 >= data && 0 >= months) || (milliseconds += 864E5 * compute(lambda(months) + data), data = 0, months = 0)), d.milliseconds = milliseconds % 1E3, seconds = indexOf(milliseconds / 1E3), d.seconds = seconds % 60, minutes = indexOf(seconds / 60), d.minutes = minutes % 60, hours = indexOf(minutes / 60), d.hours = hours % 24, data += indexOf(hours / 24), rvar = indexOf(log(data)), months += rvar, data -= compute(lambda(rvar)),
    i = indexOf(months / 12), months %= 12, d.days = data, d.months = months, d.years = i, this;
  }
  /**
   * @param {number} str
   * @return {?}
   */
  function log(str) {
    return 4800 * str / 146097;
  }
  /**
   * @param {number} name
   * @return {?}
   */
  function lambda(name) {
    return 146097 * name / 4800;
  }
  /**
   * @param {string} v
   * @return {?}
   */
  function createIntervalElements(v) {
    var x;
    var defValue;
    var y = this._milliseconds;
    if (v = walk(v), "month" === v || "year" === v) {
      return x = this._days + y / 864E5, defValue = this._months + log(x), "month" === v ? defValue : defValue / 12;
    }
    switch(x = this._days + Math.round(lambda(this._months)), v) {
      case "week":
        return x / 7 + y / 6048E5;
      case "day":
        return x + y / 864E5;
      case "hour":
        return 24 * x + y / 36E5;
      case "minute":
        return 1440 * x + y / 6E4;
      case "second":
        return 86400 * x + y / 1E3;
      case "millisecond":
        return Math.floor(864E5 * x) + y;
      default:
        throw new Error("Unknown unit " + v);;
    }
  }
  /**
   * @return {?}
   */
  function valueOf() {
    return this._milliseconds + 864E5 * this._days + this._months % 12 * 2592E6 + 31536E6 * toInt(this._months / 12);
  }
  /**
   * @param {string} x
   * @return {?}
   */
  function parseFloat(x) {
    return function() {
      return this.as(x);
    };
  }
  /**
   * @param {string} t
   * @return {?}
   */
  function hash(t) {
    return t = walk(t), this[t + "s"]();
  }
  /**
   * @param {string} n
   * @return {?}
   */
  function isNumeric(n) {
    return function() {
      return this._data[n];
    };
  }
  /**
   * @return {?}
   */
  function POST() {
    return indexOf(this.days() / 7);
  }
  /**
   * @param {?} string
   * @param {number} number
   * @param {?} withoutSuffix
   * @param {?} isFuture
   * @param {?} lang
   * @return {?}
   */
  function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
    return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
  }
  /**
   * @param {number} key
   * @param {boolean} _
   * @param {?} context
   * @return {?}
   */
  function preset(key, _, context) {
    var assert = append(key).abs();
    /** @type {number} */
    var seconds = Fay(assert.as("s"));
    /** @type {number} */
    var x = Fay(assert.as("m"));
    /** @type {number} */
    var a = Fay(assert.as("h"));
    /** @type {number} */
    var i = Fay(assert.as("d"));
    /** @type {number} */
    var r = Fay(assert.as("M"));
    /** @type {number} */
    var o = Fay(assert.as("y"));
    /** @type {Array} */
    var args = seconds < obj.s && ["s", seconds] || (1 >= x && ["m"] || (x < obj.m && ["mm", x] || (1 >= a && ["h"] || (a < obj.h && ["hh", a] || (1 >= i && ["d"] || (i < obj.d && ["dd", i] || (1 >= r && ["M"] || (r < obj.M && ["MM", r] || (1 >= o && ["y"] || ["yy", o])))))))));
    return args[2] = _, args[3] = +key > 0, args[4] = context, substituteTimeAgo.apply(null, args);
  }
  /**
   * @param {?} key
   * @param {number} value
   * @return {?}
   */
  function access(key, value) {
    return void 0 === obj[key] ? false : void 0 === value ? obj[key] : (obj[key] = value, true);
  }
  /**
   * @param {boolean} obj
   * @return {?}
   */
  function locals(obj) {
    var d = this.localeData();
    var p = preset(this, !obj, d);
    return obj && (p = d.pastFuture(+this, p)), d.postformat(p);
  }
  /**
   * @return {?}
   */
  function toString() {
    var index;
    var idx;
    var i3;
    /** @type {number} */
    var seconds_difference = abs(this._milliseconds) / 1E3;
    /** @type {number} */
    var expires = abs(this._days);
    /** @type {number} */
    var dy = abs(this._months);
    index = indexOf(seconds_difference / 60);
    idx = indexOf(index / 60);
    seconds_difference %= 60;
    index %= 60;
    i3 = indexOf(dy / 12);
    dy %= 12;
    var years = i3;
    /** @type {number} */
    var months = dy;
    /** @type {number} */
    var days = expires;
    var hours = idx;
    var minutes = index;
    /** @type {number} */
    var seconds = seconds_difference;
    var n = this.asSeconds();
    return n ? (0 > n ? "-" : "") + "P" + (years ? years + "Y" : "") + (months ? months + "M" : "") + (days ? days + "D" : "") + (hours || (minutes || seconds) ? "T" : "") + (hours ? hours + "H" : "") + (minutes ? minutes + "M" : "") + (seconds ? seconds + "S" : "") : "P0D";
  }
  var matcherFunction;
  var r;
  /** @type {Array} */
  var attrNames = moment.momentProperties = [];
  /** @type {boolean} */
  var Bn = false;
  var $cookies = {};
  var groups = {};
  /** @type {RegExp} */
  var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
  /** @type {RegExp} */
  var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;
  var formatFunctions = {};
  var keys = {};
  /** @type {RegExp} */
  var pdataOld = /\d/;
  /** @type {RegExp} */
  var memory = /\d\d/;
  /** @type {RegExp} */
  var pdataCur = /\d{3}/;
  /** @type {RegExp} */
  var toOverflow = /\d{4}/;
  /** @type {RegExp} */
  var msgs = /[+-]?\d{6}/;
  /** @type {RegExp} */
  var ru = /\d\d?/;
  /** @type {RegExp} */
  var bytenew = /\d\d\d\d?/;
  /** @type {RegExp} */
  var silentOptions = /\d\d\d\d\d\d?/;
  /** @type {RegExp} */
  var diff = /\d{1,3}/;
  /** @type {RegExp} */
  var STACK_JUMP_SEPARATOR = /\d{1,4}/;
  /** @type {RegExp} */
  var authHeader = /[+-]?\d{1,6}/;
  /** @type {RegExp} */
  var shExports = /\d+/;
  /** @type {RegExp} */
  var optionValue = /[+-]?\d+/;
  /** @type {RegExp} */
  var typePattern = /Z|[+-]\d\d:?\d\d/gi;
  /** @type {RegExp} */
  var width = /Z|[+-]\d\d(?::?\d\d)?/gi;
  /** @type {RegExp} */
  var ctor = /[+-]?\d+(\.\d{1,3})?/;
  /** @type {RegExp} */
  var initial = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
  var context = {};
  var nodes = {};
  /** @type {number} */
  var index = 0;
  /** @type {number} */
  var MONTH = 1;
  /** @type {number} */
  var DATE = 2;
  /** @type {number} */
  var YEAR = 3;
  /** @type {number} */
  var HOUR = 4;
  /** @type {number} */
  var MILLISECOND = 5;
  /** @type {number} */
  var SECOND = 6;
  /** @type {number} */
  var visible = 7;
  /** @type {number} */
  var hidden = 8;
  parseInt("M", ["MM", 2], "Mo", function() {
    return this.month() + 1;
  });
  parseInt("MMM", 0, 0, function(temp) {
    return this.localeData().monthsShort(this, temp);
  });
  parseInt("MMMM", 0, 0, function(temp) {
    return this.localeData().months(this, temp);
  });
  _getRangeAroundTestsForRangeSize("month", "M");
  pad("M", ru);
  pad("MM", ru, memory);
  pad("MMM", function(common, lang) {
    return lang.monthsShortRegex(common);
  });
  pad("MMMM", function(boundary, assert) {
    return assert.monthsRegex(boundary);
  });
  checkNext(["M", "MM"], function(dataAndEvents, datePartArray) {
    /** @type {number} */
    datePartArray[MONTH] = toInt(dataAndEvents) - 1;
  });
  checkNext(["MMM", "MMMM"], function(input, datePartArray, config, fn) {
    var matched = config._locale.monthsParse(input, fn, config._strict);
    if (null != matched) {
      datePartArray[MONTH] = matched;
    } else {
      /** @type {boolean} */
      req(config).invalidMonth = input;
    }
  });
  /** @type {RegExp} */
  var rbracket = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
  /** @type {Array.<string>} */
  var buf = "January_February_March_April_May_June_July_August_September_October_November_December".split("_");
  /** @type {Array.<string>} */
  var temp = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");
  /** @type {RegExp} */
  var res = initial;
  /** @type {RegExp} */
  var i = initial;
  var scripts = {};
  /** @type {boolean} */
  moment.suppressDeprecationWarnings = false;
  /** @type {RegExp} */
  var spaceRe = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
  /** @type {RegExp} */
  var isoDateExpression = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
  /** @type {RegExp} */
  var rtypenamespace = /Z|[+-]\d\d(?::?\d\d)?/;
  /** @type {Array} */
  var rawParams = [["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/], ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/], ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/], ["GGGG-[W]WW", /\d{4}-W\d\d/, false], ["YYYY-DDD", /\d{4}-\d{3}/], ["YYYY-MM", /\d{4}-\d\d/, false], ["YYYYYYMMDD", /[+-]\d{10}/], ["YYYYMMDD", /\d{8}/], ["GGGG[W]WWE", /\d{4}W\d{3}/], ["GGGG[W]WW", /\d{4}W\d{2}/, false], ["YYYYDDD", /\d{7}/]];
  /** @type {Array} */
  var codeSegments = [["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/], ["HH:mm:ss", /\d\d:\d\d:\d\d/], ["HH:mm", /\d\d:\d\d/], ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/], ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/], ["HHmmss", /\d\d\d\d\d\d/], ["HHmm", /\d\d\d\d/], ["HH", /\d\d/]];
  /** @type {RegExp} */
  var functionName = /^\/?Date\((\-?\d+)/i;
  moment.createFromInputFallback = bind("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function(config) {
    /** @type {Date} */
    config._d = new Date(config._i + (config._useUTC ? " UTC" : ""));
  });
  parseInt("Y", 0, 0, function() {
    var year = this.year();
    return 9999 >= year ? "" + year : "+" + year;
  });
  parseInt(0, ["YY", 2], 0, function() {
    return this.year() % 100;
  });
  parseInt(0, ["YYYY", 4], 0, "year");
  parseInt(0, ["YYYYY", 5], 0, "year");
  parseInt(0, ["YYYYYY", 6, true], 0, "year");
  _getRangeAroundTestsForRangeSize("year", "y");
  pad("Y", optionValue);
  pad("YY", ru, memory);
  pad("YYYY", STACK_JUMP_SEPARATOR, toOverflow);
  pad("YYYYY", authHeader, msgs);
  pad("YYYYYY", authHeader, msgs);
  checkNext(["YYYYY", "YYYYYY"], index);
  checkNext("YYYY", function(dataAndEvents, tokenized) {
    tokenized[index] = 2 === dataAndEvents.length ? moment.parseTwoDigitYear(dataAndEvents) : toInt(dataAndEvents);
  });
  checkNext("YY", function(dataAndEvents, tokenized) {
    tokenized[index] = moment.parseTwoDigitYear(dataAndEvents);
  });
  checkNext("Y", function(value, array) {
    /** @type {number} */
    array[index] = parseInt(value, 10);
  });
  /**
   * @param {?} dataAndEvents
   * @return {?}
   */
  moment.parseTwoDigitYear = function(dataAndEvents) {
    return toInt(dataAndEvents) + (toInt(dataAndEvents) > 68 ? 1900 : 2E3);
  };
  var val = setTick("FullYear", false);
  /**
   * @return {undefined}
   */
  moment.ISO_8601 = function() {
  };
  var v = bind("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function() {
    var r = $.apply(null, arguments);
    return this.isValid() && r.isValid() ? this > r ? this : r : server();
  });
  var max = bind("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function() {
    var r = $.apply(null, arguments);
    return this.isValid() && r.isValid() ? r > this ? this : r : server();
  });
  /**
   * @return {?}
   */
  var timestamp = function() {
    return Date.now ? Date.now() : +new Date;
  };
  init("Z", ":");
  init("ZZ", "");
  pad("Z", width);
  pad("ZZ", width);
  checkNext(["Z", "ZZ"], function(value, dataAndEvents, config) {
    /** @type {boolean} */
    config._useUTC = true;
    config._tzm = mixin(width, value);
  });
  /** @type {RegExp} */
  var parseTimezoneChunker = /([\+\-]|\d\d)/gi;
  /**
   * @return {undefined}
   */
  moment.updateOffset = function() {
  };
  /** @type {RegExp} */
  var re = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/;
  /** @type {RegExp} */
  var string = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
  append.fn = calculateInterval.prototype;
  var msg = format(1, "add");
  var url = format(-1, "subtract");
  /** @type {string} */
  moment.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
  var result = bind("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(storageKey) {
    return void 0 === storageKey ? this.localeData() : this.locale(storageKey);
  });
  parseInt(0, ["gg", 2], 0, function() {
    return this.weekYear() % 100;
  });
  parseInt(0, ["GG", 2], 0, function() {
    return this.isoWeekYear() % 100;
  });
  w("gggg", "weekYear");
  w("ggggg", "weekYear");
  w("GGGG", "isoWeekYear");
  w("GGGGG", "isoWeekYear");
  _getRangeAroundTestsForRangeSize("weekYear", "gg");
  _getRangeAroundTestsForRangeSize("isoWeekYear", "GG");
  pad("G", optionValue);
  pad("g", optionValue);
  pad("GG", ru, memory);
  pad("gg", ru, memory);
  pad("GGGG", STACK_JUMP_SEPARATOR, toOverflow);
  pad("gggg", STACK_JUMP_SEPARATOR, toOverflow);
  pad("GGGGG", authHeader, msgs);
  pad("ggggg", authHeader, msgs);
  sendKeys(["gggg", "ggggg", "GGGG", "GGGGG"], function(dataAndEvents, v, deepDataAndEvents, rgb) {
    v[rgb.substr(0, 2)] = toInt(dataAndEvents);
  });
  sendKeys(["gg", "GG"], function(dataAndEvents, buf, deepDataAndEvents, off) {
    buf[off] = moment.parseTwoDigitYear(dataAndEvents);
  });
  parseInt("Q", 0, "Qo", "quarter");
  _getRangeAroundTestsForRangeSize("quarter", "Q");
  pad("Q", pdataOld);
  checkNext("Q", function(dataAndEvents, datePartArray) {
    /** @type {number} */
    datePartArray[MONTH] = 3 * (toInt(dataAndEvents) - 1);
  });
  parseInt("w", ["ww", 2], "wo", "week");
  parseInt("W", ["WW", 2], "Wo", "isoWeek");
  _getRangeAroundTestsForRangeSize("week", "w");
  _getRangeAroundTestsForRangeSize("isoWeek", "W");
  pad("w", ru);
  pad("ww", ru, memory);
  pad("W", ru);
  pad("WW", ru, memory);
  sendKeys(["w", "ww", "W", "WW"], function(dataAndEvents, v, deepDataAndEvents, rgb) {
    v[rgb.substr(0, 1)] = toInt(dataAndEvents);
  });
  var nextSlide = {
    dow : 0,
    doy : 6
  };
  parseInt("D", ["DD", 2], "Do", "date");
  _getRangeAroundTestsForRangeSize("date", "D");
  pad("D", ru);
  pad("DD", ru, memory);
  pad("Do", function(selector, special) {
    return selector ? special._ordinalParse : special._ordinalParseLenient;
  });
  checkNext(["D", "DD"], DATE);
  checkNext("Do", function(requestUrl, datePartArray) {
    datePartArray[DATE] = toInt(requestUrl.match(ru)[0], 10);
  });
  var now = setTick("Date", true);
  parseInt("d", 0, "do", "day");
  parseInt("dd", 0, 0, function(totalSize) {
    return this.localeData().weekdaysMin(this, totalSize);
  });
  parseInt("ddd", 0, 0, function(until) {
    return this.localeData().weekdaysShort(this, until);
  });
  parseInt("dddd", 0, 0, function(message) {
    return this.localeData().weekdays(this, message);
  });
  parseInt("e", 0, 0, "weekday");
  parseInt("E", 0, 0, "isoWeekday");
  _getRangeAroundTestsForRangeSize("day", "d");
  _getRangeAroundTestsForRangeSize("weekday", "e");
  _getRangeAroundTestsForRangeSize("isoWeekday", "E");
  pad("d", ru);
  pad("e", ru);
  pad("E", ru);
  pad("dd", initial);
  pad("ddd", initial);
  pad("dddd", initial);
  sendKeys(["dd", "ddd", "dddd"], function(v, exports, config, deepDataAndEvents) {
    var d = config._locale.weekdaysParse(v, deepDataAndEvents, config._strict);
    if (null != d) {
      exports.d = d;
    } else {
      /** @type {boolean} */
      req(config).invalidWeekday = v;
    }
  });
  sendKeys(["d", "e", "E"], function(dataAndEvents, safe, deepDataAndEvents, i) {
    safe[i] = toInt(dataAndEvents);
  });
  /** @type {Array.<string>} */
  var p = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_");
  /** @type {Array.<string>} */
  var nameParts = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_");
  /** @type {Array.<string>} */
  var uid = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
  parseInt("DDD", ["DDDD", 3], "DDDo", "dayOfYear");
  _getRangeAroundTestsForRangeSize("dayOfYear", "DDD");
  pad("DDD", diff);
  pad("DDDD", pdataCur);
  checkNext(["DDD", "DDDD"], function(dataAndEvents, deepDataAndEvents, config) {
    config._dayOfYear = toInt(dataAndEvents);
  });
  parseInt("H", ["HH", 2], 0, "hour");
  parseInt("h", ["hh", 2], 0, camelKey);
  parseInt("hmm", 0, 0, function() {
    return "" + camelKey.apply(this) + next(this.minutes(), 2);
  });
  parseInt("hmmss", 0, 0, function() {
    return "" + camelKey.apply(this) + next(this.minutes(), 2) + next(this.seconds(), 2);
  });
  parseInt("Hmm", 0, 0, function() {
    return "" + this.hours() + next(this.minutes(), 2);
  });
  parseInt("Hmmss", 0, 0, function() {
    return "" + this.hours() + next(this.minutes(), 2) + next(this.seconds(), 2);
  });
  parser("a", true);
  parser("A", false);
  _getRangeAroundTestsForRangeSize("hour", "h");
  pad("a", udataCur);
  pad("A", udataCur);
  pad("H", ru);
  pad("h", ru);
  pad("HH", ru, memory);
  pad("hh", ru, memory);
  pad("hmm", bytenew);
  pad("hmmss", silentOptions);
  pad("Hmm", bytenew);
  pad("Hmmss", silentOptions);
  checkNext(["H", "HH"], YEAR);
  checkNext(["a", "A"], function(input, dataAndEvents, item) {
    item._isPm = item._locale.isPM(input);
    item._meridiem = input;
  });
  checkNext(["h", "hh"], function(dataAndEvents, datePartArray, config) {
    datePartArray[YEAR] = toInt(dataAndEvents);
    /** @type {boolean} */
    req(config).bigHour = true;
  });
  checkNext("hmm", function(method, datePartArray, config) {
    /** @type {number} */
    var prefix_i = method.length - 2;
    datePartArray[YEAR] = toInt(method.substr(0, prefix_i));
    datePartArray[HOUR] = toInt(method.substr(prefix_i));
    /** @type {boolean} */
    req(config).bigHour = true;
  });
  checkNext("hmmss", function(method, datePartArray, config) {
    /** @type {number} */
    var prefix_i = method.length - 4;
    /** @type {number} */
    var fromIndex = method.length - 2;
    datePartArray[YEAR] = toInt(method.substr(0, prefix_i));
    datePartArray[HOUR] = toInt(method.substr(prefix_i, 2));
    datePartArray[MILLISECOND] = toInt(method.substr(fromIndex));
    /** @type {boolean} */
    req(config).bigHour = true;
  });
  checkNext("Hmm", function(method, datePartArray, dataAndEvents) {
    /** @type {number} */
    var prefix_i = method.length - 2;
    datePartArray[YEAR] = toInt(method.substr(0, prefix_i));
    datePartArray[HOUR] = toInt(method.substr(prefix_i));
  });
  checkNext("Hmmss", function(method, datePartArray, dataAndEvents) {
    /** @type {number} */
    var prefix_i = method.length - 4;
    /** @type {number} */
    var fromIndex = method.length - 2;
    datePartArray[YEAR] = toInt(method.substr(0, prefix_i));
    datePartArray[HOUR] = toInt(method.substr(prefix_i, 2));
    datePartArray[MILLISECOND] = toInt(method.substr(fromIndex));
  });
  /** @type {RegExp} */
  var rchecked = /[ap]\.?m?\.?/i;
  var hours = setTick("Hours", true);
  parseInt("m", ["mm", 2], 0, "minute");
  _getRangeAroundTestsForRangeSize("minute", "m");
  pad("m", ru);
  pad("mm", ru, memory);
  checkNext(["m", "mm"], HOUR);
  var m = setTick("Minutes", false);
  parseInt("s", ["ss", 2], 0, "second");
  _getRangeAroundTestsForRangeSize("second", "s");
  pad("s", ru);
  pad("ss", ru, memory);
  checkNext(["s", "ss"], MILLISECOND);
  var seconds = setTick("Seconds", false);
  parseInt("S", 0, 0, function() {
    return~~(this.millisecond() / 100);
  });
  parseInt(0, ["SS", 2], 0, function() {
    return~~(this.millisecond() / 10);
  });
  parseInt(0, ["SSS", 3], 0, "millisecond");
  parseInt(0, ["SSSS", 4], 0, function() {
    return 10 * this.millisecond();
  });
  parseInt(0, ["SSSSS", 5], 0, function() {
    return 100 * this.millisecond();
  });
  parseInt(0, ["SSSSSS", 6], 0, function() {
    return 1E3 * this.millisecond();
  });
  parseInt(0, ["SSSSSSS", 7], 0, function() {
    return 1E4 * this.millisecond();
  });
  parseInt(0, ["SSSSSSSS", 8], 0, function() {
    return 1E5 * this.millisecond();
  });
  parseInt(0, ["SSSSSSSSS", 9], 0, function() {
    return 1E6 * this.millisecond();
  });
  _getRangeAroundTestsForRangeSize("millisecond", "ms");
  pad("S", diff, pdataOld);
  pad("SS", diff, memory);
  pad("SSS", diff, pdataCur);
  var direction;
  /** @type {string} */
  direction = "SSSS";
  for (;direction.length <= 9;direction += "S") {
    pad(direction, shExports);
  }
  /** @type {string} */
  direction = "S";
  for (;direction.length <= 9;direction += "S") {
    checkNext(direction, activeIndex);
  }
  var input = setTick("Milliseconds", false);
  parseInt("z", 0, 0, "zoneAbbr");
  parseInt("zz", 0, 0, "zoneName");
  var data = f.prototype;
  data.add = msg;
  /** @type {function ((Object|boolean|number|string), Object): ?} */
  data.calendar = draw;
  /** @type {function (): ?} */
  data.clone = $options;
  /** @type {function (?, string, boolean): ?} */
  data.diff = Timestring;
  /** @type {function (string): ?} */
  data.endOf = update;
  /** @type {function (string): ?} */
  data.format = type;
  /** @type {function (Object, ?): ?} */
  data.from = error;
  /** @type {function (?): ?} */
  data.fromNow = success;
  /** @type {function (string, ?): ?} */
  data.to = complete;
  /** @type {function (?): ?} */
  data.toNow = to;
  /** @type {function (Object, string): ?} */
  data.get = create;
  /** @type {function (): ?} */
  data.invalidAt = newVal;
  /** @type {function (Object, string): ?} */
  data.isAfter = setup;
  /** @type {function (?, string): ?} */
  data.isBefore = push;
  /** @type {function (Object, ?, string): ?} */
  data.isBetween = array;
  /** @type {function (Object, string): ?} */
  data.isSame = process;
  /** @type {function (Object, string): ?} */
  data.isSameOrAfter = dataAttr;
  /** @type {function (Object, string): ?} */
  data.isSameOrBefore = disabled;
  /** @type {function (): ?} */
  data.isValid = target;
  data.lang = result;
  /** @type {function (string): ?} */
  data.locale = right;
  /** @type {function (): ?} */
  data.localeData = uri;
  data.max = max;
  data.min = v;
  /** @type {function (): ?} */
  data.parsingFlags = _forEach;
  /** @type {function (Object, string): ?} */
  data.set = create;
  /** @type {function (string): ?} */
  data.startOf = startOf;
  data.subtract = url;
  /** @type {function (): ?} */
  data.toArray = parseTimePeriod;
  /** @type {function (): ?} */
  data.toObject = setNewEventDate;
  /** @type {function (): ?} */
  data.toDate = replace;
  /** @type {function (): ?} */
  data.toISOString = start;
  /** @type {function (): ?} */
  data.toJSON = serialize;
  /** @type {function (): ?} */
  data.toString = display;
  /** @type {function (): ?} */
  data.unix = parent;
  /** @type {function (): ?} */
  data.valueOf = key;
  /** @type {function (): ?} */
  data.creationData = bar;
  data.year = val;
  /** @type {function (): ?} */
  data.isLeapYear = readyState;
  /** @type {function (?): ?} */
  data.weekYear = end;
  /** @type {function (?): ?} */
  data.isoWeekYear = content;
  /** @type {function (number): ?} */
  data.quarter = data.quarters = range;
  /** @type {function (number): ?} */
  data.month = value;
  /** @type {function (): ?} */
  data.daysInMonth = Clndr;
  /** @type {function (number): ?} */
  data.week = data.weeks = loop;
  /** @type {function (number): ?} */
  data.isoWeek = data.isoWeeks = limit;
  /** @type {function (): ?} */
  data.weeksInYear = userid;
  /** @type {function (): ?} */
  data.isoWeeksInYear = nextindex;
  data.date = now;
  /** @type {function (number): ?} */
  data.day = data.days = test;
  /** @type {function (number): ?} */
  data.weekday = config;
  /** @type {function (number): ?} */
  data.isoWeekday = nodeId;
  /** @type {function (number): ?} */
  data.dayOfYear = parse;
  data.hour = data.hours = hours;
  data.minute = data.minutes = m;
  data.second = data.seconds = seconds;
  data.millisecond = data.milliseconds = input;
  /** @type {function (Object, ?): ?} */
  data.utcOffset = animate;
  /** @type {function (?): ?} */
  data.utc = css;
  /** @type {function ((Error|string)): ?} */
  data.local = color;
  /** @type {function (): ?} */
  data.parseZone = fire;
  /** @type {function (Element): ?} */
  data.hasAlignedHourOffset = id;
  /** @type {function (): ?} */
  data.isDST = DateRangePicker;
  /** @type {function (): ?} */
  data.isDSTShifted = execute;
  /** @type {function (): ?} */
  data.isLocal = isLocal;
  /** @type {function (): ?} */
  data.isUtcOffset = text;
  /** @type {function (): ?} */
  data.isUtc = makeAs;
  /** @type {function (): ?} */
  data.isUTC = makeAs;
  /** @type {function (): ?} */
  data.zoneAbbr = fullPath;
  /** @type {function (): ?} */
  data.zoneName = username;
  data.dates = bind("dates accessor is deprecated. Use date instead.", now);
  data.months = bind("months accessor is deprecated. Use month instead", value);
  data.years = bind("years accessor is deprecated. Use year instead", val);
  data.zone = bind("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", query);
  var fn = data;
  var _calendar = {
    sameDay : "[Today at] LT",
    nextDay : "[Tomorrow at] LT",
    nextWeek : "dddd [at] LT",
    lastDay : "[Yesterday at] LT",
    lastWeek : "[Last] dddd [at] LT",
    sameElse : "L"
  };
  var orig = {
    LTS : "h:mm:ss A",
    LT : "h:mm A",
    L : "MM/DD/YYYY",
    LL : "MMMM D, YYYY",
    LLL : "MMMM D, YYYY h:mm A",
    LLLL : "dddd, MMMM D, YYYY h:mm A"
  };
  /** @type {string} */
  var theTitle = "Invalid date";
  /** @type {string} */
  var out = "%d";
  /** @type {RegExp} */
  var theText = /\d{1,2}/;
  var fields = {
    future : "in %s",
    past : "%s ago",
    s : "a few seconds",
    m : "a minute",
    mm : "%d minutes",
    h : "an hour",
    hh : "%d hours",
    d : "a day",
    dd : "%d days",
    M : "a month",
    MM : "%d months",
    y : "a year",
    yy : "%d years"
  };
  var self = Button.prototype;
  self._calendar = _calendar;
  /** @type {function (string, ?, ?): ?} */
  self.calendar = post;
  self._longDateFormat = orig;
  /** @type {function (string): ?} */
  self.longDateFormat = header;
  /** @type {string} */
  self._invalidDate = theTitle;
  /** @type {function (): ?} */
  self.invalidDate = user;
  /** @type {string} */
  self._ordinal = out;
  /** @type {function (?): ?} */
  self.ordinal = n;
  /** @type {RegExp} */
  self._ordinalParse = theText;
  /** @type {function (?): ?} */
  self.preparse = seal;
  /** @type {function (?): ?} */
  self.postformat = seal;
  self._relativeTime = fields;
  /** @type {function (?, boolean, ?, ?): ?} */
  self.relativeTime = load;
  /** @type {function (number, ?): ?} */
  self.pastFuture = done;
  /** @type {function (Object): undefined} */
  self.set = template;
  /** @type {function (string, string): ?} */
  self.months = remove;
  /** @type {Array.<string>} */
  self._months = buf;
  /** @type {function (string, string): ?} */
  self.monthsShort = buildParams;
  /** @type {Array.<string>} */
  self._monthsShort = temp;
  /** @type {function ((boolean|number|string), string, string): ?} */
  self.monthsParse = parseQuery;
  /** @type {RegExp} */
  self._monthsRegex = i;
  /** @type {function (?): ?} */
  self.monthsRegex = isEmpty;
  /** @type {RegExp} */
  self._monthsShortRegex = res;
  /** @type {function (?): ?} */
  self.monthsShortRegex = merge;
  /** @type {function (?): ?} */
  self.week = week;
  self._week = nextSlide;
  /** @type {function (): ?} */
  self.firstDayOfYear = description;
  /** @type {function (): ?} */
  self.firstDayOfWeek = compassResult;
  /** @type {function (Object, string): ?} */
  self.weekdays = attr;
  /** @type {Array.<string>} */
  self._weekdays = p;
  /** @type {function (Object): ?} */
  self.weekdaysMin = progress;
  /** @type {Array.<string>} */
  self._weekdaysMin = uid;
  /** @type {function (Object): ?} */
  self.weekdaysShort = weekdaysCaseReplace;
  /** @type {Array.<string>} */
  self._weekdaysShort = nameParts;
  /** @type {function ((boolean|number|string), string, (Array|string)): ?} */
  self.weekdaysParse = has;
  /** @type {function ((number|string)): ?} */
  self.isPM = handle;
  /** @type {RegExp} */
  self._meridiemParse = rchecked;
  /** @type {function (number, ?, boolean): ?} */
  self.meridiem = formatTime;
  resolve("en", {
    ordinalParse : /\d{1,2}(th|st|nd|rd)/,
    /**
     * @param {number} number
     * @return {?}
     */
    ordinal : function(number) {
      /** @type {number} */
      var b = number % 10;
      /** @type {string} */
      var output = 1 === toInt(number % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
      return number + output;
    }
  });
  moment.lang = bind("moment.lang is deprecated. Use moment.locale instead.", resolve);
  moment.langData = bind("moment.langData is deprecated. Use moment.localeData instead.", getLangDefinition);
  /** @type {function (*): number} */
  var plurality = Math.abs;
  var version = parseFloat("ms");
  var len = parseFloat("s");
  var pt = parseFloat("m");
  var dir = parseFloat("h");
  var num = parseFloat("d");
  var c = parseFloat("w");
  var item = parseFloat("M");
  var height = parseFloat("y");
  var timer = isNumeric("milliseconds");
  var s = isNumeric("seconds");
  var date = isNumeric("minutes");
  var offset = isNumeric("hours");
  var q = isNumeric("days");
  var months = isNumeric("months");
  var years = isNumeric("years");
  /** @type {function (*): number} */
  var Fay = Math.round;
  var obj = {
    s : 45,
    m : 45,
    h : 22,
    d : 26,
    M : 11
  };
  /** @type {function (*): number} */
  var abs = Math.abs;
  var options = calculateInterval.prototype;
  /** @type {function (): ?} */
  options.abs = Duration;
  /** @type {function (number, string): ?} */
  options.add = times;
  /** @type {function (number, string): ?} */
  options.subtract = password;
  /** @type {function (string): ?} */
  options.as = createIntervalElements;
  options.asMilliseconds = version;
  options.asSeconds = len;
  options.asMinutes = pt;
  options.asHours = dir;
  options.asDays = num;
  options.asWeeks = c;
  options.asMonths = item;
  options.asYears = height;
  /** @type {function (): ?} */
  options.valueOf = valueOf;
  /** @type {function (): ?} */
  options._bubble = populate;
  /** @type {function (string): ?} */
  options.get = hash;
  options.milliseconds = timer;
  options.seconds = s;
  options.minutes = date;
  options.hours = offset;
  options.days = q;
  /** @type {function (): ?} */
  options.weeks = POST;
  options.months = months;
  options.years = years;
  /** @type {function (boolean): ?} */
  options.humanize = locals;
  /** @type {function (): ?} */
  options.toISOString = toString;
  /** @type {function (): ?} */
  options.toString = toString;
  /** @type {function (): ?} */
  options.toJSON = toString;
  /** @type {function (string): ?} */
  options.locale = right;
  /** @type {function (): ?} */
  options.localeData = uri;
  options.toIsoString = bind("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", toString);
  options.lang = result;
  parseInt("X", 0, 0, "unix");
  parseInt("x", 0, 0, "valueOf");
  pad("x", optionValue);
  pad("X", ctor);
  checkNext("X", function(sValue, dataAndEvents, config) {
    /** @type {Date} */
    config._d = new Date(1E3 * parseFloat(sValue, 10));
  });
  checkNext("x", function(dataAndEvents, deepDataAndEvents, config) {
    /** @type {Date} */
    config._d = new Date(toInt(dataAndEvents));
  });
  /** @type {string} */
  moment.version = "2.11.2";
  factory($);
  moment.fn = fn;
  /** @type {function (): ?} */
  moment.min = isObject;
  /** @type {function (): ?} */
  moment.max = d;
  /** @type {function (): ?} */
  moment.now = timestamp;
  /** @type {function (?, string, ?, ?): ?} */
  moment.utc = slice;
  /** @type {function (number): ?} */
  moment.unix = jQuery;
  /** @type {function (string, string): ?} */
  moment.months = read;
  /** @type {function (?): ?} */
  moment.isDate = isDate;
  /** @type {function (string, string): ?} */
  moment.locale = resolve;
  /** @type {function (Object): ?} */
  moment.invalid = server;
  /** @type {function (number, (Object|string)): ?} */
  moment.duration = append;
  /** @type {function (?): ?} */
  moment.isMoment = isString;
  /** @type {function (string, string): ?} */
  moment.weekdays = setModifiers;
  /** @type {function (): ?} */
  moment.parseZone = CB;
  /** @type {function (string): ?} */
  moment.localeData = getLangDefinition;
  /** @type {function (number): ?} */
  moment.isDuration = matcher;
  /** @type {function (string, string): ?} */
  moment.monthsShort = exports;
  /** @type {function (string, string): ?} */
  moment.weekdaysMin = lt;
  /** @type {function (string, Object): ?} */
  moment.defineLocale = add;
  /** @type {function (string, string): ?} */
  moment.weekdaysShort = prev;
  /** @type {function (string): ?} */
  moment.normalizeUnits = walk;
  /** @type {function (?, number): ?} */
  moment.relativeTimeThreshold = access;
  moment.prototype = fn;
  /** @type {function (): ?} */
  var local_moment = moment;
  return local_moment;
});
!function(root, factory) {
  if ("object" == typeof exports && ("undefined" != typeof module && "function" == typeof require)) {
    factory(require("../moment"));
  } else {
    if ("function" == typeof define && define.amd) {
      define(["moment"], factory);
    } else {
      factory(root.moment);
    }
  }
}(this, function(moment) {
  var pt_br = moment.defineLocale("pt-br", {
    months : "Janeiro_Fevereiro_Mar\u00e7o_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
    monthsShort : "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
    weekdays : "Domingo_Segunda-Feira_Ter\u00e7a-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_S\u00e1bado".split("_"),
    weekdaysShort : "Dom_Seg_Ter_Qua_Qui_Sex_S\u00e1b".split("_"),
    weekdaysMin : "Dom_2\u00aa_3\u00aa_4\u00aa_5\u00aa_6\u00aa_S\u00e1b".split("_"),
    longDateFormat : {
      LT : "HH:mm",
      LTS : "HH:mm:ss",
      L : "DD/MM/YYYY",
      LL : "D [de] MMMM [de] YYYY",
      LLL : "D [de] MMMM [de] YYYY [\u00e0s] HH:mm",
      LLLL : "dddd, D [de] MMMM [de] YYYY [\u00e0s] HH:mm"
    },
    calendar : {
      sameDay : "[Hoje \u00e0s] LT",
      nextDay : "[Amanh\u00e3 \u00e0s] LT",
      nextWeek : "dddd [\u00e0s] LT",
      lastDay : "[Ontem \u00e0s] LT",
      /**
       * @return {?}
       */
      lastWeek : function() {
        return 0 === this.day() || 6 === this.day() ? "[\u00daltimo] dddd [\u00e0s] LT" : "[\u00daltima] dddd [\u00e0s] LT";
      },
      sameElse : "L"
    },
    relativeTime : {
      future : "em %s",
      past : "%s atr\u00e1s",
      s : "poucos segundos",
      m : "um minuto",
      mm : "%d minutos",
      h : "uma hora",
      hh : "%d horas",
      d : "um dia",
      dd : "%d dias",
      M : "um m\u00eas",
      MM : "%d meses",
      y : "um ano",
      yy : "%d anos"
    },
    ordinalParse : /\d{1,2}\u00ba/,
    ordinal : "%d\u00ba"
  });
  return pt_br;
});
"use strict";
!function() {
  var Xupita = {
    Xupita : "Presidente da AAACEC - Gest\u00e3o 2016",
    "Espa\u00e7o Computa\u00e7\u00e3o Alumni" : "Caderno entregue junto ao Kit Bixo destinado aos nossos ilustr\u00edssimos doadores do projeto de Crowdfunding. Cada doador ter\u00e1 uma foto, nome, apelido, ano e descri\u00e7\u00e3o. Obs.: v\u00e1lido apenas para doa\u00e7\u00f5es at\u00e9 16/02.",
    "agasalho AAACEC 2016" : "Entregas previstas para maio/2016.",
    "miniatura do bandeir\u00e3o" : "Escala de aproximadamente 1:10.",
    "miniatura do 100Noss\u00e3o" : "Escala de aproximadamente 1:10."
  };
  var menu = $(".abbr-tooltip");
  menu.tooltip({
    container : "body",
    /**
     * @return {?}
     */
    title : function() {
      return Xupita[$(this).text()];
    }
  });
}();
"use strict";
!function() {
  var reference = new Firebase("https://valorosa-crowd.firebaseio.com/");
  var el = $(".goal-display");
  var input = $(".goal-progress");
  var object = $("#objetivos .list-group");
  var cursor = $($(".js-reward").get().reverse());
  var world = new ScrollMagic.Controller;
  var query = new Odometer({
    el : el[0],
    value : 0.001,
    format : "(.ddd),ddd"
  });
  moment.locale("pt-br");
  reference.once("value", function(snap) {
    var tests = snap.val();
    /** @type {number} */
    var pos = 0;
    /** @type {Array} */
    var results = [];
    Object.keys(tests).forEach(function(key) {
      results.push({
        name : key,
        value : tests[key].value,
        time : tests[key].time
      });
    });
    results.sort(function(b, a) {
      return a.time - b.time;
    });
    results.forEach(function(element, dataAndEvents) {
      if (pos += element.value, 8 > dataAndEvents) {
        /** @type {string} */
        var name = '<li class="list-group-item">\n\t\t\t\t\t<span class="label label-success label-pill pull-xs-right">\n\t\t\t\t\t\tR$ ' + element.value.toFixed(2).replace(".", ",") + "\n\t\t\t\t\t</span>\n\t\t\t\t\t" + element.name + ' <small class="text-muted">' + moment.unix(element.time).fromNow() + "</small>\n\t\t\t\t</li>";
        object.html(object.html() + name);
      }
      cursor.each(function() {
        var m = $(this);
        if (m.data("minValue") <= element.value) {
          var script = m.find(".js-received");
          return script.text(parseInt(script.text()) + 1), false;
        }
      });
    });
    (new ScrollMagic.Scene({
      triggerElement : el,
      triggerHook : "onEnter"
    })).addTo(world).addIndicators().on("start", function() {
      $({
        value : 0
      }).animate({
        value : pos
      }, {
        duration : 2E3,
        /**
         * @return {undefined}
         */
        step : function() {
          input.val(this.value);
        },
        /**
         * @return {undefined}
         */
        complete : function() {
          input.val(this.value);
        }
      });
      query.update(pos + 0.001);
      world.destroy();
    });
  });
}();
"use strict";
!function() {
  smoothScroll.init({
    offset : -32
  });
  gumshoe.init();
}();
"use strict";
!function() {
  var div = $(".modal");
  var component = $(".js-btn-donate");
  component.on("click", function() {
    div.modal();
  });
}();
