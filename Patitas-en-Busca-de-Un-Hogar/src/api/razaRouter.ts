import { IncomingMessage, ServerResponse } from "http";
import { RazaService } from "../service/razaService";
import { Raza } from "../models/raza";

const service = new RazaService();

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

export async function razaRoutes(
    req: IncomingMessage,
    res: ServerResponse
) {

    const url = new URL(req.url ?? "/", "http://localhost:3000");
    const partes = url.pathname.split("/").filter(Boolean);

    if (partes[0] !== "razas") {

        enviarJson(res, 404, {
            mensaje: "Ruta no encontrada"
        });

        return;

    }

    const id = partes[1] ? Number(partes[1]) : undefined;

    try {

        if (req.method === "GET" && id === undefined) {

            const razas = await service.listar();

            enviarJson(res, 200, razas);

            return;

        }

        if (req.method === "GET" && id !== undefined) {

            const raza = await service.buscar(id);

            if (!raza) {

                enviarJson(res, 404, {
                    mensaje: "Raza no encontrada"
                });

                return;

            }

            enviarJson(res, 200, raza);

            return;

        }

        if (req.method === "POST") {

            const body = await leerBody(req) as Raza;

            await service.agregar(body);

            enviarJson(res, 201, {
                mensaje: "Raza agregada correctamente"
            });

            return;

        }

        if (req.method === "PUT" && id !== undefined) {

            const body = await leerBody(req) as Raza;

            const actualizado = await service.actualizar({
                ...body,
                id_raza: id
            });

            if (!actualizado) {

                enviarJson(res, 404, {
                    mensaje: "Raza no encontrada"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Raza actualizada correctamente"
            });

            return;

        }

        if (req.method === "DELETE" && id !== undefined) {

            const eliminado = await service.eliminar(id);

            if (!eliminado) {

                enviarJson(res, 404, {
                    mensaje: "Raza no encontrada"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Raza eliminada correctamente"
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