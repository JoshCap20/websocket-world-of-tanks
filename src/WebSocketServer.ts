import WebSocket, { Server } from 'ws';
import http from 'http';

import { Game } from './Game';

export class WebSocketServer {
    private wss: Server;
    private game: Game;

    constructor(server: http.Server) {
        // TODO: Implement WebSocket compression: https://github.com/websockets/ws?tab=readme-ov-file#websocket-compression
        this.wss = new WebSocket.Server({ server });
        this.game = new Game(this.wss);

        this.wss.on('connection', (ws: WebSocket) => {
            this.logNewConnection(ws);
            this.game.addPlayer(ws);

            ws.on('message', (message: string) => {
                this.game.handleSignal(ws, message);
            });
        });
    }

    private logNewConnection(ws: WebSocket) {
        // TODO: Implement logging
        console.log('New connection from', ws.url);
    }
}