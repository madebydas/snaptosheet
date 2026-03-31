import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Hero() {
  return (
    <section className="py-20 text-center">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Turn Photos Into{' '}
          <span className="text-brand-600">Spreadsheets</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Snap a picture of any table, menu, receipt, or schedule and instantly
          convert it into an editable spreadsheet. Download as CSV or Excel in
          seconds.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link to="/auth">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
