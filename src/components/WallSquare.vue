<template>
   <div class="square"></div>
   <!-- <span class="id">{{ props.cellID }}</span> -->
</template>

<style lang="scss" scoped>
.square {
   user-select: none;
   position: relative;
   background-color: var(--wallCell);
   box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
