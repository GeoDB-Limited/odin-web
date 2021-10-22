<template>
  <p class="radio-button">
    <input
      type="radio"
      :id="`${text}_id`"
      name="radio-group"
      @change="select"
      :value="value"
      :checked="checked"
    />
    <label :for="`${text}_id`">{{ text }}</label>
  </p>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'RadioButton',
  emits: ['update:modelValue'],
  props: {
    text: { type: String as PropType<string>, required: true },
    value: { type: String as PropType<string>, required: true },
    checked: { type: Boolean as PropType<boolean>, required: true },
  },
  setup(props, { emit }) {
    const select = (): void => {
      emit('update:modelValue', { val: props.value, name: props.text })
    }

    return { select }
  },
})
</script>

<style scoped>
.radio-button {
  margin-bottom: 1.6rem;
}

[type='radio']:checked,
[type='radio']:not(:checked) {
  position: absolute;
  left: -9999px;
}
[type='radio']:checked + label,
[type='radio']:not(:checked) + label {
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  line-height: 20px;
  display: inline-block;
  color: #666;
}
[type='radio']:checked + label:before,
[type='radio']:not(:checked) + label:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 18px;
  height: 18px;
  border: 1px solid #ddd;
  border-radius: 100%;
  background: #fff;
}
[type='radio']:checked + label:after,
[type='radio']:not(:checked) + label:after {
  content: '';
  width: 12px;
  height: 12px;
  background: var(--clr__action);
  position: absolute;
  top: 3px;
  left: 3px;
  border-radius: 100%;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}
[type='radio']:not(:checked) + label:after {
  opacity: 0;
  -webkit-transform: scale(0);
  transform: scale(0);
}
[type='radio']:checked + label:after {
  opacity: 1;
  -webkit-transform: scale(1);
  transform: scale(1);
}
</style>
