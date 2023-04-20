import type { Message } from '../types/agentTypes';
import WindowButton from './WindowButton';
import { FaFileCode } from 'react-icons/fa';

const executing = 'Executing "';

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
  if (message.info && message.info.startsWith('Executing')) {
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
      case 'goal': {
        agent = {
          name: 'TODO set agent name',
          goal: message.value,
          tasks: [],
        };
        break;
      }
      case 'task': {
        if (agent && message.value) {
          let task = createTask(message);
          tasks[task.name] = task;
          agent.tasks.push(task);
        }
        break;
      }
      case 'action': {
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
  Buffer.from(str, 'binary').toString('base64');

const convertToDataUrl = (str: string): string => {
  return 'data: application/json, ' + encodeBase64(str);
};

const convertAgentToDataUrl = (agent: Agent): string => {
  return convertToDataUrl(JSON.stringify(agent));
};

const TreeViewButton = ({ messages }: { messages: Message[] }) => {
  const saveTreeView = (messages: Message[]) => {
    const agent = createAgent(messages);
    alert(JSON.stringify(agent));
    const link = document.createElement('a');
    link.href = convertAgentToDataUrl(agent);
    link.download = 'my-document.json.txt';
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
        text={'TreeView'}
      />
    </>
  );
};

export default TreeViewButton;
