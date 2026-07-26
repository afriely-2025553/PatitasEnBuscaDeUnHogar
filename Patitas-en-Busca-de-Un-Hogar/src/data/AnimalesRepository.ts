import { readFile, writeFile } from "fs/promises";
import { Animal } from "../models/animal";

export class AnimalesRepository {

    private ruta = "./src/data/animales.json";

    async obtenerAnimales(): Promise<Animal[]> {

        try {

            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);

        } catch (error) {

            console.log("Error al leer el archivo de animales.");

            return [];

        }

    }

    async guardarAnimales(animales: Animal[]): Promise<void> {

        try {

            await writeFile(
                this.ruta,
                JSON.stringify(animales, null, 4)
            );

        } catch (error) {

            console.log("Error al guardar el archivo de animales.");

        }

    }

}