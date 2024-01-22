import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

interface Task {
  title: string;
  description: string;
  done: boolean;
}

export const addTask = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const task: Task = JSON.parse(event.body || "{}");
    if (!task.title || !task.description || task.done === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "title(string), description(string) and done(boolean) are required",
        }),
      };
    }

    const createdAt = new Date();
    const id = uuidv4();

    const params = {
      TableName: "TaskTable",
      Item: {
        id: { S: id },
        title: { S: task.title },
        description: { S: task.description },
        date: { S: createdAt.toISOString() },
        done: { BOOL: task.done },
      },
    };

    const dynamoDB = new DynamoDB({
      region: "us-east-1",
    });
    await dynamoDB.putItem(params);

    return {
      statusCode: 200,
      body: JSON.stringify({
        task,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const getTasks = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = {
      TableName: "TaskTable",
    };

    const dynamoDB = new DynamoDB({
      region: "us-east-1",
    });
    const { Items } = await dynamoDB.scan(params);

    const tasks = Items?.map((item) => ({
      id: item.id.S,
      title: item.title.S,
      description: item.description.S,
      date: item.date.S,
      done: item.done.BOOL,
    }));

    return {
      statusCode: 200,
      body: tasks ? JSON.stringify(tasks) : "No taks found",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
