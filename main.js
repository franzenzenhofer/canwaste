(function() {
  var DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH, array2canvas, bgr, binarize, blackWhite, blue, blur, boxBlur, brg, canvas2canvas, clamp, copyCanvas, desaturate, dlog, doRgbaFilter, edge, emboss, enrich, flip, gausianBlur, gbr, getCanvasToolbox, grayScale, grb, green, image2canvas, imageFilterWrapper, makeCanvas, makeCanvasLike, makeCanvasToolbox, makeCanvasToolboxLike, mirror, moreAlpha, moreBlue, moreGreen, moreRed, mosaic, multiAsyncAction, neg, nonBlock, nonBlockIf, nothing, oil, posterize, rbg, red, rgb, rotateLeft, rotateRight, saturate, sepia, simpleCopyCanvas, solarize, stackBlur, tint, tint_max, tint_min, transpose, _DEBUG_;
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
    if (c.tagName === 'image' || c.tagName === 'Image') {
      c = image2canvas(c);
    }
    context = c.getContext('2d');
    imageData = context.getImageData(0, 0, c.width, c.height);
    pixels = imageData.data;
    return [context, imageData, pixels];
  };
  clamp = function(v, clamp_min, c, clamp_max) {
    if (clamp_min == null) {
      clamp_min = 0;
    }
    if (clamp_max == null) {
      clamp_max = 255;
    }
    return Math.min(clamp_max, Math.max(clamp_min, v));
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
  multiAsyncAction = function(c, callback, actionA) {
    var action;
    dlog(actionA);
    if (actionA && actionA.length > 1) {
      action = actionA.shift();
      return action(c, function(c) {
        return multiAsyncAction(c, callback, actionA);
      });
    } else {
      return actionA[0](c, callback);
    }
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
          throw new Error('image2canvas called synchronous and image was not loaded yet');
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
  doRgbaFilter = function(c, filter, callback) {
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
    return doRgbaFilter(c, filter, callback);
  };
  nothing = function(c, callback) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [r, g, b, a];
    }), callback);
  };
  red = function(c, callback) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [r, 0, 0, a];
    }), callback);
  };
  green = function(c, callback) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [0, g, 0, a];
    }), callback);
  };
  blue = function(c, callback) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [0, 0, b, a];
    }), callback);
  };
  moreRed = function(c, callback, m) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [clamp(r * m), g, b, a];
    }), callback);
  };
  moreGreen = function(c, callback, m) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [r, clamp(g * m), b, a];
    }), callback);
  };
  moreBlue = function(c, callback, m) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [r, g, clamp(b * m), a];
    }), callback);
  };
  moreAlpha = function(c, callback, m) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [r, g, b, clamp(a * m)];
    }), callback);
  };
  neg = function(c, callback) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [clamp(255 - r), clamp(255 - g), clamp(255 - b), a];
    }), callback);
  };
  rgb = nothing;
  rbg = function(c, callback) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [r, b, g, a];
    }), callback);
  };
  bgr = function(c, callback) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [b, g, r, a];
    }), callback);
  };
  brg = function(c, callback) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [b, r, g, a];
    }), callback);
  };
  gbr = function(c, callback) {
    return doRgbaFilter(c, (function(r, g, b, a) {
      return [g, b, r, a];
    }), callback);
  };
  grb = function(c, callback) {
    return doRgbaFilter(c, (function(r, g, b, a) {
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
    return doRgbaFilter(c, filter, callback);
  };
  posterize = function(c, callback, amount) {
    var filter, step;
    if (amount == null) {
      amount = 5;
    }
    amount = clamp(amount, 1);
    step = Math.floor(255 / amount);
    filter = function(r, g, b, a) {
      var b2, g2, r2;
      r2 = clamp(Math.floor(r / step) * step);
      g2 = clamp(Math.floor(g / step) * step);
      b2 = clamp(Math.floor(b / step) * step);
      return [r2, g2, b2, a];
    };
    return doRgbaFilter(c, filter, callback);
  };
  grayScale = function(c, callback) {
    var filter;
    filter = function(r, g, b, a) {
      var average;
      average = (r + g + b) / 3;
      return [average, average, average, a];
    };
    return doRgbaFilter(c, filter, callback);
  };
  tint_min = 85;
  tint_max = 170;
  tint = function(c, callback, min_r, min_g, min_b, max_a, max_b, max_g) {
    var filter, max_r;
    if (min_r == null) {
      min_r = tint_min;
    }
    if (min_g == null) {
      min_g = tint_min;
    }
    if (min_b == null) {
      min_b = tint_min;
    }
    if (max_a == null) {
      max_a = tint_max;
    }
    if (max_b == null) {
      max_b = tint_max;
    }
    if (max_g == null) {
      max_g = tint_max;
    }
    if (min_r === max_r) {
      max_r = max_r + 1;
    }
    if (min_g === max_g) {
      max_g = max_g + 1;
    }
    if (min_b === max_b) {
      max_b = max_b + 1;
    }
    filter = function(r, g, b, a) {
      var b2, g2, r2;
      r2 = clamp((r - min_r) * (255 / (max_r - min_r)));
      g2 = clamp((g - min_r) * (255 / (max_g - min_g)));
      b2 = clamp((b - min_b) * (255 / (max_b - min_b)));
      return [r2, g2, b2, a];
    };
    return doRgbaFilter(c, filter, callback);
  };
  saturate = function(c, callback, t) {
    var filter;
    if (t == null) {
      t = 0.3;
    }
    dlog('in saturate!!!!!');
    dlog(c);
    dlog(callback);
    dlog(t);
    filter = function(r, g, b, a) {
      var average;
      average = (r + g + b) / 3;
      return [clamp(average + t * (r - average)), clamp(average + t * (g - average)), clamp(average + t * (b - average)), a];
    };
    return doRgbaFilter(c, filter, callback);
  };
  imageFilterWrapper = function() {
    var c, callback, f, image_filter_func, parameters;
    c = arguments[0], image_filter_func = arguments[1], callback = arguments[2], parameters = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
    f = function() {
      var c2, c2_ctx, c2_imgd, c2_pixels, c_ctx, c_imgd, c_pixels, _ref, _ref2;
      dlog('imageFilterWrapper');
      dlog(c);
      _ref = getCanvasToolbox(c), c_ctx = _ref[0], c_imgd = _ref[1], c_pixels = _ref[2];
      _ref2 = makeCanvasToolboxLike(c), c2 = _ref2[0], c2_ctx = _ref2[1], c2_imgd = _ref2[2], c2_pixels = _ref2[3];
      dlog(c_imgd);
      nonBlock(function() {
        return c2_ctx.putImageData(image_filter_func.apply(null, [c_imgd].concat(__slice.call(parameters))), 0, 0);
      });
      nonBlockIf(callback, callback, c2);
      return c2;
    };
    return nonBlockIf(f, callback);
  };
  mosaic = function(c, callback, blockSize) {
    if (blockSize == null) {
      blockSize = 10;
    }
    return imageFilterWrapper(c, ImageFilters.Mosaic, callback, blockSize);
  };
  binarize = function(c, callback, threshold) {
    if (threshold == null) {
      threshold = 0.5;
    }
    return imageFilterWrapper(c, ImageFilters.Binarize, callback, threshold);
  };
  boxBlur = function(c, callback, hRadius, vRadius, quality) {
    if (hRadius == null) {
      hRadius = 3;
    }
    if (vRadius == null) {
      vRadius = 3;
    }
    if (quality == null) {
      quality = 3;
    }
    return imageFilterWrapper(c, ImageFilters.BoxBlur, callback, hRadius, vRadius, quality);
  };
  gausianBlur = function(c, callback, strength) {
    if (strength == null) {
      strength = 4;
    }
    return imageFilterWrapper(c, ImageFilters.GaussianBlur, callback, strength);
  };
  stackBlur = function(c, callback, radius) {
    if (radius == null) {
      radius = 6;
    }
    return imageFilterWrapper(c, ImageFilters.StackBlur, callback, radius);
  };
  blur = stackBlur;
  desaturate = function(c, callback) {
    return imageFilterWrapper(c, ImageFilters.Desaturate, callback);
  };
  stackBlur = function(c, callback, levels) {
    if (levels == null) {
      levels = 8;
    }
    return imageFilterWrapper(c, ImageFilters.Dither, callback, levels);
  };
  edge = function(c, callback) {
    return imageFilterWrapper(c, ImageFilters.Edge, callback);
  };
  emboss = function(c, callback) {
    return imageFilterWrapper(c, ImageFilters.Emboss, callback);
  };
  enrich = function(c, callback) {
    return imageFilterWrapper(c, ImageFilters.Enrich, callback);
  };
  oil = function(c, callback, range, levels) {
    if (range == null) {
      range = 4;
    }
    if (levels == null) {
      levels = 80;
    }
    return imageFilterWrapper(c, ImageFilters.Oil, callback, range, levels);
  };
  solarize = function(c, callback) {
    return imageFilterWrapper(c, ImageFilters.Solarize, callback);
  };
  transpose = function(c, callback) {
    return imageFilterWrapper(c, ImageFilters.Transpose, callback);
  };
  window.Canwaste = {
    _DEBUG_: _DEBUG_,
    helper: {
      makeCanvas: makeCanvas,
      makeCanvasLike: makeCanvasLike,
      makeCanvasToolboxLike: makeCanvasToolboxLike,
      simpleCopyCanvas: simpleCopyCanvas,
      doRgbaFilter: doRgbaFilter,
      multiAsyncAction: multiAsyncAction
    },
    creator: {
      copyCanvas: copyCanvas,
      canvas2canvas: canvas2canvas,
      image2canvas: image2canvas,
      array2canvas: array2canvas
    },
    effect: {
      rotateRight: rotateRight,
      rotateLeft: rotateLeft,
      flip: flip,
      mirror: mirror
    },
    filter: {
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
      sepia: sepia,
      posterize: posterize,
      grayScale: grayScale,
      tint: tint,
      saturate: saturate,
      mosaic: mosaic,
      binarize: binarize,
      gausianBlur: gausianBlur,
      edge: edge,
      emboss: emboss,
      enrich: enrich,
      solarize: solarize,
      transpose: transpose,
      oil: oil,
      stackBlur: stackBlur,
      blur: blur,
      boxBlur: boxBlur,
      desaturate: desaturate
    }
  };
}).call(this);
