<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Oracle Scripts</h2>
      <button
        class="view-main__title-btn app-btn app-btn_small fx-sae"
        type="button"
        @click="createOracleScript()"
      >
        Create oracle script
      </button>
    </div>

    <template v-if="mostRequestedOracleScripts">
      <div>
        <h3 class="view-main__subtitle mg-b24">Most requested</h3>
        <TopOracleScripts :top-oracle-scripts="mostRequestedOracleScripts" />
      </div>
    </template>

    <template v-if="oracleScriptsCount">
      <div>
        <h3 class="view-main__subtitle mg-b24">All oracle scripts</h3>
        <div class="view-main__count-info">
          <p>{{ oracleScriptsCount }} Oracle Scripts found</p>
        </div>
      </div>
    </template>

    <SortRow
      :isLoading="isLoading"
      :title="'Oracle Scripts'"
      v-model:oracleScriptsName="oracleScriptsName"
      v-model:sortingOwnersValue="sortingOwnersValue"
      v-model:sortingActivitiesValue="sortingActivitiesValue"
    />

    <div class="app-table">
      <div class="app-table__head">
        <span>ID</span>
        <span>Oracle Script</span>
        <span class="app-table__head_item">Description</span>
        <span class="app-table__head_item">Timestamp</span>
      </div>
      <div class="app-table__body">
        <template v-if="oracleScripts?.length">
          <div
            v-for="item in oracleScripts"
            :key="item.attributes.id.toString()"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">ID</span>
              <span>{{ item.attributes.id }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle Script</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.attributes.name"
                :to="`/oracle-scripts/${item.attributes.id}`"
              />
            </div>
            <div class="app-table__cell oracle-scripts__table-cell_center">
              <span class="app-table__title">Description</span>
              <span>
                {{ item.attributes.description || '-' }}
              </span>
            </div>
            <div class="app-table__cell oracle-scripts__table-cell_center">
              <span class="app-table__title">Timestamp</span>
              <span>
                {{ $fDate(new Date(item.attributes.timestamp * 1000)) || '-' }}
              </span>
            </div>
            <div class="app-table__cell">
              <div
                class="app-table__activities oracle-scripts__table-activities"
              >
                <div
                  class="app-table__activities-item oracle-scripts__table-activities-item"
                >
                  <button
                    v-if="accountAddress === item.attributes.owner"
                    class="app-btn app-btn_small app-btn_outlined w-min80"
                    type="button"
                    @click="editOracleScript(item.attributes)"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <p v-if="isLoading">Loading…</p>
            <p v-else>No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="oracleScriptsCount > ITEMS_PER_PAGE">
      <Pagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>

    <div class="view-main__mobile-activities">
      <button
        class="app-btn w-full"
        type="button"
        @click="createOracleScript()"
      >
        Create oracle script
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'

import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleError } from '@/helpers/errors'
import TitledLink from '@/components/TitledLink.vue'
import Pagination from '@/components/Pagination/Pagination.vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import OracleScriptFormModal from '@/components/modals/OracleScriptFormModal.vue'
import { OracleScript } from '@provider/codec/oracle/v1/oracle'

import TopOracleScripts from '@/components/TopOracleScripts.vue'
import SortRow from '@/components/SortLine.vue'

export default defineComponent({
  components: { TitledLink, Pagination, TopOracleScripts, SortRow },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 4
    const currentPage = ref(1)
    const totalPages = ref()
    const oracleScriptsCount = ref(0)
    const oracleScripts = ref()
    const accountAddress = wallet.account.address
    const mostRequestedOracleScripts = ref()
    const oracleScriptsName = ref('')
    const sortingActivitiesValue = ref('')
    const sortingOwnersValue = ref('')
    const loadOracleScripts = async () => {
      lockLoading()
      try {
        const response = await callers
          .getSortedOracleScripts(
            currentPage.value - 1,
            ITEMS_PER_PAGE,
            sortingActivitiesValue.value,
            sortingOwnersValue.value,
            oracleScriptsName.value
          )
          .then((response) => response.json())
          .then((data) => data)
        oracleScripts.value = response.data

        await getOracleScriptsCount()
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }
    const getMostRequestedOracleScripts = async () => {
      lockLoading()
      try {
        const res = await callers
          .getSortedOracleScripts(0, 6, 'most_requested', 'null', '')
          .then((response) => response.json())
          .then((data) => data)
        mostRequestedOracleScripts.value = res.data
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }
    const getOracleScriptsCount = async () => {
      const res = await callers.getCounts()
      oracleScriptsCount.value = res.oracleScriptCount.toNumber()
      totalPages.value = Math.ceil(oracleScriptsCount.value / ITEMS_PER_PAGE)
    }

    const createOracleScript = async () => {
      await showDialogHandler(OracleScriptFormModal, {
        onSubmit: async (d) => {
          d.kill()
          await loadOracleScripts()
        },
      })
    }
    watch(
      [sortingActivitiesValue, sortingOwnersValue, oracleScriptsName],
      async () => {
        currentPage.value = 1
        await loadOracleScripts()
      }
    )
    const paginationHandler = (num: number) => {
      currentPage.value = num
      loadOracleScripts()
    }
    const editOracleScript = async (oracleScript: OracleScript) => {
      await showDialogHandler(
        OracleScriptFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadOracleScripts()
          },
        },
        { oracleScript }
      )
    }
    onMounted(async () => {
      await loadOracleScripts()
      await getMostRequestedOracleScripts()
    })

    return {
      ITEMS_PER_PAGE,
      currentPage,
      isLoading,
      oracleScriptsCount,
      oracleScripts,
      createOracleScript,
      paginationHandler,
      totalPages,
      editOracleScript,
      accountAddress,

      sortingActivitiesValue,
      sortingOwnersValue,
      mostRequestedOracleScripts,
      oracleScriptsName,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-main {
  &__count-info {
    margin-bottom: 3.2rem;
  }
}

.app-table__head,
.app-table__row {
  grid:
    auto /
    minmax(2rem, 0.5fr)
    minmax(4rem, 3fr)
    minmax(4rem, 2fr)
    minmax(8rem, 2fr)
    minmax(8rem, 2fr);
}
.app-table__head_item {
  text-align: center;
}
.oracle-scripts {
  &__table-activities {
    width: 100%;

    & > *:not(:last-child) {
      margin-bottom: 2.4rem;
    }
  }

  &__table-activities-item {
    display: flex;
    justify-content: flex-end;
    gap: 2.4rem;
  }
  &__table-cell {
    &_center {
      justify-content: center;
    }
    &_end {
      justify-content: flex-end;
    }
  }
}
@include respond-to(tablet) {
  .view-main {
    padding-bottom: 10rem;

    &__count-info {
      margin-bottom: 2.4rem;
    }

    &__title-btn {
      display: none;
    }
  }

  .app-table__row {
    grid: none;
  }

  .oracle-scripts {
    &__table-activities {
      width: 100%;
    }

    &__table-activities-item {
      & > * {
        flex: 1;
      }
    }
    &__table-cell {
      &_center {
        justify-content: flex-start;
      }
      &_end {
        justify-content: flex-start;
      }
    }
  }
}
</style>
