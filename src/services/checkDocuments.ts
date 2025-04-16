// npm install vellum-ai
const { VellumClient } = require("vellum-ai");

// create your API key here: https://app.vellum.ai/api-keys#keys
const vellumClient = new VellumClient({
  apiKey: "RwyRNfQ9.06BXTwL17qVw6uzU9TpGEtFoBVHrwi5U",
});

async function checkDocuments(question: string) {
  const searchResult = await vellumClient.search({
    indexName: "faq-document",
    query: question,
    options: {
      limit: 3,
      weights: {
        semanticSimilarity: 0.8,
        keywords: 0.2,
      },
      resultMerging: {
        enabled: true,
      },
    },
  });
  console.log("dd", searchResult);
  return searchResult;
}

export default checkDocuments;
