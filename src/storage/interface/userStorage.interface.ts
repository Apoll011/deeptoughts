import type {User} from "../../models/user.ts";

export interface IUserStorage {
    saveUser(user: User): void;
    getUser(): User | null;
    isOnboardingCompleted(): boolean;
    setOnboardingCompleted(completed: boolean): void;
}