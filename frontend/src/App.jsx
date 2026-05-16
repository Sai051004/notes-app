import { AppRoutes } from './routes/AppRoutes.jsx';
import { AuthSessionHandler } from './components/auth/AuthSessionHandler.jsx';

function App() {
  return (
    <>
      <AuthSessionHandler />
      <AppRoutes />
    </>
  );
}

export default App;
