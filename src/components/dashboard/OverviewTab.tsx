import { Employee } from '@/types/employee';
import { KPICard } from './KPICard';
import { ChartCard } from './ChartCard';
import { PrintButton } from './PrintButton';
import { Users, Building2, Banknote, Clock } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Area, AreaChart
} from 'recharts';

interface OverviewTabProps {
  data: Employee[];
}

const COLORS = {
  cyan: '#2dd4bf',
  pink: '#f472b6',
  purple: '#a78bfa',
  orange: '#fb923c',
  yellow: '#facc15',
  green: '#22c55e',
  blue: '#3b82f6',
};

export function OverviewTab({ data }: OverviewTabProps) {
  const totalStaff = data.length;
  const departments = [...new Set(data.map(e => e.department))].length;
  const avgSalary = Math.round(data.reduce((sum, e) => sum + e.salary, 0) / totalStaff);
  const avgTenure = Math.round(data.reduce((sum, e) => sum + e.tenure, 0) / totalStaff);

  // Gender distribution
  const genderData = [
    { name: 'مرد', value: data.filter(e => e.gender === 'مرد').length, color: COLORS.cyan },
    { name: 'زن', value: data.filter(e => e.gender === 'زن').length, color: COLORS.pink },
  ];

  // Marital status
  const maritalData = [
    { name: 'متاهل', value: data.filter(e => e.maritalStatus === 'متاهل').length, color: COLORS.purple },
    { name: 'مجرد', value: data.filter(e => e.maritalStatus === 'مجرد').length, color: COLORS.orange },
  ];

  // Location distribution
  const locationData = [
    { name: 'ستاد', value: data.filter(e => e.location === 'ستاد').length, color: COLORS.cyan },
    { name: 'پروژه', value: data.filter(e => e.location === 'پروژه').length, color: COLORS.yellow },
  ];

  // Education distribution
  const educationCounts: Record<string, number> = {};
  data.forEach(e => {
    educationCounts[e.education] = (educationCounts[e.education] || 0) + 1;
  });
  const educationData = Object.entries(educationCounts).map(([name, value], i) => ({
    name,
    value,
    color: Object.values(COLORS)[i % Object.values(COLORS).length],
  }));

  // Age groups - Fixed order
  const ageGroupOrder = ['۲۰-۳۰', '۳۰-۴۰', '۴۰-۵۰', '۵۰+'];
  const ageGroupMapping: Record<string, string> = {
    '20-30': '۲۰-۳۰',
    '30-40': '۳۰-۴۰',
    '40-50': '۴۰-۵۰',
    '50+': '۵۰+',
  };
  const ageCounts: Record<string, number> = {};
  data.forEach(e => {
    if (e.ageGroup && e.ageGroup !== 'blank' && e.ageGroup !== '') {
      const persianAgeGroup = ageGroupMapping[e.ageGroup] || e.ageGroup;
      ageCounts[persianAgeGroup] = (ageCounts[persianAgeGroup] || 0) + 1;
    }
  });
  const ageData = ageGroupOrder.map(group => ({ name: group, value: ageCounts[group] || 0 }));

  // Department distribution
  const deptCounts: Record<string, number> = {};
  data.forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });
  const deptData = Object.entries(deptCounts).map(([name, value]) => ({ name, value }));

  // Position distribution
  const posCounts: Record<string, number> = {};
  data.forEach(e => {
    posCounts[e.position] = (posCounts[e.position] || 0) + 1;
  });
  const posData = Object.entries(posCounts).map(([name, value]) => ({ name, value }));

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  return (
    <div className="space-y-6 print-area">
      {/* Print Button */}
      <div className="flex justify-end">
        <PrintButton title="گزارش نمای کلی" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="تعداد معاونت" value={formatNumber(departments)} icon={Building2} color="cyan" />
        <KPICard title="تعداد پرسنل" value={formatNumber(totalStaff)} icon={Users} color="pink" />
        <KPICard title="میانگین حقوق" value={formatNumber(avgSalary)} icon={Banknote} color="green" />
        <KPICard title="میانگین سابقه کاری" value={formatNumber(avgTenure)} icon={Clock} color="purple" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChartCard title="تعداد پرسنل براساس رده سنی">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ageData}>
              <defs>
                <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="value" stroke={COLORS.cyan} fillOpacity={1} fill="url(#colorAge)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="پرسنل به تفکیک جنسیت">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="وضعیت تاهل">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={maritalData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {maritalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="محل فعالیت">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartCard title="مدرک تحصیلی">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={educationData}
                cx="50%"
                cy="40%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {educationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="توزیع پرسنل در معاونت ها">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptData} layout="vertical">
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="value" fill={COLORS.purple} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="پرسنل به تفکیک جایگاه شغلی">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={posData} layout="vertical">
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={60} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="value" fill={COLORS.pink} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
