# How to Update the Prediction Model 101

To keep the model's predictions perfectly accurate as the 2026 World Cup progresses, you must update the database with real-world match results. 

There are **two** files you need to update whenever a match finishes.

## Step 1: Update the Form History
**File:** `src/data/formHistory.ts`

This file calculates a team's "Current Form" and "Poisson Expected Goals" based on their last 5 matches. 
Whenever a match ends, you must add the final score to **both** teams' histories at the very bottom of their arrays.

**Example:** If Argentina beats Mexico 2-0.
1. Open `formHistory.ts`
2. Scroll to `arg:` and add:
   `{ opponentId: "mex", goalsFor: 2, goalsAgainst: 0, isHome: true },`
3. Scroll to `mex:` and add:
   `{ opponentId: "arg", goalsFor: 0, goalsAgainst: 2, isHome: false },`

> [!TIP]
> The model only looks at the **bottom 5 entries** in a team's array. You do not need to delete old matches. Just keep adding new ones to the bottom!

## Step 2: Lock In the Standings
**File:** `src/data/completedResults.ts`

This file tells the simulation engine that a match has officially concluded, forcing the standings algorithm to use the real score instead of trying to predict it.

**Example:** Adding Round 3 matches
1. Open `completedResults.ts`
2. Look at the comments to find the correct Fixture ID for the match (e.g. `A3` = MEX vs CZE).
3. Add a new line to the `COMPLETED_RESULTS` array with the exact score:
   `{ fixtureId: "A3", homeGoals: 3, awayGoals: 1 },`

> [!WARNING]
> You must ensure the `homeGoals` maps to the team listed *first* in the fixture ID comment, and `awayGoals` maps to the team listed *second*.

## Step 3: Update Knockout Stage Results
**File:** `src/data/completedResults.ts`

When the tournament enters the knockout stages (Round of 32, Round of 16, etc.), you no longer use Fixture IDs. Instead, you declare the winner and loser of the match to forcefully advance them in the simulation.

**Example:** If Argentina beats Mexico in the Round of 32.
1. Open `completedResults.ts`
2. Scroll to the bottom of the file to the `COMPLETED_KNOCKOUT_RESULTS` array.
3. Add a new line with the winner and loser:
   `{ winnerId: "arg", loserId: "mex" },`

## Step 4: Run the Predictions!

Once both files are saved, the model will automatically consume your new data.
Run your commands to see the updated statistical probabilities:

- **Check new group standings:** 
  `npm run predict -- standings`
- **Predict the new World Cup Champion:** 
  `npm run predict -- tournament`
- **Predict a specific matchup:** 
  `npm run predict -- countries "Spain" "Germany"`
