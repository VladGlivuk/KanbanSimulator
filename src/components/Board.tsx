import { useBoardContext } from "@/contexts/BoardContext"
import Column from "@/components/Column"

const Board = () => {
const {columns} = useBoardContext()

  return (
    <div className="flex gap-4 overflow-x-auto py-8 flex-grow">
        {columns.map((column) => (
            <Column key={column.id} column={column} />
        ))}
    </div>
  )
}

export default Board