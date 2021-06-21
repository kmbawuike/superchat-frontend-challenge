export async function sendRequest(
  url,
  method = "GET",
  body,
  headers = {},
) {
  return await fetch(url, {
    method: method,
    body: method.toLowerCase() === "get" ? undefined : JSON.stringify(body),
    headers: {
      "Content-Type": headers?.contentType || "application/json",
      Accept: "application/vnd.github.v3+json",
      ...headers,
    },
  });
}

export const encodeColor = (color) =>{
  return color.replace('#','color')
}

export const decodeColor = (color) =>{
  return color.replace('color','#')
}

export function capitalize(text) {
  const wordsArray = text.toLowerCase().split(" ");
  const capsArray = wordsArray.map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  });
  return capsArray.join(" ");
}