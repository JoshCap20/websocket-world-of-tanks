import { Bullet } from '../models/Bullet';
import { GameState } from '../models/GameState';
import { Obstacle } from '../models/Obstacle';
import { ICollidable } from '../models/Physics';
import { Tank } from '../models/Tank';

// Collision Detection Methods
export const collidesWith = (a: ICollidable, b: ICollidable): boolean => {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

export const collidesWithAnyObstacle = (object: ICollidable, obstacles: Obstacle[]): boolean => {
    return obstacles.some(obstacle => collidesWith(object, obstacle));
}

export const collidesWithAnyTank = (object: ICollidable, tanks: Tank[]): boolean => {
    return tanks.some(tank => collidesWith(object, tank));
}

export const collidesWithAnyBullet = (object: ICollidable, bullets: Bullet[]): boolean => {
    return bullets.some(bullet => collidesWith(object, bullet));
}

export const collidesWithAnything = (object: ICollidable, gameState: GameState): boolean => {
    return (
        collidesWithAnyObstacle(object, gameState.gameObjects.obstacles) ||
        collidesWithAnyTank(object, Array.from(gameState.gameObjects.tanks.values())) ||
        collidesWithAnyBullet(object, gameState.gameObjects.bullets)
    );
}

export const isValidSpawnPosition = (x: number, y: number, width: number, height: number, gameState: GameState): boolean => {
    const spawnArea: ICollidable = { x, y, width, height };
    return (
        x >= 0 &&
        y >= 0 &&
        x + width <= gameState.mapSize.width &&
        y + height <= gameState.mapSize.height &&
        !collidesWithAnything(spawnArea, gameState)
    );
}
