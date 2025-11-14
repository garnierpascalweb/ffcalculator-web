import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ResultAddComponent } from './simulator/result-add/result-add.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  { path: '', component: ResultAddComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
