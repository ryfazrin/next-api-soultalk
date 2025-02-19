import Cors from "cors";

// Inisialisasi middleware
const cors = Cors({
  origin: "*", // Bisa diganti dengan "http://localhost:5173" atau domain frontend lainnya
  methods: ["GET", "POST", "PUT", "DELETE"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  res.status(200).json({ message: "CORS enabled" });
}
