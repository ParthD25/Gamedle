import './App.css'
import BackgroundMosaic from './components/BackgroundMosaic'
import { Link } from 'react-router-dom'

function App() {
  return (
    <div className='app-container'>
      <BackgroundMosaic />
      <Link to='/DailyGuess'>
        <button className='btnStyle'>Play Game</button>
      </Link>
    </div>
  )
}

export default App
