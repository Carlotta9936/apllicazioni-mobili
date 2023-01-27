import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardiaService } from './services/guardia.service';

const routes: Routes = [
  {
    path: 'first-page',
    loadChildren: () => import('./first-page/first-page.module').then( m => m.FirstPagePageModule),
    
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [GuardiaService]
  },
  {
    path: 'registrazione',
    loadChildren: () => import('./registrazione/registrazione.module').then( m => m.RegistrazionePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'crea-partita',
    loadChildren: () => import('./crea-partita/crea-partita.module').then( m => m.CreaPartitaPageModule),canActivate: [GuardiaService]
  },
  {
    path: 'market',
    loadChildren: () => import('./market/market.module').then( m => m.MarketPageModule),canActivate: [GuardiaService]
  },
  {
    path: 'pre-partita/:codice',
    loadChildren: () => import('./pre-partita/pre-partita.module').then( m => m.PrePartitaPageModule), canActivate: [GuardiaService]
  },

  


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
