import { FilterState } from '@/types/employee';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  options: {
    genders: string[];
    educations: string[];
    departments: string[];
    locations: string[];
    positions: string[];
  };
}

export function FilterBar({ filters, onFilterChange, options }: FilterBarProps) {
  return (
    <div className="glass-card rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-sm text-muted-foreground font-nazanin font-semibold">جنسیت</label>
          <Select
            value={filters.gender}
            onValueChange={(value) => onFilterChange('gender', value)}
          >
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">همه</SelectItem>
              {options.genders.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-sm text-muted-foreground font-nazanin font-semibold">تحصیلات</label>
          <Select
            value={filters.education}
            onValueChange={(value) => onFilterChange('education', value)}
          >
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">همه</SelectItem>
              {options.educations.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-sm text-muted-foreground font-nazanin font-semibold">معاونت</label>
          <Select
            value={filters.department}
            onValueChange={(value) => onFilterChange('department', value)}
          >
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">همه</SelectItem>
              {options.departments.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-sm text-muted-foreground font-nazanin font-semibold">محل فعالیت</label>
          <Select
            value={filters.location}
            onValueChange={(value) => onFilterChange('location', value)}
          >
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">همه</SelectItem>
              {options.locations.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-sm text-muted-foreground font-nazanin font-semibold">جایگاه سازمانی</label>
          <Select
            value={filters.position}
            onValueChange={(value) => onFilterChange('position', value)}
          >
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">همه</SelectItem>
              {options.positions.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
