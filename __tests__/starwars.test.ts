import { filmsList, peopleList } from "../src/starwars";

describe("filmsList", () => {
  it("should return a statusCode 200", async () => {
    const event: any = {};
    const response = await filmsList(event);
    expect(response.statusCode).toBe(200);
  });

  it("should return a list of films", async () => {
    const event: any = {};
    const response = await filmsList(event);
    const { startWarsFilms } = JSON.parse(response.body);
    expect(startWarsFilms).toBeInstanceOf(Array);
  });
});

describe("peopleList", () => {
  it("should return a statusCode 200", async () => {
    const event: any = {};
    const response = await peopleList(event);
    expect(response.statusCode).toBe(200);
  });

  it("should return a list of people", async () => {
    const event: any = {};
    const response = await peopleList(event);
    const { startWarsPeople } = JSON.parse(response.body);
    expect(startWarsPeople).toBeInstanceOf(Array);
  });
});
