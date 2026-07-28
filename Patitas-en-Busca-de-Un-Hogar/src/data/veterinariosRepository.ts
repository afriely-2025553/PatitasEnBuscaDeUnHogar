import { readFile, writeFile } from "fs/promises";
import { Veterinario } from "../models/veterinario";

export class VeterinariosRepository {

    private ruta = "./src/data/veterinarios.json";

    async obtenerVeterinarios(): Promise<Veterinario[]> {

        try {

            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);

        } catch {

            console.log("Error al leer el archivo de veterinarios.");

            return [];

        }

    }

    async guardarVeterinarios(veterinarios: Veterinario[]): Promise<void> {

        try {

            await writeFile(
                this.ruta,
                JSON.stringify(veterinarios, null, 4)
            );

        } catch {

            console.log("Error al guardar los veterinarios.");

        }

    }

}