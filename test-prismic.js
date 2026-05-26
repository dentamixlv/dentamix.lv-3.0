import { createClient } from "@prismicio/client";
import fs from "fs";

const sm = JSON.parse(fs.readFileSync("./slicemachine.config.json", "utf8"));
const client = createClient(sm.repositoryName);

async function main() {
  try {
    const docs = await client.dangerouslyGetAll();
    console.log("ALL DOCUMENTS:");
    console.log(JSON.stringify(docs.map(d => ({ id: d.id, uid: d.uid, type: d.type, lang: d.lang })), null, 2));
  } catch (err) {
    console.error("Error fetching documents:", err);
  }
}

main();
