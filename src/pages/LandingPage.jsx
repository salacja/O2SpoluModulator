import { useRef } from 'react'

const BUNDLES = [
  {
    id: 'popular',
    label: 'Nejoblíbenější',
    services: ['Mobil 6 GB', 'Internet až 1 Gb/s', 'Oneplay k Internetu'],
    price: 528,
    savings: 320,
    originalPrice: 848,
    unityPrice: 528,
  },
  {
    id: 'family',
    label: 'Rodinný',
    services: ['2× mobil neomezená data', 'Internet až 1 Gb/s', 'Oneplay Extra Sport'],
    price: 1826,
    savings: 450,
    originalPrice: 2276,
    unityPrice: 1826,
  },
  {
    id: 'internet-tv',
    label: 'Internet + TV',
    services: ['Mobil neomezená data', 'Oneplay Extra Zábava'],
    price: 848,
    savings: 280,
    originalPrice: 1128,
    unityPrice: 848,
  },
]

export default function LandingPage({ onSelectBundle }) {
  const bundlesRef = useRef(null)

  const scrollToBundles = () => {
    bundlesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="header-inner">
          <span className="logo">O<sub>2</sub></span>
          <nav>
            <button className="nav-link" onClick={scrollToBundles}>
              Balíčky
            </button>
            <a className="nav-link" href="#jak-funguje">Jak funguje</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <span className="hero-badge">O2 Spolu</span>
            <h1>
              Spojte služby a ušetřete
              <strong> až 450 Kč měsíčně</strong>
            </h1>
            <p className="hero-sub">
              Mobil + Internet + TV v jednom balíčku. Čím víc služeb, tím větší sleva.
            </p>
            <div className="hero-cta">
              <button className="btn-primary btn-lg" onClick={scrollToBundles}>
                Vybrat balíček
              </button>
            </div>
            <div className="hero-visual">
              <div className="visual-stack">
                <span className="stack-item">Mobil</span>
                <span className="stack-plus">+</span>
                <span className="stack-item">Internet</span>
                <span className="stack-plus">+</span>
                <span className="stack-item">TV</span>
                <span className="stack-arrow">→</span>
                <span className="stack-savings">Sleva</span>
              </div>
            </div>
          </div>
        </section>

        {/* Co je O2 Spolu - řeší nepochopení */}
        <section className="explainer" id="jak-funguje">
          <div className="section-inner">
            <h2>Co je O2 Spolu?</h2>
            <p className="explainer-lead">
              Jednoduchá sleva za to, že máte u nás víc služeb najednou.
            </p>
            <div className="explainer-cards">
              <div className="explainer-card">
                <span className="explainer-num">1</span>
                <h3>Zvolte si balíček</h3>
                <p>Mobil s internetem, TV nebo obojím. Doporučené balíčky už mají slevu započítanou.</p>
              </div>
              <div className="explainer-card">
                <span className="explainer-num">2</span>
                <h3>Sleva je automatická</h3>
                <p>Nemusíte nic žádat. Jakmile splníte podmínku (2+ služby), sleva se aplikuje sama.</p>
              </div>
              <div className="explainer-card">
                <span className="explainer-num">3</span>
                <h3>Spravujte v Moje O2</h3>
                <p>Vše na jednom místě – vyúčtování, dobíjení, změny tarifu.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bundles */}
        <section className="bundles" ref={bundlesRef}>
          <div className="section-inner">
            <h2>Nejoblíbenější balíčky</h2>
            <p className="bundles-sub">Vyberte si – ceny už obsahují slevu O2 Spolu</p>
            <div className="bundle-grid">
              {BUNDLES.map((bundle) => (
                <article
                  key={bundle.id}
                  className={`bundle-card ${bundle.label === 'Nejoblíbenější' ? 'bundle-card--featured' : ''}`}
                >
                  {bundle.label === 'Nejoblíbenější' && (
                    <span className="bundle-badge">Nejoblíbenější</span>
                  )}
                  <div className="bundle-body">
                    <h3 className="bundle-name">{bundle.label}</h3>
                    <ul className="bundle-services">
                      {bundle.services.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                    <div className="bundle-price-row">
                      <span className="bundle-price">{bundle.price} Kč</span>
                      <span className="bundle-period">/měsíc</span>
                    </div>
                    <div className="bundle-savings">
                      Ušetříte {bundle.savings} Kč
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => onSelectBundle(bundle)}
                    >
                      Vybrat balíček
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="trust">
          <div className="section-inner trust-inner">
            <span>✓ Bez závazků na dobu určitou</span>
            <span>✓ Slevové kupóny až 7 000 Kč</span>
            <span>✓ S Unity až 300 Kč měsíčně zpět</span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="section-inner">
          <span className="logo">O<sub>2</sub></span>
          <p>O2 Czech Republic a.s. | Informace o zpracování osobních údajů</p>
        </div>
      </footer>
    </div>
  )
}
