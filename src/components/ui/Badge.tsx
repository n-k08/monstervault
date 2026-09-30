interface Props {
  label: string;
  variant?: 'india' | 'international' | 'discontinued' | 'collected' | 'limited' | 'zero-sugar';
}

const styles: Record<string, string> = {
  india: 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30',
  international: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  discontinued: 'bg-red-500/15 text-red-400 border border-red-500/30',
  collected: 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/40',
  limited: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  'zero-sugar': 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
};

export default function Badge({ label, variant = 'india' }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {label}
    </span>
  );
}
