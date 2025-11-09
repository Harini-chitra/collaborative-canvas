const COLORS = ['#f54242', '#4287f5', '#42f554', '#f5e142', '#a142f5', '#f58242'];
const userColorMap = {};
const operationStack = [];
let undoStack = [];
function assignColor(id) {
  userColorMap[id] = COLORS[Object.keys(userColorMap).length % COLORS.length];
  return userColorMap[id];
}

function removeColor(id) {
  delete userColorMap[id];
}

function pushOp(operation) {
  operationStack.push(operation);
  undoStack = [];
}

function undoOp() {
  if (operationStack.length > 0) {
    const op = operationStack.pop();
    undoStack.push(op);
    return op;
  }
  return null;
}

function redoOp() {
  if (undoStack.length > 0) {
    const op = undoStack.pop();
    operationStack.push(op);
    return op;
  }
  return null;
}

function getState() {
  return [...operationStack];
}

module.exports = {
  assignColor,
  removeColor,
  userColorMap,
  pushOp,
  undoOp,
  redoOp,
  getState,
};
