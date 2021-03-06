<template>
  <template v-if="isAppReady">
    <template v-if="isLoggedIn">
      <header
        class="view-header fx-row"
        :class="{ 'view-header_mobile': isOpen }"
      >
        <div class="header-wrapper">
          <img
            class="logo"
            src="~@/assets/brand/odin-logo-black.png"
            alt="Logo"
            width="120"
          />
          <Nav :isOpen="isOpen" @changeRoute="changeRoute($event)" />
          <UserWidget class="fx-sae" />
          <BurgerMenu
            class="burger-menu"
            :isOpen="isOpen"
            @click="burgerMenuHandler($event)"
          />
        </div>
      </header>
    </template>
    <router-view />
  </template>
  <div class="dialogs-container" ref="dialogsContainerRef"></div>
  <notifications width="100%" />
</template>

<script lang="ts">
import '@invisiburu/vue-picker/dist/vue-picker.min.css'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import { useAuthorization } from '@/composables/useAuthorization'
import Nav from '@/components/Nav.vue'
import UserWidget from '@/components/UserWidget.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'

export default defineComponent({
  components: { Nav, UserWidget, BurgerMenu },
  setup() {
    const _readyStates = ref({
      dialogs: false,
    })
    const isAppReady = computed(() => {
      return Object.values(_readyStates.value).every((v) => v === true)
    })

    // Dialogs
    const dialogsContainerRef = ref<HTMLElement>()
    onMounted(() => {
      if (dialogsContainerRef.value instanceof HTMLElement) {
        dialogs.init(dialogsContainerRef.value)
        _readyStates.value.dialogs = true
      }
    })

    // Burger Menu
    const isOpen = ref(false)
    const burgerMenuHandler = (event: Event | MouseEvent) => {
      event.preventDefault()
      isOpen.value = isOpen.value !== true
    }

    const changeRoute = () => {
      if (isOpen.value === true) isOpen.value = false
    }

    return {
      isAppReady,
      dialogsContainerRef,
      isLoggedIn: useAuthorization().isLoggedIn,
      isOpen,
      burgerMenuHandler,
      changeRoute,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/reset.scss';
@import '~@/styles/font.scss';
@import '~@/styles/root.scss';
@import '~@/styles/common.scss';
@import '~@/styles/buttons.scss';
@import '~@/styles/cards.scss';
@import '~@/styles/tables.scss';
@import '~@/styles/views.scss';
@import '~@/styles/load-fog.scss';
@import '~@/styles/forms.scss';
@import '~@/styles/modals.scss';
@import '~@/styles/vue-notification.scss';
@import '~@/styles/shortcuts.scss';
@import '~@/styles/atom-one-dark.scss';
#app {
  width: 100%;
  @include flex-container;
}

.burger-menu {
  display: none;
}

@media (max-width: 768px) {
  .view-header_mobile {
    position: fixed;
    width: 100%;
    z-index: 1;
    background: #fff;
  }
  .header-wrapper {
    gap: 0.4rem;
  }
  .burger-menu {
    display: flex;
    flex-shrink: 0;
  }
}
</style>
