import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import axios from 'axios';
import MovieSlug from './pages/MovieSlug';
import SearchSlug from './pages/SearchSlug';
import ProtectedRoute from './utils/protectedRoute';
import DiscoverSlug from './pages/DiscoverSlug';

axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
	<>
		<Navbar />
    <Toaster position='bottom-left' toastOptions={{duration: 2000}} />
    <Routes>
      <Route path='/' element={<Signin />}></Route>
      <Route path='/sign-in' element={<Signin />}></Route>
      <Route path='/sign-up' element={<Signup />}></Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/movies/:id' element={<MovieSlug />}> </Route>
        <Route path='/movies/search' element={<SearchSlug />}></Route>
        <Route path='/movies/discover' element={<DiscoverSlug />} />
      </Route>
    </Routes>
	</>
  );
}

export default App;
