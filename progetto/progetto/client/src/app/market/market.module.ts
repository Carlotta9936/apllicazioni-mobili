import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketPageRoutingModule } from './market-routing.module';

import { MarketPage } from './market.page';
import { AcquistoTimbroComponent } from '../components/market/acquisto-timbro/acquisto-timbro.component';
import { AcquistoCreditiComponent } from '../components/market/acquisto-crediti/acquisto-crediti.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketPageRoutingModule
  ],
  declarations: [MarketPage, AcquistoTimbroComponent, AcquistoCreditiComponent]
})
export class MarketPageModule {}
