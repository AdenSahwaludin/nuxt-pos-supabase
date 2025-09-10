import fetch from "node-fetch";

async function testKategoriPage() {
  try {
    console.log("🔍 Testing kategori page...");

    const response = await fetch("http://localhost:3000/admin/kategori", {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📄 Response Headers:`, Object.fromEntries(response.headers));

    if (response.status === 200) {
      const html = await response.text();

      // Check for important elements
      const checks = [
        { name: "Page title", pattern: /<title>.*kategori.*<\/title>/i },
        { name: "Vue app root", pattern: /<div id="__nuxt">/i },
        { name: "Category table", pattern: /kategori/i },
        {
          name: "No JavaScript errors",
          pattern: /error|exception|undefined.*reading/i,
          shouldNotMatch: true,
        },
      ];

      console.log("\n🔍 Page Content Analysis:");
      checks.forEach((check) => {
        const matches = check.pattern.test(html);
        const result = check.shouldNotMatch ? !matches : matches;
        const status = result ? "✅" : "❌";
        console.log(`${status} ${check.name}: ${result ? "OK" : "FAIL"}`);

        if (!result && check.shouldNotMatch) {
          // Show error context if found
          const errorMatch = html.match(check.pattern);
          if (errorMatch) {
            console.log(`   Error found: ${errorMatch[0]}`);
          }
        }
      });

      // Check for 500 error content
      if (html.includes("500") || html.includes("Internal Server Error")) {
        console.log("❌ Page contains 500 error");
        // Extract error details
        const errorMatch = html.match(
          /Cannot read properties of undefined \(reading '([^']+)'\)/
        );
        if (errorMatch) {
          console.log(`   Undefined property: '${errorMatch[1]}'`);
        }
      } else {
        console.log("✅ No 500 errors found in page content");
      }
    } else {
      console.log(
        `❌ Page failed to load: ${response.status} ${response.statusText}`
      );
      const errorText = await response.text();
      console.log("Error content:", errorText.substring(0, 500));
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testKategoriPage();
