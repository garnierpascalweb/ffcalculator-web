import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccueilComponent } from './accueil/accueil.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DateFrFormatReadablePipe } from './pipes/date-fr-format-readable.pipe';
import { SimulatorComponent } from './simulator/simulator.component';
import { ResultListComponent } from './simulator/result-list/result-list.component';
import { ResultDetailsComponent } from './simulator/result-details/result-details.component';
import { ResultAddComponent } from './simulator/result-add/result-add.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ViewListComponent } from './simulator/view-list/view-list.component';
import { ViewMenuComponent } from './simulator/view-menu/view-menu.component';
import { OverviewComponent } from './simulator/overview/overview.component';
import { PositionMarkerComponent } from './simulator/overview/position-marker/position-marker.component';
import { SynthesisComponent } from './simulator/overview/synthesis/synthesis.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ResultAddMenuComponent } from './simulator/result-add-menu/result-add-menu.component';
import { HelpMenuComponent } from './simulator/help-menu/help-menu.component';
import { ShareMenuComponent } from './simulator/share-menu/share-menu.component';

/**
 * Factory pour la fonctionnalité i18n de ngx-translate
 * @param http 
 * @returns 
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,    
    AccueilComponent,
    DateFrFormatReadablePipe,
    SimulatorComponent,
    ResultListComponent,
    ResultDetailsComponent,
    ResultAddComponent,
    ViewListComponent,
    ViewMenuComponent,
    OverviewComponent, PositionMarkerComponent, SynthesisComponent, ResultAddMenuComponent, HelpMenuComponent, ShareMenuComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatTabsModule,    
    MatGridListModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,    
    MatButtonModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),


  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    AccueilComponent,
    ResultListComponent,
    ResultDetailsComponent,
  ]
})
export class AppModule { }