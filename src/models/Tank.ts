export interface Player {
    id: string;

    // For Mapping
    x: number;
    y: number;
    height: number;
    width: number;
    rotation: number;

    // For Game Logic
    health: number;
    level: number;
    kills: number;
    active: boolean;
    lastShot: Date;
    isAI: boolean;
  }
  