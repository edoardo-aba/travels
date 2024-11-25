Certainly! Here is the complete content for your \`.md\` file with all
the setup steps:

\# Experiment Assignment Project

This project is a full-stack web application designed to manage and
analyze experiments. It is composed of two main components:

\- \*\*Client (Frontend)\*\*: A React-based user interface. - \*\*Server
(Backend)\*\*: A Node.js and MongoDB-powered API.

Follow the instructions below to set up and run the project.

\-\--

\## Client Setup (Frontend)

1\. \*\*Create a \`.env\` File\*\* Inside the \`client\` folder, create
a \`.env\` file and include the following fields:

\`\`\`env REACT_APP_API_BASE_URL=http://localhost:5000 \#
REACT_APP_API_BASE_URL=https://ee-assignment-2.onrender.com \`\`\`

 - Use \`http://localhost:5000\` if you are running the backend server
locally.  - Use \`https://ee-assignment-2.onrender.com\` (or another
deployment URL) when the backend server is deployed online.

2\. \*\*Install Dependencies\*\* Open a terminal, navigate to the
\`client\` folder, and run:

\`\`\`bash npm install \`\`\`

3\. \*\*Run the Frontend\*\* Start the React development server by
running:

\`\`\`bash npm start \`\`\`

The frontend will be accessible at \`http://localhost:3000\`.

\-\--

\## Server Setup (Backend)

1\. \*\*Create a \`.env\` File\*\* Inside the \`server\` folder, create
a \`.env\` file and include the following fields:

\`\`\`env
MONGO_URI=mongodb+srv://\<username\>:\<password\>@experiment.imnwh.mongodb.net/register
PORT=5000 \`\`\`

 - Replace \`\<username\>\` and \`\<password\>\` with your MongoDB Atlas
credentials.

2\. \*\*MongoDB Setup\*\* No special setup is required for the database
itself.

 - Ensure the database named \`experiment\` exists in your MongoDB
instance.  - Inside the \`experiment\` database, create the following
collections:  - \`users\`  - \`answers\`

3\. \*\*Install Dependencies\*\* Open a terminal, navigate to the
\`server\` folder, and run:

\`\`\`bash npm install \`\`\`

4\. \*\*Run the Backend\*\* Start the backend server by running:

\`\`\`bash npm start \`\`\`

The backend server will run on \`http://localhost:5000\`.

\-\--

\## Running the Project

1\. \*\*Start the backend server\*\*:

\`\`\`bash cd server npm start \`\`\`

2\. \*\*Start the frontend client\*\*:

\`\`\`bash cd client npm start \`\`\`

3\. \*\*Open your browser and navigate to\*\* \`http://localhost:3000\`
\*\*to interact with the application\*\*.

\-\--

\## Notes

\- The \`.env\` files are crucial for proper configuration. Update them
to switch between local development and production environments. -
Ensure your MongoDB instance is live and properly configured before
running the backend server. - Keep your database credentials secure and
do not share them publicly.
