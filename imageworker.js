(function() {
  this.onmessage = function(event) {
    throw JSON.stringify({
      data: event.data
    });
    return postMessage("I heard you.");
  };
}).call(this);
