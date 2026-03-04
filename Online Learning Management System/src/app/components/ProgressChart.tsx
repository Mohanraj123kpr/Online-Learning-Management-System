import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProgressChartProps {
  data: Array<{ name: string; progress: number }>;
}

export function ProgressChart({ data }: ProgressChartProps) {
  const getColor = (progress: number) => {
    if (progress >= 75) return '#10b981'; // green
    if (progress >= 50) return '#3b82f6'; // blue
    if (progress >= 25) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip
          formatter={(value: number) => [`${value}%`, 'Progress']}
        />
        <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.progress)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
