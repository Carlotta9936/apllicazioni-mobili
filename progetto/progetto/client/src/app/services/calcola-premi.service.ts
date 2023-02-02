import { Injectable } from '@angular/core';
import { CreaPartitaService } from './crea-partita.service';
import { PartitaDBService } from './partita-db.service';

@Injectable({
  providedIn: 'root'
})
export class CalcolaPremiService {
  montepremi!: number;
  premioCinquina?: number;
  premioBingo?: number;
  premioSuperBingo?: number;

  constructor(public partita: PartitaDBService, public crea: CreaPartitaService) { 
  }
  
  calcolaPremi(codice: string): void{
    this.partita.getMontepremi(this.crea.getCodiceUrl()).then((value) => {
      this.montepremi = value;
      //Aggiorna il database con i premi calcolati
      this.partita.setPremi(this.crea.getCodiceUrl(), this.calcolaPremioBingo(), this.calcolaPremioCinquina(), 0)
      console.log("Premio bingo", this.calcolaPremioBingo())
      console.log("Premio cinquina", this.calcolaPremioCinquina())
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

  calcolaPremioSuperbingo(): number {
    return 0;
  }

}
