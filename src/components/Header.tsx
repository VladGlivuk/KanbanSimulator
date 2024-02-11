import { useBoardContext } from "@/contexts/BoardContext"
import Button from "@/components/ui/Button"

const Header = () => {
    const { createColumn } = useBoardContext()

    return (
        <div className="bg-secondary w-full rounded-md p-2 mt-2 flex gap-2">
            <h1 className="flex-grow text-2xl font-bold">Kanban simulator</h1>

            <Button onClick={createColumn}>Create column</Button>
        </div>
    )
}

export default Header