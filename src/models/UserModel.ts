import { User } from '../entities/User';

export class UserModel {
    private users: User[] = [];

    async findAll(): Promise<User[]> {
        return this.users;
    }

    async findById(id: number): Promise<User | null> {
        return this.users.find(user => user.id === id) || null;
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = new User({
            ...userData,
            id: this.users.length + 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        this.users.push(user);
        return user;
    }

    async update(id: number, userData: Partial<User>): Promise<User | null> {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return null;

        this.users[index] = new User({
            ...this.users[index],
            ...userData,
            updatedAt: new Date()
        });
        return this.users[index];
    }

    async delete(id: number): Promise<boolean> {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return false;
        
        this.users.splice(index, 1);
        return true;
    }
} 