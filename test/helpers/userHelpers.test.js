/**
 * Author: Andoni ALONSO TORT
 */

/** Server */
require( '../../src/index' );
console.log( 'Test userHelpers => Node env :', process.env.NODE_ENV );

/** Services / Helpers / Classes */
const UserHelpers = require( '../../src/api/helpers/UserHelpers' );
const CustomError = require( '../../src/api/classes/customError' );

/** Libraries */
const { describe, it } = require( 'mocha' );
const chai = require( 'chai' );
const chaiHttp = require( 'chai-http' );

const expect = chai.expect;
chai.should();
chai.use( chaiHttp );

/**
 * == TESTS ==
 */
describe( '/UserHelpers tests', () => {
    describe( 'Verify password rules', () => {
        const verifyNotValidPasswordRules = passwords => {
            for( const pwd of passwords ) {
                let verify = UserHelpers.verifyPasswordRules( pwd );
                verify.should.not.be.ok;
            
                let err = UserHelpers.getUpdateValueErrors.password( pwd );
                err.should.be.an( 'object' );
                err.should.haveOwnProperty( 'password' );
                err.password.should.haveOwnProperty( 'message' );
                err.password.message.should.to.be.equal( UserHelpers.passwordRulesMessage );
            }
        };

        it( 'Correct Password', () => {
            const pwd = 'User1234?';
            let verify = UserHelpers.verifyPasswordRules( pwd );

            verify.should.be.ok;

            let err = UserHelpers.getUpdateValueErrors.password( pwd );
            Object.keys( err ).should.deep.equal( [] );
        } );

        it( 'Without Uppercase', () => {
            const pwds = [ 'user1234?' ];
            verifyNotValidPasswordRules( pwds );
        } );

        it( 'Without Lowercase', () => {
            const pwds = [ 'USER1234?' ];
            verifyNotValidPasswordRules( pwds );
        } );

        it( 'Without Number', () => {
            const pwds = [ 'UserAdmin?' ];
            verifyNotValidPasswordRules( pwds );
        } );

        it( 'Without Special Character', () => {
            const pwds = [ 'User12345' ];
            verifyNotValidPasswordRules( pwds );
        } );

        it( 'Too short', () => {
            const pwds = [ 'Us1?' ];
            verifyNotValidPasswordRules( pwds );
        } );
    } ); 
    
    describe( 'Verify username rules', () => {
        const verifyNotValidUsernameRules = usernames => {
            for( const username of usernames ) {
                const verify = UserHelpers.verifyUsernameRules( username );
                verify.should.not.be.ok;
                
                let err = UserHelpers.getUpdateValueErrors.username( username );
                err.should.be.an( 'object' );
                err.should.haveOwnProperty( 'username' );
                err.username.should.haveOwnProperty( 'message' );
                err.username.message.should.to.be.equal( UserHelpers.usernameRulesMessage );
            }
        };

        it( 'Correct', () => {
            const username = 'TestExample1';
            const verify = UserHelpers.verifyUsernameRules( username );
            verify.should.be.ok;

            let err = UserHelpers.getUpdateValueErrors.username( username );
            Object.keys( err ).should.deep.equal( [] );
        } );

        it( 'Empty', () => {        
            const usernames = [ undefined, '' ];
            verifyNotValidUsernameRules( usernames );
        } );

        it( 'To short', () => {
            const usernames = [ 'U', 'Us' ];
            verifyNotValidUsernameRules( usernames );
        } );

        it( 'With special characters', () => {
            const usernames = [
                'User?', 'User/', 'Us(', 'Us)', 
                'Us=', 'Us*', 'Us.', ',Us',
                'U$s', 'U#s', 'U"s', 'Us!',
                'Us{', 'Us}', 'Us[', 'Us]',
                'Usª', 'Us;', 'Us:', 'Us+',
                'Us-', 'Us\\'
            ];
            verifyNotValidUsernameRules( usernames );
        } );
    } );

    describe( 'Detect User Found', () => {
        it( 'User found', () => {
            ( () => {
                UserHelpers.detectUserFound( { username: 'User' } );
            } ).should.be.ok;
        } );

        it( 'Error => User Empty', () => {
            ( () => {
                UserHelpers.detectUserFound();
            } ).should.throw( CustomError );

            try {
                UserHelpers.detectUserFound();
            } catch( e ) {
                e.should.have.status( 404 );
            }
        } );
    } );

    describe( 'Verify Admin role', () => {
        it( 'Array with admin role', () => {
            const roles = [ 1000 ];
            const verify = UserHelpers.hasAdminRole( roles );
            verify.should.be.ok;
        } );

        it( 'Array without admin role', () => {
            const roles = [ 2000, 3000, 40000 ];
            const verify = UserHelpers.hasAdminRole( roles );
            verify.should.not.be.ok;
        } );

        it( 'Array without admin role', () => {
            UserHelpers.hasAdminRole().should.not.be.ok;
            UserHelpers.hasAdminRole( [] ).should.not.be.ok;
            UserHelpers.hasAdminRole( [ 2000, 3000 ] ).should.not.be.ok;
        } );
    } );
} );