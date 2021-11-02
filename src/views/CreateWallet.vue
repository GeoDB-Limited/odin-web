<template>
  <div class="create-wallet">
    <img
      class="only-sm auth-logo"
      src="~@/assets/brand/odin-logo-black.png"
      alt="ODIN Logo"
    />

    <h2 class="app-title">Create wallet</h2>

    <div class="create-wallet__input create-wallet__input--mrt">
      <div class="create-wallet__input-title">
        <label for="app-password">Password</label>
      </div>
      <div class="create-wallet__input-wrapper">
        <form class="w-full">
          <input
            autocomplete="false"
            class="app-input"
            id="app-password"
            name="request-min-count"
            type="password"
            ref="input_password"
            v-model="form.password"
            :disabled="isLoading"
          />
        </form>
        <div class="show-password" @click="toggleShowing('password')">
          <svg
            class="eye"
            :class="eyePasswordClass"
            viewBox="0 0 16 16"
            id="eye"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 5.333a2.667 2.667 0 1 0 0 5.334 2.667 2.667 0 0 0 0-5.334zM6.667 8a1.333 1.333 0 1 1 2.666 0 1.333 1.333 0 0 1-2.666 0z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.79 7.444c.045.078.078.14.102.184l.037.073a.668.668 0 0 1 0 .597l-.037.074a12.393 12.393 0 0 1-.488.823 13.782 13.782 0 0 1-1.501 1.928C12.597 12.516 10.6 14 8 14c-2.6 0-4.597-1.484-5.903-2.877A13.781 13.781 0 0 1 .209 8.556a8.253 8.253 0 0 1-.1-.184L.07 8.298a.667.667 0 0 1 0-.596l.012-.022a5.066 5.066 0 0 1 .127-.236 13.784 13.784 0 0 1 1.888-2.567C3.403 3.484 5.4 2 8 2c2.6 0 4.597 1.484 5.903 2.877a13.785 13.785 0 0 1 1.888 2.567zM1.717 8.472A11.38 11.38 0 0 1 1.427 8 12.45 12.45 0 0 1 3.07 5.79C4.264 4.515 5.933 3.332 8 3.332c2.067 0 3.736 1.183 4.93 2.456A12.448 12.448 0 0 1 14.573 8a12.447 12.447 0 0 1-1.643 2.21c-1.194 1.274-2.863 2.457-4.93 2.457-2.067 0-3.736-1.183-4.93-2.456a12.45 12.45 0 0 1-1.354-1.74z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="create-wallet__input">
      <div class="create-wallet__input-title">
        <label for="app-repassword">Password confirmation</label>
      </div>
      <div class="create-wallet__input-wrapper">
        <form class="w-full">
          <input
            autocomplete="false"
            class="app-input"
            id="app-repassword"
            name="request-min-count"
            type="password"
            ref="input_repassword"
            v-model="form.repassword"
            :disabled="isLoading"
          />
        </form>
        <div class="show-password" @click="toggleShowing('repassword')">
          <svg
            class="eye"
            :class="eyeRePasswordClass"
            viewBox="0 0 16 16"
            id="eye"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 5.333a2.667 2.667 0 1 0 0 5.334 2.667 2.667 0 0 0 0-5.334zM6.667 8a1.333 1.333 0 1 1 2.666 0 1.333 1.333 0 0 1-2.666 0z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.79 7.444c.045.078.078.14.102.184l.037.073a.668.668 0 0 1 0 .597l-.037.074a12.393 12.393 0 0 1-.488.823 13.782 13.782 0 0 1-1.501 1.928C12.597 12.516 10.6 14 8 14c-2.6 0-4.597-1.484-5.903-2.877A13.781 13.781 0 0 1 .209 8.556a8.253 8.253 0 0 1-.1-.184L.07 8.298a.667.667 0 0 1 0-.596l.012-.022a5.066 5.066 0 0 1 .127-.236 13.784 13.784 0 0 1 1.888-2.567C3.403 3.484 5.4 2 8 2c2.6 0 4.597 1.484 5.903 2.877a13.785 13.785 0 0 1 1.888 2.567zM1.717 8.472A11.38 11.38 0 0 1 1.427 8 12.45 12.45 0 0 1 3.07 5.79C4.264 4.515 5.933 3.332 8 3.332c2.067 0 3.736 1.183 4.93 2.456A12.448 12.448 0 0 1 14.573 8a12.447 12.447 0 0 1-1.643 2.21c-1.194 1.274-2.863 2.457-4.93 2.457-2.067 0-3.736-1.183-4.93-2.456a12.45 12.45 0 0 1-1.354-1.74z"
            />
          </svg>
        </div>
      </div>
    </div>
    <button
      class="app-btn w-full"
      @click="submit"
      :disabled="!form.isValid || isLoading"
    >
      Create
    </button>
    <TitledLink
      class="create-wallet__create"
      :text="'Sign In'"
      :to="{ name: 'SignIn' }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useForm, validators } from '@/composables/useForm'
