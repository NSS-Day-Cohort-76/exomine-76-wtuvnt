export const displayFacilityChoice = (event, facilities) => {
  if (event.target.name === "facility") {
    const selectedFacilityId = parseInt(event.target.value)

    const selectedFacility = facilities.find(facility => facility.id === selectedFacilityId)

    let html = `<p>Facilities Minerals for ${selectedFacility.name}</p>
                <p>${selectedFacility.minerals}</p>
    `
    return html
  }
}
