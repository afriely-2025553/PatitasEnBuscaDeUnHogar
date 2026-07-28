import { readFile, writeFile } from "fs/promises";
import { Voluntario } from "../models/voluntario";

export class VoluntariosRepository {

    private ruta = "./src/data/voluntarios.json";

    async obtenerVoluntarios(): Promise<Voluntario[]> {

        try {

            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);

        } catch {

            console.log("Error al leer el archivo de voluntarios.");

            return [];

        }

    }

    async guardarVoluntarios(voluntarios: Voluntario[]): Promise<void> {

        try {

            await writeFile(
                this.ruta,
                JSON.stringify(voluntarios, null, 4)
            );

        } catch {

            console.log("Error al guardar los voluntarios.");

        }

    }

}