import { Refugio } from "../models/refugio";
import { RefugiosRepository } from "../data/refugiosRepository";

export class RefugioService {

    private repository = new RefugiosRepository();

    async listar(): Promise<Refugio[]> {

        return await this.repository.obtenerRefugios();

    }

    async buscar(id: number): Promise<Refugio | undefined> {

        const refugios = await this.repository.obtenerRefugios();

        return refugios.find(r => r.id_refugio === id);

    }

    async agregar(refugio: Refugio): Promise<void> {

        const refugios = await this.repository.obtenerRefugios();

        refugios.push(refugio);

        await this.repository.guardarRefugios(refugios);

    }

    async actualizar(refugio: Refugio): Promise<boolean> {

        const refugios = await this.repository.obtenerRefugios();

        const indice = refugios.findIndex(r => r.id_refugio === refugio.id_refugio);

        if (indice === -1) {

            return false;

        }

        refugios[indice] = refugio;

        await this.repository.guardarRefugios(refugios);

        return true;

    }

    async eliminar(id: number): Promise<boolean> {

        const refugios = await this.repository.obtenerRefugios();

        const nuevosRefugios = refugios.filter(r => r.id_refugio !== id);

        if (nuevosRefugios.length === refugios.length) {

            return false;

        }

        await this.repository.guardarRefugios(nuevosRefugios);

        return true;

    }

}