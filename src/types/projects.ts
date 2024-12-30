import { Tables } from 'types/database.types';

export interface ProjectWithRelations extends Tables<'projects'> {
  client?: Tables<'clients'>;
  tasks?: Tables<'tasks'>[];
}
