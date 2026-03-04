import { MOBILE_TARIFFS, TV_PACKAGES, INTERNET_OPTIONS } from '../data/products'

/** Sestaví order z bundle presetu (např. BUNDLE_PRESETS nebo Flow 1 balíčky) */
export function buildOrderFromBundle(bundle) {
  if (!bundle) {
    return { mobileLines: [], internet: null, tv: null, baseSavings: 0 }
  }

  // Presety mají přímo order strukturu (Flow 4)
  if (bundle.order) {
    const o = bundle.order
    return {
      mobileLines: (o.mobileLines || []).map((l, i) => ({
        id: `m-${Date.now()}-${i}`,
        tariffId: l.tariffId || 'neo-6gb',
        simType: l.simType || 'sim',
      })),
      internet: o.internet || null,
      tv: o.tv || null,
      baseSavings: 0,
    }
  }

  // Fallback pro staré bundle objekty (Flow 1, Flow 2)
  const services = bundle.services || []
  const hasInternet = services.some((s) => /internet|gb\/s|1\s*gb/i.test(s))
  const hasTV = services.some((s) => /oneplay|tv/i.test(s))

  const mobileLines = []
  const isUnlimited = /neomezen|unlimited/i.test(services.join(' '))
  const count = /2×|3×|2\s*x|x\s*2/.test(services.join('')) ? 2 : 1

  for (let i = 0; i < count; i++) {
    mobileLines.push({
      id: `m-${Date.now()}-${i}`,
      tariffId: isUnlimited ? 'neo-unlimited' : 'neo-6gb',
      simType: 'sim',
    })
  }

  let internet = null
  if (hasInternet) internet = { id: '1gbit' }

  let tv = null
  if (hasTV) {
    if (/sport/i.test(services.join(''))) tv = { id: 'oneplay-extra-sport' }
    else if (/zábava|zabava/i.test(services.join(''))) tv = { id: 'oneplay-extra-zabava' }
    else tv = { id: 'oneplay-k-internetu' }
  }

  return {
    mobileLines,
    internet,
    tv,
    baseSavings: bundle.savings ?? 0,
  }
}

export function calculateOrderTotal(order) {
  let subtotal = 0

  order.mobileLines.forEach((line) => {
    const t = MOBILE_TARIFFS.find((x) => x.id === line.tariffId)
    if (t) subtotal += t.price
  })

  const internetItems = order.internetLines || (order.internet ? [order.internet] : [])
  const tvItems = order.tvLines || (order.tv ? [order.tv] : [])

  internetItems.forEach((item) => {
    const productId = item.internetId ?? item.id
    const o = INTERNET_OPTIONS.find((x) => x.id === productId)
    if (o) subtotal += o.price
  })

  tvItems.forEach((item) => {
    const productId = item.tvId ?? item.id
    const p = TV_PACKAGES.find((x) => x.id === productId)
    if (p) subtotal += p.price
  })

  const serviceCount = order.mobileLines.length + internetItems.length + tvItems.length
  const calculatedSavings = serviceCount >= 2 ? Math.min(450, Math.round(subtotal * 0.18)) : 0
  const savings = order.baseSavings > 0 ? order.baseSavings : calculatedSavings
  const total = Math.max(0, subtotal - savings)

  return { subtotal, savings: order.baseSavings || savings, total }
}
