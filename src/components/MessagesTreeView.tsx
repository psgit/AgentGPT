import type { Message } from '../types/agentTypes';

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

export default createAgent;
