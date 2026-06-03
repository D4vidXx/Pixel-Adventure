import { DurableObject } from "cloudflare:workers";

export interface Env {
  GAME_ROOM: DurableObjectNamespace<GameRoom>;
}

export class GameRoom extends DurableObject {
  private sessions: Map<WebSocket, { name: string; role: 'host' | 'guest' }> = new Map();
  private roomState: any = null;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket connection", { status: 426 });
    }

    const playerName = url.searchParams.get("player") || "Player";
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.handleSession(server, playerName);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  handleSession(ws: WebSocket, playerName: string) {
    ws.accept();

    // Assign role: Host if first player, Guest if second
    let role: 'host' | 'guest' = 'host';
    for (const session of this.sessions.values()) {
      if (session.role === 'host') {
        role = 'guest';
        break;
      }
    }

    this.sessions.set(ws, { name: playerName, role });

    // Send initial connection details back to the joining player
    ws.send(JSON.stringify({
      type: "connected",
      role,
      playerName,
      roomState: this.roomState,
      players: Array.from(this.sessions.values()).map(s => ({ name: s.name, role: s.role })),
    }));

    // Notify other players
    this.broadcast({
      type: "player_joined",
      role,
      name: playerName,
      players: Array.from(this.sessions.values()).map(s => ({ name: s.name, role: s.role })),
    }, ws);

    ws.addEventListener("message", (msg) => {
      try {
        const data = JSON.parse(msg.data as string);
        
        // Cache the latest synced room state
        if (data.type === "sync_state") {
          this.roomState = data.state;
        }

        // Broadcast to other sessions in the room
        this.broadcast(data, ws);
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    });

    ws.addEventListener("close", () => {
      this.sessions.delete(ws);
      this.broadcast({
        type: "player_left",
        role,
        name: playerName,
        players: Array.from(this.sessions.values()).map(s => ({ name: s.name, role: s.role })),
      });
    });

    ws.addEventListener("error", () => {
      this.sessions.delete(ws);
      this.broadcast({
        type: "player_left",
        role,
        name: playerName,
        players: Array.from(this.sessions.values()).map(s => ({ name: s.name, role: s.role })),
      });
    });
  }

  private broadcast(message: any, excludeWs?: WebSocket) {
    const payload = JSON.stringify(message);
    for (const ws of this.sessions.keys()) {
      if (ws === excludeWs) continue;
      try {
        ws.send(payload);
      } catch (e) {
        this.sessions.delete(ws);
      }
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Route for DO Room connections: /api/room/:roomId
    if (url.pathname.startsWith("/api/room/")) {
      const roomId = url.pathname.slice("/api/room/".length);
      if (!roomId) {
        return new Response("Room ID is required", { status: 400 });
      }

      // Generate DO ID from name
      const id = env.GAME_ROOM.idFromName(roomId);
      const stub = env.GAME_ROOM.get(id);

      return stub.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  }
};
