import { Hero } from '../components/landing/Hero'
import { Marquee } from '../components/landing/Marquee'
import { Features } from '../components/landing/Features'
import { HowItWorks, Callout } from '../components/landing/HowItWorks'
import { PricingSection } from '../components/pricing/PricingCard'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Callout />
      <PricingSection />
    </>
  )
}
