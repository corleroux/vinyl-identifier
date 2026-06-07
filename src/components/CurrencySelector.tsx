import type { Currency } from '@/types'

const currencies: Currency[] = ['USD', 'EUR', 'GBP']

interface CurrencySelectorProps {
  value: Currency
  onChange: (currency: Currency) => void
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="flex gap-2">
      {currencies.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1 rounded-lg text-sm font-medium border transition-colors
            ${
              value === c
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
