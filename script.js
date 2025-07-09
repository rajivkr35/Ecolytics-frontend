document.getElementById("footprint-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const json = {};

  for (const [key, value] of formData.entries()) {
    if (value === "true") json[key] = true;
    else if (value === "false") json[key] = false;
    else if (!isNaN(value)) json[key] = Number(value);
    else json[key] = value;
  }

  try {
    const res = await fetch("https://web-production-48b7.up.railway.app/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });

    if (!res.ok) throw new Error("API Error");

    const data = await res.json();
    document.getElementById("result").innerHTML =
      `🌎 Estimated Carbon Footprint: <strong>${data.predicted_carbon_footprint_kg_per_year}</strong> kg/year`;

    const tips = generateTips(json);
    const tipsList = document.getElementById("tips");
    tipsList.innerHTML = "";
    tips.forEach((tip) => {
      const li = document.createElement("li");
      li.textContent = tip;
      tipsList.appendChild(li);
    });

    document.getElementById("result").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    document.getElementById("result").innerHTML =
      `<span style="color:red;">❌ Failed to estimate footprint. Please try again.</span>`;
    console.error(err);
  }
});

document.getElementById("reset-btn").addEventListener("click", function () {
  document.getElementById("footprint-form").reset();
  document.getElementById("result").innerHTML = "";
  document.getElementById("tips").innerHTML = "";
});

// Tip Generator
function generateTips(input) {
  const tips = [];

  if (input.private_km_per_week > 500 && ["Diesel", "Petrol"].includes(input.fuel_type)) {
    tips.push("🚗 You drive over 500 km/week on diesel or petrol — consider switching to an electric vehicle.");
  } else if (input.private_km_per_week > 300) {
    tips.push("🚙 Try reducing private vehicle use or carpooling to cut emissions.");
  }

  if (input.public_km_per_week < 50) {
    tips.push("🚌 Using public transport occasionally can help reduce your carbon footprint.");
  }

  if (input.electricity_per_month_kwh > 300 && !input.uses_renewable_energy) {
    tips.push("⚡ High electricity usage — consider reducing usage or installing renewable energy sources.");
  }

  if (!input.uses_renewable_energy) {
    tips.push("🌞 Switch to solar or green energy for long-term sustainability.");
  }

  if (["Daily", "Frequently"].includes(input.meat_frequency)) {
    tips.push("🥩 Consider reducing meat consumption to lower emissions from livestock.");
  }

  const totalFlights = (input.short_flights_per_year || 0) + (input.long_flights_per_year || 0);
  if (totalFlights > 6) {
    tips.push("✈️ Flying frequently has a large carbon impact — consider alternatives or offsetting.");
  }

  if (!input.recycles_regularly) {
    tips.push("♻️ Start recycling waste regularly to reduce landfill impact.");
  }

  if (input.waste_kg_per_week > 7) {
    tips.push("🗑️ Try reducing weekly household waste — composting and reuse help.");
  }

  if (input.household_size === 1 && input.home_type === "Independent") {
    tips.push("🏠 Living alone in a large home uses more energy — consider shared or energy-efficient housing.");
  }

  return tips;
}
