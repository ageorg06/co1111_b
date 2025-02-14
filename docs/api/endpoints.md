# API Endpoints

## /th/api/list
- Description: Lists the available treasure hunts.
- Parameters:
  - `include-finished` (optional): Specifies that the reply must include all treasure hunts, including finished ones.

## /th/api/start
- Description: Starts a treasure hunt for a player.
- Parameters:
  - `player` (mandatory): The requested player name or nickname.
  - `app` (mandatory): The name of the app used to play the treasure hunt.
  - `treasure-hunt-id` (mandatory): The ID of the treasure hunt to be launched.

## /th/api/question
- Description: Retrieves a question for a player.
- Parameters:
  - `session` (mandatory): The ID of the session which corresponds to this player.

## /th/api/answer
- Description: Answers a question for a player.
- Parameters:
  - `session` (mandatory): The ID of the session which corresponds to this player.
  - `answer` (mandatory): The answer to the question.

## /th/api/location
- Description: Updates the location of a player.
- Parameters:
  - `session` (mandatory): The ID of the session which corresponds to this player.
  - `latitude` (mandatory): The latitude of the current location.
  - `longitude` (mandatory): The longitude of the current location.

## /th/api/skip
- Description: Skips a question for a player.
- Parameters:
  - `session` (mandatory): The ID of the session which corresponds to this player.

## /th/api/score
- Description: Retrieves the score of a player.
- Parameters:
  - `session` (mandatory): The ID of the session which corresponds to this player.

## /th/api/leaderboard
- Description: Retrieves the leaderboard for a treasure hunt.
- Parameters:
  - `session` (mandatory): The ID of the session which corresponds to this player.
  - `treasure-hunt-id` (mandatory): The ID of the treasure hunt.
  - `sorted` (optional): Specifies that the score list is to be sorted from higher to lower scores.
  - `limit` (optional): Limits the number of entries that appear in the leaderboard.