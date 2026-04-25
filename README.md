
![Wordships](https://8upload.com/image/ff8d99e3244799c9/Wordships-grey.png)


### Wordships is a word-guessing game for two players built with a React/TypeScript frontend and a .NET backend.
________________________________________


### Prerequisites
Make sure you have the following installed:

•	Node.js v22+

•	.NET SDK 10.0+

•	Docker (optional, for containerised runs)
________________________________________


### Installation
1.	Clone the repository: git clone https://github.com/Piercor/wordships.git
2.	`cd wordships`
3.	`npm run install-all` to install all dependencies (frontend + API test runner)
4.	`npm start` to start the application (backend + frontend dev server together)

The frontend is served by Vite and the .NET backend starts on http://localhost:5001.
________________________________________


### How to play
Wordships is a Battleship-inspired word game with a hint of Hangman, played on a grid. The goal is to find hidden words placed on the board by guessing their positions letter by letter, or guessing whole words, but be wary, guessing a word incorrectly would cause one of your letters to revealed to your opponent.

1.  Go to http://wordships.onrender.com.
2.  Enter your player name.
3.  Create a game clicking the "create game" button. An unique Game ID would be generated.
4.  Copy the generated ID and share it with your opponent.
5.  If you want to join an already created game, click on the "Already have a Game ID? Join instead" button.
6.  Paste the game ID given by your opponent and click on the "Join Game" button.
7.  If you are the player creating the game, click on the "Refresh to see if they've joined" button.
8.  If you are the player joining a game, click on the "Enter Game" button.
9.	Each player gets a set of randomly generated unique words to place on the grid at the start of each game.
    Both players gets one 6 letter word, two 5 letters, three 4 letters and four 3 letters.
10. The words can be placed either horizontally or vertically.
11. Word can't "touch" each others, that meaning that at least one empty square should be between words.
12. If you regreat the placement of a word, you can click on the word and remove it from the grid to place it again.
13. Once all of your words are placed, you can click the "Ready!" button.
14.	On your turn you can either guess one letter or a word. Note that guessing a word incorrectly would result in one of your letters being reveal.
    If you have only one letter left to be find, guessing a word incorrectly would result on you losing the game.
15. A list of guesses (either letters or words) is shown under the "guessing" field.
16.	Use the revealed letters as clues to figure out which full words your opponent has.
17.	The game ends when all words have been found. Try to find them all before your opponent does!
________________________________________


### Running the tests

All three test methods can be run together with:
`npm test`

Or individually:

|   Method   |        Command       |                  Description               |
|------------|----------------------|--------------------------------------------|
| Unit tests | `npm run test:xunit` |	C# xUnit tests for backend logic           |
| API tests  | `npm run test:api`   |	HTTP endpoint tests against a live backend |
| E2E tests  | `npm run test:e2e`	  | Browser-level tests using Playwright + BDD |

Note: The API and E2E tests require the backend to be running (`npm run backend` or `npm start`) before executing them separately.
________________________________________


### Testing & CI/CD overview

#### Test plan

The project uses a three-layer testing strategy:

•	Unit tests (xUnit/C#) validate backend game logic in isolation.

•	API tests (Node.js) verify the HTTP endpoints by sending requests to a running server instance.

•	E2E tests (Playwright + Gherkin/BDD) simulate real user interactions in a browser against the full stack.


#### CI Pipeline (GitHub Actions)
The pipeline triggers on every push and pull request to main and consists of four jobs:
1.	Security — scans the git history for leaked secrets using Gitleaks.
2.	Build — builds the backend and frontend, audits dependencies for high/critical vulnerabilities, and validates the Docker image with a Trivy scan.
3.	Tests — runs all three test suites in parallel using a matrix strategy (only after security and build pass).
4.	Report — always runs last, collects all test artifacts, and posts a summary to the GitHub Actions dashboard.


#### Deployment
Merging to main automatically triggers a deployment to Render via a separate deploy.yml workflow. Render handles the build and startup on its end.
________________________________________