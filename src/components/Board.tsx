import { createPortal } from 'react-dom';
import { FC, useCallback, useMemo, useState } from 'react';
import { useBoardContext } from '@/contexts/BoardContext';
import Column from '@/components/Column';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { TaskType } from '@/lib/types';
import Task from './Task';

const Board: FC = () => {
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)

  const { columns, tasks, setColumns, setTasks } = useBoardContext();

  const getFilteredTasks = useCallback((columnId: string) => tasks.filter((task) => task.columnId === columnId), [tasks, columns]);

  const columnsIds = useMemo(() => columns.map(({ id }) => id), [columns]);

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

    const isActiveAColumn = active.data.current?.type === "column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });

  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "task";
    const isOverATask = over.data.current?.type === "task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {

          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);

        tasks[activeIndex].columnId = overId as string;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
      <div className='flex gap-4 overflow-x-auto py-8 flex-grow'>
        <SortableContext items={columnsIds}>
          {columns.map((column) => (
            <Column key={column.id} column={column} tasks={getFilteredTasks(column.id)} />
          ))}
        </SortableContext>
      </div>

      {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Column column={activeColumn} tasks={getFilteredTasks(activeColumn.id)}/>
            )}
            {activeTask && (
              <Task
                task={activeTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}

    </DndContext>
  );
};

export default Board;
