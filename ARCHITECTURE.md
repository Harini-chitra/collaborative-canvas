Explain:

How draw ops are streamed (serialized {type, path, color, width, user} JSON objects)

Why one stroke = many line segments (path optimization for smoothness & latency)

Undo/redo: Every new op (draw/erase) adds to stack; undo pops and broadcasts new state; redo re-adds

How cursors and user management work

Canvas is always replayed from list-of-ops for consistency.

Global tools, pitfalls, and optimizations (minimal events, color/user assignment math, anti-ghosting for cursors).