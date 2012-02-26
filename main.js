(function() {
  var DEBUG, DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH, copyCanvas, copyImage, dlog, makeCanvas, makeCanvasAndContext, mirror, nonBlock, rotateRight90, simpleCopyCanvas;
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
  rotateRight90 = function(c, callback) {
    var c2, c2_ctx, _ref;
    _ref = makeCanvasAndContext(c.height, c.width), c2 = _ref[0], c2_ctx = _ref[1];
    c2_ctx.rotate(90 * Math.PI / 180);
    c2_ctx.drawImage(c, 0, c.height * -1);
    if (callback) {
      nonBlock(callback, c2);
    }
    return c2;
  };
  mirror = function(c, callback) {
    var c2, c2_ctx, _ref;
    _ref = makeCanvasAndContext(c.width, c.height), c2 = _ref[0], c2_ctx = _ref[1];
    c2_ctx.translate(c2.width / 2, 0);
    c2_ctx.scale(-1, 1);
    c2_ctx.drawImage(c, (c2.width / 2) * -1, 0);
    if (callback) {
      nonBlock(callback, c2);
    }
    return c2;
  };
  window.Canwaste = {
    rotateRight90: rotateRight90,
    copyCanvas: copyCanvas,
    simpleCopyCanvas: simpleCopyCanvas,
    copyImage: copyImage,
    mirror: mirror
  };
}).call(this);
