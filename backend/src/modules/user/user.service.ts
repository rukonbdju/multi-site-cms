
import { UserRepository } from './user.repository';
import { User } from '../../schema';
import { comparePassword, hashPassword } from './user.utils';

export class UserService {
    private userRepo = new UserRepository();

    // Create user with password hashing
    async registerUser(data: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }): Promise<User> {
        const hashedPassword = await hashPassword(data.password);
        return this.userRepo.create({ ...data, password: hashedPassword });
    }

    // Authenticate user
    async authenticate(email: string, password: string): Promise<User | null> {
        const user = await this.userRepo.findByEmail(email);
        if (!user) return null;

        const valid = await comparePassword(password, user.password);
        if (!valid) return null;

        return user;
    }

    // Get user by ID
    async getUserById(id: number): Promise<User | null> {
        return this.userRepo.findById(id);
    }

    // Update user
    async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>> & { password?: string }): Promise<User | null> {
        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }
        return this.userRepo.update(id, updates);
    }

    // Delete user
    async deleteUser(id: number): Promise<boolean> {
        return this.userRepo.delete(id);
    }

    // List all users
    async listUsers(): Promise<User[]> {
        return this.userRepo.findAll();
    }
}
