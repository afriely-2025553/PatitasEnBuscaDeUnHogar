import { IncomingMessage, ServerResponse } from "http";
import { AdoptanteService } from "../service/adoptanteService";
import { Adoptante } from "../models/adoptante";

const service = new AdoptanteService();

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

export async function adoptanteRoutes(
    req: IncomingMessage,
    res: ServerResponse
) {

    const url = new URL(req.url ?? "/", "http://localhost:3000");
    const partes = url.pathname.split("/").filter(Boolean);

    if (partes[0] !== "adoptantes") {

        enviarJson(res, 404, {
            mensaje: "Ruta no encontrada"
        });

        return;

    }

    const id = partes[1] ? Number(partes[1]) : undefined;

    try {

        if (req.method === "GET" && id === undefined) {

            const adoptantes = await service.listar();
            enviarJson(res, 200, adoptantes);
            return;

        }

        if (req.method === "GET" && id !== undefined) {

            const adoptante = await service.buscar(id);

            if (!adoptante) {

                enviarJson(res, 404, {
                    mensaje: "Adoptante no encontrado"
                });

                return;

            }

            enviarJson(res, 200, adoptante);
            return;

        }

        if (req.method === "POST") {

            const body = await leerBody(req) as Adoptante;

            await service.agregar(body);

            enviarJson(res, 201, {
                mensaje: "Adoptante agregado correctamente"
            });

            return;

        }

        if (req.method === "PUT" && id !== undefined) {

            const body = await leerBody(req) as Adoptante;

            const actualizado = await service.actualizar({
                ...body,
                id_adoptante: id
            });

            if (!actualizado) {

                enviarJson(res, 404, {
                    mensaje: "Adoptante no encontrado"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Adoptante actualizado correctamente"
            });

            return;

        }

        if (req.method === "DELETE" && id !== undefined) {

            const eliminado = await service.eliminar(id);

            if (!eliminado) {

                enviarJson(res, 404, {
                    mensaje: "Adoptante no encontrado"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Adoptante eliminado correctamente"
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