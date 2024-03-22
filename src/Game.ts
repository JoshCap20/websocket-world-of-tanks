import WebSocket, { Server } from 'ws';

import { generateRandomObstacles, generatePlayerId, generateRandomPosition } from './utils/generators';
import { collidesWithObstacle, collidesWithTank } from './utils/collisions';
import { generateDestroyedPayload, generateLevelUpPayload } from './utils/signals';
import { Tank } from './models/Tank';
import { Obstacle } from './models/Obstacle';
import { Bullet } from './models/Bullet';
import { GameState } from './models/GameState';

/*
TODO:
- Add methods for game logic (e.g., updatePlayer, addBullet)
*/


export class Game {
    private wss: Server;
    private gameState: GameState;
    private aiTanks: Map<string, Tank>;

    constructor(wss: Server) {
        this.wss = wss;
        this.gameState = this.generateGameState();
        this.aiTanks = new Map();
    }

    generateMapSize(): { height: number, width: number } {
        return {
            height: Math.random() * 1000 + 1000,
            width: Math.random() * 1000 + 1000,
        };
    }

    generateGameState(): GameState {
        const mapSize = this.generateMapSize();
        return {
            mapSize: {
                height: mapSize.height,
                width: mapSize.width,
            },
            gameObjects: {
                tanks: new Map(),
                bullets: new Map(),
                obstacles: generateRandomObstacles(mapSize.width, mapSize.height),
            }
        };
    }

    // Core Player Management Methods (should refactor to a separate Player Management class eventually)
    addPlayer(ws: WebSocket): Tank {
        const playerId: string = generatePlayerId();
        const newPlayer: Tank = this.generateTank(playerId);
        this.gameState.gameObjects.tanks.set(playerId, newPlayer);
        return newPlayer;
    }

    removePlayer(playerId: string): void {
        this.gameState.gameObjects.tanks.delete(playerId);
    }

    // Core Signal Sending Methods (should refactor to a separate Signal Gateway class eventually)
    broadcastGameState(): void {
        this.wss.clients.forEach((client: WebSocket) => {
            client.send(JSON.stringify(this.gameState));
        });
    }

    broadcastPlayerLevelUp(player: Tank): void {
        this.wss.clients.forEach((client: WebSocket) => {
            client.send(JSON.stringify(generateLevelUpPayload(player.id, player.level)));
        });
    }

    broadcastPlayerDeath(playerId: string): void {
        this.wss.clients.forEach((client: WebSocket) => {
            client.send(JSON.stringify(generateDestroyedPayload(playerId)));
        });
    }

    // Tank Factory Method
    generateTank(playerId: string): Tank {
        const spawnPosition = generateRandomPosition(this.gameState.mapSize.width, this.gameState.mapSize.height, 50, 50, this.gameState.gameObjects.obstacles);
        return {
            id: playerId,
            x: spawnPosition.x,
            y: spawnPosition.y,
            width: 50,
            height: 50,
            rotation: 0,
            health: 100,
            level: 1,
            speed: 5,
            kills: 0,
            active: true,
            lastShot: Date.now(),
            isAI: false
        };
    }

    // Collision Detection Methods (should refactor to a separate Physics class eventually)
    checkCollision(tank: Tank): boolean {
        return this.#checkCollisionWithObstacles(tank.x, tank.y, tank.width, tank.height) || this.#checkCollisionWithTanks(tank.x, tank.y, tank.width, tank.height, tank.id);
    }

    #checkCollisionWithObstacles(x: number, y: number, width: number, height: number): boolean {
        return collidesWithObstacle(x, y, width, height, this.gameState.gameObjects.obstacles);
    }

    #checkCollisionWithTanks(x: number, y: number, width: number, height: number, playerId: string): boolean {
        return collidesWithTank(x, y, width, height, this.gameState.gameObjects.tanks, playerId);
    }
}
