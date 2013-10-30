(function() {
  var root, solarClock;

  solarClock = (function() {
    function solarClock(id) {
      var _this = this;
      this.id = id;
      this.data = {};
      this.el = $('#' + this.id);
      navigator.geolocation.getCurrentPosition(function(position) {
        var timer;
        if (position.coords.latitude && position.coords.longitude) {
          _this.sunData = SunCalc.getTimes(moment(), position.coords.latitude, position.coords.longitude);
        } else {
          _this.sunData = SunCalc.getTimes(moment(), 40, 7);
        }
        timer = setInterval(function() {
          return _this.update();
        }, 1000 / 5);
        return $(_this.el).trigger('clock.ready');
      });
    }

    solarClock.prototype.update = function() {
      var now, sunrise, sunset;
      sunrise = moment(this.sunData.sunrise);
      sunset = moment(this.sunData.sunset);
      now = moment();
      this.before = sunrise.diff(now, "milliseconds");
      this.after = now.diff(sunset, "milliseconds");
      this.fromSunset = (this.before / (this.before + this.after)) * 12 * 3600 * 1000;
      this.FromNoon = Math.abs(6 * 3600 * 1000 - this.fromSunset) / (6 * 3600 * 1000);
      this.time = moment.duration(this.fromSunset);
      this.svar = Math.round(sunset.diff(sunrise, "seconds") / (12 * 0.0036)) / 1000000;
      $(this.el).trigger('clock.update');
      return this.render();
    };

    solarClock.prototype.render = function() {};

    solarClock.prototype.drawHandClock = function(arcX, arcY, arcR, handPos, color, width, context) {
      context.beginPath();
      context.arc(arcX, arcY, arcR, 0 - Math.PI / 2, Math.PI * handPos - Math.PI / 2);
      context.strokeStyle = color;
      context.lineWidth = width;
      context.stroke();
      return context.closePath();
    };

    return solarClock;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.solarClock = solarClock;

}).call(this);
