import { Vacuna } from "../models/vacuna";
import { VacunasRepository } from "../data/vacunasRepository";

export class VacunaService {

    private repository = new VacunasRepository();

    async listar(): Promise<Vacuna[]> {

        return await this.repository.obtenerVacunas();

    }

    async buscar(id: number): Promise<Vacuna | undefined> {

        const vacunas = await this.repository.obtenerVacunas();

        return vacunas.find(v => v.id_vacuna === id);

    }

    async agregar(vacuna: Vacuna): Promise<void> {

        const vacunas = await this.repository.obtenerVacunas();

        vacunas.push(vacuna);

        await this.repository.guardarVacunas(vacunas);

    }

    async actualizar(vacuna: Vacuna): Promise<boolean> {

        const vacunas = await this.repository.obtenerVacunas();

        const indice = vacunas.findIndex(v => v.id_vacuna === vacuna.id_vacuna);

        if (indice === -1) return false;

        vacunas[indice] = vacuna;

        await this.repository.guardarVacunas(vacunas);

        return true;

    }

    async eliminar(id: number): Promise<boolean> {

        const vacunas = await this.repository.obtenerVacunas();

        const nuevas = vacunas.filter(v => v.id_vacuna !== id);

        if (nuevas.length === vacunas.length) return false;

        await this.repository.guardarVacunas(nuevas);

        return true;

    }

}