// Quick test for kategori page
const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/admin/kategori",
  method: "GET",
  headers: {
    "User-Agent": "Test-Client",
  },
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    if (res.statusCode === 200) {
      console.log("✅ Page loaded successfully");

      // Check for common error patterns
      if (data.includes("500") || data.includes("Internal Server Error")) {
        console.log("❌ Found 500 error in response");
      } else if (data.includes("Cannot read properties of undefined")) {
        console.log("❌ Found undefined property error");
      } else {
        console.log("✅ No errors detected in response");
      }
    } else {
      console.log(`❌ Failed to load page: ${res.statusCode}`);
    }
  });
});

req.on("error", (err) => {
  console.error("❌ Request failed:", err.message);
});

req.end();
