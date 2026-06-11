# FIFA World Cup 2026 Prediction Agent

<img width="600" height="336" alt="download" src="https://github.com/user-attachments/assets/d5e88662-4009-4dbb-9148-caee337892fa" />

https://github.com/user-attachments/assets/b753e78f-ed0f-4d43-87a8-3c4f95fd46ad

TypeScript agent that predicts FIFA World Cup 2026 match outcomes, group standings, and tournament winners using an ensemble of Elo, Poisson, and form-based models — with optional AI hybrid blending and value-bet detection.

## Features

- **Match predictions** — win/draw/loss probabilities and expected goals per fixture
- **Group standings** — simulated points tables from predicted results
- **Tournament simulation** — projected champion and semifinalists
- **Value bet detection** — compare model vs market odds with Kelly sizing
- **Agent tools** — extensible tool-based prediction orchestration
- **AI hybrid mode** — blend statistical ensemble with LLM qualitative analysis
- **Redis cache** — optional caching for predictions and comparisons

## Quick start

**Requirements:** Node.js 20+

```bash
npm install
npm test
npm run predict -- configs
npm run predict -- predict A1
npm run predict -- clubs Arsenal Chelsea
npm run predict -- standings
npm run predict -- value-bets
```

## CLI reference

| Command | Description |
|---------|-------------|
| `clubs <home> <away> [--mock-ai] [--no-ai]` | Club match prediction from two team names (remote CSV history + AI hybrid) |
| `configs` | List available prediction config profiles |
| `predict <id> [--config name] [--ai]` | Single-match prediction (optional AI hybrid) |
| `hybrid <id> [--ai-weight n]` | Side-by-side statistical vs AI breakdown |
| `compare <id>` | Compare all configs + hybrid on one fixture |
| `standings` | Simulated group tables |
| `tournament [--config name]` | Bracket / champion projection |
| `value-bets` | Model vs market edge scan with Kelly hints |
| `redis ping` / `redis flush` | Cache health and purge |

### Examples

```bash
npm run predict -- clubs Arsenal Chelsea
npm run predict -- clubs Arsenal Chelsea --mock-ai
npm run predict -- predict A1
npm run predict -- predict A1 --config elo-heavy
npm run predict -- predict A1 --ai
npm run predict -- hybrid A1 --ai-weight 0.4
npm run predict -- compare A1
npm run predict -- tournament --config host-bias
npm run predict -- value-bets
```

## Club predictions (agent + tools)

Predict domestic club fixtures by team name — separate from the World Cup `matchId` flow and from [sports-betting-toolbox](https://github.com/georgedouzas/sports-betting). Uses `PredictionAgent.predictClubs()` and the `predict_clubs` agent tool.

1. Loads remote soccer CSV history (England, Spain, Italy, Germany, France)
2. Builds team form and head-to-head context
3. Blends statistical baseline with AI via the existing `ai/` provider pattern

```bash
cp .env.example .env   # set OPENAI_API_KEY for live AI
npm run predict -- clubs Arsenal Chelsea
npm run predict -- clubs Arsenal Chelsea --mock-ai   # offline
npm run predict -- clubs Arsenal Chelsea --no-ai      # statistical only
```

Output: home/draw/away probabilities, predicted outcome, confidence, and AI reasoning.

## AI integration

Combine statistical models with an LLM for qualitative factors (form, tactics, host pressure).

| Mode | Command | API key needed |
|------|---------|----------------|
| Statistical only | `predict A1` | No |
| Hybrid (mock AI) | `predict A1 --ai` or `--mock-ai` | No |
| Hybrid (live AI) | `predict A1 --ai` | Yes — set `OPENAI_API_KEY` |

Copy `.env.example` to `.env` and set your key. Works with any OpenAI-compatible endpoint via `AI_BASE_URL`.

```bash
AI_BLEND_WEIGHT=0.3 npm run predict -- hybrid A1
```

## Prediction configs

| Config | Best for |
|--------|----------|
| `balanced` | Default — blended Elo, goals, and form |
| `elo-heavy` | Clear favorites (Argentina, France, Brazil) |
| `form-heavy` | Teams on hot/cold streaks |
| `goals-heavy` | Over/under and scoreline bets |
| `conservative` | Higher draw probability, safer accumulators |
| `host-bias` | USA/MEX/CAN at home venues |

Pass `--config <name>` to any command, or use `compare` to see all configs side-by-side.

## Models (balanced ensemble)

| Model | Weight | Description |
|-------|--------|-------------|
| Elo | 35% | Rating-based win probability with home advantage |
| Poisson | 30% | Goal distribution from attack/defense strength |
| Form | 20% | Recent results momentum score |
| Squad | 15% | Squad market value strength (optional) |

## Architecture

```
fifa-world-cup-2026-prediction-agent/
├── src/
│   ├── agent/          Prediction agent and tools
│   ├── ai/             AI provider, prompt builder, hybrid combiner
│   ├── cli/            Command-line interface
│   ├── config/         Prediction + AI config profiles
│   ├── data/           Teams, groups, venues, fixtures, club CSV history
│   ├── models/         Elo, Poisson, form, ensemble
│   ├── odds/           Market odds and value bets
│   ├── predictions/    Match, club, and tournament predictors
│   ├── types/          TypeScript interfaces
│   └── utils/          Kelly, EV, logging, Redis cache
└── tests/
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Live AI hybrid mode |
| `AI_BASE_URL` | OpenAI-compatible API base |
| `AI_BLEND_WEIGHT` | AI weight in hybrid (default 0.3) |
| `REDIS_URL` / `REDIS_HOST` | Optional prediction cache |
| `REDIS_ENABLED` | `false` for memory-only |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run predict` | CLI agent |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Library build |
| `npm test` | Vitest |

## Library usage

```typescript
import { predictMatch } from "./src/predictions/matchPredictor.js";
import { findValueBets } from "./src/odds/valueBets.js";

const result = predictMatch("A1", "balanced");
const edges = findValueBets();
```
