import pool from "../../config/db";
import { User } from "../../schema";

export class UserRepository {
    private tableName = 'cms.users';

    // Create a new user
    async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        const { name, email, password, address, status, is_admin } = user;
        const result = await pool.query<User>(
            `INSERT INTO ${this.tableName} 
       (name, email, password, address, status, is_admin) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
            [name, email, password, address || null, status || 'Inactive', is_admin || false]
        );
        return result.rows[0];
    }

    // Find user by ID
    async findById(id: number): Promise<User | null> {
        const result = await pool.query<User>(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows[0] || null;
    }

    // Find user by Email
    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query<User>(`SELECT * FROM ${this.tableName} WHERE email = $1`, [email]);
        return result.rows[0] || null;
    }

    // Update user
    async update(id: number, updates: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User | null> {
        const fields = Object.keys(updates);
        if (fields.length === 0) return this.findById(id);

        const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ');
        const values = Object.values(updates);

        const result = await pool.query<User>(
            `UPDATE ${this.tableName} SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
            [...values, id]
        );
        return result.rows[0] || null;
    }

    // Delete user
    async delete(id: number): Promise<boolean> {
        const result = await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows[0];
    }

    // List all users
    async findAll(): Promise<User[]> {
        const result = await pool.query<User>(`SELECT * FROM ${this.tableName} ORDER BY id ASC`);
        return result.rows;
    }
}
