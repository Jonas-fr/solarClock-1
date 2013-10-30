jQuery(window).ready(function(){
    Clockwork =  new solarClock("clock");
    var data = {};
    $(Clockwork.el).on('clock.ready', function(){
        data.sun = JSON.stringify(Clockwork.sunData).replace(/[{}]/gi, '').replace(/,/gi, '<br/>');
        $(this).before('<p>'+data.sun+'</p>');
    });

    $(Clockwork.el).on('clock.update', function(){
        $(this).find('#svar').html(Clockwork.svar);
        $(this).find('#fromSunset').html(JSON.stringify(moment(Clockwork.fromSunset).format()));
        $(this).find('#fromNoon').html(JSON.stringify(moment(Clockwork.fromNoon).format()));

    });

});