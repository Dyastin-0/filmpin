import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import axios from 'axios';

axios.defaults.baseURL = 'https://jwt-auth-wuhj.onrender.com';
axios.defaults.withCredentials = true;

function App() {

  return (
	<>
		<Navbar />
    <Toaster position='bottom-left' toastOptions={{duration: 2000}} />
    <Routes>
      <Route path='/sign-in' element={<Signin />}></Route>
      <Route path='/sign-up' element={<Signup />}></Route>
      <Route path='/dashboard' element={<Dashboard />}></Route>
    </Routes>
	</>
  );
}

export default App;
