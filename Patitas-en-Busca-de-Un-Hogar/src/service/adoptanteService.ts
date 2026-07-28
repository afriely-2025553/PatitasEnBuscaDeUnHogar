import { Adoptante } from "../models/adoptante";
import { AdoptantesRepository } from "../data/adoptantesRepository";

export class AdoptanteService {

    private repository = new AdoptantesRepository();

    async listar(): Promise<Adoptante[]> {

        return await this.repository.obtenerAdoptantes();

    }

    async buscar(id: number): Promise<Adoptante | undefined> {

        const adoptantes = await this.repository.obtenerAdoptantes();

        return adoptantes.find(a => a.id_adoptante === id);

    }

    async agregar(adoptante: Adoptante): Promise<void> {

        const adoptantes = await this.repository.obtenerAdoptantes();

        adoptantes.push(adoptante);

        await this.repository.guardarAdoptantes(adoptantes);

    }

    async actualizar(adoptante: Adoptante): Promise<boolean> {

        const adoptantes = await this.repository.obtenerAdoptantes();

        const indice = adoptantes.findIndex(a => a.id_adoptante === adoptante.id_adoptante);

        if (indice === -1) {

            return false;

        }

        adoptantes[indice] = adoptante;

        await this.repository.guardarAdoptantes(adoptantes);

        return true;

    }

    async eliminar(id: number): Promise<boolean> {

        const adoptantes = await this.repository.obtenerAdoptantes();

        const nuevosAdoptantes = adoptantes.filter(a => a.id_adoptante !== id);

        if (nuevosAdoptantes.length === adoptantes.length) {

            return false;

        }

        await this.repository.guardarAdoptantes(nuevosAdoptantes);

        return true;

    }

}