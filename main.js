(function() {
  var DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH, array2canvas, bgr, blackWhite, blue, brg, canvas2canvas, clamp, copyCanvas, dlog, doFilter, flip, gbr, getCanvasToolbox, grb, green, image2canvas, makeCanvas, makeCanvasLike, makeCanvasToolbox, makeCanvasToolboxLike, mirror, moreAlpha, moreBlue, moreGreen, moreRed, neg, nonBlock, nonBlockIf, nothing, rbg, red, rgb, rotateLeft, rotateRight, sepia, simpleCopyCanvas, _DEBUG_;
  var __slice = Array.prototype.slice;
  DEFAULT_CANVAS_WIDTH = 360;
  DEFAULT_CANVAS_HEIGHT = 240;
  _DEBUG_ = true;
  dlog = function(msg) {
    if (_DEBUG_) {
      return console.log(msg);
    }
  };
  nonBlock = function() {
    var callback, parameters;
    callback = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return window.setTimeout.apply(window, [callback, 0].concat(__slice.call(parameters)));
  };
  nonBlockIf = function() {
    var callback, f, parameters;
    f = arguments[0], callback = arguments[1], parameters = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (f) {
      if (callback) {
        return nonBlock.apply(null, [f].concat(__slice.call(parameters)));
      } else {
        return f();
      }
    } else {
      return false;
    }
  };
  getCanvasToolbox = function(c) {
    var context, imageData, pixels;
    context = c.getContext('2d');
    imageData = context.getImageData(0, 0, c.width, c.height);
    pixels = imageData.data;
    return [context, imageData, pixels];
  };
  clamp = function(v, min, max) {
    if (min == null) {
      min = 0;
    }
    if (max == null) {
      max = 255;
    }
    if (v >= min) {
      if (v >= max) {
        return max;
      } else {
        return v;
      }
    } else {
      return min;
    }
  };
  makeCanvas = function(width, height, id) {
    var c;
    if (width == null) {
      width = DEFAULT_CANVAS_WIDTH;
    }
    if (height == null) {
      height = DEFAULT_CANVAS_HEIGHT;
    }
    c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    if (id) {
      c.setAttribute('id', id);
    }
    return c;
  };
  makeCanvasToolbox = function(width, height, id) {
    var c, toolbox;
    c = makeCanvas(width, height, id);
    toolbox = getCanvasToolbox(c);
    toolbox.unshift(c);
    return toolbox;
  };
  makeCanvasLike = function(c, id) {
    if (id == null) {
      id = true;
    }
    if (typeof id === 'boolean') {
      if (id === true) {
        id = c.getAttribute('id');
      } else {
        id = void 0;
      }
    }
    return makeCanvas(c.width, c.height, id);
  };
  makeCanvasToolboxLike = function(c, id) {
    var toolbox;
    c = makeCanvasLike(c, id);
    toolbox = getCanvasToolbox(c);
    toolbox.unshift(c);
    return toolbox;
  };
  simpleCopyCanvas = function(c, callback, width, height) {
    var f;
    if (width == null) {
      width = c.width;
    }
    if (height == null) {
      height = c.height;
    }
    f = function() {
      var c2, c2_ctx, c_ctx, _ref;
      c_ctx = c.getContext('2d');
      _ref = makeCanvasToolbox(width, height), c2 = _ref[0], c2_ctx = _ref[1];
      c2_ctx.drawImage(c, 0, 0, width, height);
      nonBlockIf(callback, callback, c2);
      return c2;
    };
    return nonBlockIf(f, callback);
  };
  canvas2canvas = copyCanvas = function(c, callback, width, height) {
    return simpleCopyCanvas(c, callback, width, height);
  };
  image2canvas = function(img, callback) {
    var f;
    f = function() {
      var c, c_ctx;
      if (img.width && img.height) {
        c = makeCanvas();
        c_ctx = c.getContext('2d');
        c.width = img.width;
        c.height = img.height;
        c_ctx.drawImage(img, 0, 0);
        nonBlockIf(callback, callback, c);
        return c;
      } else {
        if (callback) {
          return img.onload(function() {
            return drawImage2Canvas(img, callback);
          });
        } else {
          return false;
        }
      }
    };
    return nonBlockIf(f, callback);
  };
  array2canvas = function(a, w, h, callback) {
    var f;
    dlog('in array to canvas');
    f = function() {
      var c, c_ctx, c_imgd, c_pixels, i, _ref;
      dlog('in array to canvas function');
      _ref = makeCanvasToolbox(w, h), c = _ref[0], c_ctx = _ref[1], c_imgd = _ref[2], c_pixels = _ref[3];
      i = 0;
      while (i < c_pixels.length) {
        c_pixels[i] = a[i];
        i = i + 1;
      }
      c_ctx.putImageData(c_imgd, 0, 0);
      nonBlockIf(callback, callback, c);
      return c;
    };
    return nonBlockIf(f, callback);
  };
  rotateRight = function(c, callback) {
    var f;
    f = function() {
      var c2, c2_ctx, _ref;
      _ref = makeCanvasToolbox(c.height, c.width), c2 = _ref[0], c2_ctx = _ref[1];
      c2_ctx.rotate(90 * Math.PI / 180);
      c2_ctx.drawImage(c, 0, c.height * -1);
      nonBlockIf(callback, callback, c2);
      return c2;
    };
    return nonBlockIf(f, callback);
  };
  rotateLeft = function(c, callback) {
    var f;
    f = function() {
      var c2, c2_ctx, _ref;
      _ref = makeCanvasToolbox(c.height, c.width), c2 = _ref[0], c2_ctx = _ref[1];
      c2_ctx.rotate(-90 * Math.PI / 180);
      c2_ctx.drawImage(c, c.width * -1, 0);
      nonBlockIf(callback, callback, c2);
      return c2;
    };
    return nonBlockIf(f, callback);
  };
  flip = function(c, callback) {
    var f;
    f = function() {
      var c2, c2_ctx, _ref;
      _ref = makeCanvasToolbox(c.width, c.height), c2 = _ref[0], c2_ctx = _ref[1];
      c2_ctx.rotate(Math.PI);
      c2_ctx.drawImage(c, c.width * -1, c.height * -1);
      nonBlockIf(callback, callback, c2);
      return c2;
    };
    return nonBlockIf(f, callback);
  };
  mirror = function(c, callback) {
    var f;
    f = function() {
      var c2, c2_ctx, _ref;
      _ref = makeCanvasToolbox(c.width, c.height), c2 = _ref[0], c2_ctx = _ref[1];
      c2_ctx.translate(c2.width / 2, 0);
      c2_ctx.scale(-1, 1);
      c2_ctx.drawImage(c, (c2.width / 2) * -1, 0);
      nonBlockIf(callback, callback, c2);
      return c2;
    };
    return nonBlockIf(f, callback);
  };
  doFilter = function(c, filter, callback) {
    var f;
    f = function() {
      var a, b, c2, c_ctx, c_imgd, c_pixels, current_pixel_i, g, height, r, u8, width, x, y, _ref, _ref2, _ref3;
      dlog('in filter function');
      dlog(callback);
      dlog(filter);
      _ref = [c.width, c.height], width = _ref[0], height = _ref[1];
      _ref2 = getCanvasToolbox(c), c_ctx = _ref2[0], c_imgd = _ref2[1], c_pixels = _ref2[2];
      u8 = new Uint8Array(new ArrayBuffer(c_pixels.length));
      y = 0;
      while (y < height) {
        x = 0;
        while (x < width) {
          current_pixel_i = (y * width + x) * 4;
          r = current_pixel_i;
          g = current_pixel_i + 1;
          b = current_pixel_i + 2;
          a = current_pixel_i + 3;
          _ref3 = filter(c_pixels[r], c_pixels[g], c_pixels[b], c_pixels[a], c, current_pixel_i), u8[r] = _ref3[0], u8[g] = _ref3[1], u8[b] = _ref3[2], u8[a] = _ref3[3];
          x = x + 1;
        }
        y = y + 1;
      }
      c2 = array2canvas(u8, width, height);
      dlog('NEXT TRY');
      dlog(callback);
      nonBlockIf(callback, callback, c2);
      return c2;
    };
    dlog('IN DO FILTER');
    return nonBlockIf(f, callback);
  };
  blackWhite = function(c, callback) {
    var filter;
    filter = function(r, g, b, a) {
      var factor;
      factor = (r * 0.3) + (g * 0.59) + (b * 0.11);
      return [factor, factor, factor, a];
    };
    return doFilter(c, filter, callback);
  };
  nothing = function(c, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [r, g, b, a];
    }), callback);
  };
  red = function(c, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [r, 0, 0, a];
    }), callback);
  };
  green = function(c, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [0, g, 0, a];
    }), callback);
  };
  blue = function(c, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [0, 0, b, a];
    }), callback);
  };
  moreRed = function(c, m, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [clamp(r * m), g, b, a];
    }), callback);
  };
  moreGreen = function(c, m, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [r, clamp(g * m), b, a];
    }), callback);
  };
  moreBlue = function(c, m, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [r, g, clamp(b * m), a];
    }), callback);
  };
  moreAlpha = function(c, m, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [r, g, b, clamp(a * m)];
    }), callback);
  };
  neg = function(c, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [clamp(255 - r), clamp(255 - g), clamp(255 - b), a];
    }), callback);
  };
  rgb = nothing;
  rbg = function(c, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [r, b, g, a];
    }), callback);
  };
  bgr = function(c, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [b, g, r, a];
    }), callback);
  };
  brg = function(c, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [b, r, g, a];
    }), callback);
  };
  gbr = function(c, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [g, b, r, a];
    }), callback);
  };
  grb = function(c, callback) {
    return doFilter(c, (function(r, g, b, a) {
      return [g, r, b, a];
    }), callback);
  };
  sepia = function(c, callback) {
    var filter;
    filter = function(r, g, b, a) {
      var b2, g2, r2;
      r2 = (r * 0.393) + (g * 0.769) + (b * 0.189);
      g2 = (r * 0.349) + (g * 0.686) + (b * 0.168);
      b2 = (r * 0.272) + (g * 0.534) + (b * 0.131);
      return [clamp(r2), clamp(g2), clamp(b2), a];
    };
    return doFilter(c, filter, callback);
  };
  window.Canwaste = {
    _DEBUG_: _DEBUG_,
    makeCanvas: makeCanvas,
    makeCanvasLike: makeCanvasLike,
    makeCanvasToolboxLike: makeCanvasToolboxLike,
    simpleCopyCanvas: simpleCopyCanvas,
    copyCanvas: copyCanvas,
    canvas2canvas: canvas2canvas,
    image2canvas: image2canvas,
    array2canvas: array2canvas,
    rotateRight: rotateRight,
    rotateLeft: rotateLeft,
    flip: flip,
    mirror: mirror,
    doFilter: doFilter,
    blackWhite: blackWhite,
    nothing: nothing,
    red: red,
    blue: blue,
    green: green,
    moreRed: moreRed,
    moreGreen: moreGreen,
    moreBlue: moreBlue,
    moreAlpha: moreAlpha,
    neg: neg,
    bgr: bgr,
    gbr: gbr,
    brg: brg,
    rbg: rbg,
    grb: grb,
    sepia: sepia
  };
}).call(this);
