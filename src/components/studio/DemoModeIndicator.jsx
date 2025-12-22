import { Crown, AlertCircle } from 'lucide-react'

export function DemoModeIndicator({
  plantsPlaced,
  maxPlants,
  onUpgrade
}) {
  const remaining = maxPlants - plantsPlaced
  const isAtLimit = remaining <= 0
  const isNearLimit = remaining <= 2 && remaining > 0

  return (
    <div className={`
      flex items-center justify-between px-4 py-2 text-sm
      ${isAtLimit
        ? 'bg-red-500 text-white'
        : isNearLimit
          ? 'bg-amber-500 text-white'
          : 'bg-olive-500 text-white'}
    `}>
      <div className="flex items-center gap-2">
        {isAtLimit ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <span className="text-base">🌱</span>
        )}
        <span>
          {isAtLimit ? (
            <>Demo limit reached - <strong>{maxPlants} plants max</strong></>
          ) : (
            <>Demo Mode: <strong>{remaining}</strong> plant{remaining !== 1 ? 's' : ''} remaining</>
          )}
        </span>
        <span className="opacity-75">|</span>
        <span className="opacity-90">No bundles, save, or export in demo</span>
      </div>

      <button
        onClick={onUpgrade}
        className={`
          flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium text-sm transition-all
          ${isAtLimit
            ? 'bg-white text-red-600 hover:bg-red-50'
            : 'bg-white/20 hover:bg-white/30 text-white'}
        `}
      >
        <Crown className="w-4 h-4" />
        Upgrade to Pro - $49/mo
      </button>
    </div>
  )
}

export default DemoModeIndicator
