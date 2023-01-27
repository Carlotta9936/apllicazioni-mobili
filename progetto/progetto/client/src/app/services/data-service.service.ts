import { Injectable } from '@angular/core';
import { collection, collectionData, docData, Firestore } from '@angular/fire/firestore';
import { doc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/User';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private firestore: Firestore) { }

  //Restituisce un utente con un determinato Username
  getUser(username: String){
    const user = doc(this.firestore, `Users/${username}`)
    return docData(user) as Observable<User>;
  }
}
