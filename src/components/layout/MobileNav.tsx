import { Home, Grid3X3, Flag, Zap, BarChart3 } from 'lucide-react';
import { useCollection } from '../../context/CollectionContext';

const tabs = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Collection', icon: Grid3X3, path: '/collection' },
  { label: 'India', icon: Flag, path: '/india' },
  { label: 'Wall', icon: Zap, path: '/wall' },
  { label: 'Stats', icon: BarChart3, path: '/stats' },
];

interface Props {
  currentPage: string;
  onNavigate: (path: string) => void;
}

export default function MobileNav({ currentPage, onNavigate }: Props) {
  const { getTotalCollected } = useCollection();
  const collected = getTotalCollected();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08]"
      style={{
        background: 'rgba(18, 22, 26, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex justify-around items-center py-2 px-1 max-w-md mx-auto">
        {tabs.map(tab => {
          const active = currentPage === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => onNavigate(tab.path)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
                active ? 'text-[#39FF14]' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <tab.icon size={19} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
              {tab.path === '/collection' && collected > 0 && !active && (
                <span className="absolute top-0 right-2 w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
              )}
              {active && (
                <div
                  className="w-1.5 h-1.5 rounded-full bg-[#39FF14] shadow-sm shadow-[#39FF14]"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
