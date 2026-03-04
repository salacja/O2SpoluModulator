import { useRef, useState, useEffect } from 'react'
import {
  MOBILE_TARIFFS,
  TV_PACKAGES,
  INTERNET_OPTIONS,
} from '../data/products'
import { buildOrderFromBundle, calculateOrderTotal } from '../hooks/useOrderState'

const EXAMPLE_BUNDLE = {
  before: 1277,
  after: 848,
  savings: 429,
  services: ['Mobil 6 GB', 'Internet až 1 Gb/s', 'Oneplay k Internetu'],
}

const FAQ_ITEMS = [
  {
    q: 'Co je O2 Spolu?',
    a: 'Sleva za to, že máte u O2 více služeb najednou. Čím víc služeb spojíte (mobil, internet, TV), tím větší sleva.',
  },
  {
    q: 'Jak se sleva aplikuje?',
    a: 'Automaticky. Jakmile máte 2 nebo více služeb, sleva se započítá do ceny.',
  },
  {
    q: 'Můžu kdykoli odebrat službu?',
    a: 'Ano, O2 Spolu nemá závazek na dobu určitou. Služby můžete měnit.',
  },
]

const DEFAULT_ORDER = {
  mobileLines: [{ id: 'm-1', tariffId: 'neo-6gb', simType: 'sim' }],
  internet: null,
  tv: null,
  baseSavings: 0,
}

