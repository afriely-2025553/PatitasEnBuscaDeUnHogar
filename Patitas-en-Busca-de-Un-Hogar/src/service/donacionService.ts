import { Donacion } from "../models/donacion";
import { DonacionesRepository } from "../data/donacionesRepository";

export class DonacionService {

    private repository = new DonacionesRepository();

    async listar(): Promise<Donacion[]> {

        return await this.repository.obtenerDonaciones();

    }

    async buscar(id: number): Promise<Donacion | undefined> {

        const donaciones = await this.repository.obtenerDonaciones();

        return donaciones.find(d => d.id_donacion === id);

    }

    async agregar(donacion: Donacion): Promise<void> {

        const donaciones = await this.repository.obtenerDonaciones();

        donaciones.push(donacion);

        await this.repository.guardarDonaciones(donaciones);

    }

    async actualizar(donacion: Donacion): Promise<boolean> {

        const donaciones = await this.repository.obtenerDonaciones();

        const indice = donaciones.findIndex(d => d.id_donacion === donacion.id_donacion);

        if (indice === -1) {

            return false;

        }

        donaciones[indice] = donacion;

        await this.repository.guardarDonaciones(donaciones);

        return true;

    }

    async eliminar(id: number): Promise<boolean> {

        const donaciones = await this.repository.obtenerDonaciones();

        const nuevasDonaciones = donaciones.filter(d => d.id_donacion !== id);

        if (nuevasDonaciones.length === donaciones.length) {

            return false;

        }

        await this.repository.guardarDonaciones(nuevasDonaciones);

        return true;

    }

}