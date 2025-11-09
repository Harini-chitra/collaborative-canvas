# Architecture and Design Document

## Overview

The collaborative canvas application is designed to allow multiple users to draw simultaneously on a shared canvas with real-time synchronization, conflict handling, and undo/redo functionality. It uses a WebSocket-based backend to provide low latency event streaming.

---

## Data Flow Diagram

1. **User Draw Events:**  
   User performs drawing on the HTML5 canvas → frontend serializes drawing segments → sends "draw" events over WebSocket to the Node.js server.

2. **Server Broadcast:**  
   Server receives "draw" events → validates and stores operation in history → broadcasts the events to all connected clients except the sender.

3. **Client Rendering:**  
   Clients listen to WebSocket "draw" events → render strokes segment-by-segment on their canvases → update cursor positions in real-time.

4. **Undo/Redo:**  
   Undo and redo commands trigger server to update global operation history → server broadcasts updated full canvas state → clients refresh canvas to maintain sync.

---

## WebSocket Protocol

- `join`: Client joins with username; server assigns color and sends user list.  
- `draw`: Drawing commands with segments and style info (color, width, eraser).  
- `cursor`: Cursor coordinates and color for live cursor display.  
- `undo` / `redo`: Requests to modify global operation stack and sync canvas state.  
- `user_list` / `user_joined` / `user_left`: User presence updates for UI.

---

## Undo/Redo Strategy

- Server maintains an operation stack and an undo stack.  
- Each draw/erase segment is an atomic operation pushed to the stack.  
- Undo pops from the operation stack and pushes to the undo stack; redo reverses this.  
- After undo/redo, server broadcasts the entire operation stack for clients to replay and redraw consistently.

---

## Conflict Resolution

- All drawing operations are considered atomic and serialized by the server.  
- Overlapping strokes result in last-write-wins rendering on clients.  
- Undo/redo operate globally to ensure consistent canvas state across users.

---

## Performance Optimizations

- Drawing streamed as line segments, not full paths, enabling smooth incremental rendering.  
- Client-side throttling handles pointer events efficiently; no heavy canvas redraws on each event.  
- User cursors drawn on a separate overlay DOM to avoid redrawing entire canvas.

---

## UI/UX Decisions

- Simple, intuitive tools with icons and tooltips.  
- Color presets for quick selection; stroke preview updates live.  
- Unique colors assigned per user for clear visual distinction.  
- Responsive layout with soft gradients and subtle shadows for modern aesthetic.

---

## Future Improvements

- Add user authentication and persisted sessions.  
- Support for mobile touch gestures.  
- Room system for isolated collaborative spaces.  
- Server-side canvas snapshots for state persistence.

