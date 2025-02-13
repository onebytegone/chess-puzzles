export interface PRNG {
   (): number;
   inRange: (min: number, max: number) => number;
   randomElement: <T>(arr: T[]) => T;
   randomElements: <T>(arr: T[], count: number) => T[];
}

export function makePRNG(seed: number): PRNG {
   const fn = (): number => {
      // mulberry32
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;

      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);

      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
   };

   fn.inRange = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(fn() * (max - min) + min);
   };

   fn.randomElement = <T>(arr: T[]): T => {
      return arr[fn.inRange(0, arr.length)];
   };

   fn.randomElements = <T>(arr: T[], count: number): T[] => {
      if (arr.length <= count) {
         return arr;
      }

      const output = [];

      for (let i = 0; i < count; i++) {
         const index = fn.inRange(0, arr.length);

         output.push(arr[index]);
         arr.splice(index, 1);
      }

      return output;
   };

   return fn;
}
