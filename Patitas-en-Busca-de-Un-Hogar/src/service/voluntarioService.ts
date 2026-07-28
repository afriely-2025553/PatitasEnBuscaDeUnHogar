import { Voluntario } from "../models/voluntario";
import { VoluntariosRepository } from "../data/voluntariosRepository";

export class VoluntarioService {

    private repository = new VoluntariosRepository();

    async listar(): Promise<Voluntario[]> {

        return await this.repository.obtenerVoluntarios();

    }

    async buscar(id: number): Promise<Voluntario | undefined> {

        const voluntarios = await this.repository.obtenerVoluntarios();

        return voluntarios.find(v => v.id_voluntario === id);

    }

    async agregar(voluntario: Voluntario): Promise<void> {

        const voluntarios = await this.repository.obtenerVoluntarios();

        voluntarios.push(voluntario);

        await this.repository.guardarVoluntarios(voluntarios);

    }

    async actualizar(voluntario: Voluntario): Promise<boolean> {

        const voluntarios = await this.repository.obtenerVoluntarios();

        const indice = voluntarios.findIndex(v => v.id_voluntario === voluntario.id_voluntario);

        if (indice === -1) {

            return false;

        }

        voluntarios[indice] = voluntario;

        await this.repository.guardarVoluntarios(voluntarios);

        return true;

    }

    async eliminar(id: number): Promise<boolean> {

        const voluntarios = await this.repository.obtenerVoluntarios();

        const nuevosVoluntarios = voluntarios.filter(v => v.id_voluntario !== id);

        if (nuevosVoluntarios.length === voluntarios.length) {

            return false;

        }

        await this.repository.guardarVoluntarios(nuevosVoluntarios);

        return true;

    }

}