import { useState } from 'react'
import PasswordGate from './components/PasswordGate'
import LandingFlowWrapper from './components/LandingFlowWrapper'
import CheckoutDrawer from './components/CheckoutDrawer'
import './App.css'

export default function App() {
  const [selectedBundle, setSelectedBundle] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [checkoutStep, setCheckoutStep] = useState(0) // 0 = closed, 1 = confirmation, 2 = summary

  const handleSelectBundle = (bundle) => {
    setSelectedBundle(bundle)
    setSelectedOrder(null)
    setCheckoutStep(1)
  }

  const handleOrder = (order) => {
    setSelectedOrder(order)
    setSelectedBundle(null)
    setCheckoutStep(2)
  }

  const handleContinue = () => setCheckoutStep(2)
  const handleBack = () => setCheckoutStep(1)
  const handleClose = () => {
    setCheckoutStep(0)
    setSelectedBundle(null)
    setSelectedOrder(null)
  }

  return (
    <PasswordGate>
      <>
        <LandingFlowWrapper
        onSelectBundle={handleSelectBundle}
        onOrder={handleOrder}
      />
      <CheckoutDrawer
        isOpen={checkoutStep > 0}
        bundle={selectedBundle}
        order={selectedOrder}
        step={checkoutStep}
        onClose={handleClose}
        onContinue={handleContinue}
        onBack={handleBack}
        orderBasedBackCloses={!!selectedOrder}
      />
      </>
    </PasswordGate>
  )
}
