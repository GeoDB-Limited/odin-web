<template>
  <div class="oracle-scripts view-main">
    <div class="fx-row mg-b32">
      <h2 class="view-title">Oracle Scripts</h2>
      <button
        class="app-btn create-script-btn--top fx-sae"
        type="button"
        @click="createOracleScript()"
      >
        Create oracle script
      </button>
    </div>

    <h3 class="page-subtitle">Most requested</h3>
    <div class="most-requested__wrapper">
      <div class="most-requested__item">
        <span class="most-requested__title">ODIN Standard Dataset</span>
        <span class="most-requested__description">ODIN Standard Dataset oracle script for querying cryptocurrency prices</span>
        <div class="most-requested__info">
          <div class="info__item">
            <span class="info__title">Request number</span>
            <span>3,715,316</span>
          </div>
          <div class="info__item">
            <span class="info__title">Response time</span>
            <span>9.90 s</span>
          </div>
        </div>
      </div>
    </div>

    <h3 class="page-subtitle">All oracle scripts</h3>
    <div class="app-table__controls mg-b32">
      <div class="app-table__search">
        <Input
          classString="app-table__search-input"
          v-model="searchInput"
          placeholder="Search"
          @keypress.enter="searchSubmit($event)"
        />
        <button @click="searchSubmit($event)" class="app-table__search-submit">
          <SearchIcon />
        </button>
      </div>
      <div class="app-table__sort">
        <div class="app-table__sort-by">
          <span class="app-table__sort__title"> Sort by </span>
          <VuePicker
            class="_vue-picker"
            placeholder="Sort by"
            v-model="sortBySelect"
          >
            <template #dropdownInner>
              <div class="_vue-picker__dropdown-custom">
                <VuePickerOption value="most" text="Most Requested">
                  Most Requested
                </VuePickerOption>
              </div>
              <div class="_vue-picker__dropdown-custom">
                <VuePickerOption value="latest" text="Latest Update">
                  Latest Update
                </VuePickerOption>
              </div>
            </template>
          </VuePicker>
        </div>
      </div>
    </div>

    <div class="app-table">
      <div class="app-table__head">
        <span>Oracle Scripts</span>
        <span>Description</span>
        <span>Timestamp</span>
      </div>
      <div class="table__body">
        <template v-if="oracleScripts?.length">
          <div
            v-for="item in oracleScripts"
            :key="item.id.toString()"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">OracleScript</span>
              <TitledLink class="table-link" :text="item.name" />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Description</span>
              <span>{{ item.description }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Timestamp</span>
              <div class="table-time">
                <span>14:50</span>
                <span>02.06.2021</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div>
            <span>No items yet</span>
          </div>
        </template>
      </div>
    </div>

    <Pagination
      @changePageNumber="paginationHandler($event)"
      :blocksPerPage="4"
      :total-length="8"
    />

    <button
      class="app-btn create-script-btn--bottom fx-sae"
      type="button"
      @click="createOracleScript()"
    >
      Create Oracle Script
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import router from '@/router'
import { callers } from '@/api/callers'
import { showOracleScriptFormDialog } from '@/components/modals/OracleScriptFormModal.vue'
import { OracleScript } from '@provider/codec/oracle/v1/oracle'
import TitledLink from '@/components/TitledLink.vue'
import Pagination from '@/components/pagination/pagination.vue'

export default defineComponent({
  components: {
    TitledLink,
    Pagination,
  },
  setup() {
    const oracleScripts = ref()

    const loadOracleScripts = async () => {
      const response = await callers.getOracleScripts(100)
      console.debug('OracleScripts:', response)
      const testData = [
        { id: '111', description: 'orcl desc', name: 'oracle name1' },
        { id: '222', description: 'orcl desc', name: 'oracle name2' },
        { id: '333', description: 'orcl desc', name: 'oracle name3' },
        { id: '444', description: 'orcl desc', name: 'oracle name4' },
        { id: '555', description: 'orcl desc', name: 'oracle name5' },
      ]
      oracleScripts.value = testData
      // oracleScripts.value = response.oracleScripts
    }
    loadOracleScripts()

    const createOracleScript = async () => {
      showOracleScriptFormDialog({
        onSubmit: (d) => {
          d.kill()
          loadOracleScripts()
        },
      })
    }

    // search field
    const searchInput = ref()
    const searchSubmit = (event: Event | InputEvent | MouseEvent) => {
      event.preventDefault()
      console.log('value: ', searchInput.value)
    }

    const sortBySelect = ref('most')

    return {
      oracleScripts,
      createOracleScript,
      searchInput,
      searchSubmit,
      sortBySelect,
    }
  },
})
</script>

<style lang="scss" scoped>
.app-table {
  &__title {
    display: none;
    font-size: 1.4rem;
  }

  &__row {
    padding: 3.6rem 0 4.4rem;
  }

  .table-time {
    display: flex;
    flex-direction: column;
  }
}

.table-link {
  text-decoration: none;
  color: var(--clr__action);
}

.create-script-btn {
  &--bottom {
    display: none;
    width: 100%;
    @media (max-width: 768px) {
      display: block;
    }
  }
  &--top {
    display: block;
    @media (max-width: 768px) {
      display: none;
    }
  }
}

@media screen and (max-width: 768px) {
  .app-table {
    &__head {
      display: none;
    }

    &__title {
      display: inline-block;
      min-width: 170px;
      margin-right: 2.4rem;
    }

    &__row {
      grid: none;
      padding: 3.4rem 0 1.6rem;
    }
  }
}
</style>
