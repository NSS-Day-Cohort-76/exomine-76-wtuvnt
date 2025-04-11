
export let facilitiesData = []
export const facilitySelect = async () => {
  const response = await fetch("http://localhost:8088/miningFacilities")
  const responseData = await response.json()
  facilitiesData = responseData


  const facilitiesHTML = responseData.map((obj) => {
    return `<option value="${obj.id}">${obj.name}</option>`
  })
  return `<p>What Colony Would you like to buy from?</p><select name="facility">
    <option select disabled>Select Colony</option>
    ${facilitiesHTML.join("")}
    
    </select>`
}

