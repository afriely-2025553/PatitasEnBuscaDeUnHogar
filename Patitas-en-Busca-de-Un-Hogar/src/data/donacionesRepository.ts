import { readFile, writeFile } from "fs/promises";
import { Donacion } from "../models/donacion";

export class DonacionesRepository {

    private ruta = "./src/data/donaciones.json";

    async obtenerDonaciones(): Promise<Donacion[]> {

        try {

            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);

        } catch {

            console.log("Error al leer el archivo de donaciones.");

            return [];

        }

    }

    async guardarDonaciones(donaciones: Donacion[]): Promise<void> {

        try {

            await writeFile(
                this.ruta,
                JSON.stringify(donaciones, null, 4)
            );

        } catch {

            console.log("Error al guardar las donaciones.");

        }

    }

}