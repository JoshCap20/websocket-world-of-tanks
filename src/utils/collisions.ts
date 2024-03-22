import { Obstacle } from '../models/Obstacle';
import { Tank } from '../models/Tank';

// Collision Detection Methods
export const collidesWithObstacle = (x: number, y: number, width: number, height: number, obstacles: Obstacle[]): boolean => {
    for (let obstacle of obstacles) {
        if (
            x < obstacle.x + obstacle.width &&
            x + width > obstacle.x &&
            y < obstacle.y + obstacle.height &&
            y + height > obstacle.y
        ) {
            return true;
        }
    }
    return false;
};

export const collidesWithTank = (x: number, y: number, width: number, height: number, tanks: Map<string, Tank>, playerId: string): boolean => {
    for (let [id, tank] of tanks) {
        if (id !== playerId && tank.active) {
            if (
                x < tank.x + tank.width &&
                x + width > tank.x &&
                y < tank.y + tank.height &&
                y + height > tank.y
            ) {
                return true;
            }
        }
    }
    return false;
}