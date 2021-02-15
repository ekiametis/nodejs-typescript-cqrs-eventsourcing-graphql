import { IDomain } from '../components/domain/domain';

export interface User extends IDomain{
    email: string;
    name: string;
    password: string;
    salt: string;
}