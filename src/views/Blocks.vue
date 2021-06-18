<template>
  <div class="blocks-container">
    <div class="data-sources view-main">
      <div class="mg-b16 mg-t32">
        <h2 class="view-title">Blocks</h2>
      </div>
      <div class="mg-b16 mg-t16">
        <p>{{ blocks?.length }} blocks found</p>
      </div>
      <div class="app-table">
        <div class="data-sources__table-head app-table__head">
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Block </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Date and time </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transactions </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Validator </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Reward </span>
          </div>
        </div>
        <template v-if="filteredBlocks?.length">
          <div
            v-for="item in filteredBlocks"
            :key="item.id"
            class="data-sources__table-row app-table__row"
          >
            <div class="app-table__cell">
              <router-link :to="`/blocks/${item.header.height}`">
                <TitledLink
                  class="app-table__cell-txt"
                  :text="item.header.height"
                />
              </router-link>
            </div>
            <div class="app-table__cell column">
              <TitledSpan
                class="app-table__cell-txt"
                :text="item.header.time"
              />
            </div>
            <div class="app-table__cell">
              <TitledSpan class="app-table__cell-txt" :text="item.num_txs" />
            </div>
            <div class="app-table__cell">
              <TitledLink
                class="app-table__cell-txt"
                :text="item.header.validators_hash"
              />
            </div>
            <div class="app-table__cell">
              <TitledSpan class="app-table__cell-txt" :text="item.block_size" />
              {{ item.header.chain_id }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__row">
            <p class="app-table__empty-stub">No items yet</p>
          </div>
        </template>
      </div>
      <div class="pagination-wrapper mg-t32">
        <v-pagination
          v-model="page"
          :pages="totalPages"
          :range-size="1"
          active-color="#007bff"
          @update:modelValue="updateHandler"
          :hideFirstButton="true"
          :hideLastButton="true"
        >
        </v-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import TitledSpan from '@/components/TitledSpan.vue'
import TitledLink from '@/components/TitledLink.vue'
import { defineComponent, ref, onMounted } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'

export default defineComponent({
  components: { TitledSpan, TitledLink, VPagination },
  setup() {
    const blocks = ref()
    const filteredBlocks = ref()
    const blocksPerPage = 5
    const page = ref(1)
    const totalPages = ref()

    const loadBlocks = async () => {
      await callers
        .getAllBlocks({ min_height: 100, max_height: 500 })
        .then((res) => res.json())
        .then((data) => {
          blocks.value = [...data.result.block_metas]
          totalPages.value = blocks.value.length / blocksPerPage
        })
        .then(() => filterBlocks(page.value))
    }

    const filterBlocks = async (newPage: number) => {
      let tempArr = blocks.value

      if (newPage === 1) {
        filteredBlocks.value = tempArr.slice(0, newPage * blocksPerPage)
      } else {
        filteredBlocks.value = tempArr.slice(
          (newPage - 1) * blocksPerPage,
          (newPage - 1) * blocksPerPage + blocksPerPage
        )
      }
      page.value = newPage
    }

    const updateHandler = (num: number) => {
      filterBlocks(num)
    }

    onMounted(() => {
      loadBlocks()
    })

    return {
      blocks,
      page,
      totalPages,
      filteredBlocks,
      filterBlocks,
      updateHandler,
    }
  },
})
</script>

<style scoped>
* {
  font-family: 'SF Display';
}
.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    minmax(4rem, 1fr) minmax(4rem, 1fr) minmax(4rem, 1fr) minmax(4rem, 1fr) minmax(4rem, 1fr);
}

.blocks-container {
  border-top: 1px solid var(--clr__table-border);
}

.column {
  flex-direction: column;
}

.app-table__row {
  padding: 3.2rem 0 2rem;
}

.app-table__cell-txt {
  max-width: 200px;
}

.view-title {
  font-weight: 400;
}
</style>
<style lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;

  li {
    background: #fff;
    border: 1px solid #007bff;
    border-radius: 4px;
    margin: 0 4px;
    min-width: 26px;
    height: 36px;
  }

  button {
    height: 100%;
    width: 100%;
    border: none;
    margin: 0;
    padding: 10px;
  }

  .Page {
    color: #007bff;

    &:hover {
      border: none;
    }
  }
  .Page-active {
    color: #fff;
  }

  .PaginationControl .Control.Control-active {
    fill: #007bff;
  }
  .PaginationControl .Control {
    fill: #cce4ff;
  }

  .DotsHolder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    svg,
    path {
      color: #007bff;
    }
  }
}
</style>
