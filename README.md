# InfiniNote

[InfiniNote](https://infininote.herokuapp.com/ "Live site hosted on Heroku") is a minimalist note taking application inspired by [EverNote](https://evernote.com/, "EverNote").

This project is hosted on Heroku and the live site with demo is accessible via the hyperlink above.

It's features include user accounts with secure password hashing, note writing & editing with autosave, markdown support with editor, notebooks to categorize your notes, as well as sitewide theming.

# Technologies Used
- Node.js
- React
- Redux
- Express
- PostgreSQL
- Sequelize
-  BCrypt

# Screenshots
 ![Application](https://github.com/cra88y/infininote/blob/main/info/application.png)

# Setup Instructions To Run

1. Clone this repo
2.  In the root directory of the cloned repo, run `npm install` to install dependencies.
3. Create a PostgreSQL database and user for the app
4. Rename backend/.env.EXAMPLE to ".env", and fill out the values using the PostgreSQL information
5. Create the database with the command `npx dotenv sequelize db:create`
6. Run migrations with the command `npx dotenv sequelize db:migrations`
8. Run the Express backend server with the command `npm start` in the /backend directory
9. In a new terminal, run `npm start` in the /front-end directory
