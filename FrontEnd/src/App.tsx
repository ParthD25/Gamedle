import './App.css'
import { Link } from 'react-router-dom'

function App() {
  return (
    <div className='app-container'>
      <Link to='/DailyGuess'>
        <button className='btnStyle btn2 daily-game-btn'>Play Daily Game</button>
      </Link>
    </div>
  )
}

export default App
