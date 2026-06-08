fetch('https://dentamix-v30.cdn.prismic.io/api/v2')
  .then(r => r.json())
  .then(apiData => {
    const masterRef = apiData.refs.find(r => r.isMasterRef).ref;
    const url = `https://dentamix-v30.cdn.prismic.io/api/v2/documents/search?ref=${masterRef}&lang=*&pageSize=100`;
    return fetch(url);
  })
  .then(r => r.json())
  .then(res => {
    function extractTextFromPrismic(obj) {
      const texts = [];
      function traverse(node) {
        if (!node) return;
        if (typeof node === "string") {
          const trimmed = node.trim();
          if (trimmed && trimmed.length > 3 && !trimmed.startsWith("http")) {
            texts.push(trimmed);
          }
          return;
        }
        if (Array.isArray(node)) {
          const isRichText = node.length > 0 && node.every(item => item && typeof item.type === "string" && typeof item.text === "string");
          if (isRichText) {
            const fullText = node.map(item => item.text).join("\n").trim();
            if (fullText) {
              texts.push(fullText);
            }
            return;
          }
          for (const item of node) {
            traverse(item);
          }
          return;
        }
        if (typeof node === "object") {
          for (const key of Object.keys(node)) {
            if (["link_type", "dimensions", "copyright", "edit", "id", "slice_type", "slice_label", "variation", "version"].includes(key)) {
              continue;
            }
            traverse(node[key]);
          }
        }
      }
      traverse(obj);
      return texts;
    }

    console.log("--- FOOTER EXAMPLE ---");
    const footer = res.results.find(d => d.type === 'footer');
    if (footer) {
      console.log("Footer text crawler output:");
      console.log(extractTextFromPrismic(footer.data).slice(0, 10));
      console.log("\nFooter raw clinics data:");
      console.log(JSON.stringify(footer.data.clinics, null, 2));
    }

    console.log("\n--- HOMEPAGE EXAMPLE ---");
    const home = res.results.find(d => d.type === 'homepage');
    if (home) {
      console.log("Homepage texts:");
      console.log(extractTextFromPrismic(home.data).slice(0, 10));
    }

    console.log("\n--- SERVICE DETAIL PAGE EXAMPLE (zobu-higiena) ---");
    const service = res.results.find(d => d.uid === 'zobu-higiena');
    if (service) {
      console.log("Service Page texts:");
      console.log(extractTextFromPrismic(service.data).slice(0, 10));
    }

    console.log("\n--- DOCTOR PROFILE PAGE EXAMPLE (ineta-majore) ---");
    const doctor = res.results.find(d => d.uid === 'ineta-majore');
    if (doctor) {
      console.log("Doctor Page texts:");
      console.log(extractTextFromPrismic(doctor.data).slice(0, 10));
    }
  })
  .catch(console.error);
