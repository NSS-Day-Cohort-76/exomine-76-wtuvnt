import { setFacility } from "./TransientState.js";

const handleFacilityChange = async (changeEvent) => {
  if (changeEvent.target.name === "facility") {
    const selectedFacilityId = parseInt(changeEvent.target.value);
    setFacility(selectedFacilityId);

    // Fetch facilityMinerals, minerals, and miningFacilities data
    const [facilityMineralsResponse, mineralsResponse, facilitiesResponse] =
      await Promise.all([
        fetch("http://localhost:8088/facilityMinerals"),
        fetch("http://localhost:8088/minerals"),
        fetch("http://localhost:8088/miningFacilities"),
      ]);

    const facilityMinerals = await facilityMineralsResponse.json();
    const minerals = await mineralsResponse.json();
    const facilities = await facilitiesResponse.json();

    // Find the selected facility
    const selectedFacility = facilities.find(
      (facility) => facility.id === selectedFacilityId
    );

    // Filter facilityMinerals by the selected facilityId
    const filteredFacilityMinerals = facilityMinerals.filter(
      (facilityMineral) => facilityMineral.facilityId === selectedFacilityId
    );

    // Map the filtered facilityMinerals to display minerals as radio buttons
    const mineralsHtml = filteredFacilityMinerals
      .map((facilityMineral) => {
        const mineral = minerals.find(
          (m) => m.id === facilityMineral.mineralsId
        );
        return `
          <div>
            <input type="radio" name="mineral" value="${facilityMineral.id}" id="mineral-${facilityMineral.id}" />
            <label for="mineral-${facilityMineral.id}">
              ${facilityMineral.quantity} tons of ${mineral.name}
            </label>
          </div>
        `;
      })
      .join("");

    // Display the minerals in the facility minerals container
    document.querySelector("#facilityMineralsContainer").innerHTML = `
      <div class="facilityMineralsContainer">
        <h3>${selectedFacility.name} Minerals</h3>
        ${mineralsHtml}
      </div>
    `;
  }
};

export const facilityChoices = async () => {
  const response = await fetch("http://localhost:8088/miningFacilities");
  const facilitys = await response.json();

  document.addEventListener("change", handleFacilityChange);

  const htmlString = `
      <select name="facility" id="facilityMenu">
      <option value="0">Choose a Facility</option>
        ${facilitys
          .map(
            (facility) =>
              `<option value="${facility.id}">${facility.name}</option>`
          )
          .join("")}
      </select>
    `;
  return htmlString;
};
