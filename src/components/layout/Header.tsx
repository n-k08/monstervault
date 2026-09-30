import { useState } from 'react';
import { Plus, Moon, Sun, Menu, X, Flag, Compass, Grid3X3, Home, Globe, Zap, BarChart3, Trophy, Settings } from 'lucide-react';
import { useCollection } from '../../context/CollectionContext';
import { monsterProducts } from '../../data/monsters';

interface Props {
  currentPage: string;
  onNavigate: (path: string) => void;
  onOpenAddCan: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: Home, path: '/' },
  { label: 'My Collection', icon: Grid3X3, path: '/collection' },
  { label: 'Explore Database', icon: Compass, path: '/explore' },
  { label: 'Monster India', icon: Flag, path: '/india' },
  { label: 'Worldwide Vault', icon: Globe, path: '/worldwide' },
  { label: 'Monster Wall', icon: Zap, path: '/wall' },
  { label: 'Statistics', icon: BarChart3, path: '/stats' },
  { label: 'Achievements', icon: Trophy, path: '/achievements' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Header({ currentPage, onNavigate, onOpenAddCan }: Props) {
  const { oledMode, toggleOled, getTotalCollected, getItem } = useCollection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalFlavours = monsterProducts.length;
  const totalCollected = getTotalCollected();
  const overallPct = totalFlavours > 0 ? Math.round((totalCollected / totalFlavours) * 100) : 0;

  const indiaProducts = monsterProducts.filter(p => p.countryAvailability === 'India');
  const indiaCollected = indiaProducts.filter(p => getItem(p.id)?.isCollected).length;

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-white/[0.06] backdrop-blur-xl"
        style={{ background: 'rgba(18, 22, 26, 0.85)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile Brand & Hamburger / Desktop Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div className="lg:hidden flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs bg-[#39FF14] text-black">
                M
              </span>
              <span className="font-black text-sm tracking-wide text-white">MONSTER VAULT</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400">
              <span className="text-gray-500 font-mono text-[11px]">VAULT //</span>
              <span className="font-semibold text-gray-200 uppercase tracking-wider">
                {currentPage === '/' ? 'Dashboard' : currentPage.replace('/', '').replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Right: Quick Stats, OLED Toggle, Add Can Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* India completion badge */}
            <button
              onClick={() => onNavigate('/india')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:border-[#39FF14]/30 transition group"
              title="Monster Energy India official catalogue progress"
            >
              <Flag size={12} className="text-[#39FF14]" />
              <span className="text-[11px] font-bold text-gray-300 group-hover:text-white">
                India: <span className="text-[#39FF14]">{indiaCollected}</span>/{indiaProducts.length}
              </span>
            </button>

            {/* Total collected pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              <span className="text-[11px] font-bold text-gray-300">
                {totalCollected}/{totalFlavours} <span className="text-gray-500">({overallPct}%)</span>
              </span>
            </div>

            {/* OLED Mode Toggle */}
            <button
              onClick={toggleOled}
              className={`p-2 rounded-xl border transition ${
                oledMode
                  ? 'border-[#39FF14]/40 bg-[#39FF14]/10 text-[#39FF14]'
                  : 'border-white/[0.08] bg-white/[0.03] text-gray-400 hover:text-white'
              }`}
              title={oledMode ? 'Switch to Dark Mode' : 'Switch to Pure OLED Black'}
            >
              {oledMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Primary Action: + Log Can */}
            <button
              onClick={onOpenAddCan}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black text-black transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#39FF14]/20"
              style={{ background: 'linear-gradient(135deg, #39FF14, #00E676)' }}
            >
              <Plus size={15} strokeWidth={3} />
              <span className="hidden sm:inline">LOG CAN</span>
              <span className="sm:hidden">LOG</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="fixed inset-y-0 left-0 w-72 p-6 shadow-2xl flex flex-col border-r border-white/[0.08]"
            style={{ background: 'var(--bg-secondary)' }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs bg-[#39FF14] text-black">
                  M
                </div>
                <div>
                  <h2 className="font-black text-sm text-[#39FF14] tracking-wider">MONSTER VAULT</h2>
                  <p className="text-[10px] text-gray-400">India Collector Edition</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Nav Links */}
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navItems.map(item => {
                const active = currentPage === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      active
                        ? 'text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/25'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Total Collected</span>
                  <span className="font-bold text-[#39FF14]">{totalCollected} / {totalFlavours}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#39FF14]"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAddCan();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-black text-black bg-[#39FF14] flex items-center justify-center gap-2"
              >
                <Plus size={15} strokeWidth={3} />
                LOG A CAN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
