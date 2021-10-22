<template>
  <div class="recovery">
    <h2 class="app-title">Wallet recovery</h2>
    <div class="recovery__wrapper">
      <div class="phrase-selector">
        <RadioButton
          :text="'Seed phrase'"
          :value="'seed'"
          :checked="selected.val === 'seed'"
          v-model="selected"
          @input="radioSelect"
        />
      </div>
      <transition name="fade" mode="out-in">
        <div class="recovery__content" v-if="selected?.val === 'seed'">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
          consequatur nostrum perspiciatis reprehenderit sed! At autem
          consectetur dignissimos eaque ex, fuga harum non nostrum odit possimus
          quo quos repellendus unde?
        </div>
      </transition>

      <div class="file-selector">
        <RadioButton
          :text="'File'"
          :value="'file'"
          :checked="selected.val === 'file'"
          v-model="selected"
          @input="radioSelect"
        />
      </div>

      <transition name="fade" mode="out-in">
        <div class="recovery__content" v-if="selected?.val === 'file'">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
          consequatur nostrum perspiciatis reprehenderit sed! At autem
          consectetur dignissimos eaque ex, fuga harum non nostrum odit possimus
          quo quos repellendus unde?
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import RadioButton from '@/components/RadioButton.vue'

export default defineComponent({
  name: 'Recovery',
  components: { RadioButton },
  setup() {
    const selected = ref({ val: 'seed', name: 'Seed phrase' })

    const radioSelect = (): void => {
      console.debug('selected', selected.value)
    }

    return { radioSelect, selected }
  },
})
</script>

<style lang="scss" scoped>
.recovery {
  &__wrapper {
    margin-top: 6.4rem;
  }
  &__content {
    margin-bottom: 2.4rem;
  }
}
</style>
