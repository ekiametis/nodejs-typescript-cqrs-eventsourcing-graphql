import { IDomain } from "../components/domain/domain";

export interface Planet extends IDomain {
    name: string;
    mass: number;
}