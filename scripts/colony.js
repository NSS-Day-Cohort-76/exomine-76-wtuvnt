export const  colonySelect = async () => {
  const response = await fetch("http://localhost:8088/colonies")
  const responseData = await response.json()

  const colonyHTML = responseData.map((obj) => {
    return `
    <option value="${obj.id}" name="colony">${obj.name}</option>`
  })
  return `<p>What colony would you like to choose:</p> <select>
  <option disabled selected>Select Colony </option>
    ${colonyHTML.join("")}
    </select>
  `
}