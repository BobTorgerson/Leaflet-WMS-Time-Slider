Leaflet-WMS-Time-Slider
=============

The [Leaflet](http://leafletjs.com/) WMS Time Slider enables you to dynamically update a WMS layer based on a dimension such as time. This tool uses the [JQuery UI slider
](http://jqueryui.com/slider/). For WMS layers where a range of time is more desirable than a single time step, two sliders appear to allow for a tailored time range to be created.

View the example on [GitHub Pages](http://bobtorgerson.github.io/Leaflet-WMS-Time-Slider/)

Usage
-----
Add:
* ``SliderControl.js``
* [JQuery](http://code.jquery.com/jquery-1.9.1.min.js)
* [JQueryUI - CSS](http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css)
* [JQueryUI - JS](http://code.jquery.com/ui/1.9.2/jquery-ui.js)

to your normal Leaflet map.


To enable the Slider on your map, you must pass in a WMS layer to the SliderControl object.
The Slider appears after the method startSlider() is called on the SliderControl object.

The Slider is initialized with the following options:

* **position:** A location on the map panel for the slider bar to be drawn.

* **layer:** The layer to be affected by the time slider.

* **startTime:** The start time of the slider in time format ISO8601

* **endTime:** The end time of the slider in time format ISO8601.

* **timeStep:** The amount of time to jump forward for each movement of the slider bar in milliseconds.

* **range:** Boolean for determining if a range of time is desired rather than a single time value.

```javascript
// Create a WMS layer with a known time dimension available 
var hurricane = L.tileLayer.wms('http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi', {
	layers: 'nexrad-n0r-wmst',
	transparent: true,
	format: 'image/png',
	time: '2005-08-29T00:00:00' 
}).addTo(Map);

// Initialize the SliderControl with the WMS layer, a start time, an end time, and time step
var sliderControl = L.control.sliderControl({position: 'topright', layer: hurricane, startTime: '2005-08-29T00:00:00', endTime: '2005-08-30T15:00:00', timeStep: 1000*60*60});

// Add the slider to the map
map.addControl(sliderControl);

// Start the slider
sliderControl.startSlider();
````

Either a String or Time object can be passed to the Slider Control to initialize the start and end time
```javascript
var startTime = '2005-08-29T00:00:00';
var endTime = new Date('2005-08-30T15:00:00');

var sliderControl = L.control.sliderControl({position: 'topright', layer: hurricane, startTime: startTime, endTime: endTime, timeStep: 1000*60*60});

````

Should your WMS layer need to have a range for time, specify range: true to create the slider with a slider at both ends to allow for customization of time range desired.
```javascript
var sliderControl = L.control.sliderControl({position: 'topright', layer: hurricane, startTime: '2005-08-29T00:00:00', endTime: '2005-08-30T15:00:00', timeStep: 1000*60*60, range: true});
````

Should you have two or more WMS layers that you want to have affected by the time slider, use the option "layers" rather than "layer" and pass an array of WMS Tilelayers.
```javascript
var sliderControl = L.control.sliderControl({position: 'topright', layers: [hurricane, ocean_currents], startTime: '2005-08-29T00:00:00', endTime: '2005-08-30T15:00:00', timeStep: 1000*60*60});
````

For touch support add:
```javascript
<script src="//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.2/jquery.ui.touch-punch.min.js"></script>
````

Bower
----
Leaflet WMS Time Slider can be integrated into your project using [Bower](http://bower.io/) (based on [nodejs](http://nodejs.org/)). Run the following to include the LWDS code in your project:
```
npm install -g bower
bower install git://github.com/BobTorgerson/Leaflet-WMS-Time-Slider.git
```




Author
-----
Bob Torgerson, 2014

Code forked from Dennis Wilhelm, 2013
