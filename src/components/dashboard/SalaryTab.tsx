import { Employee } from '@/types/employee';
import { ChartCard } from './ChartCard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, ComposedChart, Line
} from 'recharts';

interface SalaryTabProps {
  data: Employee[];
}

const COLORS = {
  cyan: '#2dd4bf',
  pink: '#f472b6',
  purple: '#a78bfa',
  orange: '#fb923c',
  yellow: '#facc15',
  green: '#22c55e',
};

export function SalaryTab({ data }: SalaryTabProps) {
  // Average salary by department
  const deptSalaries: Record<string, { total: number; count: number }> = {};
  data.forEach(e => {
    if (!deptSalaries[e.department]) {
      deptSalaries[e.department] = { total: 0, count: 0 };
    }
    deptSalaries[e.department].total += e.salary;
    deptSalaries[e.department].count++;
  });
  const deptData = Object.entries(deptSalaries).map(([name, { total, count }]) => ({
    name,
    avgSalary: Math.round(total / count),
    count,
  }));

  // Average salary by position
  const posSalaries: Record<string, { total: number; count: number }> = {};
  data.forEach(e => {
    if (!posSalaries[e.position]) {
      posSalaries[e.position] = { total: 0, count: 0 };
    }
    posSalaries[e.position].total += e.salary;
    posSalaries[e.position].count++;
  });
  const posData = Object.entries(posSalaries).map(([name, { total, count }]) => ({
    name,
    avgSalary: Math.round(total / count),
  }));

  // Average salary by gender
  const genderSalaries: Record<string, { total: number; count: number }> = {};
  data.forEach(e => {
    if (!genderSalaries[e.gender]) {
      genderSalaries[e.gender] = { total: 0, count: 0 };
    }
    genderSalaries[e.gender].total += e.salary;
    genderSalaries[e.gender].count++;
  });
  const genderData = Object.entries(genderSalaries).map(([name, { total, count }]) => ({
    name,
    avgSalary: Math.round(total / count),
    color: name === 'مرد' ? COLORS.cyan : COLORS.pink,
  }));

  // Average salary by education
  const eduSalaries: Record<string, { total: number; count: number }> = {};
  data.forEach(e => {
    if (!eduSalaries[e.education]) {
      eduSalaries[e.education] = { total: 0, count: 0 };
    }
    eduSalaries[e.education].total += e.salary;
    eduSalaries[e.education].count++;
  });
  const eduData = Object.entries(eduSalaries).map(([name, { total, count }]) => ({
    name,
    avgSalary: Math.round(total / count),
  }));

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value);
  };

  const barColors = [COLORS.pink, COLORS.cyan, COLORS.purple, COLORS.orange, COLORS.yellow, COLORS.green];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department comparison */}
        <ChartCard title="مقایسه میانگین حقوق و تعداد پرسنل در هر معاونت" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={deptData}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} angle={-30} textAnchor="end" height={70} />
              <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                formatter={(value: number, name: string) => [formatSalary(value), name === 'avgSalary' ? 'میانگین حقوق' : 'تعداد']}
              />
              <Bar yAxisId="left" dataKey="avgSalary" radius={[4, 4, 0, 0]}>
                {deptData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="count" stroke={COLORS.purple} strokeWidth={2} dot={{ fill: COLORS.purple }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Position & Gender */}
        <div className="space-y-4">
          <ChartCard title="میانگین حقوق به تفکیک جایگاه سازمانی">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={posData}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  formatter={(value: number) => [formatSalary(value), 'میانگین حقوق']}
                />
                <Bar dataKey="avgSalary" fill={COLORS.green} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="میانگین حقوق به تفکیک جنسیت">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  dataKey="avgSalary"
                  label={({ name }) => name}
                  labelLine={false}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  formatter={(value: number) => [formatSalary(value), 'میانگین حقوق']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Education */}
      <ChartCard title="میانگین حقوق به تفکیک مدرک تحصیلی">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={eduData} layout="vertical">
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={100} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              formatter={(value: number) => [formatSalary(value), 'میانگین حقوق']}
            />
            <Bar dataKey="avgSalary" radius={[0, 4, 4, 0]}>
              {eduData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
