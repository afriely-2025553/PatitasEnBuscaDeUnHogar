import { Adopcion } from "../models/adopcion";
import { AdopcionesRepository } from "../data/adopcionesRepository";

export class AdopcionService {

    private repository = new AdopcionesRepository();

    async listar(): Promise<Adopcion[]> {

        return await this.repository.obtenerAdopciones();

    }

    async buscar(id: number): Promise<Adopcion | undefined> {

        const adopciones = await this.repository.obtenerAdopciones();

        return adopciones.find(a => a.id_adopcion === id);

    }

    async agregar(adopcion: Adopcion): Promise<void> {

        const adopciones = await this.repository.obtenerAdopciones();

        adopciones.push(adopcion);

        await this.repository.guardarAdopciones(adopciones);

    }

    async actualizar(adopcion: Adopcion): Promise<boolean> {

        const adopciones = await this.repository.obtenerAdopciones();

        const indice = adopciones.findIndex(a => a.id_adopcion === adopcion.id_adopcion);

        if (indice === -1) return false;

        adopciones[indice] = adopcion;

        await this.repository.guardarAdopciones(adopciones);

        return true;

    }

    async eliminar(id: number): Promise<boolean> {

        const adopciones = await this.repository.obtenerAdopciones();

        const nuevas = adopciones.filter(a => a.id_adopcion !== id);

        if (nuevas.length === adopciones.length) return false;

        await this.repository.guardarAdopciones(nuevas);

        return true;

    }

}