import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-crediti',
  templateUrl: './crediti.component.html',
  styleUrls: ['./crediti.component.scss'],
})
export class CreditiComponent implements OnInit {

  crediti!: number;

  constructor(private Auth:AuthService, public database: DatabaseService) {
  }
  
  ngOnInit() {
    this.setCrediti();
  }

  setCrediti() {
    this.database.getCrediti(this.Auth.get("user")).subscribe((value) => {
      this.crediti = value;
    })
  }
}
