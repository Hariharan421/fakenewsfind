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

        result.style.display = "block";
        result.className = "result error";

        resultIcon.textContent = "⚠️";
        resultTitle.textContent = "No News Entered";
        resultMessage.textContent =
            "Please enter some news before checking.";

        return;
    }

    // Show loading
    loading.style.display = "block";
    result.style.display = "none";

    checkButton.disabled = true;
    checkButton.textContent = "⏳ Checking...";

    try {

        const response = await fetch(
            "https://fakenewsfind.onrender.com/predict",
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

        if (!response.ok) {
            throw new Error(data.error || "Server error");
        }

        const prediction = data.prediction.toUpperCase();

        loading.style.display = "none";
        checkButton.disabled = false;
        checkButton.textContent = "🔍 Check News";

        result.style.display = "block";

        if (prediction === "REAL") {

            result.className = "result real";

            resultIcon.textContent = "✅";
            resultTitle.textContent = "REAL NEWS";

            resultMessage.textContent =
                "The machine learning model predicts that this news is REAL.";

        } else if (prediction === "FAKE") {

            result.className = "result fake";

            resultIcon.textContent = "🚨";
            resultTitle.textContent = "FAKE NEWS";

            resultMessage.textContent =
                "The machine learning model predicts that this news is FAKE.";

        } else {

            result.className = "result error";

            resultIcon.textContent = "❓";
            resultTitle.textContent = "Unknown Result";

            resultMessage.textContent =
                "The model returned an unexpected prediction.";
        }

    } catch (error) {

        console.error("Error:", error);

        loading.style.display = "none";

        checkButton.disabled = false;
        checkButton.textContent = "🔍 Check News";

        result.style.display = "block";
        result.className = "result error";

        resultIcon.textContent = "❌";
        resultTitle.textContent = "Connection Error";

        resultMessage.textContent =
            "Unable to connect to the prediction server. Please try again.";
    }
}


function clearNews() {

    document.getElementById("newsText").value = "";

    const result = document.getElementById("result");
    const loading = document.getElementById("loading");

    result.style.display = "none";
    result.className = "result";

    loading.style.display = "none";
}