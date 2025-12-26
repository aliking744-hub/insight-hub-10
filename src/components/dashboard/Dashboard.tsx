import { useState, useMemo } from 'react';
import { Employee, FilterState, TabType } from '@/types/employee';
import { FilterBar } from './FilterBar';
import { OverviewTab } from './OverviewTab';
import { BirthdaysTab } from './BirthdaysTab';
import { SalaryTab } from './SalaryTab';
import { MapTab } from './MapTab';
import { ProfileTab } from './ProfileTab';
import { OvertimeTab } from './OvertimeTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Cake, Banknote, MapPin, User, Clock, ArrowRight } from 'lucide-react';
import logoLight from '@/assets/logo-light.png';
import logoDark from '@/assets/logo-dark.png';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
interface DashboardProps {
  data: Employee[];
  onLogout: () => void;
}

export function Dashboard({ data, onLogout }: DashboardProps) {
  const { theme } = useTheme();
  const [filters, setFilters] = useState<FilterState>({
    gender: [],
    education: [],
    department: [],
    location: [],
    position: [],
  });

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Get unique values for filters
  const filterOptions = useMemo(() => ({
    genders: [...new Set(data.map(e => e.gender))],
    educations: [...new Set(data.map(e => e.education))].filter(Boolean),
    departments: [...new Set(data.map(e => e.department))].filter(Boolean),
    locations: [...new Set(data.map(e => e.location))].filter(Boolean),
    positions: [...new Set(data.map(e => e.position))].filter(Boolean),
  }), [data]);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return data.filter(e => {
      if (filters.gender.length > 0 && !filters.gender.includes(e.gender)) return false;
      if (filters.education.length > 0 && !filters.education.includes(e.education)) return false;
      if (filters.department.length > 0 && !filters.department.includes(e.department)) return false;
      if (filters.location.length > 0 && !filters.location.includes(e.location)) return false;
      if (filters.position.length > 0 && !filters.position.includes(e.position)) return false;
      return true;
    });
  }, [data, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'نمای کلی', icon: LayoutDashboard },
    { id: 'birthdays' as TabType, label: 'تولدها', icon: Cake },
    { id: 'salary' as TabType, label: 'حقوق', icon: Banknote },
    { id: 'map' as TabType, label: 'نقشه', icon: MapPin },
    { id: 'profile' as TabType, label: 'پروفایل', icon: User },
    { id: 'overtime' as TabType, label: 'اضافه کار', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background p-3 md:p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 blur-xl opacity-50 bg-primary/30 rounded-full animate-pulse" />
            <img 
              src={theme === 'light' ? logoDark : logoLight}
              alt="hring logo" 
              className="h-8 md:h-12 w-auto animate-pulse-glow relative z-10"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-afarin gradient-text">داشبورد منابع انسانی</h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-1 font-nazanin hidden sm:block">تحلیل و گزارش‌گیری اطلاعات پرسنلی</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2 font-iransans text-sm">
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">بازگشت</span>
          </Button>
          <Button variant="outline" onClick={onLogout} className="gap-2 font-iransans text-sm">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">خروج</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        options={filterOptions}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="space-y-6">
        <TabsList className="glass-card p-1 h-auto flex flex-wrap gap-1 justify-center">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 px-4 py-2 font-iransans"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <OverviewTab data={filteredData} />
        </TabsContent>

        <TabsContent value="birthdays" className="mt-0">
          <BirthdaysTab data={filteredData} />
        </TabsContent>

        <TabsContent value="salary" className="mt-0">
          <SalaryTab data={filteredData} />
        </TabsContent>

        <TabsContent value="map" className="mt-0">
          <MapTab data={filteredData} />
        </TabsContent>

        <TabsContent value="profile" className="mt-0">
          <ProfileTab data={filteredData} />
        </TabsContent>

        <TabsContent value="overtime" className="mt-0">
          <OvertimeTab data={filteredData} />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>تعداد رکوردهای نمایش داده شده: {filteredData.length} از {data.length}</p>
      </div>
    </div>
  );
}
