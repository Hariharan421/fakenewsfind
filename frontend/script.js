async function checkNews() {

    const newsText = document.getElementById("newsText");
    const checkButton = document.getElementById("checkButton");

    const loading = document.getElementById("loading");

    const result = document.getElementById("result");
    const resultIcon = document.getElementById("resultIcon");
    const resultTitle = document.getElementById("resultTitle");
    const resultMessage = document.getElementById("resultMessage");

    const news = newsText.value.trim();

    // Check empty input
    if (news === "") {

        result.className = "result error";

        resultIcon.textContent = "⚠️";

        resultTitle.textContent = "No News Entered";

        resultMessage.textContent =
            "Please enter some news text before checking.";

        return;
    }

    // Show loading
    loading.style.display = "block";

    result.style.display = "none";

    checkButton.disabled = true;

    checkButton.textContent = "⏳ Checking...";

    try {

        // Send request to Flask backend
        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    news: news
                })
            }
        );

        const data = await response.json();

        // Hide loading
        loading.style.display = "none";

        checkButton.disabled = false;

        checkButton.textContent = "🔍 Check News";

        // Check server error
        if (!response.ok) {

            throw new Error(
                data.error || "Something went wrong"
            );
        }

        const prediction = data.prediction.toUpperCase();

        result.style.display = "block";

        // REAL NEWS
        if (prediction === "REAL") {

            result.className = "result real";

            resultIcon.textContent = "✅";

            resultTitle.textContent = "REAL NEWS";

            resultMessage.textContent =
                "The machine learning model predicts that this news is REAL.";

        }

        // FAKE NEWS
        else if (prediction === "FAKE") {

            result.className = "result fake";

            resultIcon.textContent = "🚨";

            resultTitle.textContent = "FAKE NEWS";

            resultMessage.textContent =
                "The machine learning model predicts that this news is FAKE.";

        }

        // Unknown result
        else {

            result.className = "result error";

            resultIcon.textContent = "❓";

            resultTitle.textContent = "Unknown Result";

            resultMessage.textContent =
                "The model returned an unexpected prediction.";
        }

    }

    catch (error) {

        console.error(error);

        loading.style.display = "none";

        checkButton.disabled = false;

        checkButton.textContent = "🔍 Check News";

        result.style.display = "block";

        result.className = "result error";

        resultIcon.textContent = "❌";

        resultTitle.textContent = "Connection Error";

        resultMessage.textContent =
            "Could not connect to the Flask server. Make sure app.py is running.";
    }
}


/* Clear button */

function clearNews() {

    document.getElementById("newsText").value = "";

    const result = document.getElementById("result");

    const loading = document.getElementById("loading");

    result.style.display = "none";

    result.className = "result";

    loading.style.display = "none";
}
