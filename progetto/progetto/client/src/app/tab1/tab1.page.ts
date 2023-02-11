import { Component } from '@angular/core';
import { PartitaData } from '../interfaces/PartitaData';
import { CreaPartitaService } from '../services/crea-partita.service';
import { DatabaseService } from '../services/database.service';
import { ControlloCreditiService } from '../services/controllo-crediti.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { ProprietarioService } from '../services/proprietario.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  partite: PartitaData[] = [];
  partitaCercata?: PartitaData;
  searchTerm = ''; //variabile che prende il valore dal form

  constructor(public crea: CreaPartitaService, public database: DatabaseService, public crediti: ControlloCreditiService,
     private router: Router, private alert: AlertService, public propr: ProprietarioService, public auth: AuthService) { }

  ngOnInit(){
    window.location.reload;
    this.caricaPartite();
  }

  //Carica tutte le partite pubbliche non ancora iniziate
  public caricaPartite(): void{
    this.partite = [];
    this.database.getPartite().then((value) => {
      Object.values(value).forEach((v: any) => {
        if(v.pubblica===true && v.iniziata===false){
          this.partite.push({
            'codice': v.codice,
            'iniziata': v.iniziata,
            'numPartecipanti': v.numPartecipanti,
            'proprietario': v.proprietario,
            'pubblica': v.pubblica,
            'serverOnline': v.serverOnline,
            'datiPartita':{
              'ultimoNumero': v.datiPartita.ultimoNumero,
              'bingo': v.datiPartita.bingo,
              'cinquina': v.datiPartita.cinquina,
              'premioBingo': v.datiPartita.premioBingo,
              'premioCinquina': v.datiPartita.premioCinquina,
              'numeriEstratti': v.datiPartita.numeriEstratti,
              'montepremi': v.datiPartita.montepremi
            }
          })
        }
      })
    });
    this.propr.proprietario=true;
  }

  //metodo che manda alla pagina per settare la tipologia di partita
  public creaPartita():void{
    if(+this.auth.get("crediti")>=1){
      this.router.navigate(['crea-partita']);
    }else{
      this.alert.presentAlert('fatti un giro al market, non hai crediti per giocare');
    }
  }

  //Cerca partita non ancora iniziate tramite codice
  public async cercaPartita(){
    this.searchTerm=this.searchTerm.toUpperCase();
    this.database.getPartite().then((value) => {
      Object.values(value).forEach((v: any) => {
        if(v.codice===this.searchTerm && v.iniziata===false){
          this.partitaCercata = v;
        }
      });
    });
  }

  public entra(codice: string): void{
    //controllo se ha i crediti per comprare una scheda
    if(+this.auth.get("crediti")>=1){
      //chiamata al db per prendere il numero dei partecipanti
      this.database.getPartita(codice).then((promise) => {
        try{
          //controllo che la partita non sia già iniziata
          //controllo necessario perché potrebbe non refresharsi
          if(promise.iniziata==true){
            this.alert.presentAlert('Ci dispiace la partita è già inziata, ricarica le partite per vedere quelle non ancora iniziate');
          }else{
            let numPartecipanti= promise.numPartecipanti;
            //aggiorno il numero dei partecipanti
            this.database.aggiornaPartecipanti(codice, numPartecipanti+1);
            this.database.inviaMessaggio(codice,"[SERVER]: "+ this.auth.get("user")+" si è aggiunto alla partita");
            this.router.navigate(['partita/'+codice]);
          }
        }catch (e){
          console.log("errore"+e);
        }
      });
    }else{
      this.alert.presentAlert('fatti un giro al market, non hai crediti per giocare');
    }
    this.propr.proprietario=false;
  }
}
