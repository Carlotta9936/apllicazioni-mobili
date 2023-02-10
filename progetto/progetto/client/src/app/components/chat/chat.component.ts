import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  stampaSub!: Subscription;
  stampatuttiSub!:Subscription;
  @Input() codice?: string;
  messaggi: any[]=[] ;
  newMessage?: string;
  stampaFlag: boolean = false;


  constructor(public database: DatabaseService, public auth: AuthService) { }

  ngOnInit() {
    this.stampaTutti();
    //this.stampaMessaggi();
  }

 ngOnDestroy(): void {
     if(this.stampaFlag){
      this.stampaSub.unsubscribe();
     }
 }

  sendMessage(){
    let messaggio= "["+ this.auth.get("user")+"]: "+this.newMessage;
    this.database.inviaMessaggio(this.codice!, messaggio);
    this.newMessage="";
  }

  //metodo per prendere dal db tutti i messaggi della chat
  stampaTutti(){
    this.stampatuttiSub=this.database.getChat(this.codice!).subscribe((value)=>{
      for(let i=0;i<(Object.values(value).length-1);i++){
        this.messaggi.push(Object.values(value)[i]);
      }
      console.log("we");
      this.stampaMessaggi();
    });
    this.stampatuttiSub.unsubscribe();

  }

  //metodo per aggiungere messaggi alla chat quando questa è aperta
  stampaMessaggi(){
    this.stampaFlag = true;
    this.stampaSub=this.database.getChat(this.codice!).subscribe((value)=>{
      this.messaggi.push(Object.values(value)[(Object.values(value).length)-1]);
    });
  }

}
