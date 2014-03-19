// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  if (window.location.hash) {
    var peer = new Peer({key: 'tu24ikh5mq0bpgb9'});
    // var conn = peer.connect(window.location.hash.slice(1));
    var conn = peer.connect('f8ny3489yovgwh8ab1', {reliable: true});
    window.connection = conn;
    conn.on('open', function(){
      conn.send({connected: true});
      conn.on('data', function(data){
        if (data.state)
          window.Game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager, window.location.hash.slice(1), data.state);
        if (data.seed !== undefined && data.move !== undefined && window.Game.continueGame) {
          // Cache next move
          window.Game.nextMove = [data.move, seed];
          return;

        }
        if (data.move !== undefined) {
            window.Game.move.apply(window.Game, [data.move, true]);
        }
        if (data.seed !== undefined) {
          if (window.Game.continueGame) {
            window.Game.continueGame(data.seed);
            if (window.Game.nextMove) {
              window.Game.move.apply(window.Game, [window.Game.nextMove[0], true])
              window.Game.continueGame(window.Game.nextMove[1]);
              window.Game.nextMove = null;
            }
          }
        }

      });
    });
  } else {
    var peer = new Peer('f8ny3489yovgwh8ab1', {key: 'tu24ikh5mq0bpgb9'});
    peer.on('open', function(id){
      document.querySelector(".room-input").value = 'https://instapainting.com/2x2048/index.html#' + id;
    });
    peer.on('connection', function(conn) {
      window.connection = conn;
      conn.on('data', function(data){
        if (data.connected) {
          window.Game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager, conn.id);
          conn.send({state: window.Game.grid.serialize()});
        }
        if (data.seed !== undefined && data.move !== undefined && window.Game.continueGame) {
          // Cache next move
          window.Game.nextMove = [data.move, data.seed];
          return;

        }
        if (data.move !== undefined) {
            window.Game.move.apply(window.Game, [data.move, true]);
        }
        if (data.seed !== undefined) {
          if (window.Game.continueGame) {
            window.Game.continueGame(data.seed);
            if (window.Game.nextMove) {
              window.Game.move.apply(window.Game, [window.Game.nextMove[0], true])
              window.Game.continueGame(window.Game.nextMove[1]);
              window.Game.nextMove = null;
            }
          }
        }
      });
    });
  }
});
