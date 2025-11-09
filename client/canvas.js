const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cursorOverlay = document.getElementById('cursor-overlay');

let tool = 'brush', color = document.getElementById('colorPicker').value;
let width = parseInt(document.getElementById('strokeWidth').value);
let drawing = false, path = [];
let cursors = {};
let isEraser = false;

document.getElementById('colorPicker').oninput = e => {
  color = e.target.value;
  tool = 'brush'; 
  isEraser = false;
  setActiveTool('brush');
  updateStrokePreview();
};
document.getElementById('strokeWidth').oninput = e => {
  width = parseInt(e.target.value);
  updateStrokePreview();
};
document.getElementById('brush').onclick = () => {
  tool = 'brush';
  isEraser = false;
  setActiveTool('brush');
  updateStrokePreview();
};
document.getElementById('eraser').onclick = () => {
  tool = 'eraser';
  isEraser = true;
  setActiveTool('eraser');
  updateStrokePreview();
};
document.getElementById('undo').onclick = () => window.websocketAPI.undo();
document.getElementById('redo').onclick = () => window.websocketAPI.redo();

function setActiveTool(id) {
  [...document.getElementsByClassName('tool')].forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function updateStrokePreview() {
  const preview = document.getElementById('strokePreview');
  preview.style.width = `${width}px`;
  preview.style.height = `${width}px`;
  preview.style.background = isEraser ? '#fcfcff' : color;
  preview.style.boxShadow = isEraser ? '0 0 6px #aaa' : `0 0 8px ${color}aa`;
}

updateStrokePreview();
function relPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * canvas.width / rect.width,
    y: (e.clientY - rect.top) * canvas.height / rect.height
  };
}
canvas.onpointerdown = (e) => {
  drawing = true;
  path = [];
  addPoint(e);
  canvas.setPointerCapture(e.pointerId);
};
canvas.onpointermove = (e) => {
  if (drawing) addPoint(e);
  sendCursor(e);
};
canvas.onpointerup = endDraw;
canvas.onpointercancel = endDraw;

function addPoint(e) {
  const { x, y } = relPos(e);
  path.push({ x, y });
  if (path.length > 1) {
    drawSegment(path[path.length - 2], path[path.length - 1], getDrawColor(), width);
    window.websocketAPI.draw({
      type: tool,
      path: [path[path.length - 2], path[path.length - 1]],
      color: getDrawColor(),
      width,
      user: username
    });
  }
}

function getDrawColor() {
  return isEraser ? "#fcfcff" : color;
}

function endDraw() {
  drawing = false;
  path = [];
}

function drawSegment(a, b, color, width) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.restore();
}

function replayOps(ops) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const op of ops) {
    if (op.type === 'brush' || op.type === 'eraser')
      drawSegment(op.path[0], op.path[1], op.color, op.width);
  }
}

window.websocketAPI.on('draw', data => {
  drawSegment(data.path[0], data.path[1], data.color, data.width);
});

window.websocketAPI.on('initial_state', replayOps);
window.websocketAPI.on('restore_state', replayOps);
function sendCursor(e) {
  const { x, y } = relPos(e);
  window.websocketAPI.cursor({ x, y, color: getDrawColor() });
}

window.websocketAPI.on('cursor', data => {
  cursors[data.id] = data;
  drawCursors();
});

window.websocketAPI.on('user_left', id => {
  delete cursors[id];
  drawCursors();
});

function drawCursors() {
  cursorOverlay.innerHTML = '';
  Object.entries(cursors).forEach(([id, c]) => {
    const marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.left = (c.x - 7) + 'px';
    marker.style.top = (c.y - 7) + 'px';
    marker.style.width = "14px";
    marker.style.height = "14px";
    marker.style.borderRadius = "50%";
    marker.style.border = "2px solid #fff";
    marker.style.boxShadow = "0 2px 10px rgba(30,50,100,.18)";
    marker.style.background = c.color;
    marker.style.opacity = 0.7;
    cursorOverlay.appendChild(marker);
  });
}
