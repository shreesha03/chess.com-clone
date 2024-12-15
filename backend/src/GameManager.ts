import { WebSocket } from "ws";

interface Game{
    id : number;
    player1 : WebSocket;
    player2 : WebSocket;
}

 

export class GameManager{
    private games: Game[];
    private users: WebSocket[];
    private pendingUsers : WebSocket[];

    constructor(){
        this.games = [];
        this.users = [];
    }

    addUser(socket : WebSocket) : void{
        this.addHandler(socket);
        this.users.push(socket);

    }

    removeUser(socket : WebSocket) : void{
        this.users = this.users.filter(user=>user!==socket);
        // stop the game here because the user left
    }

    private addHandler(socket : WebSocket){
        socket.on("message", (data)=>{
            const message = JSON.parse(data.toString());
            if(message.type === 'GAME_INIT'){
                this.pendingUsers.push(socket);
                
            }
        });
    }
}