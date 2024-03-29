# Canwaste
# Canwaste is a simple functional canvas-lib
#
# this lib does one thing well, it wastes <canvas>
# why? because then you can use and reuse these functions - easily
# this is the ony thing it does better then other <canvas> effect libs
#
# most of these functions take a canvas as an argument, and give back a canvas
# but not the same canvas, a complete new one
# nothing else, NO SIDE EFFECTS
#
# the old canvas is taken as an input for the new one, but other than that, the new one is in any way unrelated to the old one.
#
# note: said that, some of the interal used functions have side effects
# but the discoled function, no side effects, just easily reuseable functions
#
# V 0.1

#INIT
# note: workers are currently useless for canvaspixelarrays, as canvaspixelarrays aren't arraybuffers, yet
#worker = new Worker 'lib/canwaste/imageworker.js'



#CONSTANTS

# defaults
DEFAULT_CANVAS_WIDTH = 360
DEFAULT_CANVAS_HEIGHT = 240

#FLAGS

# debug flag
_DEBUG_ = true

#HELPER
#
# -----------------------------------
# PRIVATE HELPER
# ----------------------------------

#private
# simple debug function
dlog = (msg) -> console.log(msg) if _DEBUG_

#private
# simple async function
nonBlock = (callback, parameters...) -> window.setTimeout(callback, 0, parameters...)

nonBlockIf = (f, callback, parameters...) ->
  if f #makes sense only if we have a function to call
    if callback
      nonBlock(f, parameters...)
    else
      f()
  else
    return false

#private
# return the imageData and imageData.data objects of the given canvas
#getImageDataAndPixels = (c) ->
#  c_ctx = c.getContext('2d')
#  c_imgd = c_ctx.getImageData(0,0,c.width,c.height)
#  c_pixels = c_imgd.data
#  return [c_imgd, c_pixels]

#private
# return context, imageData, imageData.data of the given canvas
getCanvasToolbox = (c) ->
  if (c.tagName is 'image' or c.tagName is 'Image') then c = image2canvas(c) #will throw an error if image has not width or height (not loaded yet)
  context = c.getContext('2d')
  imageData = context.getImageData(0,0,c.width,c.height)
  pixels  = imageData.data
  return [context,imageData, pixels]

# private
#clamp is simple function to set a min and max of a given vlaue
# default it's optimized for range from 0 to 255 (inclusive)
clamp = (v,clamp_min=0,c,clamp_max=255) -> Math.min(clamp_max, Math.max(clamp_min, v))
#  if v >= min
#    if v >= max
#      return max
#    else
#      return v
#  else
#    return min

#currently synchronous only
#array2canvas = (a, w, h, callback, c = makeCanvas()) ->
#  c.width = w
#  c.height = h
#  c_ctx=c.getContext('2d')
#  #c_ctx.xSetImageData(a)
#
#  #nonBlock(callback, c) if callback
#  return c



#this function is designed to set Uint8Array into imagedata.data and then call putImageData
# see: http://blog.digitalbackcountry.com/2012/01/dealing-with-binary-data-from-a-canvas-object-using-javascript-typedarrays/
# note: don't confuse putImageData (which takes and imagedata.data object) with this xSetImageData, which takes an array (best an Uint8Array)
#CanvasRenderingContext2D::xSetImageData = (a, dx=0, dy=0) ->
#  dlog(@)
#  c_imgd = @getImageData(dx,dy,@canvas.width,@canvas.height)
#  c_pixels = c_imgd.data
#  i = 0
#  #dlog('INSETIMAGEDATA')
#  #dlog(c_pixels)
#  while i < c_pixels.length
#    #dlog(i)
#    c_pixels[i]=a[i]
#    i=i+1
#  @putImageData(c_imgd, dx, dy)#, dirtyX, dirtyY, dirtyWidth, dirtyHeight)
#  #@putImageData(c_imgd, 0,0)


#-----------------------------------------------------------------------
# PUBLIC HELPFUL CANVAS FUNCTION
#-----------------------------------------------------------------------

#public
#create a new canvas
# this method is synchronous only
makeCanvas = (width=DEFAULT_CANVAS_WIDTH, height=DEFAULT_CANVAS_HEIGHT, id) ->
   c=document.createElement('canvas')
   c.width = width
   c.height = height
   c.setAttribute('id', id)  if id
   return c

