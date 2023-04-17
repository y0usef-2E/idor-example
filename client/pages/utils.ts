export async function postData(url: string, data: object) {
  console.log(data);
  const JSONdata = JSON.stringify(data);
  console.log(JSONdata);

  const reqOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSONdata,
  };

  const response = await fetch(url, reqOptions);
  return response;
}
export async function patchData(url: string, data: object) {
  console.log(data);
  const JSONdata = JSON.stringify(data);
  console.log(JSONdata);

  const reqOptions: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSONdata,
  };

  const response = await fetch(url, reqOptions);
  return response;
}
