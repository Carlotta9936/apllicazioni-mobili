import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  stampaSub!: Subscription;
  stampatuttiSub!:Subscription;
  @Input() codice?: string;
  @Input() chat?: boolean;
  messaggi: any[]=[] ;
  newMessage?: string;


  constructor(public database: DatabaseService, public auth: AuthService) { }

  ngOnInit() {
    this.stampaTutti();
    //this.stampaMessaggi();
  }

  sendMessage(){
    let messaggio= "["+ this.auth.get("user")+"]: "+this.newMessage;
    this.database.inviaMessaggio(this.codice!, messaggio);
    this.newMessage="";
  }

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

  stampaMessaggi(){
    this.stampaSub=this.database.getChat(this.codice!).subscribe((value)=>{
      this.messaggi.push(Object.values(value)[(Object.values(value).length)-1]);
    });
  }

}
