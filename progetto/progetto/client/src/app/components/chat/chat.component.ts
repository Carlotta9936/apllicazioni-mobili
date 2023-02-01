import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  @Input() codice?: string;
  messaggi?: any ;
  newMessage?: string;


  constructor(public database: DatabaseService, public auth: AuthService) { }

  ngOnInit() {
    this.messaggi=this.database.getChat(this.codice!);
    console.log("messaggi",this.messaggi.value);
  }

  sendMessage(){
    let messaggio= "["+ this.auth.get("user")+"]: "+this.newMessage;
    this.database.inviaMessaggio(this.codice!, messaggio);
    this.newMessage="";
  }

}
