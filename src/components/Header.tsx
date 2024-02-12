import { FC } from 'react';
import Button from '@/components/ui/Button';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_COLUMN } from '@/apollo/mutations';
import { ColumnType, SORT } from '@/types';
import { ALL_Columns } from '@/apollo/queries';
import Select from './ui/Select';
import { useSortContext } from '@/context';

const Header: FC = () => {
  const {sortValue, setSortValue} = useSortContext();

  const { refetch: refetchColumns } = useQuery<{ allColumns: Array<ColumnType> }>(ALL_Columns);

  const [createColumnMutation] = useMutation(CREATE_COLUMN);

  const createColumnButtonClickHandler = async () => {
    try {
      await createColumnMutation({ variables: { id: crypto.randomUUID(), title: '' } });
      refetchColumns();
    } catch (error) {
      console.error('Error creating column:', error);
    }
  };

  const onSelectHandler = (value: SORT) => setSortValue(value);

  return (
    <div className='bg-secondary w-full rounded-md p-2 mt-2 flex gap-6'>
      <h1 className='flex-grow text-2xl font-bold'>Kanban simulator</h1>

      <Select value={sortValue} onSelectChange={onSelectHandler}>
        <>
          <option value='Ascending'>Ascending</option>
          <option value='Descending'>Descending</option>
        </>
      </Select>

      <Button onClick={createColumnButtonClickHandler} className='h-12'>Create column</Button>
    </div>
  );
};

export default Header;
