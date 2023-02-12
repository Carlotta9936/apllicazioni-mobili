import { Injectable } from '@angular/core';
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
          this.getCodiceTimbriUtente(this.auth.get("user")).then((cod: number) => {
            this.codUtente = cod;
            value.forEach((timbro) => {
              if(this.codUtente % timbro.id === 0){
                timbri.push(timbro);
              }
            })
            resolve (timbri);
          });
        });
    })
    return appartienePromise;
  }

  //Resituisce un array di timbri che l'utente non possiede
  async nonAppartiene(): Promise<any>{
    const nonAppartienePromise = new Promise<Timbro[]>((resolve, reject) => {
      this.getAllTimbri().then((value: Timbro[]) => {
          let timbri: Timbro[] = [];
          this.getCodiceTimbriUtente(this.auth.get("user")).then((cod: number) => {
            this.codUtente = cod;
            value.forEach((timbro) => {
              console.log("M", this.codUtente, timbro.id, this.codUtente % timbro.id);
              console.log("Modulo", this.codUtente % timbro.id !== 0);
              if(this.codUtente % timbro.id !== 0){
                timbri.push(timbro);
              }
            })
            resolve (timbri);
          })
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
    });
    return getAllTimbri;
  }

  public async getCodiceTimbriUtente(user: string): Promise<number>{
    const codUtentePromise = new Promise<number>((resolve, rejects) => {
      this.database.getUser(user).then((value) => {
        resolve (+value.codiceTimbri);
      })
    })
    return codUtentePromise;
  }

  //aggiungo al db il timbro comprato
  aggiungiTimbro(user: string, timbro: number): void {
    this.database.aggiungiTimbro(user, this.codUtente * timbro);
  }

  //prendo url timbro ovvero il nome dell'immagine tra i file
  getUrlTimbro(id: number): any {
    this.database.getUrlTimbro(id).then((value) => {
      console.log("getUrl timrbo", value);
      return value;
    })
  }
}
