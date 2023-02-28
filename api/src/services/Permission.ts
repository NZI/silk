import { Allow } from "./lib/Allow"
import { Service } from "./lib/Service"

const COLUMNS = [
  'name',
  'order'
]

const PROTECTED = [
  "VERIFIED"
]

export class Permission extends Service {

  @Allow(R => R('ADMIN'))
  async update(id: number, column: string, value: string) {
    if (!COLUMNS.includes(column)) {
      return false
    }

    await this.services.Database.run(
      `UPDATE permissions SET ${column}=:value WHERE id=:id AND name NOT IN (${PROTECTED.map(r => `"${r}"`).join(',')}) `, { id, value }
    )
    return true
  }
}