document.getElementById("footprint-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const json = {};

      for (const [key, value] of formData.entries()) {
        // Convert booleans and numbers
        if (value === "true") json[key] = true;
        else if (value === "false") json[key] = false;
        else if (!isNaN(value)) json[key] = Number(value);
        else json[key] = value;
      }

      const res = await fetch("https://web-production-48b7.up.railway.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });

      const data = await res.json();
      document.getElementById("result").innerHTML =
  `🌎 Estimated Carbon Footprint: <strong>${data.predicted_carbon_footprint_kg_per_year}</strong> kg/year`;

  function generateTips(input) {
  const tips = [];

  // 🚗 Private transport
  if (input.private_km_per_week > 500 && ["Diesel", "Petrol"].includes(input.fuel_type)) {
    tips.push("🚗 You drive over 500 km/week on diesel or petrol — consider switching to an electric vehicle.");
  } else if (input.private_km_per_week > 300) {
    tips.push("🚙 Try reducing private vehicle use or carpooling to cut emissions.");
  }

  // 🚌 Public transport
  if (input.public_km_per_week < 50) {
    tips.push("🚌 Using public transport occasionally can help reduce your carbon footprint.");
  }

  // ⚡ Electricity use
  if (input.electricity_per_month_kwh > 300 && !input.uses_renewable_energy) {
    tips.push("⚡ High electricity usage — consider reducing usage or installing renewable energy sources.");
  }

  // 🌞 Renewable energy
  if (!input.uses_renewable_energy) {
    tips.push("🌞 Switch to solar or green energy for long-term sustainability.");
  }

  // 🍖 Meat consumption
  if (["Daily", "Frequently"].includes(input.meat_frequency)) {
    tips.push("🥩 Consider reducing meat consumption to lower emissions from livestock.");
  }

  // ✈️ Flights
  const totalFlights = input.short_flights_per_year + input.long_flights_per_year;
  if (totalFlights > 6) {
    tips.push("✈️ Flying frequently has a large carbon impact — consider alternatives or offsetting.");
  }

  // ♻️ Recycling
  if (!input.recycles_regularly) {
    tips.push("♻️ Start recycling waste regularly to reduce landfill impact.");
  }

  // 🗑️ Waste production
  if (input.waste_kg_per_week > 7) {
    tips.push("🗑️ Try reducing weekly household waste — composting and reuse help.");
  }

  // 🏠 Home energy efficiency
  if (input.household_size === 1 && input.home_type === "Independent") {
    tips.push("🏠 Living alone in a large home uses more energy — consider shared or energy-efficient housing.");
  }

  return tips;
}

const tips = generateTips(json); // Pass your form inputs here
const tipsList = document.getElementById("tips");

tipsList.innerHTML = ""; // Clear old tips
tips.forEach((tip) => {
  const li = document.createElement("li");
  li.textContent = tip;
  tipsList.appendChild(li);
});

document.getElementById("reset-btn").addEventListener("click", function () {
  document.getElementById("footprint-form").reset(); // Clear form
  document.getElementById("result").innerHTML = "";  // Clear result
  document.getElementById("tips").innerHTML = "";    // Clear tips
});

    });