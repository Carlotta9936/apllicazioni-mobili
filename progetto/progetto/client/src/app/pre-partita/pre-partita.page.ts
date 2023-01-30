import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { BossoloService } from '../services/bossolo.service';
import { CreaPartitaService } from '../services/crea-partita.service';
import { DatabaseService } from '../services/database.service';
import { EliminaPartitaService } from '../services/elimina-partita.service';
import { PartitaDBService } from '../services/partita-db.service';
import { ProprietarioService } from '../services/proprietario.service';

@Component({
  selector: 'app-pre-partita',
  templateUrl: './pre-partita.page.html',
  styleUrls: ['./pre-partita.page.scss'],
})
export class PrePartitaPage implements OnInit {

  codice?:any;
  userProprietario?:string;
  startPartita:boolean=false;
  iniziata: boolean=false;
  newMessage?: string;
  messageList: string[] = [];
  chat: boolean= true;

  obs?: Subscription;

  constructor(public crea: CreaPartitaService, public elimina: EliminaPartitaService, private route: ActivatedRoute, 
    private database: DatabaseService, private router: Router, 
    public alert: AlertService, public auth: AuthService, public propr: ProprietarioService,
    public bossolo: BossoloService, public partita: PartitaDBService) { }

  ngOnInit() {
    this.codice=this.crea.getCodiceUrl();
    this.partita.setPartita(this.codice);
    this.controllaProprietario();
    //this.messaggi();
    //this.socket.stanza(this.codice,this.auth.get("user"));
  }

  public controllaProprietario():void{
    this.database.getPartita(this.codice).then((promise) => {
      try{
        this.userProprietario=promise.proprietario;
        //faccio nuovamente il controllo sul proprietario per evitare che refresshando la pagina perda il valore true
        //l'assegnazione non viene fatta in principio qui perché avverrebbe troppo tardi (perchè è un controllo lento) rispetto
        //alla creazione della pagina stessa
        if(this.propr.proprietario!=true){
          if(promise.proprietario==this.auth.get("user")){ 
            this.propr.proprietario=true;
          }else{
            this.propr.proprietario=false;
          }
        }
      }catch (e){
        console.log("errore"+e);
      }
    });
  };


  /*console.log("Proprietario", this.partita.getProprietario(), this.auth.get("user"), this.partita.getProprietario() === this.auth.get("user"))
  if(this.partita.getProprietario() === this.auth.get("user")){
  }else{
  }*/
  


  /*
  public messaggi():void{
    this.obs = this.socket.getNewMessage().subscribe((message: string) => {
      if(message!=""){
        if(message.includes("Estratto")){
          let messaggio = message.split(": ");
          this.bossolo.ascoltaNumero(+messaggio[1]);
          this.bossolo.estratto=messaggio[1];
          //this.scheda.controllaNumero(Number(messaggio[1]));
        } else if(message.includes("Il server si è disconnesso")){
          //se il proprietario sono io non devo avvisarmi
          if(this.propr.proprietario==false){
            this.alert.presentAlert("il server si è disconnesso, PARTITA ANNULLATA");
            this.router.navigate(['/tabs/tab1']);
          }
        }else{
          if(message!="server: start"){
            this.messageList.push(message);
          }else{
            //devo toglierli
            this.startPartita=true;
              this.iniziata=true;
              this.database.eliminaPartita(this.codice);
            //controllo che i giocatori siano abbastanza per poter giocare
            /*if(this.database.controllaGiocatori(this.codice)==true){
              //se la partita inizia devo toglierla dall'elenco delle partite dove posso entrare
              this.startPartita=true;
              this.iniziata=true;
              this.database.eliminaPartita(this.codice);
            }else{
              if(this.propr.proprietario==true){
                this.alert.presentAlert("non ci sono abbastanza giocatori per poter iniziare la partita. Il numero minimo è: 3");
              }
            }
          }
        }
      }
    });
    this.messageList=[];
  }
  */

  public sendMessage():void {
    //this.socket.sendMessage(this.auth.get("user")+': '+this.newMessage);
    console.log("S")
    this.newMessage = '';
  }

  public start():void{
    //this.socket.sendMessage("server: start");
    this.chat=false;
    this.bossolo.startTimer();
    this.startPartita=true;
    this.iniziata=true;
    
    
    //console.log("LEng", this.socket.socket.)

  }

  public esci(codice: string):void{
    //this.socket.esci(codice,this.auth.get("user"),false);
    //chiamata al db per prendere il numero dei partecipanti
    this.database.getPartita(codice).then((promise) => {
      try{
        let numPartecipanti= promise.numPartecipanti;
        //aggiorno il numero dei partecipanti
        this.database.aggiornaPartecipanti(codice, numPartecipanti-1);
        this.router.navigate(['/tabs/tab1']);
      }catch (e){
        console.log("errore"+e);
      }
    });
    this.messageList=[];
  }
  
  public visualizzaChat():void{
    if(this.chat==true){
      this.chat=false;
    }else{
      this.chat=true;
    }

  }

  /*public stopSub(){
    console.log("STOP SUB")
    //this.obs?.unsubscribe();
    this.socket.socket.removeAllListeners();
  }*/
}
