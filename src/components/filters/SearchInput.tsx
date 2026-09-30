import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Monster flavours…"
        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white border border-white/[0.08] focus:outline-none focus:border-[#39FF14]/30 transition placeholder:text-gray-600"
        style={{ background: 'var(--bg-card)' }}
      />
    </div>
  );
}
