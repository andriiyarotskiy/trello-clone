import { AppState } from "./AppStateContext";

export const save = (payload: AppState) => {
  return fetch("/save", {
    method: "POST",
    headers: {
      accept: "applicaton/json",
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then((response) => {
      return response.json();
    })
    .catch(console.log);
};

export const load = () => {
  return fetch("/load").then((response) => {
    // mock data
    const res =
      '{"lists":[{"id":"0","text":"To Do","tasks":[{"id":"c0","text":"Generate app scaffold"}]},{"id":"1","text":"In Progress","tasks":[{"id":"c2","text":"Learn Typescript"}]},{"id":"2","text":"Done","tasks":[{"id":"c3","text":"Begin to use static typing"}]}]}';
    return JSON.parse(res) as Promise<AppState>;
  });
};
