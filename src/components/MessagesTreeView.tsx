import type { Message } from '../types/agentTypes';
import WindowButton from '../WindowButton';

export interface Task {
  name: string;
  executions: Execution[];
}

export interface Execution {
  response: string;
  tasks: Task[];
}

export interface Agent {
  name: string;
  goal: string;
  tasks: Task[];
}

const createTask = ({ message }: { message: Message }): Task => {
  return { name: message.value, executions: [] };
};

const createAgent = ({ messages }: { messages: Message[] }): Agent => {
  let agent: Agent = undefined;
  let tasks = {};
  messages.map((message: Message) => {
    switch (message.type) {
      case 'goal':
        agent = {
          name: 'test',
          goal: message.value,
          tasks: [],
        };
      case 'task':
        if (agent) {
          let task = createTask(message);
          tasks[task.name] = task;
          agent.tasks.add(task);
        }
      case 'action':
    }
  });
  return agent;
};

export const TreeViewButton = ({ messages }: { messages: Message[] }) => {
  const mm = messages;

  const saveTreeView = () => {
    alert(JSON.stringify(createAgent(mm)));
  };

  return (
    <>
      <WindowButton
        delay={0.8}
        onClick={() => {
          saveTreeView();
        }}
        text={'TreeView'}
      />
    </>
  );
};
