import { GameState } from "../models/GameState";
import { Obstacle } from "../models/Obstacle";
import { isValidSpawnPosition } from "./collisions";

// Generator Methods
export const generateRandomObstacles = (mapWidth: number, mapHeight: number): Obstacle[] => {
    // TODO: Implement this function
    return [];
};

export const generateRandomPosition = (width: number, height: number, gameState: GameState): { x: number, y: number } => {
    let position = {
        x: Math.random() * (gameState.mapSize.width - width),
        y: Math.random() * (gameState.mapSize.height - height),
    };

    while (!isValidSpawnPosition(position.x, position.y, width, height, gameState)) {
        position = {
            x: Math.random() * (gameState.mapSize.width - width),
            y: Math.random() * (gameState.mapSize.height - height),
        };
    }

    return position;
}

export const generatePlayerId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}