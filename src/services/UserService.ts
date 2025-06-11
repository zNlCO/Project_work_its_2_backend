import { User } from '../entities/User';
import { UserModel } from '../models/UserModel';

export class UserService {
    private userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }

    async getAllUsers(): Promise<User[]> {
        return this.userModel.findAll();
    }

    async getUserById(id: number): Promise<User | null> {
        return this.userModel.findById(id);
    }

    async createUser(userData: Partial<User>): Promise<User> {
        // Add any business logic here (e.g., password hashing, validation)
        return this.userModel.create(userData);
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
        // Add any update validation logic here
        return this.userModel.update(id, userData);
    }

    async deleteUser(id: number): Promise<boolean> {
        return this.userModel.delete(id);
    }
} 