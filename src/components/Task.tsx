import { FC, useState, ChangeEventHandler, KeyboardEventHandler } from "react"
import { useBoardContext } from "@/contexts/BoardContext"
import { type Task } from "@/lib/types"
import TrashIcon from "@/assets/TrashIcon"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

type Props = {
    task: Task
}

const Task: FC<Props> = ({ task: { id, title } }) => {
    const { updateTask, deleteTask } = useBoardContext()

    const [inputValue, setInputValue] = useState(title)
    const [isEditing, setIsEditing] = useState(!title)

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
            updateTask(id, inputValue)
        }
    }

    const inputBlurHandler = () => {
        if (inputValue) {
            isEditingToggle()
            updateTask(id, inputValue)
        }
    }

    const deleteTaskButtonClickHandler = () => {
        deleteTask(id)
    }

    return (
        <div className="rounded-md bg-background p-2 relative flex gap-2">
            <div className="flex-grow">
                {isEditing ? (
                    <Input value={inputValue} onChange={inputChangeHandler} onBlur={inputBlurHandler} onKeyDown={inputKeyDownHandler} placeholder="Task title" autoFocus />
                ) : (
                    <div onClick={isEditingToggle} className="w-fit h-full hover:cursor-pointer hover:text-primary">{title}</div>
                )}
            </div>

            <Button variant="outline" size="icon" onClick={deleteTaskButtonClickHandler} className="flex-shrink-0">
                <TrashIcon />
            </Button>
        </div>
    )
}

export default Task