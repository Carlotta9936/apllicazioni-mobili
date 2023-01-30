import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartitaPage } from './partita.page';

const routes: Routes = [
  {
    path: '',
    component: PartitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartitaPageRoutingModule {}
