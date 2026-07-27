import { IncomingMessage, ServerResponse } from "http";
import { animalRoutes } from "./animalRouter";
import { especieRoutes } from "./especieRouter"
import { razaRoutes } from "./razaRouter";

export async function routes(
    req: IncomingMessage,
    res: ServerResponse
) {

    const url = new URL(req.url ?? "/", "http://localhost:3000");

    if (url.pathname.startsWith("/animales")) {

        return animalRoutes(req, res);

    }

    if (url.pathname.startsWith("/especies")) {

        return especieRoutes(req, res);

    }

    if (url.pathname.startsWith("/razas")) {

    return razaRoutes(req, res);

    }

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        mensaje: "Ruta no encontrada"
    }));

}