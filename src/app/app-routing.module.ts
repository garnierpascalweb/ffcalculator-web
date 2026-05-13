import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './simulator/features/overview/components/overview/overview.component';
import { ResultAddComponent } from './simulator/features/result/components/result-add/result-add.component';
import { ResultListComponent } from './simulator/features/result/components/result-list/result-list.component';
import { ShellComponent } from './simulator/layout/shell/shell.component';
import { SimulatorComponent } from './simulator/simulator.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'add', component: ResultAddComponent },
      { path: 'list', component: ResultListComponent },
      { path: 'overview', component: OverviewComponent },
      { path: '', redirectTo: 'add', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
