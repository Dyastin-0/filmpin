import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import axios from 'axios';
import MovieSlug from './pages/MovieSlug';

axios.defaults.baseURL = 'https://jwt-auth-wuhj.onrender.com/';
axios.defaults.withCredentials = true;

function App() {

  return (
	<>
		<Navbar />
    <Toaster position='bottom-left' toastOptions={{duration: 2000}} />
    <Routes>
      <Route path='/sign-in' element={<Signin />}></Route>
      <Route path='/sign-up' element={<Signup />}></Route>
      <Route path='/dashboard' element={<Home />}></Route>
      <Route path='/movies/:title' element={<MovieSlug />}> </Route>
    </Routes>
	</>
  );
}

export default App;
