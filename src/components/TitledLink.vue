<template>
  <a :title="title || text" :href="link">
    {{ text }}
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: [String, Number],
      required: false,
    },
    link: {
      type: [String],
      required: false,
    },
  },
})
</script>

<style scoped lang="scss">
a {
  color: #007bff;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
}
</style>
