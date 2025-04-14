import { facilityChoices } from "./facility.js";
import { governorChoices } from "./governor.js";
import { purchaseButton } from "./purchasebutton.js";
import { purchaseMineral } from "./TransientState.js";

const renderHTML = async () => {
  const governorHTML = await governorChoices();
  const miningFacilitiesHTML = await facilityChoices();
  const purchaseButtonHTML = purchaseButton();
  const composedHTML = `
  <h1 class="title">Solar System Mining Marketplace</h1>
  
                <div class="layout">
                    <div class="dropdowns">
                        <div class="dropdown">
                            <h3>Choose a Governor</h3>
                                ${governorHTML}
                        </div>
                <div class="dropdown">
                        <h3>Choose a Facility</h3>
                            ${miningFacilitiesHTML}
                    </div>
                 </div>
                <div class="minerals-display">
                    <div id="colonyMineralsContainer" class="colonyMineralsContainer">
                    <h3>Colony Minerals</h3>
                    <!-- Colony minerals will be dynamically inserted here -->
                    </div>
                 </div>

                <div class="shared-container">
                     <div id="facility-minerals">
                     <h3>Facility Minerals</h3>
                     <!-- Facility minerals will be dynamically inserted here -->
                </div>
                    <div class="space-cart">
                        <h3>Space Cart</h3>

                        ${purchaseButtonHTML}
                    </div>
                </div>
    </div>
  `;
  document.querySelector("#container").innerHTML = composedHTML;
  // document.querySelector("#container").addEventListener("click", (event) => {
  //   if (event.target.id === "purchaseButton") {
  //     purchaseMineral();
  //   }
  // });
};
renderHTML();
