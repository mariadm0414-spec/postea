const fs = require('fs');

let page = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

// 1. Update handleGenerateInstagram
const igTarget = `    const handleGenerateInstagram = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key en la pestaña de Configuración para activar la IA", type: 'error' });
            return;
        }
        if (!activeProject?.productName) {
            setToast({ msg: "Configura el nombre del producto primero", type: 'error' });
            return;
        }
        if (!instagramDescription.trim()) {
            setToast({ msg: "Ingresa una descripción para el producto", type: 'error' });
            return;
        }
        if (!activeProject?.productPreview) {
            setToast({ msg: "⚠️ Sube una foto de tu producto en la sección superior para poder generar las imágenes de los posts.", type: 'error' });
            return;
        }

        setIsGeneratingInstagram(true);
        setInstagramPosts([]);

        try {
            const res = await fetch("/api/vertex-ai/generate-instagram-posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productName: activeProject.productName,
                    productDescription: instagramDescription,
                    apiKey: apiKey
                })
            });`;

const igReplacement = `    const handleGenerateInstagram = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key en la pestaña de Configuración para activar la IA", type: 'error' });
            return;
        }

        const selectedProductsObj = savedProducts.filter(p => selectedProjectProducts.includes(p.id));
        const hasSelectedProducts = selectedProductsObj.length > 0;
        const hasCustomImage = !!activeProject?.productPreview;

        if (!hasCustomImage && !hasSelectedProducts) {
            setToast({ msg: "Sube una foto de tu producto o selecciona productos de la marca.", type: 'error' });
            return;
        }

        const productNames = hasSelectedProducts ? selectedProductsObj.map(p => p.nombre).join(', ') : activeProject?.productName || "Mis Productos";
        const extraDesc = hasSelectedProducts ? "Productos seleccionados: " + selectedProductsObj.map(p => \`\${p.nombre} (\${p.categoria})\`).join('. ') : "";
        const combinedDescription = instagramDescription.trim() ? \`\${instagramDescription}\\n\\n\${extraDesc}\` : extraDesc;

        setIsGeneratingInstagram(true);
        setInstagramPosts([]);

        try {
            const res = await fetch("/api/vertex-ai/generate-instagram-posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productName: productNames,
                    productDescription: combinedDescription,
                    apiKey: apiKey
                })
            });`;

if(page.includes(igTarget)) {
    page = page.replace(igTarget, igReplacement);
    console.log("Updated handleGenerateInstagram start");
} else {
    console.log("Could not find igTarget");
}


// Replace image generation in handleGenerateInstagram
const igImgTarget = `                // Call image generation for each post sequentially with delay and retries
                const productBase64 = activeProject.productPreview.split(",")[1] || "";
                const mimeType = activeProject.productPreview.includes("image/png") ? "image/png" : "image/jpeg";
                const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=\${apiKey}\`;`;

const igImgReplacement = `                // Call image generation for each post sequentially with delay and retries
                const primaryImage = activeProject?.productPreview || (selectedProductsObj.find(p => p.imagenes?.[0])?.imagenes[0]);
                const productBase64 = primaryImage ? primaryImage.split(",")[1] || "" : "";
                const mimeType = primaryImage && primaryImage.includes("image/png") ? "image/png" : "image/jpeg";
                const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=\${apiKey}\`;`;

if(page.includes(igImgTarget)) {
    page = page.replace(igImgTarget, igImgReplacement);
    console.log("Updated handleGenerateInstagram image setup");
} else {
    console.log("Could not find igImgTarget");
}


// Replace image prompt in handleGenerateInstagram
const igPromptTarget = `                                const res = await fetch(url, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        contents: [{
                                            parts: [
                                                { inlineData: { data: productBase64, mimeType } },
                                                { text: prompt }
                                            ]
                                        }],
                                        generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
                                    })
                                });`;

const igPromptReplacement = `                                const parts = [{ text: prompt }];
                                if (productBase64) {
                                    parts.unshift({ inlineData: { data: productBase64, mimeType } });
                                }
                                const res = await fetch(url, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        contents: [{ parts }],
                                        generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
                                    })
                                });`;

if(page.includes(igPromptTarget)) {
    page = page.replace(igPromptTarget, igPromptReplacement);
    console.log("Updated handleGenerateInstagram prompt setup");
} else {
    console.log("Could not find igPromptTarget");
}


