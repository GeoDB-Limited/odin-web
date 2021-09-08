<template>
  <div class="info-card">
    <TitledLink class="info-card__title mg-b24" :text="oracleScript.name" />
    <span class="info-card__description mg-b24">
      {{ oracleScript.description }}
    </span>
    <div class="info-card__statistic">
      <div class="info-card__statistic-item">
        <span class="info-card__statistic-title mg-b8">Requests number</span>
        <span>{{ oracleScript.requestsNumber }}</span>
      </div>
      <div class="info-card__statistic-item">
        <span class="info-card__statistic-title mg-b8">Response time</span>
        <span>{{ oracleScript.responseTime }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  props: {
    oracleScript: { type: Object, required: true }
  },
  components: { TitledLink }
})
</script>

<style lang="scss" scoped>
.info-card {
  display: flex;
  flex-direction: column;
  width: 39rem;
  padding: 3.2rem 2.4rem;
  border: 1px solid var(--clr__action);
  border-radius: 8px;
  box-shadow: 0px 4px 24px var(--clr__dropdown-shadow);

  &__title {
    color: var(--clr__text);
    text-decoration: none;
    font-size: 2.4rem;
    font-weight: 600;
  }

  &__statistic {
    display: flex;
    gap: 2.4rem;

    &-item {
      display: flex;
      flex-direction: column;
      width: 50%;
    }

    &-title {
      color: var(--clr__text-muted);
    }
  }
}

@media (max-width: 768px) {
  .info-card__title {
    font-size: 1.8rem;
  }
}
</style>
