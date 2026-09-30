import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MobileNav from './components/layout/MobileNav';
import FlavourDetailModal from './components/collection/FlavourDetailModal';
import AddCanModal from './components/collection/AddCanModal';
import Dashboard from './pages/Dashboard';
import Collection from './pages/Collection';
import Explore from './pages/Explore';
import MonsterIndia from './pages/MonsterIndia';
import Worldwide from './pages/Worldwide';
import CollectionWall from './pages/CollectionWall';
import Stats from './pages/Stats';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import type { MonsterProduct } from './types/monster';

export default function App() {
  const [page, setPage] = useState('/');
  const [selectedProduct, setSelectedProduct] = useState<MonsterProduct | null>(null);
  const [isAddCanOpen, setIsAddCanOpen] = useState(false);

  const openDetail = (p: MonsterProduct) => setSelectedProduct(p);
  const closeDetail = () => setSelectedProduct(null);

  const openAddCan = () => setIsAddCanOpen(true);
  const closeAddCan = () => setIsAddCanOpen(false);

  const renderPage = () => {
    switch (page) {
      case '/':
        return (
          <Dashboard
            onNavigate={setPage}
            onOpenDetail={openDetail}
            onOpenAddCan={openAddCan}
          />
        );
      case '/collection':
        return (
          <Collection
            onOpenDetail={openDetail}
            onOpenAddCan={openAddCan}
          />
        );
      case '/explore':
        return <Explore onOpenDetail={openDetail} />;
      case '/india':
        return <MonsterIndia onOpenDetail={openDetail} />;
      case '/worldwide':
        return <Worldwide onOpenDetail={openDetail} />;
      case '/wall':
        return (
          <CollectionWall
            onOpenDetail={openDetail}
            onOpenAddCan={openAddCan}
          />
        );
      case '/stats':
        return <Stats />;
      case '/achievements':
        return <Achievements />;
      case '/settings':
        return <Settings />;
      default:
        return (
          <Dashboard
            onNavigate={setPage}
            onOpenDetail={openDetail}
            onOpenAddCan={openAddCan}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-carbon text-[#f3f4f6]">
      {/* Desktop Persistent Sidebar */}
      <Sidebar currentPage={page} onNavigate={setPage} />

      {/* Mobile Bottom Navigation */}
      <MobileNav currentPage={page} onNavigate={setPage} />

      {/* Main Container */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header
          currentPage={page}
          onNavigate={setPage}
          onOpenAddCan={openAddCan}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 pb-24 lg:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Flavour Detail Inspection Modal */}
      {selectedProduct && (
        <FlavourDetailModal product={selectedProduct} onClose={closeDetail} />
      )}

      {/* Log Can Quick Modal */}
      <AddCanModal
        isOpen={isAddCanOpen}
        onClose={closeAddCan}
      />
    </div>
  );
}
