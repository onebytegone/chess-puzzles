import { LevelManager } from '../model/LevelManager';
import levelDefinitions from '../assets/level-definitions';

export function loadLevelManager(): LevelManager {
   // TODO: Typeguards for levelDefinitions
   return new LevelManager(levelDefinitions);
}
