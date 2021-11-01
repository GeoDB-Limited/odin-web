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
        />
      </div>
      <div class="recovery__content" v-if="selected?.val === 'seed'">
        <SeedList :seeds="seeds" @select_seed="fillingSeedList" />
      </div>
      <div class="file-selector">
        <RadioButton
          :text="'File'"
          :value="'file'"
          :checked="selected.val === 'file'"
          v-model="selected"
        />
      </div>
      <div class="recovery__content" v-if="selected?.val === 'file'">
        <InputFile
          class="app-form__field-input"
          name="data-source-executable"
          v-model="executable"
          :drag="true"
        />
      </div>

      <div class="recovery__submit">
        <button class="app-btn w-full" @click="submit" :disabled="isFill">
          Recover the wallet
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import RadioButton from '@/components/RadioButton.vue'
import SeedList from '@/components/SeedList.vue'
import InputFile from '@/components/inputs/InputFile.vue'

export default defineComponent({
  name: 'Recovery',
  components: { InputFile, RadioButton, SeedList },
  setup: function () {
    const selected = ref({ val: 'seed', name: 'Seed phrase' })

    const isFill = computed(() => {
      if (selected.value.val === 'seed' && checkedSeeds.value.length >= 8) {
        return false
      }
      if (selected.value.val === 'file' && executable.value !== undefined) {
        return false
      }
      return true
    })

    const seeds = ref([
      { id: 1, title: 'Placeholder' },
      { id: 2, title: 'Placeholder' },
      { id: 3, title: 'Placeholder' },
      { id: 4, title: 'Placeholder' },
      { id: 5, title: 'Placeholder' },
      { id: 6, title: 'Placeholder' },
      { id: 7, title: 'Placeholder' },
      { id: 8, title: 'Placeholder' },
      { id: 9, title: 'Placeholder' },
      { id: 10, title: 'Placeholder' },
      { id: 11, title: 'Placeholder' },
      { id: 12, title: 'Placeholder' },
      { id: 13, title: 'Placeholder' },
      { id: 14, title: 'Placeholder' },
      { id: 15, title: 'Placeholder' },
      { id: 16, title: 'Placeholder' },
      { id: 17, title: 'Placeholder' },
      { id: 18, title: 'Placeholder' },
      { id: 19, title: 'Placeholder' },
      { id: 20, title: 'Placeholder' },
      { id: 21, title: 'Placeholder' },
      { id: 22, title: 'Placeholder' },
      { id: 23, title: 'Placeholder' },
      { id: 24, title: 'Placeholder' },
    ])

    const checkedSeeds = ref<
      Array<{
        title: string
        id: number
        checked: boolean
      }>
    >([])

    const fillingSeedList = (
      seedList: Array<{
        title: string
        id: number
        checked: boolean
      }>
    ): void => {
      checkedSeeds.value = seedList
    }

    const executable = ref<File>()
    const submit = (): void => {
      // TODO: wait for back-end
      if (checkedSeeds.value.length >= 8 && selected.value.val === 'seed') {
        alert(
          checkedSeeds.value
            .map((el) => `id: ${el.id} title: ${el.title}`)
            .join(' | ')
        )
      }
      if (executable.value && selected.value.val === 'file') {
        alert(`${executable.value.name}: ${executable.value.size} bytes`)
      }
    }

    return {
      submit,
      selected,
      seeds,
      checkedSeeds,
      fillingSeedList,
      executable,
      isFill,
    }
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
    @media (min-width: 78.6rem) {
      width: 39.2rem;
    }
  }
  @media (min-width: 76.8rem) {
    padding: 3.2rem;
    justify-content: flex-start;
  }
  @media (max-width: 48rem) {
    margin-top: 9.1rem;
    width: 100%;
  }
}
</style>
