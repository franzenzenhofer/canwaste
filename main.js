(function() {
  var DEBUG, DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH, blackWhite, copyCanvas, copyImage, dlog, flip, getCanvasToolbox, getImageDataAndPixels, makeCanvas, makeCanvasAndContext, makeCanvasAndContextLike, makeCanvasLike, makeCanvasToolbox, makeCanvasToolboxLike, mirror, nonBlock, rotateLeft, rotateRight, simpleCopyCanvas;
  var __slice = Array.prototype.slice;
  DEBUG = true;
  DEFAULT_CANVAS_WIDTH = 360;
  DEFAULT_CANVAS_HEIGHT = 240;
  dlog = function(msg) {
    if (DEBUG) {
      return console.log(msg);
    }
  };
  nonBlock = function() {
    var callback, parameters;
    callback = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return window.setTimeout.apply(window, [callback, 0].concat(__slice.call(parameters)));
  };
  getImageDataAndPixels = function(c) {
    var c_ctx, c_imgd, c_pixels;
    c_ctx = c.getContext('2d');
    c_imgd = c_ctx.getImageData(0, 0, c.width, c.height);
    c_pixels = c_imgd.data;
    return [c_imgd, c_pixels];
  };
  getCanvasToolbox = function(c) {
    var context, imageData, pixels;
    context = c.getContext('2d');
    imageData = context.getImageData(0, 0, c.width, c.height);
    pixels = imageData.data;
    return [context, imageData, pixels];
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
  makeCanvasAndContext = function(width, height, id) {
    var c;
    c = makeCanvas(width, height, id);
    return [c, c.getContext('2d')];
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
  makeCanvasAndContextLike = function(c, id) {
    c = makeCanvasLike(c, id);
    return [c, c.getContext('2d')];
  };
  makeCanvasToolboxLike = function(c, id) {
    var toolbox;
    c = makeCanvasLike(c, id);
    toolbox = getCanvasToolbox(c);
    toolbox.unshift(c);
    return toolbox;
  };
  simpleCopyCanvas = function(c, callback, width, height) {
    var c2, c2_ctx, c_ctx, _ref;
    if (width == null) {
      width = c.width;
    }
    if (height == null) {
      height = c.height;
    }
    dlog('in COPY CANVAS');
    c_ctx = c.getContext('2d');
    _ref = makeCanvasAndContext(width, height), c2 = _ref[0], c2_ctx = _ref[1];
    c2_ctx.drawImage(c, 0, 0, width, height);
    if (callback) {
      nonBlock(callback, c2);
    }
    return c2;
  };
  copyCanvas = function(c, callback, width, height) {
    return simpleCopyCanvas(c, callback, width, height);
  };
  copyImage = function(img, callback, c) {
    var c_ctx;
    if (c == null) {
      c = makeCanvas();
    }
    if (img.width && img.height) {
      c_ctx = c.getContext('2d');
      c.width = img.width;
      c.height = img.height;
      c_ctx.drawImage(img, 0, 0);
      if (callback) {
        nonBlock(callback, c);
      }
    } else {
      img.onload(function() {
        return drawImage2Canvas(img, callback, c);
      });
    }
    return c;
  };
  rotateRight = function(c, callback) {
    var c2, c2_ctx, _ref;
    _ref = makeCanvasAndContext(c.height, c.width), c2 = _ref[0], c2_ctx = _ref[1];
    c2_ctx.rotate(90 * Math.PI / 180);
    c2_ctx.drawImage(c, 0, c.height * -1);
    if (callback) {
      nonBlock(callback, c2);
    }
    return c2;
  };
  flip = function(c, callback) {
    var c2, c2_ctx, _ref;
    _ref = makeCanvasAndContext(c.width, c.height), c2 = _ref[0], c2_ctx = _ref[1];
    c2_ctx.rotate(Math.PI);
    c2_ctx.drawImage(c, c.width * -1, c.height * -1);
    if (callback) {
      nonBlock(callback, c2);
    }
    return c2;
  };
  rotateLeft = function(c, callback) {
    var c2, c2_ctx, _ref;
    _ref = makeCanvasAndContext(c.height, c.width), c2 = _ref[0], c2_ctx = _ref[1];
    c2_ctx.rotate(-90 * Math.PI / 180);
    c2_ctx.drawImage(c, c.width * -1, 0);
    if (callback) {
      nonBlock(callback, c2);
    }
    return c2;
  };
  mirror = function(c, callback) {
    return nonBlock(function() {
      var c2, c2_ctx, _ref;
      _ref = makeCanvasAndContext(c.width, c.height), c2 = _ref[0], c2_ctx = _ref[1];
      c2_ctx.translate(c2.width / 2, 0);
      c2_ctx.scale(-1, 1);
      c2_ctx.drawImage(c, (c2.width / 2) * -1, 0);
      if (callback) {
        nonBlock(callback, c2);
      }
      return c2;
    });
  };
  blackWhite = function(c, callback) {
    var bw;
    bw = function() {
      var c2, c2_a, c2_b, c2_ctx, c2_g, c2_imgd, c2_pixels, c2_r, c3, c3_ctx, c3_imgd, c3_pixels, current_pixel, factor, height, width, x, y, _ref, _ref2, _ref3, _ref4;
      _ref = [c.width, c.height], width = _ref[0], height = _ref[1];
      c2 = simpleCopyCanvas(c);
      _ref2 = getCanvasToolbox(c2), c2_ctx = _ref2[0], c2_imgd = _ref2[1], c2_pixels = _ref2[2];
      dlog('INBLACKWHITE');
      dlog(getCanvasToolbox(c2));
      _ref3 = makeCanvasToolboxLike(c), c3 = _ref3[0], c3_ctx = _ref3[1], c3_imgd = _ref3[2], c3_pixels = _ref3[3];
      y = 0;
      dlog(height);
      dlog(width);
      while (y < height) {
        x = 0;
        while (x < width) {
          current_pixel = (y * width + x) * 4;
          _ref4 = [c2_pixels[current_pixel], c2_pixels[current_pixel + 1], c2_pixels[current_pixel + 2], c2_pixels[current_pixel + 3]], c2_r = _ref4[0], c2_g = _ref4[1], c2_b = _ref4[2], c2_a = _ref4[3];
          factor = (c2_r * 0.3) + (c2_g * 0.59) + (c2_b * 0.11);
          c3_pixels[current_pixel] = factor;
          c3_pixels[current_pixel + 1] = factor;
          c3_pixels[current_pixel + 2] = factor;
          c3_pixels[current_pixel + 3] = c2_a;
          x = x + 1;
        }
        y = y + 1;
      }
      c3_ctx.putImageData(c3_imgd, 0, 0);
      if (callback) {
        nonBlock(callback, c3);
      }
      return c3;
    };
    return nonBlock(bw);
  };
  window.Canwaste = {
    rotateRight: rotateRight,
    rotateLeft: rotateLeft,
    flip: flip,
    mirror: mirror,
    copyCanvas: copyCanvas,
    simpleCopyCanvas: simpleCopyCanvas,
    copyImage: copyImage,
    blackWhite: blackWhite
  };
}).call(this);
