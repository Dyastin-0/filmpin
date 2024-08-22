import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import axios from 'axios';
import ProtectedRoute from './utils/protectedRoute';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Discover from './pages/Discover';

const Signin = lazy(() => import('./pages/Signin'));
const Signup = lazy(() => import('./pages/Signup'));
const Home = lazy(() => import('./pages/Home'));
const DiscoverMovieSlug = lazy(() => import('./pages/DiscoverMovieSlug'));
const DiscoverTvShowSlug = lazy(() => import('./pages/DiscoverTvShowSlug'));
const MovieSlug = lazy(() => import('./pages/MovieSlug'));
const TvShowSlug = lazy(() => import('./pages/TvShowSlug'))
const SearchSlug = lazy(() => import('./pages/SearchSlug'));

axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
	<>
		<Navbar />
    <Suspense>
      <Routes>
        <Route path='/' element={<Signin /> } />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Home />} />
          <Route path='/movies' element={<MovieSlug />} />
          <Route path='/movies/search' element={<SearchSlug />} />
          <Route path='/discover' element={<Discover />} />
          <Route path='/discover/movies' element={<DiscoverMovieSlug />} />
          <Route path='/tvshows' element={<TvShowSlug />} />
          <Route path='/discover/tvshows' element={<DiscoverTvShowSlug />} />
        </Route>
      </Routes>
    </Suspense>
	</>
  );
}

export default App;
