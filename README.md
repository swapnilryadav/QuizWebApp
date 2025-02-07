Overview:
This is a full-stack quiz web application that allows users to take quizzes, track their scores, and view their performance. The application fetches quiz data from an external API and presents it to the users in an interactive format. It is built using React for the frontend and Express.js for the backend. The application is deployed using Render for the backend and Firebase for the frontend hosting.


link for QuizWebApplication: https://quiz-web-application-890f9.web.app
(Please refresh for some time to fetch the quiz from API ,it may take couple of minutes to load the page )


Frontend:
React.js: Used for building the interactive user interface.
Axios: For making API requests to fetch quiz data.
CSS: Styled components for a responsive and user-friendly interface.
React Hooks: Utilized useState and useEffect for state management and side effects.


Backend:
Node.js & Express.js: Used to create a RESTful API for fetching quiz data.
Axios: Used on the server to fetch quiz data from an external API.
CORS: Enabled to allow cross-origin requests.


Deployment:
Render: The backend server is hosted on Render to ensure high availability and reliability.
Firebase Hosting: The frontend is deployed using Firebase Hosting for fast and scalable static file serving.


Features
->Fetches quiz questions dynamically from an API.
->Users can start a quiz and navigate through questions.
->Timer feature to track elapsed time during the quiz.
->Users can select answers, and at the end of the quiz, the score is displayed.
->Provides feedback on correct and incorrect answers.
->Option to restart the quiz after completion.
->Validation ensures that all questions are answered before submission.


Backend :
Deployment (Render):The backend is hosted on Render.
To deploy, create a new service on Render, link your GitHub repository, and deploy the Express server.
Frontend Deployment :Firebase
