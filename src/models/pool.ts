import { User } from './user';

export interface Pool {
  id: string;
  title: string;
  code: string;
  createdAt: Date;
  ownerId?: string;
  owner?: User;
}
