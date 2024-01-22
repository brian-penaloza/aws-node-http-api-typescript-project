import { APIGatewayProxyEvent } from "aws-lambda";
import { hello } from "../src/handler";

describe("hello", () => {
  test("should return a statusCode 200", async () => {
    const aPIGatewayProxyEvent: APIGatewayProxyEvent = {} as any;
    const response = await hello(aPIGatewayProxyEvent);
    expect(response.statusCode).toBe(200);
  });

  test("should return a string called message", async () => {
    const aPIGatewayProxyEvent: APIGatewayProxyEvent = {} as any;
    const response = await hello(aPIGatewayProxyEvent);
    const body = JSON.parse(response.body);
    expect(body.message).toBeDefined();
  });

  test("should return the string 'Hello World!'", async () => {
    const aPIGatewayProxyEvent: APIGatewayProxyEvent = {} as any;
    const response = await hello(aPIGatewayProxyEvent);
    const { message } = JSON.parse(response.body);
    expect(message).toBe("Hello World!");
  });
});
