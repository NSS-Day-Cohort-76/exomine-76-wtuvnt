const state = {
  facilityId: 0,
  colonyId: 0,
  mineralId: 0,
};

export const setColony = (colonyId) => {
  state.colonyId = colonyId;
  console.log(state);
  document.dispatchEvent(new CustomEvent("stateChanged"));
};

export const setFacility = (facilityId) => {
  state.facilityId = facilityId;
  console.log(state);
  document.dispatchEvent(new CustomEvent("stateChanged"));
};

export const setMineral = (mineralId) => {
  state.mineralId = mineralId;
  console.log(state);
  document.dispatchEvent(new CustomEvent("stateChanged"));
};

export const purchaseMineral = async () => {
  /*
        Does the chosen governor's colony already own some of this mineral?
            - If yes, what should happen?
            - If no, what should happen?

        Defining the algorithm for this method is traditionally the hardest
        task for teams during this group project. It will determine when you
        should use the method of POST, and when you should use PUT.

        Only the foolhardy try to solve this problem with code.
    */

  // Need to subtract one from facilityMinerals and add one to colonyMinerals when button clicked
  // if colonyMineral exists put +1 mineralId and put -1 mineralId facilityMineral
  // else colonyMineral doesnt exist post +1 mineralId
  try {
    // Ensure facilityId, colonyId, and mineralId are set
    if (!state.facilityId || !state.colonyId || !state.mineralId) {
      console.error("Facility, Colony, or Mineral ID is not set in state.");
      return;
    }

    // Fetch necessary data
    const [facilityMineralsResponse, colonyMineralsResponse] =
      await Promise.all([
        fetch("http://localhost:8088/facilityMinerals"),
        fetch("http://localhost:8088/colonyMinerals"),
      ]);

    const facilityMinerals = await facilityMineralsResponse.json();
    const colonyMinerals = await colonyMineralsResponse.json();

    // Find the selected facility mineral
    const selectedFacilityMineral = facilityMinerals.find(
      (fm) =>
        fm.miningFacilityId === state.facilityId &&
        fm.mineralsId === state.mineralId
    );

    if (!selectedFacilityMineral || selectedFacilityMineral.quantity <= 0) {
      console.error(
        "This mineral is out of stock or not found in the facility."
      );
      return;
    }

    // Subtract 1 from the facility mineral
    selectedFacilityMineral.quantity -= 1;

    // Update the facility mineral in the database
    await fetch(
      `http://localhost:8088/facilityMinerals/${selectedFacilityMineral.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedFacilityMineral),
      }
    );

    // Find the colony mineral for the selected colony and mineral
    let selectedColonyMineral = colonyMinerals.find(
      (cm) =>
        cm.colonyId === state.colonyId && cm.mineralsId === state.mineralId
    );

    if (selectedColonyMineral) {
      // If the colony already has this mineral, add 1 to its quantity
      selectedColonyMineral.quantity += 1;

      // Update the colony mineral in the database
      await fetch(
        `http://localhost:8088/colonyMinerals/${selectedColonyMineral.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedColonyMineral),
        }
      );
    } else {
      // If the colony doesn't have this mineral, create a new entry
      selectedColonyMineral = {
        colonyId: state.colonyId,
        mineralsId: state.mineralId,
        quantity: 1,
      };

      await fetch("http://localhost:8088/colonyMinerals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedColonyMineral),
      });
    }

    console.log("Mineral successfully transferred!");
    document.dispatchEvent(new CustomEvent("stateChanged"));
  } catch (error) {
    console.error("Error during mineral transfer:", error);
  }
};
