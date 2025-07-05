import React from 'react';
interface RangeInputProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
}
export const RangeInput = ({
  name,
  value,
  onChange,
  min = -100,
  max = 100,
  step = 1,
  label,
  unit = ''
}: RangeInputProps) => {
  return <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label || name}
        </label>
        <span className="text-sm text-gray-500">
          {value}
          {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
    </div>;
};