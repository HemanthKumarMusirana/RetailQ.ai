const API_URL = "http://127.0.0.1:5000";

// Create table from JSON data
function createTableFromJson(jsonData) {
    if (!jsonData || !jsonData.length) return "<p>No data available.</p>";
  
    const headers = Object.keys(jsonData[0]);
    let table = "<table><thead><tr>" + headers.map(h => `<th>${h}</th>`).join('') + "</tr></thead><tbody>";
  
    jsonData.forEach(row => {
      table += "<tr>";
      headers.forEach(h => {
        let cellValue = row[h];
  
        // 🌟 Add icons for forecast flags
        if (h === "Forecast Flag") {
          if (cellValue.includes("⚠️")) {
            cellValue = `<span style='color:red;'>⚠️ High Demand</span>`;
          } else if (cellValue.includes("✓")) {
            cellValue = `<span style='color:green;'>✅ Stable</span>`;
          }
        }
  
        // 📅 Optional: Format Expiry Date
        if (h === "Expiry Date" && cellValue.includes("GMT")) {
          const dateObj = new Date(cellValue);
          cellValue = dateObj.toLocaleDateString("en-GB");
        }
  
        table += `<td>${cellValue}</td>`;
      });
      table += "</tr>";
    });
  
    table += "</tbody></table>";
    return table;
  }
  

async function getInventory() {
  try {
    const res = await fetch(`${API_URL}/inventory`);
    const data = await res.json();
    document.getElementById("inventoryOutput").innerHTML = createTableFromJson(data.expiring_soon);
  } catch (error) {
    console.error("Inventory fetch error:", error);
    document.getElementById("inventoryOutput").innerHTML = "<p style='color:red;'>Error loading inventory data.</p>";
  }
}

async function getPricing() {
  try {
    const res = await fetch(`${API_URL}/pricing`);
    const data = await res.json();
    document.getElementById("pricingOutput").innerHTML = createTableFromJson(data);
  } catch (error) {
    console.error("Pricing fetch error:", error);
    document.getElementById("pricingOutput").innerHTML = "<p style='color:red;'>Error loading pricing data.</p>";
  }
}

async function getForecast() {
  try {
    const res = await fetch(`${API_URL}/forecast`);
    const data = await res.json();
    document.getElementById("forecastOutput").innerHTML = createTableFromJson(data);
  } catch (error) {
    console.error("Forecast fetch error:", error);
    document.getElementById("forecastOutput").innerHTML = "<p style='color:red;'>Error loading forecast data.</p>";
  }
}

async function runMAF() {
  try {
    const res = await fetch(`${API_URL}/maf`);
    const data = await res.json();

    let html = "<h2>🧠 Multi-Agent Flow Result</h2>";

    // 📊 Demand Forecasting
    if (data.forecast && data.forecast.length) {
      html += "<h3>📊 Demand Forecasting</h3>";
      html += createTableFromJson(data.forecast);
    }

    // 📦 Inventory Monitoring
    if (data.inventory && data.inventory.expiring_soon && data.inventory.expiring_soon.length) {
      html += "<h3>📦 Inventory Monitoring</h3>";
      html += createTableFromJson(data.inventory.expiring_soon);
    }

    // 💰 Pricing Optimization
    if (data.pricing && data.pricing.length) {
      html += "<h3>💰 Pricing Optimization</h3>";
      html += createTableFromJson(data.pricing);
    }

    document.getElementById("mafOutput").innerHTML = html;
  } catch (error) {
    console.error("MAF Backend Error:", error);
    document.getElementById("mafOutput").innerHTML = "<p style='color:red;'>Error running MAF. Check backend logs.</p>";
  }
}
