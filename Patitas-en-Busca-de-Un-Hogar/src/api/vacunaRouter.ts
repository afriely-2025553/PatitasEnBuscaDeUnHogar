import { IncomingMessage, ServerResponse } from "http";
import { VacunaService } from "../service/vacunaService";
import { Vacuna } from "../models/vacuna";

const service = new VacunaService();

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

export async function vacunaRoutes(
    req: IncomingMessage,
    res: ServerResponse
) {

    const url = new URL(req.url ?? "/", "http://localhost:3000");
    const partes = url.pathname.split("/").filter(Boolean);

    if (partes[0] !== "vacunas") {

        enviarJson(res, 404, { mensaje: "Ruta no encontrada" });
        return;

    }

    const id = partes[1] ? Number(partes[1]) : undefined;

    try {

        if (req.method === "GET" && id === undefined) {

            const vacunas = await service.listar();
            enviarJson(res, 200, vacunas);
            return;

        }

        if (req.method === "GET" && id !== undefined) {

            const vacuna = await service.buscar(id);

            if (!vacuna) {

                enviarJson(res, 404, { mensaje: "Vacuna no encontrada" });
                return;

            }

            enviarJson(res, 200, vacuna);
            return;

        }

        if (req.method === "POST") {

            const body = await leerBody(req) as Vacuna;

            await service.agregar(body);

            enviarJson(res, 201, { mensaje: "Vacuna agregada correctamente" });
            return;

        }

        if (req.method === "PUT" && id !== undefined) {

            const body = await leerBody(req) as Vacuna;

            const actualizado = await service.actualizar({
                ...body,
                id_vacuna: id
            });

            if (!actualizado) {

                enviarJson(res, 404, { mensaje: "Vacuna no encontrada" });
                return;

            }

            enviarJson(res, 200, { mensaje: "Vacuna actualizada correctamente" });
            return;

        }

        if (req.method === "DELETE" && id !== undefined) {

            const eliminado = await service.eliminar(id);

            if (!eliminado) {

                enviarJson(res, 404, { mensaje: "Vacuna no encontrada" });
                return;

            }

            enviarJson(res, 200, { mensaje: "Vacuna eliminada correctamente" });
            return;

        }

        enviarJson(res, 405, { mensaje: "Método no permitido" });

    } catch (error) {

        console.error(error);

        enviarJson(res, 500, { mensaje: "Error interno del servidor" });

    }

}