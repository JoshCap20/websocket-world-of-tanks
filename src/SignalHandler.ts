import WebSocket, { Server } from 'ws';
import { Tank } from './models/Tank';
import { GameState } from './models/GameState';
import { Game } from './Game';

export class SignalHandler {
    private game: Game;
    private wss: Server;

    constructor(game: Game, wss: Server) {
        this.game = game;
        this.wss = wss;
    }

    public handleSignal(ws: WebSocket, message: string) {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'update':
                this.game.updatePlayer(data.playerId, data);
                break;
            case 'fire':
                this.game.addBullet(data.playerId);
            case 'disconnect':
                this.game.removePlayer(data.playerId);
                break;
        }
    }

    public unicast(ws: WebSocket, payload: string): void {
        ws.send(payload);
    }

    public broadcast(payload: string): void {
        this.wss.clients.forEach((client: WebSocket) => {
            client.send(payload);
        });
    }
}
