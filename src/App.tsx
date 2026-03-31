import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Callback from './pages/Callback'
import SeoPage from './components/SeoPage'
import { seoRoutes, getRelatedPages } from './seoRoutes'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/callback" element={<Callback />} />
          {seoRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <SeoPage
                  title={route.title}
                  metaDescription={route.metaDescription}
                  h1={route.h1}
                  description={route.description}
                  faqs={route.faqs}
                  relatedPages={getRelatedPages(route.relatedSlugs)}
                  canonicalUrl={`https://www.imgtosheet.com${route.path}`}
                />
              }
            />
          ))}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
