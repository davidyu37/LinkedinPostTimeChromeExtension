import { getDate } from "../utils/getPostTime.js";

const currentUrl = window.location.href;

function getDataUrnOfContainer(container) {
    // Find the closest parent with the class 'feed-shared-update-v2'
    const parentElement = container.closest(".feed-shared-update-v2");

    if (parentElement) {
        // Get the 'data-urn' attribute from the parent element
        return parentElement.getAttribute("data-urn");
    } else {
        console.log("Parent element with specified class not found");
        return null;
    }
}

// This function changes the background color of the provided element
function insertTextIntoContainer(container) {
    const targetSubDescription = container.querySelector(
        ".t-black--light.t-12.t-normal.update-components-actor__sub-description--tla"
    );
    if (targetSubDescription && !targetSubDescription.hasAttribute("custom-timestamp-appended")) {
        // Create a new span element
        const newSpan = document.createElement("span");
        if (currentUrl.includes("/recent-activity/all/")) {
            const dataUrn = getDataUrnOfContainer(container);
            if (dataUrn) {
                newSpan.textContent = ` ${getDate(dataUrn)}`; // Set the text for the new span
            }
        } else {
            newSpan.textContent = ` ${getDate(currentUrl)}`; // Set the text for the new span
        }
        // Append the new span as the last child of the target container
        targetSubDescription.appendChild(newSpan);

        // Set a custom attribute to mark that the custom span has been appended
        targetSubDescription.setAttribute("custom-timestamp-appended", "true");
    }
}

// Set to keep track of the original .update-components-actor__container elements
let originalContainers = new Set();

// Function to process initial containers
function processInitialContainers() {
    const containers = document.querySelectorAll(".update-components-actor__container");
    containers.forEach((container) => {
        insertTextIntoContainer(container);
        originalContainers.add(container);
    });
}

// MutationObserver callback
const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
                // Check if the .display-flex.flex-wrap.list-style-none.justify-center element is added
                if (
                    node.querySelector &&
                    node.querySelector(".display-flex.flex-wrap.list-style-none.justify-center") &&
                    originalContainers.size === 0
                ) {
                    processInitialContainers();
                }

                // Check for new .update-components-actor__container elements
                const newContainers = node.querySelectorAll
                    ? node.querySelectorAll(".update-components-actor__container")
                    : [];
                newContainers.forEach((newContainer) => {
                    if (!originalContainers.has(newContainer)) {
                        insertTextIntoContainer(newContainer);
                        originalContainers.add(newContainer);
                    }
                });
            });
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the document for childList mutations
observer.observe(document, { childList: true, subtree: true });

processInitialContainers();
