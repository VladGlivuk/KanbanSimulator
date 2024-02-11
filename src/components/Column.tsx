import { FC, useMemo, useState, KeyboardEventHandler, ChangeEventHandler } from "react"
import { useBoardContext } from "@/contexts/BoardContext"
import { type Column } from "@/lib/types"
import Task from "@/components/Task"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

type Props = {
    column: Column
}

const Column: FC<Props> = ({ column: { id, title } }) => {
    const { tasks, createTask, deleteColumn, updateColumn } = useBoardContext()

    const [inputValue, setInputValue] = useState(title)
    const [isEditing, setIsEditing] = useState(!title)

    const columnTasks = useMemo(() => tasks.filter((task) => task.columnId === id), [tasks, id])

    const isEditingToggle = () => {
        setIsEditing(!isEditing)
    }

    const inputChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newTitle = e.target.value
        setInputValue(newTitle)
    }

    const inputKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter' && inputValue) {
            isEditingToggle()
            updateColumn(id, inputValue)
        }
    }

    const inputBlurHandler = () => {
        if (inputValue) {
            isEditingToggle()
            updateColumn(id, inputValue)
        }
    }

    const createTaskButtonClickHandler = () => {
        createTask(id)
    }

    const deleteColumnButtonClickHandler = () => {
        deleteColumn(id)
    }

    return (
        <div className="h-full w-96 rounded-md bg-secondary py-2 flex flex-col gap-2 flex-shrink-0">
            <div className="flex gap-2 px-2">
                <div className="flex-grow">
                    {isEditing ? (
                        <Input value={inputValue} onChange={inputChangeHandler} onBlur={inputBlurHandler} onKeyDown={inputKeyDownHandler} placeholder="Column title" autoFocus />
                    ) : (
                        <div onClick={isEditingToggle} className="w-fit h-full hover:cursor-pointer hover:text-primary font-semibold">{title}</div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto px-2 flex-grow">
                {columnTasks.map((task) => (
                    <Task key={task.id} task={task} />
                ))}
            </div>

            <div className="px-2 flex justify-between">
                <Button variant="destructive" onClick={deleteColumnButtonClickHandler}>Delete column</Button>

                <Button onClick={createTaskButtonClickHandler}>Create task</Button>
            </div>
        </div>
    )
}

export default Column       