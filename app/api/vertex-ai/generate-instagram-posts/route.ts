import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productName, productSequence, productDescription, apiKey } = body;

        if (!productName || !productDescription) {
            return NextResponse.json({ error: "El nombre y la descripción del producto son requeridos." }, { status: 400 });
        }

        const sequenceRule = productSequence && productSequence.length === 5 ? `
REGLA DE ASIGNACIÓN DE PRODUCTOS:
El usuario tiene varios productos, y cada post de los 5 a generar tiene asignado un producto ESPECÍFICO. 
Debes enfocar el copy, el concepto y la 'descripcion_imagen' EXCLUSIVAMENTE en el producto asignado a ese post. NUNCA menciones ni describas dos o más productos en el mismo post, ni siquiera si pertenecen a la misma marca. 
Las asignaciones obligatorias son:
- POST 1: Únicamente ${productSequence[0]}
- POST 2: Únicamente ${productSequence[1]}
- POST 3: Únicamente ${productSequence[2]}
- POST 4: Únicamente ${productSequence[3]}
- POST 5: Únicamente ${productSequence[4]}` : '';

        const systemPrompt = `Eres un experto en contenido para Instagram y marketing visual.
El usuario tiene el siguiente producto o catálogo:
PRODUCTOS: ${productName}
DESCRIPCIÓN GENERAL: ${productDescription}

Genera exactamente 5 ideas de posts para Instagram siguiendo este framework probado de conversión:

POST 1 — GANCHO VISUAL
- Concepto: Solo el producto como protagonista, sin distracciones
- Descripción de imagen: [describe la foto ideal, enfocándote SOLO en 1 unidad del producto asignado. NUNCA menciones múltiples envases o productos juntos]
- Caption: [caption gancho, máx 2 líneas + emojis + CTA]
- Texto en imagen: [texto corto si aplica, o "ninguno"]

POST 2 — PROBLEMA / SOLUCIÓN  
- Concepto: El dolor del cliente resuelto por el producto asignado
- Descripción de imagen: [describe la composición. SOLO debe aparecer el producto asignado]
- Caption: [caption que conecta con el dolor + solución]
- Texto en imagen: [frase del problema o solución en la imagen]

POST 3 — LIFESTYLE / ASPIRACIONAL
- Concepto: El producto asignado en uso real
- Descripción de imagen: [escena de vida cotidiana. SOLO 1 envase del producto asignado]
- Caption: [caption aspiracional, tono cálido y cercano]
- Texto en imagen: [frase aspiracional corta o ninguno]

POST 4 — PRUEBA SOCIAL / CREDIBILIDAD
- Concepto: Dato, número o testimonio que genere confianza sobre el producto asignado
- Descripción de imagen: [fondo sólido, tipografía grande y el producto asignado]
- Caption: [caption que refuerza la credibilidad]
- Texto en imagen: [el dato o testimonio en grande]

POST 5 — BENEFICIO ÚNICO / VENTA DIRECTA
- Concepto: Por qué el cliente necesita el producto asignado
- Descripción de imagen: [el producto asignado como centro de atención. NUNCA muestres la línea completa, solo el producto asignado]
- Caption: [caption persuasivo enfocado en los beneficios del producto asignado]
- Texto en imagen: [frase de beneficio directo o ninguno]

REGLAS:
- Tono: directo, humano, nada corporativo
- Idioma: español latino
- Cada post debe ser diferente en composición y emoción
- REGLA CRÍTICA DE PRODUCTO: El producto debe mantenerse exactamente igual, tal como se especifica en el nombre y la descripción. No inventes variaciones, sabores, tipos o modificaciones que no estén en la descripción original. NUNCA mezcles múltiples productos en la 'descripcion_imagen'. ${sequenceRule}
- REGLA DE PRECIOS Y OFERTAS: NUNCA menciones precios, descuentos, promociones, ofertas de liquidación o rebajas. El contenido debe centrarse exclusivamente en el valor, los beneficios y el uso del producto.
- Responde estrictamente en formato JSON válido. Debe ser un objeto con una llave "posts" que contenga un array de exactamente 5 objetos. Cada objeto debe tener las siguientes llaves: 
  "id" (número del 1 al 5),
  "tipo" (string, ej: "GANCHO VISUAL"),
  "concepto" (string),
  "descripcion_imagen" (string),
  "caption" (string),
  "texto_en_imagen" (string),
  "hashtags" (array de 5 a 10 strings de hashtags relevantes al producto e idea del post).`;

        const openAIKey = process.env.OPENAI_API_KEY;

        // 1. Try OpenAI if key is present
        if (openAIKey) {
            try {
                const res = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${openAIKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        response_format: { type: "json_object" },
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: `Genera las 5 ideas de posts para el producto: ${productName}` }
                        ]
                    })
                });

                const data = await res.json();
                if (data.choices?.[0]?.message?.content) {
                    const parsed = JSON.parse(data.choices[0].message.content);
                    return NextResponse.json({ success: true, posts: parsed.posts || parsed });
                }
            } catch (err) {
                console.error("OpenAI Instagram Generation Error, trying Gemini fallback...", err);
            }
        }

        // 2. Fallback to Gemini if OpenAI fails or is not configured
        if (!apiKey) {
            return NextResponse.json({ error: "OpenAI no está configurado, y no hay Gemini API Key en el cliente." }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-2.5-flash for JSON schema generation or gemini-1.5-flash as general fallback
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const result = await model.generateContent([
            systemPrompt,
            `Genera las 5 ideas de posts para el producto: ${productName}`
        ]);

        const text = result.response.text();
        const parsed = JSON.parse(text);
        return NextResponse.json({ success: true, posts: parsed.posts || parsed });

    } catch (error: any) {
        console.error("Generate Instagram Posts Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
