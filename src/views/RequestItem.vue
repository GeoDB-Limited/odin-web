<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <BackButton :text="'Requests'" />
      <h2 class="view-main__title">Request</h2>
      <span class="view-main__subtitle">
        #{{ String(requestData?.responsePacketData.requestId) }}
      </span>
    </div>

    <h3 class="view-main__subtitle mg-b24">Request info</h3>
    <template v-if="requestData">
      <div class="info-table mg-b32">
        <div class="info-table__row">
          <span class="info-table__row-title">Oracle Script</span>
          <TitledLink
            class="info-table__row-link"
            :text="String(requestData?.requestPacketData.oracleScriptId)"
            :to="`/oracle-scripts/${requestData?.requestPacketData.oracleScriptId}`"
          />
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Sender</span>
          <a class="app-table__cell-txt app-table__link" :href="senderLink">
            {{ requestData?.requestPacketData.clientId }}
          </a>
          <CopyButton
            class="mg-l8"
            :text="String(requestData?.requestPacketData.clientId)"
          />
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Request Time</span>
          <span>{{ requestTime }} ({{ requestTimeRange }})</span>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Resolve Time</span>
          <span>{{ resolveTime }} ({{ resolveTimeRange }})</span>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Report Status</span>
          <Progressbar
            :min="Number(requestData?.requestPacketData.minCount)"
            :max="Number(requestData?.requestPacketData.askCount)"
            :current="Number(requestData?.responsePacketData.ansCount)"
          />
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Resolve Status</span>
          <StatusBlock
            :status="String(requestStatusType[requestStatus]?.status)"
            :text="String(requestStatusType[requestStatus]?.name)"
          />
        </div>
      </div>

      <h3 class="view-main__subtitle mg-b24">Calldata</h3>
      <div class="info-table mg-b32">
        <template v-if="isObject">
          <div
            class="info-table__row"
            v-for="(val, key) in requestCalldata"
            :key="key"
          >
            <span class="info-table__row-title">{{ key }}</span>
            <span class="info-table__row-txt">{{ val }}</span>
          </div>
        </template>
        <template v-else>
          <div class="info-table__row">
            <span class="info-table__row-title">data</span>
            <span class="info-table__row-txt">
              {{ requestCalldata }}
            </span>
          </div>
        </template>
      </div>

      <template v-if="isRequestSuccess">
        <h3 class="view-main__subtitle mg-b24">Result</h3>
        <div class="info-table">
          <div class="info-table__row">
            <span class="info-table__row-title">KEY</span>
            <span class="info-table__row-txt">
              {{ requestResultName }}
            </span>
          </div>
          <div class="info-table__row">
            <span class="info-table__row-title">Rates</span>
            <span
              class="info-table__row-txt"
              v-if="requestResultType === 'object'"
            >
              <div v-for="(item, i) in requestResult" :key="item">
                {{ i }}: {{ item }}
              </div>
            </span>
            <span
              class="info-table__row-txt"
              v-if="requestResultType === 'string'"
            >
              {{ requestResult }}
            </span>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <p class="view-main__empty-msg">There is no information about request</p>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { API_CONFIG } from '@/api/api-config'
import { requestStatusType } from '@/helpers/statusTypes'
import { RequestResult, ResolveStatus } from '@provider/codec/oracle/v1/oracle'
import { formatDate, formatDateDifference } from '@/helpers/formatters'
import TitledLink from '@/components/TitledLink.vue'
import CopyButton from '@/components/CopyButton.vue'
import BackButton from '@/components/BackButton.vue'
import Progressbar from '@/components/Progressbar.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import { Obi } from '@bandprotocol/bandchain.js'
import { handleError } from '@/helpers/errors'
import isObjectLodash from 'lodash/isObject'

export default defineComponent({
  components: { TitledLink, CopyButton, BackButton, Progressbar, StatusBlock },
  setup: function () {
    const route: RouteLocationNormalizedLoaded = useRoute()

    const requestData = ref<RequestResult>()
    const requestStatus = ref()
    const requestTime = ref()
    const resolveTime = ref()
    const requestTimeRange = ref()
    const resolveTimeRange = ref()
    const requestCalldata = ref()
    const requestResult = ref()
    const requestResultName = ref()
    const requestResultType = ref()
    const senderLink = computed(() => {
      return `${API_CONFIG.odinScan}/account/${requestData.value?.requestPacketData?.clientId}`
    })
    const isObject = computed(() => {
      return isObjectLodash(requestCalldata.value)
    })
    const isRequestSuccess = computed(
      () => requestStatus.value === ResolveStatus.RESOLVE_STATUS_SUCCESS
    )

    const getRequest = async () => {
      const { request } = await callers.getRequest(String(route.params.id))
      const reqPacketData = request?.requestPacketData
      const resPacketData = request?.responsePacketData

      if (request && reqPacketData && resPacketData) {
        requestData.value = { ...request }
        requestStatus.value = resPacketData.resolveStatus
        requestTime.value = formatDate(resPacketData.requestTime)
        resolveTime.value = formatDate(resPacketData.resolveTime)
        requestTimeRange.value = formatDateDifference(resPacketData.requestTime)
        resolveTimeRange.value = formatDateDifference(resPacketData.resolveTime)
        requestCalldata.value = await _decodeCallData(reqPacketData.calldata)

        if (isRequestSuccess.value) {
          const res = await _decodeResult(resPacketData.result)
          requestResultName.value = Object.keys(res).toString() || 'Data'
          requestResult.value = res[Object.keys(res)[0]].length
            ? res[Object.keys(res)[0]].reduce(
                (accumulator: unknown, currentValue: unknown) =>
                  accumulator + ' ' + currentValue
              )
            : '[]'
          requestResultType.value = typeof requestResult.value
        }
      }
    }

    const _decodeCallData = async (calldata: Uint8Array) => {
      try {
        const { oracleScript } = await callers.getOracleScript(
          Number(requestData.value?.requestPacketData?.oracleScriptId)
        )
        if (oracleScript) {
          const obi = new Obi(oracleScript.schema)
          return obi.decodeInput(Buffer.from(calldata))
        }
      } catch (error) {
        handleError(error as Error)
      }
    }
    const _decodeResult = async (result: Uint8Array) => {
      try {
        const { oracleScript } = await callers.getOracleScript(
          Number(requestData.value?.requestPacketData?.oracleScriptId)
        )
        if (oracleScript) {
          const obi = new Obi(oracleScript.schema)
          return obi.decodeOutput(Buffer.from(result))
        }
      } catch (error) {
        handleError(error as Error)
      }
    }
    onMounted(async () => {
      try {
        await getRequest()
      } catch (error) {
        handleError(error as Error)
      }
    })

    return {
      API_CONFIG,
      ResolveStatus,
      requestStatusType,
      requestData,
      requestStatus,
      requestTime,
      resolveTime,
      requestTimeRange,
      resolveTimeRange,
      requestCalldata,
      requestResult,
      senderLink,
      isObject,
      isRequestSuccess,
      requestResultName,
      requestResultType,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-main {
  &__title {
    margin: 0 1.6rem 0 2rem;
  }

  &__empty-msg {
    text-align: center;
  }
}

@include respond-to(tablet) {
  .view-main {
    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }
  }
}
</style>
