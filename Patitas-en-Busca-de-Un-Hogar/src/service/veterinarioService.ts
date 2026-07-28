import { Veterinario } from "../models/veterinario";
import { VeterinariosRepository } from "../data/veterinariosRepository";

export class VeterinarioService {

    private repository = new VeterinariosRepository();

    async listar(): Promise<Veterinario[]> {

        return await this.repository.obtenerVeterinarios();

    }

    async buscar(id: number): Promise<Veterinario | undefined> {

        const veterinarios = await this.repository.obtenerVeterinarios();

        return veterinarios.find(v => v.id_veterinario === id);

    }

    async agregar(veterinario: Veterinario): Promise<void> {

        const veterinarios = await this.repository.obtenerVeterinarios();

        veterinarios.push(veterinario);

        await this.repository.guardarVeterinarios(veterinarios);

    }

    async actualizar(veterinario: Veterinario): Promise<boolean> {

        const veterinarios = await this.repository.obtenerVeterinarios();

        const indice = veterinarios.findIndex(v => v.id_veterinario === veterinario.id_veterinario);

        if (indice === -1) {

            return false;

        }

        veterinarios[indice] = veterinario;

        await this.repository.guardarVeterinarios(veterinarios);

        return true;

    }

    async eliminar(id: number): Promise<boolean> {

        const veterinarios = await this.repository.obtenerVeterinarios();

        const nuevosVeterinarios = veterinarios.filter(v => v.id_veterinario !== id);

        if (nuevosVeterinarios.length === veterinarios.length) {

            return false;

        }

        await this.repository.guardarVeterinarios(nuevosVeterinarios);

        return true;

    }

}