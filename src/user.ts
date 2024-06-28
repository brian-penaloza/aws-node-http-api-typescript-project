import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

interface User {
  user: string;
  fullname: string;
  email: string;
}

export const addUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user: User = JSON.parse(event.body || "{}");
    if (!user.user || !user.fullname || !user.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "user(string), fullname(string) and email(string) are required",
        }),
      };
    }

    const createdAt = new Date();
    const id = uuidv4();

    const params = {
      TableName: "UserTable",
      Item: {
        id: { S: id },
        user: { S: user.user },
        fullname: { S: user.fullname },
        date: { S: createdAt.toISOString() },
        email: { S: user.email },
      },
    };

    const dynamoDB = new DynamoDB({
      region: "us-east-1",
    });
    await dynamoDB.putItem(params);

    const respuesta: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    };

    return respuesta;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const getUsers = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = {
      TableName: "UserTable",
    };

    const dynamoDB = new DynamoDB({
      region: "us-east-1",
    });
    const { Items } = await dynamoDB.scan(params);

    const users = Items?.map((item) => ({
      id: item.id.S,
      user: item.user.S,
      fullname: item.fullname.S,
      date: item.date.S,
      email: item.email.S,
    }));

    const respuesta: APIGatewayProxyResult = {
      statusCode: 200,
      body: users ? JSON.stringify(users) : "No users found",
      headers: {
        "Content-Type": "application/json",
      },
    };

    return respuesta;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
