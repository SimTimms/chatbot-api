import { VellumClient } from "vellum-ai";

const vellumClient = new VellumClient({
  apiKey: "RwyRNfQ9.06BXTwL17qVw6uzU9TpGEtFoBVHrwi5U",
});

async function vellum(question: string) {
  const result = await vellumClient.executePrompt({
    promptDeploymentName: "chat-bot-sandbox-deployment",
    releaseTag: "LATEST",
    inputs: [{ type: "STRING", name: "question", value: question }],
  });

  if (result.state === "REJECTED") {
    throw new Error(result.error.message);
  } else if (result.state === "FULFILLED") {
    console.log(result.outputs[0].value);
  }
  return result.outputs[0].value;
}

export default vellum;
