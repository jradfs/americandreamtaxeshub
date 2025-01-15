import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSupabase } from '@/hooks/useSupabase';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { TaxReturn, Client } from '@/lib/supabase/schema';

export function ReturnManager() {
  const { data: returns, error: returnsError, mutate: mutateReturns } = useSupabase('tax_returns');
  const { data: clients } = useSupabase('clients');
  const { toast } = useToast();
  const [isAddingReturn, setIsAddingReturn] = useState(false);

  const addReturn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const clientId = formData.get('clientId') as string;
    const client = clients?.find(c => c.id === clientId);

    if (!client) return;

    const newReturn = {
      client_id: clientId,
      client_name: client.name,
      type: formData.get('type') as string,
      tax_year: parseInt(formData.get('year') as string),
      status: 'pending' as const,
      due_date: formData.get('dueDate') as string,
    };

    try {
      const { data, error } = await supabase
        .from('tax_returns')
        .insert([newReturn])
        .select()
        .single();

      if (error) throw error;

      mutateReturns();
      setIsAddingReturn(false);
      toast({
        title: 'Success',
        description: 'Tax return created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create tax return',
        variant: 'destructive',
      });
    }
  };

  if (returnsError) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Failed to load tax returns
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Tax Returns</CardTitle>
        <Dialog open={isAddingReturn} onOpenChange={setIsAddingReturn}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Return
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Tax Return</DialogTitle>
            </DialogHeader>
            <form onSubmit={addReturn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <Select name="clientId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Return Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1040">1040 Individual</SelectItem>
                    <SelectItem value="1120">1120 Corporate</SelectItem>
                    <SelectItem value="1065">1065 Partnership</SelectItem>
                    <SelectItem value="990">990 Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Tax Year</Label>
                <Input 
                  id="year" 
                  name="year" 
                  type="number" 
                  defaultValue={new Date().getFullYear() - 1}
                  min={new Date().getFullYear() - 7}
                  max={new Date().getFullYear()}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  name="dueDate" 
                  type="date" 
                  required 
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingReturn(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Return</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!returns ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : returns.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No tax returns found
            </p>
          ) : (
            returns.map((taxReturn) => (
              <div
                key={taxReturn.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{taxReturn.client_name}</p>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      {taxReturn.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due {new Date(taxReturn.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    {
                      pending: 'bg-yellow-100 text-yellow-700',
                      in_progress: 'bg-blue-100 text-blue-700',
                      review: 'bg-purple-100 text-purple-700',
                      completed: 'bg-green-100 text-green-700',
                    }[taxReturn.status]
                  }`}>
                    {taxReturn.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 