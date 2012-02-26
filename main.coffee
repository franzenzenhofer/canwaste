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

rotateRight90 =  (c, callback) ->
  #swap width and height for the new canvas
  #c2 = makeCanvas(c.height,c.width)
  #c2_ctx=c2.getContext('2d')
  [c2,c2_ctx] = makeCanvasAndContext(c.height, c.width)
  c2_ctx.rotate(90*Math.PI/180)
  c2_ctx.drawImage(c,0,c.height*-1)
  #call callback
  nonBlock(callback, c2) if callback
  return c2

#mirror
# see: http://www.html5canvastutorials.com/advanced/html5-canvas-mirror-transform-tutorial/
mirror = (c, callback) ->
  #c2 = makeCanvas(c.width,c.height)
  #c2_ctx = c2.getContext('2d')
  [c2,c2_ctx] = makeCanvasAndContext(c.width, c.height)
  c2_ctx.translate(c2.width / 2,0)
  c2_ctx.scale(-1, 1)
  c2_ctx.drawImage(c,(c2.width / 2)*-1,0)
  nonBlock(callback, c2) if callback
  return c2

#export the canvaseffects


window.Canwaste =
  rotateRight90: rotateRight90
  copyCanvas: copyCanvas
  simpleCopyCanvas: simpleCopyCanvas
  copyImage: copyImage
  mirror: mirror


