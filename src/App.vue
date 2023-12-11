<script setup lang="ts">
import type { ConfigProviderTheme } from 'vant'
import { useStore } from '@/stores'
import { localStorage } from '@/utils/local-storage'

const store = useStore()
const theme = ref<ConfigProviderTheme>('light')
const mode = computed(() => store.mode)

watch(mode, (val) => {
  if (val === 'dark' || localStorage.get('theme') === 'dark') {
    theme.value = 'dark'
    document.querySelector('html')
      .setAttribute('data-theme', 'dark')
  }
  else {
    theme.value = 'light'
    document.querySelector('html')
      .setAttribute('data-theme', 'light')
  }
}, { immediate: true })

provide('isRealDark', computed(() => theme.value === 'dark'))
</script>

<template>
  <VanConfigProvider :theme="theme" style="height: 100%">
    <RouterView />
  </VanConfigProvider>
</template>
