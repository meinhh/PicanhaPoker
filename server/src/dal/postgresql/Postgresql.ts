import { Pool } from 'pg';
import camelcase from 'camelcase-keys';

export default class Postgresql {
    private pool: Pool;

    public constructor(host: string, database: string, username: string, password: string) {
        this.pool = new Pool({
            host: host,
            database: database,
            user: username,
            password: password
        });
    }

    public async query(sql: string): Promise<any> {
        const client = await this.pool.connect();
        try {
            const res = await client.query(sql);
            return camelcase(res.rows);
        } finally {
            client.release();
        }
    }
}