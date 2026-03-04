import { useState, useEffect } from 'react'
import LandingPage from '../pages/LandingPage'
import LandingPage2 from '../pages/LandingPage 2'
import LandingPage3 from '../pages/LandingPage 3'
import LandingPage4 from '../pages/LandingPage 4'

const FLOWS = [
  { id: 'flow1', label: 'Flow 1', Component: LandingPage },
  { id: 'flow2', label: 'Flow 2', Component: LandingPage2 },
  { id: 'flow3', label: 'Flow 3', Component: LandingPage3 },
  { id: 'flow4', label: 'Flow 4', Component: LandingPage4 },
]

const DEFAULT_ORDER = {
  mobileLines: [],
  internet: null,
  tv: null,
  internetLines: [],
  tvLines: [],
  baseSavings: 0,
}

export default function LandingFlowWrapper({
  onSelectBundle,
  onOrder,
}) {
  const [activeFlow, setActiveFlow] = useState('flow1')
  const [order, setOrder] = useState(DEFAULT_ORDER)
  const [scrollToBuilder, setScrollToBuilder] = useState(false)

  useEffect(() => {
    setOrder(DEFAULT_ORDER)
    window.scrollTo(0, 0)
  }, [activeFlow])

  const handleSelectBundle = (bundle) => {
    onSelectBundle(bundle)
  }

  const handleOrder = () => {
    onOrder(order)
  }

  const handleClearScrollToBuilder = () => {
    setScrollToBuilder(false)
  }

  return (
    <div className="landing-flow-wrapper">
      <div className="flow-submenu">
        <div className="flow-submenu-inner">
          {FLOWS.map((flow) => (
            <button
              key={flow.id}
              className={`flow-submenu-link ${activeFlow === flow.id ? 'active' : ''}`}
              onClick={() => setActiveFlow(flow.id)}
            >
              {flow.label}
            </button>
          ))}
        </div>
      </div>

      {activeFlow === 'flow1' && (
        <LandingPage onSelectBundle={handleSelectBundle} />
      )}
      {activeFlow === 'flow2' && (
        <LandingPage2
          order={order}
          setOrder={setOrder}
          onOrder={handleOrder}
          scrollToBuilder={scrollToBuilder}
          onClearScrollToBuilder={handleClearScrollToBuilder}
        />
      )}
      {activeFlow === 'flow3' && (
        <LandingPage3
          order={order}
          setOrder={setOrder}
          onOrder={handleOrder}
          scrollToBuilder={scrollToBuilder}
          onClearScrollToBuilder={handleClearScrollToBuilder}
        />
      )}
      {activeFlow === 'flow4' && (
        <LandingPage4
          order={order}
          setOrder={setOrder}
          onOrder={handleOrder}
          scrollToBuilder={scrollToBuilder}
          onClearScrollToBuilder={handleClearScrollToBuilder}
        />
      )}
    </div>
  )
}
