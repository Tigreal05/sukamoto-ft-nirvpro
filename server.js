const express = require("express");
const path = require("path");

const app = express();
const DEFAULT_PORT = 3000;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

const packages = [
  {
    id: "graduates",
    name: "Graduates",
    price: "Mulai dari Rp 500.000",
    description: "Paket foto wisuda dengan hasil premium dan edit rapi.",
    link: "/graduates/",
  },
  {
    id: "wedding",
    name: "Wedding",
    price: "Mulai dari Rp 2.500.000",
    description: "Paket foto pernikahan untuk momen paling berharga.",
    link: "/wedding/",
  },
  {
    id: "event",
    name: "Event",
    price: "Mulai dari Rp 1.200.000",
    description:
      "Paket dokumentasi acara untuk kebutuhan perusahaan atau keluarga.",
    link: "/event/",
  },
  {
    id: "prewedding",
    name: "Prewedding",
    price: "Hubungi WhatsApp",
    description: "Paket prewedding custom sesuai keinginan pasangan.",
    link: "https://wa.me/6285156918852?text=Halo%20SUKA%20MOTO,%20saya%20ingin%20tanya%20pricelist%20Prewedding",
  },
  {
    id: "engagement",
    name: "Engagement",
    price: "Hubungi WhatsApp",
    description: "Paket engagement dengan konsep yang personal.",
    link: "https://wa.me/6285156918852?text=Halo%20SUKA%20MOTO,%20saya%20ingin%20tanya%20pricelist%20Engagement",
  },
  {
    id: "birthday",
    name: "Birthday",
    price: "Hubungi WhatsApp",
    description: "Paket foto ulang tahun untuk momen keluarga dan teman.",
    link: "https://wa.me/6285156918852?text=Halo%20SUKA%20MOTO,%20saya%20ingin%20tanya%20pricelist%20Birthday",
  },
  {
    id: "pas-foto",
    name: "Pas Foto",
    price: "Hubungi WhatsApp",
    description: "Layanan pas foto untuk kebutuhan formal dan personal.",
    link: "https://wa.me/6285156918852?text=Halo%20SUKA%20MOTO,%20saya%20ingin%20tanya%20pricelist%20Pas%20Foto",
  },
];

const leads = [];
const staticPackageRoutes = [
  { route: "/graduates", folder: "graduates" },
  { route: "/wedding", folder: "wedding" },
  { route: "/event", folder: "event" },
  { route: "/invinite", folder: "invinite" },
  { route: "/invite", folder: "invinite" },
];

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

staticPackageRoutes.forEach(({ route, folder }) => {
  app.use(route, express.static(path.join(__dirname, folder)));
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, folder, "index.html"));
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend sukamoto is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/packages", (req, res) => {
  res.json({
    success: true,
    data: packages,
  });
});

app.post("/api/contact", (req, res) => {
  const { name, phone, packageName, message } = req.body || {};

  if (!name || !phone || !packageName) {
    return res.status(400).json({
      success: false,
      message: "Nama, nomor telepon, dan paket wajib diisi.",
    });
  }

  const lead = {
    id: Date.now(),
    name,
    phone,
    packageName,
    message: message || "",
    createdAt: new Date().toISOString(),
  };

  leads.push(lead);

  console.log("New inquiry:", lead);

  return res.status(201).json({
    success: true,
    message: "Data inquiry berhasil dikirim.",
    data: lead,
  });
});

app.get("/api/leads", (req, res) => {
  res.json({
    success: true,
    count: leads.length,
    data: leads,
  });
});

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  return res.sendFile(path.join(__dirname, "index.html"));
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const fallbackPort = port + 1;
      console.log(`Port ${port} is busy. Retrying on ${fallbackPort}...`);
      startServer(fallbackPort);
      return;
    }

    throw error;
  });
}

startServer(PORT);
