import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useMemo, useState } from 'react';
// types
import { SORT } from '@/types';
import { ASCENDING } from '@/constants';

type SortContextValue = {
  sortValue: SORT;
  setSortValue: Dispatch<SetStateAction<SORT>>;
};

const SortContext = createContext<SortContextValue | null>(null);

export const SortContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [sortValue, setSortValue] = useState<SORT>(ASCENDING);

  const value = useMemo<SortContextValue>(() => ({ sortValue, setSortValue }), [sortValue, setSortValue]);

  return  <SortContext.Provider value={value}>{children}</SortContext.Provider>
};

export const useSortContext = () => {
  const sortContext = useContext(SortContext);
  if (!sortContext) throw new Error('Context is used outside the provider');

  return sortContext;
};
