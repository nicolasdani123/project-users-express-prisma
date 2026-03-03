import { db } from "./db.helper.js";

export async function getDbNow(): Promise<Date> {
    const result = await db.$queryRaw<{ now: Date }[]>`
      SELECT NOW() as now
    `;
    

      return result[0]?.now ?? new Date();

}

export default getDbNow;
