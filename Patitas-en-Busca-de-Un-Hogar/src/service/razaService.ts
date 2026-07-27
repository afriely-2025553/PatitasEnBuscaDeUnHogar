import { Raza } from "../models/raza";
import { RazasRepository } from "../data/razasRepository";

export class RazaService {

    private repository = new RazasRepository();

    async listar(): Promise<Raza[]> {

        return await this.repository.obtenerRazas();

    }

    async buscar(id: number): Promise<Raza | undefined> {

        const razas = await this.repository.obtenerRazas();

        return razas.find(r => r.id_raza === id);

    }

    async agregar(raza: Raza): Promise<void> {

        const razas = await this.repository.obtenerRazas();

        razas.push(raza);

        await this.repository.guardarRazas(razas);

    }

    async actualizar(raza: Raza): Promise<boolean> {

        const razas = await this.repository.obtenerRazas();

        const indice = razas.findIndex(r => r.id_raza === raza.id_raza);

        if (indice === -1) {

            return false;

        }

        razas[indice] = raza;

        await this.repository.guardarRazas(razas);

        return true;

    }

    async eliminar(id: number): Promise<boolean> {

        const razas = await this.repository.obtenerRazas();

        const nuevasRazas = razas.filter(r => r.id_raza !== id);

        if (nuevasRazas.length === razas.length) {

            return false;

        }

        await this.repository.guardarRazas(nuevasRazas);

        return true;

    }

}