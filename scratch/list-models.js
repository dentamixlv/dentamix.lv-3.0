const key2 = process.env.DENTAMIX_AI_API_KEY;
if (!key2) {
  console.error("Please set the DENTAMIX_AI_API_KEY environment variable");
  process.exit(1);
}

async function run() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key2}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Failed to list models: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(text);
      return;
    }
    const data = await res.json();
    console.log("Available models:");
    for (const model of data.models) {
      console.log(`- ${model.name} (supports: ${model.supportedGenerationMethods.join(", ")})`);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

run();
