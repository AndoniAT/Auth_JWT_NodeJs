<h1 class="text-center" style="background-color: rgb(226 232 240 / var(--tw-bg-opacity, 1));
 padding: 5px;"> Authentication JWT Login in NodeJs
 <br/>
 <img src="./src/nodejs.png" height="60px"/>
 </h1>
<h4>Author : Andoni ALONSO TORT</h4>
Implementing authentication and JWT in node js.

Node.js application designed as a foundation for any project requiring authentication and user role management on the server side. This project provides a robust and scalable structure with ready-to-use features.

- ✅ User authentication via JWT (JSON Web Tokens) for secure sessions.
- ✅ A role management system to define specific permissions and access.
- ✅ A RESTful architecture for creating, reading, updating, and deleting users and their roles.
- ✅ Error handling with clear responses for unauthorized or invalid actions.
- ✅ Integration with a database for secure storage of user information (password hashing with bcrypt).
- ✅ A modular and extensible structure to easily integrate new features.

This back-end is designed to work seamlessly with the [React front-end project](https://github.com/AndoniAT/Auth_Login_React), offering a complete and secure solution for any application requiring authentication and role management.

<b>Start Node.js project :</b>
> npm init

<b>Setting eslint config :</b>
> npm init @eslint/config

eslint.config.mjs has been generated 

See [eslint page](https://eslint.org/docs/latest/) for more information.

Install Eslint & Error Lens packages in VS Code to highlighting of errors in files.

<b>Nodemon package has been include for running dev environnment : </b>
> npm i --save-dev nodemon

<b>To run it, please use :</b>
> npm run devStart

Another packages installed : 
<ul>
    <li>
        <i>bcrypt :</i> To hash and compare paswords.
    </li>
    <li>
        <i>jsonwebtoken :</i> To generate and compare token between server & client.
    </li>
    <li>
        <i>cookie-parser :</i> Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
    </li>
    <li>
      <i>mongoose :</i> Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. 
    </li>
</ul>

To generate our ACCESS_TOKEN_SECRET :
> node
> require('crypto').randomBytes(64).toString('hex')

copy this string to the ACCESS_TOKEN_SECRET key in your .env
Do it again and put the value in REFRESH_TOKEN_SECRET key


<h6>== TEST DETAILS ==</h6>
To charge the database for testing please run:

> node src/api/services/tests/users_data_test.js

<h6>== USER ROLES ==</h6>

<table style="margin: 0 auto; width: fit-content; border: 1px solid black;">
  <tr style="background: gray;">
    <th style="border: 1px solid black;">Role</th>
    <th style="border: 1px solid black;">Code</th>
  </tr>
  <tr>
    <td style="border: 1px solid black">Admin</td>
    <td style="border: 1px solid black">1000</td>
  </tr>
  <tr>
    <td style="border: 1px solid black">User</td>
    <td style="border: 1px solid black">2000</td>
  </tr>
</table>

<hr/>
<h5>Author: <i>Andoni ALONSO TORT</i><h5>