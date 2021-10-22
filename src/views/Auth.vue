<template>
  <div class="auth">
    <div class="auth__splash">
      <img
        class="auth__splash-logo"
        src="~@/assets/brand/odin-logo-white.png"
        alt="ODIN Logo"
      />
    </div>
    <div class="auth__content">
      <img
        class="only-sm logo"
        src="~@/assets/brand/odin-logo-black.png"
        alt="ODIN Logo"
      />
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Auth',
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

.auth {
  display: grid;
  grid: 100% / 1fr 0.85fr;
  flex: 1;

  @include respond-to(sm) {
    grid: 100% / 1fr;
  }
}

.auth__splash {
  background: url('~@/assets/images/auth_background.png') no-repeat center
    #031e3a;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 76.8rem) {
    display: none;
  }
}

.auth__splash-logo {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100%;
  min-width: 22rem;
  max-width: 25vw;
  max-height: 25rem;
}

.auth__content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.6rem;
  @media (min-width: 76.8rem) {
    padding: 3.2rem;
    justify-content: flex-start;
  }
}
</style>
