export interface User {
    name: string;
    birthdate: Date;
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}
