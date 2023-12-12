<script setup lang="ts">
</script>

<template>
  <div class="coin-yang" />
</template>

<style lang="less" scoped>
.coin-yang {
  width: 100px;
  height: 100px;
  background-color: #583515;
  border-radius: 50%;
  position: relative;
  border: 5px solid #b87333;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.5);

  &::before {
    content: '阳';
    position: absolute;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'base-font';
    color: #b87333;
    font-weight:bold;
    font-size: 46px;
  }
}
</style>
