<template>
  <div class="container">
    <div class="block-item">
      <div class="block-item__title">
        <button class="block-back" @click.prevent="back">
          <img src="~@/assets/icons/back-arrow.svg" alt="info" />
        </button>
        <h1 class="block-name">Block</h1>
        <span class="block-id">{{ route.params.id }}</span>
      </div>
      <div class="block-chars">
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <img src="~@/assets/icons/info.svg" alt="info" />
            Block height:
          </div>
          <div class="info-value">
            {{ blockInfo.block?.header.height }}
            <button
              class="copy-button"
              @click.prevent="copyValue(blockInfo.block?.header.height)"
            >
              <img src="~@/assets/icons/copy.svg" alt="info" />
            </button>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <img src="~@/assets/icons/info.svg" alt="info" />
            Block hash:
          </div>
          <div class="info-value text-blue">
            0x{{ blockInfo.block_id?.hash }}
            <button
              class="copy-button"
              @click.prevent="copyValue('0x' + blockInfo.block_id?.hash)"
            >
              <img src="~@/assets/icons/copy.svg" alt="info" />
            </button>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <img src="~@/assets/icons/info.svg" alt="info" />
            Block parent hash::
          </div>
          <div class="info-value text-blue">
            0x{{ blockInfo.block?.header.last_commit_hash }}
            <button
              class="copy-button"
              @click.prevent="
                copyValue('0x' + blockInfo.block?.header.last_commit_hash)
              "
            >
              <img src="~@/assets/icons/copy.svg" alt="info" />
            </button>
          </div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <img src="~@/assets/icons/info.svg" alt="info" />
            Timestamp:
          </div>
          <div class="info-value">{{ blockInfo.block?.header.time }}</div>
        </div>
        <div class="data-sources__table-row app-table__row">
          <div class="info-key">
            <img src="~@/assets/icons/info.svg" alt="info" />
            Block’s transactions:
          </div>
          <div class="info-value">{{ blockSize?.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { callers } from '@/api/callers'

export default {
  // eslint-disable-next-line
  setup() {
    const router = useRouter()
    const back = () => {
      router.back()
    }
    const route = useRoute()

    const blockInfo = ref([])
    const blockSize = ref()
    const blockTrs = ref()
    const blockHash = ref()

    const getBlock = async () => {
      await callers
        .getAllBlocks({
          min_height: route.params.id,
          max_height: route.params.id,
        })
        .then((res) => res.json())
        .then((data) => {
          blockSize.value = data.result.block_metas[0].block_size
          blockTrs.value = data.result.block_metas[0].num_txs
          blockHash.value = data.result.block_metas[0].block_id.hash
        })
        .then(() => getBlockInfo())
    }
    const getBlockInfo = async () => {
      await callers
        .getBlockInfo({ hash: blockHash.value })
        .then((res) => res.json())
        .then((data) => {
          blockInfo.value = data.result
        })
    }

    const copyValue = (text) => {
      window.navigator.clipboard.writeText(text)
    }

    onMounted(() => {
      getBlock()
    })

    return {
      blockInfo,
      route,
      blockSize,
      blockHash,
      back,
      copyValue,
    }
  },
}
</script>
<style lang="scss" scoped>
* {
  font-family: 'SF Display';
}
.block {
  &-item {
    padding: 2.6rem 3.3rem;

    &__title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-weight: 400;

      & > * {
        margin-right: 20px;
      }
    }
  }

  &-row {
    display: flex;
    padding-bottom: 1.6rem;
    padding-top: 1.6rem;
    border-bottom: 1px solid #cce4ff;

    &__title {
      max-width: 209px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      img {
        display: block;
        margin-right: 9px;
      }
    }
  }

  &-id {
    text-overflow: ellipsis;
    max-width: 200px;
    font-size: 24px;
    font-weight: 400;
  }

  &-chars {
    padding-top: 1.9rem;

    .app-table__row {
      display: grid;
      grid-template-columns: 207px 1fr;
      padding: 1.6rem 0 1.6rem;
    }
  }
}

.copy-possible {
  color: #007bff;
  font-size: 14px;
  font-weight: 300;
  display: inline-block;
  margin-right: 10px;
}

.info {
  &-value {
    display: flex;
    align-items: center;
  }

  &-key {
    display: flex;
    width: 207px;
    align-items: center;

    img {
      display: block;
      margin-right: 9px;
    }
  }
}

.text-blue {
  color: #007bff;
}

.copy-button {
  display: block;
  margin-left: 10px;
}
</style>
