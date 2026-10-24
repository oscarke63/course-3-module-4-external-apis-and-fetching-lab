// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

function displayError(message) {
  const errorDiv = document.getElementById("error-message")
  errorDiv.textContent = message
  errorDiv.classList.remove("hidden")
}

function clearError() {
  const errorDiv = document.getElementById("error-message")
  errorDiv.textContent = ""
  errorDiv.classList.add("hidden")
}

function displayAlerts(data) {
  const display = document.getElementById("alerts-display")
  display.textContent = ""

  const summary = document.createElement("p")
  summary.textContent = `${data.title}: ${data.features.length}`
  display.append(summary)

  const list = document.createElement("ul")
  data.features.forEach(alert => {
    const item = document.createElement("li")
    item.textContent = alert.properties.headline
    list.append(item)
  })
  display.append(list)
}

async function fetchWeatherData(state) {
  const response = await fetch(`${weatherApi}${state}`)
  if (!response.ok) {
    throw new Error(`Unable to fetch alerts (status ${response.status})`)
  }
  return response.json()
}

async function handleFetch() {
  const input = document.getElementById("state-input")
  const state = input.value.trim().toUpperCase()
  input.value = ""

  if (!/^[A-Z]{2}$/.test(state)) {
    displayError("Please enter a valid two-letter state abbreviation (e.g. NY).")
    return
  }

  try {
    const data = await fetchWeatherData(state)
    clearError()
    displayAlerts(data)
  } catch (error) {
    displayError(error.message)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fetch-alerts").addEventListener("click", handleFetch)
})
