import type { Message } from "../types/agentTypes";
import WindowButton from "./WindowButton";
import { FaFileCode } from "react-icons/fa";
import json2md from "json2md";
import { ReactTree } from "@naisutech/react-tree";

const EXECUTING: string = 'Executing "';
const AGENT: string = "Agent: ";
const GOAL: string = "Goal: ";
const TASK: string = "Task: ";
const EXECUTION: string = "Execution: ";

const JSON_MIME_TYPE: string = "application/json";
const MARKDOWN_MIME_TYPE: string = "text/markdown";

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
  if (message.info && message.info.startsWith(EXECUTING)) {
    return message.info.substr(
      EXECUTING.length,
      message.info.length - EXECUTING.length - 1
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
  const md = [{ h1: AGENT + agent.name }, { h2: GOAL + agent.goal }];
  for (let task of agent.tasks) {
    md.push({ h3: TASK + task.name });
    for (let execution of task.executions) {
      md.push({ h4: EXECUTION + execution.response });
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

const convertAgentToTree = (agent: Agent): any => {
  let idSeq: int = 1;
  const nodes = [];
  const agentNode = { id: idSeq++, label: AGENT + agent.name, parentId: null };
  nodes.push(agentNode);
  const goalNode = {
    id: idSeq++,
    label: GOAL + agent.goal,
    parentId: agentNode.id,
  };
  nodes.push(goalNode);
  for (let task of agent.tasks) {
    let taskNode = {
      id: idSeq++,
      label: TASK + task.name,
      parentId: goalNode.id,
      items: [],
    };
    nodes.push(taskNode);
    for (let execution of task.executions) {
      const execNode = {
        id: idSeq++,
        label: EXECUTION + execution.response,
        parentId: taskNode.id,
      };
      taskNode.items.push(execNode);
    }
  }
  return nodes;
};

const convertAgentToMarkdownDataUrl = (agent: Agent): string => {
  return convertToDataUrl(MARKDOWN_MIME_TYPE, convertAgentToMarkdown(agent));
};

const TreeViewButton = ({ messages, name }: { messages: Message[], name: string }) => {
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
        name={name}
      />
    </>
  );
};

const MessagesTree = ({ messages }: { messages: Message[] }) => {
  return (
    <>
      <ReactTree
        nodes={convertAgentToTree(createAgent(messages))}
        theme="dark"
      />
    </>
  );
};

export { TreeViewButton, MessagesTree };
