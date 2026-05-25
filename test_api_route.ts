import fetch from 'node-fetch';

async function testApi() {
    const res = await fetch('http://localhost:3000/api/vertex-ai/generate-1plus4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            apiKey: process.env.GEMINI_API_KEY || 'test',
            productBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            count: 1
        })
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Headers:', res.headers.get('content-type'));
    console.log('Response:', text);
}

testApi();
