import { Bullet } from '../models/Bullet';
import { Obstacle } from '../models/Obstacle';
import { Tank } from '../models/Tank';

// Collision Detection Methods
export const collidesWithObstacle = (tank: Tank, obstacle: Obstacle): boolean => {
    return (
        tank.x < obstacle.x + obstacle.width &&
        tank.x + tank.width > obstacle.x &&
        tank.y < obstacle.y + obstacle.height &&
        tank.y + tank.height > obstacle.y
    );
}

export const collidesWithTank = (tank: Tank, otherTank: Tank): boolean => {
    return (
        tank.x < otherTank.x + otherTank.width &&
        tank.x + tank.width > otherTank.x &&
        tank.y < otherTank.y + otherTank.height &&
        tank.y + tank.height > otherTank.y
    );
}

export const collidesWithBullet = (tank: Tank, bullet: Bullet): boolean => {
    return (
        tank.x < bullet.x + bullet.width &&
        tank.x + tank.width > bullet.x &&
        tank.y < bullet.y + bullet.height &&
        tank.y + tank.height > bullet.y
    );
}