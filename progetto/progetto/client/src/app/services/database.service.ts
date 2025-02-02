import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';
import { getDatabase, set, ref, onValue, remove, update, child, get, push, increment} from "firebase/database";
import 'firebase/auth';
import { PartitaData } from '../interfaces/PartitaData';
import { Timbro } from '../interfaces/Timbro';
import { Observable } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  database;

  constructor(private firestore: Firestore) { 
    this.database = getDatabase();
  }

  /* ~~ Utente ~~ */

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
      codiceTimbri: 2, 
      stats: { 
        partiteFatte: 0,
        bingo: 0,
        cinquine: 0,
        superbingo: 0,
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
      const user = ref(this.database, );
      get(child(user, 'users/'+ username)).then((snapshot) => {
        const u = snapshot.val();
        resolve(u);
      }); 
    })
    return userPromise;
  } 
  
  //Incrementa il numero di partite
  incrementaNumeroPartite(user: string): void {
    update(ref(this.database, 'users/'+user+'/stats/'), {
      partiteFatte: increment(1)
    })
  }

  //Incrementa il numero di bingo
  incrementaNumeroBingo(user: string): void {
    update(ref(this.database, 'users/'+user+'/stats/'), {
      bingo: increment(1)
    })
  }

  //Incrementa il numero di cinquine
  incrementaNumeroCinquine(user: string): void {
    update(ref(this.database, 'users/'+user+'/stats/'), {
      cinquina: increment(1)
    })
  }

  //Incrementa il numero di superbingo
  incrementaNumeroSuperbingo(user: string): void {
    update(ref(this.database, 'users/'+user+'/stats/'), {
      superbingo: increment(1)
    })
  }

  /* ~~ Chat ~~ */
  //crea chat
  chat(codice: string, proprietario: string): void{
    console.log("creato");
    set(ref(this.database, "chat/"+codice),codice);  
    this.inviaMessaggio(codice,"[Server]: "+ proprietario+" ha creato la partita");
  }

  inviaMessaggio(codice: string, messaggio: string):void{
    const chat=ref(this.database, "chat/"+codice);
    const aggiungi=push(chat);
    set(aggiungi,messaggio);
  }

  //legge i messaggi di una chat
  getChat(codice: string): Observable<any>{
    const risultato= new Observable<any>((observer)=>{
      const partita= ref(this.database, "chat/"+codice);
      onValue(partita,(snapshot)=>{
        const messaggi= snapshot.val();
        console.log("messaggi",messaggi);
        observer.next(messaggi);
      });
    });
    return risultato;
  }

  public eliminaChat(cod: string){
    const partita= ref(this.database, 'chat/'+ cod);
    remove(partita).then(()=>{
      console.log("eliminato: "+cod);
    }).catch((error) => {
      console.log("errore");
    });
  }


  /* ~~ Crediti ~~ */
  getCrediti(username: string): Observable<number>{
    const creditiObs = new Observable<number>((observer) => {
      const crediti=ref(this.database,'users/'+username+'/crediti');
      onValue(crediti,(snapshot)=>{
        observer.next(snapshot.val());
      })
    });
    return creditiObs;
  }

  aggiornaCrediti(username: string, val: number): void{
    update(ref(this.database, 'users/'+username), {
      crediti: val
    } );
  }


  /* ~~ Partita ~~ */
  //ritorna i dati di una partita dato il codice
  getPartita(codice: string): Promise<any>{    
    const codicePromise = new Promise<any>((resolve, reject) => {
      const cod = ref(this.database);
      get(child(cod, 'partita/'+ codice+'/')).then((snapshot) => {
        if(snapshot.exists()){
          const c = snapshot.val();
          console.log(c);
          resolve(c);
        }else{
          resolve("vuoto");
        }
      })
    })
    console.log("partita",codicePromise);
    return codicePromise;
  } 

  //Ricerca tutti le partite nel DB
  public async getPartite(): Promise<any> {
    const partite = new Promise<string>((resolve, reject) => {
      const partiteDB = ref(this.database);
      get(child(partiteDB,  'partita/')).then((snapshot) => {
        if(snapshot.exists()){
          console.log("S", snapshot.val());
          resolve(snapshot.val());
        }
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
      serverOnline: partita.serverOnline,
      proprietario: partita.proprietario,
      datiPartita:{
        ultimoNumero: partita.datiPartita.ultimoNumero,
        cinquina: partita.datiPartita.cinquina,
        bingo: partita.datiPartita.bingo,
        premioBingo: partita.datiPartita.premioBingo,
        premioCinquina: partita.datiPartita.premioCinquina,
        numeriEstratti: partita.datiPartita.numeriEstratti,
        montepremi: partita.datiPartita.montepremi
      }
    });
  }

  //Incrementa numero giocatori
  incrementaGiocatori(codice: string): void {
    update(ref(this.database, 'partita/'+codice), {
      numPartecipanti: increment(1)
    })
  }

  //Decrementa numero giocatori
  decrementaGiocatori(codice: string): void {
    update(ref(this.database, 'partita/'+codice), {
      numPartecipanti: increment(-1)
    })
  }

  //setta il valore di serveronline a false e serve per indicare che il server è uscito
  serverOffline(codice: string){
    update(ref(this.database, 'partita/'+codice), {
      serverOnline: false
    } );
  }

  // controlla se il server è online
  checkServer(codice: string): Observable<boolean>{
    const checkStato= new Observable<boolean>((observer)=>{
      const stato=ref(this.database,'partita/'+codice+'/serverOnline');
      onValue(stato,(snapshot)=>{
        observer.next(snapshot.val());
      })
    })
    return checkStato;
  }

  public eliminaPartita(cod: string){
    const partitaRef = ref(this.database, 'partita/'+cod);
    remove(partitaRef).then(() => {
      this.eliminaChat(cod);
      console.log("eliminato: "+cod);
    }).catch((error) => {
      console.log("errore");
    });
  }
  
  /* ~~ Timbro ~~ */
  getUrlTimbro(id: number){
    const timbriPromise = new Promise<Timbro>((resolve, reject) => {
      const db = ref(this.database);
      get(child(db, 'timbri/'+id )).then((snapshot) => {
        if(snapshot.exists()){
          const c = snapshot.val().url;
          console.log("T",c);
          resolve(c);
        }
      })
    })
    return timbriPromise
  }

  //Selezionare timbro per giocare
  setTimbro(id: number, user: string){
    update(ref(this.database, 'users/'+user), {
      timbri: id
    });
  }
  
  //Metodo per acquistare un timbro nuovo
  aggiungiTimbro(user: string, timbro: number): void {
    update(ref(this.database, 'users/'+user), {
      codiceTimbri: timbro
    });
  }

  //timbri che possiedi
  public async getTimbri(): Promise<Timbro[]> {
    const timbriPromise = new Promise<Timbro[]>((resolve, reject) => {
      const timbri = ref(this.database, 'timbri/');
      onValue(timbri, (snapshot) => {
        resolve(snapshot.val());
      })
    })
    return timbriPromise;
  } 
}

