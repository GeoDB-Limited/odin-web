<template>
  <div class="seed-list">
    <div
      class="seed"
      :class="{ 'seed--active': seed.checked }"
      v-for="seed in seedList"
      :key="seed.id"
      @click="checkPart(seed)"
    >
      <span>{{ seed.id }}</span>
      <span>{{ seed.title }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'

export default defineComponent({
  name: 'SeedList',
  emits: ['select_seed'],
  props: {
    seeds: {
      type: Array as PropType<Array<{ title: string; id: number }>>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const seedList = ref(
      [...props.seeds].map((seed) => ({
        ...seed,
        checked: false,
      }))
    )

    const checkPart = (seed: {
      title: string
      id: number
      checked: boolean
    }): void => {
      seed.checked = !seed.checked
      emit('select_seed', [
        ...seedList.value.filter((seed) => seed.checked === true),
      ])
    }

    return { seedList, checkPart }
  },
})
</script>
<style lang="scss" scoped>
.seed-list {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;
  @media (max-width: 48rem) {
    grid-template-columns: repeat(2, 1fr);
  }
}
.seed {
  padding: 0.8rem;
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--clr__input-border);
  border-radius: 0.4rem;
  cursor: pointer;
  transition: 0.5s ease;
  user-select: none;
  span {
    &:first-child {
      color: var(--clr__text-muted);
    }
    font-style: normal;
    font-weight: normal;
    font-size: 1.6rem;
    line-height: 2.4rem;
  }
  &--active,
  &:hover {
    background: var(--clr__btn-hover);
    color: var(--clr__tooltip-text);
    border: 1px solid var(--clr__btn-hover);
    > span {
      &:first-child {
        color: inherit;
      }
    }
  }
  @media (max-width: 48rem) {
    justify-content: flex-start;
    gap: 1rem;
  }
}
</style>
