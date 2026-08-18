import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ItemsFeed from './pages/ItemsFeed'
import ReportItem from './pages/ReportItem'
import ItemDetails from './pages/ItemDetails'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import MyItems from './pages/MyItems'

function Layout({ children, hideNavFooter }) {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout hideNavFooter><Login /></Layout>} />
          <Route path="/signup" element={<Layout hideNavFooter><SignUp /></Layout>} />
          <Route path="/lost" element={<Layout><ItemsFeed feedType="lost" /></Layout>} />
          <Route path="/found" element={<Layout><ItemsFeed feedType="found" /></Layout>} />
          <Route path="/report" element={<Layout><ReportItem /></Layout>} />
          <Route path="/item/:id" element={<Layout><ItemDetails /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/profile/edit" element={<Layout><EditProfile /></Layout>} />
          <Route path="/profile/my-items" element={<Layout><MyItems /></Layout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
