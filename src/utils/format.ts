const formatters = new Map<string, Intl.NumberFormat>()

export function formatCurrency(val: number, currency: string): string {
  const key = `en-US:${currency}`
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    )
  }
  return formatters.get(key)!.format(val)
}
