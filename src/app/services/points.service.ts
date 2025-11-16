import { Injectable } from '@angular/core';
import { Grid } from '../models/grid.model';

@Injectable({
  providedIn: 'root'
})
export class PointsService {

  constructor() { 

  }

  calcPts(grid: Grid, pos: number, prts: number): number {
  // --- Gestion des erreurs ---
  if (!grid || !Array.isArray(grid.pts)) {
    console.error("Grid invalide :", grid);
    return 0;
  }

  if (pos < 1 || pos > grid.pts.length) {
    console.error("Position hors limites :", pos);
    return 0;
  }

  if (prts <= 0) {
    console.error("Nombre de partants invalide :", prts);
    return 0;
  }

  // --- Base points ---
  const basePoints = grid.pts[pos - 1];   // Exemple : pos=3 ⇒ pts[2]

  // --- Coefficient multiplicateur ---
  let coef: number;

  if (prts <= 10) {
    coef = 0.1;
  } else if (prts >= 150) {
    coef = 1.5;
  } else {
    coef = prts / 100;
  }

  // --- Calcul final ---
  const total = basePoints * coef;

  // --- Retour avec 2 décimales ---
  return Number(total.toFixed(2));
}

}
