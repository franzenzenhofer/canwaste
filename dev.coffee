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


    attachButtonAction = (button, canwaste_action) ->
      button.on('click', ()->
        jCanvas = $($(@).attr('target'))
        canvas = jCanvas[0]
        canwaste_action(canvas, (c) ->
          c.setAttribute('id', canvas.getAttribute('id'))
          jCanvas.replaceWith(c)
        )
      )

    createActionButton = (name, target, action) ->
      button = $('<button target="'+target+'" class="'+name+'" name="'+name+'">'+name+'</button>')
      attachButtonAction(button, action)
      return button


    ed.append(createActionButton('mirror', '#canvas'+aid, Canwaste.mirror))
    ed.append(createActionButton('flip', '#canvas'+aid, Canwaste.flip))
    ed.append(createActionButton('rotate (right)', '#canvas'+aid, Canwaste.rotateRight))
    ed.append(createActionButton('rotate (left)', '#canvas'+aid, Canwaste.rotateLeft))
    ed.append(createActionButton('negative', '#canvas'+aid, Canwaste.neg))
    ed.append(createActionButton('red', '#canvas'+aid, Canwaste.red))
    ed.append(createActionButton('blue', '#canvas'+aid, Canwaste.blue))
    ed.append(createActionButton('green', '#canvas'+aid, Canwaste.green))
    ed.append(createActionButton('sepia', '#canvas'+aid, Canwaste.sepia))

    return [ed]

  #$('body').franz({debug:true,  onload_reader_callback:true, image:true, multiple:true}, ic);
  $('body, #dragover, #files').franz((image)->
    #franz start
    #$('#picarea').append(image)
    Canwaste.image2canvas(image, (canvas) ->
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