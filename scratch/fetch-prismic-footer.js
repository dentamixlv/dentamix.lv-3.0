import * as prismic from '@prismicio/client';

const repositoryName = 'dentamix-v30';
const client = prismic.createClient(repositoryName);

async function main() {
  try {
    console.log('Fetching footer document from Prismic...');
    const doc = await client.getSingle('footer', { lang: 'lv' });
    console.log('Successfully fetched footer document (lv):');
    console.log(JSON.stringify(doc.data, null, 2));

    const docEn = await client.getSingle('footer', { lang: 'en-us' });
    console.log('\nSuccessfully fetched footer document (en-us):');
    console.log(JSON.stringify(docEn.data, null, 2));
  } catch (error) {
    console.error('Error fetching footer from Prismic:', error);
  }
}

main();
