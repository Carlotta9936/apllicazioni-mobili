import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {

  constructor(public database: DatabaseService, private router: Router,  private Auth:AuthService, private alert: AlertService) { }

  ngOnInit() {
  }

  registerUser(value: any): any{
    //controllo i campi siano stati riempiti
    if(value.username!="" && value.password!="" && value.nome!="" && value.cognome!="" && value.mail!=""){
      this.database.getUser(value.username).then((promise) => {
        try{
          if(promise.username === value.username){
            this.alert.presentAlert("Username già in uso.");
          }else{
            this.database.creaUtente(value.username, value.password, value.nome, value.cognome, value.mail);
            this.Auth.set('user', value.username);
            this.Auth.set('crediti', 50);
            this.Auth.set('timbro', "black");
            this.router.navigate(['/tabs/tab1']);
          }
        }catch{
          this.database.creaUtente(value.username, value.password, value.nome, value.cognome, value.mail);
          this.Auth.set('user', value.username);
          this.Auth.set('crediti', 50);
          this.Auth.set('timbro', "black");
          this.router.navigate(['/tabs/tab1']);
        }
        
      });
    }else{
      this.alert.presentAlert("Non hai compilato tutti i campi");
    }
  }

}
