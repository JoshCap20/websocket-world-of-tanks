import WebSocket, { Server } from 'ws';

/*
TODO:
- Add properties for players, bullets, etc.
- Add methods for game logic (e.g., updatePlayer, addBullet)
*/


export class Game {
  private wss: Server;
  // TODO: Other properties like players, bullets, etc.

  constructor(wss: Server) {
    this.wss = wss;
    // TODO: Initialize properties
  }

  addPlayer(ws: WebSocket) {
    // TODO: Logic to add a player
  }
}
