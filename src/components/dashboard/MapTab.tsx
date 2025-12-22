import { useState } from 'react';
import { Employee } from '@/types/employee';
import { ChartCard } from './ChartCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Users } from 'lucide-react';

interface MapTabProps {
  data: Employee[];
}

// Tehran districts SVG paths - accurate representation based on municipal map
const tehranDistricts: Record<number, { path: string; labelX: number; labelY: number }> = {
  1: { path: "M320,10 L380,15 L400,40 L410,80 L380,100 L340,90 L310,60 L300,30 Z", labelX: 355, labelY: 55 },
  2: { path: "M240,25 L280,20 L300,30 L310,60 L280,80 L250,75 L230,50 Z", labelX: 265, labelY: 50 },
  3: { path: "M180,30 L230,25 L240,25 L230,50 L220,75 L190,80 L170,55 Z", labelX: 200, labelY: 52 },
  4: { path: "M380,100 L410,80 L440,100 L450,150 L420,180 L380,170 L360,130 Z", labelX: 405, labelY: 135 },
  5: { path: "M100,35 L160,30 L180,30 L170,55 L160,85 L110,95 L80,65 Z", labelX: 130, labelY: 62 },
  6: { path: "M190,80 L220,75 L250,75 L260,110 L240,140 L200,145 L180,115 Z", labelX: 218, labelY: 110 },
  7: { path: "M260,110 L280,80 L340,90 L360,130 L340,165 L290,170 L260,145 Z", labelX: 305, labelY: 130 },
  8: { path: "M340,165 L360,130 L380,170 L420,180 L400,220 L360,225 L330,200 Z", labelX: 370, labelY: 185 },
  9: { path: "M110,120 L150,115 L170,145 L160,180 L120,190 L95,160 Z", labelX: 135, labelY: 152 },
  10: { path: "M150,115 L180,115 L200,145 L190,185 L160,180 L150,145 Z", labelX: 175, labelY: 150 },
  11: { path: "M190,145 L240,140 L260,145 L255,190 L210,195 L190,185 Z", labelX: 225, labelY: 168 },
  12: { path: "M255,145 L290,155 L310,175 L300,215 L260,220 L255,190 Z", labelX: 280, labelY: 182 },
  13: { path: "M310,175 L330,200 L360,225 L340,265 L300,260 L300,215 Z", labelX: 325, labelY: 225 },
  14: { path: "M300,260 L340,265 L360,300 L330,340 L290,330 L280,290 Z", labelX: 318, labelY: 300 },
  15: { path: "M240,270 L280,265 L290,330 L260,360 L220,350 L220,300 Z", labelX: 255, labelY: 310 },
  16: { path: "M190,235 L255,220 L260,265 L240,270 L220,300 L185,280 Z", labelX: 220, labelY: 255 },
  17: { path: "M120,210 L170,200 L190,235 L185,280 L140,295 L110,260 Z", labelX: 150, labelY: 248 },
  18: { path: "M50,150 L95,145 L110,180 L120,210 L110,260 L70,275 L40,230 Z", labelX: 80, labelY: 210 },
  19: { path: "M110,290 L140,295 L185,280 L190,330 L160,365 L120,360 L100,320 Z", labelX: 145, labelY: 325 },
  20: { path: "M160,365 L190,330 L220,350 L230,390 L190,410 L160,395 Z", labelX: 195, labelY: 368 },
  21: { path: "M20,80 L80,65 L110,95 L110,120 L95,160 L50,150 L25,120 Z", labelX: 68, labelY: 115 },
  22: { path: "M10,120 L25,80 L20,80 L25,120 L50,150 L40,230 L15,200 Z", labelX: 32, labelY: 165 },
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
        <div className="relative w-full h-[450px] bg-muted/20 rounded-lg overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 460 420" className="w-full h-full max-w-[450px]">
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
                    stroke={isSelected ? "hsl(var(--primary))" : "hsl(200, 40%, 30%)"}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                  {/* Region number and count */}
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="bold"
                    fill="hsl(var(--foreground))"
                    className="pointer-events-none font-iransans"
                  >
                    {formatNumber(regionNum)} ({formatNumber(count)})
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
