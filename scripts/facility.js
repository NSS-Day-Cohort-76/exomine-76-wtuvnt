import { setFacility, setMineral } from "./TransientState.js";

export let filteredFacilityMinerals = []
export let minerals = []

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
    minerals = await mineralsResponse.json();
    const facilities = await facilitiesResponse.json();

    // Find the selected facility
    const selectedFacility = facilities.find(
      (facility) => facility.id === selectedFacilityId
    );

    // Filter facilityMinerals by the selected facilityId
    filteredFacilityMinerals = facilityMinerals.filter(
      (facilityMineral) => facilityMineral.miningFacilityId === selectedFacilityId
    );

    // Map the filtered facilityMinerals to display minerals as radio buttons
    const mineralsHtml = filteredFacilityMinerals
      .map((facilityMineral) => {
        const mineral = minerals.find(
          (mineral) => mineral.id === facilityMineral.mineralsId
        );
        return `
          <div>
            <input type="radio" name="mineral" value="${facilityMineral.id}" id="mineral-${facilityMineral.id}" />
            <label for="mineral-${facilityMineral.id}">
              ${facilityMineral.quantity} tons of ${mineral.name}
            </label>
          </div>
        `;
      }
      )
      .join("");


    // Display the minerals in the facility minerals container
    document.querySelector("#facility-minerals").innerHTML = `
      <div class="facilityMineralsContainer">
        <h3>${selectedFacility.name} Minerals</h3>
        ${mineralsHtml}
    `;
  }
};
// Handle mineral selection
// const handleMineralSelection = async (changeEvent) => {
//   if (changeEvent.target.name === "mineral") {
//     const selectedMineralId = parseInt(changeEvent.target.value);
//     setMineral(selectedMineralId); // Update the state with the selected mineralId
//     // console.log("Selected Mineral ID:", selectedMineralId);
//   }
// };

const handleMineralSelection = async (changeEvent) => {
  if (changeEvent.target.name === "mineral") {
    const selectedFacilityMineralId = parseInt(changeEvent.target.value);

    // Use the filteredFacilityMinerals to find the correct mineralsId
    const facilityMineral = filteredFacilityMinerals.find(fm => fm.id === selectedFacilityMineralId);

    if (facilityMineral) {
      setMineral(facilityMineral.mineralsId); // ✅ Now you're correctly storing the mineral ID
    }
  }
};




export const facilityChoices = async () => {
  const response = await fetch("http://localhost:8088/miningFacilities");
  const facilities = await response.json();

  document.addEventListener("change", handleFacilityChange);
  document.addEventListener("change", handleMineralSelection);

  const htmlString = `
      <select name="facility" id="facilityMenu">
      <option value="0">Choose a Facility</option>
        ${facilities
      .map(
        (facility) =>
          `<option value="${facility.id}">${facility.name}</option>`
      )
      .join("")}
      </select>
    `;
  return htmlString;
};

// ADD IN BELOW

export const renderFacilityMinerals = async (facilityId) => {
  const [facilityMineralsResponse, mineralsResponse, facilitiesResponse] =
    await Promise.all([
      fetch("http://localhost:8088/facilityMinerals"),
      fetch("http://localhost:8088/minerals"),
      fetch("http://localhost:8088/miningFacilities"),
    ]);

  const facilityMinerals = await facilityMineralsResponse.json();
  minerals = await mineralsResponse.json();
  const facilities = await facilitiesResponse.json();

  const selectedFacility = facilities.find((f) => f.id === facilityId);
  filteredFacilityMinerals = facilityMinerals.filter(
    (fm) => fm.miningFacilityId === facilityId
  );

  const mineralsHtml = filteredFacilityMinerals
    .map((fm) => {
      const mineral = minerals.find((m) => m.id === fm.mineralsId);
      return `
        <div>
          <input type="radio" name="mineral" value="${fm.id}" id="mineral-${fm.id}" />
          <label for="mineral-${fm.id}">
            ${fm.quantity} tons of ${mineral.name}
          </label>
        </div>
      `;
    })
    .join("");

  document.querySelector("#facility-minerals").innerHTML = `
    <div class="facilityMineralsContainer">
      <h3>${selectedFacility.name} Minerals</h3>
      ${mineralsHtml}
    </div>
  `;
};
