// --- DOM Elements ---
const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameOverDiv = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const difficultySelect = document.getElementById("difficulty");
const highScoreDisplay = document.getElementById("high-score");

// --- Game Words ---
// Using a Set to automatically remove duplicate words from the initial list
const baseWords = [...new Set([
    "abandon", "ability", "absence", "academy", "account", "accuse", "achieve", "acquire", "address", "advance",
    "advice", "affect", "against", "airline", "airport", "alcohol", "allege", "already", "amazing", "analyze",
    "ancient", "anger", "animal", "annual", "answer", "anxiety", "anybody", "apology", "appeal", "appoint",
    "approve", "argue", "arrange", "arrival", "article", "artist", "aspect", "assault", "attempt", "attract",
    "auction", "average", "awesome", "balance", "barrier", "battery", "because", "believe", "benefit", "besides",
    "between", "beyond", "billion", "biology", "blanket", "blessing", "bother", "breathe", "briefly", "brother",
    "builder", "burden", "cabinet", "camera", "capable", "capital", "capture", "careful", "carrier", "carve",
    "casual", "cattle", "ceiling", "central", "ceramic", "chamber", "channel", "chapter", "charity", "chicken",
    "chronic", "circuit", "clarify", "classic", "climate", "closely", "clothes", "collect", "college", "combine",
    "comfort", "command", "comment", "compact", "company", "compare", "compete", "complex", "compose", "concept",
    "concern", "conduct", "confirm", "connect", "consent", "consist", "consult", "consume", "contact", "contain",
    "content", "contest", "context", "control", "convert", "copper", "correct", "council", "counter", "country",
    "courage", "crystal", "culture", "curious", "current", "customs", "damage", "danger", "dealer", "debate",
    "decade", "decide", "declare", "decline", "default", "defense", "deliver", "density", "deposit", "deserve",
    "despite", "destroy", "develop", "diamond", "digital", "dilemma", "disease", "dismiss", "display", "dispute",
    "distance", "diverse", "divorce", "doctrine", "dolphin", "domestic", "donation", "drawing", "driving", "dynamic",
    "economy", "edition", "educate", "elegant", "element", "embrace", "emerge", "emotion", "emperor", "employ",
    "enclose", "endless", "endorse", "engage", "enhance", "enough", "enquiry", "enrich", "enroll", "enroute",
    "episode", "equator", "erosion", "essence", "establish", "eternal", "ethical", "evident", "exactly", "examine",
    "example", "excited", "exclude", "execute", "exhibit", "expense", "explain", "explore", "express", "extreme",
    "factory", "failure", "fantasy", "fashion", "feature", "federal", "feeling", "fiction", "finance", "finding",
    "fitness", "flavor", "flexible", "floating", "foreign", "forever", "formula", "fortune", "forward", "freedom",
    "freight", "frequent", "friction", "gallery", "garbage", "general", "genetic", "genuine", "gesture", "glacier",
    "glimpse", "gravity", "greater", "grocery", "habitat", "harmony", "harvest", "heading", "healthy", "hearing",
    "heavily", "helpful", "heritage", "highway", "history", "holiday", "honesty", "horizon", "hostile", "housing",
    "however", "hundred", "hygiene", "illegal", "illness", "imagine", "impress", "improve", "include", "income",
    "indeed", "indicate", "infant", "inquiry", "insight", "install", "instead", "intense", "interact", "interest",
    "interior", "involve", "isolate", "journal", "journey", "justice", "justify", "kitchen", "kingdom", "knowing",
    "landing", "laptop", "largely", "lasting", "lateral", "laundry", "lawyer", "leading", "leisure", "liberty",
    "library", "license", "limited", "logical", "loyalty", "machine", "manager", "mansion", "massive", "maximum",
    "meaning", "measure", "medical", "mention", "message", "mineral", "minimal", "minimum", "miracle", "mission",
    "mixture", "monitor", "monster", "monthly", "morning", "musical", "mystery", "natural", "neither", "network",
    "neutral", "nominee", "notable", "nothing", "nuclear", "numeric", "obvious", "offense", "officer", "ongoing",
    "opening", "operate", "opinion", "optical", "organic", "outcome", "outdoor", "outline", "outlook", "outside",
    "overall", "package", "painful", "partial", "partner", "passion", "patient", "pattern", "payment", "penalty",
    "pending", "percent", "perfect", "perform", "perhaps", "persist", "physics", "picture", "pioneer", "plastic",
    "pleased", "pocket", "popular", "portion", "poverty", "precise", "predict", "premise", "premium", "prepare",
    "present", "prevent", "primary", "privacy", "problem", "process", "produce", "product", "profile", "program",
    "project", "promise", "promote", "protect", "protein", "protest", "provide", "publish", "purpose", "pursue",
    "qualify", "quality", "quarter", "radical", "rapidly", "rarely", "reality", "realize", "receipt", "receive",
    "recover", "reflect", "reform", "refugee", "regimen", "regular", "related", "release", "removal", "replace",
    "request", "require", "reserve", "resolve", "respect", "respond", "restore", "retired", "revenue",
    "reverse", "review", "revise", "routine", "satisfy", "science", "section", "segment", "serious", "service",
    "session", "setting", "several", "shortly", "showing", "silence", "similar", "sincere", "society", "soldier",
    "somehow", "someone", "speaker", "special", "species", "sponsor", "stadium", "station", "storage", "strange",
    "stretch", "student", "subject", "success", "suggest", "summary", "support", "suppose", "surface", "surgery",
    "surplus", "survive", "suspect", "sustain", "teacher", "telling", "tension", "theater", "therapy", "thereby",
    "thought", "through", "tonight", "totally", "tourist", "traffic", "tragedy", "trainer", "transit", "trouble",
    "typical", "uniform", "unknown", "upgrade", "utility", "variety", "various", "vehicle", "venture", "version",
    "veteran", "victory", "village", "violent", "virtual", "visible", "visitor", "vitamin", "voltage", "welfare",
    "western", "whereas", "whether", "willing", "winning", "without", "witness", "working", "writing", "yourself",
    "zealous"
])];

