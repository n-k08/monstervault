import type { FilterState } from '../../types/monster';

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const categories = ['All', 'Original', 'Ultra', 'Juice', 'Java', 'Rehab', 'Reserve', 'Special / Limited Edition'];
const availabilities = ['All', 'India', 'International', 'Discontinued'];
const collectionStatuses = ['All', 'Collected', 'Not Collected'];
const sugarTypes = ['All', 'Sugar', 'Zero Sugar'];
const sortOptions: { label: string; value: FilterState['sortBy'] }[] = [
  { label: 'A → Z', value: 'name-asc' },
  { label: 'Z → A', value: 'name-desc' },
  { label: 'Recently Collected', value: 'recent' },
  { label: 'Status', value: 'status' },
  { label: 'Category', value: 'category' },
  { label: 'Rating', value: 'rating' },
];

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg text-xs font-medium text-white border border-white/[0.08] focus:outline-none focus:border-[#39FF14]/40 transition appearance-none cursor-pointer"
        style={{ background: 'var(--bg-card)' }}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

export default function FilterBar({ filters, onChange }: Props) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 rounded-xl border border-white/[0.06]"
      style={{ background: 'var(--bg-card)' }}>
      <Select label="Category" value={filters.category} options={categories} onChange={(v) => update({ category: v })} />
      <Select label="Availability" value={filters.availability} options={availabilities} onChange={(v) => update({ availability: v })} />
      <Select label="Collection" value={filters.collectionStatus} options={collectionStatuses} onChange={(v) => update({ collectionStatus: v })} />
      <Select label="Sugar" value={filters.sugarType} options={sugarTypes} onChange={(v) => update({ sugarType: v })} />
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Sort</label>
        <select
          value={filters.sortBy}
          onChange={(e) => update({ sortBy: e.target.value as FilterState['sortBy'] })}
          className="px-3 py-2 rounded-lg text-xs font-medium text-white border border-white/[0.08] focus:outline-none focus:border-[#39FF14]/40 transition appearance-none cursor-pointer"
          style={{ background: 'var(--bg-card)' }}
        >
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