import { toggleInputType } from '@/helpers/helpers'
import TitledLink from '@/components/TitledLink.vue'
import { handleError } from '@/helpers/errors'

export default defineComponent({
  name: 'SignIn',
  components: { TitledLink },
  setup() {
    const form = useForm({
      password: ['', validators.required],
      repassword: ['', validators.required],
    })
    const isLoading = ref(false)

    const submit = async () => {
      try {
        isLoading.value = true
        alert(`pass: ${form.repassword.val()}, repass: ${form.password.val()}`)
      } catch (error) {
        handleError(error)
      } finally {
        isLoading.value = false
      }
    }

    const input_password = ref<HTMLInputElement | null>(null)
    const input_repassword = ref<HTMLInputElement | null>(null)
    const isPasswordEyeClick = ref<boolean>(false)
    const isRePasswordEyeClick = ref<boolean>(false)
    const eyePasswordClass = ref('eye--close')
    const eyeRePasswordClass = ref('eye--close')

    watch(isPasswordEyeClick, () =>
      isPasswordEyeClick.value === true
        ? (eyePasswordClass.value = 'eye--open')
        : (eyePasswordClass.value = 'eye--close')
    )
    watch(isRePasswordEyeClick, () =>
      isRePasswordEyeClick.value === true
        ? (eyeRePasswordClass.value = 'eye--open')
        : (eyeRePasswordClass.value = 'eye--close')
    )

    function toggleShowing(field: string): void {
      if (!input_password.value || !input_repassword.value) return
      if (field === 'password') {
        isPasswordEyeClick.value = isPasswordEyeClick.value !== true
        toggleInputType(input_password.value)
      } else {
        isRePasswordEyeClick.value = isRePasswordEyeClick.value !== true
        toggleInputType(input_repassword.value)
      }
    }

    return {
      isLoading,
      input_password,
      input_repassword,
      toggleShowing,
      form: form.flatten(),
      eyePasswordClass,
      eyeRePasswordClass,
      submit,
    }
  },
})
</script>

<style lang="scss" scoped>
.create-wallet {
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr;
  width: 100%;
  padding: 1.6rem;
  @media (min-width: 76.8rem) {
    padding: 3.2rem;
    width: 39.2rem;
    justify-content: flex-start;
  }
  &__or {
    text-align: center;
    width: 100%;
    margin: 2.4rem 0;
  }
  &__create {
    font-size: 2rem;
    text-align: center;
    margin-top: 3.2rem;
  }
  &__input {
    &--mrt {
      margin: 5.2rem 0 0 0;
    }
    &-title {
      display: flex;
      justify-content: space-between;
      font-size: 1.6rem;
      font-weight: 400;
      line-height: 2.4rem;
      margin-bottom: 0.8rem;
    }
    &-wrapper {
      display: flex;
      position: relative;
      margin: 0 0 2.4rem 0;
      //margin: 0 0 1.6rem 0;
      .show-password {
        cursor: pointer;
        position: absolute;
        top: calc(50% - 1rem);
        right: 1.3rem;
        width: 2rem;
        height: 2rem;
        svg {
          width: inherit;
          height: inherit;
        }
      }
    }
  }
}

//.auth__form {
//  width: 100%;
//  max-width: 30rem;
//  margin-inline-start: 8vw;
//  @include respond-to(sm) {
//    margin: auto;
//  }
//}
//
//.auth__form-logo {
//  max-width: 12rem;
//  position: absolute;
//  top: 4rem;
//}
//
//.auth__copy {
//  &-warning {
//    padding: 3.2rem 0;
//  }
//
//  &-important {
//    font-weight: 700;
//  }
//}
</style>
