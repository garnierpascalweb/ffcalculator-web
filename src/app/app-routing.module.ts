import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ResultAddComponent } from './simulator/result-add/result-add.component';
import { ResultLogoComponent } from './simulator/result-details/result-logo/result-logo.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { ViewListComponent } from './simulator/view-list/view-list.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  { path: '', component: SimulatorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
