import { Injectable } from '@angular/core';

//const $ApiUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  //metodo per modificare/salvare i dati in localstorage
  public set(key: string, value: any){
    localStorage.setItem(key, JSON.stringify(value));
  }

  //metodo per prendere i dati dal localstorage
  public get(key: string): string{
    console.log("get", JSON.parse(localStorage.getItem(key)!));
    return JSON.parse(localStorage.getItem(key)!)
  }

  //metodo per eliminare i dati dal localstorage
  public delete(key: string): any{
    localStorage.removeItem(key);
  }

}
