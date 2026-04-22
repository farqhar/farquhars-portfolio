type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
};

const NumberField = ({ label, value, onChange, min = 0, max = 200, step = 1, suffix }: Props) => (
  <div className="flex items-center gap-2 mb-1.5">
    <label className="text-[11px] text-gray-600 w-16 shrink-0">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="flex-1 accent-indigo-600"
    />
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-16 text-xs border border-gray-300 rounded px-1.5 py-0.5"
    />
    {suffix && <span className="text-[10px] text-gray-400 w-4">{suffix}</span>}
  </div>
);

export default NumberField;