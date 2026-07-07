import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import LoadingScreen from './components/ui/LoadingScreen';
import QuickScanFAB from './components/ui/QuickScanFAB';

// Lazy loading pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AnalyzePage = lazy(() => import('./pages/AnalyzePage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const MethodologyPage = lazy(() => import('./pages/MethodologyPage'));

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="pb-20 md:pb-0 min-h-screen"
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center">
        <Suspense fallback={<LoadingScreen inline />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
              <Route path="/analyze" element={<PageWrapper><AnalyzePage /></PageWrapper>} />
              <Route path="/results" element={<PageWrapper><ResultsPage /></PageWrapper>} />
              <Route path="/history" element={<PageWrapper><HistoryPage /></PageWrapper>} />
              <Route path="/marketplace" element={<PageWrapper><MarketplacePage /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
              <Route path="/methodology" element={<PageWrapper><MethodologyPage /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <QuickScanFAB />
      <BottomNav />
    </div>
  );
}

export default App;
