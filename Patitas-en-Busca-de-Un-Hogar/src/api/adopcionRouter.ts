import { IncomingMessage, ServerResponse } from "http";
import { AdopcionService } from "../service/adopcionService";
import { Adopcion } from "../models/adopcion";

const service = new AdopcionService();

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

export async function adopcionRoutes(
    req: IncomingMessage,
    res: ServerResponse
) {

    const url = new URL(req.url ?? "/", "http://localhost:3000");
    const partes = url.pathname.split("/").filter(Boolean);

    if (partes[0] !== "adopciones") {

        enviarJson(res, 404, { mensaje: "Ruta no encontrada" });
        return;

    }

    const id = partes[1] ? Number(partes[1]) : undefined;

    try {

        if (req.method === "GET" && id === undefined) {

            const adopciones = await service.listar();
            enviarJson(res, 200, adopciones);
            return;

        }

        if (req.method === "GET" && id !== undefined) {

            const adopcion = await service.buscar(id);

            if (!adopcion) {

                enviarJson(res, 404, { mensaje: "Adopción no encontrada" });
                return;

            }

            enviarJson(res, 200, adopcion);
            return;

        }

        if (req.method === "POST") {

            const body = await leerBody(req) as Adopcion;

            await service.agregar(body);

            enviarJson(res, 201, { mensaje: "Adopción agregada correctamente" });
            return;

        }

        if (req.method === "PUT" && id !== undefined) {

            const body = await leerBody(req) as Adopcion;

            const actualizado = await service.actualizar({
                ...body,
                id_adopcion: id
            });

            if (!actualizado) {

                enviarJson(res, 404, { mensaje: "Adopción no encontrada" });
                return;

            }

            enviarJson(res, 200, { mensaje: "Adopción actualizada correctamente" });
            return;

        }

        if (req.method === "DELETE" && id !== undefined) {

            const eliminado = await service.eliminar(id);

            if (!eliminado) {

                enviarJson(res, 404, { mensaje: "Adopción no encontrada" });
                return;

            }

            enviarJson(res, 200, { mensaje: "Adopción eliminada correctamente" });
            return;

        }

        enviarJson(res, 405, { mensaje: "Método no permitido" });

    } catch (error) {

        console.error(error);

        enviarJson(res, 500, { mensaje: "Error interno del servidor" });

    }

}