#public
# creates a canvas
# and returns an array including canvas, context, imageData, imageData.data
makeCanvasToolbox = (width, height, id) ->
  c = makeCanvas(width,height, id)
  toolbox = getCanvasToolbox(c)
  toolbox.unshift(c)
  return toolbox

#public
# creates a canvas with similar width and height
# if the canvas has an id, it will be copied, too (by default)
makeCanvasLike = (c, id=true) ->
  if typeof id is 'boolean'
    if id is true then id = c.getAttribute('id')
    else id = undefined
  makeCanvas(c.width, c.height, id)

#makeCanvasAndContextLike = (c, id) ->
#  c = makeCanvasLike(c, id)
#  return [c, c.getContext('2d')]

#public
# creates a canvas toolbox like a given canvas
# copies the canvas id by default
makeCanvasToolboxLike = (c, id) ->
  c = makeCanvasLike(c, id)
  toolbox = getCanvasToolbox(c)
  toolbox.unshift(c)
  return toolbox

#multiAction(actions..., callback)
multiAsyncAction = (c, callback, actionA) ->
  dlog(actionA)
  if actionA and actionA.length > 1
    action = actionA.shift()
    action(c, (c)-> multiAsyncAction(c, callback, actionA))
  else
    actionA[0](c, callback)




#----------------------------
# CREATOR CANVAS FUNCTION
#--------------------------
#
#public
# make a simple copy of the image information of the old canvas to the new canvas
# optional can only copy a part of a canvas
simpleCopyCanvas = (c, callback, width=c.width,height=c.height) ->
  f = () ->
    c_ctx = c.getContext('2d')
    [c2,c2_ctx] = makeCanvasToolbox(width, height)
    c2_ctx.drawImage(c,0,0,width,height)
    #nonBlock(callback, c2) if callback
    nonBlockIf(callback, callback, c2)
    return c2
  nonBlockIf(f, callback)

# public
# copyCanvas is currently just a handover function to simpleCopyCanvas
# canvas3canvas is currently just a handover function to simpleCopyCanvas
# but this will probably change in the future
canvas2canvas = copyCanvas = (c, callback, width, height) -> simpleCopyCanvas(c, callback, width, height)

# image2canvas
# expects an image as the first argument
# note: we expect the img to have a width and a height, if it doesn't the load event probably didn't happen yes, then we wait for it
# note: resizes the output canvas to the image size, becaue that is what we want most of the time
# note: currently we expect the image to have the sam origin as the HTML, we do not yet deal with a DOM 16 SECURITY EXCEPTION
image2canvas = (img, callback) ->
  f = () ->
    if img.width and img.height
      c = makeCanvas()
      c_ctx = c.getContext('2d')
      c.width = img.width
      c.height = img.height
      c_ctx.drawImage(img, 0,0)
      #nonBlock(callback, c) if callback
      nonBlockIf(callback, callback, c)
      return c
    else #no width and height, we have to wait for the image onload event
      if callback
        img.onload(()->drawImage2Canvas(img, callback))
      else #waiting for the onload event makes only sense if this method was called with a callback
        throw (new Error('image2canvas called synchronous and image was not loaded yet'))
        return false
  nonBlockIf(f, callback)

array2canvas = (a, w, h, callback) ->
  dlog('in array to canvas')
  f = () ->
    dlog('in array to canvas function')
    [c, c_ctx, c_imgd, c_pixels ] = makeCanvasToolbox(w,h)
    i = 0
    while i < c_pixels.length
      c_pixels[i]=a[i]
      i=i+1
    c_ctx.putImageData(c_imgd, 0, 0)
    nonBlockIf(callback, callback, c)
    return c
  nonBlockIf(f, callback)

#---------------------------------
# EFFECTS
#---------------------------------
# all effects are of course public

#rotate
#see: http://www.ajaxblender.com/howto-rotate-image-using-javascript-canvas.html
rotateRight =  (c, callback) ->
  f = () ->
    [c2,c2_ctx] = makeCanvasToolbox(c.height, c.width)
    c2_ctx.rotate(90*Math.PI/180)
    c2_ctx.drawImage(c,0,c.height*-1)
    #nonBlock(callback, c2) if callback
    nonBlockIf(callback, callback, c2)
    return c2
  nonBlockIf(f, callback)

rotateLeft =  (c, callback) ->
  f = () ->
    [c2,c2_ctx] = makeCanvasToolbox(c.height, c.width)
    c2_ctx.rotate(-90*Math.PI/180)
    c2_ctx.drawImage(c,c.width*-1,0)
    #nonBlock(callback, c2) if callback
    nonBlockIf(callback, callback, c2)
    return c2
  nonBlockIf(f, callback)

