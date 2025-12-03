interface RiskIndicatorProps {
  level: number; // 1-7
}

const colors = ['bg-success/80', 'bg-success/70', 'bg-success/60', 'bg-warning/80', 'bg-warning/90', 'bg-error/70', 'bg-error/80'];

export const RiskIndicator = ({ level }: RiskIndicatorProps) => {
  const clamped = Math.min(Math.max(level, 1), 7);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 7 }).map((_, idx) => (
          <span
            key={idx}
            className={`h-2 w-3 rounded-sm transition-colors duration-200 ${
              idx < clamped ? colors[idx] : 'bg-base-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-base-content/70">Risque {clamped}/7</span>
    </div>
  );
};
