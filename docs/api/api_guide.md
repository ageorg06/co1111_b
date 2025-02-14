Code Cyprus Treasure Hunt: API Guide        

![Code Cyprus - Pirate API logo](/th/pirate_api.png "Code Cyprus - Pirate API logo") Treasure Hunt: API Guide

A Code Cyprus project

* * *

This is version 1.0.0 of the Treasure Hunt API Guide. It is available online at `http://www.codecyprus.org/th/guide`.

There is also a Treasure Hunt _testing_ API Guide, available at `[http://www.codecyprus.org/th/testing](/th/testing)`.

### Introduction

This service provides the server-side functionality for the Treasure Hunt challenge. This challenge is undertaken by students pursuing the [BSc (Hons) Computing degree](http://computing.uclancyprus.ac.cy) at [UCLan Cyprus](http://uclancyprus.ac.cy), as part of module CO1111 (The Computing Challenge). This backend is designed for and deployed on Google's App-Engine platform.

The concept of the challenge is inspired from the equivalent Four-week challenge, originally created at UCLan in Preston. Given the API description of the service, the students are asked to develop mobile apps either using AppInventor or pure HTML+JavaScript. The main goal is to provide students with an overview of key practical aspects of computing.

This project is open-source, and its [code is available for cloning from GitHub](http://github.com/nearchos/codecyprusorg) under the [LGPL-3.0 license](https://opensource.org/licenses/LGPL-3.0). For feedback or questions please contact npaspallis at uclan point ac dot uk.

### Overview of the API

An API (_Application Programming Interface_) is a set of functions, typically available over the Web, which allow third-party developers to integrate with an existing app/functionality. In this particular case, the API allows anyone interested to build a Treasure Hunt app, such as the [formal Android App of Code Cyprus](https://play.google.com/store/apps/details?id=org.codecyprus.android_client), to do so.

Like most Web APIs, this one realizes the client/server paradigm where the client makes _requests_ and the _server_ answers them. For instance, a request is to provide a _list_ of the available Treasure Hunts.

To enable maximum security possible, the whole API requires secure connections and thus any requests applied to `http://codecyprus.org/th/api/...` are automatically redirected to their secure equivalent `https://codecyprus.org/th/api/...`. This is in line with best practices [recommended by the likes of Google etc.](https://support.google.com/webmasters/answer/6073543?hl=en) who even rank websites higher when they are secured with HTTPS.

#### Requests

Requests are generally formed as URLs, such as `http://codecyprus.org/th/api/list`. In this API, all requests are based on the same server URL `http://codecyprus.org` and use a path that has a prefix of `/th/api/<call>` where `<call>` identifies one of the available calls described below.

Requests can also include parameters. Those are defined as `<name>=<value>` pairs, such as `answer=42`. In this example the _name_ of the parameter is `answer` and its value is `42`. If multiple parameters need to be specified in the same call, you can join them using the ampersand symbol `&`. For example you could specify two parameters `player` and `app` as `player=Homer&app=simpsons-app`. Note that parameters are defined right after the call and their beginning is identified with a question mark `?`. For example, a full call URL is `http://codecyprus.org/th/api/start?player=Homer&app=simpsons-android`.

Last note that Boolean parameters are sometimes defined as just a `name` rather than a full `<name>=<value>` pair. For instance `include-finished` is a valid parameter and the call `https://codecyprus.org/th/api/list?include-finished=true` is equivalent to `https://codecyprus.org/th/api/list?include-finished`.

#### Replies

Following a request, the server replies with a proper reply message. Replies are encoded in [JSON](http://www.json.org) (_JavaScript Object Notation_) which is probably the most widely-used encoding format used in Web APIs. if you need a fresh-up on JSON you can follow any of the many online tutorials, such as [this one from W3Schools](https://www.w3schools.com/js/js_json_intro.asp).

Each API call has its own specific reply, encoding relevant information as needed. Data included in specific call replies are discussed in detail in the [calls](#calls) section. Nevertheless, one thing common in all replies is the `status` property which gets the value `OK` when the call was successful or `ERROR` if a problem occurred, such as a required parameter that is missing.

#### Errors

An error can occur for many reasons. A proper client app must anticipate errors and either overcome them (e.g. retry if there was a connection error) or inform the user accordingly (e.g. when trying to use a player name that is already in use).

Errors can occur if you make a mistake in forming the URL (e.g. a [404 resource not found error](https://en.wikipedia.org/wiki/HTTP_404) if you mistype the server URL) or if there is an error outside your control (e.g. a [500 internal server error](https://en.wikipedia.org/wiki/HTTP_500)).

Nevertheless, errors might occur even when the server responds with a success code (i.e. [200 OK](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success)). In this case, the error will be identified in the reply message, with a `status` property marked as `ERROR` and an array of one or more error messages named `errorMessages`.

### Concepts

The Treasure Hunt is built around the concepts of `treasure hunt`, `session`, and `question`.

The `treasure hunt` is the main concept describing a treasure hunt game that includes _questions_, and _players_. Normally, every treasure hunt has a starting and an ending time. The list of available treasure hunts can be accessed using the [/th/api/list](#list) call.

The `session` is an instance of an active player. Each session is associated with one treasure hunt and includes information like the player name, the current question, etc. A session is created when the player uses the [/th/api/start](#start) call.

A `question` includes the information required to describe the question to the user and includes the question text itself, the expected type of the answer (e.g. Boolean, Integer, Multiple Choice Question, etc.) and whether it is mandatory or can be skipped. A player can get the current question using the [/th/api/question](#question) call.

### Calls

The essence of the API is the various function calls available to the clients. This section describes the available calls, their semantics, and the expected returned data.

A typical flow of using the API is shown in this flow chart:

![Flow chart showing typical use of the Treasure Hunt API](/th/thc-api.png)

### /th/api/list

The starting point of any treasure hunt challenge is to list the available treasure hunts so the player can pick the one they want to compete in. This is enabled using the `/th/api/list` call.

The API call is as follows:

`https://codecyprus.org/th/api/list` [Try it](https://codecyprus.org/th/api/list) Copy

The call has these parameters:

*   `include-finished` is an _optional_ parameter specifying that the reply must include all treasure hunts, including finished ones. This is usually not needed. A sample request is `https://codecyprus.org/th/api/list?include-finished`

The output includes the `status` and the array of available `treasureHunts`.

[Show sample output](#collapse-call-list)

{
  "status": "OK",
  "treasureHunts": \[
    {
      "uuid": "ag9nfmNvZGVjeXBydXNvcmdyGQsSDFRyZWFzdXJlSHVudBiAgICgpJWCCQw",
      "name": "An expired treasure hunt",
      "description": "A treasure hunt explicitly set to have ended, for demo purposes.",
      "ownerEmail": "nearchos@gmail.com",
      "visibility": "PUBLIC",
      "startsOn": 1534654800000,
      "endsOn": 1534741200000,
      "maxDuration": 0,
      "shuffled": false,
      "requiresAuthentication": false,
      "emailResults": false,
      "hasPrize": false
    },
    {
      "uuid": "ag9nfmNvZGVjeXBydXNvcmdyGQsSDFRyZWFzdXJlSHVudBiAgICAvKGCCgw",
      "name": "Sample treasure hunt",
      "description": "A treasure hunt with sample questions for testing.",
      "ownerEmail": "nearchos@gmail.com",
      "visibility": "PUBLIC",
      "startsOn": 1534741200000,
      "endsOn": 2166498000000,
      "maxDuration": 300000,
      "shuffled": true,
      "requiresAuthentication": false,
      "emailResults": false,
      "hasPrize": false
    }
  \]
}

### /th/api/start

To join a treasure hunt, the player must use the `start` call and specify their name, app id and requested treasure hunt id.

The API call is as follows:

`https://codecyprus.org/th/api/start?player=Homer&app=simpsons-app&treasure-hunt-id=ag9nfmNv...AvKGCCgw` [Try it](https://codecyprus.org/th/api/start?player=Homer&app=simpsons-app&treasure-hunt-id=ag9nfmNvZGVjeXBydXNvcmdyGQsSDFRyZWFzdXJlSHVudBiAgICAvKGCCgw) Copy

The call has these parameters:

*   `player` is a _mandatory_ parameter specifying the requested player name or nickname. This is required to be unique, so if the specified player is already in use, an appropriate error message is returned.
*   `app` is also a _mandatory_ parameter specifying the name of the app used to play the treasure hunt. This is a required parameter, so if it is not specified, an appropriate error message is returned.
*   `treasure-hunt-id` is a _mandatory_ parameter specifying the id of the treasure hunt to be launched. The id is normally picked from the result of the [list](#list) call. This is a required parameter and it must be a valid id, i.e. one that corresponds to an existing and available treasure hunt. If not, an appropriate error message is returned.

The output includes the `status` the total `numOfQuestions` and the `session` id which is required for subsequent calls, such as to get the current [question](#question).

[Show sample output](#collapse-call-start)

{
  "status": "OK",
  "session": "ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM",
  "numOfQuestions": 4
}

{
  "status": "ERROR",
  "errorMessages": \[
    "The specified playerName: Homer, is already in use (try a different one)."
  \]
}

{
  "status": "ERROR",
  "errorMessages": \[
    "Missing or empty parameter: app"
  \]
}

{
  "status": "ERROR",
  "errorMessages": \[
    "Could not find a treasure hunt for the specified id: ag9nfmNvZGVjeXBydXNvcmdyGQsSDFRyZWFzdXJlSHVudBiAgICAvKGCCg"
  \]
}

### /th/api/question

Once you join a treasure hunt you can start looking up questions. To view a question, you can use the `/th/api/question` call. This gives you information about the actual question (i.e. its text) as well as the expected answer type.

The API call is as follows:

`https://codecyprus.org/th/api/question?session=ag9nfmNv...oMa0gQoM` [Try it](https://codecyprus.org/th/api/question?session=ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM) Copy

The call has one parameter:

*   `session` is a _mandatory_ parameter specifying the id of the session which corresponds to this player.

The output includes the `status` and some properties of the `question`. For instance the `completed` property specifies if the user has already completed this treasure hunt (i.e. has answered all questions already). The `questionText` contains the text-based question, whcih can also be specified in simple HTML. The `questionType` specifies the expected type of the answer. The possible answer types are:

*   `BOOLEAN` can be either Boolean value true/false
*   `INTEGER` can be any valid integer like -1, 0, 1, 2, etc.
*   `NUMERIC` can be any valid numeric value like -1.2, 0.2, 1.234, etc.
*   `MCQ` can be any of four possible multiple-choice answers, i.e. A, B, C, D
*   `TEXT` can be any general text, normally a single word

The `canBeSkipped` is a Boolean that specifies whether this particular question can be skipped or must be answered. The `requires-location` indicates whether this is a location sensitive question where the player must be at a specific location for their answer to be checked. The `numOfQuestions` specifies the total number of questions in the treasure hunt, and the `currentQuestionIndex` defines the zero-based index of the current question (the first one is 0, and the last one is `numOfQuestions`\-1). Finally, the `correctScore`, `wrongScore` and `skipScore` specify the score adjustment for when the answer is correct, wrong, or the question was skipped, respectively.

[Show sample output](#collapse-call-question)

{
  "status": "OK",
  "completed": false,
  "questionText": "What is the answer to life?",
  "questionType": "INTEGER",
  "canBeSkipped": true,
  "requiresLocation": false,
  "numOfQuestions": 4,
  "currentQuestionIndex": 0,
  "correctScore": 10,
  "wrongScore": -3,
  "skipScore": -5
}

{
  "status": "ERROR",
  "errorMessages": \[
    "Missing or empty parameter: session"
  \]
}

{
  "status": "ERROR",
  "errorMessages": \[
    "Unknown session. The specified session ID could not be found."
  \]
}

### /th/api/answer

To answer the current question you can use the `/th/api/answer` call. This allows you to specify the `answer` for the given `session`.

The API call is as follows:

`https://codecyprus.org/th/api/answer?session=ag9nfmNv...oMa0gQoM&answer=42` [Try it](https://codecyprus.org/th/api/answer?session=ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM&answer=42) Copy

The call has two parameters:

*   `session` is a _mandatory_ parameter specifying the id of the session which corresponds to this player.
*   `answer` is a _mandatory_ parameter for specifying the tries answer. The answer is provided in text form but must match the question type as indicated in the reply of the [question](#question) call.

The output includes the `status` and some properties such as whether the provided answer was `correct`, whether the session is no `completed` (meaning there are no more unanswered questions), an optional text-based `message` and the `scoreAdjustment` as an integer that indicates how the score has changed (i.e. points gained or subtracted from the player's score).

[Show sample output](#collapse-call-answer)

{
  "status": "OK",
  "correct": true,
  "completed": false,
  "message": "Well done.",
  "scoreAdjustment": 10
}

{
  "status": "OK",
  "correct": false,
  "completed": false,
  "message": "Wrong answer: 41",
  "scoreAdjustment": -3
}

{
  "status": "ERROR",
  "errorMessages": \[
    "Finished session. The specified session has run out of time."
  \]
}

### /th/api/location

Some of the questions require that the player is at a specific location to be able to answer. The `/th/api/location` call allows you to specify the location in terms of `latitude` and `longitude` for the given `session`.

The `/th/api/location` call is used periodically to update the server of the player's current location, and also before answering a location-sensitive [question](#concepts) as indicated by the `requires-location` property of the [/question](#question) call. Normally, you can not call `/th/api/location` too often. Instead allow at least 30 seconds between calls.

The API call is as follows:

`https://codecyprus.org/th/api/location?session=ag9nfmNv...oMa0gQoM&latitude=34.683646&longitude=33.055391` [Try it](https://codecyprus.org/th/api/location?session=ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM&latitude=34.683646&longitude=33.055391) Copy

The call has three parameters:

*   `session` is a _mandatory_ parameter specifying the id of the session which corresponds to this player.
*   `latitude` is a _mandatory_ parameter for specifying the [latitude](https://en.wikipedia.org/wiki/Latitude) of the current location.
*   `longitude` is a _mandatory_ parameter for specifying the [longitude](https://en.wikipedia.org/wiki/Longitude) of the current location.

The output includes the `status` and a text-based `message` explaining whether the call was recorded or not.

[Show sample output](#collapse-call-location)

{
  "status": "OK",
  "message": "Added location (34.683646, 33.055391)"
}

{
  "status": "OK",
  "message": "Ignored update as the previous update was less than 30 seconds earlier."
}

{
  "status": "ERROR",
  "errorMessages": \[
    "Missing or empty parameter: session",
    "Missing or empty parameter: longitude",
    "Invalid non-numeric parameter: latitude",
    "Invalid non-numeric parameter: longitude"
  \]
}

### /th/api/skip

Some of the questions can be skipped, usually with a penalty to the score. The `/th/api/skip` call allows you to skip a [question](#question) if the player chooses to do so.

The API call is as follows:

`https://codecyprus.org/th/api/skip?session=ag9nfmNv...oMa0gQoM` [Try it](https://codecyprus.org/th/api/skip?session=ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM) Copy

The call has one parameter:

*   `session` is a _mandatory_ parameter specifying the id of the selected session.

The output includes the `status`, a Boolean indication of whether the treasure hunt is `completed` after skipping, a text-based `message` and the `scoreAdjustment` which is normally a negative integer, e.g. -5.

[Show sample output](#collapse-call-skip)

{
  "status": "OK",
  "completed": false,
  "message": "Skipped.",
  "scoreAdjustment": -5
}

{
  "status": "ERROR",
  "errorMessages": \[
    "Cannot skip. This questions is defined as one that cannot be skipped."
  \]
}

### /th/api/score

The `/th/api/score` call is used to access the current score of this [session](#concepts).

The API call is as follows:

`https://codecyprus.org/th/api/score?session=ag9nfmNv...oMa0gQoM` [Try it](https://codecyprus.org/th/api/score?session=ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM) Copy

The call has one parameter:

*   `session` is a _mandatory_ parameter specifying the id of the selected session.

The output includes the `status`, a Boolean indication of whether the treasure hunt is `completed`, i.e. there are no more unanswered questions, and whether the treasure hunt is `finished`, i.e. it has ended time-wise. The `player` property gives the selected player name, the `score` property gives the score as an integer, e.g. 23. Last, the `hasPrize` property shows whether there is a prize associated with the current treasure hunt (this is needed for some special applications).

[Show sample output](#collapse-call-score)

{
  "status": "OK",
  "completed": false,
  "finished": false,
  "player": "Homer",
  "score": 12
}

{
  "status": "ERROR",
  "errorMessages": \[
    "Unknown session. The specified session ID could not be found."
  \]
}

### /th/api/leaderboard

Naturally multiple players can be competing in a treasure hunt. To access the current leaderboard us the `/th/api/leaderboard` call and specify either the current player `session` or the selected `treasure-hunt-id`. Optionally, also use the `sorted` flag to indicate that you want the list of scores to be sorted from higher to smaller score. You can also specify the optional `limit` parameter to _limit_ the number of entries that appear in the leaderboard.

The API call is as follows:

`https://codecyprus.org/th/api/leaderboard?session=ag9nfmNv...oMa0gQoM&sorted&limit=10` [Try it](https://codecyprus.org/th/api/leaderboard?session=ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM&sorted&limit=10) Copy

The call has four possible parameters. You can only use one of `session` and `treasure-hunt-id`. If you specify both, the latter is ignored. The other parameters are as follows:

*   `session` is an _mandatory_ parameter specifying the id of the session which corresponds to this player. Not to be used at the same time with `treasure-hunt-id` described next.
*   `treasure-hunt-id` is a _mandatory_ parameter for specifying the selected treasure hunt. Not to be used at the same time with `session` described previously.
*   `sorted` is an _optional_ parameter for specifying that the score list is to be sorted from higher to lower scores.
*   `limit` is also an _optional_ parameter for limiting the number of entries that appear in the leaderboard. This parameter is _ignored_ if you do not also specify the `sorted` flag. Also it is ignored if not a valid integer value not less than the _minimum limit of 5_. When specified, it returns the `limit` top entries in the sorted leaderboard.

The output includes the `status`, the `numOfPlayers`, a Boolean value indicating whether the list is `sorted`, the applied `limit` and the `leaderboard`. When not specified or when invalid, the `limit` is automatically set to the max integer value, i.e. 2147483647. Finally, the nae of the corresponding [Treasure Hunt](#concepts) is provided for convenience as the named value `treasureHuntName`.

The leaderboard consists of a JSON array containing `numOfPlayers` entries, where each entry has a `player` name, a `score` and a `completionTime`. The latter is a timestamp of when the player answered the last question, expressed in [Unix epoch in milliseconds](https://en.wikipedia.org/wiki/Unix_time). If the player has not finished yet, it is set to zero.

Players with higher `score` are ranked higher irrespective of `completionTime`. When players have the same `score` then the player with the earliest `completionTime` is ranked higher (as the player answered the last question first). Players with a `completionTime` of zero (i.e. unfinished) are ranked lower to other players with the same `score`.

[Show sample output](#collapse-call-leaderboard)

{
  "status": "OK",
  "numOfPlayers": 5,
  "sorted": false,
  "limit": 10,
  "hasPrize": false,
  "leaderboard": \[
    {
      "player": "Lisa",
      "score": 40,
      "completionTime": 1534834032000
    },
    {
      "player": "Marge",
      "score": 7,
      "completionTime": 1534834037000
    },
    {
      "player": "Apu",
      "score": 7,
      "completionTime": 1534834087000
    },
    {
      "player": "Bart",
      "score": 7,
      "completionTime": 0
    },
    {
      "player": "Homer",
      "score": 0,
      "completionTime": 0
    }
  \],
  "treasureHuntName": "Sample treasure hunt"
}

{
  "status": "OK",
  "numOfPlayers": 5,
  "sorted": false,
  "limit": 10,
  "hasPrize": false,
  "leaderboard": \[
    {
      "player": "Marge",
      "score": 7,
      "completionTime": 1534834037000
    },
    {
      "player": "Bart",
      "score": 7,
      "completionTime": 0
    },
    {
      "player": "Lisa",
      "score": 40,
      "completionTime": 1534834032000
    },
    {
      "player": "Homer",
      "score": 0,
      "completionTime": 0
    },
    {
      "player": "Apu",
      "score": 7,
      "completionTime": 1534834087000
    }
  \],
  "treasureHuntName": "Sample treasure hunt"
}

{ "status": "ERROR", "errorMessages": \[ "Unknown session. The specified session ID could not be found." \] }