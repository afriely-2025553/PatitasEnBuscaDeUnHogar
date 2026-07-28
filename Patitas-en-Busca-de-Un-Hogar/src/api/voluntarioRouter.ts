import { IncomingMessage, ServerResponse } from "http";
import { VoluntarioService } from "../service/voluntarioService";
import { Voluntario } from "../models/voluntario";

const service = new VoluntarioService();

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

export async function voluntarioRoutes(
    req: IncomingMessage,
    res: ServerResponse
) {

    const url = new URL(req.url ?? "/", "http://localhost:3000");
    const partes = url.pathname.split("/").filter(Boolean);

    if (partes[0] !== "voluntarios") {

        enviarJson(res, 404, {
            mensaje: "Ruta no encontrada"
        });

        return;

    }

    const id = partes[1] ? Number(partes[1]) : undefined;

    try {

        if (req.method === "GET" && id === undefined) {

            const voluntarios = await service.listar();

            enviarJson(res, 200, voluntarios);

            return;

        }

        if (req.method === "GET" && id !== undefined) {

            const voluntario = await service.buscar(id);

            if (!voluntario) {

                enviarJson(res, 404, {
                    mensaje: "Voluntario no encontrado"
                });

                return;

            }

            enviarJson(res, 200, voluntario);

            return;

        }

        if (req.method === "POST") {

            const body = await leerBody(req) as Voluntario;

            await service.agregar(body);

            enviarJson(res, 201, {
                mensaje: "Voluntario agregado correctamente"
            });

            return;

        }

        if (req.method === "PUT" && id !== undefined) {

            const body = await leerBody(req) as Voluntario;

            const actualizado = await service.actualizar({
                ...body,
                id_voluntario: id
            });

            if (!actualizado) {

                enviarJson(res, 404, {
                    mensaje: "Voluntario no encontrado"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Voluntario actualizado correctamente"
            });

            return;

        }

        if (req.method === "DELETE" && id !== undefined) {

            const eliminado = await service.eliminar(id);

            if (!eliminado) {

                enviarJson(res, 404, {
                    mensaje: "Voluntario no encontrado"
                });

                return;

            }

            enviarJson(res, 200, {
                mensaje: "Voluntario eliminado correctamente"
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