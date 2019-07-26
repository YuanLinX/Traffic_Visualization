//'use strict';
/*
   This is for demonstrating the usage of gauge.js, it creates two gauges
   side-by-side with diffent options settings.
*/
//document.addEventListener('DOMContentLoaded', () => {

  const powerGauge = new Gauge({
      minValue: 0,
      maxValue: 180,
      lowThreshhold: 50,
      highThreshhold: 100,
	  majorTicks : 6,
      displayUnit: 'Speed km/h'
  });
  /*const powerGauge2 = new Gauge({
    lowThreshhold: 6,
    highThreshhold: 8,
    lowThreshholdColor: "#dcdcdc",
    defaultColor: "#a9a9a9",
    highThreshholdColor: "#696969"
  })*/

  powerGauge.render("#gauge1");
  //powerGauge2.render("#gauge2");

  // Generate a random reading every 3 seconds
  //setInterval(function() {
    //  powerGauge.update(Math.random()*30+20);
      //powerGauge2.update(Math.random()*10);
 // }, 2 * 1000);

//});
