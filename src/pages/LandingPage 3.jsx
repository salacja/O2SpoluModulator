import { useRef, useState, useEffect } from 'react'
import {
  MOBILE_TARIFFS,
  TV_PACKAGES,
  INTERNET_OPTIONS,
} from '../data/products'
import { calculateOrderTotal } from '../hooks/useOrderState'

const EXAMPLE_BUNDLE = {
  before: 1277,
  after: 848,
  savings: 429,
  services: ['Mobil 6 GB', 'Internet až 1 Gb/s', 'Oneplay k Internetu'],
}

const FAQ_ITEMS = [
  {
    q: 'Co je O2 Spolu?',
    a: 'Sleva za to, že máte u O2 více služeb najednou. Čím víc služeb spojíte (mobil, internet, TV), tím větší sleva. Nemusíte nic žádat – sleva se započítá automaticky.',
  },
  {
    q: 'Jak se sleva aplikuje?',
    a: 'Automaticky. Jakmile máte 2 nebo více služeb, sleva O2 Spolu se započítá do měsíční ceny.',
  },
  {
    q: 'Můžu kdykoli odebrat službu?',
    a: 'Ano, O2 Spolu nemá závazek na dobu určitou. Služby můžete měnit podle potřeby.',
  },
]

const DEFAULT_ORDER = {
  mobileLines: [],
  internet: null,
  tv: null,
  internetLines: [],
  tvLines: [],
  baseSavings: 0,
}

const SERVICE_CATEGORIES = [
  { id: 'mobile', label: 'Mobilní tarif', icon: '📱', desc: 'Data, volání, SMS' },
  { id: 'internet', label: 'Internet domů', icon: '🏠', desc: 'Rychlý internet' },
  { id: 'tv', label: 'Televizi', icon: '📺', desc: 'Oneplay balíčky' },
]

