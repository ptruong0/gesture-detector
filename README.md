--Readme document for *Philip Truong*, *pctruong@uci.edu*, *62272379*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

15/15
- 5/5 Created a functional web app
- 2/2 The ability to control the web app with basic gestures
- 4/4 The ability to control the web app with at least two custom gestures
- 2/2 Following good principles of UI design
- 1/1 Creating a compelling app and application of gestures
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?

10


3. What online resources did you consult when completing this assignment? (list specific URLs)

https://victordibia.com/handtrack.js/#/docs
https://medium.com/@yshashi30/how-to-use-toast-messages-ng-angular-popup-in-angular-project-70d4160400de
https://stackoverflow.com/questions/22707475/how-to-make-a-promise-from-settimeout


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

N/A


5. Is there anything special we need to know in order to run your code?

- ```npm i --force``` may be needed for installation
- Pointing two fingers for Scissors may sometimes not be accurate; pointing one finger has better accuracy.
- It may be better to watch the video demo here (includes timestamps): https://www.loom.com/share/6abe721421b74409ac611460340fc8a9


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

No, the app is intended for anyone since it is a game that any user can play.


7. Describe the two custom gestures you created.
- One open hand, One closed hand: controls setting to allow/disable the opponent from playing doubles (rationale: user has unfair advantage represented by uneven hands)
- Horizontal swipe: resets both players' scores (rationale: erasing motion)
- Other basic gestures: closed (rock), open (paper), point (scissors), two closed / two open / two point (double rock/paper/scissors), pinch (toggle autoplay)


8. How does your app implement or follow principles of good UI design?

The UI displays the detected moves of both the player and opponent, and automatically plays another round when there is a tie or an error detecting a gesture. The app has instructions explaining the hand gesture controls, some settings to allow user configuration, and also toast popups to confirm when the score is reset.
