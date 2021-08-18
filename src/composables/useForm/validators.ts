import { bigMath } from '@/helpers/bigMath'
import { NumLike } from '@/helpers/casts'

export type FormFieldValidator = (...args: unknown[]) => string | null
export type FormFieldValidatorResult = ReturnType<FormFieldValidator>

// TODO: translate validation errors

export const required: FormFieldValidator = (val: unknown) => {
  if (!val && val !== 0) return 'The field is required'
  return null
}

const NUMBER_RE = /^[+-]?\d*\.?\d+(?:[Ee][+-]?\d+)?$/
export const number: FormFieldValidator = (val: unknown) => {
  if (
    (typeof val === 'string' && !NUMBER_RE.test(val)) ||
    (typeof val === 'number' && Number.isNaN(val))
  ) {
    return 'The value should represent a number'
  }
  return null
}

export function num(minimum?: number, maximum?: number): FormFieldValidator[] {
  const validators: FormFieldValidator[] = [number]

  const gotMin = minimum || minimum === 0
  const gotMax = maximum || maximum === 0
  if (gotMin && gotMax) {
    validators.push(range(minimum as number, maximum as number))
  } else if (gotMin) {
    validators.push(min(minimum as number))
  } else if (gotMax) {
    validators.push(max(maximum as number))
  }
  return validators
}

export function min(minimum: number): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const num = Number(val)
    if (!Number.isNaN(num) && num < minimum) {
      return `The value should be larger than ${minimum}`
    }
    return null
  }
}

export function max(maximum: number): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const num = Number(val)
    if (!Number.isNaN(num) && num > maximum) {
      return `The value should be lower than ${maximum}`
    }
    return null
  }
}

export function range(minimum: number, maximum: number): FormFieldValidator {
  const _min = min(minimum)
  const _max = max(maximum)
  return (val: unknown): FormFieldValidatorResult => {
    return _min(val) || _max(val)
  }
}

export function minItems(minNum: number): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    if (
      (val instanceof Set && val.size < minNum) ||
      (Array.isArray(val) && val.length < minNum)
    ) {
      return `Select at least ${minNum} item(s)`
    }
    return null
  }
}

export function oneOf(subset: unknown[]): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    if ((val || val === 0) && !subset.includes(val)) {
      return `Value is out of allowed subset: ${subset}`
    }
    return null
  }
}

// TODO: real validator
export const erc20Address: FormFieldValidator = (val: unknown) => {
  if (val && typeof val === 'string' && val.length < 8) {
    return 'Invalid address'
  }
  return null
}

export function bigMathCompare(
  burnFee: NumLike,
  maxWithdrawalPerTime: NumLike,
  odinToLokiRate: NumLike
): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const actual_amount = bigMath.subtract(
      Number(val as number),
      bigMath.multiply(
        // TODO: decimals
        // {decimals: Number(bigMath.toStrStrict(bigMath.pow(10, 18))),}
        // Error: [BigNumber Error] DECIMAL_PLACES out of range: 1000000000000000000
        bigMath.divide(burnFee, 10000),
        Number(val as number)
      )
    )
    const converted_amount = bigMath.multiply(
      bigMath.toPrecise(actual_amount),
      bigMath._bn(odinToLokiRate)
    )

    console.group('validator')
    console.log(
      '%c bigMathCompare ',
      'padding: 0.3rem;color: white; background-color: #2274A5'
    )
    console.table(
      'input value',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      val as number
    )
    console.table(
      'input bigMath.toStrStrict(bigMath._bn(val))',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bigMath.toStrStrict(bigMath._bn(val)) as number
    )
    console.table(
      'bigMath.divide(burnFee, 10000)',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bigMath.divide(burnFee, 10000, { decimals: 10 ** 8 }) as number
    )
    console.table(
      'converted_amount toStrStrict',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bigMath.toStrStrict(converted_amount) as number
    )
    console.table(
      'bigMath.toStrStrict(bigMath._bn(maxWithdrawalPerTime))',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bigMath.toStrStrict(bigMath._bn(maxWithdrawalPerTime))
    )
    console.table(
      'bigMath.compare:',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bigMath.compare(
        converted_amount,
        Number(bigMath.toStrStrict(bigMath._bn(maxWithdrawalPerTime))) as number
      )
    )
    console.groupEnd()

    // compare(n: number | string | BigNumber , base : number)
    // returns:
    // 1:       If the value of this BigNumber is greater than the value of n
    // -1:      If the value of this BigNumber is less than the value of n
    // 0:       If this BigNumber and n have the same value
    // null:    If the value of either this BigNumber or n is NaN

    if (
      bigMath.compare(converted_amount, maxWithdrawalPerTime as number) === 1
    ) {
      return `The value should be lower than ${maxWithdrawalPerTime}`
    }
    return null
  }
}
