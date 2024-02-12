import { FC, useState, ChangeEventHandler, KeyboardEventHandler } from "react"
import {type TaskType, ColumnType} from "@/types"
import TrashIcon from "@/assets/TrashIcon"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import {useMutation, useQuery} from "@apollo/client";
import {ALL_Columns, ALL_Tasks} from "@/apollo/queries";
import {DELETE_TASK, UPDATE_TASK} from "@/apollo/mutations";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/utils';

type Props = {
    task: TaskType
}

const Task: FC<Props> = ({ task, task: { id, title } }) => {
    const { refetch: refetchTasks} = useQuery<{ allTasks: Array<TaskType> }>(ALL_Tasks);
    const { refetch: refetchColumns } = useQuery<{ allColumns: Array<ColumnType> }>(ALL_Columns);

    const [updateTaskMutation] = useMutation(UPDATE_TASK);
    const [deleteTaskMutation] = useMutation(DELETE_TASK);

    const updateTask = async (id: string, title: string) => {
        try {
            await updateTaskMutation({ variables: { id, title } });
            refetchColumns();
            refetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const deleteTaskButtonClickHandler = async () => {
        try {
            await deleteTaskMutation({ variables: { id } });
            refetchColumns();
            refetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
  
    const { setNodeRef, transition, transform, attributes, listeners } = useSortable({
      id,
      data: {
        type: "task",
        task,
      },
      disabled: isEditMode,
    });
  
    const toggleEditing = () => setIsEditMode((prevValue) => !prevValue)
  
    const inputChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
      const newTitle = e.target.value;
      updateTask(id, newTitle);
    };
  
    const inputKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (e.key === 'Enter') {
        toggleEditing();
      }
    };
  
    const inputBlurHandler = () => toggleEditing();
  
    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    };
  
    // if (isDragging) {
    //   return (
    //     <div
    //       ref={setNodeRef}
    //       style={style}
    //       className={cn('rounded-md bg-background p-2 relative flex gap-2', {
    //         'border-red-700 border': mouseIsOver})}
    //     />
    //   );
    // }
  
    if (isEditMode) {
      return (
        <div className={cn('rounded-md bg-background p-2 relative flex gap-2', {
          'border-red-700 border': mouseIsOver,
        })} ref={setNodeRef} {...attributes} {...listeners} style={style} >
          <div className='flex-grow'>
              <Input
                value={title}
                onChange={inputChangeHandler}
                onBlur={inputBlurHandler}
                onKeyDown={inputKeyDownHandler}
                placeholder='Task title'
                autoFocus
              />
          </div>
  
          <Button variant='outline' size='icon' onClick={deleteTaskButtonClickHandler} className='flex-shrink-0'>
            <TrashIcon />
          </Button>
        </div>
      );
    }
  
    return (
      <div
      onClick={toggleEditing}
        className={cn('rounded-md bg-background p-2 relative flex gap-2', {
          'border-red-700 border': mouseIsOver,
        })}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        onMouseEnter={() => {
            setMouseIsOver(true);
        }}
        onMouseLeave={() => {
          setMouseIsOver(false);
        }}
      >
        <div className='flex-grow'>
            <div onClick={toggleEditing} className='w-fit h-full hover:cursor-pointer hover:text-primary'>
              {title}
            </div>
        </div>
  
       {mouseIsOver && <Button variant='outline' size='icon' onClick={deleteTaskButtonClickHandler} className='flex-shrink-0'>
          <TrashIcon />
        </Button>}
      </div>
    );
}

export default Task


