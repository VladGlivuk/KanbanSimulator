import { TaskType } from '@/lib/types';
import { generateId } from '@/lib/utils';

export const taskDefaultValue: TaskType = {
  id: generateId(),
  title: '',
  columnId: '',
};
