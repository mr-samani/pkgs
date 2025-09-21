import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'alert', pathMatch: 'full' },
  { path: 'player', loadChildren: () => import('./player/player.module').then(m => m.PlayerModule) },
  { path: 'alert', loadChildren: () => import('./alert/alert.module').then(m => m.AlertModule) },
  { path: 'grid', loadChildren: () => import('./grid-demo/grid-demo.module').then(m => m.GridDemoModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
