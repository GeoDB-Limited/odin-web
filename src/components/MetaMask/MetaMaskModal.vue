<template>
  <ModalBase class="exchange-form-modal" @close="onClose()">
    <template #title>
      <img src="~@/assets/brand/metamask-fox.svg" alt="metamask_logo" />
    </template>
    <template #main>
      <form
        class="app-form load-fog metamask-form"
        :class="{ 'load-fog_show': isLoading }"
      >
        <template v-if="!account || needAuth.value">
          <div class="app-form__field metamask-form__field--centered">
            <button
              class="app-btn"
              type="button"
              @click="connectMetaMask()"
              :disabled="isLoading"
            >
              Connect to MetaMask
            </button>
          </div>
        </template>
        <template v-else>
          <template v-if="odinBalanceOnProvider">
            <transition name="fade" mode="out-in">
              <div
                v-if="metaLoading"
                :key="'wait'"
                class="app-form__field app-form__field--wait"
              >
                <transition name="fade" mode="out-in">
                  <span
                    class="app-form__field--wait-text"
                    :key="metaLoadingText"
                  >
                    <span class="empty-loading loading"></span>
                    {{ metaLoadingText }}
                  </span>
                </transition>
              </div>
              <div key="'content'" v-else>
                <div class="app-form__field">
                  <label class="app-form__field-lbl">
                    You Balance (ODIN)
                  </label>
                  <input
                    class="
                      app-form__field-input app-form__field-input--disabled
                    "
                    type="text"
                    v-model="odinBalanceOnProvider"
                    disabled
                  />
                </div>
                <div class="app-form__field" v-if="maxWithdrawalPerTime">
                  <label class="app-form__field-lbl">
                    Max deposit amount per time ({{
                      maxWithdrawalPerTime?.denom.toUpperCase()
                    }})
                  </label>
                  <input
                    class="
                      app-form__field-input app-form__field-input--disabled
                    "
                    type="text"
                    :value="maxWithdrawalPerTime.amount"
                    disabled
                  />
                </div>
                <div class="app-form__field">
                  <label class="app-form__field-lbl"> Amount (ODIN) </label>
                  <input
                    class="app-form__field-input"
                    type="number"
                    v-model="form.amount"
                  />
                  <p v-if="form.amountErr" class="app-form__field-err">
                    {{ form.amountErr }}
                  </p>
                </div>
                <div class="app-form__field" v-if="expectedAmount">
                  <label class="app-form__field-lbl">
                    Expected amount (LOKI)
                  </label>
                  <input
                    class="
                      app-form__field-input app-form__field-input--disabled
                    "
                    type="text"
                    :value="expectedAmount"
                    disabled
                  />
                </div>
                <div class="app-form__footer">
                  <button
                    class="app-btn"
                    type="button"
                    @click="exchange"
                    :disabled="!form.isValid || isLoading"
                  >
                    Exchange
                  </button>
                </div>
              </div>
            </transition>
          </template>
        </template>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { memoize, preventIf } from '@/helpers/functions'
import { DialogPayloadHandler, dialogs } from '@/helpers/dialogs'
import { DecoratedFn } from '@/shared-types'
import { TransactionReceipt } from 'web3-core/types'
import { handleError } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from '@/components/modals/ModalBase.vue'
import { useWeb3 } from '@/composables/useWeb3/useWeb3'
import { big, bigFromPrecise } from '@/helpers/bigMath'
import { wallet } from '@/api/wallet'
import { NumLike, NumLikeTypes } from '@/helpers/casts'
import BigNumber from 'bignumber.js'

