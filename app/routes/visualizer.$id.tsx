import { useParams, Link } from 'react-router'
import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'

const VisualizerId = () => {
  const { id } = useParams()
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const storedImage = localStorage.getItem(`floorplan_${id}`)
      if (storedImage) {
        setImage(storedImage)
      }
    }
  }, [id])

  return (
    <div className="visualizer">
      <Navbar />
      <div className="visualizer-content">
        <div className="container">
          <header className="page-header">
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
            <h1>Visualization for Project {id}</h1>
          </header>

          <main className="view-grid">
            <div className="preview-card">
              <h3>Original Floor Plan</h3>
              <div className="image-container">
                {image ? (
                  <img src={image} alt="Original Floor Plan" />
                ) : (
                  <p className="error">No floor plan found for this ID.</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default VisualizerId
