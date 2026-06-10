import { execSync } from "child_process";

try {
  console.log("Fetching documents from Convex (with larger buffer)...");
  const output = execSync("npx convex run documents:listAll", { 
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 50 // 50MB buffer
  });
  const docs = JSON.parse(output);
  console.log(`Successfully fetched ${docs.length} documents.`);

  const searchTerms = ["gatve", "rīga", "adazi", "adaži", "brīvības", "brivibas"];
  for (const term of searchTerms) {
    console.log(`\nSearching for term: "${term}"...`);
    const matches = docs.filter(doc => doc.text.toLowerCase().includes(term.toLowerCase()));
    console.log(`Found ${matches.length} matches.`);
    for (const match of matches.slice(0, 3)) {
      console.log(`- ID: ${match._id}`);
      console.log(`  Source: ${match.source}`);
      console.log(`  Text preview: ${match.text.substring(0, 200)}...`);
    }
  }
} catch (err) {
  console.error("Error running script:", err.message);
}
