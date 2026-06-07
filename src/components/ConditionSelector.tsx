import { useTranslation } from 'react-i18next'
import type { VinylCondition } from '@/types'

const conditions: VinylCondition[] = [
  'mint',
  'near_mint',
  'vg_plus',
  'vg',
  'g_plus',
  'good',
  'fair',
  'poor',
]

interface ConditionSelectorProps {
  value: VinylCondition
  onChange: (condition: VinylCondition) => void
}

export function ConditionSelector({ value, onChange }: ConditionSelectorProps) {
  const { t } = useTranslation()

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('report.condition')}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as VinylCondition)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {conditions.map((c) => (
          <option key={c} value={c}>
            {t(`condition.${c}`)}
          </option>
        ))}
      </select>
    </div>
  )
}
