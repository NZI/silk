import { resolve } from "path";
import { Services } from ".";
import { Allow } from "./lib/Allow";
import { DatabaseAdapter } from "./lib/DatabaseAdapter";
import { Service } from "./lib/Service";

const TABLES: { [key: string]: string[] } = {
  users: ['id', 'email'],
  roles: ['id', 'name'],
  permissions: ['id', 'name'],
}


export class Paginate extends Service {

  @Allow((R) => R('ADMIN'))
  public async paginate(
    table: string,
    page: number,
    pageSize: number,
    filter: string,
    sortColumn: string,
    sort: string
  ) {
    if (!(table in TABLES)) {
      throw `${table} not found`
    }

    const columns: string[] = TABLES[table]

    const actualSortColumn = columns.includes(sortColumn) ? sortColumn : 'id'
    const actualSort = sort === 'DESC' ? 'DESC' : 'ASC'
    const actualFilter = filter.length > 0 ? `%${filter}%` : undefined

    const params: any = {
      page: page * pageSize,
      pageSize
    }

    const countParams: any = {}

    if (actualFilter) {
      params.filter = actualFilter
      countParams.filter = actualFilter
    }

    const countSql = `SELECT count(*) as "count"
      FROM ${table}
      ${actualFilter ? `WHERE ${columns.map(c => `${c} LIKE :filter`).join(" OR ")}` : ""}
    `

    const sql = `SELECT ${columns.join(', ')}
      FROM ${table}
      ${actualFilter ? `WHERE ${columns.map(c => `${c} LIKE :filter`).join(" OR ")}` : ""}
      ORDER BY ${actualSortColumn} ${actualSort}
      LIMIT :pageSize OFFSET :page
    `

    const [
      data,
      { count }
    ] = await Promise.all([
      this.services.Database.all(sql, params),
      this.services.Database.selectOne(countSql, countParams)
    ])

    return {
      data,
      count,
      columns
    }
  }
}