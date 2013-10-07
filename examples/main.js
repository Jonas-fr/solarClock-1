jQuery(window).ready(function(){
    Clockwork =  new window.solarClock.Clock("clock");
    $(Clockwork.el).on('clock.ready', function(){
        sunData = JSON.stringify(Clockwork.sunData);
        sunData = sunData.replace(/[{,}]/gim,'<br />')
        $(this).after('<p>'+sunData+'</p>');
    })

});