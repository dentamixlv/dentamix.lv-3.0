const key2 = process.env.DENTAMIX_AI_API_KEY;
if (!key2) {
  console.error("Please set the DENTAMIX_AI_API_KEY environment variable");
  process.exit(1);
}

async function testFetch(modelName) {
  console.log(`\nTesting REST fetch for ${modelName}...`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:embedContent?key=${key2}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: {
          parts: [{ text: "Hello world" }]
        },
        outputDimensionality: 768
      })
    });

    if (!res.ok) {
      console.log(`- FAILED: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(text);
      return;
    }

    const data = await res.json();
    console.log(`- SUCCESS! Dimensions: ${data.embedding.values.length}`);
  } catch (err) {
    console.log(`- Error: ${err.message}`);
  }
}

async function run() {
  await testFetch("gemini-embedding-001");
  await testFetch("gemini-embedding-2");
}

run();
