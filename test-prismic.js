import { createClient } from "@prismicio/client";
import fs from "fs";

const sm = JSON.parse(fs.readFileSync("./slicemachine.config.json", "utf8"));
const client = createClient(sm.repositoryName);

async function main() {
  try {
    const docs = await client.getAllByType("footer", { lang: "*" });
    console.log("FOOTER DOCUMENTS DATA:");
    console.log(JSON.stringify(docs.map(d => ({
      id: d.id,
      lang: d.lang,
      data: d.data
    })), null, 2));
  } catch (err) {
    console.error("Error fetching documents:", err);
  }
}

main();