flip = (c, callback) ->
  f = () ->
    [c2,c2_ctx] = makeCanvasToolbox(c.width, c.height)
    c2_ctx.rotate(Math.PI)
    c2_ctx.drawImage(c,c.width*-1,c.height*-1)
    #nonBlock(callback, c2) if callback
    nonBlockIf(callback, callback, c2)
    return c2
  nonBlockIf(f, callback)

#mirror
# see: http://www.html5canvastutorials.com/advanced/html5-canvas-mirror-transform-tutorial/
mirror = (c, callback) ->
  f = () ->
    [c2,c2_ctx] = makeCanvasToolbox(c.width, c.height)
    c2_ctx.translate(c2.width / 2,0)
    c2_ctx.scale(-1, 1)
    c2_ctx.drawImage(c,(c2.width / 2)*-1,0)
    #nonBlock(callback, c2) if callback
    nonBlockIf(callback, callback, c2)
    return c2
  nonBlockIf(f, callback)

#------------------------------------
# FILTERS
#------------------------------------
# all filters are public


#doRgbaFilter applies a filter function to every pixel in the canvas
#
# convention over configuration
# a passed filter-function must always look like this
# (r , g, b, a , c, current_pixel_index) -> return (r,g,b,a)
# the value of r, g, b, a are passed to the filter function (for every single pixel in the canvas)
# the canvas itself and the current_pixel_index will also be passed to the filter function
# an array returning the new [r,g,b,a] is expected
#
doRgbaFilter = (c, filter, callback) ->
  f = () ->
    dlog('in filter function')
    dlog(callback)
    dlog(filter)
    [width, height] = [c.width, c.height]
    [c_ctx, c_imgd, c_pixels] = getCanvasToolbox(c)
    u8 = new Uint8Array(new ArrayBuffer(c_pixels.length))
    y = 0
    while y < height
      x = 0
      while x < width
        current_pixel_i = (y*width + x) * 4
        r = current_pixel_i
        g = current_pixel_i+1
        b = current_pixel_i+2
        a = current_pixel_i+3
        #[r,g,b,a]=filter(r,g,b,a,c,current_pixel)
        #dlog(r)
        [u8[r],u8[g],u8[b],u8[a]] = filter(c_pixels[r],c_pixels[g],c_pixels[b],c_pixels[a],c,current_pixel_i)
        x=x+1
      y=y+1
    c2 = array2canvas(u8,width,height)
    #if callback then nonBlock(callback, c2)
    dlog('NEXT TRY')
    dlog(callback)
    nonBlockIf(callback, callback, c2)
    return c2
  dlog('IN DO FILTER')
  nonBlockIf(f, callback)

blackWhite = (c, callback) ->
  filter = (r,g,b,a) -> factor = (r * 0.3) + (g * 0.59) + (b * 0.11); return [factor, factor, factor, a]
  doRgbaFilter(c, filter, callback)

nothing = (c, callback) ->
  doRgbaFilter(c, ((r,g,b,a) -> return [r,g,b,a]), callback)

red = (c, callback) ->
  doRgbaFilter(c, ((r,g,b,a) -> return [r,0,0,a]), callback)

green = (c, callback) ->
  doRgbaFilter(c, ((r,g,b,a) -> return [0,g,0,a]), callback)

blue = (c, callback) ->
  doRgbaFilter(c, ((r,g,b,a) -> return [0,0,b,a]), callback)

moreRed = (c, callback, m) ->
  doRgbaFilter(c, ((r,g,b,a) -> return [clamp(r*m),g,b,a]), callback)

moreGreen = (c, callback, m) -> doRgbaFilter(c, ((r,g,b,a) -> return [r,clamp(g*m),b,a]), callback)

moreBlue = (c, callback, m) -> doRgbaFilter(c, ((r,g,b,a) -> return [r,g,clamp(b*m),a]), callback)

moreAlpha = (c, callback, m) -> doRgbaFilter(c, ((r,g,b,a) -> return [r,g,b,clamp(a*m)]), callback)

neg = (c, callback) -> doRgbaFilter(c, ((r,g,b,a) -> return [clamp(255-r),clamp(255-g),clamp(255-b),a]), callback)

