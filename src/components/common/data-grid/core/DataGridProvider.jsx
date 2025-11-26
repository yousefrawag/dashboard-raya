/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { createContext, useContext, useEffect, useState } from 'react';
import { DataGridInner } from './DataGridInner';
import { deepMerge } from '../../../../utils';

const DataGridContext = createContext(undefined);

export const useDataGrid = () => {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error('useDataGrid must be used within a DataGridProvider');
  }
  return context;
};

export const DataGridProvider = props => {
  const defaultValues = {
    messages: {
      empty: 'No data available',
      loading: 'Loading...'
    },
    pagination: {
      info: '{from} - {to} of {count}',
      sizes: [5, 10, 25, 50, 100],
      sizesLabel: 'Show',
      sizesDescription: 'per page',
      size: 5,
      page: 0,
      moreLimit: 5,
      more: false
    },
    layout: {
      cellsBorder: true
    },
    rowSelect: false,
    serverSide: false
  };

  const mergedProps = deepMerge(defaultValues, props);

  // ✅ State for data and totals
  const [data, setData] = useState(mergedProps.data ?? []);
  const [totalRows, setTotalRows] = useState(mergedProps.data?.length ?? 0);
  const [loading, setLoading] = useState(false);

  // ✅ Watch for data prop changes
  useEffect(() => {
    setData(mergedProps.data ?? []);
    setTotalRows(mergedProps.data?.length ?? 0);
  }, [mergedProps.data]);

  // ✅ Row selection
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [isSelectAllIndeterminate, setIsSelectAllIndeterminate] = useState(false);

  // ✅ Pagination, sorting, filters
  const [pagination, setPagination] = useState({
    pageIndex: props.pagination?.page ?? 0,
    pageSize: props.pagination?.size ?? 5
  });
  const [sorting, setSorting] = useState(mergedProps.sorting ?? []);
  const [filters, setFilters] = useState(mergedProps.filters ?? []);

  // ✅ Fetch server-side data
  const fetchServerSideData = async () => {
    if (!mergedProps.onFetchData) return;
    setLoading(true);
    try {
      const requestParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        filters
      };
      const { data, totalCount } = await mergedProps.onFetchData(requestParams);
      if (data && totalCount !== undefined) {
        setData(data);
        setTotalRows(totalCount);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const table = useReactTable({
    columns: mergedProps.columns,
    data,
    debugTable: false,
    pageCount: mergedProps.serverSide ? Math.ceil(totalRows / pagination.pageSize) : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: mergedProps.serverSide,
    manualSorting: mergedProps.serverSide,
    manualFiltering: mergedProps.serverSide,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setFilters,
    state: {
      pagination,
      sorting,
      columnFilters: filters
    }
  });

  // ✅ Row selection handlers
  const toggleRowSelection = id => {
    setSelectedRowIds(prev => {
      const newSelected = new Set(prev);
      newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
      props.onRowsSelectChange?.(newSelected);
      return newSelected;
    });
  };

  const toggleAllRowsSelection = checked => {
    const allRowIds = table.getRowModel().rows.map(row => row.id);
    const newSelected = checked ? new Set(allRowIds) : new Set();
    setSelectedRowIds(newSelected);
    props.onRowsSelectChange?.(newSelected);
  };

  const getSelectedRowIds = () => Array.from(selectedRowIds);

  // ✅ React to changes (pagination, sorting, filters)
  useEffect(() => {
    if (mergedProps.serverSide) {
      fetchServerSideData();
    }
  }, [pagination, sorting, filters]);

  // ✅ Selection UI state
  useEffect(() => {
    const allRowIds = table.getRowModel().rows.map(row => row.id);
    const isAll = allRowIds.every(id => selectedRowIds.has(id));
    const isSome = allRowIds.some(id => selectedRowIds.has(id));
    setIsSelectAllChecked(isAll);
    setIsSelectAllIndeterminate(!isAll && isSome);
  }, [selectedRowIds, table.getRowModel().rows]);

  // ✅ Final context
  return (
    <DataGridContext.Provider
      value={{
        props: mergedProps,
        table,
        totalRows,
        loading,
        setLoading,
        selectedRowIds,
        toggleRowSelection,
        toggleAllRowsSelection,
        getSelectedRowIds,
        isSelectAllChecked,
        isSelectAllIndeterminate
      }}
    >
      <DataGridInner />
    </DataGridContext.Provider>
  );
};
