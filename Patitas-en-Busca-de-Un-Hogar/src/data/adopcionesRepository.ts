import { readFile, writeFile } from "fs/promises";
import { Adopcion } from "../models/adopcion";

export class AdopcionesRepository {

    private ruta = "./src/data/adopciones.json";

    async obtenerAdopciones(): Promise<Adopcion[]> {

        try {

            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);

        } catch {

            console.log("Error al leer el archivo de adopciones.");

            return [];

        }

    }

    async guardarAdopciones(adopciones: Adopcion[]): Promise<void> {

        try {

            await writeFile(
                this.ruta,
                JSON.stringify(adopciones, null, 4)
            );

        } catch {

            console.log("Error al guardar las adopciones.");

        }

    }

}