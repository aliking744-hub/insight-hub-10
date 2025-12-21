import { Employee } from '@/types/employee';
import { ChartCard } from './ChartCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin } from 'lucide-react';

interface MapTabProps {
  data: Employee[];
}

const regionPositions: Record<number, { x: number; y: number }> = {
  1: { x: 75, y: 15 }, 2: { x: 65, y: 25 }, 3: { x: 55, y: 20 }, 4: { x: 60, y: 35 },
  5: { x: 45, y: 22 }, 6: { x: 50, y: 35 }, 7: { x: 55, y: 45 }, 8: { x: 68, y: 40 },
  9: { x: 35, y: 45 }, 10: { x: 40, y: 55 }, 11: { x: 50, y: 50 }, 12: { x: 55, y: 55 },
  13: { x: 65, y: 50 }, 14: { x: 60, y: 60 }, 15: { x: 50, y: 65 }, 16: { x: 45, y: 70 },
  17: { x: 40, y: 75 }, 18: { x: 35, y: 70 }, 19: { x: 45, y: 80 }, 20: { x: 55, y: 80 },
  21: { x: 35, y: 35 }, 22: { x: 25, y: 35 },
};

export function MapTab({ data }: MapTabProps) {
  // Count employees per region
  const regionCounts: Record<number, number> = {};
  data.forEach(e => {
    regionCounts[e.region] = (regionCounts[e.region] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(regionCounts), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Map */}
      <ChartCard title="نقشه پراکندگی پرسنل">
        <div className="relative w-full h-[400px] bg-muted/30 rounded-lg overflow-hidden">
          {/* Simple Tehran map representation */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background shape representing Tehran */}
            <path
              d="M20 25 L40 15 L70 12 L85 20 L80 45 L75 60 L65 70 L55 85 L40 88 L30 80 L25 65 L20 45 Z"
              fill="hsl(var(--chart-cyan) / 0.3)"
              stroke="hsl(var(--chart-cyan))"
              strokeWidth="0.5"
            />
            
            {/* Region markers */}
            {Object.entries(regionPositions).map(([region, pos]) => {
              const count = regionCounts[parseInt(region)] || 0;
              const size = 3 + (count / maxCount) * 5;
              const opacity = 0.4 + (count / maxCount) * 0.6;
              
              return (
                <g key={region}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size}
                    fill={`hsl(var(--chart-cyan) / ${opacity})`}
                    stroke="hsl(var(--chart-cyan))"
                    strokeWidth="0.5"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 1}
                    textAnchor="middle"
                    fontSize="3"
                    fill="hsl(var(--foreground))"
                  >
                    {region}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="absolute bottom-4 right-4 glass-card p-2 rounded text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">تعداد پرسنل در هر منطقه</span>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Employee List */}
      <ChartCard title="لیست پرسنل">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-right text-muted-foreground">منطقه</TableHead>
                <TableHead className="text-right text-muted-foreground">نام و نام خانوادگی</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.sort((a, b) => a.region - b.region).map((employee) => (
                <TableRow key={employee.id} className="border-border hover:bg-muted/50">
                  <TableCell className="text-foreground">{employee.region}</TableCell>
                  <TableCell className="text-foreground">{employee.fullName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </ChartCard>
    </div>
  );
}
