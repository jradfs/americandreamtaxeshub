'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccountingInfo } from '@/types/projects';

interface AccountingInfoFieldsProps {
  value: AccountingInfo;
  onChange: (value: AccountingInfo) => void;
}

export function AccountingInfoFields({ value, onChange }: AccountingInfoFieldsProps) {
  const handleChange = (field: keyof AccountingInfo, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Period Start</Label>
          <Input
            type="date"
            value={value.period_start || ''}
            onChange={(e) => handleChange('period_start', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Period End</Label>
          <Input
            type="date"
            value={value.period_end || ''}
            onChange={(e) => handleChange('period_end', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Accounting Method</Label>
        <Select
          value={value.accounting_method || ''}
          onValueChange={(newValue) => handleChange('accounting_method', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select accounting method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="accrual">Accrual</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Fiscal Year End</Label>
        <Input
          type="date"
          value={value.fiscal_year_end || ''}
          onChange={(e) => handleChange('fiscal_year_end', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Last Reconciliation Date</Label>
        <Input
          type="date"
          value={value.last_reconciliation_date || ''}
          onChange={(e) => handleChange('last_reconciliation_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Software Used</Label>
        <Input
          value={value.software_used || ''}
          onChange={(e) => handleChange('software_used', e.target.value)}
          placeholder="e.g., QuickBooks Online"
        />
      </div>

      <div className="space-y-2">
        <Label>Frequency</Label>
        <Select
          value={value.frequency || ''}
          onValueChange={(newValue) => handleChange('frequency', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
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