/**
 * Author : Andoni ALONSO TORT
 */
require( '../../src/index' );
process.env.NODE_ENV = 'test';
console.log( 'Test authHelpers => Node env :', process.env.NODE_ENV );

const AuthHelpers = require( '../../src/api/helpers/AuthHelpers' );
const CustomError = require( '../../src/api/classes/customError' );

const bcrypt = require( 'bcrypt' );

const { describe, it } = require( 'mocha' );
const chai = require( 'chai' );
const expect = chai.expect;
const should = chai.should();

const chaiHttp = require( 'chai-http' );
chai.use( chaiHttp );

describe( '/AuthHelpers test', () => {
    describe( 'Passwords', () => {
        describe( 'Generate Hash Password', () => {
            it( 'Correct', async () => {
                // Compare
                const pwd = 'Admin?123';
                const hash = await AuthHelpers.generateHashPwd( pwd );
                const compare = await bcrypt.compare( pwd, hash );
        
                expect( compare ).to.be.true;
        
            } );
    
            it( 'Fails', async () => {
                // Compare
                const pwd = 'Admin?123';
                const pwdFails = 'Admin?1234';
                const hash = await AuthHelpers.generateHashPwd( pwd );
                const compare = await bcrypt.compare( pwdFails, hash );
        
                expect( compare ).to.be.false;
        
            } );
        } );
    
        describe( 'Compare Passwords', () => {
            it( 'Hash generated different to password strong', async () => {
                // Compare
                const pwd = 'Admin?123';
                const hash = await AuthHelpers.generateHashPwd( pwd );
        
                hash.should.not.be.equal( pwd );
        
            } );
    
            it( 'Correct => Different passwords', async function() {
                const pwd = 'Admin?123';
                const hash = await AuthHelpers.generateHashPwd( pwd );
                const compare = await AuthHelpers.comparePasswords( pwd, hash );
        
                expect( compare ).to.be.true;
            } );
    
            it( 'Fails => Different passwords', async () => {
                const pwd = 'Admin?123';
                const pwdFails = 'Admin?1234';
                const hash = await AuthHelpers.generateHashPwd( pwd );
                const compare = await AuthHelpers.comparePasswords( pwdFails, hash );
    
                expect( compare ).to.be.false;
            } );
        } );
    } );

    describe( 'Tokens', () => {
        let access_token;
        let refresh_token;
        const users = [ 
            {
                username: 'Test',
                email: 'test@test.com',
                roles: [ 1000, 2000 ]
            }
        ];

        describe( 'Generate', () => {
            describe( 'Missing Properties', () => {
                describe( 'Access Token', () => {
                    it( 'Error No Object', () => {
                        ( AuthHelpers.generateAccesToken ).should.throw( CustomError );
                    } );
    
                    it( 'Error missing properties [username / email / roles]', () => {
                        const err = ( () => {
                            AuthHelpers.generateAccesToken( {} );
                        } );
                        err.should.throw( CustomError );
                        err.should.throw( /Missing/ );
                    } );
    
                    it( 'Error missing properties [username]', () => {
                        const err = ( () => {
                            const usr = { ...users[ 0 ] };
                            delete usr.username;
                            AuthHelpers.generateAccesToken( usr );
                        } );
                        err.should.throw( CustomError );
                        err.should.throw( /Missing/ );
                    } );
    
                    it( 'Error missing properties [email]', () => {
                        const err = ( () => {
                            const usr = { ...users[ 0 ] };
                            delete usr.email;
                            AuthHelpers.generateAccesToken( usr );
                        } );
                        err.should.throw( CustomError );
                        err.should.throw( /Missing/ );
                    } );
    
                    it( 'Error missing properties [roles]', () => {
                        const err = ( () => {
                            const usr = { ...users[ 0 ] };
                            delete usr.roles;
                            AuthHelpers.generateAccesToken( usr );
                        } );
                        err.should.throw( CustomError );
                        err.should.throw( /Missing/ );
                    } );
                } );
    
                describe( 'Refresh Token', () => {
                    it( 'Error No Object', () => {
                        ( AuthHelpers.generateRefreshToken ).should.throw( CustomError );
                    } );
    
                    it( 'Error missing properties [username / email / roles]', () => {
                        const err = ( () => {
                            AuthHelpers.generateRefreshToken( {} );
                        } );
                        err.should.throw( CustomError );
                        err.should.throw( /Missing/ );
                    } );
    
                    it( 'Error missing properties [username]', () => {
                        const err = ( () => {
                            const usr = { ...users[ 0 ] };
                            delete usr.username;
                            AuthHelpers.generateRefreshToken( usr );
                        } );
                        err.should.throw( CustomError );
                        err.should.throw( /Missing/ );
                    } );
    
                    it( 'Error missing properties [email]', () => {
                        const err = ( () => {
                            const usr = { ...users[ 0 ] };
                            delete usr.email;
                            AuthHelpers.generateRefreshToken( usr );
                        } );
                        err.should.throw( CustomError );
                        err.should.throw( /Missing/ );
                    } );
                } );
            } );

            it( 'Access Token', done => {
                access_token = AuthHelpers.generateAccesToken( users[ 0 ] );
                expect( access_token ).to.be.a( 'string' ).that.is.not.empty;
                done();
            } );

            it( 'Refresh Token', done => {
                const us = { ...users[ 0 ] };
                delete us.roles;
                refresh_token = AuthHelpers.generateRefreshToken( us );
                expect( refresh_token ).to.be.a( 'string' ).that.is.not.empty;
                done();
            } );
        } );

        describe( 'Verify Token', () => {
            it( 'Acces Token', done => {
                AuthHelpers.verifyToken( access_token, ( err, decoded ) => {
                    expect( decoded ).to.have.property( 'user' );
                    expect( decoded.user ).to.deep.equal( users[ 0 ] );
                    done();
                } );
            } );

            it( 'Refresh Token', done => {
                const us = { ...users[ 0 ] };
                delete us.roles;

                AuthHelpers.verifyRefreshToken( refresh_token, ( err, decoded ) => {
                    expect( decoded ).to.have.property( 'user' );
                    expect( decoded.user ).to.deep.equal( us );
                    done();
                } );
            } );
        } );
    } );
} );