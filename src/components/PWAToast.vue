<template>
   <div v-if="needRefresh" class="pwa-toast" aria-labelledby="toast-message" role="alert">
      <span id="toast-message">{{ title }}</span>
      <button type="button" class="reload" @click="updateServiceWorker()">Reload</button>
      <button type="button" @click="close">Close</button>
   </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';

// check for updates every hour
const period = 60 * 60 * 1000;

const swActivated = ref(false);

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(swUrl: string, r: ServiceWorkerRegistration) {
   if (period <= 0) return;

   setInterval(async () => {
      if ('onLine' in navigator && !navigator.onLine) return;

      const resp = await fetch(swUrl, {
         cache: 'no-store',
         headers: {
            cache: 'no-store',
            'cache-control': 'no-cache',
         },
      });

      if (resp?.status === 200) {
         await r.update();
      }
   }, period);
}

const { needRefresh, updateServiceWorker } = useRegisterSW({
   immediate: true,
   onRegisteredSW(swUrl, r) {
      if (period <= 0) {
         return;
      }

      if (r?.active?.state === 'activated') {
         swActivated.value = true;
         registerPeriodicSync(swUrl, r);
      } else if (r?.installing) {
         r.installing.addEventListener('statechange', (e) => {
            const sw = e.target as ServiceWorker;
            swActivated.value = sw.state === 'activated';
            if (swActivated.value) registerPeriodicSync(swUrl, r);
         });
      }
   },
});

const title = computed(() => {
   if (needRefresh.value) {
      return 'New content available, click on reload button to update.';
   }

   return '';
});

function close() {
   needRefresh.value = false;
}
</script>

<style lang="scss" scoped>
.pwa-toast {
   position: fixed;
   display: flex;
   gap: 4px;
   align-items: center;
   left: 16px;
   right: 16px;
   bottom: 0;
   margin: 16px auto;
   padding: 12px;
   border: 1px solid #8885;
   border-radius: 4px;
   z-index: 1;
   box-shadow: 3px 0px 5px 0 #1115;
   background-color: rgba($color: #fff, $alpha: 0.05);
}

#toast-message {
   flex-grow: 1;
}

.pwa-toast button {
   border: 1px solid #8885;
   outline: none;
   margin-right: 5px;
   border-radius: 2px;
   padding: 3px 10px;
}
</style>
