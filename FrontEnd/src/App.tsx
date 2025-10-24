import './App.css'
import { Link } from 'react-router-dom'

function App() {
  return (
    <div className='app-container'>
      <Link to='/DailyGuess'>
        <button className='btnStyle'>Play Game</button>
      </Link>
    </div>
  )
}

export default App
