import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game{
    public player1 : WebSocket;
    public player2 : WebSocket;
    private board : Chess;
    private startTime : Date;

    constructor(player1 : WebSocket, player2 : WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type : INIT_GAME,
            payload : {
                color : "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type : INIT_GAME,
            payload : {
                color : "black"
            }
        }));
    }

    makeMove(socket : WebSocket, move : {
        from : string,
        to : string
    }){
        // is it this users move
        // is the move valid
        // update the board
        // push the move

        try{
            if((this.board.turn()==='w' && socket===this.player2) || (this.board.turn()==='b' && socket===this.player1))
                    return // not your turn logic
            
            this.board.move(move);
        }catch(err){
            console.error(err);
        }

        if(this.board.isCheckmate()){
            this.player1.emit(JSON.stringify({
                type : GAME_OVER,
                payload : {
                    winner : this.board.turn()=='w' ? "black" : "white"
                }
            }))
            this.player2.emit(JSON.stringify({
                type : GAME_OVER,
                payload : {
                    winner : this.board.turn()=='w' ? "black" : "white"
                }
            }))
        }
       
        this.player1.emit(JSON.stringify({
            type : MOVE,
            payload : {
                board : this.board.board()
            }
        }))

        this.player2.emit(JSON.stringify({
            type : MOVE,
            payload : {
                board : this.board.board()
            }
        }))
    }
}