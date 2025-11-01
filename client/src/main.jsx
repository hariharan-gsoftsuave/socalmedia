import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';  // <-- Add this
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
   <App />,
)
