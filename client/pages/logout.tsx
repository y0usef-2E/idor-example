export default function logout() {
  fetch("http://localhost:8000/logout", { credentials: "include" })
    .then((res) => res)
    .then(() => window.location.replace("/"));
}
