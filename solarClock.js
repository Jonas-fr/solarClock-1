(function() {
  var Clock;

  window.solarClock || (window.solarClock = {});

  window.solarClock.Clock = Clock = (function() {
    function Clock(id) {
      var _this = this;
      this.id = id;
      this.el = document.getElementById(this.id);
      this.context = this.el.getContext('2d');
      navigator.geolocation.getCurrentPosition(function(position) {
        var timer;
        if (position.coords.latitude && position.coords.longitude) {
          _this.sunData = SunCalc.getTimes(moment(), position.coords.latitude, position.coords.longitude);
        } else {
          _this.sunData = SunCalc.getTimes(moment(), 40, 7);
        }
        timer = setInterval(function() {
          _this.update();
          return 1000 / 32;
        });
        return $(_this.el).trigger('clock.ready');
      });
    }

    Clock.prototype.update = function() {
      var now, sunrise, sunset;
      sunrise = moment(this.sunData.sunrise);
      sunset = moment(this.sunData.sunset);
      this.increment = Math.round(sunset.diff(sunrise, "seconds") / (12 * 0.0036)) / 1000000;
      now = moment();
      this.before = sunrise.diff(now, "milliseconds");
      this.after = now.diff(sunset, "milliseconds");
      this.fromSunset = (this.before / (this.before + this.after)) * 12 * 3600 * 1000;
      this.time = moment.duration(this.fromSunset);
      this.context = this.el.getContext('2d');
      this.context.clearRect(0, 0, this.el.width, this.el.height);
      this.millisecondRadian = this.time.milliseconds() / 5000;
      this.secondsRadian = this.time.seconds() / 30 + this.millisecondRadian / 6;
      this.minutesRadian = this.time.minutes() / 30 + this.secondsRadian / 6;
      this.hoursRadian = this.time.hours() / 6 + this.minutesRadian / 6;
      this.FromNoon = Math.abs(6 * 3600 * 1000 - this.fromSunset) / (6 * 3600 * 1000);
      return this.render();
    };

    Clock.prototype.render = function() {
      var newB, newG;
      newG = Math.round((200 - 103) * this.FromNoon + 103);
      newB = Math.round((180 - 33) * this.FromNoon + 33);
      this.drawHandClock(300, 300, 290, this.hoursRadian, "rgba(180, " + newG + ", " + newB + ", 1)", 20, this.context);
      this.drawHandClock(300, 300, 245, this.minutesRadian, "rgba(180, " + newG + ", " + newB + ", 0.75)", 10, this.context);
      this.drawHandClock(300, 300, 197.5, this.secondsRadian, "rgba(180, " + newG + ", " + newB + ", 0.5)", 5, this.context);
      this.context.fillStyle = "rgba(255,255,255,0.75)";
      this.context.font = "2em Helvetica, Droid sans, Arial";
      this.context.fillText(this.time.hours('hh') + ' : ' + this.time.minutes('mm') + ' : ' + this.time.seconds('ss'), 300, 300);
      this.context.font = "1.1em Helvetica, Droid sans, Arial";
      return this.context.fillText(this.increment + 's', 300, 325);
    };

    Clock.prototype.drawHandClock = function(arcX, arcY, arcR, handPos, color, width, context) {
      context.beginPath();
      context.arc(arcX, arcY, arcR, 0 - Math.PI / 2, Math.PI * handPos - Math.PI / 2);
      context.strokeStyle = color;
      context.lineWidth = width;
      context.stroke();
      return context.closePath();
    };

    return Clock;

  })();

}).call(this);
