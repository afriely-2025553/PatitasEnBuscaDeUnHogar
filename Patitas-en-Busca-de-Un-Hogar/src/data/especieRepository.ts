import { readFile, writeFile } from "fs/promises";
import { Especie } from "../models/especie";

export class EspeciesRepository {

    private ruta = "./src/data/especies.json";

    async obtenerEspecies(): Promise<Especie[]> {

        try {

            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);

        } catch {

            return [];

        }

    }

    async guardarEspecies(especies: Especie[]): Promise<void> {

        await writeFile(
            this.ruta,
            JSON.stringify(especies, null, 4)
        );

    }

}