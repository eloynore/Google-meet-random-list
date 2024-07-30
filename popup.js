document.getElementById("generate").addEventListener("click", async () => {
  // Send a message to the content script to get participants
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: getParticipants,
    },
    (results) => {
      const participants = results[0].result;
      if (participants.length > 0) {
        const shuffled = shuffleArray(participants);
        displayParticipants(shuffled);
      } else {
        displayParticipants(["No participants found"]);
      }
    }
  );
});

// Function to get participants from the Meet page
function getParticipants() {
  const participantElements = document.querySelectorAll(
    '[role="listitem"] div[avatar-tooltip-id] div[jsname] span:first-child'
  );
  const participants = Array.from(participantElements).map(
    (el) => el.innerText
  );
  return participants;
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to display participants in the popup
function displayParticipants(participants) {
  const ul = document.getElementById("participantList");
  ul.innerHTML = "";
  participants.forEach((participant) => {
    const li = document.createElement("li");
    li.textContent = participant;
    ul.appendChild(li);
  });
}
