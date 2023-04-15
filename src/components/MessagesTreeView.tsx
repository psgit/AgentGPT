import { Message } from "./ChatWindow";

interface Task {
  name: string;
  executions: Execution[];
}

interface Execution {
  response: string;
  tasks: Task[];
}

interface Agent {
  name: string;
  goal: string;
  tasks: Task[];
}

const createTask = ({ message }: { message: Message }): Task => {
  return { name: message.value, executions: [] };
};

const createAgent = ({ messages }: { messages: Message[] }): Agent => {
  messages.map((message: Message) => {
    if (message.type === "goal")
      return {
        name: "test",
        goal: message.value,
        tasks: [],
      };
  });
};
