import { DestroyedPayload, GameStatePayload, LevelUpPayload, PlayerJoinedPayload, Signal, SignalType } from '../models/Signals';
import { GameState } from '../models/GameState';

export const generateGameStatePayload = (gameState: GameState): Signal<GameStatePayload> => {
    return {
        type: SignalType.GAME_STATE,
        payload: {
            gameState
        }
    };
}

export const generateDestroyedPayload = (playerId: string): Signal<DestroyedPayload> => {
    return {
        type: SignalType.DESTROYED,
        payload: {
            playerId
        }
    };
}

export const generateLevelUpPayload = (playerId: string, level: number): Signal<LevelUpPayload> => {
    return {
        type: SignalType.LEVEL_UP,
        payload: {
            playerId,
            level
        }
    };
}

export const generatePlayerJoinedPayload = (playerId: string): Signal<PlayerJoinedPayload> => {
    return {
        type: SignalType.PLAYER_JOINED,
        payload: {
            playerId
        }
    };
}