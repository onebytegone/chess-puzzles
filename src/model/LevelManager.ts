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

const LEVEL_STATE_KEY = 'levelState';

export class LevelManager {
   private readonly _levels: LevelDefinition[] = [];

   public constructor(levels: LevelDefinition[]) {
      this._levels = levels;
   }

   public get levelSummaries(): LevelSummary[] {
      const state = this._getPersistedLevelState();

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
      const state = this._getPersistedLevelState();

      state[levelID] = true;
      this._persistLevelState(state);
   }

   public getNextLevelID(levelID: string): string | undefined {
      return this._levels[this._levels.findIndex((level) => level.id === levelID) + 1]?.id;
   }

   private _getPersistedLevelState(): Record<string, boolean> {
      return JSON.parse(localStorage.getItem(LEVEL_STATE_KEY) || '{}');
   }

   private _persistLevelState(state: Record<string, boolean>): void {
      localStorage.setItem(LEVEL_STATE_KEY, JSON.stringify(state));
   }
}
