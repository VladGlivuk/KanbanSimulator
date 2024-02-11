import { FC, useMemo, useState, KeyboardEventHandler, ChangeEventHandler, BaseSyntheticEvent } from 'react';
import { useBoardContext } from '@/contexts/BoardContext';
import { TaskType, type Column } from '@/lib/types';
import Task from '@/components/Task';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities'

type Props = {
  column: Column;
  tasks: Array<TaskType>
};

const Column: FC<Props> = ({ column, column: { id, title }, tasks }) => {
  const { createTask, deleteColumn, updateColumn } = useBoardContext();

  const [isEditMode, setIsEditMode] = useState(false)

  const {setNodeRef, attributes, listeners, transform, transition} = useSortable({
    id,
    data: {
      type: "column",
      column,
    },
    disabled: isEditMode,
  })

  const [inputValue, setInputValue] = useState(title);

  const [isEditing, setIsEditing] = useState(!title);

  const tasksIds = useMemo(() => tasks.map(({id}) => id), [tasks])

  const toggleEditing = () => setIsEditing(!isEditing)

  const inputChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newTitle = e.target.value;
    setInputValue(newTitle);
  };

  const inputKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && inputValue) {
        updateColumn(id, inputValue);
        setInputValue('')
        toggleEditing();
    }
  };

  const inputBlurHandler = () => {
    if (inputValue) {
     toggleEditing();
    updateColumn(id, inputValue);
    }
  };

  const createTaskButtonClickHandler = () => createTask(id);

  const deleteColumnButtonClickHandler = () => deleteColumn(id);

  const columnClickHandler = () => {
    setIsEditMode((prev) => !prev);
  }

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div className='h-full w-96 rounded-md bg-secondary py-2 flex flex-col gap-2 flex-shrink-0' ref={setNodeRef}  style={style} {...attributes} {...listeners}  onClick={columnClickHandler} >
      <div className='flex gap-2 px-2' >
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
        {tasks.map((task) => (
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
