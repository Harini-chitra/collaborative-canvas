const username = 'User' + Math.floor(Math.random() * 9999);
const usernameDisplay = document.getElementById('usernameDisplay');
usernameDisplay.textContent = "You: " + username;

window.websocketAPI.join(username);
window.websocketAPI.on('user_list', (users, colorMap) => {
  const usersDiv = document.getElementById('usersOnline');
  usersDiv.innerHTML = '';
  users.forEach(u => {
    const bubble = document.createElement('div');
    bubble.className = 'user-bubble';
    bubble.style.background = colorMap[u.id] || "#bbb";
    bubble.textContent = u.username.slice(0, 2).toUpperCase() || "?";
    bubble.title = u.username;
    usersDiv.appendChild(bubble);
  });
});

const presets = ["#4287f5", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#34495e", "#d35400", "#16a085"];
const presetsDiv = document.getElementById('colorPresets');
presets.forEach(c => {
  const swatch = document.createElement('div');
  swatch.className = 'color-swatch';
  swatch.style.background = c;
  swatch.title = c;
  swatch.addEventListener('click', () => {
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.value = c;
    colorPicker.dispatchEvent(new Event('input'));
  });
  presetsDiv.appendChild(swatch);
});
