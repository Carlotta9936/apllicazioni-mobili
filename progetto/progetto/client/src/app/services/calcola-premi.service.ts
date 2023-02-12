import { Injectable } from '@angular/core';
import { CreaPartitaService } from './crea-partita.service';
import { PartitaDBService } from './partita-db.service';

@Injectable({
  providedIn: 'root'
})
export class CalcolaPremiService {
  //variabili per salvare i premi
  montepremi!: number;
  premioCinquina?: number;
  premioBingo?: number;
  premioSuperBingo?: number;

  constructor(public partita: PartitaDBService, public crea: CreaPartitaService) { 
  }
  
  calcolaPremi(): void{
    //prendo l'ammontare del montepremi dal db
    this.partita.getMontepremi(this.crea.getCodiceUrl()).then((value) => {
      this.montepremi = value;
      //Aggiorna il database con i premi calcolati
      this.partita.setPremi(this.crea.getCodiceUrl(), this.calcolaPremioBingo(),
       this.calcolaPremioCinquina());
    });
  }

  //Il premio del bingo è il 48% del montepremi
  calcolaPremioBingo(): number{
    return Math.ceil(this.montepremi! / 100 * 48);
  }
  
  //Il premio della cinquina è il 6% del montepremi
  calcolaPremioCinquina(): number{
    return Math.ceil(this.montepremi! / 100 * 6);
  }
}
