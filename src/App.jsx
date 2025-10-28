import './App.css'
import Navbar from './components/Navbar'
import Menu from './components/Menu'
import { Background } from './components/Background'
function App() {

  return (
    <><div className="min-h-screen w-full text-text-primary relative z-0">
      <Background/>
      <div className='w-full h-full'>
        <Navbar />
        <Menu/>
      </div>
      </div>
       
    </>
  )
}

export default App
