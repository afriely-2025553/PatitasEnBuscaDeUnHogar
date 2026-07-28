import { readFile, writeFile } from "fs/promises";
import { Adoptante } from "../models/adoptante";

export class AdoptantesRepository {

    private ruta = "./src/data/adoptantes.json";

    async obtenerAdoptantes(): Promise<Adoptante[]> {

        try {

            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);

        } catch {

            console.log("Error al leer el archivo de adoptantes.");

            return [];

        }

    }

    async guardarAdoptantes(adoptantes: Adoptante[]): Promise<void> {

        try {

            await writeFile(
                this.ruta,
                JSON.stringify(adoptantes, null, 4)
            );

        } catch {

            console.log("Error al guardar los adoptantes.");

        }

    }

}