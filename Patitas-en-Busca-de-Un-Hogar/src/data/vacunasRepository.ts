import { readFile, writeFile } from "fs/promises";
import { Vacuna } from "../models/vacuna";

export class VacunasRepository {

    private ruta = "./src/data/vacunas.json";

    async obtenerVacunas(): Promise<Vacuna[]> {

        try {

            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);

        } catch {

            console.log("Error al leer el archivo de vacunas.");

            return [];

        }

    }

    async guardarVacunas(vacunas: Vacuna[]): Promise<void> {

        try {

            await writeFile(
                this.ruta,
                JSON.stringify(vacunas, null, 4)
            );

        } catch {

            console.log("Error al guardar las vacunas.");

        }

    }

}