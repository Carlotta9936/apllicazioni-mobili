import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {

  constructor(public database: DatabaseService, private router: Router,  private Auth:AuthService) { }

  ngOnInit() {
  }

  registerUser(value: any): any{
    this.database.creaUtente(value.username, value.password, value.nome, value.cognome, value.mail);
    this.Auth.set('user', value.username);
    this.Auth.set('crediti', 50);
    this.router.navigate(['/tabs/tab1']);
  }

}
