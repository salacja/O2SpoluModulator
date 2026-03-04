import { useState, useEffect } from 'react'
import {
  MOBILE_TARIFFS,
  SIM_TYPES,
  TV_PACKAGES,
  INTERNET_OPTIONS,
} from '../data/products'
import { buildOrderFromBundle, calculateOrderTotal } from '../hooks/useOrderState'

export default function CheckoutDrawer({
  isOpen,
  bundle,
  order: orderProp,
  step,
  onClose,
  onContinue,
  onBack,
  onOrderComplete,
  orderBasedBackCloses,
}) {
  const [order, setOrder] = useState(() =>
    orderProp ? orderProp : buildOrderFromBundle(bundle)
  )
  const [expanded, setExpanded] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (orderProp) {
        setOrder(orderProp)
      } else if (bundle) {
        setOrder(buildOrderFromBundle(bundle))
      }
      setOrderComplete(false)
    }
  }, [isOpen, bundle?.id, orderProp])

  if (!isOpen) return null

  const { total, savings, subtotal } = calculateOrderTotal(order)

  const getTariff = (id) => MOBILE_TARIFFS.find((t) => t.id === id)
  const getTV = (id) => TV_PACKAGES.find((p) => p.id === id)
  const getInternet = (id) => INTERNET_OPTIONS.find((o) => o.id === id)

  const updateMobileLine = (lineId, updates) => {
    setOrder((o) => ({
      ...o,
      mobileLines: o.mobileLines.map((l) =>
        l.id === lineId ? { ...l, ...updates } : l
      ),
    }))
  }

  const addMobileLine = (tariffId = 'neo-6gb', simType = 'sim') => {
    setOrder((o) => ({
      ...o,
      mobileLines: [
        ...o.mobileLines,
        { id: `m-${Date.now()}`, tariffId, simType },
      ],
    }))
    setExpanded(null)
  }

  const removeMobileLine = (lineId) => {
    setOrder((o) => ({
      ...o,
      mobileLines: o.mobileLines.filter((l) => l.id !== lineId),
    }))
    if (order.mobileLines.length <= 1) setExpanded(null)
  }

  const setInternet = (id) => {
    setOrder((o) => ({ ...o, internet: id ? { id } : null }))
    setExpanded(null)
  }

  const setTV = (id) => {
    setOrder((o) => ({ ...o, tv: id ? { id } : null }))
    setExpanded(null)
  }

  const handleOrderComplete = async () => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsSubmitting(false)
    setOrderComplete(true)
    onOrderComplete?.()
  }

  if (orderComplete) {
    return (
      <div className={`checkout-drawer is-open`}>
        <div className="drawer-overlay" onClick={onClose} />
        <aside className="drawer drawer-success">
          <div className="drawer-body">
            <div className="success-icon">✓</div>
            <h2>Objednávka odeslána</h2>
            <p>Děkujeme! Brzy vás budeme kontaktovat s dalšími informacemi.</p>
            <button className="btn-primary btn-lg" onClick={onClose}>
              Zavřít
            </button>
          </div>
        </aside>
      </div>
    )
  }

  return (
    <div className={`checkout-drawer ${isOpen ? 'is-open' : ''}`}>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-header">
          <button className="drawer-close" onClick={onClose} aria-label="Zavřít">
            ×
          </button>
          <h2>{step === 1 ? 'Váš balíček' : 'Shrnutí objednávky'}</h2>
        </div>

        <div className="drawer-body">
          {step === 1 && (
            <>
              {/* Mobilní tarify */}
              <div className="checkout-section">
                <h3>Mobilní tarify</h3>
                {order.mobileLines.map((line, idx) => {
                  const tariff = getTariff(line.tariffId)
                  const isEditing = expanded === `tariff-${line.id}`
                  return (
                    <div key={line.id} className="service-card">
                      <div className="service-card-header">
                        <span>
                          {idx + 1}. {tariff?.name ?? line.tariffId} ({line.simType === 'esim' ? 'eSIM' : 'SIM'})
                        </span>
                        <div className="service-card-actions">
                          <button
                            className="link-btn"
                            onClick={() =>
                              setExpanded(isEditing ? null : `tariff-${line.id}`)
                            }
                          >
                            {isEditing ? 'Zrušit' : 'Změnit tarif'}
                          </button>
                          {order.mobileLines.length > 1 && (
                            <button
                              className="link-btn link-btn-danger"
                              onClick={() => removeMobileLine(line.id)}
                            >
                              Odebrat
                            </button>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <div className="picker">
                          <p className="picker-label">Tarif:</p>
                          <div className="picker-options">
                            {MOBILE_TARIFFS.map((t) => (
                              <button
                                key={t.id}
                                className={`picker-option ${t.id === line.tariffId ? 'active' : ''}`}
                                onClick={() =>
                                  updateMobileLine(line.id, { tariffId: t.id })
                                }
                              >
                                <span>{t.name}</span>
                                <span>{t.price} Kč/měsíc</span>
                              </button>
                            ))}
                          </div>
                          <p className="picker-label">Typ:</p>
                          <div className="picker-options">
                            {SIM_TYPES.map((st) => (
                              <button
                                key={st.id}
                                className={`picker-option small ${st.id === line.simType ? 'active' : ''}`}
                                onClick={() =>
                                  updateMobileLine(line.id, { simType: st.id })
                                }
                              >
                                {st.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                <button
                  className="add-service-btn"
                  onClick={() =>
                    setExpanded(
                      expanded === 'add-sim' ? null : 'add-sim'
                    )
                  }
                >
                  + Přidat další SIM / eSIM
                </button>
                {expanded === 'add-sim' && (
                  <div className="picker">
                    <p className="picker-label">Vyberte tarif a typ:</p>
                    {MOBILE_TARIFFS.map((t) =>
                      SIM_TYPES.map((st) => (
                        <button
                          key={`${t.id}-${st.id}`}
                          className="picker-option"
                          onClick={() => addMobileLine(t.id, st.id)}
                        >
                          {t.name} ({st.name}) – {t.price} Kč
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Internet */}
              <div className="checkout-section">
                <h3>Internet</h3>
                {order.internet ? (
                  <div className="service-card">
                    <div className="service-card-header">
                      <span>{getInternet(order.internet.id)?.name ?? order.internet.id}</span>
                      <button
                        className="link-btn"
                        onClick={() =>
                          setExpanded(
                            expanded === 'internet' ? null : 'internet'
                          )
                        }
                      >
                        Změnit
                      </button>
                    </div>
                    {expanded === 'internet' && (
                      <div className="picker">
                        {INTERNET_OPTIONS.map((o) => (
                          <button
                            key={o.id}
                            className={`picker-option ${o.id === order.internet?.id ? 'active' : ''}`}
                            onClick={() => setInternet(o.id)}
                          >
                            {o.name} – {o.price} Kč
                          </button>
                        ))}
                        <button
                          className="picker-option remove"
                          onClick={() => setInternet(null)}
                        >
                          Odebrat internet
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="add-service-btn"
                    onClick={() =>
                      setExpanded(
                        expanded === 'internet' ? null : 'internet'
                      )
                    }
                  >
                    + Přidat internet
                  </button>
                )}
                {expanded === 'internet' && !order.internet && (
                  <div className="picker">
                    {INTERNET_OPTIONS.map((o) => (
                      <button
                        key={o.id}
                        className="picker-option"
                        onClick={() => setInternet(o.id)}
                      >
                        {o.name} – {o.price} Kč
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* TV */}
              <div className="checkout-section">
                <h3>Televize</h3>
                {order.tv ? (
                  <div className="service-card">
                    <div className="service-card-header">
                      <span>{getTV(order.tv.id)?.name ?? order.tv.id}</span>
                      <button
                        className="link-btn"
                        onClick={() =>
                          setExpanded(expanded === 'tv' ? null : 'tv')
                        }
                      >
                        Změnit
                      </button>
                    </div>
                    {expanded === 'tv' && (
                      <div className="picker">
                        {TV_PACKAGES.map((p) => (
                          <button
                            key={p.id}
                            className={`picker-option ${p.id === order.tv?.id ? 'active' : ''}`}
                            onClick={() => setTV(p.id)}
                          >
                            {p.name} – {p.price === 0 ? 'Zdarma' : `${p.price} Kč`}
                          </button>
                        ))}
                        <button
                          className="picker-option remove"
                          onClick={() => setTV(null)}
                        >
                          Odebrat TV
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="add-service-btn"
                    onClick={() =>
                      setExpanded(expanded === 'tv' ? null : 'tv')
                    }
                  >
                    + Přidat TV balíček
                  </button>
                )}
                {expanded === 'tv' && !order.tv && (
                  <div className="picker">
                    {TV_PACKAGES.map((p) => (
                      <button
                        key={p.id}
                        className="picker-option"
                        onClick={() => setTV(p.id)}
                      >
                        {p.name} – {p.price === 0 ? 'Zdarma' : `${p.price} Kč`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="checkout-summary">
                <div className="summary-row">
                  <span>Mezisoučet</span>
                  <span>{subtotal} Kč</span>
                </div>
                <div className="summary-row savings">
                  <span>Úspora O2 Spolu</span>
                  <span>−{savings} Kč</span>
                </div>
                <div className="summary-row total">
                  <span>Měsíční platba</span>
                  <strong>{total} Kč</strong>
                </div>
              </div>

              <button
                className="btn-primary btn-lg"
                onClick={onContinue}
              >
                Pokračovat k objednávce
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="final-summary">
                <div className="final-section">
                  <h3>Mobil</h3>
                  <p>
                    {order.mobileLines
                      .map(
                        (l) =>
                          `${getTariff(l.tariffId)?.name ?? l.tariffId} (${l.simType === 'esim' ? 'eSIM' : 'SIM'})`
                      )
                      .join(', ')}
                  </p>
                </div>
                {((order.internetLines && order.internetLines.length > 0) || order.internet) && (
                  <div className="final-section">
                    <h3>Internet</h3>
                    <p>
                      {(order.internetLines || (order.internet ? [order.internet] : []))
                        .map((item) => getInternet(item.internetId ?? item.id)?.name)
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                )}
                {((order.tvLines && order.tvLines.length > 0) || order.tv) && (
                  <div className="final-section">
                    <h3>TV</h3>
                    <p>
                      {(order.tvLines || (order.tv ? [order.tv] : []))
                        .map((item) => getTV(item.tvId ?? item.id)?.name)
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                )}
                <div className="final-section">
                  <h3>Úspora</h3>
                  <p className="savings-text">Ušetříte {savings} Kč měsíčně</p>
                </div>
                <div className="final-section price">
                  <h3>Měsíční cena</h3>
                  <p className="final-price">{total} Kč</p>
                </div>
              </div>
              <button className="btn-secondary" onClick={orderBasedBackCloses ? onClose : onBack}>
                ← Zpět k úpravám
              </button>
              <button
                className="btn-primary btn-lg"
                onClick={handleOrderComplete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Odesílám…' : 'Objednat balíček'}
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
