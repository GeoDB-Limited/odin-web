<template>
  <div class="sing_in">
    <!--
        <div>
          <p class="auth__copy-warning" v-if="copyWarning">
            <span class="auth__copy-important">Important! </span>
            Copy this code, you cannot recover it!
          </p>
          <p v-if="form.mnemonicErr" class="app-form__field-err">
            {{ form.mnemonicErr }}
          </p>
          <button
            class="app-btn w-full"
            type="submit"
            @click.prevent="generateKey"
          >
            Generate mnemonic key
          </button>
        </div>
       -->

    <img
      class="only-sm logo"
      src="~@/assets/brand/odin-logo-black.png"
      alt="ODIN Logo"
    />

    <h2 class="app-title">Sign in</h2>

    <div class="sing_in__input">
      <div class="sing_in__input-title">
        <label for="app-password">Enter your password</label>
        <TitledLink
          class="validator-card__link"
          :text="'Forgot your password?'"
          :to="{ name: 'Recovery' }"
        />
      </div>
      <div class="sing_in__input-wrapper">
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
        <div class="show-password" @click="toggleShowing()">
          <svg
            class="eye"
            :class="eyeClass"
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
      <button
        class="app-btn w-full"
        @click="submit"
        :disabled="!form.isValid || isLoading"
      >
        Log in
      </button>
    </div>
    <span class="sing_in__or">or</span>
    <button class="app-btn app-btn_outlined w-full" :disabled="isLoading">
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.5 11V14H2.5V11H0.5V14C0.5 15.1 1.4 16 2.5 16H14.5C15.6 16 16.5 15.1 16.5 14V11H14.5ZM3.5 5L4.91 6.41L7.5 3.83V12H9.5V3.83L12.09 6.41L13.5 5L8.5 0L3.5 5Z"
        />
      </svg>
      <span> Import Wallet </span>
    </button>
    <TitledLink class="sing_in__create" :text="'Create wallet'" :to="`/`" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useForm, validators } from '@/composables/useForm'
import { toggleInputType } from '@/helpers/helpers'
import TitledLink from '@/components/TitledLink.vue'
import { handleError } from '@/helpers/errors'

// const MNEMONIC_SIZE = 24

export default defineComponent({
  name: 'SignIn',
  components: { TitledLink },
  setup() {
    const form = useForm({
      password: ['', validators.required],
    })
    const isLoading = ref(false)

    const submit = async () => {
      try {
        isLoading.value = true
      } catch (error) {
        handleError(error)
      } finally {
        isLoading.value = false
      }
    }

    /*
    // TODO: wait for backend
    const copyWarning = ref(false)
    const submit = async () => {
      const auth = useAuthorization()
      isLoading.value = true
      try {
        await auth.logIn(form.mnemonic.val())
        await router.push({ name: 'Redirector' })
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }
    const generateKey = async () => {
      const newWallet = await DirectSecp256k1HdWallet.generate(MNEMONIC_SIZE, {
        hdPaths: [API_CONFIG.hdDeviation],
        prefix: 'odin',
      })
      // const newAccount = await newWallet.getAccounts()
      form.mnemonic.val(newWallet.mnemonic)
      copyWarning.value = true
    }
    */
    const input_password = ref<HTMLInputElement | null>(null)
    const isEyeClick = ref<boolean>(false)
    const eyeClass = ref('eye--close')

    watch(isEyeClick, () =>
      isEyeClick.value === true
        ? (eyeClass.value = 'eye--open')
        : (eyeClass.value = 'eye--close')
    )

    function toggleShowing(): void {
      if (!input_password.value) return
      isEyeClick.value = isEyeClick.value !== true
      toggleInputType(input_password.value)
    }

    return {
      isLoading,
      input_password,
      toggleShowing,
      form: form.flatten(),
      eyeClass,
      submit,
    }
  },
})
</script>

<style lang="scss" scoped>
.logo {
  position: absolute;
  width: 9rem;
  height: 3.4rem;
  left: 1.6rem;
  top: 2.4rem;
}
.sing_in {
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
    margin: 5.2rem 0 0 0;
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
