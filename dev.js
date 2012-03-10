(function() {
  var id;
  id = 0;
  $(document).ready(function() {
    var editor;
    console.log('R E A D Y');
    editor = function(canvas) {
      var aid, attachButtonAction, createActionButton, ed;
      aid = '_' + id++;
      canvas.setAttribute('id', 'canvas' + aid);
      ed = $('<div id="editor' + aid + '"></div>');
      ed.append(canvas);
      ed.append('<br>');
      attachButtonAction = function(button, canwaste_action) {
        return button.on('click', function() {
          var jCanvas;
          jCanvas = $($(this).attr('target'));
          canvas = jCanvas[0];
          return canwaste_action(canvas, function(c) {
            c.setAttribute('id', canvas.getAttribute('id'));
            return jCanvas.replaceWith(c);
          });
        });
      };
      createActionButton = function(name, target, action) {
        var button;
        button = $('<button target="' + target + '" class="' + name + '" name="' + name + '">' + name + '</button>');
        attachButtonAction(button, action);
        return button;
      };
      ed.append(createActionButton('mirror', '#canvas' + aid, Canwaste.mirror));
      ed.append(createActionButton('flip', '#canvas' + aid, Canwaste.flip));
      ed.append(createActionButton('rotate (right)', '#canvas' + aid, Canwaste.rotateRight));
      ed.append(createActionButton('rotate (left)', '#canvas' + aid, Canwaste.rotateLeft));
      ed.append(createActionButton('negative', '#canvas' + aid, Canwaste.neg));
      ed.append(createActionButton('red', '#canvas' + aid, Canwaste.red));
      ed.append(createActionButton('blue', '#canvas' + aid, Canwaste.blue));
      ed.append(createActionButton('green', '#canvas' + aid, Canwaste.green));
      ed.append(createActionButton('sepia', '#canvas' + aid, Canwaste.sepia));
      return [ed];
    };
    return $('body, #dragover, #files').franz(function(image) {
      return Canwaste.image2canvas(image, function(canvas) {
        var ed, elem, _i, _len, _results;
        ed = editor(canvas);
        _results = [];
        for (_i = 0, _len = ed.length; _i < _len; _i++) {
          elem = ed[_i];
          _results.push($('#picarea').append(elem));
        }
        return _results;
      });
    });
  });
}).call(this);
