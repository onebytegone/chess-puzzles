export function isMobile(): boolean {
   if ('maxTouchPoints' in navigator) {
      return navigator.maxTouchPoints > 0;
   }

   if ('msMaxTouchPoints' in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (navigator as any).msMaxTouchPoints > 0;
   }

   const mQ = matchMedia?.('(pointer:coarse)');

   if (mQ?.media === '(pointer:coarse)') {
      return !!mQ.matches;
   }

   if ('orientation' in window) {
      return true; // deprecated, but good fallback
   }

   // Only as a last resort, fall back to user agent sniffing
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const UA = (navigator as any).userAgent;
   return (
      /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
      /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
   );
}
