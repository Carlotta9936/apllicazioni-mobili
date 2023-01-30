import { BootstrapOptions, Injectable } from '@angular/core';
import { User } from '../interfaces/User';
import { Partita } from '../interfaces/Partita';
import { collection, doc, docData, Firestore, query, where, getDocs} from '@angular/fire/firestore';
import { DataServiceService } from './data-service.service';
import { getDatabase, set, ref, onValue, remove, update, child, get} from "firebase/database";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { PartitaData } from '../interfaces/PartitaData';
import { Observable } from 'rxjs';
import { Timbro } from '../interfaces/Timbro';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  users?: User[];
  database;

  constructor(private firestore: Firestore, private dataService: DataServiceService) { 
    this.database = getDatabase();
  }

  //Metodo per creare un utente nel DB
  creaUtente(username: string, password: string, nome: string, cognome: string, mail: string): User{
    //Creo un oggetto User
    let u: User = {
      username: username,
      password: password,
      nome: nome,
      cognome: cognome,
      mail: mail,
      crediti: 50,
      timbri: 2,
      codiceTimbri: 1, 
      stats: { 
        partiteFatte: 0,
        bingo: 0,
        cinquine: 0,
        superbingo: 0,
        maxVincita: 0
      }
    };

    //Aggiunge al DB
    set(ref(this.database, 'users/'+username), u );

    //Ritorno l'oggetto utente appena creato
    return u;
  }

  //Ritorna tutti gli utenti per il login
  async getUser(username: string): Promise<any>{    
    const userPromise = new Promise<any>((resolve, reject) => {
      console.log("Username", username);
      const user = ref(this.database, 'users/'+ username);
      onValue(user, (snapshot) => {
        const u = snapshot.val();
        resolve(u);
      }); 
    })
    return userPromise;
  } 

  //ritorna i dati di una partita dato il codice
  getPartita(codice: string): Promise<any>{    
    const codicePromise = new Promise<any>((resolve, reject) => {
      const cod = ref(this.database);
      get(child(cod, 'partita/'+ codice+'/')).then((snapshot) => {
        if(snapshot.exists()){
          const c = snapshot.val();
          console.log(c);
          resolve(c);
        }
      })
    })
    return codicePromise;
  } 


  //setto la partita a iniziata
  public partitaIniziata(codice: string): void{
    update(ref(this.database, 'partita/'+codice), {
      iniziata: true
    })
  }

  /** Metodi per partita
    * ! Metodo da togliere
  */
  public aggiornaPartita(partita: Partita): void{
    set(ref(this.database, 'game/'+'AAA'), {
      ultimoNumero: partita.ultimoNumero, 
      //numeriEstratti: partita.numeriEstratti+1,
      cinquina: partita.cinquina,
      bingo: partita.bingo
    })
  }

  public estrazioneNumero(codice: string, numero: number): void{
    update(ref(this.database, 'partita/'+codice+'/datiPartita'), {
      ultimoNumero: numero,
    })
  }

  public ascoltaNumero(codice: string): Promise<number> {
    const ascoltaNumero = new Promise<number>((resolve, reject) => {
      const cod = ref(this.database);
      get(child(cod,  'partita/'+ codice+'/datiPartita')).then((snapshot) => {
        if(snapshot.exists()){
          const c = snapshot.val().ultimoNumero;
          console.log("C", c);
          resolve(c);
        }
      }) 
    })
    return ascoltaNumero;
  }

  /*
  public ascoltaNumero(codice: string): Observable<number> {
    const ascoltaNumero = new Observable<number>((observer) => {
      const cod = ref(this.database, 'partita/'+ codice+'/datiPartita');
      onValue(cod, (snapshot) => {
        if(snapshot.exists()){
          const c = snapshot.val().ultimoNumero;
          console.log("C", c);
          observer.next(c);
        }
      }) 
    })
    return ascoltaNumero;
  }*/

  
  //Ricerca tutti le partite nel DB
  public async getPartite(): Promise<any> {
    const partite = new Promise<string>((resolve, reject) => {
      const partiteDB = ref(this.database, 'partita/');
      onValue(partiteDB, (snapshot) => {
        console.log("S", snapshot.val());
        resolve(snapshot.val());
      })
    })

    return partite;
  }
    
 //Crea una PartitaData nel Database
  public creaPartita(partita: PartitaData){
    set(ref(this.database, 'partita/'+partita.codice),{
      pubblica: partita.pubblica,
      iniziata: partita.iniziata,
      codice: partita.codice,
      numPartecipanti: partita.numPartecipanti,
      proprietario: partita.proprietario,
      messaggi: partita.messaggi,
      datiPartita:{
        ultimoNumero: partita.datiPartita.ultimoNumero,
        cinquina: partita.datiPartita.cinquina,
        bingo: partita.datiPartita.bingo
      }
    });
  }

  controllaGiocatori(codice: string): any{    
    let ritorno;
    const cod = ref(this.database, 'partita/'+ codice);
    onValue(cod, (snapshot) => {
      console.log("codice" + cod);
      if(snapshot.val().numPartecipanti>=3){
        console.log("TRUE");
        ritorno = true;
      }else{
        ritorno = false;
      }
    }); 
    return ritorno;
  } 


  public eliminaPartita(cod: string){
    const partitaRef = ref(this.database, 'partita/'+cod);
    remove(partitaRef).then(() => {
      console.log("eliminato: "+cod);
    }).catch((error) => {
      console.log("errore");
    });
  }


  aggiornaCrediti(username: string, val: number): void{
    update(ref(this.database, 'users/'+username), {
      crediti: val
    } );
  }

  aggiornaPartecipanti(codice: string, particpanti: number): void{
    update(ref(this.database, 'partita/'+codice), {
      numPartecipanti: particpanti
    } );
  }

  public async getTimbri(): Promise<Timbro[]> {
    const timbriPromise = new Promise<Timbro[]>((resolve, reject) => {
      const timbri = ref(this.database, 'timbri/');
      onValue(timbri, (snapshot) => {
        resolve(snapshot.val());
      })
    })

    return timbriPromise;
  } 

  aggiungiTimbro(user: string, timbro: number): void {
    update(ref(this.database, 'users/'+user), {
      codiceTimbri: timbro
    });
  }
  
}
