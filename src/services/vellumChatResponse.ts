import vellumClient from "../vellum/vellumClient";
import { Vellum } from "vellum-ai";

async function vellum(question: string) {
  const vellumClientInstance = await vellumClient(
    process.env.VELLUM_API_KEY as string
  );

  // configurable parameters
  const workflowDeploymentName = "chatbot-workflow";
  const releaseTag = "LATEST";
  const inputs: Vellum.WorkflowRequestInputRequest[] = [
    {
      type: "STRING",
      name: "question",
      value: question,
    },
  ];

  // setup the workflow
  const request: Vellum.ExecuteWorkflowRequest = {
    workflowDeploymentName,
    releaseTag,
    inputs,
  };
  // execute the workflow
  const result = await vellumClientInstance.executeWorkflow(request);

  if (result.data.state === "REJECTED") {
    console.log("Workflow execution failed:", result.data.error);
    throw new Error(result.data.error!.message);
  }

  return result.data.outputs;
}

export default vellum;
