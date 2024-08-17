import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import axios from 'axios';
import MovieSlug from './pages/MovieSlug';
import SearchResult from './pages/SearchResult';

axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL;
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
      <Route path='/movies/:id' element={<MovieSlug />}> </Route>
      <Route path='/movies/search/:query' element={<SearchResult />}></Route>
    </Routes>
	</>
  );
}

export default App;
