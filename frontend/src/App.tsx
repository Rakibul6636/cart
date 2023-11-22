import {Routes, Route} from "react-router-dom"
import {Container} from "react-bootstrap"
import { Home } from "./pages/Home"
import { Store } from "./pages/Store"
import {Navbar} from "./components/Navbar"
import { ShoppingCartProvider } from "./context/ShoppingCartContext"
import { StoreItemsProvider } from "./context/StoreItemContext"
import { AuthProvider } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import { RegisterProvider } from "./context/RegisterContext"
import { AdminDashboard } from "./pages/AdminDashboard"
function App() {

  return (
    <>
    <RegisterProvider>
    <AuthProvider>
    <StoreItemsProvider>
    <ShoppingCartProvider>
    <Navbar/>
    <Container className="mb-4">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/store" element={<Store/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/logout" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>

      </Routes>
    </Container>
    </ShoppingCartProvider>
    </StoreItemsProvider>
    </AuthProvider>
    </RegisterProvider>

    
    </>
  )
}

export default App
