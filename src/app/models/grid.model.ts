/**
 * Represente une grille
 * A l'image de grilles.json
 * @since 1.0.0
 */
export interface Grid {
  code: string;
  priority: number;
  logo: string;
  shortLabel: string;
  longLabel: string;
  vues: string[];
  type: string;
  cal: string;
  maxPos: number;
  totalpts: number;
  pts: number[];
}
