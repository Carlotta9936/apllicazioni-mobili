import { Component } from '@angular/core';
import { PartitaData } from '../interfaces/PartitaData';
import { CreaPartitaService } from '../services/crea-partita.service';
import { DatabaseService } from '../services/database.service';
import { ControlloCreditiService } from '../services/controllo-crediti.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { SocketService } from '../services/socket.service';
import { ProprietarioService } from '../services/proprietario.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  partite: PartitaData[] = []
  partitaCercata?: PartitaData;
  searchTerm = '';


  constructor(public crea: CreaPartitaService, public database: DatabaseService, public crediti: ControlloCreditiService, private router: Router, private alert: AlertService, private socket: SocketService, public propr: ProprietarioService) { }

  ngOnInit(){
    window.location.reload;
    this.caricaPartite();
  }

  //Carica tutte le partite pubbliche
  public caricaPartite(): void{
    this.database.getPartite().then((value) => {
      Object.values(value).forEach((v: any) => {
        if(v.pubblica===true){
          this.partite.push({
            'codice': v.codice,
            'ip': v.ip,
            'numPartecipanti': v.numPartecipanti,
            'proprietario': v.proprietario,
            'pubblica': v.pubblica
          })
        }
      })
    });
    this.propr.proprietario=true;
  }

  //metodo che manda alla stanza prepartita 
  public creaPartita():void{
    if(this.crediti.autorizzaOperazione(1)==true){
      this.router.navigate(['crea-partita']);
    }else{
      this.alert.presentAlert('fatti un giro al market, non hai crediti per giocare');
    }
  }

  //Cerca partita tramite codice
  public async cercaPartita(){
    this.database.getPartite().then((value) => {
      Object.values(value).forEach((v: any) => {
        if(v.codice===this.searchTerm){
          this.partitaCercata = v;
        }
      });
    });
  }

  public entra(codice: string): void{
    //controllo se ha i crediti per comprare una scheda
    if(this.crediti.autorizzaOperazione(1)==true){
      //chiamata al db per prendere il numero dei partecipanti
      this.database.getPartita(codice).then((promise) => {
        try{
          let numPartecipanti= promise.numPartecipanti;
          //aggiorno il numero dei partecipanti
          this.database.aggiornaPartecipanti(codice, numPartecipanti+1);
          
          this.router.navigate(['pre-partita/'+codice]);
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