export default function LandingPage({ order, setOrder, onOrder, scrollToBuilder, onClearScrollToBuilder }) {
  const heroRef = useRef(null)
  const explainerRef = useRef(null)
  const chooseServiceRef = useRef(null)
  const productSelectionRef = useRef(null)
  const bundleSuggestionRef = useRef(null)
  const bundleOverviewRef = useRef(null)
  const faqRef = useRef(null)

  useEffect(() => {
    if (scrollToBuilder) {
      bundleOverviewRef.current?.scrollIntoView({ behavior: 'smooth' })
      onClearScrollToBuilder?.()
    }
  }, [scrollToBuilder, onClearScrollToBuilder])

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [addServiceCategory, setAddServiceCategory] = useState(null)
  const [faqOpen, setFaqOpen] = useState(null)

  const o = order || DEFAULT_ORDER
  const internetLines = o.internetLines || (o.internet ? [{ id: o.internet.id }] : [])
  const tvLines = o.tvLines || (o.tv ? [{ id: o.tv.id }] : [])
  const { total, savings, subtotal } = calculateOrderTotal(o)

  const getTariff = (id) => MOBILE_TARIFFS.find((t) => t.id === id)
  const getTV = (id) => TV_PACKAGES.find((p) => p.id === id)
  const getInternet = (id) => INTERNET_OPTIONS.find((opt) => opt.id === id)

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' })

  const serviceCount =
    o.mobileLines.length + internetLines.length + tvLines.length
  const hasBundle = serviceCount >= 1

  const addMobileTariff = (tariffId, closeInline = false) => {
    setOrder((prev) => ({
      ...prev,
      mobileLines: [
        ...prev.mobileLines,
        { id: `m-${Date.now()}`, tariffId, simType: 'sim' },
      ],
    }))
    if (closeInline) setAddServiceCategory(null)
  }

  const removeMobileLine = (lineId) => {
    setOrder((prev) => ({
      ...prev,
      mobileLines: prev.mobileLines.filter((l) => l.id !== lineId),
    }))
  }

  const addInternet = (productId, closeInline = false) => {
    setOrder((prev) => {
      const prevLines = prev.internetLines || (prev.internet ? [{ lineId: 'int-1', internetId: prev.internet.id }] : [])
      return {
        ...prev,
        internet: null,
        internetLines: [...prevLines, { lineId: `int-${Date.now()}`, internetId: productId }],
      }
    })
    if (closeInline) setAddServiceCategory(null)
  }

  const removeInternet = (lineId) => {
    setOrder((prev) => {
      const prevLines = prev.internetLines || (prev.internet ? [{ lineId: 'int-1', internetId: prev.internet.id }] : [])
      const next = prevLines.filter((l) => l.lineId !== lineId)
      return { ...prev, internet: null, internetLines: next }
    })
  }

  const addTV = (productId, closeInline = false) => {
    setOrder((prev) => {
      const prevLines = prev.tvLines || (prev.tv ? [{ lineId: 'tv-1', tvId: prev.tv.id }] : [])
      return {
        ...prev,
        tv: null,
        tvLines: [...prevLines, { lineId: `tv-${Date.now()}`, tvId: productId }],
      }
    })
    if (closeInline) setAddServiceCategory(null)
  }

  const removeTV = (lineId) => {
    setOrder((prev) => {
      const prevLines = prev.tvLines || (prev.tv ? [{ lineId: 'tv-1', tvId: prev.tv.id }] : [])
      const next = prevLines.filter((l) => l.lineId !== lineId)
      return { ...prev, tv: null, tvLines: next }
    })
  }

  return (
    <div className="landing landing-responsive">
      <header className="landing-header">
        <div className="header-inner">
          <span className="logo">O<sub>2</sub></span>
          <nav>
            <button className="nav-link" onClick={() => scrollTo(explainerRef)}>
              Co je O2 Spolu
            </button>
            <button className="nav-link" onClick={() => scrollTo(chooseServiceRef)}>
              Vybrat službu
            </button>
            {hasBundle && (
              <button className="nav-link" onClick={() => scrollTo(bundleOverviewRef)}>
                Váš balíček
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="landing-main">
        {/* SECTION 1 – Hero */}
        <section className="hero" ref={heroRef}>
          <div className="hero-inner">
            <div className="hero-content">
              <h1>Vyberte službu a ušetřete s O2 Spolu</h1>
              <p className="hero-sub">
                Potřebujete mobil, internet nebo TV? Začněte s tím, co potřebujete. Spojte více služeb a získáte slevu.
              </p>
              <button
                className="btn-primary btn-lg"
                onClick={() => scrollTo(chooseServiceRef)}
              >
                Vybrat službu
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2 – Co je O2 Spolu (důležité – uživatel musí pochopit) */}
        <section className="explainer" ref={explainerRef}>
          <div className="section-inner">
            <h2>Co je O2 Spolu?</h2>
            <div className="explainer-visual">
              <div className="explainer-formula">
                <span className="formula-item">Mobil</span>
                <span className="formula-plus">+</span>
                <span className="formula-item">Internet</span>
                <span className="formula-plus">+</span>
                <span className="formula-item">TV</span>
                <span className="formula-eq">=</span>
                <span className="formula-result">sleva</span>
              </div>
            </div>
            <div className="explainer-cols">
              <div className="explainer-col">
                <h3>Co to je</h3>
                <p>O2 Spolu je sleva za to, že máte u O2 více služeb najednou. Mobil, internet, TV – čím víc spojíte, tím větší úspora.</p>
              </div>
              <div className="explainer-col">
                <h3>Jak to funguje</h3>
                <p>Sleva se započítá automaticky. Nemusíte nic žádat. Stačí mít 2 nebo více služeb u O2.</p>
              </div>
              <div className="explainer-col">
                <h3>Co vám to dává</h3>
                <p>Méně starostí, jedno vyúčtování a úspora až stovky korun měsíčně.</p>
              </div>
            </div>
            <div className="explainer-example">
              <p className="explainer-example-label">Příklad: {EXAMPLE_BUNDLE.services.join(' + ')}</p>
              <div className="explainer-example-row">
                <span>Bez O2 Spolu</span>
                <span className="example-old">{EXAMPLE_BUNDLE.before} Kč</span>
              </div>
              <div className="explainer-example-row">
                <span>S O2 Spolu</span>
                <span className="example-new">{EXAMPLE_BUNDLE.after} Kč</span>
              </div>
              <div className="explainer-example-row highlight">
                <span>Úspora</span>
                <strong>−{EXAMPLE_BUNDLE.savings} Kč měsíčně</strong>
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={() => scrollTo(chooseServiceRef)}
            >
              Vybrat službu
            </button>
          </div>
        </section>

        {/* SECTION 3 – Choose service */}
        <section className="choose-service" ref={chooseServiceRef}>
          <div className="section-inner">
            <h2>Co potřebujete?</h2>
            <p className="choose-service-sub">Vyberte typ služby – můžete spojit více a ušetřit.</p>
            <div className="service-cards-grid">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`service-card-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                    if (selectedCategory !== cat.id) {
                      setTimeout(() => productSelectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
                    }
                  }}
                >
                  <span className="service-card-icon">{cat.icon}</span>
                  <span className="service-card-label">{cat.label}</span>
                  <span className="service-card-desc">{cat.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 – Product selection */}
        {selectedCategory && (
          <section className="product-selection" ref={productSelectionRef}>
            <div className="section-inner">
              <h2>
                {selectedCategory === 'mobile' && 'Mobilní tarify'}
                {selectedCategory === 'internet' && 'Internet domů'}
                {selectedCategory === 'tv' && 'Televizní balíčky'}
              </h2>
              <div className="product-cards-grid">
                {selectedCategory === 'mobile' &&
                  MOBILE_TARIFFS.map((t) => (
                    <div key={t.id} className="product-card">
                      <div className="product-card-header">
                        <span className="product-card-name">{t.name}</span>
                        <span className="product-card-data">{t.data}</span>
                      </div>
                      <div className="product-card-price">{t.price} Kč<span>/měs.</span></div>
                      <button
                        className="btn-primary btn-small"
                        onClick={() => addMobileTariff(t.id)}
                      >
                        Vybrat
                      </button>
                    </div>
                  ))}
                {selectedCategory === 'internet' &&
                  INTERNET_OPTIONS.map((opt) => (
                    <div key={opt.id} className="product-card">
                      <div className="product-card-header">
                        <span className="product-card-name">{opt.name}</span>
                      </div>
                      <div className="product-card-price">{opt.price} Kč<span>/měs.</span></div>
                      <button
                        className="btn-primary btn-small"
                        onClick={() => addInternet(opt.id)}
                      >
                        Vybrat
                      </button>
                    </div>
                  ))}
                {selectedCategory === 'tv' &&
                  TV_PACKAGES.map((p) => (
                    <div key={p.id} className="product-card">
                      <div className="product-card-header">
                        <span className="product-card-name">{p.name}</span>
                        <span className="product-card-data">{p.channels} kanálů</span>
                      </div>
                      <div className="product-card-price">
                        {p.price === 0 ? 'Zdarma' : `${p.price} Kč`}
                        {p.price > 0 && <span>/měs.</span>}
                      </div>
                      <button
                        className="btn-primary btn-small"
                        onClick={() => addTV(p.id)}
                      >
                        Vybrat
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5 – Bundle suggestion (když má aspoň 1 službu) */}
        {hasBundle && (
          <section className="bundle-suggestion" ref={bundleSuggestionRef}>
            <div className="section-inner">
              <h2>Ušetřete více s O2 Spolu</h2>
              <p className="bundle-suggestion-sub">
                Přidejte další službu a získejte slevu. Čím víc služeb, tím větší úspora.
              </p>
              <div className="bundle-add-options">
                <button
                  className={`add-option-btn ${addServiceCategory === 'internet' ? 'active' : ''}`}
                  onClick={() => setAddServiceCategory(addServiceCategory === 'internet' ? null : 'internet')}
                >
                  + přidat internet
                </button>
                <button
                  className={`add-option-btn ${addServiceCategory === 'tv' ? 'active' : ''}`}
                  onClick={() => setAddServiceCategory(addServiceCategory === 'tv' ? null : 'tv')}
                >
                  + přidat TV
                </button>
                <button
                  className={`add-option-btn ${addServiceCategory === 'mobile' ? 'active' : ''}`}
                  onClick={() => setAddServiceCategory(addServiceCategory === 'mobile' ? null : 'mobile')}
                >
                  + přidat další tarif
                </button>
              </div>
              {addServiceCategory && (
                <div className="bundle-inline-picker">
                  <h3>
                    {addServiceCategory === 'mobile' && 'Vyberte mobilní tarif'}
                    {addServiceCategory === 'internet' && 'Vyberte internet'}
                    {addServiceCategory === 'tv' && 'Vyberte televizi'}
                  </h3>
                  <div className="bundle-inline-cards">
                    {addServiceCategory === 'mobile' &&
                      MOBILE_TARIFFS.map((t) => (
                        <div key={t.id} className="product-card">
                          <div className="product-card-header">
                            <span className="product-card-name">{t.name}</span>
                            <span className="product-card-data">{t.data}</span>
                          </div>
                          <div className="product-card-price">{t.price} Kč<span>/měs.</span></div>
                          <button className="btn-primary btn-small" onClick={() => addMobileTariff(t.id, true)}>
                            Vybrat
                          </button>
                        </div>
                      ))}
                    {addServiceCategory === 'internet' &&
                      INTERNET_OPTIONS.map((opt) => (
                        <div key={opt.id} className="product-card">
                          <div className="product-card-header">
                            <span className="product-card-name">{opt.name}</span>
                          </div>
                          <div className="product-card-price">{opt.price} Kč<span>/měs.</span></div>
                          <button className="btn-primary btn-small" onClick={() => addInternet(opt.id)}>
                            Vybrat
                          </button>
                        </div>
                      ))}
                    {addServiceCategory === 'tv' &&
                      TV_PACKAGES.map((p) => (
                        <div key={p.id} className="product-card">
                          <div className="product-card-header">
                            <span className="product-card-name">{p.name}</span>
                            <span className="product-card-data">{p.channels} kanálů</span>
                          </div>
                          <div className="product-card-price">
                            {p.price === 0 ? 'Zdarma' : `${p.price} Kč`}
                            {p.price > 0 && <span>/měs.</span>}
                          </div>
                          <button className="btn-primary btn-small" onClick={() => addTV(p.id)}>
                            Vybrat
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {savings > 0 && (
                <div className="bundle-savings-preview">
                  <span className="savings-label">Předběžná úspora</span>
                  <span className="savings-value">−{savings} Kč měsíčně</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 6 – Bundle overview (zobrazí se až když má uživatel něco vybraného) */}
        {hasBundle && (
        <section className="bundle-overview" ref={bundleOverviewRef}>
          <div className="section-inner">
            <h2>Váš balíček</h2>
            <div className="bundle-summary-card">
                <ul className="bundle-services-list">
                  {o.mobileLines.map((l) => (
                    <li key={l.id}>
                      {getTariff(l.tariffId)?.name}
                      <button className="remove-item-btn" onClick={() => removeMobileLine(l.id)} aria-label="Odebrat">×</button>
                    </li>
                  ))}
                  {internetLines.map((l) => (
                    <li key={l.lineId || l.id}>
                      {getInternet(l.internetId ?? l.id)?.name}
                      <button className="remove-item-btn" onClick={() => removeInternet(l.lineId || l.id)} aria-label="Odebrat">×</button>
                    </li>
                  ))}
                  {tvLines.map((l) => (
                    <li key={l.lineId || l.id}>
                      {getTV(l.tvId ?? l.id)?.name}
                      <button className="remove-item-btn" onClick={() => removeTV(l.lineId || l.id)} aria-label="Odebrat">×</button>
                    </li>
                  ))}
                </ul>
                <div className="bundle-price-breakdown">
                  <div className="price-row">
                    <span>Mezisoučet</span>
                    <span>{subtotal} Kč</span>
                  </div>
                  {savings > 0 && (
                    <div className="price-row savings-row">
                      <span>Úspora O2 Spolu</span>
                      <span>−{savings} Kč</span>
                    </div>
                  )}
                  <div className="price-row total-row">
                    <span>Měsíční cena</span>
                    <strong>{total} Kč</strong>
                  </div>
                </div>
                <button
                  className="btn-primary btn-lg btn-full"
                  onClick={onOrder}
                >
                  Objednat
                </button>
              </div>
          </div>
        </section>
        )}

        {/* SECTION A – Quick purchase bundles */}
        <section className="quick-bundles-section">
          <div className="section-inner">
            <h2>Nejoblíbenější balíčky</h2>
            <div className="quick-bundles-grid">
              <article className="bundle-card">
                <div className="bundle-body">
                  <h3 className="bundle-name">Mobil + Internet</h3>
                  <p className="bundle-card-body">Nejoblíbenější kombinace pro domácnost.</p>
                  <div className="bundle-meta">
                    <span>Cena od — Kč</span>
                    <span className="bundle-savings">Ušetříte — Kč</span>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => scrollTo(chooseServiceRef)}
                  >
                    Vybrat balíček
                  </button>
                </div>
              </article>
              <article className="bundle-card">
                <div className="bundle-body">
                  <h3 className="bundle-name">Rodinný balíček</h3>
                  <p className="bundle-card-body">Více mobilů + internet pro celou rodinu.</p>
                  <div className="bundle-meta">
                    <span>Cena od — Kč</span>
                    <span className="bundle-savings">Ušetříte — Kč</span>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => scrollTo(chooseServiceRef)}
                  >
                    Vybrat balíček
                  </button>
                </div>
              </article>
              <article className="bundle-card">
                <div className="bundle-body">
                  <h3 className="bundle-name">Internet + TV</h3>
                  <p className="bundle-card-body">Zábava doma s internetem a televizí.</p>
                  <div className="bundle-meta">
                    <span>Cena od — Kč</span>
                    <span className="bundle-savings">Ušetříte — Kč</span>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => scrollTo(chooseServiceRef)}
                  >
                    Vybrat balíček
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION B – What you can add to O2 Spolu (service hub) */}
        <section className="service-hub-section">
          <div className="section-inner">
            <h2>Co všechno můžete přidat do O2 Spolu</h2>
            <p className="service-hub-sub">Vyberte službu a přidejte ji do balíčku se slevou.</p>
            <div className="service-hub-grid">
              {/* TODO: use existing route/url for NEO+ tariffs when present */}
              <a href="#" className="service-hub-card">
                <h3 className="service-hub-card-title">Neomezené mobilní tarify NEO+</h3>
                <p className="service-hub-card-body">Vyberte tarif a přidejte ho do O2 Spolu pro vyšší slevu.</p>
                <span className="service-hub-cta">Zobrazit tarify</span>
              </a>
              {/* TODO: use existing route/url for Oneplay when present */}
              <a href="#" className="service-hub-card">
                <h3 className="service-hub-card-title">Oneplay (TV)</h3>
                <p className="service-hub-card-body">Televize a zábava, kterou můžete spojit s internetem a mobilem.</p>
                <span className="service-hub-cta">Zobrazit Oneplay</span>
              </a>
              {/* TODO: use existing route/url for Pevný internet when present */}
              <a href="#" className="service-hub-card">
                <h3 className="service-hub-card-title">Pevný internet</h3>
                <p className="service-hub-card-body">Internet domů jako základ balíčku – přidejte ho a ušetřete.</p>
                <span className="service-hub-cta">Zobrazit internet</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 7 – FAQ */}
        <section className="faq-section" ref={faqRef}>
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
      {hasBundle && (
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
            >
              Objednat
            </button>
          </div>
        </div>
      )}

      <footer className="landing-footer">
        <div className="section-inner">
          <span className="logo">O<sub>2</sub></span>
          <p>O2 Czech Republic a.s.</p>
        </div>
      </footer>
    </div>
  )
}
