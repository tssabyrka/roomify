import { ArrowRight, ArrowUpRight, Clock, Layers } from 'lucide-react'
import type { Route } from './+types/home'
import Navbar from '../../components/Navbar'
import Button from '../../components/ui/Button'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Roomify | Architectural Visualization Platform' },
    { name: 'description', content: 'Roomify | Architectural Visualization Platform!' },
  ]
}

export default function Home() {
  return (
    <div className="home">
      <Navbar />

      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>

          <p>Introducing Roomify 2.0</p>
        </div>

        <h1>Build beautiful spaces at the speed of thought with Roomify</h1>

        <p className="subtitle">
          Roomify is an AI-first design environment that helps you visualize, render, and ship architectural projects
          faster than ever.
        </p>

        <div className="actions">
          <a className="cta" href="#upload">
            Start Building <ArrowRight className="icon" />
          </a>

          <Button className="demo" size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>

        <div className="upload-shell" id="upload">
          <div className="grid-overlay" />
          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>

              <h3>Upload your floor plan</h3>
              <p>Supports JPG, PNG, formats up to 10MB</p>
            </div>

            <p>Upload images</p>
          </div>
        </div>
      </section>
    </div>
  )
}
