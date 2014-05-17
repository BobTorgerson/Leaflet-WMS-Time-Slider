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

	// Initialize variables
	this._layer = null;
	this.multilayer = false;

	// Check for multiple layers passed to SliderControl
	if (this.options.layers == null) { 
        	this._layer = this.options.layer;
		this.multilayer = false;
	} else {
		this._layer = this.options.layers;
		this.multilayer = true;
	}
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
        $(sliderContainer).append('<div id="leaflet-slider" style="width:200px"><div class="ui-slider-handle"></div><div id="slider-timestamp" style="width:200px; border-top: 1px solid black; margin-top:10px;background-color:#FFFFFF"></div></div>');
        // Prevent map panning/zooming while using the slider
        $(sliderContainer).mousedown(function () {
            map.dragging.disable();
        });
        $(document).mouseup(function () {
            map.dragging.enable();
        });

        var options = this.options;

        // Make sure a layer has been passed before creating a slider
        if (!this._layer) {
            console.log("Error: You have to specify a layer via new SliderControl({layer: your_layer}); or like SliderControl({layers: [your_layer1, your_layer2]});");
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

	// Current position of the slider  
	var curTime = new Date(options.startTime);
	if (options.range) {
	   // If a range, this is the second position for the slider
	   var curTime2 = new Date(options.startTime);
	}
	
	// Start and ending times are split into a number of slider positions based on number of milliseconds
	// requested to separate each position
	var beginTime = new Date(options.startTime);
	var finalTime = new Date(options.endTime);
	var timesteps = Math.round((finalTime - beginTime) / options.timeStep);

	// Check for multiple layers passed to Slider Control
	var multilayer = this.multilayer;

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
			curTime.setTime(beginTime.getTime() + (ui.values[0] * options.timeStep));
			curTime2.setTime(beginTime.getTime() + (ui.values[1] * options.timeStep));
			var timeString = curTime.toISOString() + "/" + curTime2.toISOString();

			// Leaflet's TileLayer's setParams function re-requests tiles based upon the new parameters
			if (multilayer == true) {
				for (var i = 0; i < curLayer.length; i++) {
					curLayer[i].setParams({time: timeString});
				}
			} else {
				curLayer.setParams({time: timeString});
			}
		} else {
			curTime.setTime(beginTime.getTime() + (ui.value * options.timeStep));
			var timeString = curTime.toISOString();

			// Leaflet's TileLayer's setParams function re-requests tiles based upon the new parameters
			if (multilayer == true) {
				for (var i = 0; i < curLayer.length; i++) {
					curLayer[i].setParams({time: timeString});
				}
			} else {
				curLayer.setParams({time: timeString});
			}
		}
            }
	});
	$('#slider-timestamp').html(curTime.toISOString());
    }
});

L.control.sliderControl = function (options) {
    return new L.Control.SliderControl(options);
};
