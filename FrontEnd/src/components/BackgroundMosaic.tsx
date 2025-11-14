import './BackgroundMosaic.css'
import { BACKGROUND_IMAGES } from '../backgrounds'

//Background image component
export default function BackgroundMosaic() {
  const images = BACKGROUND_IMAGES.filter(Boolean)

  return (
    <div className="bgm-root" aria-hidden>
      {images.length > 0 ? (
        <div className="bgm-grid">
          <div className="bgm-cell" style={{ backgroundImage: `url(${images[0]})` }} />
          <div className="bgm-overlay" />
        </div>
      ) : (
        <div className="bgm-fallback" />
      )}
    </div>
  )
}
