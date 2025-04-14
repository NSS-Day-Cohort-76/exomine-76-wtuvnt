import { setColony } from "./TransientState.js";

const handleGovernorChange = async (changeEvent) => {
  if (changeEvent.target.name === "governor") {
    const selectedGovernorId = parseInt(changeEvent.target.value);

    // Fetch governors, colonies, colonyMinerals, and minerals data
    const [
      governorsResponse,
      coloniesResponse,
      colonyMineralsResponse,
      mineralsResponse,
    ] = await Promise.all([
      fetch("http://localhost:8088/governors"),
      fetch("http://localhost:8088/colonies"),
      fetch("http://localhost:8088/colonyMinerals"),
      fetch("http://localhost:8088/minerals"),
    ]);

    const governors = await governorsResponse.json();
    const colonies = await coloniesResponse.json();
    const colonyMinerals = await colonyMineralsResponse.json();
    const minerals = await mineralsResponse.json();

    // Find the selected governor
    const selectedGovernor = governors.find(
      (governor) => governor.id === selectedGovernorId
    );

    if (selectedGovernor) {
      setColony(selectedGovernor.colonyId);
      // Find the colony associated with the selected governor
      const colony = colonies.find(
        (colony) => colony.id === selectedGovernor.colonyId
      );

      // Filter colonyMinerals by the selected governor's colonyId
      const filteredColonyMinerals = colonyMinerals.filter(
        (colonyMineral) => colonyMineral.colonyId === selectedGovernor.colonyId
      );

      // Map the filtered colonyMinerals to display minerals and their quantities
      const mineralsHtml = filteredColonyMinerals
        .map((colonyMineral) => {
          const mineral = minerals.find(
            (mineral) => mineral.id === colonyMineral.mineralsId
          );
          return `<li>${mineral.name}: ${colonyMineral.quantity}</li>`;
        })
        .join("");

      // Display the minerals in a target container
      document.querySelector("#colonyMineralsContainer").innerHTML = `
            <h3>${colony.name} Minerals</h3>
            <ul>${mineralsHtml}</ul>
          `;
    }
  }
};

export const governorChoices = async () => {
  const response = await fetch("http://localhost:8088/governors");
  const governors = await response.json();

  document.addEventListener("change", handleGovernorChange);

  const htmlString = `
    <select name="governor" id="governorMenu">
    <option value="0">Choose a Governor</option>
      ${governors
        .map(
          (governor) =>
            `<option  value="${governor.id}">${governor.name}</option>`
        )
        .join("")}
    </select>
  `;
  return htmlString;
};
