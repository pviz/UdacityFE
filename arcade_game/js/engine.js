
var Engine = (function(global) {

   
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

        canvas.width = 808;
        canvas.height = 606;

        document.body.appendChild(canvas);

    
    function main() {

      
      var now = Date.now(),
          dt = (now - lastTime) / 1000.0;

      
      if (!player.paused) {
          update(dt);
          render();
      }

      
      lastTime = now;

      
      win.requestAnimationFrame(main);
    };

    
    function init() {
      lastTime = Date.now();
      main();
    }

   
    function update(dt) {
      updateEntities(dt);
    }

    
    function updateEntities(dt) {
      allEnemies.forEach(function(enemy) {
        enemy.update(dt);
      });

      player.update();
    }

    
    function render() {
      //Initial header text and values
      document.getElementsByClassName('lives')[0].innerHTML = 'Lives:  ' +
        player.lives.join(' ');
      document.getElementsByClassName('level')[0].innerHTML = 'Level:  ' +
        player.level;
      document.getElementsByClassName('score')[0].innerHTML = 'Score:  ' +
        player.score;

     
      var rowImages = [
        'images/water-block.png',   // Top row is water
        'images/stone-block.png',   // Row 1 of 4 of stone
        'images/stone-block.png',   // Row 2 of 4 of stone
        'images/stone-block.png',   // Row 3 of 4 of stone
        'images/stone-block.png',   // Row 1 of 4 of stone
        'images/grass-block.png'    // Row 1 of 1 of grass
        ],
        numRows = 6,
        numCols = 8,
        row, 
        col;
              
     
      for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {

            if (row == 0 && col == player.exit) {
                ctx.drawImage(Resources.get('images/door.png'), col * 101, row * 83);
            } else {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
      }

      renderEntities();
    }

    
    function renderEntities() {
        allEnemies.forEach(function(enemy) {
           enemy.render();
        });

        player.render();
        item.render();
    }

     
    Resources.load([
      'images/stone-block.png',
      'images/water-block.png',
      'images/grass-block.png',
      'images/door.png',
      'images/enemy-bug-1.png',
      'images/Gem_Blue.png',
      'images/Gem_Green.png',
      'images/Gem_Orange.png',
      'images/Heart.png',
      'images/char-1.png',
      'images/char-2.png',
      'images/char-3.png',
      'images/char-4.png',
      'images/char-5.png'
    ]);

    Resources.onReady(init);

   
    global.ctx = ctx;
})(this);
