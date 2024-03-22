import WebSocket, { Server } from 'ws';

import { generateRandomObstacles, generatePlayerId, generateRandomPosition } from './utils/generators';
import { collidesWith, collidesWithAnyBullet, collidesWithAnyObstacle, collidesWithAnyTank, collidesWithAnything } from './utils/collisions';
import { generateDestroyedPayload, generateLevelUpPayload, generatePlayerJoinedPayload } from './utils/signals';
import { Tank } from './models/Tank';
import { Obstacle } from './models/Obstacle';
import { Bullet } from './models/Bullet';
import { GameState } from './models/GameState';
import { SignalHandler } from './SignalHandler';

/*
TODO:
- Add methods for game logic (e.g., updatePlayer, addBullet)
*/


export class Game {
    private signalHandler: SignalHandler;
    private updateInterval!: NodeJS.Timeout;

    private gameState: GameState;
    private aiTanks: string[];

    constructor(wss: Server) {
        this.signalHandler = new SignalHandler(this, wss);

        this.gameState = this.generateGameState();
        this.aiTanks = []; // IDs of AI tanks

        this.startGameLoop();
    }

    // Core Player Management Methods (should refactor to a separate Player Management class eventually)
    public addPlayer(ws: WebSocket): void {
        const playerId: string = generatePlayerId();
        const newPlayer: Tank = this.generateTank(playerId);
        this.gameState.gameObjects.tanks.set(playerId, newPlayer);
        this.unicastPlayerJoined(ws, playerId);
    }

    public removePlayer(playerId: string): void {
        this.gameState.gameObjects.tanks.delete(playerId);
    }

    // TODO: Define model for data from frontend after thats redesigned
    public updatePlayer(playerId: string, data: any): void {
        const player: Tank | undefined = this.gameState.gameObjects.tanks.get(playerId);
        if (player) {
            player.x = data.x;
            player.y = data.y;
            player.rotation = data.rotation;
            player.lastShot = data.lastShot;
            player.health = data.health;
            player.kills = data.kills;
            player.level = data.level;

            this.broadcastGameState();
        }
    }

    // Bullet methods (refactor to a separate Bullet Handler class eventually)
    public addBullet(playerId: string): void {
        const player: Tank | undefined = this.gameState.gameObjects.tanks.get(playerId);
        if (player && Date.now() - player.lastShot > 1000) {
            const bullet: Bullet = {
                x: player.x,
                y: player.y,
                height: player.height / 2,
                width: player.width / 2,
                rotation: player.rotation,
                playerId: playerId,
                timeToLive: 1000,
            };
            this.gameState.gameObjects.bullets.push(bullet);

            player.lastShot = Date.now();
            this.broadcastGameState();
        }
    }

    private updateBullets(): void {
        this.gameState.gameObjects.bullets.forEach((bullet: Bullet) => {
            bullet.x += Math.cos(bullet.rotation) * 10;
            bullet.y += Math.sin(bullet.rotation) * 10;
            bullet.timeToLive -= 1;
        });

        this.gameState.gameObjects.bullets = this.gameState.gameObjects.bullets.filter((bullet: Bullet) => bullet.timeToLive > 0);
    }

    // Core Signal Sending Methods (should refactor to a separate Signal Gateway class eventually)
    public handleSignal(ws: WebSocket, message: string): void {
        this.signalHandler.handleSignal(ws, message);
    }

    protected broadcastGameState(): void {
        this.signalHandler.broadcast(JSON.stringify(this.gameState));
    }

    protected broadcastPlayerLevelUp(player: Tank): void {
        this.signalHandler.broadcast(JSON.stringify(generateLevelUpPayload(player.id, player.level)));
    }

    protected broadcastPlayerDeath(playerId: string): void {
        this.signalHandler.broadcast(JSON.stringify(generateDestroyedPayload(playerId)));
    }

    protected unicastPlayerJoined(ws: WebSocket, playerId: string): void {
        this.signalHandler.unicast(ws, JSON.stringify(generatePlayerJoinedPayload(playerId)));
    }


    // Tank Factory Method
    private generateTank(playerId: string): Tank {
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
    private checkCollisionWithBullets(tank: Tank): boolean {
       return collidesWithAnyBullet(tank, this.gameState.gameObjects.bullets);
    }

    private checkCollisionWithTanks(tank: Tank): boolean {
        return collidesWithAnyTank(tank, Array.from(this.gameState.gameObjects.tanks.values()));
    }

    private checkCollisionWithObstacles(tank: Tank): boolean {
        return collidesWithAnyObstacle(tank, this.gameState.gameObjects.obstacles);
    }

    private checkCollisionWithBullet(tank: Tank, bullet: Bullet): boolean {
        return collidesWith(tank, bullet);
    }

    private checkCollisionWithTank(tank: Tank, otherTank: Tank): boolean {
        return collidesWith(tank, otherTank);
    }

    private checkCollisionWithObstacle(tank: Tank, obstacle: Obstacle): boolean {
        return collidesWith(tank, obstacle);
    }

    // Map and Game Factory Methods
    private generateMapSize(): { height: number, width: number } {
        return {
            height: Math.random() * 1000 + 1000,
            width: Math.random() * 1000 + 1000,
        };
    }

    private generateGameState(): GameState {
        const mapSize = this.generateMapSize();
        return {
            mapSize: {
                height: mapSize.height,
                width: mapSize.width,
            },
            gameObjects: {
                tanks: new Map(),
                bullets: new Array(),
                obstacles: generateRandomObstacles(mapSize.width, mapSize.height),
            }
        };
    }

    // Game Loop Methods
    startGameLoop() {
        const fps = 60;
        this.updateInterval = setInterval(() => {
            this.updateGameObjects();
            this.broadcastGameState();
        }, 1000 / fps);
    }

    updateGameObjects() {
        // Update bullets
        this.updateBullets();
        
        // TODO: Handle collisions
    }

    stopGameLoop() {
        clearInterval(this.updateInterval);
    }
}
