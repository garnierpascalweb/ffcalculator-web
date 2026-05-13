import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccueilComponent } from './accueil/accueil.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { OverviewComponent } from './simulator/features/overview/components/overview/overview.component';
import { PositionMarkerComponent } from './simulator/features/overview/components/position-marker/position-marker.component';
import { SynthesisComponent } from './simulator/features/overview/components/synthesis/synthesis.component';
import { ResultAddComponent } from './simulator/features/result/components/result-add/result-add.component';
import { ResultDetailsComponent } from './simulator/features/result/components/result-details/result-details.component';
import { ResultListComponent } from './simulator/features/result/components/result-list/result-list.component';
import { HelpMenuComponent } from './simulator/shared/components/help/components/help-menu/help-menu.component';
import { HelpComponent } from './simulator/shared/components/help/components/help/help.component';
import { ShareMenuComponent } from './simulator/shared/components/share/components/share-menu/share-menu.component';
import { ViewListComponent } from './simulator/shared/components/view/components/view-list/view-list.component';
import { ViewMenuComponent } from './simulator/shared/components/view/components/view-menu/view-menu.component';
import { DateFrFormatReadablePipe } from './simulator/shared/pipes/date-fr-format-readable.pipe';
import { ResultDialogComponent } from './simulator/features/result/components/result-dialog/result-dialog.component';
import { ShellComponent } from './simulator/layout/shell/shell.component';
import { NavigationComponent } from './simulator/layout/navigation/navigation.component';



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
    OverviewComponent, 
    PositionMarkerComponent, 
    SynthesisComponent, 
    HelpMenuComponent, 
    ShareMenuComponent, 
    HelpComponent, 
    ResultDialogComponent, ShellComponent, NavigationComponent
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
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,    
    MatButtonModule,
    MatDialogModule,
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