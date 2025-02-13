import type { GenerateSquareControlLevelOptions } from './square-control/generate-square-control-level';
import type { SquareControlLevel } from './square-control/square-control-types';

export enum LevelType {
   SquareControl = 'square-control',
}

interface BaseLevelDefinition {
   id: string;
   name: string;
   type: LevelType;
}

interface SquareControlLevelDefinition extends BaseLevelDefinition {
   type: LevelType.SquareControl;
   level: GenerateSquareControlLevelOptions | SquareControlLevel;
}

export type LevelDefinition = SquareControlLevelDefinition;

interface LevelSummary {
   id: string;
   name: string;
   type: string;
   isCompleted: boolean;
}

const LEVEL_RATING_KEY = 'levelRating';
const LEVEL_STATE_KEY = 'levelState';

export class LevelManager {
   private readonly _levels: LevelDefinition[] = [];

   public constructor(levels: LevelDefinition[]) {
      this._levels = levels;
   }

   public static delete_all_data(): void {
      localStorage.removeItem(LEVEL_RATING_KEY);
      localStorage.removeItem(LEVEL_STATE_KEY);
   }

   public static export_data(): string {
      return JSON.stringify({
         rating: JSON.parse(localStorage.getItem(LEVEL_RATING_KEY) || '{}'),
         state: LevelManager._get_persisted_level_state(),
      });
   }

   private static _get_persisted_level_state(): Record<string, boolean> {
      return JSON.parse(localStorage.getItem(LEVEL_STATE_KEY) || '{}');
   }

   private static _persist_level_state(state: Record<string, boolean>): void {
      localStorage.setItem(LEVEL_STATE_KEY, JSON.stringify(state));
   }

   public get levelSummaries(): LevelSummary[] {
      const state = LevelManager._get_persisted_level_state();

      return this._levels.map((level) => {
         return {
            id: level.id,
            name: level.name,
            type: level.type,
            isCompleted: state[level.id] || false,
         };
      });
   }

   public getLevel(levelID: string): LevelDefinition {
      const level = this._levels.find((level) => level.id === levelID);

      if (!level) {
         throw new Error(`Level ${levelID} not found`);
      }

      return level;
   }

   public markLevelAsCompleted(levelID: string): void {
      const state = LevelManager._get_persisted_level_state();

      state[levelID] = true;
      LevelManager._persist_level_state(state);
   }

   public getNextLevelID(levelID: string): string | undefined {
      return this._levels[this._levels.findIndex((level) => level.id === levelID) + 1]?.id;
   }

   public getLevelRating(levelID: string): number {
      const ratings = JSON.parse(localStorage.getItem(LEVEL_RATING_KEY) || '{}');

      return ratings[levelID] || 0;
   }

   public setLevelRating(levelID: string, rating: number): void {
      const ratings = JSON.parse(localStorage.getItem(LEVEL_RATING_KEY) || '{}');

      ratings[levelID] = rating;
      localStorage.setItem(LEVEL_RATING_KEY, JSON.stringify(ratings));
   }
}
