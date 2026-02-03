export class AdaptiveNumberFormatter {
  constructor(
    /** Initial fraction digits to try */
    readonly fraction_digits: number = 2,
    /** Maximum fraction digits allowed */
    readonly max_fraction_digits: number = 5,
    /** Return null if value resolves to zero */
    readonly null_on_zero: boolean = false,
  ) {}

  /**
   * Public entry point.
   * Returns a formatted string or null.
   */
  format(value: number | string): string | null {
    const rounded = this.findNonZeroRoundedValue(Number(value))

    if (this.null_on_zero && this.isZero(rounded)) {
      return null
    }

    return this.trimTrailingZeros(rounded)
  }
  /**
   * Increases fraction digits until rounding no longer results in zero,
   * or until maxFractionDigits is reached.
   */
  private findNonZeroRoundedValue(value: number): string {
    let digits = this.fraction_digits
    let rounded = '0'

    while (digits <= this.max_fraction_digits) {
      rounded = this.round(value, digits)

      if (!this.isZero(rounded)) {
        break
      }

      digits++
    }

    return rounded
  }
  /** Rounds a number using fixed fraction digits */
  private round(value: number, digits: number): string {
    return Number(value).toFixed(digits)
  }
  /**  Checks whether a formatted numeric string equals zero */
  private isZero(value: string): boolean {
    return Number(value) === 0
  }
  /** Removes trailing zeros and dangling decimal point */
  private trimTrailingZeros(value: string): string {
    return value.replace(/\.?0+$/, '')
  }
}
