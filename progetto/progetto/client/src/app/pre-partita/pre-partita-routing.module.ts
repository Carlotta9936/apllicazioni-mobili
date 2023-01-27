import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrePartitaPage } from './pre-partita.page';

const routes: Routes = [
  {
    path: '',
    component: PrePartitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrePartitaPageRoutingModule {}
