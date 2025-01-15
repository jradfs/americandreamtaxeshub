'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ServiceType } from '@/types/projects';

interface ServiceTypeSelectProps {
  id?: string;
  value: ServiceType;
  onChange: (value: ServiceType) => void;
}

export function ServiceTypeSelect({ id, value, onChange }: ServiceTypeSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Select service type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="tax_return">Tax Return</SelectItem>
        <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
        <SelectItem value="payroll">Payroll</SelectItem>
        <SelectItem value="advisory">Advisory</SelectItem>
      </SelectContent>
    </Select>
  );
} 