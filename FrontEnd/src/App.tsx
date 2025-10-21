import './App.css'
import { Link } from 'react-router-dom'


function App() {


  return (
    <div className='app-container'>
      <h1>Welcome to Gamedle!</h1>
      <Link to='/DailyGuess'><button className='btnStyle btn2'>Play Daily Game</button></Link>
      <div className='userBtnGroup'>
        <Link to='/login'><button className='btnStyle'>Login</button></Link>
        <Link to='/signup'><button className='btnStyle'>Sign Up</button></Link>
      </div>
    </div>
  )
}

export default App
