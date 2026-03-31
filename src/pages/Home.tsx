import { Hero } from '../components/landing/Hero'
import { Features } from '../components/landing/Features'
import { Callout } from '../components/landing/HowItWorks'
import { PricingSection } from '../components/pricing/PricingCard'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Callout />
      <PricingSection />
    </>
  )
}
