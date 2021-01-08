# another-discord-bot
Yet another discord bot. Made for my friends who have difficulties looking to play together.

## Setup

1. `npm install`

2. Add a `.env` file with all necessary variables (see .env.example). Then run `npm run prod`

3. `npm run prod`

## Usage

Show help message

```
/help
```

Look for a group to play

```
/letsplay [game] [player] [at]
```

The bot will try to arrange a lobby when a `/letsplay` command is called. When the time is up, the bot determines whether there is enough people to start the game, and notifies all participants the result.

## Example

looking to play Among Us with 8-10 people at 22:00

```
/letsplay "Among Us" 8-10 22:00
```

looking to play LOL with 5 people at 22:00

```
/letsplay LOL 5 2200
```

looking to play Minecraft with 2+ people at 22:00

```
/letsplay Minecraft 2+ 22
```

looking to play any game with 2+ people at 22:00

```
/letsplay --player 2+ 22
```
