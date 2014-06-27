L.Control.SliderControl = L.Control.extend({
  options: {
    position: 'topright',
    layers: null,
    maxValue: -1,
    minValue: -1,
    startTime: -1,
    endTime: -1,
    timeStep: 3600,
    range: false
  },

  initialize: function(options) {
    L.Util.setOptions(this, options);

    // Initialize variables
    this._layer = null;
    this.multilayer = false;

    // Start and ending times are split into a number of slider positions based on number of milliseconds
    // requested to separate each position
    this._begin_time = new Date(options.startTime);
    this._final_time = new Date(options.endTime);
    
    // assume timeStep is in seconds and turn into microseconds
    this.options.timeStep = this.options.timeStep * 1000;
    
    // Check for multiple layers passed to SliderControl
    if (this.options.layers == null) {
      this._layer = this.options.layer;
      this.multilayer = false;
    } else {
      this._layer = this.options.layers;
      this.multilayer = true;
    }
  },

  setPosition: function(position) {
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
  
  createSliderUI: function() {
    // Create a control sliderContainer with a jquery ui slider
    var sliderContainer = L.DomUtil.create('div', 'ui-slider-container', this._container);
    
    this._slider = $('<div class="ui-slider"><div class="ui-slider-handle"></div></div>');
    $(sliderContainer).append(this._slider);
    this._sliderTimestamp = $('<div class="ui-slider-timestamp"></div>');
    $(sliderContainer).append(this._sliderTimestamp);
    
    return sliderContainer;
  },

  onAdd: function(map) {
    this.options.map = map;

    var sliderContainer = this.createSliderUI();
    // Prevent map panning/zooming while using the slider
    $(sliderContainer).mousedown(function() {
      map.dragging.disable();
    });
    $(document).mouseup(function() {
      map.dragging.enable();
    });
    
    // Make sure a layer has been passed before creating a slider
    if (!this._layer) {
      console.log("Error: You must specify a layer via new SliderControl({layer: your_layer}); or like SliderControl({layers: [your_layer1, your_layer2]});");
    }
    return sliderContainer;
  },

  onRemove: function(map) {
    map.removeLayer(this._layer);
    $(this._slider).remove();
  },

  updateLayer: function(timestamps) {
    timestamp = timestamps[0] + '/' + timestamps[1];
    
    if (this.multilayer == true) {
      for (var i = 0; i < this._layer.length; i++) {
        this._layer[i].setParams({
          time: timestamp
        });
      }
    } else {
      this._layer.setParams({
        time: timestamp
      });
    }
  },
  
  updateTimestamp: function(timestamps) {
    $(this._sliderTimestamp).html(timestamps[0] + ' - ' + timestamps[1]);
  },
  
  buildTimestamp: function(start, end) {
    this._timerange1 = new Date(this._begin_time.getTime() + (start * this.options.timeStep));
    this._timerange2 = new Date(this._begin_time.getTime() + (end * this.options.timeStep));
    
    return [this._timerange1.toISOString(), this._timerange2.toISOString()];
  },

  startSlider: function() {
    var me = this;
    var timesteps = Math.round((me._final_time - me._begin_time) / me.options.timeStep);
    
    $(me._slider).slider({
      range: me.options.range,
      min: 0,
      max: timesteps,
      step: 1,
      slide: function(e, ui) {
        if (me.options.range) {
          me.updateTimestamp(me.buildTimestamp(ui.values[0], ui.values[1]));
        } else {
          me.updateTimestamp(me.buildTimestamp(ui.value, ui.value+1));
        }
      },
      stop: function(e, ui) {
        if (me.options.range) {
          me.updateLayer(me.buildTimestamp(ui.values[0], ui.values[1]));
        } else {
          me.updateLayer(me.buildTimestamp(ui.value, ui.value+1));
        }
      }
    });
    me.updateTimestamp(me.buildTimestamp(0,1));
    me.updateLayer(me.buildTimestamp(0,1));
  }
});

L.control.sliderControl = function(options) {
  return new L.Control.SliderControl(options);
};