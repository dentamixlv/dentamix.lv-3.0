fetch('https://dentamix-v30.cdn.prismic.io/api/v2')
  .then(r => r.json())
  .then(apiData => {
    const masterRef = apiData.refs.find(r => r.isMasterRef).ref;
    const url = `https://dentamix-v30.cdn.prismic.io/api/v2/documents/search?ref=${masterRef}&lang=*&pageSize=100`;
    return fetch(url);
  })
  .then(r => r.json())
  .then(res => {
    console.log(`Total documents found: ${res.results.length}`);
    const summary = res.results.map(d => ({
      id: d.id,
      uid: d.uid,
      type: d.type,
      lang: d.lang,
      title: d.data?.meta_title || d.data?.title || d.uid || d.id
    }));
    console.log(JSON.stringify(summary, null, 2));
  })
  .catch(console.error);
