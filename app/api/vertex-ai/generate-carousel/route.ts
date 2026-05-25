import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tema, tono, numSlides, apiKey } = body;

        if (!tema || !tono || !numSlides) {
            return NextResponse.json({ error: "Tema, tono y número de slides son requeridos." }, { status: 400 });
        }

        const systemPrompt = `Eres un experto en contenido educativo para Instagram con más de 10 años de experiencia creando carruseles virales.
        El usuario quiere crear un carrusel informativo sobre:

        TEMA: ${tema}
        TONO: ${tono}
        NÚMERO DE SLIDES: ${numSlides}

        Genera la estructura completa del carrusel en formato JSON válido.

        REGLAS DE ESTRUCTURA:
        - Slide 1: PORTADA — Título gancho poderoso que detenga el scroll. Promete un beneficio claro o genera curiosidad genuina. Subtítulo explicativo y atrayente que refuerza el título principal. OBLIGATORIO: El campo 'texto_en_imagen' en el Slide 1 NUNCA puede ser "ninguno", DEBE contener el título gancho para que se renderice sobre la imagen del producto.
        - Slides 2 al ${numSlides - 1}: CONTENIDO — Cada slide enseña UNA idea de forma detallada, explicativa y accionable. Desarrolla el tema a fondo usando datos concretos, ejemplos prácticos o listas de pasos sencillos en el campo 'cuerpo'.
        - Último slide (${numSlides}): CIERRE + CTA — Resumen de los puntos clave enseñados + llamado a la acción específico, valioso y muy humano.

        REGLAS DE CALIDAD:
        - Tono: humano, directo, conversacional, empático, nada corporativo, en español latino de alta conversión.
        - Desarrollo de contenido: haz que los textos sean lo suficientemente explicativos y detallados para aportar un valor real y profundo al lector, evitando explicaciones súper breves o genéricas.
        - Usa números, porcentajes, estadísticas o datos precisos para aportar alta credibilidad.
        - El CTA debe ser natural, invitando al debate, guardado del post o interacción genuina.
        - texto_en_imagen: frase o concepto claro, completo e informativo (máx 20 palabras) estructurado de forma muy legible que sirva para reforzar visualmente el contenido del slide. Usa "ninguno" si solo es imagen de fondo (EXCEPTO EN EL SLIDE 1, donde SIEMPRE debe ir el título).
        - descripcion_imagen: descripción visual súper detallada y cinematográfica para que la IA genere una imagen coherente con el concepto.

Responde ÚNICAMENTE con el JSON, sin markdown, sin texto adicional. El JSON debe tener exactamente esta estructura:
{
  "titulo_carrusel": "...",
  "slides": [
    {
      "numero": 1,
      "tipo": "portada",
      "titulo": "...",
      "subtitulo": "...",
      "descripcion_imagen": "...",
      "texto_en_imagen": "..."
    },
    {
      "numero": 2,
      "tipo": "contenido",
      "titulo": "...",
      "cuerpo": "...",
      "descripcion_imagen": "...",
      "texto_en_imagen": "..."
    },
    {
      "numero": ${numSlides},
      "tipo": "cierre_cta",
      "titulo": "...",
      "cta": "...",
      "descripcion_imagen": "...",
      "texto_en_imagen": "..."
    }
  ],
  "caption_post": "...",
  "hashtags": ["...", "...", "...", "...", "...", "...", "...", "...", "...", "...", "...", "...", "..."]
}`;

        if (!apiKey) {
            return NextResponse.json({ error: "Se requiere API Key de Gemini." }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const result = await model.generateContent([
            systemPrompt,
            `Genera el carrusel de ${numSlides} slides sobre: ${tema}`
        ]);

        const text = result.response.text();
        const parsed = JSON.parse(text);
        return NextResponse.json({ success: true, carousel: parsed });

    } catch (error: any) {
        console.error("Generate Carousel Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
