# FIFA World Cup 2026 Prediction Agent

TypeScript agent that predicts FIFA World Cup 2026 match outcomes, group standings, and tournament winners using an ensemble of Elo, Poisson, and form-based models.

## Features

- **Match predictions** — win/draw/loss probabilities and expected goals
- **Group standings** — simulated points tables from predicted results
- **Tournament simulation** — projected champion and semifinalists
- **Value bet detection** — compare model vs market odds with Kelly sizing
- **Agent tools** — extensible tool-based prediction orchestration

## Quick Start

```bash
npm install
npm run predict -- configs                        # list prediction configs
npm run predict -- predict A1                     # default (balanced)
npm run predict -- predict A1 --config elo-heavy  # use a specific config
npm run predict -- predict A1 --ai                # hybrid: statistical + AI
npm run predict -- hybrid A1 --ai-weight 0.4      # side-by-side breakdown
npm run predict -- compare A1                     # compare all configs + hybrid
npm run predict -- standings
npm run predict -- tournament --config host-bias
npm run predict -- value-bets
npm test
```

## AI Integration

Combine statistical models with an LLM for qualitative factors (form, tactics, host pressure).

| Mode | Command | API key needed |
|------|---------|----------------|
| Statistical only | `predict A1` | No |
| Hybrid (mock AI) | `predict A1 --ai` or `--mock-ai` | No |
| Hybrid (live AI) | `predict A1 --ai` | Yes — set `OPENAI_API_KEY` |

Copy `.env.example` to `.env` and set your key. Works with any OpenAI-compatible endpoint via `AI_BASE_URL`.

```bash
# Default blend: 70% statistical + 30% AI
AI_BLEND_WEIGHT=0.3 npm run predict -- hybrid A1
```

## Prediction Configs

| Config | Best for |
|--------|----------|
| `balanced` | Default — blended Elo, goals, and form |
| `elo-heavy` | Clear favorites (Argentina, France, Brazil) |
| `form-heavy` | Teams on hot/cold streaks |
| `goals-heavy` | Over/under and scoreline bets |
| `conservative` | Higher draw probability, safer accumulators |
| `host-bias` | USA/MEX/CAN at home venues |

Pass `--config <name>` to any command, or use `compare` to see all configs side-by-side.

## Models

| Model | Weight (balanced) | Description |
|-------|--------|-------------|
| Elo | 35% | Rating-based win probability with home advantage |
| Poisson | 30% | Goal distribution from attack/defense strength |
| Form | 20% | Recent results momentum score |
| Squad | 15% | Squad market value strength (optional) |

## Project Structure

```
src/
├── agent/          # Prediction agent and tools
├── ai/             # AI provider, prompt builder, hybrid combiner
├── cli/            # Command-line interface
├── config/         # Prediction + AI config profiles
├── data/           # Teams, groups, venues, fixtures
├── models/         # Elo, Poisson, form, ensemble
├── odds/           # Market odds and value bets
├── predictions/    # Match and tournament predictors
├── types/          # TypeScript interfaces
└── utils/          # Kelly, EV, logging, formatting
```
