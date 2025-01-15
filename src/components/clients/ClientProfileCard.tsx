import { Client } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ClientProfileCardProps {
  client: Client;
}

export function ClientProfileCard({ client }: ClientProfileCardProps) {
  if (!client) {
    return null;
  }

  const safeClient = {
    fullName: client?.fullName || 'Unknown Client',
    companyName: client?.companyName || '',
    email: client?.email || 'No email provided',
    phone: client?.phone || 'No phone provided',
    address: client?.address || 'No address provided'
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={client?.avatarUrl || ''} />
          <AvatarFallback>{safeClient.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{safeClient.fullName}</h2>
          <p className="text-sm text-muted-foreground">{safeClient.companyName}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">Contact Information</p>
          <div className="text-sm text-muted-foreground">
            <p>{safeClient.email}</p>
            <p>{safeClient.phone}</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Billing Address</p>
          <div className="text-sm text-muted-foreground">
            <p>{safeClient.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
