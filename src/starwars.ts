import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import i18n from "i18n";
import path from "path";
import json_spanish from "./locales/es.json";

i18n.configure({
  locales: ["en", "es"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "es",
  cookie: "i18n",
});

export const filmsList = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const url = "https://swapi.py4e.com/api/films";
    const startWars = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await startWars.json();
    const startWarsFilms = traducirObjetosI18n(responseJson.results);

    return {
      statusCode: 200,
      body: JSON.stringify({
        startWarsFilms,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

function traducirAtributosI18n(objeto: any) {
  const objetoTraducido: any = {};
  for (const key in objeto) {
    if (objeto.hasOwnProperty(key)) {
      objetoTraducido[i18n.__(key)] = objeto[key];
    }
  }
  return objetoTraducido;
}

function traducirObjetosI18n(lista: any[]) {
  let listaTraducida: any[] = [];
  for (const objeto of lista) {
    listaTraducida.push(traducirAtributosI18n(objeto));
  }
  return listaTraducida;
}

export const peopleList = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const url = "https://swapi.py4e.com/api/people";
    const startWars = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await startWars.json();
    const startWarsPeople = traducirObjetosJson(responseJson.results);

    return {
      statusCode: 200,
      body: JSON.stringify({
        startWarsPeople,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

function traducirAtributosJson(objeto: any) {
  const objetoTraducido: any = {};
  const listTranslate: any = json_spanish;
  for (const key in objeto) {
    if (listTranslate.hasOwnProperty(key)) {
      const keyTranslate = listTranslate[key];
      objetoTraducido[keyTranslate] = objeto[key];
    }
  }
  return objetoTraducido;
}

function traducirObjetosJson(lista: any[]) {
  let listaTraducida: any[] = [];
  for (const objeto of lista) {
    listaTraducida.push(traducirAtributosJson(objeto));
  }
  return listaTraducida;
}
