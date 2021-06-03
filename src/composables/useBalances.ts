import { callers } from '@/api/callers'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import { computed, ComputedRef, Ref, ref } from 'vue'

const _balances: Ref<Coin[]> = ref([])

function getBalance(denom: string): Coin | undefined
function getBalance(denom: string, as: 'number'): number | undefined
function getBalance(denom: string, as: 'string'): string | undefined
function getBalance(
  denom: string,
  as?: 'number' | 'string'
): Coin | number | string | undefined {
  const coin = _balances.value.find((el) => el.denom === denom)
  if (coin && as) {
    if (as === 'number') return Number(coin.amount)
    if (as === 'string') return coin.amount
  }
  return coin
}

async function loadBalances(): Promise<void> {
  const balances = await callers.getBalances()
  console.debug('Balances:', balances)
  _balances.value = balances
}

async function clearBalances() {
  _balances.value = []
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useBalances(coinNames?: string[]) {
  let coins: Array<ComputedRef<Coin | undefined>> = []
  if (Array.isArray(coinNames) && coinNames.length) {
    coins = coinNames.map((n) => computed(() => getBalance(n)))
  }

  return {
    coins,
    get: getBalance,
    load: loadBalances,
    clear: clearBalances,
  }
}
