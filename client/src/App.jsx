import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import axios from 'axios';
import ProtectedRoute from './utils/protectedRoute';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Signin = lazy(() => import('./pages/Signin'));
const Signup = lazy(() => import('./pages/Signup'));
const Home = lazy(() => import('./pages/Home'));
const DiscoverSlug = lazy(() => import('./pages/DiscoverSlug'));
const MovieSlug = lazy(() => import('./pages/MovieSlug'));
const SearchSlug = lazy(() => import('./pages/SearchSlug'));

axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
	<>
		<Navbar />
    <Suspense>
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
    </Suspense>
	</>
  );
}

export default App;
