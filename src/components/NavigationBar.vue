<template>
   <nav class="navigationBar" role="navigation">
      <slot />
   </nav>
</template>

<style lang="scss" scoped>
.navigationBar {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 0.5em;
   flex: 0;
   background-color: rgba($color: #fff, $alpha: 0.05);
   z-index: 10;
   margin-bottom: 1em;
   min-height: 48px;
   box-shadow: 0 1px 1px rgba($color: #000, $alpha: 0.1);
}

.navigationBar :deep(h1) {
   font-size: 1em;
   margin: 0;
}
</style>
