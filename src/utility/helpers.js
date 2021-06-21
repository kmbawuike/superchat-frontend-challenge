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