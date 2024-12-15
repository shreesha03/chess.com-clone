import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

console.log("node code is running");

const wss = new WebSocketServer({ port: 8090 });

const gameManager = new GameManager;

wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on('disconnect', ()=> gameManager.removeUser(ws));
});
