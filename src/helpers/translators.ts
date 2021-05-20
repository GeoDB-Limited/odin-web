import {
  Proposal,
  ProposalStatus,
  TallyResult,
} from '@provider/codec/cosmos/gov/v1beta1/gov'
import { ResolveStatus } from '@provider/codec/oracle/v1/oracle'
import { formatDate } from './formatters'

// TODO: translate

export function translateRequestStatus(resolveStatus: ResolveStatus): string {
  switch (resolveStatus) {
    case ResolveStatus.RESOLVE_STATUS_OPEN_UNSPECIFIED:
      return 'Unspecified'
    case ResolveStatus.RESOLVE_STATUS_SUCCESS:
      return 'Success'
    case ResolveStatus.RESOLVE_STATUS_FAILURE:
      return 'Failure'
    case ResolveStatus.RESOLVE_STATUS_EXPIRED:
      return 'Expired'
    case ResolveStatus.UNRECOGNIZED:
    default:
      return 'Unrecognized'
  }
}

export function translateProposalStatus(status: ProposalStatus): string {
  switch (status) {
    case ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED:
      return 'Unspecified'
    case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
      return 'Deposit period'
    case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
      return 'Voting period'
    case ProposalStatus.PROPOSAL_STATUS_PASSED:
      return 'Passed'
    case ProposalStatus.PROPOSAL_STATUS_REJECTED:
      return 'Rejected'
    case ProposalStatus.PROPOSAL_STATUS_FAILED:
      return 'Failed'
    case ProposalStatus.UNRECOGNIZED:
    default:
      return 'Unrecognized'
  }
}

export function translateProposalStatusDated(proposal: Proposal): string {
  switch (proposal.status) {
    case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
      return `Deposit till ${formatDate(proposal.depositEndTime as Date, {
        default: 'MMM d, yyyy, HH:mm',
        thisYear: 'MMM d, HH:mm',
      })}`
    case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
      return `Voting till ${formatDate(proposal.votingEndTime as Date, {
        default: 'MMM d, yyyy, HH:mm',
        thisYear: 'MMM d, HH:mm',
      })}`
    default:
      return translateProposalStatus(proposal.status)
  }
}

export function translateTally(tally: TallyResult): string {
  return Object.entries(tally)
    .map(([opt, count]) => {
      return `${translateTallyOpt(opt as keyof TallyResult)}: ${count}`
    })
    .join('\n')
}

export function translateTallyOpt(tallyVote: keyof TallyResult): string {
  switch (tallyVote) {
    case 'yes':
      return 'Yes'
    case 'abstain':
      return 'Abstain'
    case 'no':
      return 'No'
    case 'noWithVeto':
      return 'Veto'
  }
}

export function translateTallyShort(tally: TallyResult): string {
  return Object.entries(tally)
    .map(([opt, count]) => {
      return `${translateTallyOptShort(opt as keyof TallyResult)}: ${count}`
    })
    .join(', ')
}

export function translateTallyOptShort(tallyVote: keyof TallyResult): string {
  switch (tallyVote) {
    case 'yes':
      return 'Y'
    case 'abstain':
      return 'A'
    case 'no':
      return 'N'
    case 'noWithVeto':
      return 'V'
  }
}
