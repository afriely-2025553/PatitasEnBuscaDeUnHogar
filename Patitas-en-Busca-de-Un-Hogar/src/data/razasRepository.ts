import { readFile, writeFile } from "fs/promises";
import { Raza } from "../models/raza";

export class RazasRepository {

    private ruta = "./src/data/razas.json";

    async obtenerRazas(): Promise<Raza[]> {

        try {

            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);

        } catch {

            console.log("Error al leer el archivo de razas.");

            return [];

        }

    }

    async guardarRazas(razas: Raza[]): Promise<void> {

        try {

            await writeFile(
                this.ruta,
                JSON.stringify(razas, null, 4)
            );

        } catch {

            console.log("Error al guardar las razas.");

        }

    }

}