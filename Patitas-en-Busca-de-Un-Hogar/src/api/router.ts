import { IncomingMessage, ServerResponse } from "http";
import { animalRoutes } from "./animalRouter";
import { especieRoutes } from "./especieRouter"
import { razaRoutes } from "./razaRouter";
import { refugioRoutes } from "./refugioRouter";
import { veterinarioRoutes } from "./veterinarioRouter";
import { adoptanteRoutes } from "./adoptanteRouter";
import { donacionRoutes } from "./donacionRouter";
import { voluntarioRoutes } from "./voluntarioRouter";
import { vacunaRoutes } from "./vacunaRouter";
import { adopcionRoutes } from "./adopcionRouter";

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

    if (url.pathname.startsWith("/refugios")) {

    return refugioRoutes(req, res);
    
    }

    if (url.pathname.startsWith("/veterinarios")) {

    return veterinarioRoutes(req, res);

    }

    if (url.pathname.startsWith("/adoptantes")) {

    return adoptanteRoutes(req, res);

    }

    if (url.pathname.startsWith("/donaciones")) {

    return donacionRoutes(req, res);

    }

    if (url.pathname.startsWith("/voluntarios")) {

    return voluntarioRoutes(req, res);

    }

    if (url.pathname.startsWith("/vacunas")) {

    return vacunaRoutes(req, res);

    }

    if (url.pathname.startsWith("/adopciones")) {

    return adopcionRoutes(req, res);

    }

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        mensaje: "Ruta no encontrada"
    }));

}