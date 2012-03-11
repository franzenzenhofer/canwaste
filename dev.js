(function() {
  var id;
  var __slice = Array.prototype.slice;
  id = 0;
  $(document).ready(function() {
    var editor;
    console.log('R E A D Y');
    editor = function(canvas) {
      var aid, attachButtonAction, createActionButton, ed, key, value, _ref, _ref2;
      aid = '_' + id++;
      canvas.setAttribute('id', 'canvas' + aid);
      ed = $('<div id="editor' + aid + '"></div>');
      ed.append(canvas);
      ed.append('<br>');
      attachButtonAction = function() {
        var button, canwaste_action, params;
        button = arguments[0], canwaste_action = arguments[1], params = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        return button.on('click', function() {
          var jCanvas;
          console.log(this);
          jCanvas = $($(this).attr('target'));
          canvas = jCanvas[0];
          return canwaste_action.apply(null, [canvas, (function(c) {
            c.setAttribute('id', canvas.getAttribute('id'));
            return jCanvas.replaceWith(c);
          })].concat(__slice.call(params)));
        });
      };
      createActionButton = function() {
        var action, button, name, params, target;
        name = arguments[0], target = arguments[1], action = arguments[2], params = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
        button = $('<button target="' + target + '" class="' + name + '" name="' + name + '">' + name + '</button>');
        attachButtonAction.apply(null, [button, action].concat(__slice.call(params)));
        return button;
      };
      _ref = Canwaste.filter;
      for (key in _ref) {
        value = _ref[key];
        ed.append(createActionButton(key, '#canvas' + aid, Canwaste.filter[key]));
      }
      ed.append('<span> | </span>');
      _ref2 = Canwaste.effect;
      for (key in _ref2) {
        value = _ref2[key];
        ed.append(createActionButton(key, '#canvas' + aid, Canwaste.effect[key]));
      }
      return [ed];
    };
    return $('body, #dragover, #files').franz(function(image) {
      return Canwaste.creator.image2canvas(image, function(canvas) {
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
