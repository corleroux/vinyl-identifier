import { useTranslation } from 'react-i18next'
import type { ConditionGrade } from '@/types'

interface ConditionGradeDisplayProps {
  grade: ConditionGrade
}

export function ConditionGradeDisplay({ grade }: ConditionGradeDisplayProps) {
  const { t } = useTranslation()

  const gradeColor =
    {
      mint: 'bg-green-100 text-green-800 border-green-200',
      near_mint: 'bg-green-50 text-green-700 border-green-200',
      vg_plus: 'bg-blue-50 text-blue-700 border-blue-200',
      vg: 'bg-blue-50 text-blue-700 border-blue-200',
      g_plus: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      good: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      fair: 'bg-orange-50 text-orange-700 border-orange-200',
      poor: 'bg-red-50 text-red-700 border-red-200',
    }[grade.overallGrade] || 'bg-gray-50 text-gray-700 border-gray-200'

  const confidenceColor =
    grade.confidence >= 0.8
      ? 'text-green-600'
      : grade.confidence >= 0.6
        ? 'text-yellow-600'
        : 'text-red-600'

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t('condition.grading.title')}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${gradeColor}`}>
          {t(`condition.grading.grade.${grade.overallGrade}`)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{t('condition.grading.confidence')}</span>
          <span className={`text-sm font-medium ${confidenceColor}`}>
            {Math.round(grade.confidence * 100)}%
          </span>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {t('condition.grading.surfaceNoise')}
          </h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  grade.surfaceNoise === 'none'
                    ? 'bg-green-500 w-0'
                    : grade.surfaceNoise === 'light'
                      ? 'bg-green-500 w-1/4'
                      : grade.surfaceNoise === 'moderate'
                        ? 'bg-yellow-500 w-2/4'
                        : 'bg-red-500 w-full'
                }`}
              />
            </div>
            <span className="text-sm text-gray-600 w-20 text-right">
              {t(`condition.grading.noise.${grade.surfaceNoise}`)}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {t('condition.grading.scratches')}
          </h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {grade.scratches.count}{' '}
              {grade.scratches.count === 1
                ? t('condition.grading.scratch')
                : t('condition.grading.scratchesCount')}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                grade.scratches.severity === 'minor'
                  ? 'bg-green-100 text-green-700'
                  : grade.scratches.severity === 'moderate'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {t(`condition.grading.severity.${grade.scratches.severity}`)}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">{t('condition.grading.warps')}</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {grade.warps.present
                ? t('condition.grading.warpDetected')
                : t('condition.grading.noWarps')}
            </span>
            {grade.warps.present && (
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  grade.warps.severity === 'mild'
                    ? 'bg-yellow-100 text-yellow-700'
                    : grade.warps.severity === 'moderate'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                {t(`condition.grading.warpSeverity.${grade.warps.severity}`)}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              {t('condition.grading.edgeWear')}
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    grade.wear.edge < 30
                      ? 'bg-green-500'
                      : grade.wear.edge < 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${grade.wear.edge}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-8 text-right">{grade.wear.edge}%</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              {t('condition.grading.surfaceWear')}
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    grade.wear.surface < 30
                      ? 'bg-green-500'
                      : grade.wear.surface < 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${grade.wear.surface}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-8 text-right">{grade.wear.surface}%</span>
            </div>
          </div>
        </div>

        {grade.defects.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {t('condition.grading.defects')}
            </h4>
            <ul className="space-y-1">
              {grade.defects.map((defect, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{defect}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {grade.recommendation && (
          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              {t('condition.grading.recommendation')}
            </h4>
            <p className="text-sm text-gray-600">{grade.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