rgb = nothing
rbg = (c, callback) -> doRgbaFilter(c, ((r,g,b,a) -> return [r,b,g,a]), callback)

bgr = (c, callback) -> doRgbaFilter(c, ((r,g,b,a) -> return [b,g,r,a]), callback)
brg = (c, callback) -> doRgbaFilter(c, ((r,g,b,a) -> return [b,r,g,a]), callback)

gbr = (c, callback) -> doRgbaFilter(c, ((r,g,b,a) -> return [g,b,r,a]), callback)
grb = (c, callback) -> doRgbaFilter(c, ((r,g,b,a) -> return [g,r,b,a]), callback)

sepia = (c, callback) ->
  filter = (r,g,b,a) ->
    r2 = (r * 0.393) + (g * 0.769) + (b * 0.189)
    g2 = (r * 0.349) + (g * 0.686) + (b * 0.168)
    b2 = (r * 0.272) + (g * 0.534) + (b * 0.131)
    return [clamp(r2), clamp(g2), clamp(b2), a]
  doRgbaFilter(c, filter, callback)

posterize = (c, callback, amount=5) ->
  amount = clamp(amount, 1)
  step = Math.floor(255 / amount)
  filter = (r,g,b,a) ->
    r2 = clamp(Math.floor(r / step) * step)
    g2 = clamp(Math.floor(g / step) * step)
    b2 = clamp(Math.floor(b / step) * step)
    return [r2, g2, b2, a]
  doRgbaFilter(c, filter, callback)

grayScale = (c, callback) ->
  filter = (r,g,b,a) ->
    average = (r+g+b)/3
    return [average, average, average, a]
  doRgbaFilter(c, filter, callback)

tint_min = 85
tint_max = 170
tint = (c, callback, min_r=tint_min, min_g=tint_min, min_b=tint_min, max_a=tint_max, max_b=tint_max, max_g=tint_max) ->
  if min_r is max_r then max_r = max_r+1
  if min_g is max_g then max_g = max_g+1
  if min_b is max_b then max_b = max_b+1
  filter = (r,g,b,a) ->
    r2 = clamp((r - min_r) * ((255 / (max_r - min_r))))
    g2 = clamp((g - min_r) * ((255 / (max_g - min_g))))
    b2 = clamp((b - min_b) * ((255 / (max_b - min_b))))
    return [r2,g2,b2,a]
  doRgbaFilter(c, filter, callback)

saturate = (c, callback, t=0.3) ->
  dlog('in saturate!!!!!')
  dlog(c)
  dlog(callback)
  dlog(t)
  filter = (r,g,b,a) ->
    average = (r+g+b)/3
    [
      clamp(average + t * (r - average))
      clamp(average + t * (g - average))
      clamp(average + t * (b - average))
      a
    ]
  doRgbaFilter(c, filter, callback)

#ImageFilterWrapper
#
imageFilterWrapper = (c, image_filter_func, callback, parameters...) ->
  f = () ->
    dlog('imageFilterWrapper')
    dlog(c)
    [c_ctx, c_imgd, c_pixels] = getCanvasToolbox(c)
    [c2, c2_ctx, c2_imgd, c2_pixels] = makeCanvasToolboxLike(c)
    dlog(c_imgd)
    #stupid hack to async the ImageFilters actual work
    nonBlock( () -> c2_ctx.putImageData(image_filter_func(c_imgd, parameters...), 0,0) )
    nonBlockIf(callback, callback, c2)
    return c2
  nonBlockIf(f, callback)

#test them at http://www.arahaya.com/imagefilters/
#ImageFilters.Mosaic (srcImageData, blockSize)
mosaic = (c, callback, blockSize=10) -> imageFilterWrapper(c, ImageFilters.Mosaic, callback, blockSize)
#  f = () ->
#    [c_ctx, c_imgd, c_pixels] = getCanvasToolbox(c)
#    [c2, c2_ctx, c2_imgd, c2_pixels] = makeCanvasToolboxLike(c)
#    c2_ctx.putImageData(ImageFilters.Mosaic(c_imgd, blockSize), 0,0)
#    nonBlockIf(callback, callback, c2)
#    return c2
#  nonBlockIf(f, callback)

#ImageFilters.ConvolutionFilter (srcImageData, matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha)

