import { Allow } from "./lib/Allow"
import { Service } from "./lib/Service"

const COLUMNS = [
  'name',
  'order'
]

const PROTECTED = [
  "ADMIN"
]

export class Role extends Service {

  @Allow(R => R('ADMIN'))
  async update(id: number, column: string, value: string) {
    if (!COLUMNS.includes(column)) {
      return false
    }

    await this.services.Database.run(
      `UPDATE roles SET ${column}=:value WHERE id=:id AND name NOT IN (${PROTECTED.map(r => `"${r}"`).join(',')}) `, { id, value }
    )
    return true
  }
}