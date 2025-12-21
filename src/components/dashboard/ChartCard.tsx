import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className = '' }: ChartCardProps) {
  return (
    <div className={`glass-card rounded-xl p-4 chart-animation ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">{title}</h3>
      {children}
    </div>
  );
}
