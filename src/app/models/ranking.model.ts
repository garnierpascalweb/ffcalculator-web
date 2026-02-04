/**
 * @since 1.0.0
 */
export interface RankingResponse {
  year: number;
  rankingObjects: RankingObject[];
}

export interface RankingObject {
  name: string;
  nbPos: number;
  rankingScores: number[]; // points par rang
}
