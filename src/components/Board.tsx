import { FC, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { ColumnType, TaskType } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_Columns, ALL_Tasks } from '@/apollo/queries';
import Column from './Column';
import Task from './Task';
import { CREATE_COLUMN, CREATE_TASK, DELETE_COLUMN, DELETE_TASK } from '@/apollo/mutations';

const Board: FC = () => {
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const [createColumnMutation] = useMutation(CREATE_COLUMN);
  const [deleteColumnMutation] = useMutation(DELETE_COLUMN);
  const [createTaskMutation] = useMutation(CREATE_TASK);
  const [deleteTaskMutation] = useMutation(DELETE_TASK);

  const { refetch: refetchColumns } = useQuery<{ allColumns: Array<ColumnType> }>(ALL_Columns);
  const { data, refetch: refetchTasks } = useQuery<{ allTasks: Array<TaskType> }>(ALL_Tasks);

  const deleteTaskButtonClickHandler = async (id: string) => {
    try {
      await deleteTaskMutation({ variables: { id } });
      refetchColumns();
      refetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const createTaskButtonClickHandler = async (id: string, columnId: string, createdAt: Date, title: string) => {
    try {
      await createTaskMutation({ variables: { id, columnId, title, createdAt } });
      refetchColumns();
      refetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteColumnHandler = async (id: string) => {
    try {
      await deleteColumnMutation({ variables: { id } });
      refetchColumns();
      refetchTasks();
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const createColumnButtonClickHandler = async (title: string) => {
    try {
      await createColumnMutation({ variables: { id: crypto.randomUUID(), title } });
      refetchColumns();
      refetchTasks();
    } catch (error) {
      console.error('Error creating column:', error);
    }
  };

  const { data: columns } = useQuery<{ allColumns: Array<ColumnType> }>(ALL_Columns);

  const columnsIds = useMemo(() => (columns ? columns?.allColumns.map(({ id }) => id) : []), [columns?.allColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { current } = event.active.data;

    if (current?.type === 'column') {
      setActiveColumn(current.column);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'column';
    if (!isActiveAColumn) return;

    const activeColumnIndex = columns?.allColumns.findIndex((col) => col.id === activeId);

    const overColumnIndex = columns?.allColumns.findIndex((col) => col.id === overId);

    if (columns?.allColumns && activeColumnIndex && overColumnIndex) {
      const newColumns = arrayMove(columns?.allColumns, activeColumnIndex, overColumnIndex);

      columns?.allColumns.map(async ({ id }) => await deleteColumnHandler(id));

      newColumns.map(async ({ title }) => await createColumnButtonClickHandler(title));
    }
  };

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'task';
    const isOverATask = over.data.current?.type === 'task';

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      const activeIndex = data?.allTasks.findIndex((task) => task.id === activeId);
      const overIndex = data?.allTasks.findIndex((task) => task.id === overId);

      if (data?.allTasks && activeIndex && overIndex && data?.allTasks[activeIndex].columnId != data?.allTasks[overIndex].columnId) {
        data.allTasks[activeIndex].columnId = data.allTasks[overIndex].columnId;
        const newTasks = arrayMove(data?.allTasks, activeIndex, overIndex - 1);

        data?.allTasks.map(async ({ id }) => await deleteTaskButtonClickHandler(id));
        newTasks.map(async ({ id, columnId, title, createdAt }) => await createTaskButtonClickHandler(id, columnId, createdAt, title));
      }
      else if (data?.allTasks && activeIndex && overIndex) {
        const newTasks = arrayMove(data?.allTasks, activeIndex, overIndex);

        data?.allTasks.map(async ({ id }) => await deleteTaskButtonClickHandler(id));
        newTasks.map(async ({ id, columnId, title, createdAt }) => await createTaskButtonClickHandler(id, columnId, createdAt, title));
      }
    }

    const isOverAColumn = over.data.current?.type === 'column';

    if (isActiveATask && isOverAColumn && data?.allTasks) {
      const activeIndex = data.allTasks.findIndex((task) => task.id === activeId);
      data.allTasks[activeIndex].columnId = overId as string;

      const newTasks = arrayMove(data?.allTasks, activeIndex, activeIndex);

      data?.allTasks.map(async ({ id }) => await deleteTaskButtonClickHandler(id));
      newTasks.map(async ({ id, columnId, title, createdAt }) => await createTaskButtonClickHandler(id, columnId, createdAt, title));
    }
  }

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
      <div className='flex gap-4 overflow-x-auto py-8 flex-grow'>
        <SortableContext items={columnsIds}>
          {columns?.allColumns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </SortableContext>
      </div>

      {createPortal(
        <DragOverlay>
          {activeColumn && <Column column={activeColumn} />}
          {activeTask && <Task task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default Board;