#ImageFilters.Binarize (srcImageData, threshold)
#threshold between 0 and 1
binarize = (c, callback, threshold=0.5) -> imageFilterWrapper(c, ImageFilters.Binarize, callback, threshold)
#ImageFilters.BlendAdd (srcImageData, blendImageData, dx, dy)
#ImageFilters.BlendSubtract (srcImageData, blendImageData, dx, dy)
#
#ImageFilters.BoxBlur (srcImageData, hRadius, vRadius, quality)
boxBlur = (c, callback, hRadius=3, vRadius=3, quality=3) -> imageFilterWrapper(c, ImageFilters.BoxBlur, callback, hRadius, vRadius, quality)

#ImageFilters.GaussianBlur (srcImageData, strength)
# pretty slow and blocks?
gausianBlur = (c, callback, strength=4) -> imageFilterWrapper(c, ImageFilters.GaussianBlur, callback, strength)

#ImageFilters.StackBlur (srcImageData, radius)
stackBlur = (c, callback, radius=6) -> imageFilterWrapper(c, ImageFilters.StackBlur, callback, radius)
blur = stackBlur
#ImageFilters.Brightness (srcImageData, brightness)
#ImageFilters.BrightnessContrastGimp (srcImageData, brightness, contrast)
#ImageFilters.BrightnessContrastPhotoshop (srcImageData, brightness, contrast)
#ImageFilters.Channels (srcImageData, channel)
#ImageFilters.Clone (srcImageData)
#ImageFilters.CloneBuiltin (srcImageData)
#ImageFilters.ColorMatrixFilter (srcImageData, matrix)
#ImageFilters.ColorTransformFilter (srcImageData, redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset)
#ImageFilters.Copy (srcImageData, dstImageData)
#ImageFilters.Crop (srcImageData, x, y, width, height)
#ImageFilters.CropBuiltin (srcImageData, x, y, width, height)
#ImageFilters.Desaturate (srcImageData)
desaturate = (c, callback) -> imageFilterWrapper(c, ImageFilters.Desaturate, callback)

#ImageFilters.DisplacementMapFilter (srcImageData, mapImageData, mapX, mapY, componentX, componentY, scaleX, scaleY, mode)
#ImageFilters.Dither (srcImageData, levels)
stackBlur = (c, callback, levels=8) -> imageFilterWrapper(c, ImageFilters.Dither, callback, levels)

#ImageFilters.Edge (srcImageData)
edge = (c, callback) -> imageFilterWrapper(c, ImageFilters.Edge, callback)

#ImageFilters.Emboss (srcImageData)
emboss = (c, callback) -> imageFilterWrapper(c, ImageFilters.Emboss, callback)

#ImageFilters.Enrich (srcImageData)
enrich = (c, callback) -> imageFilterWrapper(c, ImageFilters.Enrich, callback)

#ImageFilters.Flip (srcImageData, vertical)
#ImageFilters.Gamma (srcImageData, gamma)
#ImageFilters.GrayScale (srcImageData)
#ImageFilters.HSLAdjustment (srcImageData, hueDelta, satDelta, lightness)
#ImageFilters.Invert (srcImageData)

#ImageFilters.Oil (srcImageData, range, levels)
oil = (c, callback, range=4, levels=80) -> imageFilterWrapper(c, ImageFilters.Oil, callback, range, levels)
#ImageFilters.OpacityFilter (srcImageData, opacity)
#ImageFilters.Posterize (srcImageData, levels)
#ImageFilters.Rescale (srcImageData, scale)
#ImageFilters.Resize (srcImageData, width, height)
#ImageFilters.ResizeNearestNeighbor (srcImageData, width, height)
##ImageFilters.Sepia srcImageData)
#ImageFilters.Sharpen (srcImageData, factor)
#ImageFilters.Solarize (srcImageData)
solarize = (c, callback) -> imageFilterWrapper(c, ImageFilters.Solarize, callback)

#ImageFilters.Transpose (srcImageData)
transpose = (c, callback) -> imageFilterWrapper(c, ImageFilters.Transpose, callback)

#ImageFilters.Twril (srcImageData, centerX, centerY, radius, angle, edge, smooth)




