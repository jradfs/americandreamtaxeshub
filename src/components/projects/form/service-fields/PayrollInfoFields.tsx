'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PayrollInfo } from '@/types/projects';

type PayrollSchedule = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';

interface PayrollInfoFieldsProps {
  value: PayrollInfo;
  onChange: (value: PayrollInfo) => void;
}

export function PayrollInfoFields({ value, onChange }: PayrollInfoFieldsProps) {
  const handleChange = (field: keyof PayrollInfo, newValue: string | number) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Payroll Schedule</Label>
        <Select
          value={value.payroll_schedule || ''}
          onValueChange={(newValue) => handleChange('payroll_schedule', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payroll schedule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
            <SelectItem value="semi-monthly">Semi-Monthly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Employee Count</Label>
        <Input
          type="number"
          value={value.employee_count || ''}
          onChange={(e) => handleChange('employee_count', parseInt(e.target.value, 10))}
          placeholder="Number of employees"
        />
      </div>

      <div className="space-y-2">
        <Label>Last Payroll Date</Label>
        <Input
          type="date"
          value={value.last_payroll_date || ''}
          onChange={(e) => handleChange('last_payroll_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Next Payroll Date</Label>
        <Input
          type="date"
          value={value.next_payroll_date || ''}
          onChange={(e) => handleChange('next_payroll_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Payroll Provider</Label>
        <Input
          value={value.payroll_provider || ''}
          onChange={(e) => handleChange('payroll_provider', e.target.value)}
          placeholder="e.g., ADP, Paychex"
        />
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Input
          value={value.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes..."
        />
      </div>
    </div>
  );
} 