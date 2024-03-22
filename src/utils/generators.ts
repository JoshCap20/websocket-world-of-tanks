import { Obstacle } from "../models/Obstacle";
import { collidesWithObstacle } from "./collisions";

// Generator Methods
export const generateRandomObstacles = (mapWidth: number, mapHeight: number): Obstacle[] => {
    // TODO: Implement this function
    return [];
};

export const generateRandomPosition = (mapWidth: number, mapHeight: number, width: number, height: number, obstacles: Obstacle[]): { x: number, y: number } => {
    let position = {
        x: Math.random() * (mapWidth - width),
        y: Math.random() * (mapHeight - height),
    };

    while (!collidesWithObstacle(position.x, position.y, width, height, obstacles)) {
        position = {
            x: Math.random() * (mapWidth - width),
            y: Math.random() * (mapHeight - height),
        };
    }

    return position;
}

export const generatePlayerId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}