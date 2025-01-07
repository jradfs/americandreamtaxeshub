'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaxInfo } from '@/types/projects';

interface TaxInfoFieldsProps {
  value: TaxInfo;
  onChange: (value: TaxInfo) => void;
}

export function TaxInfoFields({ value, onChange }: TaxInfoFieldsProps) {
  const handleChange = (field: keyof TaxInfo, newValue: string | number) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Return Type</Label>
        <Select
          value={value.return_type || ''}
          onValueChange={(newValue) => handleChange('return_type', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select return type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1040">1040 - Individual</SelectItem>
            <SelectItem value="1120">1120 - Corporation</SelectItem>
            <SelectItem value="1120s">1120S - S Corporation</SelectItem>
            <SelectItem value="1065">1065 - Partnership</SelectItem>
            <SelectItem value="990">990 - Non-Profit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Filing Status</Label>
        <Select
          value={value.filing_status || ''}
          onValueChange={(newValue) => handleChange('filing_status', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select filing status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married_joint">Married Filing Jointly</SelectItem>
            <SelectItem value="married_separate">Married Filing Separately</SelectItem>
            <SelectItem value="head_household">Head of Household</SelectItem>
            <SelectItem value="qualifying_widow">Qualifying Widow(er)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tax Year</Label>
        <Input
          type="number"
          value={value.tax_year || ''}
          onChange={(e) => handleChange('tax_year', parseInt(e.target.value, 10))}
          placeholder="Enter tax year"
        />
      </div>

      <div className="space-y-2">
        <Label>Due Date</Label>
        <Input
          type="date"
          value={value.due_date || ''}
          onChange={(e) => handleChange('due_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Extension Date</Label>
        <Input
          type="date"
          value={value.extension_date || ''}
          onChange={(e) => handleChange('extension_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Estimated Refund</Label>
        <Input
          type="number"
          value={value.estimated_refund || ''}
          onChange={(e) => handleChange('estimated_refund', parseFloat(e.target.value))}
          placeholder="Enter estimated refund amount"
        />
      </div>

      <div className="space-y-2">
        <Label>Estimated Liability</Label>
        <Input
          type="number"
          value={value.estimated_liability || ''}
          onChange={(e) => handleChange('estimated_liability', parseFloat(e.target.value))}
          placeholder="Enter estimated liability amount"
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