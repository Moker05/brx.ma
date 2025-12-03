import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { OPCVMHistory } from '../../services/opcvmAPI';

interface PerformanceChartProps {
  data: OPCVMHistory[];
  height?: number;
}

const formatter = new Intl.DateTimeFormat('fr-MA', { month: 'short', day: 'numeric' });

export const PerformanceChart = ({ data, height = 260 }: PerformanceChartProps) => {
  const chartData = data.map((point) => ({
    date: formatter.format(new Date(point.date)),
    vl: point.vl,
  }));

  return (
    <div className="glass rounded-2xl p-4 border border-base-300/60">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-base-content/60 uppercase tracking-wide">Historique VL</p>
          <h3 className="text-lg font-semibold">Evolution recente</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="opcvmColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            domain={['auto', 'auto']}
            width={60}
          />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
            formatter={(value: number) => [`${value.toFixed(3)} MAD`, 'VL']}
          />
          <Area type="monotone" dataKey="vl" stroke="#22c55e" fillOpacity={1} fill="url(#opcvmColor)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
