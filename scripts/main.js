import { colonySelect } from "./colony.js"
import { displayFacilityChoice } from "./eventHandler.js"
import { facilitySelect } from "./facilities.js"
import { facilitiesData } from "./facilities.js"

const mainContainer = document.getElementById("container")

const renderAllHTML = async () => {
  const colonyDisplay = await colonySelect()
  const facilityHTML = await facilitySelect()
  return `<div>
    <h2>Solar System Mining Marketplace</h2>

    <div>${facilityHTML}</div>

    <div>${colonyDisplay}</div>

    <div></div>

    <div id="facilityOutput"></div>
  
  
  </div>`

}

const loadHTML = async () => {
  mainContainer.innerHTML = await renderAllHTML()
document.addEventListener("change", (event) => {
      const html = displayFacilityChoice(event, facilitiesData)
      if (html) {
        document.getElementById("facilityOutput").innerHTML = html
      }
    }
  )
}
loadHTML()

