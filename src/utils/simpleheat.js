/* eslint-disable */
'use strict';
export default simpleheat;

function simpleheat(canvas) {
  if (!(this instanceof simpleheat)) return new simpleheat(canvas);

  this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

  this._ctx = canvas.getContext('2d');
  this._width = canvas.width;
  this._height = canvas.height;

  this._max = 1;
  this._gridSquares = 512;
  this._useLogScale = false;
  this._radiusMultiplier = 2;
  this._ignoredValue = 0.03;
  this._data = [];
}

simpleheat.prototype = {
  defaultRadius: 25,

  data: function (data) {
    this._data = data;
    return this;
  },

  gridSquares: function (gridSquares) {
    this._gridSquares = gridSquares;
    return this;
  },

  useLogScale: function (useLogScale) {
    this._useLogScale = useLogScale;
    return this;
  },

  ignore: function (ignoredValue) {
    this._ignoredValue = ignoredValue;
    return this;
  },

  max: function (max) {
    this._max = max;
    return this;
  },

  add: function (point) {
    this._data.push(point);
    return this;
  },

  clear: function () {
    this._data = [];
    return this;
  },

  resize: function () {
    this._width = this._canvas.width;
    this._height = this._canvas.height;
  },

  radius: function (r, blur) {
    blur = blur === undefined ? 5 : blur;

    r *= this._radiusMultiplier;
    blur *= this._radiusMultiplier;

    // create a grayscale blurred circle image that we'll use for drawing points
    var circle = (this._circle = this._createCanvas()),
      ctx = circle.getContext('2d'),
      r2 = (this._r = r + blur);

    circle.width = circle.height = r2 * 2;

    ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
    ctx.shadowBlur = blur;
    ctx.shadowColor = 'black';

    ctx.beginPath();
    ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    return this;
  },

  radiusMultiplier: function (multiplier) {
    this._radiusMultiplier = multiplier;
    return this;
  },

  gradient: function (grad) {
    // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
    var canvas = this._createCanvas(),
      ctx = canvas.getContext('2d'),
      gradient = ctx.createLinearGradient(0, 0, 0, 256);

    canvas.width = 1;
    canvas.height = 256;

    for (var i in grad) {
      gradient.addColorStop(+i, grad[i]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);

    this._grad = ctx.getImageData(0, 0, 1, 256).data;

    return this;
  },

  draw: function (minOpacity) {
    var ctx = this._ctx;
    ctx.clearRect(0, 0, this._width, this._height);
    var gridSize = Math.max(ctx.canvas.width, ctx.canvas.height) / this._gridSquares;

    var grid = [];
    for (var i = 0; i < this._gridSquares; i++) {
      grid[i] = new Array(this._gridSquares).fill(0);
    }
    for (var i = 0, len = this._data.length, p; i < len; i++) {
      p = this._data[i];
      var gridX = Math.floor(p[0] / gridSize);
      var gridY = Math.floor(p[1] / gridSize);
      grid[gridX][gridY] += p[2];
    }

    let min = Infinity;
    // find min value in grid not including 0
    for (var i = 0; i < this._gridSquares; i++) {
      for (var j = 0; j < this._gridSquares; j++) {
        if (grid[i][j] === 0) {
          continue;
        }
        min = Math.min(min, grid[i][j]);
      }
    }

    // make sure min is at least 1
    let scaleFactor = 1 / min;
    for (var i = 0; i < this._gridSquares; i++) {
      for (var j = 0; j < this._gridSquares; j++) {
        grid[i][j] *= scaleFactor;
      }
    }

    // Use logarithmic scale if _useLogScale is true
    // use log base 10
    // log(0) is undefined, so we set it to 0
    if (this._useLogScale) {
      for (var i = 0; i < this._gridSquares; i++) {
        for (var j = 0; j < this._gridSquares; j++) {
          grid[i][j] = Math.log10(grid[i][j] || 1);
        }
      }
    }

    var maxGridValue = 0;
    var minGridValue = Number.MAX_VALUE;
    for (var i = 0; i < this._gridSquares; i++) {
      for (var j = 0; j < this._gridSquares; j++) {
        maxGridValue = Math.max(maxGridValue, grid[i][j]);
        minGridValue = Math.min(minGridValue, grid[i][j]);
      }
    }

    // set radius based on grid size
    this.radius(gridSize, gridSize);
    this.gradient(this.defaultGradient); // Set gradient colors

    for (var i = 0; i < this._gridSquares; i++) {
      for (var j = 0; j < this._gridSquares; j++) {
        if (grid[i][j] === 0) {
          continue;
        }

        // Normalize value to be between 0 and 1
        // v = (x - min) / (max - min)
        var normalizedValue = (grid[i][j] - minGridValue) / (maxGridValue - minGridValue);

        // Don't draw colors if cell value is less than 0.1
        if (normalizedValue <= this._ignoredValue) {
          continue;
        }

        ctx.globalAlpha = Math.min(Math.max(normalizedValue, minOpacity === undefined ? 0.05 : minOpacity), 1);
        ctx.drawImage(this._circle, i * gridSize - this._r, j * gridSize - this._r);
      }
    }

    // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
    var colored = ctx.getImageData(0, 0, this._width, this._height);
    this._colorize(colored.data, this._grad);
    ctx.putImageData(colored, 0, 0);

    return this;
  },

  _colorize: function (pixels, gradient) {
    for (var i = 0, len = pixels.length, j; i < len; i += 4) {
      j = pixels[i + 3] * 4; // get gradient color from opacity value

      if (j) {
        pixels[i] = gradient[j];
        pixels[i + 1] = gradient[j + 1];
        pixels[i + 2] = gradient[j + 2];
      }
    }
  },

  defaultGradient: {
    0.2: 'darkblue',
    0.3: 'mediumblue',
    0.4: 'blue',
    0.5: 'deepskyblue',
    0.55: 'lightcyan',
    0.6: 'cyan',
    0.65: 'paleturquoise',
    0.7: 'lime',
    0.75: 'yellowgreen',
    0.8: 'yellow',
    0.85: 'gold',
    0.9: 'darkorange',
    0.95: 'orangered',
    1.0: 'red',
  },

  _createCanvas: function () {
    if (typeof document !== 'undefined') {
      return document.createElement('canvas');
    } else {
      // create a new canvas instance in node.js
      // the canvas class needs to have a default constructor without any parameter
      return new this._canvas.constructor();
    }
  },
};
