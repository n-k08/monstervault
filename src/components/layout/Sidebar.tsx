import { Home, Grid3X3, Compass, Flag, Globe, BarChart3, Trophy, Settings, Zap } from 'lucide-react';
import { useCollection } from '../../context/CollectionContext';
import { monsterProducts } from '../../data/monsters';

interface Props {
  currentPage: string;
  onNavigate: (path: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: Props) {
  const { getTotalCollected, achievements, getItem } = useCollection();

  const totalCollected = getTotalCollected();
  const totalProducts = monsterProducts.length;
  const indiaProducts = monsterProducts.filter(p => p.countryAvailability === 'India');
  const indiaCollected = indiaProducts.filter(p => getItem(p.id)?.isCollected).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const nav = [
    { label: 'Dashboard', icon: Home, path: '/' },
    {
      label: 'My Collection',
      icon: Grid3X3,
      path: '/collection',
      badge: `${totalCollected}`,
    },
    { label: 'Explore Catalogue', icon: Compass, path: '/explore' },
    {
      label: 'Monster India',
      icon: Flag,
      path: '/india',
      badge: `${indiaCollected}/${indiaProducts.length}`,
      highlightBadge: true,
    },
    { label: 'Worldwide Vault', icon: Globe, path: '/worldwide' },
    { label: 'Monster Wall', icon: Zap, path: '/wall' },
    { label: 'Analytics', icon: BarChart3, path: '/stats' },
    {
      label: 'Achievements',
      icon: Trophy,
      path: '/achievements',
      badge: unlockedAchievements > 0 ? `${unlockedAchievements}` : undefined,
    },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside
      className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/[0.06] z-30"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* Brand Header */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-white/[0.06]">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shadow-lg shadow-[#39FF14]/20"
          style={{ background: 'linear-gradient(135deg, #39FF14, #00E676)', color: '#000' }}
        >
          M
        </div>
        <div>
          <h1 className="font-black text-sm tracking-wider text-white">MONSTER VAULT</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
            <span className="text-[10px] text-[#39FF14] font-bold tracking-widest uppercase">
              INDIA EDITION
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {nav.map(item => {
          const active = currentPage === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                active
                  ? 'text-black bg-[#39FF14] shadow-md shadow-[#39FF14]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} strokeWidth={active ? 2.5 : 2} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    active
                      ? 'bg-black/20 text-black'
                      : item.highlightBadge
                      ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30'
                      : 'bg-white/[0.08] text-gray-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Collection Progress Card */}
      <div className="p-4 m-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
          <span className="text-gray-400">Vault Progress</span>
          <span className="text-[#39FF14]">
            {totalProducts > 0 ? Math.round((totalCollected / totalProducts) * 100) : 0}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-[#39FF14]"
            style={{
              width: `${totalProducts > 0 ? (totalCollected / totalProducts) * 100 : 0}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
          <span>{totalCollected} COLLECTED</span>
          <span>{totalProducts} TOTAL</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-gray-500 font-mono">
        <span>v1.0.0</span>
        <span className="text-[#39FF14]">READY</span>
      </div>
    </aside>
  );
}
