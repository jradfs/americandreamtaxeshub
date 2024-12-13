'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'comment' | 'status_change' | 'assignment' | 'system';
  content: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
}

interface TaskActivityProps {
  taskId: string;
  activities: ActivityItem[];
  onAddComment: (taskId: string, comment: string) => void;
}

export function TaskActivity({ taskId, activities, onAddComment }: TaskActivityProps) {
  const [comment, setComment] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(taskId, comment);
      setComment('');
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'status_change':
        return '🔄';
      case 'assignment':
        return '👤';
      case 'system':
        return '🔔';
      default:
        return '💬';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/current-user-avatar.jpg" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <form onSubmit={handleSubmitComment} className="flex-1">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[100px]"
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={!comment.trim()}>
              Add Comment
            </Button>
          </div>
        </form>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {activity.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                  <span>{getActivityIcon(activity.type)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
