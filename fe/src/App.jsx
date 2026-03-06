import { BrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Router from './router/Router';
import { AuthProvider } from './context/AuthContext';
import { StudentAuthProvider } from './context/StudentAuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StudentAuthProvider>
        <Router />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontSize: '14px', maxWidth: '380px' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        </StudentAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
