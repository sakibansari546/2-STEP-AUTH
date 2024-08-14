import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import AuthForm from './pages/AuthForm.page.jsx'
import { Navbar } from './components/component/Navbar.jsx'
import VarifyEmail from './pages/VarifyEmail.jsx'

function App() {

  return (
    <>
      <Routes>
        <Route path='/signup' element={<AuthForm type='signup' />} />
        <Route path='/signin' element={<AuthForm type='signin' />} />
        <Route path='/varify-email' element={<VarifyEmail />} />
        <Route path='/' element={<Navbar />} >
          <Route path='/' element={<h1>Home</h1>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
