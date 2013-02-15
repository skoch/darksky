<?php
	define( 'IS_DEBUG', false );
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Dark Sky Weather API</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="includes/css/vendor/bootstrap.css" rel="stylesheet">
    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
      .hide
      {
        display: none;
      }
      #chart-div
      {
        /*-moz-border-radius: 10px;
        -webkit-border-radius: 10px;*/
        -webkit-box-shadow: 0 1px 3px #666;
        /*background: #ddd url(http://raphaeljs.com/images/bg.png);*/
        /*margin: 0 auto;*/
        width: 320px;
        height: 220px;
        position: relative;
        left: -20px;
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
              <li><a href="#hourly">Hourly</a></li>
              <li><a href="#day">Day</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

	<div class="container-fluid">

		<div class="row-fluid">
			<div id="nutshell" class="span5">
        <div id="chart-div"></div>
        <dl id="updateIn">
          <dt>Refresh at</dt>
          <dd></dd>
        </dl>
				<dl id="isPrecipitating">
					<dt>Precipitation</dt>
					<dd></dd>
				</dl>
				<dl id="currentTemp">
					<dt>Current Temp</dt>
					<dd></dd>
				</dl>
				<dl id="currentSummary">
					<dt>Current Summary</dt>
					<dd></dd>
				</dl>
				<dl id="daySummary">
					<dt>Day Summary</dt>
					<dd></dd>
				</dl>
				<dl id="hourSummary">
					<dt>Hour Summary</dt>
					<dd></dd>
				</dl>
        <dl id="currentIntensity">
          <dt>Current Intensity</dt>
          <dd></dd>
        </dl>
				<dl id="intensityExplanation">
					<dt>Intensity Values</dt>
					<dd>0-2: None</dd><dd>2-15: Sporadic</dd><dd>15-30: Light</dd><dd>30-45: Moderate</dd><dd>45-75: Heavy</dd>
				</dl>
			</div>
      <div id="day" class="span5 hide">
        <!-- <div id="dayPrecipitation"></div> -->
      </div>
			<div id="hourly" class="span5 hide">
				<!-- <div id="hourPrecipitation"></div> -->
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
