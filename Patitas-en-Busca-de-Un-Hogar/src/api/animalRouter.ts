import { IncomingMessage, ServerResponse } from "http";
import { AnimalService } from "../service/animalService";
import { Animal } from "../models/animal";

const service = new AnimalService();

function leerBody(req: IncomingMessage): Promise<any> {

    return new Promise((resolve, reject) => {

        let cuerpo = "";

        req.on("data", chunk => {
            cuerpo += chunk;
        });

        req.on("end", () => {

            try {

                resolve(cuerpo ? JSON.parse(cuerpo) : {});

            } catch (error) {

                reject(error);

            }

        });

    });

}

function enviarJson(res: ServerResponse, status: number, data: unknown) {

    res.writeHead(status, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));

}

export async function animalRoutes(req: IncomingMessage, res: ServerResponse) {

    const url = new URL(req.url ?? "/", "http://localhost:3000");
    const partes = url.pathname.split("/").filter(Boolean);

    if (partes[0] !== "animales") {

        enviarJson(res, 404, {
            mensaje: "Ruta no encontrada"
        });

        return;

    }

    const id = partes[1] ? Number(partes[1]) : undefined;

    try {

        // GET /animales
        if (req.method === "GET" && id === undefined) {

            const animales = await service.listar();

            enviarJson(res, 200, animales);

            return;

        }

        // GET /animales/1
        if (req.method === "GET" && id !== undefined) {

            const animal = await service.buscar(id);

            if (!animal) {

                enviarJson(res, 404, {
                    mensaje: "Animal no encontrado"
                });

                return;

            }

            enviarJson(res, 200, animal);

            return;

        }

        // POST /animales
        if (req.method === "POST") {

            const body = await leerBody(req) as Animal;

            await service.agregar(body);

            enviarJson(res, 201, {
                mensaje: "Animal agregado correctamente"
            });

            return;

        }

        // PUT /animales/1
        if (req.method === "PUT" && id !== undefined) {

            const body = await leerBody(req) as Animal;

            const actualizado = await service.actualizar({
                ...body,
                id_animal: id
            });

            if (!actualizado) {

                enviarJson(res, 404, {
                    mensaje: "Animal no encontrado"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Animal actualizado correctamente"
            });

            return;

        }

        // DELETE /animales/1
        if (req.method === "DELETE" && id !== undefined) {

            const eliminado = await service.eliminar(id);

            if (!eliminado) {

                enviarJson(res, 404, {
                    mensaje: "Animal no encontrado"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Animal eliminado correctamente"
            });

            return;

        }

        enviarJson(res, 405, {
            mensaje: "Método no permitido"
        });

    } catch (error) {

        console.error(error);

        enviarJson(res, 500, {
            mensaje: "Error interno del servidor"
        });

    }

}