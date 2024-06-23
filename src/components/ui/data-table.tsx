"use client"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, FilterFn, getFilteredRowModel } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "./input"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"
import { ChevronDown } from "lucide-react"
import {RankingInfo, rankItem,} from '@tanstack/match-sorter-utils'
import React from "react"
import { useRouter } from 'next/navigation';


declare module '@tanstack/table-core' {
    interface FilterFns {
      fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
      itemRank: RankingInfo
    }
  }

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
  
    // Store the itemRank info
    addMeta({
      itemRank,
    })
  
    // Return if the item should be filtered in/out
    return itemRank.passed
  }

interface DataTableProps<TData, TValue, actionButton> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    onSelectedRowsChange?: (data: TData[]) => void;
    actionButton?: {
        link: string,
        displayName: string
    }
}


export function DataTable<TData, TValue, actionButton>({
    columns,
    data,
    onSelectedRowsChange,
    actionButton
}: DataTableProps<TData, TValue, actionButton>) {
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [rowSelection, setRowSelection] = React.useState({});
    const router = useRouter();
    const table = useReactTable({
        filterFns: {
            fuzzy: fuzzyFilter,
          },
          state: {
         
            globalFilter,
            rowSelection,
          },
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: fuzzyFilter,
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
    })

    React.useEffect(() => {
        if (onSelectedRowsChange) {
          onSelectedRowsChange(
            table.getSelectedRowModel().flatRows.map((row) => row.original)
          )
        }
      }, [onSelectedRowsChange, rowSelection, table]);
    

    
    return (
        <div className="border p-2 rounded-md">
            <div className="flex justify-between mt-2 mb-4">
                <Input className="w-1/4" placeholder={`Search ${data?.length} records...`} onChange={(e) => {setGlobalFilter(e.target.value)}}></Input>
                {actionButton && <Button onClick={()=> router.push(actionButton.link)} variant={"outline"} size={"sm"}>{actionButton.displayName}</Button>}
            </div>

            <div className="border rounded">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="flex justify-between items-center">
            <div>Showing Page <span className="text-primary font-semibold">{table.getState().pagination.pageIndex + 1}</span> of <span className="text-primary font-semibold">{table.getPageCount()}</span></div>
       
            <div className="flex items-center justify-end space-x-2 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="mr-4" size={"sm"} >
                            <>{`Show ${table.getState().pagination.pageSize}`} <ChevronDown className="pl-2" /></>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-4" align="center" style={{ width: '20px' }} >
                        {
                            [10, 20, 30, 40, 50].map((item: number, index: number) => {
                                return (
                                    <DropdownMenuItem  onClick={() => {table.setPageSize(Number(item))}} key={index}>{item}</DropdownMenuItem>
                                )
                            })
                        }

                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>    
             </div>
        </div>
    )
}
