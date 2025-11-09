# Real-Time Collaborative Drawing Canvas

A multi-user real-time drawing application where users can simultaneously draw on a shared canvas with live synchronization. Built with vanilla JavaScript, HTML5 Canvas, Node.js, and Socket.io.

---

## Demo

Live demo deployed on Railway:  
[Click Here!!](https://collaborative-canvas-production-04b3.up.railway.app/)

---

## Features

- Drawing Tools: Brush and eraser with adjustable colors and stroke width  
- Real-time Sync: See other users’ drawings and cursor positions instantly  
- User Indicators: Colored bubbles and live cursors show who's drawing where  
- Undo/Redo: Global undo/redo affecting all connected users  
- User Management: Shows who is online with assigned colors  
- Modern, intuitive UI with color presets and stroke size preview  
- Responsive for desktop browsers, touch-action disabled for drawing accuracy  

---

## Tech Stack

- Frontend: Vanilla JavaScript, HTML5 Canvas, CSS  
- Backend: Node.js, Express, Socket.io for WebSocket communication  
- Deployment: Railway.app  

---

## Setup Instructions

1. Clone the repository  
https://github.com/Harini-chitra/collaborative-canvas

- cd collaborative-canvas
2. Install dependencies
  
- npm install
3. Run development server locally

- npm start
4. Open your browser at `http://localhost:3000` and start collaborating!

---

## How to Test Multi-User

- Open the app in multiple tabs or different browsers (or different devices on the same network).  
- Draw in one tab; drawings and cursors will appear live in the others.

---

## Known Limitations / Bugs

- Undo and redo work globally and may cause slight redraw delay under heavy load.  
- Cursor rendering may flicker with very high concurrency.  
- No authentication implemented; username assigned randomly per session.

---

## Time Spent

Approximately 12-15 hours developing, testing, and deploying, including UI polishing and real-time synchronization logic.

---

## License

MIT License. Feel free to use and enhance!


