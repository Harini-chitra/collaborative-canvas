// Simple Express + Socket.io setup
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { addUser, removeUser, getUsersInRoom } = require('./rooms');
const state = require('./drawing-state');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

let ROOM = 'default';

// Serve static files
app.use(express.static('client'));

// Handle connections
io.on('connection', (socket) => {
  // User joins
  socket.on('join', ({ username }) => {
    addUser(socket.id, username, ROOM);
    socket.join(ROOM);

    // Assign color, send online users
    const userColor = state.assignColor(socket.id);
    io.to(ROOM).emit('user_list', getUsersInRoom(ROOM), state.userColorMap);

    // Send current canvas state
    socket.emit('initial_state', state.getState());

    // Broadcast new user
    socket.broadcast.to(ROOM).emit('user_joined', { id: socket.id, color: userColor });
  });

  // Drawing event
  socket.on('draw', (drawData) => {
    state.pushOp(drawData); // Store operation (for undo/redo)
    socket.broadcast.to(ROOM).emit('draw', drawData);
  });

  // Cursor position
  socket.on('cursor', (cursorData) => {
    socket.broadcast.to(ROOM).emit('cursor', { id: socket.id, ...cursorData });
  });

  // Undo/Redo event
  socket.on('undo', () => {
    const op = state.undoOp();
    if (op) io.to(ROOM).emit('restore_state', state.getState());
  });

  socket.on('redo', () => {
    const op = state.redoOp();
    if (op) io.to(ROOM).emit('restore_state', state.getState());
  });

  // User disconnects
  socket.on('disconnect', () => {
    removeUser(socket.id, ROOM);
    state.removeColor(socket.id);
    io.to(ROOM).emit('user_left', socket.id);
    io.to(ROOM).emit('user_list', getUsersInRoom(ROOM), state.userColorMap);
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
