# Auth_JWT_NodeJs
Implementing authentication and JWT in node js.

Start Node.js project :
> npm init

Setting eslint config :
> npm init @eslint/config

eslint.config.mjs has been generated 

See [eslint page](https://eslint.org/docs/latest/) for more information.

Install Eslint & Error Lens packages in VS Code to highlighting of errors in files.

Nodemon package has been include for running dev environnment : 
> npm i --save-dev nodemon

To run it, please use :
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