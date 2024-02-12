import { FC, useMemo, useState, KeyboardEventHandler, ChangeEventHandler } from 'react';
import { TaskType, type ColumnType } from '@/types';
import Task from '@/components/Task';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_Columns, ALL_Tasks } from '@/apollo/queries';
import Spinner from '@/components/ui/Spinner';
import { CREATE_TASK, DELETE_COLUMN, UPDATE_COLUMN } from '@/apollo/mutations';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortContext } from '@/context';
import { ASCENDING } from '@/constants';

type Props = {
  column: ColumnType;
};

const Column: FC<Props> = ({ column, column: { id, title } }) => {
  const [inputValue, setInputValue] = useState<string>(title);
  const [isEditing, setIsEditing] = useState<boolean>(!title);

  const { sortValue } = useSortContext();

  const { loading, data, refetch: refetchTasks } = useQuery<{ allTasks: Array<TaskType> }>(ALL_Tasks);
  const { refetch: refetchColumns } = useQuery<{ allColumns: Array<ColumnType> }>(ALL_Columns);

  const [deleteColumnMutation] = useMutation(DELETE_COLUMN);
  const [updateColumnMutation] = useMutation(UPDATE_COLUMN);
  const [createTaskMutation] = useMutation(CREATE_TASK);

  const deleteColumnButtonClickHandler = async () => {
    try {
      await deleteColumnMutation({ variables: { id } });
      refetchColumns();
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const updateColumn = async (id: string, title: string) => {
    try {
      await updateColumnMutation({ variables: { id, title } });
      refetchColumns();
    } catch (error) {
      console.error('Error updating column:', error);
    }
  };

  const createTaskButtonClickHandler = async () => {
    try {
      await createTaskMutation({ variables: { id, columnId: id, title: `task ${data?.allTasks.length || 1 + 1}`, createdAt: new Date() } });
      refetchColumns();
      refetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id,
    data: {
      type: 'column',
      column,
    },
    disabled: isEditMode,
  });

  const sortedTasks = useMemo(() => {
    if (!data?.allTasks) return [];
    const newTasks = structuredClone(data?.allTasks);

    if (sortValue === ASCENDING) {
      return newTasks?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else return newTasks?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [sortValue, data?.allTasks]);

  const columnTasks = useMemo(() => sortedTasks?.filter((task) => task.columnId === id), [sortedTasks, id]);

  const tasksIds = useMemo(() => (columnTasks ? columnTasks?.map(({ id }) => id) : []), [columnTasks]);

  const toggleEditing = () => setIsEditing(!isEditing);

  const inputChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newTitle = e.target.value;
    setInputValue(newTitle);
  };

  const inputKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && inputValue) {
      updateColumn(id, inputValue);
      setInputValue('');
      toggleEditing();
    }
  };

  const inputBlurHandler = () => {
    if (inputValue) {
      toggleEditing();
      updateColumn(id, inputValue);
    }
  };

  const columnClickHandler = () => {
    setIsEditMode((prev) => !prev);
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div
      className='h-full w-96 rounded-md bg-secondary py-2 flex flex-col gap-2 flex-shrink-0'
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={columnClickHandler}
    >
      <div className='flex gap-2 px-2'>
        <div className='flex-grow'>
          {isEditing ? (
            <Input
              value={inputValue}
              onChange={inputChangeHandler}
              onBlur={inputBlurHandler}
              onKeyDown={inputKeyDownHandler}
              placeholder='Column title'
              autoFocus
            />
          ) : (
            <div onClick={toggleEditing} className='w-fit h-full hover:cursor-pointer hover:text-primary font-semibold'>
              {title}
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-2 overflow-y-auto px-2 flex-grow'>
        <SortableContext items={tasksIds}>
          {columnTasks?.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      <div className='px-2 flex justify-between'>
        <Button variant='destructive' onClick={deleteColumnButtonClickHandler}>
          Delete column
        </Button>

        <Button onClick={createTaskButtonClickHandler}>Create task</Button>
      </div>
    </div>
  );
};

export default Column;
