import { Especie } from "../models/especie";
import { EspeciesRepository } from "../data/especieRepository";

export class EspecieService {

    private repository = new EspeciesRepository();

    async listar(): Promise<Especie[]> {

        return await this.repository.obtenerEspecies();

    }

    async buscar(id: number): Promise<Especie | undefined> {

        const especies = await this.repository.obtenerEspecies();

        return especies.find(e => e.id_especie === id);

    }

    async agregar(especie: Especie): Promise<void> {

        const especies = await this.repository.obtenerEspecies();

        especies.push(especie);

        await this.repository.guardarEspecies(especies);

    }

    async actualizar(especie: Especie): Promise<boolean> {

        const especies = await this.repository.obtenerEspecies();

        const indice = especies.findIndex(
            e => e.id_especie === especie.id_especie
        );

        if (indice === -1) {

            return false;

        }

        especies[indice] = especie;

        await this.repository.guardarEspecies(especies);

        return true;

    }

    async eliminar(id: number): Promise<boolean> {

        const especies = await this.repository.obtenerEspecies();

        const indice = especies.findIndex(
            e => e.id_especie === id
        );

        if (indice === -1) {

            return false;

        }

        especies.splice(indice, 1);

        await this.repository.guardarEspecies(especies);

        return true;

    }

}