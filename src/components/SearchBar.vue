<template>
  <div class="container mg-b32">
    <div class="search__row">
      <select
        class="app-form__field-input app-filter"
        name="filter"
        v-model="activeFilter"
      >
        <option v-for="(filter, index) in filters" :key="index" :value="filter">
          {{ filter }}
        </option>
      </select>
      <input
        type="search"
        class="filter-search"
        placeholder="searching by account address , thx hash, block"
        v-model="searchedText"
      />
      <button @click.prevent="searchText" class="search-btn">
        <img src="~@/assets/icons/search.svg" alt="search" />
      </button>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  // eslint-disable-next-line
  setup() {
    const filters = ref([])
    filters.value = ['All filters', 'Blocks', 'Tx hash']

    const activeFilter = ref('')
    activeFilter.value = filters.value[0]

    const searchedText = ref('')

    const searchText = () => {
      console.log(searchedText.value)
    }

    return {
      filters,
      activeFilter,
      searchedText,
      searchText,
    }
  },
}
</script>
<style lang="scss" scoped>
.search__row {
  margin: 0 auto;
  padding: 0 3.2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.app-filter {
  max-width: 126px;
  height: 48px;
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;

  &:focus {
    border: 1px solid var(--clr__input-border);
  }
}

.filter-search {
  height: 48px;

  padding: 12px 15px;
  width: 100%;
  max-width: 426px;
  border: 1px solid #ced4da;
  border-left: none;
  border-right: none;

  &::placeholder {
    color: #6c757d;
  }
}

.search-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #007bff;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;

  img {
    width: 18px;
    height: 18px;
    display: block;
  }
}
</style>
