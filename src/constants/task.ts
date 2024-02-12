import { TaskType } from '@/types';
import { generateId } from '@/utils';

export const taskDefaultValue: TaskType = {
  id: generateId(),
  title: '',
  columnId: '',
  createdAt: new Date()
};
