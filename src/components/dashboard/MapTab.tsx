import { useState } from 'react';
import { Employee } from '@/types/employee';
import { ChartCard } from './ChartCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';
import tehranMap from '@/assets/tehran-map.png';

interface MapTabProps {
  data: Employee[];
}

// Position and click areas for each region on the map image (percentage-based, calibrated to actual map)
const regionClickAreas: Record<number, { x: number; y: number; width: number; height: number }> = {
  1: { x: 68, y: 4, width: 11, height: 14 },
  2: { x: 48, y: 8, width: 10, height: 12 },
  3: { x: 38, y: 6, width: 10, height: 14 },
  4: { x: 76, y: 16, width: 12, height: 18 },
  5: { x: 26, y: 6, width: 12, height: 14 },
  6: { x: 46, y: 20, width: 10, height: 14 },
  7: { x: 54, y: 20, width: 10, height: 14 },
  8: { x: 66, y: 28, width: 12, height: 16 },
  9: { x: 28, y: 30, width: 9, height: 12 },
  10: { x: 37, y: 30, width: 9, height: 12 },
  11: { x: 46, y: 34, width: 10, height: 12 },
  12: { x: 54, y: 36, width: 10, height: 14 },
  13: { x: 66, y: 42, width: 12, height: 16 },
  14: { x: 66, y: 56, width: 12, height: 18 },
  15: { x: 54, y: 58, width: 12, height: 18 },
  16: { x: 44, y: 50, width: 10, height: 14 },
  17: { x: 32, y: 46, width: 12, height: 16 },
  18: { x: 18, y: 38, width: 14, height: 22 },
  19: { x: 32, y: 62, width: 12, height: 18 },
  20: { x: 44, y: 72, width: 12, height: 16 },
  21: { x: 14, y: 18, width: 14, height: 18 },
  22: { x: 6, y: 4, width: 10, height: 20 },
};

export function MapTab({ data }: MapTabProps) {
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  // Count employees per region
  const regionCounts: Record<number, number> = {};
  data.forEach(e => {
    regionCounts[e.region] = (regionCounts[e.region] || 0) + 1;
  });

  // Filter employees by selected region
  const filteredEmployees = selectedRegion
    ? data.filter(e => e.region === selectedRegion)
    : data;

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
        <div className="relative w-full h-[450px] rounded-lg overflow-hidden flex items-center justify-center">
          {/* Tehran Map Image */}
          <div className="relative">
            <img 
              src={tehranMap} 
              alt="نقشه مناطق تهران" 
              className="max-h-[420px] w-auto object-contain"
            />
            
            {/* Clickable overlay areas for each region */}
            <div className="absolute inset-0">
              {Object.entries(regionClickAreas).map(([region, area]) => {
                const regionNum = parseInt(region);
                const count = regionCounts[regionNum] || 0;
                const isSelected = selectedRegion === regionNum;
                
                return (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(regionNum)}
                    className={`absolute flex items-center justify-center transition-all duration-200 rounded-md ${
                      isSelected 
                        ? 'bg-primary/40 ring-2 ring-primary' 
                        : 'hover:bg-primary/20'
                    }`}
                    style={{
                      left: `${area.x}%`,
                      top: `${area.y}%`,
                      width: `${area.width}%`,
                      height: `${area.height}%`,
                    }}
                    title={`منطقه ${formatNumber(regionNum)} - ${formatNumber(count)} نفر`}
                  >
                    <span className={`font-iransans text-xs font-bold px-1 py-0.5 rounded ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background/80 text-foreground'
                    }`}>
                      {formatNumber(count)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
            <span className="text-foreground font-nazanin text-sm">برای مشاهده لیست پرسنل روی هر منطقه کلیک کنید</span>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
