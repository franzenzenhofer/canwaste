# Canwaste
# Canwaste is a simple canvas-lib
# this lib does one thing well, it wastes <canvas>
# most of these functions take a canvas as an argument, and give back a canvas
# but not the same canvas, a complete new one
# the old canvas is taken as an input for the new one, but other than that, the new one is in any way unrelated to the old one.
# most of these functions do not have any sideeffects
#

#CONSTANTS
DEBUG = true
DEFAULT_CANVAS_WIDTH = 360
DEFAULT_CANVAS_HEIGHT = 240

#HELPER
dlog = (msg) -> console.log(msg) if DEBUG

nonBlock = (callback, parameters...) -> window.setTimeout(callback, 0, parameters...)

getImageDataAndPixels = (c) ->
  c_ctx = c.getContext('2d')
  c_imgd = c_ctx.getImageData(0,0,c.width,c.height)
  c_pixels = c_imgd.data
  return [c_imgd, c_pixels]

getCanvasToolbox = (c) ->
  context = c.getContext('2d')
  imageData = context.getImageData(0,0,c.width,c.height)
  pixels  = imageData.data
  return [context,imageData, pixels]

#-----------------------------------------------------------------------
# helpful canvas functions
#-----------------------------------------------------------------------

#create a new canvas
# makeCanvas[]
# this method is synchronous only
makeCanvas = (width=DEFAULT_CANVAS_WIDTH, height=DEFAULT_CANVAS_HEIGHT, id) ->
   c=document.createElement('canvas')
   c.width = width
   c.height = height
   c.setAttribute('id', id)  if id
   return c

#a helper method that returns a new canvas and it's context
# best used with destructive assignement
# [c,c_ctx] = makeCanvasAndContext()
makeCanvasAndContext = (width, height, id) ->
  c = makeCanvas(width, height, id)
  return [c, c.getContext('2d')]

makeCanvasToolbox = (width, height, id) ->
  c = makeCanvas(width,height, id)
  toolbox = getCanvasToolbox(c)
  toolbox.unshift(c)
  return toolbox

#make a canvas like another canvas
makeCanvasLike = (c, id=true) ->
  if typeof id is 'boolean'
    if id is true then id = c.getAttribute('id')
    else id = undefined
  makeCanvas(c.width, c.height, id)

makeCanvasAndContextLike = (c, id) ->
  c = makeCanvasLike(c, id)
  return [c, c.getContext('2d')]

makeCanvasToolboxLike = (c, id) ->
  c = makeCanvasLike(c, id)
  toolbox = getCanvasToolbox(c)
  toolbox.unshift(c)
  return toolbox


# make a simple copy of the image information of the old canvas to the new canvas
simpleCopyCanvas = (c, callback, width=c.width,height=c.height) ->
  dlog('in COPY CANVAS')
  c_ctx = c.getContext('2d')

  #draw the old canvas onto the new canvas
  #c2 = makeCanvas(width, height)
  #c2_ctx = c2.getContext('2d')
  [c2,c2_ctx] = makeCanvasAndContext(width, height)
  c2_ctx.drawImage(c,0,0,width,height)
  nonBlock(callback, c2) if callback
  return c2

# copyCanvas is currently just a handover function to simpleCopyCanvas
# but this will probably change in the future
copyCanvas = (c, callback, width, height) -> simpleCopyCanvas(c, callback, width, height)

# copyImage
# expects an image as the first argument
# note: we expect the img to have a width and a height, if it doesn't the load event probably didn't happen yes, then we wait for it
# note: resizes the output canvas to the image size, becaue that is what we want most of the time
# note: currently we expect the image to have the sam origin as the HTML, we do not yet deal with a DOM 16 SECURITY EXCEPTION
copyImage = (img, callback, c = makeCanvas()) ->
  if img.width and img.height
    c_ctx = c.getContext('2d')
    c.width = img.width
    c.height = img.height
    c_ctx.drawImage(img, 0,0)
    nonBlock(callback, c) if callback
  else #we wait for the onload event #if there is no onload event of the image or the image is corrupted to not have a height or width, then this will not get executed, ever
    img.onload(()->drawImage2Canvas(img, callback, c))
  #we should work with callbacks, as the returned canvas will probably be useless
  return c


