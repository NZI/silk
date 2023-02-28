import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import type { PaginateService } from "common/PaginateService";
import { client } from "../client";

export const usePage = (
  table: string,
  pageSize: number,
  filter: string,
  sortColumn: string,
  sort: string,
) => {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Awaited<ReturnType<PaginateService['paginate']>>>({ data: [], count: 0, columns: [] })

  const results = useQuery([
    table,
    page,
    pageSize,
    filter,
    sortColumn,
    sort
  ], async () => {
    return client.Paginate.paginate(
      table,
      page,
      pageSize,
      filter,
      sortColumn,
      sort,
    )
  }, { refetchOnMount: true })

  useEffect(() => {
    if (!results.isFetching && !results.isRefetching) {
      setData(results.data!)
    }

  }, [results.isFetching, results.isRefetching, setData, setPage])

  const gotoPage = useCallback((newPageIndex: number) => {
    setPage(Math.max(0, Math.min(Math.floor((data.count - 1) / pageSize), newPageIndex)))
  }, [setPage, table, data.count, pageSize])

  return {
    loading: results.isFetching || results.isRefetching,
    data,
    page,
    gotoPage
  }
}