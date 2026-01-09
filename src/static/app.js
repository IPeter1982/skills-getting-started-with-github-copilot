document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

    // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="activity-card-participants">
            <div class="activity-card-participants-title">Résztvevők:</div>
              <div class="activity-card-participants-list">
              ${
                details.participants.length > 0
                  ? details.participants.map(p => `<li>${p}</li>`).join("")
                  : '<li><em>Még nincs jelentkező</em></li>'
              }
              </div>
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        // Aktivitások újratöltése, hogy a résztvevők azonnal frissüljenek
        await fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
  function renderParticipants(participants) {
      const list = document.getElementById('participants');
      list.innerHTML = '';
      participants.forEach((participant, idx) => {
          const div = document.createElement('div');
          div.className = 'participant-row';
          const nameSpan = document.createElement('span');
          nameSpan.textContent = participant;
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-btn';
          deleteBtn.title = 'Törlés';
          deleteBtn.innerHTML = '&#128465;'; // kuka ikon Unicode
          deleteBtn.onclick = () => unregisterParticipant(idx);
          div.appendChild(nameSpan);
          div.appendChild(deleteBtn);
          list.appendChild(div);
      });
  }

  function unregisterParticipant(idx) {
      if (window.participants && idx >= 0 && idx < window.participants.length) {
          window.participants.splice(idx, 1);
          renderParticipants(window.participants);
      }
  }
