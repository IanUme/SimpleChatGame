# chat-example

This project's source is mainly from [Socket.IO website's tutorial](http://socket.io/get-started/chat/)

This is sample code to write server-side code with states for a very simplistic text-based game.

You must install express and socket.io
    
    npm install --save express@4.15.2

    npm install --save socket.io

If a user types "start" the guessing game will start.
Any user may type a number to make it the hidden number.
Any user (including the one who sent the hidden number) may guess which number it is.
Any user may type "reset" at anytime to restart the server to the original state.

[Here is the original project](https://github.com/socketio/chat-example)