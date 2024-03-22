import WebSocket, { Server } from 'ws';
import http from 'http';

import { Game } from './Game';

export class WebSocketServer {
    private wss: Server;
    private game: Game;

    constructor(server: http.Server) {
        this.wss = new WebSocket.Server({ server });
        this.game = new Game(this.wss);

        this.wss.on('connection', (ws: WebSocket) => {
            this.game.addPlayer(ws);
        });
    }
}