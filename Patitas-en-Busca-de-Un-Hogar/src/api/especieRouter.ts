import { IncomingMessage, ServerResponse } from "http";
import { EspecieService } from "../service/especieService";
import { Especie } from "../models/especie";

const service = new EspecieService();

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

export async function especieRoutes(req: IncomingMessage, res: ServerResponse) {

    const url = new URL(req.url ?? "/", "http://localhost:3000");
    const partes = url.pathname.split("/").filter(Boolean);

    if (partes[0] !== "especies") {

        enviarJson(res, 404, {
            mensaje: "Ruta no encontrada"
        });

        return;

    }

    const id = partes[1] ? Number(partes[1]) : undefined;

    try {

        // GET /especies
        if (req.method === "GET" && id === undefined) {

            const especies = await service.listar();

            enviarJson(res, 200, especies);

            return;

        }

        // GET /especies/1
        if (req.method === "GET" && id !== undefined) {

            const especie = await service.buscar(id);

            if (!especie) {

                enviarJson(res, 404, {
                    mensaje: "Especie no encontrada"
                });

                return;

            }

            enviarJson(res, 200, especie);

            return;

        }

        // POST /especies
        if (req.method === "POST") {

            const body = await leerBody(req) as Especie;

            await service.agregar(body);

            enviarJson(res, 201, {
                mensaje: "Especie agregada correctamente"
            });

            return;

        }

        // PUT /especies/1
        if (req.method === "PUT" && id !== undefined) {

            const body = await leerBody(req) as Especie;

            const actualizado = await service.actualizar({
                ...body,
                id_especie: id
            });

            if (!actualizado) {

                enviarJson(res, 404, {
                    mensaje: "Especie no encontrada"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Especie actualizada correctamente"
            });

            return;

        }

        // DELETE /especies/1
        if (req.method === "DELETE" && id !== undefined) {

            const eliminado = await service.eliminar(id);

            if (!eliminado) {

                enviarJson(res, 404, {
                    mensaje: "Especie no encontrada"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Especie eliminada correctamente"
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