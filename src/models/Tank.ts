export interface Tank {
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
    speed: number;
    kills: number;
    active: boolean;
    lastShot: number;
    isAI: boolean;
  }
  