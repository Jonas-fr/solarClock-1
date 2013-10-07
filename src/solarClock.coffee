window.solarClock or= {}
# class column
# id      : an unique id used to select the DOM element
# el      : the DOM element
# min     : the min-width
# max     : the max-width
# medium  : the medium-width or auto
window.solarClock.Clock = class Clock
  constructor: (@id) ->
    @el = document.getElementById(@id)
    @context = @el.getContext('2d')

    # get the current location
    navigator.geolocation.getCurrentPosition (position) =>
      if position.coords.latitude and position.coords.longitude
        @sunData = SunCalc.getTimes moment(), position.coords.latitude, position.coords.longitude
      else
        @sunData = SunCalc.getTimes moment(), 40, 7

      timer = setInterval =>
        @.update()
        1000/32
      $(@el).trigger 'clock.ready'

  update: () ->
    # get today's sunlight data for current location
    sunrise = moment(@sunData.sunrise);
    sunset = moment(@sunData.sunset);
    @increment = Math.round( sunset.diff(sunrise, "seconds")/(12*0.0036) )/1000000

    now = moment();

    @before = sunrise.diff(now, "milliseconds")
    @after = now.diff(sunset, "milliseconds")
    @fromSunset = (@before/(@before+@after))*12*3600*1000

    @time = moment.duration(@fromSunset)

    @context = @el.getContext('2d')

    @context.clearRect(0, 0, @el.width, @el.height)

    @millisecondRadian = @time.milliseconds()/5000
    @secondsRadian = @time.seconds()/30 + @millisecondRadian/6
    @minutesRadian = @time.minutes()/30 + @secondsRadian/6
    @hoursRadian = @time.hours()/6 + @minutesRadian/6

    @FromNoon = Math.abs(6*3600*1000 - @fromSunset)/(6*3600*1000)
    @.render()

  render: () ->
    newG = Math.round((200-103)*@FromNoon+103)
    newB = Math.round((180-33)*@FromNoon+33)

    @.drawHandClock(300,300,290,@hoursRadian,"rgba(180, "+newG+", "+newB+", 1)",20,@context)
    @.drawHandClock(300,300,245,@minutesRadian,"rgba(180, "+newG+", "+newB+", 0.75)",10,@context)
    @.drawHandClock(300,300,197.5,@secondsRadian,"rgba(180, "+newG+", "+newB+", 0.5)",5,@context)

    @context.fillStyle = "rgba(255,255,255,0.75)"
    @context.font = "2em Helvetica, Droid sans, Arial"
    @context.fillText(@time.hours('hh')+' : '+@time.minutes('mm')+' : '+@time.seconds('ss'), 300,300)
    @context.font = "1.1em Helvetica, Droid sans, Arial"
    @context.fillText(@increment+'s', 300, 325)

  drawHandClock: (arcX,arcY,arcR,handPos,color,width,context) ->
    context.beginPath();
    context.arc(arcX, arcY, arcR, 0-Math.PI/2, Math.PI*handPos-Math.PI/2);
    context.strokeStyle = color;
    context.lineWidth = width;
    context.stroke();
    context.closePath();
