L.Control.SliderControl = L.Control.extend({
    options: {
        position: 'topright',
        layers: null,
        maxValue: -1,
        minValue: -1,
	startTime: -1,
	endTime: -1,
	timeStep: 5000,
        range: false
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._layer = this.options.layer;
	this.slider = null;
        
    },

    setPosition: function (position) {
        var map = this._map;

        if (map) {
            map.removeControl(this);
        }

        this.options.position = position;

        if (map) {
            map.addControl(this);
        }
        this.startSlider();
        return this;
    },

    onAdd: function (map) {
        this.options.map = map;

        // Create a control sliderContainer with a jquery ui slider
        var sliderContainer = L.DomUtil.create('div', 'slider', this._container);
        $(sliderContainer).append('<div id="leaflet-slider" style="width:200px"><div class="ui-slider-handle"></div><div id="slider-timestamp" style="width:200px; margin-top:10px;background-color:#FFFFFF"></div></div>');
        //Prevent map panning/zooming while using the slider
        $(sliderContainer).mousedown(function () {
            map.dragging.disable();
        });
        $(document).mouseup(function () {
            map.dragging.enable();
        });

        var options = this.options;

        //If a layer has been provided: calculate the min and max values for the slider
        if (!this._layer) {
            console.log("Error: You have to specify a layer via new SliderControl({layer: your_layer});");
        }
        return sliderContainer;
    },

    onRemove: function (map) {
        map.removeLayer(this._layer);
        $('#leaflet-slider').remove();
    },

    startSlider: function () {
        options = this.options;
	var curLayer  = this._layer;
	var curTime = new Date(options.startTime);
	if (options.range) {
	   var curTime2 = new Date(options.startTime);
	}
	var beginTime = new Date(options.startTime);
	var finalTime = new Date(options.endTime);
	var timesteps = Math.round((finalTime - beginTime) / options.timeStep);
        $("#leaflet-slider").slider({
            range: options.range,
	    min: 0,
	    max: timesteps,
            step: 1,
	    slide: function (e, ui) {
		var map = options.map;

		if (options.range) {
			curTime.setTime(beginTime.getTime() + (ui.values[0] * options.timeStep));
			curTime2.setTime(beginTime.getTime() + (ui.values[1] * options.timeStep));
			var timeString = curTime.toISOString() + " - " + curTime2.toISOString();
                        $('#slider-timestamp').html(timeString);
		} else {
			curTime.setTime(beginTime.getTime() + (ui.value * options.timeStep));
			var timeString = curTime.toISOString();
                        $('#slider-timestamp').html(timeString);
	        }
            },
            stop: function (e, ui) {
                var map = options.map;

		if (options.range) {
			// Options range is true
			curTime.setTime(beginTime.getTime() + (ui.values[0] * options.timeStep));
			curTime2.setTime(beginTime.getTime() + (ui.values[1] * options.timeStep));
			var timeString = curTime.toISOString() + "/" + curTime2.toISOString();
			curLayer.setParams({time: timeString});
		} else {
			curTime.setTime(beginTime.getTime() + (ui.value * options.timeStep));
			var timeString = curTime.toISOString();
			curLayer.setParams({time: timeString});
		}
            }
	});
	$('#slider-timestamp').html(curTime.toISOString());
    }
});

L.control.sliderControl = function (options) {
    return new L.Control.SliderControl(options);
};
