import './App.css'
import { Link } from 'react-router-dom'

function App() {

  return (
    <>
      <h1>Gamedle</h1>
      <Link to='/DailyGuess'><button>Play Daily Game</button></Link>
    </>
  )
}

export default App
