@onmessage = (event) ->
    # event.data holds the call's string
    #console.log event.data
    throw JSON.stringify({data:event.data})
    postMessage "I heard you."