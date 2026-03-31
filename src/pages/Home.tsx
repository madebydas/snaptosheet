import { Hero } from '../components/landing/Hero'
import { SocialProof } from '../components/landing/SocialProof'
import { EditorialHeadline } from '../components/landing/EditorialHeadline'
import { Marquee } from '../components/landing/Marquee'
import { Features } from '../components/landing/Features'
import { UseCaseGrid } from '../components/landing/UseCaseGrid'
import { AlternatingFeatures } from '../components/landing/AlternatingFeatures'
import { HowItWorks, Callout } from '../components/landing/HowItWorks'
import { BeforeAfter } from '../components/landing/BeforeAfter'
import { ValueStrip } from '../components/landing/ValueStrip'
import { FAQ } from '../components/landing/FAQ'
import { PricingSection } from '../components/pricing/PricingCard'
import { StickyHeader } from '../components/landing/StickyHeader'

export default function Home() {
  return (
    <>
      <StickyHeader />
      <Hero />
      <SocialProof />
      <EditorialHeadline />
      <Marquee />
      <Features />
      <UseCaseGrid />
      <AlternatingFeatures />
      <HowItWorks />
      <BeforeAfter />
      <Callout />
      <ValueStrip />
      <FAQ />
      <PricingSection />
    </>
  )
}
