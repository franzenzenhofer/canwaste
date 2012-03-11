# this dev script works together with dev.html
# it requires jQuery as $
# it requries the $().franz()
#
id = 0


$(document).ready(() ->
# interation stuff
  console.log('R E A D Y')

  editor = (canvas) ->
    aid = '_' + id++
    canvas.setAttribute('id', 'canvas'+aid)
    ed = $('<div id="editor'+aid+'"></div>')


    ed.append(canvas)
    ed.append('<br>')


    attachButtonAction = (button, canwaste_action, params...) ->
      button.on('click', ()->
        console.log(@)
        jCanvas = $($(@).attr('target'))
        canvas = jCanvas[0]
        canwaste_action(canvas, ((c) ->
          c.setAttribute('id', canvas.getAttribute('id'))
          jCanvas.replaceWith(c)
        ), params...)
      )
    #attachButtonAction(['1', '2', '3', '4', '5'])

    createActionButton = (name, target, action, params...) ->
      button = $('<button target="'+target+'" class="'+name+'" name="'+name+'">'+name+'</button>')
      attachButtonAction(button, action, params...)
      return button


    #ed.append(createActionButton('mirror', '#canvas'+aid, Canwaste..mirror))
    #ed.append(createActionButton('flip', '#canvas'+aid, Canwaste.flip))
    #ed.append(createActionButton('rotate (right)', '#canvas'+aid, Canwaste.rotateRight))
    #ed.append(createActionButton('rotate (left)', '#canvas'+aid, Canwaste.rotateLeft))
    #ed.append(createActionButton('negative', '#canvas'+aid, Canwaste.neg))
    #ed.append(createActionButton('red', '#canvas'+aid, Canwaste.red))
    #ed.append(createActionButton('blue', '#canvas'+aid, Canwaste.blue))
    #ed.append(createActionButton('green', '#canvas'+aid, Canwaste.green))
    #ed.append(createActionButton('sepia', '#canvas'+aid, Canwaste.sepia))
    #ed.append(createActionButton('posterize', '#canvas'+aid, Canwaste.posterize, 5))
    #ed.append(createActionButton('grayscale', '#canvas'+aid, Canwaste.grayScale))
    #ed.append(createActionButton('blackwhite', '#canvas'+aid, Canwaste.blackWhite))
    #ed.append(createActionButton('tint', '#canvas'+aid, Canwaste.tint, 100, 210))
    #ed.append(createActionButton('mosaic', '#canvas'+aid, Canwaste.mosaic, 20))
    #ed.append(createActionButton('binarize', '#canvas'+aid, Canwaste.binarize, 0.5))
    #ed.append(createActionButton('gausianblur', '#canvas'+aid, Canwaste.gausianBlur, 4))
    #ed.append(createActionButton('edge', '#canvas'+aid, Canwaste.edge))

    #() -> ed.append(createActionButton('edge', '#canvas'+aid, Canwaste.edge)) for
    (ed.append(createActionButton(key, '#canvas'+aid, Canwaste.filter[key]))) for key,value of Canwaste.filter

    ed.append('<span> | </span>')

    (ed.append(createActionButton(key, '#canvas'+aid, Canwaste.effect[key]))) for key,value of Canwaste.effect


    return [ed]

  #$('body').franz({debug:true,  onload_reader_callback:true, image:true, multiple:true}, ic);
  $('body, #dragover, #files').franz((image)->
    #franz start
    #$('#picarea').append(image)
    Canwaste.creator.image2canvas(image, (canvas) ->
      ##ok in this state we create a whole editor element
      #the new canvas element
      # todo newest element should always appear on top
      #$('#picarea').append(canvas)
      #interactive stats
      ed=editor(canvas)
      $('#picarea').append(elem) for elem in ed
    )
    #franz end
  )
# interaction stuff end
)