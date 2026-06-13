import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav.home', icon: '🏠' },
  { to: '/library', labelKey: 'nav.library', icon: '📚' },
  { to: '/compare', labelKey: 'nav.compare', icon: '⚖️' },
  { to: '/settings', labelKey: 'nav.settings', icon: '⚙️' },
]

export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t('common.mainNavigation')}
      className="fixed bottom-0 left-0 right-0 bg-white border-t z-40"
    >
      <ul className="flex justify-around">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-4 py-2 text-xs min-w-[64px] min-h-[44px] justify-center transition-colors ${
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <span aria-hidden="true" className="text-lg">
                {item.icon}
              </span>
              <span>{t(item.labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
