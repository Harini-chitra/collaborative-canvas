const socket = io();

const websocketAPI = {
  join: username => socket.emit('join', { username }),
  draw: data => socket.emit('draw', data),
  cursor: data => socket.emit('cursor', data),
  undo: () => socket.emit('undo'),
  redo: () => socket.emit('redo'),
  on: (event, cb) => socket.on(event, cb)
};

window.websocketAPI = websocketAPI;
