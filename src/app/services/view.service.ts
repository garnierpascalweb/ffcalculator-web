import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ViewOption } from '../models/viewoption.model';


@Injectable({
  providedIn: 'root'
})
export class ViewService {

  private readonly STORAGE_KEY = 'selectedView';

  /** Liste des 8 vues possibles */
  private readonly views: ViewOption[] = [
    { id: 'G',   label: 'Générale' },
    { id: 'E',   label: 'Elite' },
    { id: 'O1',  label: 'Open 1' },
    { id: 'O2',  label: 'Open 2' },
    { id: 'O3',  label: 'Open 3' },
    { id: 'U17', label: 'U17' },
    { id: 'U19', label: 'U19' },
    { id: 'U23', label: 'U23' },
    { id: 'A',   label: 'Access' },
  ];

  private selectedViewSubject!: BehaviorSubject<ViewOption>;
  //selectedView$ = this.selectedViewSubject as unknown as BehaviorSubject<ViewOption>;
   selectedView$!: Observable<ViewOption>;

  constructor() {

    const saved = localStorage.getItem(this.STORAGE_KEY);
    const defaultView = this.views.find(v => v.id === (saved ?? 'G'))!;

    // 👉 INITIALISATION EFFECTIVE ICI
    this.selectedViewSubject = new BehaviorSubject<ViewOption>(defaultView);

    // 👉 maintenant seulement, on peut définir selectedView$
    this.selectedView$ = this.selectedViewSubject.asObservable();
  }

  /** Liste des vues */
  getViews(): ViewOption[] {
    return this.views;
  }

  /** Vue courante */
  getCurrentView(): ViewOption {
    return this.selectedViewSubject.value;
  }

  /** Définir la vue */
  setView(viewId: string): void {
    const view = this.views.find(v => v.id === viewId);
    if (!view) return;
    this.selectedViewSubject.next(view);
    localStorage.setItem(this.STORAGE_KEY, viewId);
  }

  
}
