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
      <Link to='/Leaderboard'>
        <button className='btnStyle'>Leader Board</button>
      </Link>
      <Link to='/Lookup'>
        <button className='btnStyle'>User Lookup</button>
      </Link>
    </div>
  )
}

export default App