// 2. Update handleGenerateCarousel
const carTarget = `    const handleGenerateCarousel = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key para activar la IA", type: 'error' });
            return;
        }
        if (!carouselTema.trim()) {
            setToast({ msg: "Escribe el tema del carrusel", type: 'error' });
            return;
        }
        if (!activeProject?.productPreview) {
            setToast({ msg: "⚠️ Sube una foto de tu producto primero", type: 'error' });
            return;
        }

        setIsGeneratingCarousel(true);
        setCarouselData(null);

        try {
            // STEP 1: Generate structure with Gemini
            const res = await fetch('/api/vertex-ai/generate-carousel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tema: carouselTema,
                    tono: carouselTono,
                    numSlides: carouselNumSlides,
                    apiKey
                })
            });`;

const carReplacement = `    const handleGenerateCarousel = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key para activar la IA", type: 'error' });
            return;
        }

        const selectedProductsObj = savedProducts.filter(p => selectedProjectProducts.includes(p.id));
        const hasSelectedProducts = selectedProductsObj.length > 0;
        const hasCustomImage = !!activeProject?.productPreview;

        if (!hasCustomImage && !hasSelectedProducts) {
            setToast({ msg: "Sube una foto de tu producto o selecciona productos de la marca.", type: 'error' });
            return;
        }

        const productNames = hasSelectedProducts ? selectedProductsObj.map(p => p.nombre).join(', ') : activeProject?.productName || "Mis Productos";
        const extraDesc = hasSelectedProducts ? "Productos seleccionados: " + selectedProductsObj.map(p => \`\${p.nombre} (\${p.categoria})\`).join('. ') : "";
        const finalTema = carouselTema.trim() ? \`\${carouselTema}\\n\\n\${extraDesc}\` : \`Vender \${productNames}\\n\\n\${extraDesc}\`;

        setIsGeneratingCarousel(true);
        setCarouselData(null);

        try {
            // STEP 1: Generate structure with Gemini
            const res = await fetch('/api/vertex-ai/generate-carousel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tema: finalTema,
                    tono: carouselTono,
                    numSlides: carouselNumSlides,
                    apiKey
                })
            });`;

if(page.includes(carTarget)) {
    page = page.replace(carTarget, carReplacement);
    console.log("Updated handleGenerateCarousel start");
} else {
    console.log("Could not find carTarget");
}


// Replace image generation in handleGenerateCarousel
const carImgTarget = `            // STEP 2: Generate images sequentially
            const productBase64 = activeProject.productPreview.split(",")[1] || "";
            const mimeType = activeProject.productPreview.includes("image/png") ? "image/png" : "image/jpeg";
            const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=\${apiKey}\`;`;

const carImgReplacement = `            // STEP 2: Generate images sequentially
            const primaryImage = activeProject?.productPreview || (selectedProductsObj.find(p => p.imagenes?.[0])?.imagenes[0]);
            const productBase64 = primaryImage ? primaryImage.split(",")[1] || "" : "";
            const mimeType = primaryImage && primaryImage.includes("image/png") ? "image/png" : "image/jpeg";
            const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=\${apiKey}\`;`;

if(page.includes(carImgTarget)) {
    page = page.replace(carImgTarget, carImgReplacement);
    console.log("Updated handleGenerateCarousel image setup");
} else {
    console.log("Could not find carImgTarget");
}


// Replace image prompt in handleGenerateCarousel
const carPromptTarget = `                            const imgRes = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contents: [{
                                        parts: [
                                            { inlineData: { data: productBase64, mimeType } },
                                            { text: imagePrompt }
                                        ]
                                    }],
                                    generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
                                })
                            });`;

const carPromptReplacement = `                            const parts = [{ text: imagePrompt }];
                            if (productBase64) {
                                parts.unshift({ inlineData: { data: productBase64, mimeType } });
                            }
                            const imgRes = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contents: [{ parts }],
                                    generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
                                })
                            });`;

if(page.includes(carPromptTarget)) {
    page = page.replace(carPromptTarget, carPromptReplacement);
    console.log("Updated handleGenerateCarousel prompt setup");
} else {
    console.log("Could not find carPromptTarget");
}

fs.writeFileSync('app/dashboard/page.tsx', page);
console.log("Done");
