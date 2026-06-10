async function run() {
  const res = await fetch("http://localhost:3000/api/admin/editors/b7a1a842-cf9a-416b-b2d8-4c18e14661b1", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Cookie": "..." // We don't have cookie, so it might return 401. Let's see if it returns 401 or 404!
    },
    body: JSON.stringify({ action: "delete" })
  });
  console.log("STATUS:", res.status);
  console.log("BODY:", await res.text());
}
run();
