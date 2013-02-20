<?php
	define( 'IS_DEBUG', true );
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Dark Sky Weather API</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- <link href='http://fonts.googleapis.com/css?family=Russo+One' rel='stylesheet' type='text/css'> -->
    <link href='http://fonts.googleapis.com/css?family=Ubuntu:300,700' rel='stylesheet' type='text/css'>

    <!-- Le styles -->
    <link href="includes/css/vendor/bootstrap.css" rel="stylesheet">
    <style>
      body {
        background-color: #f9f9f9;
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
        font-family: 'Ubuntu', sans-serif;
      }
      .google-fontify
      {
        font-weight: 300;
        font-size: 20px;
      }
      #raphael
      {
        background-color: #fff;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        -webkit-box-shadow: 0 1px 3px #666;
        width: 320px;
        height: 1020px;
        position: relative;
        left: -20px;
      }
      #dayPrecipitation,
      #hourPrecipitation
      {
        font-size: 13px;
        left: -23px;
      }
      .tab-raphael
      {
        display: block !important;
        position: absolute;
        top: -9999px;
      }
      .tab-raphael.active
      {
        position: relative;
        top: 0;
      }
      .table td
      {
         text-align: center;
      }
      .table-striped tbody > tr:nth-child(odd) > td, .table-striped tbody > tr:nth-child(odd) > th {
        background-color: #fff;
      }
    </style>

    <link href="includes/css/vendor/bootstrap-responsive.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="includes/js/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="includes/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="includes/ico/apple-touch-icon-114-precomposed.png">
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href="includes/ico/apple-touch-icon-72-precomposed.png">
                    <link rel="apple-touch-icon-precomposed" href="includes/ico/apple-touch-icon-57-precomposed.png">
                                   <link rel="shortcut icon" href="includes/ico/favicon.png">
  </head>

  <body>

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="brand" href="#">Dark Sky Weather API</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="active"><a href="#nutshell">Nutshell</a></li>
              <li><a href="#dayPrecipitation">Next 24 Hours</a></li>
              <li><a href="#hourPrecipitation">Next Hour</a></li>
              <li><a href="#chart">Charts</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

	<div class="container-fluid">

		<div class="row-fluid google-fontify">
      <div id="nutshell" class="text-center tab-raphael span3 active">
        <div id="now">
          <h2>NOW</h2>
          <p id="currentTemp"></p>
          <p id="currentSummary"></p>
        </div>

        <hr>

        <div id="next-hour">
          <h2>NEXT HOUR</h2>
          <p id="hourSummary"></p>
        </div>

        <hr>

        <div id="">
          <h3>INTENSITY</h3>
          <p id="currentIntensity"></p>
        </div>

        <hr>

        <div id="">
          <h3>DAY SUMMARY</h3>
          <p id="daySummary"></p>
        </div>

        <hr>

        <div id="">
          <h4>REFRESH</h4>
          <p id="updateIn"></p>
        </div>

        <hr>

        <div id="">
          <h4>PRECIPITATION</h4>
          <p id="isPrecipitating"></p>
        </div>

        <hr>

        <div id="">
          <h4>INTENSITY VALUES</h4>
          <p id="intensityExplanation">
            0-2: None<br>
            2-15: Sporadic<br>
            15-30: Light<br>
            30-45: Moderate<br>
            45-75: Heavy
          </p>
        </div>
      </div>
      <div id="dayPrecipitation" class="tab-raphael span3">
        <table class="table table-striped table-condensed text-center">
          <thead><tr><th>Time</th><th>Temp</th><th>Probability</th><th>Type</th><th>Humidity</th><th>Clouds</th></tr></thead>
          <tbody>
          </tbody>
        </table>
      </div>
      <div id="hourPrecipitation" class="tab-raphael span3">
        <table class="table table-striped table-condensed text-center">
          <thead><tr><th>Time</th><th>Probability</th><th>Type</th><th>Intensity (error)</th></tr></thead>
          <tbody>
          </tbody>
        </table>
      </div>
			<div id="chart" class="tab-raphael span3">
        <div id="raphael"></div>
        <!-- <div id="hour-intensity"></div>
        <div id="next-twenty-four-percent"></div>
        <div id="day-percent"></div> -->
			</div>
		</div>

    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>
    <!-- <script src="//raphaeljs.com/raphael.js"></script> -->
    <!--
    <script src="includes/js/vendor/bootstrap-transition.js"></script>
    <script src="includes/js/vendor/bootstrap-alert.js"></script>
    <script src="includes/js/vendor/bootstrap-modal.js"></script>
    <script src="includes/js/vendor/bootstrap-dropdown.js"></script>
    <script src="includes/js/vendor/bootstrap-scrollspy.js"></script>
    <script src="includes/js/vendor/bootstrap-tab.js"></script>
    <script src="includes/js/vendor/bootstrap-tooltip.js"></script>
    <script src="includes/js/vendor/bootstrap-popover.js"></script>
    <script src="includes/js/vendor/bootstrap-button.js"></script>

    <script src="includes/js/vendor/bootstrap-carousel.js"></script>
    <script src="includes/js/vendor/bootstrap-typeahead.js"></script>
    -->
    <script src="includes/js/vendor/bootstrap-collapse.js"></script>
    <script src="includes/js/vendor/raphael-min.js"></script>
    <script src="includes/js/vendor/g.raphael-min.js"></script>
    <!-- <script src="includes/js/vendor/g.pie-min.js"></script> -->
    <script src="includes/js/vendor/g.line-min.js"></script>
    <script src="includes/js/vendor/g.dot-min.js"></script>
    <script src="includes/js/vendor/moment.min.js"></script>
<?php if( IS_DEBUG ): ?>
    <script src="includes/js/main.js"></script>
<?php else: ?>
    <script src="includes/js/main.min.js"></script>
<?php endif; ?>

  	<script>
  		jQuery(function()
  		{
        Main.init( "<?= (IS_DEBUG) ? 'debug' : 'live'; ?>" );
  		});
  	</script>
  </body>
</html>
