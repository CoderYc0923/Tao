<script setup lang="ts">
import Person from '@/utils/hooks/usePerson'

const props = defineProps<{
  result: any
}>()

const currentRes = ref<any>()
const person = ref<Person>()

watch(
  () => props.result,
  (res) => {
    currentRes.value = res
    person.value = new Person(res)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div>{{ currentRes?.d }}</div>
</template>

<style></style>
