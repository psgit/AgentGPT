import type { Message } from "../types/agentTypes";
import WindowButton from "./WindowButton";
import { FaFileCode } from "react-icons/fa";
import json2md from "json2md";

const executing = 'Executing "';
const JSON_MIME_TYPE = "application/json";
const MARKDOWN_MIME_TYPE = "text/markdown";

export interface Task {
  name: string;
  executions: Execution[];
}

export interface Execution {
  response: string;
}

export interface Agent {
  name: string;
  goal: string;
  tasks: Task[];
}

const extractTaskName = (message: Message): string => {
  if (message.info && message.info.startsWith("Executing")) {
    return message.info.substr(
      executing.length,
      message.info.length - executing.length - 1
    );
  }
};

const createTask = (message: Message): Task => {
  return { name: message.value, executions: [] };
};

const createAgent = ({ messages }: { messages: Message[] }): Agent => {
  let agent: Agent = undefined;
  let tasks = {};
  messages.map((message: Message) => {
    switch (message.type) {
      case "goal": {
        agent = {
          name: "TODO set agent name",
          goal: message.value,
          tasks: [],
        };
        break;
      }
      case "task": {
        if (agent && message.value) {
          let task = createTask(message);
          tasks[task.name] = task;
          agent.tasks.push(task);
        }
        break;
      }
      case "action": {
        const taskName = extractTaskName(message);
        if (taskName) {
          tasks[taskName]?.executions.push({
            response: message.value,
          });
        }
        break;
      }
    }
  });
  return agent;
};

const encodeBase64 = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");

const convertToDataUrl = (mimeType: string, str: string): string => {
  return "data: " + mimeType + ";base64," + encodeBase64(str);
};

const convertToJSON = (obj: any): string => {
  return JSON.stringify(obj, null, 2);
};

const convertAgentToJSONDataUrl = (agent: Agent): string => {
  return convertToDataUrl(JSON_MIME_TYPE, convertToJSON(agent));
};

const convertAgentToMarkdown = (agent: Agent): any => {
  const md = [{ h1: "Agent: " + agent.name }, { h2: "Goal " + agent.goal }];
  for (let task of agent.tasks) {
    md.push({ h3: "Task: " + task.name });
    for (let execution of task.executions) {
      md.push({ h4: "Execution: " + execution.response });
    }
  }
  md.push([
    {
      hr: "",
    },
    { p: "Below is a representation in JSON:" },
    {
      code: {
        language: "json",
        content: [convertToJSON(agent)],
      },
    },
  ]);
  return json2md(md);
};

const convertAgentToMarkdownDataUrl = (agent: Agent): string => {
  return convertToDataUrl(MARKDOWN_MIME_TYPE, convertAgentToMarkdown(agent));
};

const TreeViewButton = ({ messages }: { messages: Message[] }) => {
  const saveTreeView = (messages: Message[]) => {
    const agent = createAgent(messages);
    const link = document.createElement("a");
    const url = convertAgentToMarkdownDataUrl(agent);
    link.href = url;
    link.download = "agent-treeview";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <WindowButton
        delay={0.8}
        onClick={() => {
          saveTreeView({ messages });
        }}
        icon={<FaFileCode size={12} />}
        text={"TreeView"}
      />
    </>
  );
};

export default TreeViewButton;
