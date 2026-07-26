import { Animal } from "../models/Animal";
import { AnimalesRepository } from "../data/AnimalesRepository";

export class AnimalService {

    private repository = new AnimalesRepository();

    async listar(): Promise<Animal[]> {

        return await this.repository.obtenerAnimales();

    }

    async buscar(id: number): Promise<Animal | undefined> {

        const animales = await this.repository.obtenerAnimales();

        return animales.find(a => a.id_animal === id);

    }

    async agregar(animal: Animal): Promise<void> {

        const animales = await this.repository.obtenerAnimales();

        animales.push(animal);

        await this.repository.guardarAnimales(animales);

    }

    async actualizar(animal: Animal): Promise<boolean> {

        const animales = await this.repository.obtenerAnimales();

        const indice = animales.findIndex(
            a => a.id_animal === animal.id_animal
        );

        if (indice === -1) {

            return false;

        }

        animales[indice] = animal;

        await this.repository.guardarAnimales(animales);

        return true;

    }

    async eliminar(id: number): Promise<boolean> {

        const animales = await this.repository.obtenerAnimales();

        const indice = animales.findIndex(
            a => a.id_animal === id
        );

        if (indice === -1) {

            return false;

        }

        animales.splice(indice, 1);

        await this.repository.guardarAnimales(animales);

        return true;

    }

}