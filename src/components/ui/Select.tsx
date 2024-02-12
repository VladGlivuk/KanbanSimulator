import { ChangeEvent, ReactNode } from 'react';

type Props<T> = {
  title?: string;
  children: ReactNode;
  value: T;
  onSelectChange: (value: T) => void;
}

function Select<T extends string | number> ({title = 'Select an option', children, value, onSelectChange} : Props<T>) {
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const {value} = event.target;
    onSelectChange(value as T)
  }

  return (
    <div className='max-w-48 flex h-12 gap-2'>
      <label id='countries' className='block mb-2 text-sm font-medium text-gray-90'>
        {title}
      </label>

      <select
        id='countries'
        value={value}
        onChange={onChange}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
