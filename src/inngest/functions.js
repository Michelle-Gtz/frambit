import { inngest } from "./client";
import {
  gemini,
  createAgent,
  createTool,
  createNetwork,
} from "@inngest/agent-kit";
import Sandbox from "@e2b/code-interpreter";
import { z } from "zod";
import { PROMPT } from "@/prompt";
import { lastAssistanTextMessageContent } from "./utils";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    // ✅ minimal fix: sandboxId exists
    let sandboxId;

    await step.sleep("wait-a-moment", "1s");

    const sandboxUrl = await step.run("run-sandbox", async () => {
      const sandbox = await Sandbox.create("frambit-nextjs");

      // ✅ minimal fix: persist sandbox id
      sandboxId = sandbox.id;

      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: gemini({
        model: "gemini-2.5-flash",
      }),
      tools: [
        // 1. Terminal
        createTool({
          name: "terminall",
          description: "Use the termimnal to run commands",
          parameters: z.object({
            command: z.string(),
          }),

          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              try {
                const sandbox = await Sandbox.connect(sandboxId);
                const result = await sandbox.commands.run(command);
                return result.stdout;
              } catch (error) {
                return "Command failed: " + error;
              }
            });
          },
        }),

        // 2. createOrUpdateFiles  ✅ tool name aligned with PROMPT
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            Files: z.array(
              z.object({
                // ✅ minimal fix: path instead of name
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),

          handler: async ({ Files }, { step, network }) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = network?.state?.data.files || {};

                  const sandbox = await Sandbox.connect(sandboxId);

                  for (const file of Files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (error) {
                  return "Error" + error;
                }
              },
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),

        // 3. readFiles
        createTool({
          name: "readFiles",
          description: "Read files in the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),

          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await Sandbox.connect(sandboxId);
                const contents = [];

                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }

                return JSON.stringify(contents);
              } catch (error) {
                return "Error" + error;
              }
            });
          },
        }),
      ],

      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistanTextMessageContent(result);

          if (
            lastAssistantMessageText &&
            lastAssistantMessageText.includes("<task_summary>")
          ) {
            network.state.data.summary = lastAssistantMessageText;
          }

          return result;
        },
      },
    });

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 10,

      router: async ({ network }) => {
        if (network.state.data.summary) return;
        return codeAgent;
      },
    });

    const result = await network.run(event.data.value);

    return {
      url: sandboxUrl,
      title: "Untitled",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);
