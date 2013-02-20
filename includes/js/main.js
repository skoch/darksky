var Main = new(function()
{
	// static
	var _self = this;
	var _debug = false;
	var _apiKey = '';
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

		var index;
		switch( $hash )
		{
			case '#nutshell' :
				index = 0;
			break;
			case '#dayPrecipitation' :
				index = 1;
			break;
			case '#hourPrecipitation' :
				index = 2;
			break;
			case '#chart' :
				index = 3;
			break;
		}

		$($('ul').children( 'li' )[index]).addClass( 'active' );

		_updateActive( $hash );
	};

	function _clickNav( $evt )
	{
		// console.log( '$evt', $($evt.currentTarget) );
		// console.log( '$evt', $( $evt.target ).children( 'a' ).context.hash );

		var hash = $( $evt.target ).children( 'a' ).context.hash;

		_updateActive( hash );

		//nav
		$( "li" ).each(function( $i )
		{
			$(this).removeClass( 'active' )
		});

		$( $evt.currentTarget ).addClass( 'active' );

		if( hash == '#chart' )
		{
			if( $('svg').attr( 'height' ) != 1020 )
			{
				$('svg').attr( 'height', 1020 );
			};
		};
	};

	function _updateActive( $hash )
	{
		$('#hourPrecipitation').removeClass( 'active' );
		 $('#dayPrecipitation').removeClass( 'active' );
				 $('#nutshell').removeClass( 'active' );
					$('#chart').removeClass( 'active' );

					  $( $hash ).addClass( 'active' );
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
		$( '#currentTemp' ).html( _weather.currentTemp + '&#176;F' );
		$( '#currentSummary' ).html( _weather.currentSummary );
		$( '#currentIntensity' ).html( _weather.currentIntensity );
		$( '#isPrecipitating' ).html( ( _weather.isPrecipitating ) ? 'YES' : 'NO' );
		$( '#hourSummary' ).html( _weather.hourSummary );
		$( '#daySummary' ).html( _weather.daySummary );

		var update = moment().add('minutes', (_weather.checkTimeout / 60)).calendar();
		$( '#updateIn' ).html( update );
		// if( _weather.isPrecipitating )
		// {
		// 	$( '#currentSummary' ).html( _weather.currentSummary );
		// }
		// $( '#isPrecipitating dd' ).html( ( _weather.isPrecipitating ) ? 'YES' : 'NO' );
		// $( '#currentTemp dd' ).html( _weather.currentTemp + '&#176;F' );
		// $( '#currentSummary dd' ).html( _weather.currentSummary );
		// $( '#daySummary dd' ).html( _weather.daySummary );
		// $( '#hourSummary dd' ).html( _weather.hourSummary );
		// $( '#currentIntensity dd' ).html( _weather.currentIntensity );

		// var update = moment().add('minutes', (_weather.checkTimeout / 60)).calendar();
		// $( '#updateIn dd' ).html( update );

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

			// var item = '<dl class=""><dt>'+_parseTimestamp( _weather.hourPrecipitation[i].time )+'</dt><dd>'+
			// 	probability+'% chance of '+_weather.hourPrecipitation[i].type+'<br>('
			// 		+_weather.hourPrecipitation[i].intensity+' &plusmn;'+_weather.hourPrecipitation[i].error+')</dd></dl>';

			var item = '<tr><td>'+_parseTimestamp( _weather.hourPrecipitation[i].time )+'</td><td>'+probability+'%</td><td>'+_weather.hourPrecipitation[i].type+'</td><td>'+_weather.hourPrecipitation[i].intensity+' &plusmn; '+_weather.hourPrecipitation[i].error+'</td></tr>';
			$( '#hourPrecipitation tbody' ).append( item );
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

		// var r = Raphael( "hour-intensity" );
		// // r.linechart( 0, 0, 640, 480, valuesx, [valuesy_probability, valuesy_intensity_top, valuesy_intensity, valuesy_intensity_bottom], { shade: true, smooth: true });
		// // r.linechart( 10, 0, 630, 470, [valuesx], [valuesy_intensity], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 4, axisystep: 3, colors: ["#2f69bf", "#2f69bf"] });
		// r.linechart( 0, 0, 320, 200, [valuesx, valuesx, valuesx, [0, 59]], [valuesy_intensity, valuesy_intensity_top,  valuesy_intensity_bottom, [0, 75]], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 4, colors: ["#2f69bf", "#a2bf2f", "#bf5a2f", "transparent"] });
		// r.linechart( 0, 0, 320, 200, [valuesx, [0, 59]], [low, med, high, [0, 75]], { colors: ["#2f69bf", "#a2bf2f", "#bf5a2f", "transparent"], dash: "-" });

		// var r = Raphael( "day-percent" );
		// r.linechart( 0, 0, 320, 200, [valuesx, [0, 59]], [valuesy_probability, [0, 100]], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 4, colors: ["#2f69bf", "transparent"] });

		var r = Raphael( "raphael" ),
			txtattr = { font: "12px Ubuntu" };
		// r.linechart( 0, 0, 640, 480, valuesx, [valuesy_probability, valuesy_intensity_top, valuesy_intensity, valuesy_intensity_bottom], { shade: true, smooth: true });
		// r.linechart( 10, 0, 630, 470, [valuesx], [valuesy_intensity], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 4, axisystep: 3, colors: ["#2f69bf", "#2f69bf"] });

		r.text( 100, 20, "Intensity (next hour)" ).attr( txtattr );
		r.text( 100, 260, "Probability (next hour)" ).attr( txtattr );
		r.text( 100, 500, "Probability (next 24 hours)" ).attr( txtattr );
		r.text( 100, 740, "Temp (next 24 hours)" ).attr( txtattr );

		// #1
		r.linechart( -5, 20, 330, 200, [valuesx, valuesx, valuesx, [0, 59]], [valuesy_intensity, valuesy_intensity_top,  valuesy_intensity_bottom, [0, 75]], { shade: true, axis: "0 0 1 0", smooth: true, axisxstep: 4, colors: ["#2f69bf", "#a2bf2f", "#bf5a2f", "transparent"] });
		r.linechart( -5, 20, 330, 200, [valuesx, [0, 59]], [low, med, high, [0, 75]], { colors: ["#2f69bf", "#a2bf2f", "#bf5a2f", "transparent"], dash: "-" });

		// #2
		r.linechart( -5, 260, 330, 200, [valuesx, [0, 59]], [valuesy_probability, [0, 100]], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 4, axisystep: 4, colors: ["#2f69bf", "transparent"] });

		valuesx = [];
		var probs = [];
		var dayPrecipitationTemps = [];
		var dayPrecipitationTShortHour = [];
		// var table = '<table class="table table-striped">';
		// table += '<thead><tr><th>Time</th><th>Temp</th><th>Probability</th><th>Type</th><th>Humidity</th><th>Cloud Cover</th></tr></thead><tbody>';

		for( var i = 0; i < _weather.dayPrecipitation.length; i++ )
		{
			valuesx[i] = i;
			var probability = Math.round( _weather.dayPrecipitation[i].probability * 100 );
			probs[i] = probability;
			dayPrecipitationTemps[i] = _weather.dayPrecipitation[i].temp;
			var theTime = _parseTimestamp( _weather.dayPrecipitation[i].time );
			dayPrecipitationTShortHour[i] = theTime.split( ':' )[0];

			// var item = '<dl class=""><dt>'+_weather.dayPrecipitation[i].temp+'&#176;F @ '+
			// theTime+'</dt><dd>'+probability+'% chance of '+
			// _weather.dayPrecipitation[i].type+'<br>Cloud Cover: '+_weather.dayPrecipitation[i].cloudCover+
			// '<br>Relative Humidity: '+_weather.dayPrecipitation[i].relHumidity+'</dd></dl>';
			// $( '#dayPrecipitation' ).append( item );
			// table += '<tr><td>'+theTime+'</td><td>'+_weather.dayPrecipitation[i].temp+'&#176;F</td><td>'+probability+'%</td><td>'+_weather.dayPrecipitation[i].type+'</td><td>'+_weather.dayPrecipitation[i].relHumidity+'</td><td>'+_weather.dayPrecipitation[i].cloudCover+'</td></tr>';
			var item = '<tr><td>'+theTime+'</td><td>'+_weather.dayPrecipitation[i].temp+'&#176;F</td><td>'+probability+'%</td><td>'+_weather.dayPrecipitation[i].type+'</td><td>'+_weather.dayPrecipitation[i].relHumidity+'</td><td>'+_weather.dayPrecipitation[i].cloudCover+'</td></tr>';
			$( '#dayPrecipitation tbody' ).append( item );
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

		// table += '</tbody></table>';
		// $( '#dayPrecipitation' ).append( table );
		// var r = Raphael( "next-twenty-four-percent" );
		// r.linechart( 0, 0, 320, 200, [valuesx, [0, 24]], [probs, [0, 100]], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 3, colors: ["#2f69bf", "transparent"] });
		// #3
		r.linechart( -5, 500, 330, 200, [valuesx, [0, 24]], [probs, [0, 100]], { shade: true, axis: "0 0 1 1", smooth: true, axisxstep: 4, axisystep: 4, colors: ["#2f69bf", "transparent"] });

		// #4
		lines = r.linechart( 10, 740, 310, 200, [valuesx, [0, 24]], [dayPrecipitationTemps, [-10, 100]], { shade: false, axis: "0 0 1 1", smooth: true, colors: ["#bf5a2f", "transparent"] }).hoverColumn(function ()
		{
			this.tags = r.set();

			for (var i = 0, ii = this.y.length; i < ii; i++) {
				if( i == 1 ) return;// hack to not show the hidden values
				this.tags.push(r.tag(this.x, this.y[i], this.values[i], 160, 10).insertBefore(this).attr([{ fill: "#fff" }, { fill: this.symbols[i].attr("fill") }]));
			}
		}, function () {
			this.tags && this.tags.remove();
		});

		lines.symbols.attr({ r: 6 });

		var xText = lines.axis[0].text.items;
		for(var i in xText){ // Iterate through the array of dom elems, the current dom elem will be i
			// var _oldLabel = (xText[i].attr('text') + "").split('.'); // Get the current dom elem in the loop, and split it on the decimal
			// var _newLabel = _oldLabel[0] + ":" + (_oldLabel[1] == undefined ? '00' : '30'); // Format the result into time strings
			// xText[i].attr({'text': _newLabel}); // Set the text of the current elem with the result
			xText[i].attr({'text': dayPrecipitationTShortHour[i]}); // Set the text of the current elem with the result
		};



		// var xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  //           ys = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  //           data = dayPrecipitationTemps,
  //           // axisy = [""],
  //           axisx = dayPrecipitationTShortHour;

		// r.dotchart( -15, 740, 350, 200, xs, ys, data, {symbol: "o", max: 5, heat: true, axis: "0 0 1 0", axisxstep: 24, axisystep: 1, axisxlabels: axisx, axisxtype: " "}).hover(function () {
  //           this.marker = this.marker || r.tag(this.x, this.y, this.value, 0, this.r + 2).insertBefore(this);
  //           this.marker.show();
  //       }, function () {
  //           this.marker && this.marker.hide();
  //       });
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