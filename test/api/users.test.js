/**
 * Author: Andoni ALONSO TORT
 */

/** Server */
const server = require( '../../src/index' );
console.log( 'Node env :', process.env.NODE_ENV );

/** Services / Helpers / Classes */
const CustomError = require( '../../src/api/classes/customError' );

/** Models */
const { User } = require( '../../src/api/models/User' );

/** Initial Config Test */
const { restartConfig, closeConfig } = require( '../configTest' );

/** Libraries */
const { describe, it, before, after } = require( 'mocha' );
const chai = require( 'chai' );
const expect = chai.expect;
chai.should();
const chaiHttp = require( 'chai-http' );
chai.use( chaiHttp );

/**
 * Initial data in database
 */
let mongoUsers = [
    new User( {
        username: 'User1',
        firstname: 'admin',
        lastname: 'ADMIN',
        password: 'Admin?123',
        email: 'admin@exemple.com',
        roles: [ 1000, 2000 ]
    } ),
    new User( {
        username: 'User2',
        firstname: 'User 2',
        lastname: 'Example',
        password: 'Admin?123',
        email: 'user2@example.com'
    } )
];

/**
 * == TESTS ==
 */

describe( '/Users routes test', () => {
    before( done => {
        restartConfig( mongoUsers ).then( done ).catch( done );
    } );

    describe( 'Create User', () => {
        const postUser = user => {
            return new Promise( ( resolve, reject ) => {
                chai.request( server )
                    .post( '/api/users/' )
                    .set( 'Content-Type', 'application/json' )
                    .send( user )
                    .end( ( err, res ) => {
                        if( err ) return reject( err );
                        if( res.error ) return reject( res.error );
                        res.should.have.status( 201 );
                        resolve( res._body );
                    } );
            } );
        };

        it( 'Correct', done => {
            const usr = {
                username: 'User1',
                firstname: 'User',
                lastname: 'Test',
                email: 'user1@test.com',
                password: 'User123?',
                confirmPassword: 'User123?'
            };
            postUser( usr )
                .then( userCreated => {
                    userCreated.should.be.an( 'object' );
                    userCreated.should.have.property( '_id' );

                    userCreated.username.should.be.eq( usr.username );
                    userCreated.email.should.be.eq( usr.email );
                    done();
                } )
                .catch( done );
        } );

        describe( 'Error', () => {
            const test400Error = user => {
                return new Promise( ( resolve, reject ) => {
                    postUser( user )
                        .catch( error => {
                            error.should.be.instanceOf( Error );
                            error.should.have.status( 400 );
                            const errorObj = JSON.parse( error.text );
                            reject( new CustomError( JSON.stringify( errorObj.message ), 400 ) );
                        } );
                } );
            };

            it( 'Data missing => Confirm password', done => {
                const usr = { username: 'test1' };
                test400Error( usr )
                    .catch( error => {
                        let message = JSON.parse( error.message );
                        message
                            ?.confirmPassword?.message
                            .should.be.eq( 'There must be a confirmPassword attribute' );
                        done();
                    } )
                    .catch( done );
            } );

            it( 'Data missing => password', done => {
                const usr = {
                    confirmPassword: 'User123?',
                    username: 'test1'
                };

                test400Error( usr )
                    .catch( error => {
                        let message = JSON.parse( error.message );
                        message.should.have.property( 'confirmPassword' );
                        message.confirmPassword?.message
                            .should.be.eq( 'The passwords don\'t match' );

                        done();
                    } )
                    .catch( done );
            } );

            it( 'Data missing => firstname / lastname', done => { 
                const usr = {
                    password: 'User123?',
                    confirmPassword: 'User123?',
                    username: 'test1'
                };

                test400Error( usr )
                    .catch( error => {
                        let message = JSON.parse( error.message );
                        message.should.have.property( 'email' );
                        message.should.have.property( 'firstname' );
                        message.should.have.property( 'lastname' );
                        
                        message.email.message.should.match( /required/ );
                        message.firstname.message.should.match( /required/ );
                        message.lastname.message.should.match( /required/ );
                        done();
                    } )
                    .catch( done );
            } );

            it( 'Different Passwords', done => {
                const usr = {
                    password: 'User1234?',
                    confirmPassword: 'User123?',
                    username: 'test1'
                };
                test400Error( usr )
                    .catch( error => {
                        const message = JSON.parse( error.message );
                        message.should.have.property( 'confirmPassword' );
                        message.confirmPassword.message.should.match( /The passwords don't match/ );
                        done();
                    } )
                    .catch( done );
            } );

            it.only( 'Passwords weak', done => {
                const usr = {
                    username: 'testPwdWeak',
                    email: 'testPwdWeak@test.com',
                    firstname: 'test',
                    lastname: 'PwdWeak',
                    password: 'user',
                    confirmPassword: 'user',
                };
                test400Error( usr )
                    .catch( error => {
                        const message = JSON.parse( error.message );
                        message.should.have.property( 'password' );
                        message.password.message.should.match( /The password must have/ );
                        done();
                    } )
                    .catch( done );
            } );

            it( 'Repeated User', done => {
                const usr = {
                    ...mongoUsers[ 0 ].toObject(),
                    password: 'Admin?123',
                    confirmPassword: 'Admin?123'
                };

                test400Error( usr )
                    .catch( error => {
                        const message = JSON.parse( error.message );
                        message.should.have.property( 'username' );
                        message.should.have.property( 'email' );

                        message.username.message.should.match( /already exists/ );
                        message.email.message.should.match( /already exists/ );
                        done();
                    } )
                    .catch( done );
            } );
        } );
    } );

    after( async () => {
        console.log( '== Test finished ==' );
        await closeConfig();
    } );
} );