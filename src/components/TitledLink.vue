<template>
  <router-link class="nav__link link" :to="to" :title="title || text">
    <span>
      {{ text }}
    </span>
  </router-link>
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
    to: {
      type: String,
      default: () => '#',
    },
  },
})
</script>

<style>
.link {
  text-decoration: none;
  white-space: nowrap;
  color: var(--clr__action);
  font-weight: 400;
  line-height: 2.4rem;
  font-size: 16px;
  cursor: pointer;
}
</style>