// Filter words based on length for difficulty levels
const easyWords = baseWords.filter(word => word.length <= 5);
const mediumWords = baseWords.filter(word => word.length > 5 && word.length <= 8);
const hardWords = baseWords.filter(word => word.length > 8);

let words = mediumWords; // Default word set

// --- Game State ---
let score;
let time;
let timer;
let gameActive;
let highScore = localStorage.getItem('typingGameHighScore') || 0;

// --- Functions ---

// Get a new word based on the selected difficulty
function getNewWord() {
    const difficulty = difficultySelect.value;
    if (difficulty === 'easy') words = easyWords;
    else if (difficulty === 'medium') words = mediumWords;
    else words = hardWords;

    const randomIndex = Math.floor(Math.random() * words.length);
    wordDisplay.textContent = words[randomIndex];
    wordDisplay.classList.add('fadeIn');
    // Remove animation class after it finishes to allow re-triggering
    setTimeout(() => wordDisplay.classList.remove('fadeIn'), 500);
}

// Check the user's input against the current word
function checkInput() {
    if (!gameActive) return;

    if (wordInput.value.toLowerCase() === wordDisplay.textContent.toLowerCase()) {
        score++;
        scoreDisplay.textContent = score;
        wordInput.value = ""; // Clear the input field
        wordInput.classList.add('correct');
        setTimeout(() => wordInput.classList.remove('correct'), 300);
        getNewWord();
    }
}

// Start and run the game timer
function startTimer() {
    timeDisplay.classList.remove('time-warning');
    timer = setInterval(() => {
        time--;
        timeDisplay.textContent = time;
        if (time <= 5 && time > 0) {
            timeDisplay.classList.add('time-warning');
        }
        if (time === 0) {
            endGame();
        }
    }, 1000);
}

// Reset UI and variables for a new game
function resetGame() {
    score = 0;
    time = 30; // Set game time here
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    wordInput.value = "";
    gameOverDiv.classList.add("hide");
    wordInput.classList.remove('correct', 'incorrect');
}

// Start the game
function startGame() {
    if (gameActive) return; // Prevent starting a game that's already running

    resetGame();
    gameActive = true;
    getNewWord();
    startTimer();

    // Update UI state
    wordInput.disabled = false;
    wordInput.focus();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    difficultySelect.disabled = true;
}

// End the game
function endGame() {
    clearInterval(timer); // Stop the clock
    gameActive = false;

    // Check and update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('typingGameHighScore', highScore);
        highScoreDisplay.textContent = highScore;
    }

    // Update UI state
    finalScore.textContent = score;
    gameOverDiv.classList.remove("hide");
    wordInput.disabled = true;
    stopBtn.disabled = true;
    startBtn.disabled = false;
    difficultySelect.disabled = false;
    wordDisplay.textContent = "Press Start";
    timeDisplay.classList.remove('time-warning');
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    highScoreDisplay.textContent = highScore;
});
startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", endGame);
wordInput.addEventListener("input", checkInput);