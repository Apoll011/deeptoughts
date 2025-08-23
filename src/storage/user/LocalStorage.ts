import type {IUserStorage} from "../interface/userStorage.interface.ts";
import type {User} from "../../models/user.ts";

export class LocalStorage implements IUserStorage {
    private readonly USER_KEY = 'deep-thoughts-user';
    private readonly ONBOARDING_KEY = 'deep-thoughts-onboarding-completed';

    getUser(): User | null {
        const userJson = localStorage.getItem(this.USER_KEY);
        if (!userJson) {
            return null;
        }
        const user = JSON.parse(userJson);
        return {
            ...user,
            birthdate: new Date(user.birthdate)
        };
    }

    isOnboardingCompleted(): boolean {
        return localStorage.getItem(this.ONBOARDING_KEY) === 'true';
    }

    saveUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    setOnboardingCompleted(completed: boolean): void {
        localStorage.setItem(this.ONBOARDING_KEY, JSON.stringify(completed));
    }
}