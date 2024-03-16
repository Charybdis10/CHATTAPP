import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
//importing router from react dom 
import PrivateRoutes from './utils/PrivateRoutes'
//importing private routes
import Room from './pages/room'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider } from './utils/AuthContext'



function App() {


  return (
    
      <Router>
        
        <AuthProvider>
          
          <Routes>
              <Route path="/login" element={<LoginPage/>}/>{/*path to login page */}
              <Route path="/register" element={<RegisterPage/>}/>
                <Route element={<PrivateRoutes/>}>{/* any protected pages will take this route  */}
                    <Route path="/" element={<Room/>}/>
                </Route>
          </Routes>
        </AuthProvider>
        {/*to make dat available to child components(authprov) */}
      </Router>
    
  )
}

export default App
