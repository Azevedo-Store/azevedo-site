export async function fetchMenus() {
  const res = await fetch("http://localhost:3000/api/menu/consultar/todos-com-sub", {
    // Inclua isso se estiver fazendo o fetch server-side
    cache: "no-store",
  })
  return res.json()
}