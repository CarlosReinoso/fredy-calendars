const isProd = window.location.hostname !== "localhost";
console.log("🚀 ~ isProd:", isProd)
const apiBaseUrl = isProd
  ? "https://pptr-test-seven.vercel.app"
  : "http://localhost:3001";
const enterCodeApi = `${apiBaseUrl}/api/enter-code`;

document
  .getElementById("verificationForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const code = document.getElementById("code").value;

    try {
      // Using the imported API URL constant
      const response = await fetch(enterCodeApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, waiting: false }),
      });

      const result = await response.json();

      if (response.ok) {
        document.getElementById("responseMessage").textContent = result.message;
      } else {
        document.getElementById("responseMessage").textContent = result.error;
      }
    } catch (error) {
      document.getElementById("responseMessage").textContent =
        "Error sending code: " + error.message;
    }
  });
