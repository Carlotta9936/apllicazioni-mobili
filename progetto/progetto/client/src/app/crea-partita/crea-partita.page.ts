import { Component, OnInit } from '@angular/core';
import { CreaPartitaService } from '../services/crea-partita.service';
@Component({
  selector: 'app-crea-partita',
  templateUrl: './crea-partita.page.html',
  styleUrls: ['./crea-partita.page.scss'],
})
export class CreaPartitaPage implements OnInit {

  
  constructor(public crea: CreaPartitaService) { }

  ngOnInit() {
  }
}
