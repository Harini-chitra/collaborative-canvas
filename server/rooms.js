const users = {};

function addUser(id, username, room) {
  users[id] = { username, room };
}

function removeUser(id, room) {
  delete users[id];
}

function getUsersInRoom(room) {
  return Object.entries(users)
    .filter(([_, u]) => u.room === room)
    .map(([id, u]) => ({ id, username: u.username }));
}

module.exports = { addUser, removeUser, getUsersInRoom };
