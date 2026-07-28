import { IncomingMessage, ServerResponse } from "http";
import { DonacionService } from "../service/donacionService";
import { Donacion } from "../models/donacion";

const service = new DonacionService();

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

export async function donacionRoutes(
    req: IncomingMessage,
    res: ServerResponse
) {

    const url = new URL(req.url ?? "/", "http://localhost:3000");
    const partes = url.pathname.split("/").filter(Boolean);

    if (partes[0] !== "donaciones") {

        enviarJson(res, 404, {
            mensaje: "Ruta no encontrada"
        });

        return;

    }

    const id = partes[1] ? Number(partes[1]) : undefined;

    try {

        // GET /donaciones
        if (req.method === "GET" && id === undefined) {

            const donaciones = await service.listar();

            enviarJson(res, 200, donaciones);

            return;

        }

        // GET /donaciones/1
        if (req.method === "GET" && id !== undefined) {

            const donacion = await service.buscar(id);

            if (!donacion) {

                enviarJson(res, 404, {
                    mensaje: "Donación no encontrada"
                });

                return;

            }

            enviarJson(res, 200, donacion);

            return;

        }

        // POST /donaciones
        if (req.method === "POST") {

            const body = await leerBody(req) as Donacion;

            await service.agregar(body);

            enviarJson(res, 201, {
                mensaje: "Donación agregada correctamente"
            });

            return;

        }

        // PUT /donaciones/1
        if (req.method === "PUT" && id !== undefined) {

            const body = await leerBody(req) as Donacion;

            const actualizado = await service.actualizar({
                ...body,
                id_donacion: id
            });

            if (!actualizado) {

                enviarJson(res, 404, {
                    mensaje: "Donación no encontrada"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Donación actualizada correctamente"
            });

            return;

        }

        // DELETE /donaciones/1
        if (req.method === "DELETE" && id !== undefined) {

            const eliminado = await service.eliminar(id);

            if (!eliminado) {

                enviarJson(res, 404, {
                    mensaje: "Donación no encontrada"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Donación eliminada correctamente"
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