import WebSocket, { Server } from 'ws';
import http from 'http';

import { Game } from './Game';

export class WebSocketServer {
    private wss: Server;
    private game: Game;
    private clientHeartbeats: Map<WebSocket, boolean>;

    constructor(server: http.Server) {
        // TODO: Implement WebSocket compression: https://github.com/websockets/ws?tab=readme-ov-file#websocket-compression
        this.wss = new WebSocket.Server({ server });
        this.game = new Game(this.wss);
        this.clientHeartbeats = new Map();

        this.wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
            const ip: string | undefined = req.socket.remoteAddress;
            this.logNewConnection(ip);
            this.game.addPlayer(ws);
            this.clientHeartbeats.set(ws, true);

            ws.on('pong', () => this.handleHeartbeat(ws));
            ws.on('message', (message: string) => {
                this.game.handleSignal(ws, message);
            });
            ws.on('close', () => {
                this.clientHeartbeats.delete(ws);
            });
        });

        const interval = setInterval(() => this.pingClients(), 30000);

        this.wss.on('close', () => {
            clearInterval(interval);
        });
    }

    private logNewConnection(ip: string | undefined) {
        // TODO: Implement logging
        console.log('New connection: ', ip);
    }

    private handleHeartbeat(ws: WebSocket) {
        this.clientHeartbeats.set(ws, true);
    }

    private pingClients() {
        this.wss.clients.forEach((ws) => {
            if (!this.clientHeartbeats.get(ws)) {
                return ws.terminate();
            }

            this.clientHeartbeats.set(ws, false);
            ws.ping();
        });
    }
}