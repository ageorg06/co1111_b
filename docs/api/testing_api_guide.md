Treasure Hunt Testing API Guide

Treasure Hunt: Testing API Guide

A Code Cyprus project

This is version 1.0.0 of the Treasure Hunt testing API Guide. It is available online at http://www.codecyprus.org/th/testing.

There is also the main Treasure Hunt API Guide, available at http://www.codecyprus.org/th/guide.

Introduction

This service provides facilities for testing apps designed to use the Treasure Hunt API. For more information about the API's scope and goals please see the API Guide introduction. Like the actual API, this testing backend is developed for and deployed on Google's app-engine.

This testing API aims to complement the actual one by providing the means to test clients developed to use the various calls. For example, the /th/api/list call is normally used to get the list of available treasure hunts. On the contrary, the /th/test-api/list call allows to request a list with a specified number of treasure hunts, thus allowing to develop Unit Tests that check the underlying communication code, as well as Tests that verify the correct response of the UI that lists the treasure hunts. Finally, the testing API allows for explicitly requesting error messages that would be hard to simulate otherwise.

Calls

The essence of the Treasure Hunt API is the various function calls available to the clients. This section describes the Testing API calls, which allow similar interactions with the actual API, but in a controlled environment.

In principle, the testing calls use the same conventions as the actual calls, but instead of the /th/api/<call>, they take the form /th/test-api/<call>.

/th/test-api/list

Simulates the /th/api/list call. Also see the actual API's call in the guide.

The API call is as follows:

https://codecyprus.org/th/test-api/list?number-of-ths=2 Try it Copy

The call has this parameter:

number-of-ths is an optional parameter specifying the number of treasure hunts to be returned. If omitted, or an invalid integer or a negative, then the default value of 10 is returned.
/th/test-api/start

Simulates the /th/api/start call. Also see the actual API's call in the guide. In this call, the player must use the start call and either not specify anything (in which case a valid message with random values is returned) or specify an error by setting the player parameter, as discussed below.

The API call is as follows:

https://codecyprus.org/th/test-api/start?player=inactive Try it Copy

The call has one optional parameter:

player specifies the type of error message to be returned. The available options are:
INACTIVE: produces the error message 'The specified treasure hunt is not active right now.'
EMPTY: produces the error message 'The specified treasure hunt is empty (i.e. contains no questions).'
PLAYER: produces the error message 'The specified playerName: Homer, is already in use (try a different one).'
APP: produces the error message 'Missing or empty parameter: app'
UNKNOWN: produces the error message 'Could not find a treasure hunt for the specified id: 123'
MISSING_PARAMETER: produces the error message 'Multiple error messages of the form 'Missing or empty parameter: ...''
If you skip the parameter, then a default correct message is returned, containing random data.
/th/test-api/question

Simulates the /th/api/question call. Also see the actual API's call in the guide. In this call, the player requests the next question. The returned type can be configured using a number of parameters.

The API call is as follows:

https://codecyprus.org/th/test-api/question?completed&question-type=MCQ&can-be-skipped&requires-location Try it Copy

The call has four optional parameters:

completed is a boolean parameter specifying whether the corresponding treasure hunt has already been completed. This value can be specified simply by its presence, i.e. no value must be set, or using the standard key/value pair where the value is set to true. By default this is set to false (if not present).
question-type is used to specify the requested type for the question, i.e. whether it should be BOOLEAN, MCQ, INTEGER, NUMERIC or TEXT. You can optionally specify the special value RANDOM which picks a type in random. By default (i.e. when you do not specify a value for this) the question type is set to RANDOM.
can-be-skipped is a boolean parameter specifying whether the corresponding question can be skipped or not. This value can be specified simply by its presence, i.e. no value must be set, or using the standard key/value pair where the value is set to true. By default this is set to false (if not present).
requires-location is a boolean parameter specifying whether the corresponding question is location sensitive. This value can be specified simply by its presence, i.e. no value must be set, or using the standard key/value pair where the value is set to true. By default this is set to false (if not present).
/th/test-api/answer

Simulates the /th/api/answer call. Also see the actual API's call in the guide. In this call, the player requests the next question. The returned status (e.g. correct or not) can be configured using parameters.

The API call is as follows:

https://codecyprus.org/th/test-api/answer?correct&completed=false Try it Copy

The call has three parameters:

correct is a boolean parameter specifying whether the answer should be treated as correct or wrong. This value can be specified simply by its presence, i.e. no value must be set, or using the standard key/value pair where the value is set to true. By default this is set to false (if not present).
completed is a boolean parameter specifying whether the corresponding session has already been completed or not. This value can be specified simply by its presence, i.e. no value must be set, or using the standard key/value pair where the value is set to true. By default this is set to false (if not present).
expired is a boolean parameter specifying whether the corresponding session has expired (i.e. run out of time). When set, the reply is an error message (setting the correct and/or the completed parameters is ignored when the expired parameter is set.
/th/test-api/score

Simulates the /th/api/score call. Also see the actual API's call in the guide. In this call, the player requests the score of the player, which can be configured using a parameter.

The API call is as follows:

https://codecyprus.org/th/test-api/score?score=42 Try it Copy

The call has two parameters:

score is used to specify the numerical value to be returned. If skipped or invalid, then a default value of 42 is returned. If less than the minimum value -1000 then it is set to that minimum value. Similarly, if more than the maximum value 1000 then it is set to that maximum value.
completed is an optional parameter which when specified indicates that the treasure hunt is completed (i.e. all questions have been answered). This value can be specified simply by its presence, i.e. no value must be set, or using the standard key/value pair where the value is set to true. By default this is set to false (if not present).
finished is an optional parameter which when specified indicates that the treasure hunt has finished. This value can be specified simply by its presence, i.e. no value must be set, or using the standard key/value pair where the value is set to true. By default this is set to false (if not present).
error is an optional parameter which when specified returns an error message instead (i.e. 'Invalid session id'), ignoring the score value if specified. This value can be specified simply by its presence, i.e. no value must be set, or using the standard key/value pair where the value is set to true. By default this is set to false (if not present).
/th/test-api/leaderboard

Simulates the /th/api/leaderboard call. Also see the actual API's call in the guide. In this call, the player requests the leaderboard containing all the players and their scores. The number of players to be returned, as well as whether the list is sorted, can be configured using parameters.

The API call is as follows:

https://codecyprus.org/th/test-api/leaderboard?sorted&hasPrize&size=42 Try it Copy

The call has three parameters:

size specifies the number of entries in the leaderboard. If not provided, or if an invalid or negative value is provided, the default value of 42 is used.
sorted is an optional parameter for specifying that the score list is to be sorted from higher to lower scores. This value can be specified simply by its presence, i.e. no value must be set, or using the standard key/value pair where the value is set to true. By default this is set to false (if not present).
hasPrize is another optional parameter for specifying whether the corresponding treasure hunt has a prize. This value can be specified simply by its presence, i.e. no value must be set, or using the standard key/value pair where the value is set to true. By default this is set to false (if not present).
Code Cyprus — Treasure Hunt API Guide © 2025