import WebSocket, { Server } from 'ws';
import { generateRandomObstacles, collidesWithObstacle, collidesWithTank } from './utils/gameUtilities';
import { Tank } from './models/Tank';
import { Obstacle } from './models/Obstacle';
import { Bullet } from './models/Bullet';

/*
TODO:
- Add methods for game logic (e.g., updatePlayer, addBullet)
*/


export class Game {
    private wss: Server;
    private mapHeight: number;
    private mapWidth: number;
    private tanks: Map<string, Tank>;
    private bullets: Map<string, Bullet>;
    private aiTanks: Map<string, Tank>;
    private obstacles: Obstacle[];

    constructor(wss: Server) {
        this.wss = wss;
        this.tanks = new Map();
        this.bullets = new Map();
        this.aiTanks = new Map();
        this.mapHeight = Math.random() * 1000 + 1000;
        this.mapWidth = Math.random() * 1000 + 1000;
        this.obstacles = generateRandomObstacles(this.mapWidth, this.mapHeight);
    }

    addPlayer(ws: WebSocket) {
        // TODO: Logic to add a player
    }

    checkCollision(tank: Tank): boolean {
        return this.#checkCollisionWithObstacles(tank.x, tank.y, tank.width, tank.height) || this.#checkCollisionWithTanks(tank.x, tank.y, tank.width, tank.height, tank.id);
    }

    #checkCollisionWithObstacles(x: number, y: number, width: number, height: number): boolean {
        return collidesWithObstacle(x, y, width, height, this.obstacles);
    }

    #checkCollisionWithTanks(x: number, y: number, width: number, height: number, playerId: string): boolean {
        return collidesWithTank(x, y, width, height, this.tanks, playerId);
    }
}
