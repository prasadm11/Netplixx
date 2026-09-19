import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileTabBar from './components/MobileTabBar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import NewPopularPage from './pages/NewPopularPage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeriesDetailPage from './pages/SeriesDetailPage';
import PersonDetailPage from './pages/PersonDetailPage';
import WatchMoviePage from './pages/WatchMoviePage';
import WatchTvPage from './pages/WatchTvPage';
import ShortsPage from './pages/ShortsPage';
import ListsPage from './pages/ListsPage';
import ContinueWatchingPage from './pages/ContinueWatchingPage';
import SettingsPage from './pages/SettingsPage';
import AnimePage from './pages/AnimePage';
import BrowsePage from './pages/BrowsePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App: React.FC = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/movie/') || 
                       location.pathname.startsWith('/series/') || 
                       location.pathname.startsWith('/tv/');
  const isWatchPage = location.pathname.startsWith('/watch/');
  const isShorts = location.pathname.startsWith('/shorts');
  const hideNavbar = isDetailPage || isWatchPage || isShorts;
  const hideTabBar = isWatchPage || isShorts;

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white selection:bg-[#95FF50] selection:text-black">
      <ScrollToTop />
      {!hideNavbar && <Navbar />}

      <main className={`flex-1 ${!hideTabBar ? 'pb-20 md:pb-0' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/new" element={<DiscoverPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/browse/:type" element={<BrowsePage />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/series/:id" element={<SeriesDetailPage />} />
          <Route path="/tv/:id" element={<SeriesDetailPage />} />
          <Route path="/person/:id" element={<PersonDetailPage />} />
          <Route path="/watch/movie/:id" element={<WatchMoviePage />} />
          <Route path="/watch/tv/:id/:season/:episode" element={<WatchTvPage />} />
          <Route path="/shorts" element={<ShortsPage />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/continue-watching" element={<ContinueWatchingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isShorts && <Footer />}
      {!hideTabBar && <MobileTabBar />}
    </div>
  );
};

export default App;