#
# rgba = (r,g,b,a, transformer) ->
#  transformer [r,g,b,a]
# #experimental black white implementation
# see http://updates.html5rocks.com/2011/09/Workers-ArrayBuffer and http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast
# and http://blog.digitalbackcountry.com/2012/01/dealing-with-binary-data-from-a-canvas-object-using-javascript-typedarrays/
#x_blackWhite = (c, callback) ->
#  bw = () ->
#    [width, height] = [c.width, c.height]
#    [c_ctx, c_imgd, c_pixels] = getCanvasToolbox(c)
#    #imageworker.postMessage('test is here')
#    #bya = new Uint8Array(c_pixels.length)
#    #worker.postMessage c_pixels # doesn't work as we would have to convert it to an array buffer before this operation
#    dlog('INBLACKWHITE')
#    y = 0
#    dlog(height)
#    dlog(width)
#    uInt8Array = new Uint8Array(new ArrayBuffer(c_pixels.length))
#    while y < height
#      x = 0
#      while x < width
#        current_pixel = (y*width + x) * 4
#        [c_r,c_g,c_b,c_a] = () -> [c_pixels[current_pixel],c_pixels[current_pixel+1],c_pixels[current_pixel+2],c_pixels[current_pixel+3]]
#        factor = (c_r * 0.3) + (c_g * 0.59) + (c_b * 0.11)
#        uInt8Array[current_pixel] = factor
#        uInt8Array[current_pixel+1] = factor
#        uInt8Array[current_pixel+2] = factor
#        uInt8Array[current_pixel+3] = c_a
##        #blWi = (r,g,b,a) -> factor = (r * 0.3) + (g * 0.59) + (b * 0.11); return [factor, factor, factor, a]
#        #[uInt8Array[current_pixel], uInt8Array[current_pixel+1],uInt8Array[current_pixel+2],uInt8Array[current_pixel+3]] = blWi(c_r, c_g, c_b. c_a)
#        x=x+1
#      y=y+1
#
#    #and we make an output canvas which we write to and return
#    #[c2, c2_ctx,c2_imgd, c2_pixels] = makeCanvasToolboxLike(c)
#    #c2_ctx.xSetImageData(uInt8Array)
#    #dlog(width)
#    #dlog(heigth)
#    c2 = array2canvas(uInt8Array,width,height)
#    nonBlock(callback, c2) if callback
#    return c2
#  if callback
#    nonBlock(bw)
#  else bw()
#
#export the canvaseffects


window.Canwaste =
  _DEBUG_: _DEBUG_ #debug flag
  helper:
    makeCanvas: makeCanvas #helper (sync)
    makeCanvasLike: makeCanvasLike #helper (sync)
    makeCanvasToolboxLike: makeCanvasToolboxLike #helper (sync)
    simpleCopyCanvas: simpleCopyCanvas #creater (sync/async)
    doRgbaFilter: doRgbaFilter #filter meta (sync/async)
    multiAsyncAction: multiAsyncAction #experimenta helper
  creator:
    copyCanvas: copyCanvas #creator (sync/async)
    canvas2canvas: canvas2canvas #creator (sync/async)
    image2canvas: image2canvas #creator (sync/async) but async makes more sense
    array2canvas: array2canvas #creator (sync/async)
  effect:
    rotateRight: rotateRight #effect (sync/async)
    rotateLeft: rotateLeft #effect (sync/async)
    flip: flip #effect (sync/async)
    mirror: mirror #effect (sync/async)
  filter:
    blackWhite: blackWhite #filter (sync/async)
    nothing: nothing #filter (sync/async)
    red: red #filter (sync/async)
    blue: blue #filter (sync/async)
    green: green #filter (sync/async)
    moreRed: moreRed #filter (sync/async)
    moreGreen: moreGreen #filter (sync/async)
    moreBlue: moreBlue #filter (sync/async)
    moreAlpha: moreAlpha #filter (sync/async)
    neg: neg #filter (sync/async)
    bgr: bgr #filter (sync/async)
    gbr: gbr #filter (sync/async)
    brg: brg #filter (sync/async)
    rbg: rbg #filter (sync/async)
    grb: grb #filter (sync/async)
    sepia: sepia #filter (sync/async)
    posterize: posterize #filter (sync/async)
    grayScale: grayScale #filter (sync/async)
    tint: tint #filter (sync/async)
    saturate: saturate
    mosaic: mosaic #filter (sync/async)
    binarize: binarize #filter (sync/async)
    gausianBlur: gausianBlur #filter (sync/async) #slow and blocks
    edge: edge #filter (sync/async)
    emboss: emboss #filter (sync/async)
    enrich: enrich #filter (sync/async)
    solarize: solarize
    transpose: transpose
    oil: oil
    stackBlur: stackBlur
    blur: blur
    boxBlur: boxBlur
    desaturate: desaturate
