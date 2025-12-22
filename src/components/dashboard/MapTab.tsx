import { useState } from 'react';
import { Employee } from '@/types/employee';
import { ChartCard } from './ChartCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Users } from 'lucide-react';

interface MapTabProps {
  data: Employee[];
}

// Tehran districts SVG paths (simplified representation of 22 districts)
const tehranDistricts: Record<number, { path: string; labelX: number; labelY: number }> = {
  1: { path: "M280,20 L320,15 L350,30 L340,60 L300,70 L270,50 Z", labelX: 305, labelY: 45 },
  2: { path: "M220,25 L270,20 L280,20 L270,50 L240,60 L210,45 Z", labelX: 240, labelY: 40 },
  3: { path: "M160,30 L210,25 L220,25 L210,45 L180,55 L150,45 Z", labelX: 180, labelY: 42 },
  4: { path: "M300,70 L340,60 L360,80 L350,120 L310,130 L280,100 Z", labelX: 320, labelY: 95 },
  5: { path: "M80,50 L150,45 L160,30 L150,45 L140,80 L100,90 L70,70 Z", labelX: 110, labelY: 65 },
  6: { path: "M150,100 L180,90 L210,100 L200,140 L160,145 L140,120 Z", labelX: 175, labelY: 120 },
  7: { path: "M200,100 L240,95 L260,110 L250,150 L210,155 L200,140 Z", labelX: 228, labelY: 125 },
  8: { path: "M250,110 L280,100 L310,130 L290,170 L260,165 L250,150 Z", labelX: 275, labelY: 140 },
  9: { path: "M70,120 L100,110 L120,130 L110,170 L80,175 L60,150 Z", labelX: 90, labelY: 145 },
  10: { path: "M110,130 L140,120 L160,145 L150,180 L120,185 L110,170 Z", labelX: 135, labelY: 155 },
  11: { path: "M150,145 L180,140 L200,155 L190,190 L160,195 L150,180 Z", labelX: 175, labelY: 170 },
  12: { path: "M190,150 L220,145 L240,160 L230,195 L200,200 L190,190 Z", labelX: 215, labelY: 175 },
  13: { path: "M240,155 L270,150 L290,170 L280,205 L250,210 L240,195 Z", labelX: 265, labelY: 180 },
  14: { path: "M220,195 L250,190 L260,210 L250,245 L220,250 L210,230 Z", labelX: 235, labelY: 220 },
  15: { path: "M250,210 L280,205 L300,225 L290,260 L260,265 L250,245 Z", labelX: 275, labelY: 235 },
  16: { path: "M150,195 L190,190 L200,210 L190,250 L160,255 L150,230 Z", labelX: 175, labelY: 222 },
  17: { path: "M110,200 L150,195 L160,220 L150,260 L120,265 L100,240 Z", labelX: 130, labelY: 230 },
  18: { path: "M60,180 L100,175 L110,200 L100,250 L70,260 L50,220 Z", labelX: 80, labelY: 215 },
  19: { path: "M100,260 L150,255 L160,280 L140,310 L100,315 L85,290 Z", labelX: 125, labelY: 285 },
  20: { path: "M150,260 L200,255 L210,280 L190,315 L150,320 L140,310 Z", labelX: 175, labelY: 290 },
  21: { path: "M30,100 L70,90 L80,120 L70,160 L40,170 L20,140 Z", labelX: 50, labelY: 130 },
  22: { path: "M20,160 L50,150 L60,180 L50,220 L30,230 L10,200 Z", labelX: 35, labelY: 190 },
};

export function MapTab({ data }: MapTabProps) {
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  // Count employees per region
  const regionCounts: Record<number, number> = {};
  data.forEach(e => {
    regionCounts[e.region] = (regionCounts[e.region] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(regionCounts), 1);

  // Filter employees by selected region
  const filteredEmployees = selectedRegion
    ? data.filter(e => e.region === selectedRegion)
    : data;

  const getRegionColor = (region: number) => {
    const count = regionCounts[region] || 0;
    const intensity = 0.3 + (count / maxCount) * 0.7;
    return `hsl(var(--chart-cyan) / ${intensity})`;
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" dir="rtl">
      {/* Employee List - Now on the right in RTL */}
      <ChartCard title={selectedRegion ? `لیست پرسنل منطقه ${formatNumber(selectedRegion)}` : "لیست تمام پرسنل"}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="font-nazanin text-base">تعداد: {formatNumber(filteredEmployees.length)} نفر</span>
          </div>
          {selectedRegion && (
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-sm text-primary hover:text-primary/80 font-iransans"
            >
              نمایش همه
            </button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-right text-foreground font-nazanin text-base">منطقه</TableHead>
                <TableHead className="text-right text-foreground font-nazanin text-base">نام و نام خانوادگی</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.sort((a, b) => a.region - b.region).map((employee) => (
                <TableRow key={employee.id} className="border-border hover:bg-muted/50">
                  <TableCell className="text-foreground font-iransans text-base">{formatNumber(employee.region)}</TableCell>
                  <TableCell className="text-foreground font-iransans text-base">{employee.fullName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </ChartCard>

      {/* Map - Now on the left in RTL */}
      <ChartCard title="نقشه پراکندگی پرسنل در مناطق تهران">
        <div className="relative w-full h-[400px] bg-muted/20 rounded-lg overflow-hidden">
          <svg viewBox="0 0 380 340" className="w-full h-full">
            {/* Districts */}
            {Object.entries(tehranDistricts).map(([region, { path, labelX, labelY }]) => {
              const regionNum = parseInt(region);
              const count = regionCounts[regionNum] || 0;
              const isSelected = selectedRegion === regionNum;
              
              return (
                <g key={region} className="cursor-pointer" onClick={() => setSelectedRegion(regionNum)}>
                  <path
                    d={path}
                    fill={getRegionColor(regionNum)}
                    stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                  {/* Region number */}
                  <text
                    x={labelX}
                    y={labelY - 8}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="hsl(var(--foreground))"
                    className="pointer-events-none"
                  >
                    {formatNumber(regionNum)}
                  </text>
                  {/* Employee count */}
                  <text
                    x={labelX}
                    y={labelY + 8}
                    textAnchor="middle"
                    fontSize="12"
                    fill="hsl(var(--muted-foreground))"
                    className="pointer-events-none"
                  >
                    ({formatNumber(count)} نفر)
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-card p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-foreground font-nazanin text-sm">راهنما</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--chart-cyan) / 0.3)' }}></div>
                <span className="text-muted-foreground font-iransans">کم</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--chart-cyan) / 0.7)' }}></div>
                <span className="text-muted-foreground font-iransans">متوسط</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--chart-cyan) / 1)' }}></div>
                <span className="text-muted-foreground font-iransans">زیاد</span>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
