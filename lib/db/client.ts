import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

let sql: postgres.Sql<{}> | null = null;

export function getDb(): postgres.Sql<{}> | null {
  if (!sql) {
    if (!connectionString) {
      return null;
    }

    sql = postgres(connectionString, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  return sql;
}

export async function closeDb(): Promise<void> {
  if (sql) {
    await sql.end();
    sql = null;
  }
}