export default function LandingPage({ order, setOrder, onOrder, scrollToBuilder, onClearScrollToBuilder }) {
  const explainerRef = useRef(null)
  const builderRef = useRef(null)

  useEffect(() => {
    if (scrollToBuilder) {
      builderRef.current?.scrollIntoView({ behavior: 'smooth' })
      onClearScrollToBuilder?.()
    }
  }, [scrollToBuilder, onClearScrollToBuilder])
  const [expanded, setExpanded] = useState(null)
  const [faqOpen, setFaqOpen] = useState(null)

  const o = order || DEFAULT_ORDER
  const { total, savings, subtotal } = calculateOrderTotal(o)

  const getTariff = (id) => MOBILE_TARIFFS.find((t) => t.id === id)
  const getTV = (id) => TV_PACKAGES.find((p) => p.id === id)
  const getInternet = (id) => INTERNET_OPTIONS.find((o) => o.id === id)

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' })

  const updateMobileLine = (lineId, updates) => {
    setOrder((prev) => ({
      ...prev,
      mobileLines: prev.mobileLines.map((l) =>
        l.id === lineId ? { ...l, ...updates } : l
      ),
    }))
  }

  const addMobileLine = (tariffId = 'neo-6gb', simType = 'sim') => {
    setOrder((prev) => ({
      ...prev,
      mobileLines: [
        ...prev.mobileLines,
        { id: `m-${Date.now()}`, tariffId, simType },
      ],
    }))
    setExpanded(null)
  }

  const removeMobileLine = (lineId) => {
    setOrder((prev) => ({
      ...prev,
      mobileLines: prev.mobileLines.filter((l) => l.id !== lineId),
    }))
    if (o.mobileLines.length <= 1) setExpanded(null)
  }

  const setInternet = (id) => {
    setOrder((prev) => ({ ...prev, internet: id ? { id } : null }))
    setExpanded(null)
  }

  const setTV = (id) => {
    setOrder((prev) => ({ ...prev, tv: id ? { id } : null }))
    setExpanded(null)
  }

  const serviceCount =
    o.mobileLines.length + (o.internet ? 1 : 0) + (o.tv ? 1 : 0)
  const hasBundle = serviceCount >= 1

  return (
    <div className="landing landing-responsive">
      <header className="landing-header">
        <div className="header-inner">
          <span className="logo">O<sub>2</sub></span>
          <nav>
            <button className="nav-link" onClick={() => scrollTo(explainerRef)}>
              Co je O2 Spolu
            </button>
            <button className="nav-link" onClick={() => scrollTo(builderRef)}>
              Váš balíček
            </button>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        {/* SECTION 1 – Hero: mobile stacked, desktop text left + illustration right */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-content">
              <h1>Spojte služby a získejte slevu</h1>
              <p className="hero-sub">
                Čím více služeb spojíte, tím větší sleva.
              </p>
              <button
                className="btn-primary btn-lg"
                onClick={() => scrollTo(explainerRef)}
              >
                Vytvořit balíček
              </button>
            </div>
            <div className="hero-illustration">
              <div className="explainer-formula hero-formula">
                <span className="formula-item">Mobil</span>
                <span className="formula-plus">+</span>
                <span className="formula-item">Internet</span>
                <span className="formula-plus">+</span>
                <span className="formula-item">TV</span>
                <span className="formula-eq">=</span>
                <span className="formula-result">sleva</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 – Co je O2 Spolu: mobile stacked, desktop 3-column */}
        <section className="explainer" ref={explainerRef}>
          <div className="section-inner">
            <h2>Co je O2 Spolu?</h2>
            <div className="explainer-formula explainer-formula-mobile">
              <span className="formula-item">Mobil</span>
              <span className="formula-plus">+</span>
              <span className="formula-item">Internet</span>
              <span className="formula-plus">+</span>
              <span className="formula-item">TV</span>
              <span className="formula-eq">=</span>
              <span className="formula-result">sleva</span>
            </div>
            <div className="explainer-cols">
              <div className="explainer-col">
                <h3>Co to je</h3>
                <p>Sleva za to, že máte u O2 více služeb najednou. Mobil, internet, TV – čím víc spojíte, tím větší úspora.</p>
              </div>
              <div className="explainer-col">
                <h3>Jak to funguje</h3>
                <p>Sleva se započítá automaticky. Nemusíte nic žádat. Stačí mít 2 nebo více služeb.</p>
              </div>
              <div className="explainer-col">
                <h3>Co vám to dává</h3>
                <p>Méně starostí, jedno vyúčtování a úspora až stovky korun měsíčně.</p>
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={() => scrollTo(builderRef)}
            >
              Sestavit balíček
            </button>
          </div>
        </section>

        {/* SECTION 3 – Příklad úspor */}
        <section className="example-savings">
          <div className="section-inner">
            <h2>Příklad úspor</h2>
            <div className="example-box">
              <p className="example-label">Balíček: {EXAMPLE_BUNDLE.services.join(' + ')}</p>
              <div className="example-row">
                <span>Původní cena</span>
                <span className="example-old">{EXAMPLE_BUNDLE.before} Kč</span>
              </div>
              <div className="example-row">
                <span>S O2 Spolu</span>
                <span className="example-new">{EXAMPLE_BUNDLE.after} Kč</span>
              </div>
              <div className="example-row example-savings-row">
                <span>Úspora</span>
                <strong>−{EXAMPLE_BUNDLE.savings} Kč měsíčně</strong>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 & 5 – Bundle builder: mobile stacked, desktop builder left + summary right */}
        <section className="bundle-builder" ref={builderRef}>
          <div className="section-inner builder-layout">
            <div className="builder-main">
              <h2>Váš balíček</h2>

              {/* Mobilní tarif – výchozí */}
              <div className="builder-section">
              <h3>Mobilní tarif</h3>
              {o.mobileLines.map((line, idx) => {
                const tariff = getTariff(line.tariffId)
                const isEditing = expanded === `tariff-${line.id}`
                return (
                  <div key={line.id} className="service-card">
                    <div className="service-card-header">
                      <span>{tariff?.name ?? line.tariffId}</span>
                      <div className="service-card-actions">
                        <button
                          className="link-btn"
                          onClick={() =>
                            setExpanded(isEditing ? null : `tariff-${line.id}`)
                          }
                        >
                          {isEditing ? 'Zrušit' : 'Změnit'}
                        </button>
                        {o.mobileLines.length > 1 && (
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
                        {MOBILE_TARIFFS.map((t) => (
                          <button
                            key={t.id}
                            className={`picker-option ${t.id === line.tariffId ? 'active' : ''}`}
                            onClick={() =>
                              updateMobileLine(line.id, { tariffId: t.id })
                            }
                          >
                            {t.name} – {t.price} Kč
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              <button
                className="add-service-btn"
                onClick={() =>
                  setExpanded(expanded === 'add-tariff' ? null : 'add-tariff')
                }
              >
                + Přidat další tarif
              </button>
              {expanded === 'add-tariff' && (
                <div className="picker">
                  {MOBILE_TARIFFS.map((t) => (
                    <button
                      key={t.id}
                      className="picker-option"
                      onClick={() => addMobileLine(t.id, 'sim')}
                    >
                      {t.name} – {t.price} Kč
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Internet */}
            <div className="builder-section">
              <h3>Internet</h3>
              {o.internet ? (
                <div className="service-card">
                  <div className="service-card-header">
                    <span>{getInternet(o.internet.id)?.name}</span>
                    <button
                      className="link-btn"
                      onClick={() =>
                        setExpanded(expanded === 'internet' ? null : 'internet')
                      }
                    >
                      Změnit
                    </button>
                  </div>
                  {expanded === 'internet' && (
                    <div className="picker">
                      {INTERNET_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          className={`picker-option ${opt.id === o.internet?.id ? 'active' : ''}`}
                          onClick={() => setInternet(opt.id)}
                        >
                          {opt.name} – {opt.price} Kč
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
                <>
                  <button
                    className="add-service-btn"
                    onClick={() =>
                      setExpanded(expanded === 'internet' ? null : 'internet')
                    }
                  >
                    + Přidat internet
                  </button>
                  {expanded === 'internet' && (
                    <div className="picker">
                      {INTERNET_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          className="picker-option"
                          onClick={() => setInternet(opt.id)}
                        >
                          {opt.name} – {opt.price} Kč
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* TV */}
            <div className="builder-section">
              <h3>TV</h3>
              {o.tv ? (
                <div className="service-card">
                  <div className="service-card-header">
                    <span>{getTV(o.tv.id)?.name}</span>
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
                          className={`picker-option ${p.id === o.tv?.id ? 'active' : ''}`}
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
                <>
                  <button
                    className="add-service-btn"
                    onClick={() =>
                      setExpanded(expanded === 'tv' ? null : 'tv')
                    }
                  >
                    + Přidat TV
                  </button>
                  {expanded === 'tv' && (
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
                </>
              )}
            </div>

            {/* Updated bundle summary (Section 5) – po přidání služeb, mobile only */}
            {serviceCount >= 2 && (
              <div className="updated-bundle updated-bundle-mobile">
                <h3>Váš balíček s úsporou</h3>
                <ul>
                  {o.mobileLines.map((l) => (
                    <li key={l.id}>{getTariff(l.tariffId)?.name}</li>
                  ))}
                  {o.internet && (
                    <li>{getInternet(o.internet.id)?.name}</li>
                  )}
                  {o.tv && <li>{getTV(o.tv.id)?.name}</li>}
                </ul>
                <div className="updated-price">
                  <span>Měsíční cena: {total} Kč</span>
                  <span className="savings-badge">Úspora {savings} Kč</span>
                </div>
              </div>
            )}
            </div>

            {/* Desktop: summary panel sticky right */}
            <aside className="builder-sidebar">
              <div className="builder-summary-panel">
                <h3>Shrnutí balíčku</h3>
                <ul className="summary-services">
                  {o.mobileLines.map((l) => (
                    <li key={l.id}>{getTariff(l.tariffId)?.name}</li>
                  ))}
                  {o.internet && (
                    <li>{getInternet(o.internet.id)?.name}</li>
                  )}
                  {o.tv && <li>{getTV(o.tv.id)?.name}</li>}
                </ul>
                <div className="summary-row">
                  <span>Mezisoučet</span>
                  <span>{subtotal} Kč</span>
                </div>
                {savings > 0 && (
                  <div className="summary-row savings">
                    <span>Úspora O2 Spolu</span>
                    <span>−{savings} Kč</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Měsíčně</span>
                  <strong>{total} Kč</strong>
                </div>
                <button
                  className="btn-primary btn-lg btn-full"
                  onClick={onOrder}
                  disabled={!hasBundle}
                >
                  Objednat balíček
                </button>
              </div>
            </aside>
          </div>
        </section>

        {/* SECTION 6 – FAQ */}
        <section className="faq-section">
          <div className="section-inner">
            <h2>Časté otázky</h2>
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`faq-item ${faqOpen === i ? 'open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  {item.q}
                </button>
                {faqOpen === i && <p className="faq-answer">{item.a}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky price bar (mobile) */}
      <div className="sticky-price-bar">
        <div className="sticky-inner">
          <div className="sticky-price-info">
            <span className="sticky-label">Měsíční platba</span>
            <span className="sticky-price">{total} Kč</span>
            {savings > 0 && (
              <span className="sticky-savings">Úspora {savings} Kč</span>
            )}
          </div>
          <button
            className="btn-primary"
            onClick={onOrder}
            disabled={!hasBundle}
          >
            Objednat balíček
          </button>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="section-inner">
          <span className="logo">O<sub>2</sub></span>
          <p>O2 Czech Republic a.s.</p>
        </div>
      </footer>
    </div>
  )
}
