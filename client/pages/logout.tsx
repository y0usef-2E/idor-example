export default function logout() {
  fetch(process.env.NEXT_PUBLIC_API_URL + "/logout", { credentials: "include" })
    .then((res) => res)
    .then(() => window.location.replace("/"));
}
