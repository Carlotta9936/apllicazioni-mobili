import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { BossoloService } from '../services/bossolo.service';
import { CalcolaPremiService } from '../services/calcola-premi.service';
import { ControlloCreditiService } from '../services/controllo-crediti.service';
import { CreaPartitaService } from '../services/crea-partita.service';
import { DatabaseService } from '../services/database.service';
import { EliminaPartitaService } from '../services/elimina-partita.service';
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
  montepremi?: number;
  numPartecipanti?: number;
  numSchede= 1; //inizializzato a 1 perché la partita inizia che ne ha già 1

  //Subscruption per ascoltare eventuali vincitori
  bingoSub!: Subscription;
  cinquinaSub!: Subscription;
  checkSub!: Subscription;

  //Variabile per chiamare il component della cinquina
  cinquina: boolean = false;

  //Variabile per chiamare il component del bingo
  schermataFinale: boolean = false;

  //Variabili che vanno passate alle schermate della vincita
  risultato!: string;
  vincitoreBingo!: string;
  vincitoreCinquina!: string;

  //Variabile per mostrare il bottone compra scheda
  compra: boolean= true;
  //Variabile per mostrare il componetn chat
  chat: boolean= true;
  //variabile per mostrare il compoenent del tabellone
  tabellone: boolean= false;
  //variabile per gestire più component
  iniziata: boolean = false;
  //Variabile per aggiornare i dati relativi alla partita prima che inizi
  aggiornaDatiSub!: any;

  constructor(public crea: CreaPartitaService, public database: DatabaseService, 
    public auth: AuthService, public propr: ProprietarioService, public bossolo: BossoloService,
    public partita: PartitaDBService, private router: Router, public calcolaPremi: CalcolaPremiService,
     public alert: AlertService,public crediti: ControlloCreditiService, public elimina: EliminaPartitaService) {  }

  ngOnInit() {
    this.codice=this.crea.getCodiceUrl();
    this.controllaProprietario();
    this.statistiche();
    this.ascoltaStatoHost();
    this.partita.ascoltoInizioPartita(this.codice!).subscribe((value: boolean) => {
     // this.iniziata = value;
      if(value === true && !this.propr.proprietario) {
        console.log("STart 2")
        this.start2();
      }
    });
  }

  //metodo che avvia la partita
  async start(): Promise<void> {
    //controllo se ci sono abbastanza giocatori per iniziare la partita
    let num=this.partita.getNumParteicpanti(this.codice!);
    if(await num>=2){
      //setto la partita a iniziata in modo che non sia più visibile nella pagina iniziale
      this.partita.startPartita(this.codice!);
      this.compra=false;
      this.database.incrementaNumeroPartite(this.auth.get("user"));
      this.iniziata=true;
      this.tabellone = true;
      this.bossolo.startTimer();
      this.calcolaPremi.calcolaPremi(this.codice!);
      this.ascoltaBingo();
      this.ascoltaCinquina();
      this.aggiornaDatiSub.unsubscribe();
    }else{
      this.alert.presentAlert("Non ci sono abbastanza giocatori. Dovete essere almeno in 2");
    }
  }

  start2(): void{
    this.iniziata=true;
    this.database.incrementaNumeroPartite(this.auth.get("user"));
    this.ascoltaBingo();
    this.ascoltaCinquina();
    this.aggiornaDatiSub.unsubscribe();
    this.tabellone = true;
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
            this.chat=false;
            this.propr.proprietario=false;
          }
        }
      }catch (e){
        console.log("errore"+e);
      }
    });
  };

  finePartita(): void{
    //Stop estrazione numeri
    this.bossolo.stopTimer();
    console.log("STOOOOOOOOOOOOOOOOOOOOOP")
    if(this.propr.proprietario){
      //this.partita.finishPartita(this.codice!);
      //this.iniziata = false;
    }
    //Stop ascolto vincitore partita
    this.bingoSub.unsubscribe();
    this.schermataFinale = true;
  }

  //avvisa i giocatori che non siano il proprietario tramite un alert che il proprietario si è disconnesso
  public annullaPartita():void{
    if(!this.propr.proprietario){
      //controllo di non essermi già scollegato
      if(this.elimina.staccaServer==false){
        this.checkSub.unsubscribe();
      }else{
        //essendo finita la partita perché il server si è scollegato rimborso i crediti
        this.crediti.rimborsaCrediti(this.numSchede!);
        this.alert.presentAlert("il server si è disconnesso, PARTITA ANNULLATA");
        this.router.navigate(['/tabs/tab1']);
      }
    }
  }

  //uscita dalla partita da parte del proprietario
  end(codice: string): void {
    //se la partita non era ancora iniziata rimborso
    if(this.iniziata==false){
      this.crediti.rimborsaCrediti(this.numSchede!);
    }
    this.database.serverOffline(codice);
    this.database.eliminaPartita(codice);
    this.bossolo.stopTimer();
  }

  //metodo che prende in input il numero delle schede da parte del component schede
  numeroSchede(value: any):void{
    this.numSchede=value;
  }

  //uscita dalla partita da parte di un giocatore
  public esci(codice: string):void{
    this.checkSub.unsubscribe();
    //chiamata al db per prendere il numero dei partecipanti
    this.database.getPartita(codice).then((promise) => {
      try{
        this.numPartecipanti= promise.numPartecipanti;
        //aggiorno il numero dei partecipanti
        this.database.aggiornaPartecipanti(codice, this.numPartecipanti!-1);
        this.database.inviaMessaggio(codice,"[SERVER]: "+ this.auth.get("user")+" si è scollegato");
      
        if(this.iniziata==false){
          //se la partita non è iniziata rimborso i crediti
          this.crediti.rimborsaCrediti(this.numSchede);
          //ricalcolo il montepremi
          this.aggiornaMontepremi(this.numSchede);
        }
      }catch (e){
        console.log("errore"+e);
      }
    });
  }

  public aggiornaMontepremi(schede: number):void{
    this.montepremi=this.montepremi!-schede;
    this.partita.setMontepremi(this.codice!,this.montepremi);
  }

  public visualizzaChat():void{
    if(this.chat==true){
      this.chat=false;
    }else{
      this.chat=true;
    }
  }

  statistiche(): void{
    this.aggiornaDatiSub= this.partita.getStatisticheOnvalue(this.codice!).subscribe((value)=>{
      this.numPartecipanti=value.numPartecipanti;
      this.montepremi=value.datiPartita.montepremi;
    });
  }

  //permette di mettere in ascolto i giocatori per essere "avvisati" 
  //nel caso in cui il server abbandoni la partita
  ascoltaStatoHost():void{
    this.checkSub=this.database.checkServer(this.codice!).subscribe((value)=>{
      if(value==false){
        this.annullaPartita();
        this.checkSub.unsubscribe();
      }
    })
  }


  ascoltaBingo(): void {
    this.bingoSub = this.partita.ascoltaBingo(this.codice!)
      .subscribe((value) => {
      if(value !== false){
        this.tabellone= false;
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
        this.cinquinaSub.unsubscribe();
      }
    })
  }

  togliMessaggio(): void{
    console.log("Togli");
    this.cinquina = false
  }

}
