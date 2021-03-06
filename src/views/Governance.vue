<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Governance</h2>
      <button
        class="view-main__title-btn app-btn app-btn_small fx-sae"
        type="button"
        @click="createProposal()"
      >
        Create a proposal
      </button>
    </div>

    <div class="info-card mg-b40">
      <h3 class="info-card__title mg-b40">Total number of proposals in ODIN</h3>
      <CustomDoughnutChart :data="proposalsDataForChart" />
    </div>

    <div class="app-table">
      <div class="app-table__head">
        <span>Proposal</span>
        <span>Proposer's account ID</span>
        <span>Proposal status</span>
      </div>
      <div class="app-table__body">
        <template v-if="proposals?.length">
          <div
            v-for="item in filteredProposals"
            :key="item.proposalId.toString()"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Proposal</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.content?.title || '-'"
                :to="`/proposal/${item.proposalId}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Proposer's account ID</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${API_CONFIG.odinScan}/account/${item.proposerAddress}`"
              >
                {{ item.proposerAddress }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Proposal status</span>
              <StatusBlock
                :status="proposalStatusType[item.status].status"
                :text="proposalStatusType[item.status].name"
              />
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

    <template v-if="proposalsCount > ITEMS_PER_PAGE">
      <Pagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>

    <div class="view-main__mobile-activities">
      <button class="app-btn w-full" type="button" @click="createProposal()">
        Create a proposal
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import { API_CONFIG } from '@/api/api-config'
import {
  getTransformedProposals,
  getProposalsCountByStatus,
} from '@/helpers/proposalHelpers'
import { proposalStatusType } from '@/helpers/statusTypes'
import { handleError } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import TitledLink from '@/components/TitledLink.vue'
import CustomDoughnutChart from '@/components/charts/CustomDoughnutChart.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import Pagination from '@/components/Pagination/Pagination.vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import ProposalFormModal from '@/components/modals/ProposalFormModal.vue'

export default defineComponent({
  components: { CustomDoughnutChart, TitledLink, StatusBlock, Pagination },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const totalPages = ref()
    const proposalsCount = ref(0)
    const proposals = ref()
    const filteredProposals = ref()
    const proposalChanges = ref()
    let proposalsDataForChart = ref()

    const getProposals = async () => {
      lockLoading()
      try {
        const response = await callers.getProposals(0, '', '')
        const transformedProposals = await getTransformedProposals(
          response.proposals
        )

        proposalsCount.value = response.proposals.length
        proposals.value = transformedProposals
        totalPages.value = Math.ceil(proposalsCount.value / ITEMS_PER_PAGE)
        filterProposals(currentPage.value)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const getProposalStatistic = async () => {
      lockLoading()
      try {
        const res = await callers.getProposalsStatistic()
        const proposalsStatistic = await res.json()

        proposalsDataForChart.value =
          getProposalsCountByStatus(proposalsStatistic)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const filterProposals = (newPage: number) => {
      let tempArr = proposals.value

      if (newPage === 1) {
        filteredProposals.value = tempArr.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredProposals.value = tempArr.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    const getChangesParams = async () => {
      lockLoading()
      try {
        const res = await callers.getProposalChanges()
        const data = await res.json()

        proposalChanges.value = data
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const createProposal = async () => {
      await showDialogHandler(
        ProposalFormModal,
        {
          onSubmit: (d) => {
            d.kill()
            getProposals()
          },
        },
        { proposalChanges: proposalChanges.value }
      )
    }

    const paginationHandler = (num: number) => {
      filterProposals(num)
    }

    onMounted(async () => {
      await getChangesParams()
      await getProposalStatistic()
      await getProposals()
    })

    return {
      API_CONFIG,
      currentPage,
      totalPages,
      isLoading,
      proposalStatusType,
      proposalsDataForChart,
      ITEMS_PER_PAGE,
      proposalsCount,
      proposals,
      filteredProposals,
      createProposal,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.info-card {
  width: 60rem;
  padding: 3.2rem 2.4rem;
  border: 0.1rem solid var(--clr__action);
  border-radius: 0.8rem;

  &__title {
    font-weight: 400;
    font-size: 2.4rem;
    line-height: 2.9rem;
  }
}

.app-table {
  &__head,
  &__row {
    grid:
      auto /
      minmax(8rem, 1fr) minmax(8rem, 3fr) minmax(13rem, 0.5fr);
  }
}

@include respond-to(tablet) {
  .view-main {
    padding-bottom: 10rem;

    &__title-btn {
      display: none;
    }
  }

  .info-card {
    width: 100%;
  }

  .app-table__row {
    grid: none;
  }
}
</style>
