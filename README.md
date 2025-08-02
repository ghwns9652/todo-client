# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\nOpen [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\nYou may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\nSee the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\nIt correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\nYour app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## API Endpoints

This web application interacts with a backend API server at `https://localhost:8080`. The following endpoints are used:

### Authentication

-   **`POST https://localhost:8080/api/auth/verify`**
    -   Verifies an authentication token received after OAuth login.
    -   **Request Body:** `{ "token": "your_auth_token" }`
    -   **Response:** `{ "success": true }` or `{ "success": false, "message": "Error details" }`

-   **`GET https://localhost:8080/auth/google`**
    -   Initiates Google OAuth login flow.

-   **`GET https://localhost:8080/auth/github`**
    -   Initiates GitHub OAuth login flow.

### Todo Management

-   **`GET https://localhost:8080/api/todos?date={YYYY-MM-DD}`**
    -   Retrieves all todos for a specific date.
    -   **Query Parameter:** `date` (e.g., `2025-08-02`)
    -   **Response:** An array of todo objects.

-   **`POST https://localhost:8080/api/todos`**
    -   Adds a new todo item.
    -   **Request Body:** `{ "date": "YYYY-MM-DD", "text": "Todo description", "completed": false }`
    -   **Response:** The newly created todo object.

-   **`PUT https://localhost:8080/api/todos/{id}`**
    -   Updates an existing todo item.
    -   **Path Parameter:** `id` (ID of the todo to update)
    -   **Request Body:** `{ "date": "YYYY-MM-DD", "text": "Updated description", "completed": true }` (all fields are optional for update)
    -   **Response:** The updated todo object.

-   **`DELETE https://localhost:8080/api/todos/{id}`**
    -   Deletes a todo item.
    -   **Path Parameter:** `id` (ID of the todo to delete)
    -   **Response:** Success status (e.g., `{ "message": "Todo deleted successfully" }`)
