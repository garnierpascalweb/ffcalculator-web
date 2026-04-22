import { Injectable } from '@angular/core';
import { POINTS_RULES } from '../constants/points.constants';
import { Grid } from '../models/grid.model';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private readonly TAG = 'PointsService';

  constructor(private readonly log: LoggerService) {

  }

  calcPts(grid: Grid, pos: number, prts: number): number {
    // --- Gestion des erreurs ---
    //TODO 1.0.0 ne pas retourner zero mais faire un vrai objet retour avec succes true ou false
    if (!grid || !Array.isArray(grid.pts)) {
      this.log.error(this.TAG, "grille de points invalide");
      return 0;
    }

    if (pos < 1 || pos > grid.pts.length) {
      this.log.error(this.TAG, "position hors limite");
      return 0;
    }

    if (prts <= 0) {
      this.log.error(this.TAG, "nombr de partants invalide");
      return 0;
    }
    // --- Base points ---
    const basePoints = grid.pts[pos - 1];   // Exemple : pos=3 ⇒ pts[2]
    this.log.trace(this.TAG, "base de points = " + basePoints);
    // --- Coefficient multiplicateur ---
    let coef = this.calcCoef(prts);
    const total = basePoints * coef;
    const roundedTotal = Number(total.toFixed(2));
    this.log.info(this.TAG, "P" + pos + " sur " + prts + " pour une epreuve " + grid.code + " = " + roundedTotal);
    return roundedTotal;
  }

  calcCoef(prts: number) : number {
    let coef: number;
    if (prts <= POINTS_RULES.MIN_PARTICIPANTS) {
      coef = POINTS_RULES.LOW_COEF;
    } else if (prts >= POINTS_RULES.MAX_PARTICIPANTS) {
      coef = POINTS_RULES.HIGH_COEF;
    } else {
      coef = prts / POINTS_RULES.COEF_DIVIDER;
    }
    this.log.trace(this.TAG, "coefficient = " + coef);
    return coef;
  }

}
