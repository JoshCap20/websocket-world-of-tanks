import { Bullet } from "./Bullet";
import { Obstacle } from "./Obstacle";
import { Tank } from "./Tank";

export interface GameState {
    mapSize: MapSize;
    gameObjects: GameObjects;
}

export interface MapSize {
    height: number;
    width: number;
}

export interface GameObjects {
    tanks: Map<string, Tank>;
    bullets: Map<string, Bullet>;
    obstacles: Obstacle[];
}