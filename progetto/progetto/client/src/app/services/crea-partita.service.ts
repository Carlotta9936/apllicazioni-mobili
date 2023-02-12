import { Injectable } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { PartitaData } from '../interfaces/PartitaData';
import { getDatabase, ref, onValue } from "firebase/database";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class CreaPartitaService {
  db;
  codice: any= "";
  username = JSON.parse(localStorage.getItem('user')!);

  constructor(public database: DatabaseService, private router: Router ) {
    this.db = getDatabase();
  }

  public creaPartitaDB(proprietario: string, pubblica: boolean, cod: string): any{
    let partita: PartitaData ={
      codice: cod,
      proprietario: proprietario,
      pubblica: pubblica,
      iniziata: false,
      numPartecipanti: 1,
      serverOnline: true,
      datiPartita: {
        ultimoNumero: -1,
        cinquina: false,
        bingo: false,
        premioBingo: 0,
        premioCinquina: 0,
        numeriEstratti: 0,
        montepremi: 0,
      }
    }
    this.database.creaPartita(partita);
    //creo anche già la chat della partita
    this.database.chat(cod, proprietario);
  }


  //Creo codice e lo passo per la creazione della partite nel db
  async creaPartita(partita: boolean): Promise<void> {
    this.codice=this.creaCodice();
    this.creaPartitaDB(this.username,partita,this.codice);
  }

  
  //Crea codice
  creaCodice(): any{
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += this.getRandomChar();
    }
    //controllo sul db che il codice generato non sia già stato salvato nel db
    //il controllo serve perché se no sovrascrive i dati dell'altra partita
    const partita = ref(this.db, 'partita/'+ result);
    onValue(partita, (snapshot) => {
      try{
        let p = snapshot.val();
        if(p != null){
          console.log("Trovato");
          return this.creaCodice();
        } else {
          console.log("NOn trovato");
        }
      } catch(e){
        console.log("alternativa");
      }
    });
    return result;
  }

  //restituisce lettera randomica per creare il codice
  getRandomChar(): string {
    const code = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
    return String.fromCharCode(code);
  }

  //Setta la partita in modalità pubblica
  setPublic():void {
    this.creaPartita(true);
    this.router.navigate(['partita/'+this.codice]);
  }
  
  //Setta la partita in modalità privata
  setPrivate(): void{
    this.creaPartita(false);
    this.router.navigate(['partita/'+this.codice]);
  }

  //metodo per prendere il codice della partita da params
  getCodiceUrl() : any{
    let url=("url"+this.router.parseUrl(this.router.url));
    let arrayUrl:string[];
    arrayUrl=url.split('/');
    return arrayUrl[2];
  }
}
