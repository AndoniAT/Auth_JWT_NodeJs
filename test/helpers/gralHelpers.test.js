/**
 * Author: Andoni ALONSO TORT
 */

/** Server */
require( '../../src/index' );
console.log( 'Test GralHelpers => Node env :', process.env.NODE_ENV );

/** Services / Helpers / Classes */
const GralHelpers = require( '../../src/api/helpers/GralHelpers' );
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

describe( '/GralHelpers tests', () => {
    describe( 'Detect Errors', () => {
        it( 'Empty object => No Error', () => {
            ( () => {
                GralHelpers.detectError( {} );
            }
            ).should.be.ok;
        } );

        it( 'Error message => Status 400', () => {
            const errObj = { message: 'Error 400' };
            const fun = ( () => {
                GralHelpers.detectError( errObj );
            }
            );
            fun.should.throw( CustomError );
            try {
                fun();
            } catch( e ) {
                e.message.should.contain( JSON.stringify( errObj ) );
                e.should.have.status( 400 );
            }
        } );

        it( 'Error message => Status 500', () => {
            const errObj = { message: 'Error' };
            const fun = ( () => {
                GralHelpers.detectError( errObj, 500 );
            }
            );
            fun.should.throw( CustomError );
            try {
                fun();
            } catch( e ) {
                e.message.should.contain( JSON.stringify( errObj ) );
                e.should.have.status( 500 );
            }
        } );
    } );
} );