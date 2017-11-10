/**
 * @fileoverview resources.js
 * This is a simple image and audio loading utility. It eases the process
 * of loading image and audio files so that they can be used within the game.
 * It also includes a simple 'caching' layer so it will reuse cached images
 * or audio if they are loaded multiple times.
 */


var sounds = [
    new Audio('audio/woman-scream-02.mp3'),
    new Audio('audio/man-scream-ahh-01.mp3'),
    new Audio('audio/coins-to-table-1.mp3'),
    new Audio('audio/magic-chime-01.mp3'),
    new Audio('audio/door-16-open.mp3'),
    new Audio('audio/water-splash-3.mp3'),
    new Audio('audio/fail-trombone-03.mp3')
];


(function() {
    var resourceCache = {},
        loading = [],
        readyCallbacks = [];

  
    function load(urlOrArr) {
      if(urlOrArr instanceof Array) {
    
       
          urlOrArr.forEach(function(url) {
          _load(url);
        });
      }else {
    
        
        _load(urlOrArr);
      }
    }

    
    function _load(url) {
      if(resourceCache[url]) {
        
        return resourceCache[url];
      }else {
        
        var img = new Image();
        img.onload = function() {

          
          resourceCache[url] = img;

          
          if(isReady()) {
            readyCallbacks.forEach(function(func) { func(); });
          }
        };

       
        resourceCache[url] = false;
        img.src = url;
      }
    }

    
    function get(url) {
      return resourceCache[url];
    }

    
    function isReady() {
      var ready = true;

      for(var k in resourceCache) {
        if(resourceCache.hasOwnProperty(k) &&
         !resourceCache[k]) {
          ready = false;
        }
      }
      return ready;
    }

    
    function onReady(func) {
      readyCallbacks.push(func);
    }

    
    window.Resources = {
      load: load,
      get: get,
      onReady: onReady,
      isReady: isReady
    };
})();
