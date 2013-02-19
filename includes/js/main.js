var Main = new(function()
{
	// static
	var _self = this;
	var _debug = false;
	var _apiKey = 'a04ca3cc3da6efe8dd6c74f37f16b81e';
	var _coords = {};
	var _weather = {};

	this.publicvariable = 'foo';

	this.init = function init( $debug )
	{
		_debug = $debug;
		_getLocation();

		$('.nav li').click( _clickNav );

	};

	function _updateView( $hash )
	{
		// console.log( '$hash', $hash );

		$( "li" ).each(function( $i )
		{
			$(this).removeClass( 'active' )
		});

		// if( $hash === '#hourly' )
		// {
		// 	$('ul').children( 'li' )[1].addClass( 'active' );
		// }

		switch( $hash )
		{
			case '#nutshell' :
				$($('ul').children( 'li' )[0]).addClass( 'active' );
			break;
			case '#dayPrecipitation' :
				$($('ul').children( 'li' )[1]).addClass( 'active' );
			break;
			case '#hourPrecipitation' :
				$($('ul').children( 'li' )[2]).addClass( 'active' );
			break;
		}

		$('#hourPrecipitation').addClass( 'hide' );
		$('#dayPrecipitation').addClass( 'hide' );
		$('#nutshell').addClass( 'hide' );

		$( $hash ).removeClass( 'hide' );
	};

	function _clickNav( $evt )
	{
		// console.log( '$evt', $($evt.currentTarget) );
		// console.log( '$evt', $( $evt.target ).children( 'a' ).context.hash );

		var hash = $( $evt.target ).children( 'a' ).context.hash;
		$('#hourPrecipitation').addClass( 'hide' );
		$('#dayPrecipitation').addClass( 'hide' );
		$('#nutshell').addClass( 'hide' );

		$( hash ).removeClass( 'hide' );

		//nav
		$( "li" ).each(function( $i )
		{
			$(this).removeClass( 'active' )
		});

		$( $evt.currentTarget ).addClass( 'active' );
	};


	function _getLocation()
	{
		if( navigator.geolocation )
		{
			navigator.geolocation.getCurrentPosition( _getDarkSky );
		}else
		{
			alert( 'geolocationless browser' );
		}
	}

	function _getDarkSky( $position )
	{
		_coords.lat = $position.coords.latitude;
		_coords.lon = $position.coords.longitude;

		var url = "https://api.darkskyapp.com/v1/forecast/" + _apiKey + "/" + _coords.lat + "," + _coords.lon;
		if( _debug == 'debug' )
		{
			url = "includes/json/hourData-1.json";
			$.getJSON(
				url,
				function( $data )
				{
					_processData( $data );
				}
			);
		}else
		{
			$.get(
				url,
				function( $data )
				{
					_processData( $data );
				},
				"jsonp"
			);
		}
	};

	function _processData( $data )
	{
		_weather = $data;
		// console.log( '_weather', _weather );
		$( '#isPrecipitating dd' ).html( ( _weather.isPrecipitating ) ? 'YES' : 'NO' );
		$( '#currentTemp dd' ).html( _weather.currentTemp + '&#176;F' );
		$( '#currentSummary dd' ).html( _weather.currentSummary );
		$( '#daySummary dd' ).html( _weather.daySummary );
		$( '#hourSummary dd' ).html( _weather.hourSummary );
		$( '#currentIntensity dd' ).html( _weather.currentIntensity );

		var update = moment().add('minutes', (_weather.checkTimeout / 60)).calendar();
		$( '#updateIn dd' ).html( update );

		var valuesx = [];
		var valuesy_probability = [];
		var valuesy_intensity_top = [];
		var valuesy_intensity = [];
		var valuesy_intensity_bottom = [];
		var low = [];
		var med = [];
		var high = [];
		// for( var i = _weather.hourPrecipitation.length - 1; i >= 0; i-- )
		for( var i = 0; i < _weather.hourPrecipitation.length; i++ )
		{
			valuesx[i] = i;
			// console.log( '_weather.hourPrecipitation[i]', _weather.hourPrecipitation[i] );
			var probability = Math.round( _weather.hourPrecipitation[i].probability * 100 );
			valuesy_probability[i] = probability;
			valuesy_intensity_top[i] = _weather.hourPrecipitation[i].intensity + _weather.hourPrecipitation[i].error;
			valuesy_intensity[i] = _weather.hourPrecipitation[i].intensity;
			valuesy_intensity_bottom[i] = _weather.hourPrecipitation[i].intensity - _weather.hourPrecipitation[i].error;
			var item = '<dl class=""><dt>'+_parseTimestamp( _weather.hourPrecipitation[i].time )+'</dt><dd>'+
				probability+'% chance of '+_weather.hourPrecipitation[i].type+'<br>('
					+_weather.hourPrecipitation[i].intensity+' &plusmn;'+_weather.hourPrecipitation[i].error+')</dd></dl>';
			$( '#hourPrecipitation' ).append( item );
			low[i] = 15;
			med[i] = 30;
			high[i] = 45;
			/*
			error: 5.64
			intensity: 8.23
			probability: 0.99
			time: 1360796803
			type: "rain"
			 */
		}

		// console.log( 'valuesy_intensity', valuesy_intensity );

		var r = Raphael( "hour-intensity" );
		// r.linechart( 0, 0, 640, 480, valuesx, [valuesy_probability, valuesy_intensity_top, valuesy_intensity, valuesy_intensity_bottom], { shade: true, smooth: true });
		// r.linechart( 10, 0, 630, 470, [valuesx], [valuesy_intensity], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 4, axisystep: 3, colors: ["#2f69bf", "#2f69bf"] });
		r.linechart( 0, 0, 320, 200, [valuesx, valuesx, valuesx, [0, 59]], [valuesy_intensity, valuesy_intensity_top,  valuesy_intensity_bottom, [0, 75]], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 4, colors: ["#2f69bf", "#a2bf2f", "#bf5a2f", "transparent"] });
		r.linechart( 0, 0, 320, 200, [valuesx, [0, 59]], [low, med, high, [0, 75]], { colors: ["#2f69bf", "#a2bf2f", "#bf5a2f", "transparent"], dash: "-" });

		var r = Raphael( "day-percent" );
		r.linechart( 0, 0, 320, 200, [valuesx, [0, 59]], [valuesy_probability, [0, 100]], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 4, colors: ["#2f69bf", "transparent"] });

		valuesx = [];
		var probs = [];
		for( var i = 0; i < _weather.dayPrecipitation.length; i++ )
		{
			valuesx[i] = i;
			var probability = Math.round( _weather.dayPrecipitation[i].probability * 100 );
			probs[i] = probability;
			var item = '<dl class=""><dt>'+_weather.dayPrecipitation[i].temp+'&#176;F @ '+
			_parseTimestamp( _weather.dayPrecipitation[i].time )+'</dt><dd>'+probability+'% chance of '+
			_weather.dayPrecipitation[i].type+'<br>Cloud Cover: '+_weather.dayPrecipitation[i].cloudCover+
			'<br>Relative Humidity: '+_weather.dayPrecipitation[i].relHumidity+'</dd></dl>';
			$( '#dayPrecipitation' ).append( item );
			// console.log( $( '#dayPrecipitation' ) );
			/*
			cloudCover: 0.75
			probability: 0.07
			relHumidity: 0.55
			temp: 41
			time: 1360792800
			type: "rain"
			 */

		}
		// console.log( 'valuesx', valuesx.length );
		// console.log( 'probs', probs.length );
		var r = Raphael( "next-twenty-four-percent" );
		r.linechart( 0, 0, 320, 200, [valuesx, [0, 24]], [probs, [0, 100]], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 3, colors: ["#2f69bf", "transparent"] });
	};

	function _parseTimestamp( $timestamp )
	{
		var date = new Date( $timestamp * 1000 )
			, dateValues = [
				date.getFullYear()
				,( date.getMonth() < 10 ) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
				,( date.getDate() < 10 ) ? '0' + date.getDate() : date.getDate()
				,( date.getHours() < 10 ) ? '0' + date.getHours() : date.getHours()
				,( date.getMinutes() < 10 ) ? '0' + date.getMinutes() : date.getMinutes()
				,( date.getSeconds() < 10 ) ? '0' + date.getSeconds() : date.getSeconds()
			];
		// var dateString = dateValues[0] + "-" + dateValues[1] + "-" + dateValues[2] + " " + dateValues[3] + ":" + dateValues[4] + ":" + dateValues[5];
		var dateString = dateValues[3] + ":" + dateValues[4];
		return dateString;
	};


	// construct
	$(function()
	{
		if( window.location.hash !== "" )
		{
			_updateView( window.location.hash );
		}
	});
})();