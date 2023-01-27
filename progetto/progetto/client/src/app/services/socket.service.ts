//da togliere

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  /*public message$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {}

  socket = io('http://localhost:3000');


  public sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  public stanza(room: string, nome: any):void{
    this.socket.emit('join',room, nome);
  }

  public esci(room:string, nome: any, proprietario: boolean):void{
    if(proprietario==true){
      this.socket.emit('message', "Il server si è disconnesso, "+nome);
      this.socket.emit('delete',room);
    }else{
      this.socket.emit('leave',room, nome);
    }
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) =>{
      this.message$.next(message);
    });
    return this.message$.asObservable();

    //const message = new Observable<number>
    //this.socket.on('message', )
  };

  public stopRead = () => {
    console.log("STOP");
    //this.message$.unsubscribe();
  }

  public estraiNumero(numero: number, room: string): void{
    this.socket.emit('message', 'Estratto: ' + numero);
  }*/
}

  
