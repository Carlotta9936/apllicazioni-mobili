import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreaPartitaPage } from './crea-partita.page';


const routes: Routes = [
  {
    path: '',
    component: CreaPartitaPage,
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreaPartitaPageRoutingModule {}
