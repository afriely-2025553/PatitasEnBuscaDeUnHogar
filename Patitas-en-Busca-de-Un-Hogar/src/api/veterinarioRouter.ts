import { IncomingMessage, ServerResponse } from "http";
import { VeterinarioService } from "../service/veterinarioService";
import { Veterinario } from "../models/veterinario";

const service = new VeterinarioService();

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

export async function veterinarioRoutes(
    req: IncomingMessage,
    res: ServerResponse
) {

    const url = new URL(req.url ?? "/", "http://localhost:3000");
    const partes = url.pathname.split("/").filter(Boolean);

    if (partes[0] !== "veterinarios") {

        enviarJson(res, 404, {
            mensaje: "Ruta no encontrada"
        });

        return;

    }

    const id = partes[1] ? Number(partes[1]) : undefined;

    try {

        // GET /veterinarios
        if (req.method === "GET" && id === undefined) {

            const veterinarios = await service.listar();

            enviarJson(res, 200, veterinarios);

            return;

        }

        // GET /veterinarios/1
        if (req.method === "GET" && id !== undefined) {

            const veterinario = await service.buscar(id);

            if (!veterinario) {

                enviarJson(res, 404, {
                    mensaje: "Veterinario no encontrado"
                });

                return;

            }

            enviarJson(res, 200, veterinario);

            return;

        }

        // POST /veterinarios
        if (req.method === "POST") {

            const body = await leerBody(req) as Veterinario;

            await service.agregar(body);

            enviarJson(res, 201, {
                mensaje: "Veterinario agregado correctamente"
            });

            return;

        }

        // PUT /veterinarios/1
        if (req.method === "PUT" && id !== undefined) {

            const body = await leerBody(req) as Veterinario;

            const actualizado = await service.actualizar({
                ...body,
                id_veterinario: id
            });

            if (!actualizado) {

                enviarJson(res, 404, {
                    mensaje: "Veterinario no encontrado"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Veterinario actualizado correctamente"
            });

            return;

        }

        // DELETE /veterinarios/1
        if (req.method === "DELETE" && id !== undefined) {

            const eliminado = await service.eliminar(id);

            if (!eliminado) {

                enviarJson(res, 404, {
                    mensaje: "Veterinario no encontrado"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Veterinario eliminado correctamente"
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