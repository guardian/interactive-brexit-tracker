export default function tracker(event_type,data) {

    var w = window.parent;
    var isTracking = (w.ga) ? true : false;
    var initialized = false;
    var events = {};
  
  
      // console.log('event fired')
      // console.log("isTracking", isTracking, 'isInitialized', initialized);
      //is tracking
      if (isTracking) {
  
        //make sure initialized
        if (!initialized) {
          //console.log('init tracking')
          w.ga('create', 'UA-78705427-1', 'auto');
          w.ga('set', 'dimension3', 'theguardian.com');
          initialized = true;
        }
        //send event
  
        // console.log(event_type, data);
        w.ga("send", "event", "interactives", event_type, 'bigbrexitvote_' + data);
      }
    
    return ''
  
  }