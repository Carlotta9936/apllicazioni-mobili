import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { BossoloService } from '../services/bossolo.service';
import { CreaPartitaService } from '../services/crea-partita.service';
import { DatabaseService } from '../services/database.service';
import { PartitaDBService } from '../services/partita-db.service';
import { ProprietarioService } from '../services/proprietario.service';

@Component({
  selector: 'app-partita',
  templateUrl: './partita.page.html',
  styleUrls: ['./partita.page.scss'],
})
export class PartitaPage implements OnInit {
  codice?: string;
  userProprietario?:string;
  iniziata: boolean = false;
  chat: boolean= true;

  
  //Subscruption per ascoltare eventuali vincitori
  bingoSub!: Subscription;
  cinquinaSub!: Subscription;
  //Variabile per chiamare il component della cinquina
  cinquina: boolean = false;
  //Variabile per chiamare il component del bingo
  schermataFinale: boolean = false;
  //Variabili che vanno passate alle schermate della vincita
  risultato!: string;
  vincitoreBingo!: string;
  vincitoreCinquina!: string;

  constructor(public crea: CreaPartitaService, public database: DatabaseService, 
    public auth: AuthService, public propr: ProprietarioService, public bossolo: BossoloService,
    public partita: PartitaDBService, private router: Router, public alert: AlertService) {  }

  ngOnInit() {
    this.codice=this.crea.getCodiceUrl();
    this.controllaProprietario();
   // this.partita.setPartita(this.codice!);
    //this.partita.ascoltaNumero(this.codice!);
    this.partita.ascoltoInizioPartita(this.codice!).subscribe((value: boolean) => {
      if(value === true && !this.propr.proprietario) {
        console.log("STart 2")
        this.start2();
      }
    })
  }

  start2(): void{
    this.iniziata=true;
    this.ascoltaBingo();
    this.ascoltaCinquina();
  }

  public controllaProprietario():void{
    this.database.getPartita(this.codice!).then((promise) => {
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

  start(): void {
    //setto la partita a iniziata in modo che non sia più visibile nella pagina iniziale
    this.partita.startPartita(this.codice!);
    this.iniziata=true;
    this.bossolo.startTimer();
    this.ascoltaBingo();
    this.ascoltaCinquina();
  }

  finePartita(): void{
    //Stop estrazione numeri
    this.bossolo.stopTimer();
    console.log("STOOOOOOOOOOOOOOOOOOOOOP")
    //Stop ascolto vincitore partita
    this.bingoSub.unsubscribe();
    this.schermataFinale = true;
    //Stop ascolto numero estratto
    //this.partita.spegniAscoltoNumero();
    //this.partita.spegniAscoltoBingo();
    //this.partita.ascoltaBingo().unsubscribe();

  }

  public annullaPartita(codice: string){
    //se il proprietario sono io non devo avvisarmi
    this.database.getPartita(codice).then((promise) => {
      try{
        console.log("sono qui");
        //se il proprietario sono io non devo avvisarmi
        if(promise.proprietario!=this.auth.get("user")){ 
          this.alert.presentAlert("il server si è disconnesso, PARTITA ANNULLATA");
          this.router.navigate(['/tabs/tab1']);
        }
      }catch (e){
        console.log("errore"+e);
      }
    });
  }


  end(codice: string): void {
    this.annullaPartita(codice);
    this.database.eliminaPartita(codice);
    this.bossolo.stopTimer();
    this.router.navigate(['/tabs/tab1']);
  }

  public esci(codice: string):void{
    //chiamata al db per prendere il numero dei partecipanti
    this.database.getPartita(codice).then((promise) => {
      try{
        let numPartecipanti= promise.numPartecipanti;
        //aggiorno il numero dei partecipanti
        this.database.aggiornaPartecipanti(codice, numPartecipanti-1);
        this.database.inviaMessaggio(codice,"[SERVER]: "+ this.auth.get("user")+" si è scollegato");
        this.router.navigate(['/tabs/tab1']);
      }catch (e){
        console.log("errore"+e);
      }
    });
  }

  public visualizzaChat():void{
    if(this.chat==true){
      this.chat=false;
    }else{
      this.chat=true;
    }

  }

  //Tabellone

/*  //Solo se sei il proprietario
  estrazioneNumeri(): void{*/

  ascoltaBingo(): void {
    this.bingoSub = this.partita.ascoltaBingo(this.codice!)
      .subscribe((value) => {
      if(value !== false){
        console.log("Qualcuno ha fatto bingo", value);
        if(value === this.auth.get("user")){
          this.risultato = "VITTORIA";
        } else {
          this.risultato = "SCONFITTA";
        }
        this.vincitoreBingo = value;
        this.finePartita();
        }
      })
  }

  ascoltaCinquina(): void{
    this.cinquinaSub = this.partita.ascoltaCinquina(this.codice!)
    .subscribe((value) => {
      if(value!=false){
        console.log("Qualcuno ha fatto cinquina", value);
        this.vincitoreCinquina = value;
        this.cinquina = true;
        setTimeout(this.togliMessaggio, 1000);
        this.cinquinaSub.unsubscribe();
      }
    })
  }

  togliMessaggio(): void{
    console.log("Togli");
    this.cinquina = false
  }

}
