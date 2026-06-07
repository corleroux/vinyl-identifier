import { useTranslation } from 'react-i18next'
import type { RarityTier } from '@/types'

const tierColors: Record<RarityTier, string> = {
  common: 'bg-gray-100 text-gray-700 border-gray-300',
  uncommon: 'bg-green-100 text-green-700 border-green-300',
  rare: 'bg-blue-100 text-blue-700 border-blue-300',
  very_rare: 'bg-purple-100 text-purple-700 border-purple-300',
  legendary: 'bg-amber-100 text-amber-700 border-amber-300',
}

interface RarityBadgeProps {
  tier: RarityTier
}

export function RarityBadge({ tier }: RarityBadgeProps) {
  const { t } = useTranslation()

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${tierColors[tier]}`}
    >
      {t(`rarity.${tier}`)}
    </span>
  )
}
