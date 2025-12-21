import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'cyan' | 'pink' | 'purple' | 'orange' | 'yellow' | 'green';
}

const colorClasses = {
  cyan: 'bg-chart-cyan/20 text-chart-cyan border-chart-cyan/30',
  pink: 'bg-chart-pink/20 text-chart-pink border-chart-pink/30',
  purple: 'bg-chart-purple/20 text-chart-purple border-chart-purple/30',
  orange: 'bg-chart-orange/20 text-chart-orange border-chart-orange/30',
  yellow: 'bg-chart-yellow/20 text-chart-yellow border-chart-yellow/30',
  green: 'bg-chart-green/20 text-chart-green border-chart-green/30',
};

const iconBgClasses = {
  cyan: 'bg-chart-cyan',
  pink: 'bg-chart-pink',
  purple: 'bg-chart-purple',
  orange: 'bg-chart-orange',
  yellow: 'bg-chart-yellow',
  green: 'bg-chart-green',
};

export function KPICard({ title, value, icon: Icon, color }: KPICardProps) {
  return (
    <div className={`glass-card rounded-xl p-4 border ${colorClasses[color]} transition-all duration-300 hover:scale-105 animate-float`} style={{ animationDelay: `${Math.random() * 0.5}s` }}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          <Icon className="w-6 h-6 text-background" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{title}</span>
          <span className="text-2xl font-bold text-foreground">{value}</span>
        </div>
      </div>
    </div>
  );
}
