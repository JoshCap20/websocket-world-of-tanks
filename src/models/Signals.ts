import { GameState } from "./GameState";

export enum SignalType {
    MESSAGE = 'MESSAGE',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    LEVEL_UP = 'LEVEL_UP',
    DESTROYED = 'DESTROYED',
    GAME_STATE = 'GAME_STATE'
}

export interface Signal<T = any> {
    type: SignalType;
    payload: T;
}

export interface LevelUpPayload {
    playerId: string;
    level: number;
}

export interface DestroyedPayload {
    playerId: string;
}

export interface GameStatePayload {
    gameState: GameState;
}