const MetaMaskFormModal = defineComponent({
  name: 'MetaMaskModal',
  components: { ModalBase },
  props: {
    maxWithdrawalPerTime: { type: Object, required: true },
    odinToLokiRate: { type: Object, required: true },
    burnFee: { type: NumLikeTypes as PropType<NumLike>, required: true },
  },
  setup(props) {
    const needAuth = ref<boolean>(false)
    const metaLoading = ref<boolean>(false)
    const metaLoadingText = ref<string>('Please wait for approval')
    const account = ref<string | null>(null)
    const odinBalanceOnProvider = ref<string | null>()
    const expectedAmount = ref<string>('0')

    const { web3, contracts } = useWeb3()

    const _calcAmount = (value: string | null): BigNumber | null => {
      if (!value) return null
      const decimals = big.pow(10, 18)
      return big.multiply(value, decimals)
    }

    const _calcNet = memoize((value: string | null): BigNumber | null => {
      if (!value) return null

      const feeFactor = big.divide(props.burnFee, 10000, { decimals: 2 })
      const fee = big.multiply(value, feeFactor)
      return big.subtract(value, fee)
    })

    const _calcExpected = memoize((value: NumLike | null): BigNumber | null => {
      if (!value) return null
      return big.multiply(value, big.fromPrecise(props.odinToLokiRate.rate))
    })

    const form = useForm({
      amount: [
        '0',
        validators.required,
        validators.valueMapper(
          (v) => _calcExpected(_calcNet(v as string)),
          validators.bigMin(
            undefined,
            props.maxWithdrawalPerTime?.denom?.toUpperCase()
          ),
          validators.bigMax(
            props.maxWithdrawalPerTime.amount,
            props.maxWithdrawalPerTime?.denom?.toUpperCase()
          )
        ),
      ],
    })

    const _reCalcNetAndExpected = async () => {
      const amount = form.amount.val()
      const netAmountRaw = _calcNet(amount)
      const expectedRaw = _calcExpected(netAmountRaw)
      if (!amount || !netAmountRaw || !expectedRaw) {
        expectedAmount.value = '0'
        return
      }

      expectedAmount.value = big.toStrStrict(expectedRaw)
    }

    watch(() => form.amount.val(), _reCalcNetAndExpected)

    const isLoading = ref(false)
    const onClose: DecoratedFn<DialogPayloadHandler> = preventIf(
      dialogs.getHandler('onClose'),
      isLoading
    )

    const isNeedAuth = async () => {
      const accounts = await web3.eth.getAccounts()
      needAuth.value = accounts.length <= 0
    }
    const getBalance = async (): Promise<void> => {
      const balance = await contracts.odin.methods
        .balanceOf(account.value as string)
        .call()
      const decimals = await contracts.odin.methods.decimals().call()

      const temp = bigFromPrecise(balance, decimals).toString()

      odinBalanceOnProvider.value = temp
      if (temp) isLoading.value = false
    }

    const sendApprove = async (
      amount: string | BigNumber
    ): Promise<TransactionReceipt> => {
      return new Promise((resolve, reject) => {
        // use bridge address instead of account address for approve
        contracts.odin.methods
          .approve(
            process.env.VUE_APP_BRIDGE as string,
            big.toStrStrict(amount)
          )
          .send()
          .on('receipt', (_) => resolve(_))
          .on('error', (err) => reject(err))
      })
    }
    const sendDeposit = async (
      amount: string | BigNumber
    ): Promise<TransactionReceipt> => {
      return new Promise((resolve, reject) => {
        contracts.bridge.methods
          .deposit(
            wallet.account.address,
            contracts.odin.options.address,
            big.toStrStrict(amount)
          )
          .send()
          .on('receipt', (event) => resolve(event))
          .on('error', (err) => reject(err))
      })
    }
    const exchange = async (): Promise<void> => {
      isLoading.value = true
      metaLoading.value = true
      try {
        const res: TransactionReceipt = await sendApprove(
          _calcAmount(form.amount.val()) as BigNumber
        )
        if (res.status) {
          metaLoadingText.value = 'Confirmed'
          const res: TransactionReceipt = await sendDeposit(
            _calcAmount(form.amount.val()) as BigNumber
          )
          if (res.status) metaLoading.value = false
        }
      } catch (error) {
        handleError(error as Error)
      } finally {
        metaLoadingText.value = 'Please wait for approval'
        metaLoading.value = false
        isLoading.value = false
      }
    }

    const connectMetaMask = async (): Promise<void> => {
      await web3.eth.requestAccounts()
    }

    useWeb3({
      onAccountConnected: async (acc: string): Promise<void> => {
        account.value = acc
        if (account.value) {
          try {
            await getBalance()
          } catch (error) {
            handleError(error as Error)
          }
        }
        isLoading.value = false
        console.log('onAccountConnected')
      },
      onAccountDisconnected: (): void => {
        account.value = null
        odinBalanceOnProvider.value = null
        console.log('onAccountDisconnected')
      },
      onProviderDetected: async (): Promise<void> => {
        try {
          await isNeedAuth()
        } catch (error) {
          handleError(error as Error)
        }
      },
      onProviderUndetected: async (): Promise<void> => {
        console.debug('onProviderUndetected')
      },
    })

    return {
      form: form.flatten(),
      isLoading,
      onClose,
      connectMetaMask,
      account,
      odinBalanceOnProvider,
      expectedAmount,
      needAuth,
      exchange,
      metaLoading,
      metaLoadingText,
    }
  },
})

export default MetaMaskFormModal
</script>