#rotate
#see: http://www.ajaxblender.com/howto-rotate-image-using-javascript-canvas.html
rotateRight =  (c, callback) ->
  #swap width and height for the new canvas
  #c2 = makeCanvas(c.height,c.width)
  #c2_ctx=c2.getContext('2d')
  [c2,c2_ctx] = makeCanvasAndContext(c.height, c.width)
  c2_ctx.rotate(90*Math.PI/180)
  c2_ctx.drawImage(c,0,c.height*-1)
  #call callback
  nonBlock(callback, c2) if callback
  return c2

flip = (c, callback) ->
  [c2,c2_ctx] = makeCanvasAndContext(c.width, c.height)
  #c2_ctx.rotate(180*Math.PI/180)
  c2_ctx.rotate(Math.PI)
  c2_ctx.drawImage(c,c.width*-1,c.height*-1)
  nonBlock(callback, c2) if callback
  return c2

rotateLeft =  (c, callback) ->
  #swap width and height for the new canvas
  #c2 = makeCanvas(c.height,c.width)
  #c2_ctx=c2.getContext('2d')
  [c2,c2_ctx] = makeCanvasAndContext(c.height, c.width)
  c2_ctx.rotate(-90*Math.PI/180)
  c2_ctx.drawImage(c,c.width*-1,0)
  #call callback
  nonBlock(callback, c2) if callback
  return c2

#mirror
# see: http://www.html5canvastutorials.com/advanced/html5-canvas-mirror-transform-tutorial/
mirror = (c, callback) ->
  nonBlock( ->
    [c2,c2_ctx] = makeCanvasAndContext(c.width, c.height)
    c2_ctx.translate(c2.width / 2,0)
    c2_ctx.scale(-1, 1)
    c2_ctx.drawImage(c,(c2.width / 2)*-1,0)
    nonBlock(callback, c2) if callback
    return c2
  )

blackWhite = (c, callback) ->
  bw = () ->
    [width, height] = [c.width, c.height]
    #first we create a copy of the old canvas
    c2 = simpleCopyCanvas(c)
    [c2_ctx, c2_imgd, c2_pixels] = getCanvasToolbox(c2)
    dlog('INBLACKWHITE')
    dlog(getCanvasToolbox(c2))

    #and we make an output canvas which we write to
    [c3, c3_ctx,c3_imgd, c3_pixels] = makeCanvasToolboxLike(c)
    #dlog(c2_pixels)

    y = 0
    dlog(height)
    dlog(width)
    while y < height
      #erste reihe
      x = 0
      while x < width
        current_pixel = (y*width + x) * 4
        #dlog('currentpixel:'+current_pixel)
        [c2_r,c2_g,c2_b,c2_a] = [c2_pixels[current_pixel],c2_pixels[current_pixel+1],c2_pixels[current_pixel+2],c2_pixels[current_pixel+3]]
        factor = (c2_r * 0.3) + (c2_g * 0.59) + (c2_b * 0.11)

        c3_pixels[current_pixel] = factor
        c3_pixels[current_pixel+1] = factor
        c3_pixels[current_pixel+2] = factor
        c3_pixels[current_pixel+3] = c2_a

        #nächste reihe
        x=x+1
      #nächste linie
      y=y+1

    #c.getContext('2d').putImageData(c3_imgd,0,0)
    c3_ctx.putImageData(c3_imgd,0,0)
    nonBlock(callback, c3) if callback
    return c3
  nonBlock(bw)

#export the canvaseffects


window.Canwaste =
  rotateRight: rotateRight
  rotateLeft: rotateLeft
  flip: flip
  mirror: mirror
  copyCanvas: copyCanvas
  simpleCopyCanvas: simpleCopyCanvas
  copyImage: copyImage
  blackWhite: blackWhite






