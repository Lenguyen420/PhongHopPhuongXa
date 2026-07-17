import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from '@/routes/AppRoutes'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
    </BrowserRouter>
  )
}

export default App
