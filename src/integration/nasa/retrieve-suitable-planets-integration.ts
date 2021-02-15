import axios, { AxiosRequestConfig } from 'axios';
import { ILogger } from '../../components/logger/logger';
import { getLoggerStore } from '../../config/logger-config';
import { IKeyValueRepository } from '../../repository/key-value-repository/key-value-repository';
import { Planet } from '../../domains/planet';
import { Exoplanet } from '../../domains/exoplanet';

export class RetrieveSuitablePlanetsIntegration {

    planetRepository: IKeyValueRepository<String, Planet>
    baseURL: string;
    cacheTimeInMs: number;
    expiresIn: number;
    exoplanets: Array<Planet> = [];

    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    constructor(planetRepository: IKeyValueRepository<String, Planet>, cacheTimeInMs: number, baseUrl: string) {
        this.planetRepository = planetRepository;
        this.baseURL = baseUrl;
        this.cacheTimeInMs = cacheTimeInMs;
        this.expiresIn = Date.now() + cacheTimeInMs;
    }

    static build(
        planetRepository: IKeyValueRepository<String, Planet>,
        cacheTimeInMs: number,
        baseUrl: string = "https://exoplanetarchive.ipac.caltech.edu",
    ): RetrieveSuitablePlanetsIntegration {
        return new RetrieveSuitablePlanetsIntegration(planetRepository, cacheTimeInMs, baseUrl);
    }

    async getExoplanets(): Promise<Array<Planet>> {
        try {
            const isExpired = this.isExpiredCache();
            if(this.exoplanets.length === 0 || isExpired) {
                if(isExpired){
                    this.renewExpiresIn();
                }
                this.exoplanets = await this.cachePlanets();
            }
            return this.exoplanets;
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }

    private isExpiredCache(): Boolean {
        return Date.now() > this.expiresIn;
    }

    private renewExpiresIn(): void {
        this.expiresIn = Date.now() + this.cacheTimeInMs;
    }

    private async cachePlanets(): Promise<Array<Planet>> {
        const options: AxiosRequestConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            params: {
                table: 'exoplanets',
                format: 'json'
            }
        }
        this.logger.info(`Retrieving exoplanets from NASA API.`);
        const result = await axios.get(`${this.baseURL}/cgi-bin/nstedAPI/nph-nstedAPI`, options);
        this.logger.info(`Exoplanets retrieved from NASA API.`);
        const filteredExoplanets: Array<Exoplanet> = !!result ? result.data.filter(exoplanet => exoplanet['pl_bmassj'] > 10) : []
        const planets: Array<Planet> = [];
        for(const exoplanet of filteredExoplanets) {
            const planet: Planet = { name: exoplanet.pl_hostname, mass: exoplanet.pl_bmassj }
            const planetFound = await this.planetRepository.get(planet.name);
            if(!planetFound) {
                await this.planetRepository.set(planet.name, planet, this.expiresIn);
            }
            planets.push(planet);
        }
        return planets;
    }
}