import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { BoardProvider } from './context/BoardContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <BoardProvider>
        <App />
      </BoardProvider>
    </ToastProvider>
  </StrictMode>,
)

