import { lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import axios from "axios";
import ProtectedRoute from "./utils/protectedRoute";

import SideNavbar from "./components/SideNavbar";
import { authRoutes, routes } from "./utils/routes";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Root = lazy(() => import("./pages/Root"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
const Discover = lazy(() => import("./pages/Discover"));
const DiscoverMovieSlug = lazy(() => import("./pages/DiscoverMovieSlug"));
const DiscoverTvShowSlug = lazy(() => import("./pages/DiscoverTvShowSlug"));
const MovieSlug = lazy(() => import("./pages/MovieSlug"));
const TvShowSlug = lazy(() => import("./pages/TvShowSlug"));
const SearchSlug = lazy(() => import("./pages/SearchSlug"));
const AccountVerification = lazy(() => import("./pages/AccountVerification"));
const Verification = lazy(() => import("./pages/Verification"));
const AccountRecovery = lazy(() => import("./pages/AccountRecovery"));
const Recovery = lazy(() => import("./pages/Recovery"));
const TvShowSeasonSlug = lazy(() => import("./pages/TvShowSeasonSlug"));
const TvShowEpisodeSlug = lazy(() => import("./pages/TvShowEpisodeSlug"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const ListSlug = lazy(() => import("./pages/ListSlug"));

axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL;
axios.defaults.withCredentials = true;

function App() {
  const [opensideNavbar, setOpenSideNavbar] = useState(false);

  return (
    <>
      <Navbar toggleSideNavbar={() => setOpenSideNavbar(!opensideNavbar)} />
      <SideNavbar
        isOpen={opensideNavbar}
        toggle={() => setOpenSideNavbar(!opensideNavbar)}
        authRoutes={authRoutes}
        routes={routes}
      />
      <Suspense>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/account/verify" element={<AccountVerification />} />
          <Route path="/account/verification" element={<Verification />} />
          <Route path="/account/recovery" element={<AccountRecovery />} />
          <Route path="/account/recover" element={<Recovery />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/:username" element={<Profile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchSlug />} />
            <Route path="/movies" element={<MovieSlug />} />
            <Route path="/tvshows" element={<TvShowSlug />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/discover/movies" element={<DiscoverMovieSlug />} />
            <Route path="/discover/tvshows" element={<DiscoverTvShowSlug />} />
            <Route
              path="/tvshows/:show_id/season"
              element={<TvShowSeasonSlug />}
            />
            <Route
              path="/tvshows/:show_id/:season/episode"
              element={<TvShowEpisodeSlug />}
            />
            <Route path="/list" element={<ListSlug />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
