import { IDomain } from "../components/domain/domain";
import { Planet } from "./planet";

export interface Station extends IDomain {
    name: string;
    planet: Planet;
}