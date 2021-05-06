import { QueryClient, createRpc } from '@cosmjs/stargate'
import {
  QueryAnnualProvisionsResponse,
  QueryClientImpl,
  QueryEthIntegrationAddressResponse,
  QueryInflationResponse,
  QueryParamsResponse,
  QueryTreasuryPoolResponse,
} from '@/api/codec/mint/query'

export interface MintExtension {
  mint: {
    unverified: {
      params: () => Promise<QueryParamsResponse>
      inflation: () => Promise<QueryInflationResponse>
      annualProvisions: () => Promise<QueryAnnualProvisionsResponse>
      ethIntegrationAddress: () => Promise<QueryEthIntegrationAddressResponse>
      treasuryPool: () => Promise<QueryTreasuryPoolResponse>
    }
  }
}

export function setupMintExtension(base: QueryClient): MintExtension {
  const rpc = createRpc(base)
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc)
  return {
    mint: {
      unverified: {
        params: () => {
          return queryService.Params({})
        },
        inflation: () => {
          return queryService.Inflation({})
        },
        annualProvisions: () => {
          return queryService.AnnualProvisions({})
        },
        ethIntegrationAddress: () => {
          return queryService.EthIntegrationAddress({})
        },
        treasuryPool: () => {
          return queryService.TreasuryPool({})
        },
      },
    },
  }
}