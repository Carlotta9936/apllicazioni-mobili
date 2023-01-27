import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const $ApiUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private storage: Storage) { }

  public set(key: string, value: any){
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get(key: string): string{
    console.log("get", JSON.parse(localStorage.getItem(key)!));
    
    return JSON.parse(localStorage.getItem(key)!)
  }

  public delete(key: string): any{
    localStorage.removeItem(key);
  }

}
