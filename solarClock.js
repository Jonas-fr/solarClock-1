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
          _this.times = SunCalc.getTimes(moment(), position.coords.latitude, position.coords.longitude);
        } else {
          _this.times = SunCalc.getTimes(moment(), 40, 7);
        }
        return timer = setInterval(function() {
          _this.render();
          return 1000 / 32;
        });
      });
    }

    Clock.prototype.render = function() {
      var FromNoon, after, before, fromSunset, hoursRadian, millisecondRadian, minutesRadian, newB, newG, now, secondsRadian, sunrise, sunset, time;
      sunrise = moment(this.times.sunrise);
      sunset = moment(this.times.sunset);
      this.increment = Math.round(sunset.diff(sunrise, "seconds") / (12 * 0.0036)) / 1000000;
      now = moment();
      before = sunrise.diff(now, "milliseconds");
      after = now.diff(sunset, "milliseconds");
      fromSunset = (before / (before + after)) * 12 * 3600 * 1000;
      time = moment.duration(fromSunset);
      this.context = this.el.getContext('2d');
      this.context.clearRect(0, 0, this.el.width, this.el.height);
      millisecondRadian = time.milliseconds() / 5000;
      secondsRadian = time.seconds() / 30 + millisecondRadian / 6;
      minutesRadian = time.minutes() / 30 + secondsRadian / 6;
      hoursRadian = time.hours() / 6 + minutesRadian / 6;
      FromNoon = Math.abs(6 * 3600 * 1000 - fromSunset) / (6 * 3600 * 1000);
      newG = Math.round((200 - 103) * FromNoon + 103);
      newB = Math.round((180 - 33) * FromNoon + 33);
      this.drawHandClock(300, 300, 290, hoursRadian, "rgba(180, " + newG + ", " + newB + ", 1)", 20, this.context);
      this.drawHandClock(300, 300, 245, minutesRadian, "rgba(180, " + newG + ", " + newB + ", 0.75)", 10, this.context);
      this.drawHandClock(300, 300, 197.5, secondsRadian, "rgba(180, " + newG + ", " + newB + ", 0.5)", 5, this.context);
      this.context.fillStyle = "rgba(255,255,255,0.75)";
      this.context.font = "2em Helvetica, Droid sans, Arial";
      this.context.fillText(time.hours('hh') + ' : ' + time.minutes('mm') + ' : ' + time.seconds('ss'), 300, 300);
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
