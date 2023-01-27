import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { Timbro } from '../interfaces/Timbro';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class TimbriService {

  timbri: Timbro[] = [];
  codUtente: number = 1;
  timbriNonAppartiene: Timbro[] = [];

  constructor(public database: DatabaseService, public auth: AuthService ) {
    this.getCodiceTimbriUtente(auth.get("user")).then((value: number) => {
      this.codUtente = value;
    })
  }

  //Resituisce un array di timbri che l'utente possiede
  appartiene(): any{
    const appartienePromise = new Promise<Timbro[]>((resolve, reject) => {
      this.getAllTimbri().then((value: Timbro[]) => {
          let timbri: Timbro[] = [];
          value.forEach((timbro) => {
            console.log("codUtente", this.codUtente);
            if(this.codUtente % timbro.id === 0){
              timbri.push(timbro);
            }
          })
          resolve (timbri);
        });
        
    })
    return appartienePromise;
  }

  //Resituisce un array di timbri che l'utente non possiede
  async nonAppartiene(user: string): Promise<any>{
    const nonAppartienePromise = new Promise<Timbro[]>((resolve, reject) => {
      this.getAllTimbri().then((value: Timbro[]) => {
          let timbri: Timbro[] = [];
          value.forEach((timbro) => {
            console.log("M", this.codUtente, timbro.id, this.codUtente % timbro.id);
            console.log("Modulo", this.codUtente % timbro.id !== 0);
            if(this.codUtente % timbro.id !== 0){
              timbri.push(timbro);
            }
          })
          resolve (timbri);
        });
        
    })
    return nonAppartienePromise;
  }

  //Restituisce tutti i timbri in un array
  async getAllTimbri(): Promise<any>{
    const getAllTimbri = new Promise<Timbro[]>((resolve, reject) => {
      let timbri: Timbro[] = []
        this.database.getTimbri().then((value) => {
        console.log("VV", value)
        Object.values(value).forEach((t: Timbro) => {
          let timbro = {id: t.id, nome: t.nome, url: t.url};
          timbri.push(timbro);
        })

        resolve (timbri);
      })

      //console.log("TWt", this.timbri);

    });

    return getAllTimbri;
  }

  public async getCodiceTimbriUtente(user: string): Promise<number>{
    const codUtentePromise = new Promise<number>((resolve, rejects) => {
      console.log("U", "");
      this.database.getUser(user).then((value) => {
        console.log("t2", value);
        resolve (+value.codiceTimbri);
      })
    })

    return codUtentePromise;
  }

  aggiungiTimbro(user: string, timbro: number): void {
    console.log("T1", this.getCodiceTimbriUtente(user));
    this.database.aggiungiTimbro(user, this.codUtente * timbro);
  }
}
