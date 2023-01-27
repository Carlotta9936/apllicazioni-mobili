import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-crediti',
  templateUrl: './crediti.component.html',
  styleUrls: ['./crediti.component.scss'],
})
export class CreditiComponent implements OnInit {

  crediti

  constructor(private Auth:AuthService) {
    this.crediti = +this.Auth.get("crediti");
   }

  ngOnInit() {
  }

}
