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
- <i>bcrypt :</i> To hash and compare paswords.
- <i>jsonwebtoken :</i> To generate and compare token between server & client.
- <i>cookie-parser :</i> Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
- <i>mongoose :</i> Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. 
- <i>[mocha](https://mochajs.org) :</i> Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases.
- <i>[chai](https://www.chaijs.com) :</i> Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.
[See documentation](https://shouldjs.github.io/)
- <i>[chai-http](https://www.chaijs.com/plugins/chai-http/) :</i> Chai HTTP provides an interface for live integration testing via superagent. To do this, you must first construct a request to an application or url.

Upon construction you are provided a chainable api that allows you to specify the http VERB request (get, post, etc) that you wish to invoke.


To generate our ACCESS_TOKEN_SECRET :
> node
> require('crypto').randomBytes(64).toString('hex')

copy this string to the ACCESS_TOKEN_SECRET key in your .env
Do it again and put the value in REFRESH_TOKEN_SECRET key


<h6>== TEST DETAILS ==</h6>
To charge init data in database for development please run:

> node src/api/services/tests/users_data_test.js

#### Execute tests
- Test Helpers
  - > npm run testHelpers
- Test Services
  - > npm run testServices
- Test Apis
  - > npm run testApis

<h6>== USER MODEL ==</h6>
<table>
  <thead>
    <tr>
      <th>Attribute</th>
      <th>Rules & Info</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>username</td>
        <td>
          <ul>
            <li>Type: String</li>
            <li>Required</li>
            <li>Unique</li>
            <li>Without Special Characters</li>
            <li>Min length: 3</li>
            <li>User id to login</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>email</td>
        <td>
          <ul>
            <li>Type: email</li>
            <li>Required</li>
            <li>Unique</li>
            <li>Min length: 10</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>firstname</td>
        <td>
          <ul>
            <li>Type: String</li>
            <li>Required</li>
            <li>Min length: 3</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>lastname</td>
        <td>
          <ul>
            <li>Type: String</li>
            <li>Required</li>
            <li>Min length: 3</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>password</td>
        <td>
          <ul>
            <li>Type: String</li>
            <li>Required</li>
            <li>Min length: 8</li>
            <li>At least one special character (e.g., @$!%*?&()#^/).</li>
            <li>At least one uppercase letter.</li>
            <li>At least one lowercase letter.</li>
            <li>At least one number.</li>
            <li>Hashed with bcrypt</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>createdAt</td>
        <td>
          <ul>
            <li>Type: Date</li>
            <li>Generated by default when creating an object</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>updatedAt</td>
        <td>
          <ul>
            <li>Type: Date</li>
            <li>Generated by default when creating an object and updated when updating an object</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>roles</td>
        <td>
          <ul>
            <li>Type: [Number]</li>
            <li>User role by default: [2000]</li>
            <li>Can only contain User and Admin roles [1000, 2000]</li>
            <li>Roles can only be assigned by another admin, you cannot create an user with an admin role</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>refreshToken</td>
        <td>
          <ul>
            <li>Type: [String]</li>
            <li>Default: []</li>
            <li>An user can contain several refreshTokens for different connections</li>
            <li>This attribute is stocked in cookies and allow the user to refresh his accesToken when it has been expired.</li>
          </ul>
        </td>
      </tr>
      

  </tbody>
</table>


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

<h6>== ROUTES ==</h6>

> /api/auth/
  - >/login [POST]
    Allow the user to login in the application, this API returns the a valid acces token for the user with 10m duration and store another token (refresh token) in cookies if first token expires. Also the refresh token is also stored en database.

  - >/token [GET]
    Allow the user to get a new access token if his token is already expired. This API uses the token stored in cookies in order to valid the connected user and return a new valid token.

  - >/logout [GET]
    Disconnect user from the application and clean cookies and remove the refresh token from the database.

> /api/users/
  - >/ [GET]
  Returns all the users in the application. However the information is filtered depending of the user connected role.

  - >/ [POST]
  Creates a new user, this API can only be called when we are not connected. It allow an user to create an account in the application.

  - >/:id [GET]
  Get an user by an id. This id can be the _id in database, or the username or email of user. The information is filtered depending of the user connected role.

  - >/:id [PUT]
  This API allows the user to modify his own information. Or if it's an admin, a user information.
  A user can only modify : username, lastname, email and password.
  An admin can also modify the roles.

  - >/:id [DELETE]
  This API allows the user delete his account. Or if it's an admin, a user account.
  The admin cannot be deleted if he is the last admin in the application.

<hr/>
<h5>Author: <i>Andoni ALONSO TORT</i><h5>