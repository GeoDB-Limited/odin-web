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

    <h3 class="view-subtitle mg-b24">Most requested</h3>
    <div
      class="most-requested__block mg-b40"
      v-if="mostRequestedScripts?.length"
    >
      <OracleScriptCard
        v-for="item in mostRequestedScripts"
        :key="item.id.toString()"
        :oracleScript="item"
      />
    </div>

    <h3 class="view-subtitle mg-b24">All oracle scripts</h3>
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
              <TitledLink class="app-table__link" :text="item.name" />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Description</span>
              <span>{{ item.description }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Timestamp</span>
              <div class="app-table__time">
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
import { callers } from '@/api/callers'
import { showOracleScriptFormDialog } from '@/components/modals/OracleScriptFormModal.vue'
import OracleScriptCard from '@/components/OracleScriptCard.vue'
import Input from '@/components/inputs/Input.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import TitledLink from '@/components/TitledLink.vue'
import Pagination from '@/components/pagination/pagination.vue'

export default defineComponent({
  components: {
    OracleScriptCard,
    TitledLink,
    Input,
    SearchIcon,
    Pagination,
  },
  setup() {
    const oracleScripts = ref()
    const mostRequestedScripts = ref()

    const loadOracleScripts = async () => {
      const response = await callers.getOracleScripts(100)
      console.log(response);
      console.debug('OracleScripts:', response)
      const testMostRequested = [
        {
          id: '111',
          description: 'ODIN Standard Dataset oracle script for querying cryptocurrency prices',
          name: 'ODIN Standard Dataset (Crypto)',
          requestsNumber: '3,715,316',
          responseTime: '9.90s',
        },
        {
          id: '222',
          description: 'ODIN Standard Dataset oracle script for querying cryptocurrency prices',
          name: 'ODIN Standard Dataset (Crypto)',
          requestsNumber: '3,715,316',
          responseTime: '9.90s',
        },
        {
          id: '333',
          description: 'ODIN Standard Dataset oracle script for querying cryptocurrency prices',
          name: 'ODIN Standard Dataset (Crypto)',
          requestsNumber: '3,715,316',
          responseTime: '9.90s',
        },
        {
          id: '444',
          description: 'ODIN Standard Dataset oracle script for querying cryptocurrency prices',
          name: 'ODIN Standard Dataset (Crypto)',
          requestsNumber: '3,715,316',
          responseTime: '9.90s',
        },
        {
          id: '555',
          description: 'ODIN Standard Dataset oracle script for querying cryptocurrency prices',
          name: 'ODIN Standard Dataset (Crypto)',
          requestsNumber: '3,715,316',
          responseTime: '9.90s',
        },
        {
          id: '666',
          description: 'ODIN Standard Dataset oracle script for querying cryptocurrency prices',
          name: 'ODIN Standard Dataset (Crypto)',
          requestsNumber: '3,715,316',
          responseTime: '9.90s',
        },
      ]
      const testData = [
        { id: '111', description: 'orcl desc', name: 'oracle name1' },
        { id: '222', description: 'orcl desc', name: 'oracle name2' },
        { id: '333', description: 'orcl desc', name: 'oracle name3' },
        { id: '444', description: 'orcl desc', name: 'oracle name4' },
        { id: '555', description: 'orcl desc', name: 'oracle name5' },
      ]
      oracleScripts.value = [...testData]
      mostRequestedScripts.value = [...testMostRequested]
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

    // Pagination
    const paginationHandler = (num: number) => {
      console.log('change page: ', num)
    }

    return {
      oracleScripts,
      mostRequestedScripts,
      createOracleScript,
      searchInput,
      searchSubmit,
      sortBySelect,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.most-requested__block {
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2.4rem;
}

.app-table {
  &__controls {
    font-size: 14px;
    font-weight: 300;
    line-height: 2rem;
  }

  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__sort {
    gap: 2.4rem;
    &__title {
      margin-right: 1.6rem;
    }
  }

  &__search {
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid transparent;
    &-submit {
      width: 4.8rem;
      height: 4.8rem;
      border-bottom: 0.1rem solid #ced4da;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.5s ease;
      svg {
        fill: #212529;
      }
      &:hover {
        background: var(--clr__action);
        svg {
          fill: #fff;
        }
      }
    }

    &-input {
      border: none;
      border-radius: 0;
      border-bottom: 0.1rem solid #ced4da;
      &:focus {
        border: none;
        border-bottom: 0.1rem solid var(--clr__action);
      }
    }

    &:hover {
      border-bottom: 0.1rem solid var(--clr__action);
      .app-table__search-submit,
      .app-table__search-input {
        border: none;
        border-bottom: 0.1rem solid var(--clr__action);
      }
    }
  }
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

@media (max-width: 768px) {
  .app-table {
    &__controls {
      flex-direction: column;
      margin-bottom: 0;
    }

    &__search {
      width: 100%;
      margin-bottom: 1.6rem;

      &-input {
        width: 100%;
      }
    }

    &__sort {
      width: 100%;

      &-by {
        display: flex;
        flex-direction: column;
      }

      .vue-picker {
        width: 100%;
      }
    }
  }
}

@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .most-requested__block {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow: auto;
  }
}
</style>
