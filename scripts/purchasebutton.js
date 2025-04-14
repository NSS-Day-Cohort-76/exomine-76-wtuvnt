import { purchaseMineral } from "./TransientState.js";

const handlePurchaseMineral = (clickEvent) => {
  if (clickEvent.target.name === "purchaseButton") {
    console.log("button-clicked!");
    purchaseMineral();
  }
};

export const purchaseButton = () => {
  document.addEventListener("click", handlePurchaseMineral);
  return `<button id="purchaseButton" name="purchaseButton">Purchase Mineral</button>`;
};
