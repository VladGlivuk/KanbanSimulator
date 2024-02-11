import { FC, PropsWithChildren, createContext, useContext, useMemo, useState } from "react"
import { Column, Task } from "@/lib/types"

type BoardContextValue = {
    columns: Array<Column>
    tasks: Array<Task>
    createColumn: () => void
    deleteColumn: (id: string) => void
    updateColumn: (id: string, title: string) => void
    createTask: (columnId: string) => void
    deleteTask: (id: string) => void
    updateTask: (id: string, title: string) => void
}

const BoardContext = createContext<BoardContextValue | null>(null)

export const BoardContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [columns, setColumns] = useState<Array<Column>>([])
    const [tasks, setTasks] = useState<Array<Task>>([])

    const createColumn = () => {
        setColumns([...columns, { id: crypto.randomUUID(), title: '' }])
    }

    const deleteColumn = (id: string) => {
        setColumns(columns.filter(column => column.id !== id))
        setTasks(tasks.filter(task => task.columnId !== id))
    }

    const updateColumn = (id: string, title: string) => {
        setColumns(columns.map(column => column.id === id ? { ...column, title } : column))
    }

    const createTask = (columnId: string) => {
        setTasks([...tasks, { columnId, id: crypto.randomUUID(), title: '' }])
    }

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const updateTask = (id: string, title: string) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, title } : task))
    }

    const contextValue = useMemo<BoardContextValue>(() => ({
        columns,
        tasks,
        createColumn,
        deleteColumn,
        updateColumn,
        createTask,
        deleteTask,
        updateTask,
    }), [columns, tasks])

    return <BoardContext.Provider value={contextValue}>{children}</BoardContext.Provider>
}

export const useBoardContext = () => {
    const context = useContext(BoardContext)

    if (!context) {
        throw new Error('useBoardContext must be used within a BoardContextProvider')
    }

    return context
}