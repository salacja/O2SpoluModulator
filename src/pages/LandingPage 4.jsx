import { useRef, useState, useEffect } from 'react'
import {
  BUNDLE_PRESETS,
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

const BENEFITS = [
  { icon: '💰', title: 'Sleva každý měsíc', desc: 'Čím víc služeb spojíte, tím větší úspora.' },
  { icon: '📄', title: 'Jedna smlouva', desc: 'Vše v jednom vyúčtování, méně starostí.' },
  { icon: '📱', title: 'Správa v aplikaci', desc: 'Sledujte služby a spotřebu kdykoli.' },
]

const FAQ_ITEMS = [
  { q: 'Co je O2 Spolu?', a: 'O2 Spolu je sleva za to, že máte u O2 více služeb najednou. Mobil, internet, TV – čím víc spojíte, tím větší úspora. Nemusíte nic žádat – sleva se započítá automaticky.' },
  { q: 'Jak se sleva aplikuje?', a: 'Automaticky. Jakmile máte 2 nebo více služeb, sleva O2 Spolu se započítá do měsíční ceny.' },
  { q: 'Můžu kdykoli odebrat nebo přidat službu?', a: 'Ano, O2 Spolu nemá závazek na dobu určitou. Služby můžete měnit podle potřeby.' },
]

export default function LandingPage({ order, setOrder, onOrder, scrollToBuilder, onClearScrollToBuilder }) {
  const heroRef = useRef(null)
  const howItWorksRef = useRef(null)
  const benefitsRef = useRef(null)
  const bundleCardsRef = useRef(null)
  const editBundleRef = useRef(null)
  const orderSummaryRef = useRef(null)
  const faqRef = useRef(null)

  useEffect(() => {
    if (scrollToBuilder) {
      (order?.mobileLines?.length || order?.internet || order?.tv)
        ? orderSummaryRef.current?.scrollIntoView({ behavior: 'smooth' })
        : bundleCardsRef.current?.scrollIntoView({ behavior: 'smooth' })
      onClearScrollToBuilder?.()
    }
  }, [scrollToBuilder, onClearScrollToBuilder, order])

  const [faqOpen, setFaqOpen] = useState(null)
  const [editCategory, setEditCategory] = useState(null)

  const o = order || { mobileLines: [], internet: null, tv: null, baseSavings: 0 }
  const { total, savings, subtotal } = calculateOrderTotal(o)

  const getTariff = (id) => MOBILE_TARIFFS.find((t) => t.id === id)
  const getTV = (id) => TV_PACKAGES.find((p) => p.id === id)
  const getInternet = (id) => INTERNET_OPTIONS.find((opt) => opt.id === id)

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' })

  const serviceCount = o.mobileLines.length + (o.internet ? 1 : 0) + (o.tv ? 1 : 0)
  const hasBundle = serviceCount >= 1

  const selectBundle = (preset) => {
    const newOrder = buildOrderFromBundle(preset)
    setOrder(newOrder)
    setEditCategory(null)
    setTimeout(() => orderSummaryRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const addMobileTariff = (tariffId, simType = 'sim') => {
    setOrder((prev) => ({
      ...prev,
      mobileLines: [...prev.mobileLines, { id: `m-${Date.now()}`, tariffId, simType }],
    }))
    setEditCategory(null)
  }

  const removeMobileLine = (lineId) => {
    setOrder((prev) => ({ ...prev, mobileLines: prev.mobileLines.filter((l) => l.id !== lineId) }))
  }

  const setInternet = (id) => {
    setOrder((prev) => ({ ...prev, internet: id ? { id } : null }))
    setEditCategory(null)
  }

  const setTV = (id) => {
    setOrder((prev) => ({ ...prev, tv: id ? { id } : null }))
    setEditCategory(null)
  }

  const changeMobileTariff = (lineId, tariffId) => {
    setOrder((prev) => ({
      ...prev,
      mobileLines: prev.mobileLines.map((l) => (l.id === lineId ? { ...l, tariffId } : l)),
    }))
    setEditCategory(null)
  }

  return (
    <div className="landing landing-responsive">
      <header className="landing-header">
        <div className="header-inner">
          <span className="logo">O<sub>2</sub></span>
          <nav>
            <button className="nav-link" onClick={() => scrollTo(howItWorksRef)}>Co je O2 Spolu</button>
            <button className="nav-link" onClick={() => scrollTo(bundleCardsRef)}>Balíčky</button>
            {hasBundle && (
              <button className="nav-link" onClick={() => scrollTo(orderSummaryRef)}>Váš balíček</button>
            )}
          </nav>
        </div>
      </header>

      <main className="landing-main">
        {/* SECTION 1 – Hero */}
        <section className="hero" ref={heroRef}>
          <div className="hero-inner">
            <div className="hero-content">
              <h1>Spojte služby a plaťte méně</h1>
              <p className="hero-sub">
                O2 Spolu je sleva, když máte u nás mobil, internet nebo TV pohromadě. Čím víc služeb spojíte, tím větší úspora. Jedna smlouva, méně starostí.
              </p>
              <button className="btn-primary btn-lg" onClick={() => scrollTo(bundleCardsRef)}>
                Sestavit balíček
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2 – Jak funguje O2 Spolu */}
        <section className="explainer how-it-works" ref={howItWorksRef}>
          <div className="section-inner">
            <h2>Jak funguje O2 Spolu</h2>
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
            <button className="btn-primary btn-cta-center" onClick={() => scrollTo(bundleCardsRef)}>
              Sestavit balíček
            </button>
          </div>
        </section>

        {/* SECTION 3 – Benefits */}
        <section className="benefits-section" ref={benefitsRef}>
          <div className="section-inner">
            <h2>Proč O2 Spolu</h2>
            <div className="benefits-grid">
              {BENEFITS.map((b) => (
                <div key={b.title} className="benefit-card">
                  <span className="benefit-icon">{b.icon}</span>
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 – Bundle cards */}
        <section className="bundle-cards-section" ref={bundleCardsRef}>
          <div className="section-inner">
            <h2>Vyberte balíček</h2>
            <div className="bundle-cards-grid">
              {BUNDLE_PRESETS.map((preset) => (
                <div key={preset.id} className="bundle-card">
                  <h3 className="bundle-card-title">{preset.name}</h3>
                  <ul className="bundle-card-services">
                    {preset.services.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                  <div className="bundle-card-price">{preset.price} Kč<span>/měs.</span></div>
                  {preset.savings > 0 && (
                    <div className="bundle-card-savings">Úspora −{preset.savings} Kč</div>
                  )}
                  <button className="btn-primary btn-small" onClick={() => selectBundle(preset)}>
                    Vybrat
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 – Edit bundle (zobrazí se když má uživatel balíček) */}
        {hasBundle && (
          <section className="edit-bundle-section" ref={editBundleRef}>
            <div className="section-inner">
              <h2>Upravit balíček</h2>
              <p className="edit-bundle-sub">Změňte tarif, přidejte SIM nebo TV. Cena se aktualizuje ihned.</p>

              {/* Mobilní tarify */}
              {(o.mobileLines.length > 0 || serviceCount > 0) && (
                <div className="edit-block">
                  <h3>Mobilní tarify</h3>
                  {o.mobileLines.map((line) => (
                    <div key={line.id} className="edit-line">
                      <span>{getTariff(line.tariffId)?.name}</span>
                      {editCategory === `tariff-${line.id}` ? (
                        <div className="edit-picker edit-picker-cards">
                          {MOBILE_TARIFFS.map((t) => (
                            <button
                              key={t.id}
                              className={`edit-tariff-card ${t.id === line.tariffId ? 'active' : ''}`}
                              onClick={() => changeMobileTariff(line.id, t.id)}
                            >
                              <span className="edit-tariff-name">{t.name}</span>
                              <span className="edit-tariff-data">{t.data}</span>
                              {t.features?.map((f, i) => (
                                <span key={i} className="edit-tariff-feature">{f}</span>
                              ))}
                              <span className="edit-tariff-price">{t.price} Kč/měs.</span>
                            </button>
                          ))}
                          <button className="link-btn" onClick={() => setEditCategory(null)}>Zrušit</button>
                        </div>
                      ) : (
                        <button className="link-btn" onClick={() => setEditCategory(`tariff-${line.id}`)}>Změnit tarif</button>
                      )}
                      <button className="remove-item-btn" onClick={() => removeMobileLine(line.id)} aria-label="Odebrat">×</button>
                    </div>
                  ))}
                  <button className="add-option-btn" onClick={() => setEditCategory(editCategory === 'add-mobile' ? null : 'add-mobile')}>
                    + Přidat SIM
                  </button>
                  {editCategory === 'add-mobile' && (
                    <div className="edit-picker edit-picker-cards">
                      {MOBILE_TARIFFS.map((t) => (
                        <button key={t.id} className="edit-tariff-card" onClick={() => addMobileTariff(t.id)}>
                          <span className="edit-tariff-name">{t.name}</span>
                          <span className="edit-tariff-data">{t.data}</span>
                          {t.features?.map((f, i) => (
                            <span key={i} className="edit-tariff-feature">{f}</span>
                          ))}
                          <span className="edit-tariff-price">{t.price} Kč/měs.</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Internet */}
              {(o.internet || serviceCount > 0) && (
                <div className="edit-block">
                  <h3>Internet</h3>
                  {o.internet ? (
                    <div className="edit-line">
                      <span>{getInternet(o.internet.id)?.name}</span>
                      {editCategory === 'internet' ? (
                        <div className="edit-picker edit-picker-cards">
                          {INTERNET_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              className={`edit-tariff-card ${opt.id === o.internet.id ? 'active' : ''}`}
                              onClick={() => setInternet(opt.id)}
                            >
                              <span className="edit-tariff-name">{opt.name}</span>
                              <span className="edit-tariff-feature">Rychlý internet domů</span>
                              <span className="edit-tariff-price">{opt.price} Kč/měs.</span>
                            </button>
                          ))}
                          <button className="edit-tariff-card edit-tariff-remove" onClick={() => setInternet(null)}>Odebrat internet</button>
                        </div>
                      ) : (
                        <button className="link-btn" onClick={() => setEditCategory('internet')}>Změnit</button>
                      )}
                      <button className="remove-item-btn" onClick={() => setInternet(null)} aria-label="Odebrat">×</button>
                    </div>
                  ) : (
                    <button className="add-option-btn" onClick={() => setEditCategory(editCategory === 'add-internet' ? null : 'add-internet')}>
                      + Přidat internet
                    </button>
                  )}
                  {editCategory === 'add-internet' && (
                    <div className="edit-picker edit-picker-cards">
                      {INTERNET_OPTIONS.map((opt) => (
                        <button key={opt.id} className="edit-tariff-card" onClick={() => setInternet(opt.id)}>
                          <span className="edit-tariff-name">{opt.name}</span>
                          <span className="edit-tariff-feature">Rychlý internet domů</span>
                          <span className="edit-tariff-price">{opt.price} Kč/měs.</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TV */}
              {(o.tv || serviceCount > 0) && (
                <div className="edit-block">
                  <h3>TV</h3>
                  {o.tv ? (
                    <div className="edit-line">
                      <span>{getTV(o.tv.id)?.name}</span>
                      {editCategory === 'tv' ? (
                        <div className="edit-picker edit-picker-cards">
                          {TV_PACKAGES.map((p) => (
                            <button
                              key={p.id}
                              className={`edit-tariff-card ${p.id === o.tv.id ? 'active' : ''}`}
                              onClick={() => setTV(p.id)}
                            >
                              <span className="edit-tariff-name">{p.name}</span>
                              <span className="edit-tariff-data">{p.channels} kanálů</span>
                              <span className="edit-tariff-price">{p.price > 0 ? `${p.price} Kč/měs.` : 'Zdarma'}</span>
                            </button>
                          ))}
                          <button className="edit-tariff-card edit-tariff-remove" onClick={() => setTV(null)}>Odebrat TV</button>
                        </div>
                      ) : (
                        <button className="link-btn" onClick={() => setEditCategory('tv')}>Změnit</button>
                      )}
                      <button className="remove-item-btn" onClick={() => setTV(null)} aria-label="Odebrat">×</button>
                    </div>
                  ) : (
                    <button className="add-option-btn" onClick={() => setEditCategory(editCategory === 'add-tv' ? null : 'add-tv')}>
                      + Přidat TV
                    </button>
                  )}
                  {editCategory === 'add-tv' && (
                    <div className="edit-picker edit-picker-cards">
                      {TV_PACKAGES.map((p) => (
                        <button key={p.id} className="edit-tariff-card" onClick={() => setTV(p.id)}>
                          <span className="edit-tariff-name">{p.name}</span>
                          <span className="edit-tariff-data">{p.channels} kanálů</span>
                          <span className="edit-tariff-price">{p.price > 0 ? `${p.price} Kč/měs.` : 'Zdarma'}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {savings > 0 && (
                <div className="edit-savings-preview">
                  Aktuální úspora: <strong>−{savings} Kč měsíčně</strong>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 6 – Order summary */}
        {hasBundle && (
          <section className="order-summary-section" ref={orderSummaryRef}>
            <div className="section-inner">
              <h2>Shrnutí objednávky</h2>
              <div className="order-summary-card">
                <ul className="bundle-services-list">
                  {o.mobileLines.map((l) => (
                    <li key={l.id}>
                      {getTariff(l.tariffId)?.name}
                      <button className="remove-item-btn" onClick={() => removeMobileLine(l.id)} aria-label="Odebrat">×</button>
                    </li>
                  ))}
                  {o.internet && (
                    <li>
                      {getInternet(o.internet.id)?.name}
                      <button className="remove-item-btn" onClick={() => setInternet(null)} aria-label="Odebrat">×</button>
                    </li>
                  )}
                  {o.tv && (
                    <li>
                      {getTV(o.tv.id)?.name}
                      <button className="remove-item-btn" onClick={() => setTV(null)} aria-label="Odebrat">×</button>
                    </li>
                  )}
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
                <button className="btn-primary btn-lg btn-full" onClick={onOrder}>
                  Objednat balíček
                </button>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 7 – FAQ */}
        <section className="faq-section" ref={faqRef}>
          <div className="section-inner">
            <h2>Časté otázky</h2>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className={`faq-item ${faqOpen === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
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
              {savings > 0 && <span className="sticky-savings">Úspora {savings} Kč</span>}
            </div>
            <button className="btn-primary" onClick={onOrder}>Objednat</button>
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
