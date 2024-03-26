// List of conected users
//TODO: Use a database instead
const users = [];

//Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

//Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//user leave chat
function userLeave(id) {
  let index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  //return 'user does not exist';
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};