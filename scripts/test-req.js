import http from "node:http";

const req = http.request(
  "http://localhost:3000/foo/bar",
  {
    method: "GET",
  },
  (res) => {
    let raw = "";
    res.on("data", (chunk) => (raw += chunk));
    res.on("end", () => console.log(res.statusCode, raw.slice(0, 50)));
  }
);
req.end();
