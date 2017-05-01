var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var serverName = 'MrServer';
var users = [];

var answer = -1;

var State = {
  WAIT: 1,
  WAIT_FOR_NUMBER: 2,
  WAIT_FOR_ANSWER: 3,
};

var state = State.WAIT;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var resetGame = function() {
  state = State.WAIT;
};

var updateStateWaitForAnswer = function (msg, user) {
  var response = '';

  if (msg == parseInt(msg)) {
    if (msg == answer) {
        response = '[Congratulations to user: ' + users.indexOf(user) + ' for guessing the correct number: ' + msg + ']';
        state = State.WAIT;
    } else 
        response = '[' + msg + ' is not the correct number]';
  } else {
    response = '[' + msg + ' is not a number]';
  }
  io.emit('chat message', response);
};

var updateStateWaitForNumber = function (msg, user) {
  if (!(msg == parseInt(msg))) {
    io.emit('chat message', msg + ' is not a number');
    return;
  } else {
    answer = msg;
    state = State.WAIT_FOR_ANSWER;
    io.emit('chat message', '[We have a secret number, try to guess it]');
  }
};

var updateStateWait = function (msg, user) {
  if (msg == 'start') {
    state = State.WAIT_FOR_NUMBER;
    io.emit('chat message', '[Server is waiting for someone to give a secret number]');
  } else {
    io.emit('chat message', '[User:' + users.indexOf(user) + ']' + msg);
  }
};

io.on('connection', function (socket) {
  if (!users.includes(socket)) {
    users.push(socket);
    console.log('Added ' + socket + " to users");
  }

  socket.on('chat message', function (msg) {
    if (msg == 'reset') {
      resetGame();
      io.emit('chat message', '[Game has been reset]');
      return;
    }

    switch (state) {
      case State.WAIT:                   updateStateWait(msg, socket);                 break;
      case State.WAIT_FOR_NUMBER:        updateStateWaitForNumber(msg, socket);        break;
      case State.WAIT_FOR_ANSWER:        updateStateWaitForAnswer(msg, socket);        break;
    }
  });
});



http.listen(port, function () {
  console.log('listening on *:' + port);
});