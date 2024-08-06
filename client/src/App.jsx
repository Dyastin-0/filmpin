import { Routes, Route } from 'react-router-dom';

import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

import { Toaster } from 'react-hot-toast';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {

  return (
	<>
		<Navbar />
    <Toaster position='bottom-left' toastOptions={{duration: 2000}} />
    <Routes>
      <Route path='/signin' element={<Signin />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/dashboard' element={<Dashboard />}></Route>
    </Routes>
	</>
  );
}

export default App;
