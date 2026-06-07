import { useTranslation } from 'react-i18next'

interface Step {
  key: string
  labelKey: string
}

const steps: Step[] = [
  { key: 'vision', labelKey: 'scan.visionStep' },
  { key: 'research', labelKey: 'scan.researchStep' },
  { key: 'discogs', labelKey: 'scan.discogsStep' },
]

interface ProgressIndicatorProps {
  currentStep: string
  error?: string
}

export function ProgressIndicator({ currentStep, error }: ProgressIndicatorProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      {steps.map((step, i) => {
        const isActive = step.key === currentStep
        const isDone = steps.findIndex((s) => s.key === currentStep) > i
        const isError = error !== undefined

        let statusIcon: string
        if (isError && isActive) {
          statusIcon = '✕'
        } else if (isDone) {
          statusIcon = '✓'
        } else if (isActive) {
          statusIcon = '●'
        } else {
          statusIcon = '○'
        }

        return (
          <div key={step.key} className="flex items-center gap-3">
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold
                ${isDone ? 'bg-green-500 text-white' : ''}
                ${isActive && !isError ? 'bg-blue-500 text-white' : ''}
                ${isActive && isError ? 'bg-red-500 text-white' : ''}
                ${!isActive && !isDone ? 'bg-gray-200 text-gray-400' : ''}`}
            >
              {statusIcon}
            </span>
            <span
              className={`text-sm ${isActive ? 'font-semibold text-gray-900' : 'text-gray-500'}`}
            >
              {t(step.labelKey)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
