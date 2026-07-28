import { readFile, writeFile } from "fs/promises";
import { Refugio } from "../models/refugio";

export class RefugiosRepository {

    private ruta = "./src/data/refugios.json";

    async obtenerRefugios(): Promise<Refugio[]> {

        try {

            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);

        } catch {

            console.log("Error al leer el archivo de refugios.");

            return [];

        }

    }

    async guardarRefugios(refugios: Refugio[]): Promise<void> {

        try {

            await writeFile(
                this.ruta,
                JSON.stringify(refugios, null, 4)
            );

        } catch {

            console.log("Error al guardar los refugios.");

        }

    }

}