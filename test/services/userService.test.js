/**
 * Author: Andoni ALONSO TORT
 */

/** Server */
require( '../../src/index' );
console.log( 'Test userService => Node env :', process.env.NODE_ENV );

/** Services / Helpers / Classes */
const UserService = require( '../../src/api/services/UserService' );
const AuthHelpers = require( '../../src/api/helpers/AuthHelpers' );
const CustomError = require( '../../src/api/classes/customError' );

/** Initial Config Test */
const { restartConfig, closeConfig } = require( '../configTest' );

/** Models */
const { User } = require( '../../src/api/models/User' );

/** Libraries */
const { before, after, describe, it, beforeEach } = require( 'mocha' );
const chai = require( 'chai' );
const expect = chai.expect;
chai.should();

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
 * A collection of special characters accepted in
 * data validation
 */
const specialCharacters = [
    '?', '/', '(', ')', 
    '=', '*', '.', ',',
    '$', '#', '"', '!',
    '{', '}', '[', ']',
    'ª', ';', ':', '+',
    '-', '\\'
];

/** A collection of invalid passwords */
const passwordsError = [ 
    'u', 'USER', 'user4', '1288469', 'PasswOrd0',
    'user4Passowrd', 'USER??', 'us#ser', 'US/?Adm',
    'UserAdmin13-', 'User/*?', 'User__123' 
];

/** A collection of correct passwords */
const  passwordsCorrect = [
    'Us@ser485', 'U$er2536', '!UserAdmin14', 
    'us%EdAdmin85', 'Us*erAdmin85', 'User123?',
    'usER&149', 'usER(149', 'uSeR)852',
    'usERAdmin#4', 'usAd^min85', 'userAdmin/85'
];

/**
 * == TESTS ==
 */

describe( '/UserService tests', () => {
    before( done => {
        restartConfig( mongoUsers ).then( done ).catch( done );
    } );
    
    const verifyProjectionProps = async ( users, projection ) => {
        const propsNotRequired = { ...User.schema.paths };
        delete propsNotRequired._id;

        // Delete properties
        for( const prop of Object.keys( projection ) ) {
            delete propsNotRequired[ prop ];
        }

        try {
            for( const user of users ) {
                expect( user ).to.not.be.undefined;
                expect( user ).to.be.an( 'object' );

                for( const prop of Object.keys( projection ) ) {
                    user.toObject().should.to.haveOwnProperty( prop );
                }

                for( const prop of Object.keys( propsNotRequired ) ) {
                    user.toObject().should.to.not.haveOwnProperty( prop );
                }
            };
        } catch( err ) {
            console.log( 'Error!', err );
            throw err ;
        }
    };

    describe( 'Get All', () => {

        it( 'Default => without password and token', done => {
            const verifyUsersProperties = users => {
                users = users.map( u => u.toObject() );
                for( const user of users ) {
                    const userFound = ( mongoUsers.find( u => u.username === user.username ) ).toObject();
                    delete userFound.password;
                    delete userFound.refreshToken;
    
                    user.should.deep.equal( userFound );
                    user.should.to.not.have.property( 'password' );
                    user.should.to.not.have.property( 'refreshToken' );
                }
            };
    
            UserService.getAll()
                .then( us => {
                    us.should.to.be.an( 'array' );
                    us.length.should.to.be.equal( 2 );
                    verifyUsersProperties( us );
                    done();
                } )
                .catch( err => {
                    console.log( 'Error!', err );
                    done( err );
                } );
        } );

        describe( 'Projection', () => {    
            const testProjection = async projection => {
                const users = await UserService.getAll( projection );
                await verifyProjectionProps( users, projection );
            };

            it( 'Project username / firstname / lastname', async () => {
                const projection = { username: 1, firstname: 1, lastname: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project email', async () => {
                const projection = { email: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project createdAt / updatedAt', async () => {
                const projection = { createdAt: 1, updatedAt: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project roles', async () => {
                const projection = { roles: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project password / refreshToken', async () => {
                const projection = { password: 1, refreshToken: 1 };
                await testProjection( projection );
            } );
        } );
    } );

    describe( 'Get User by id / username / email', () => {
        it( 'Not found', async() => {
            const user = await UserService.getUser( 'User20' );
            expect( user ).to.be.undefined;
        } );

        it( 'By username', async () => {
            const user = mongoUsers[ 0 ];
            const us = await UserService.getUser( user.username );
            us.should.be.an( 'object' );
            us.toObject().should.be.deep.equal( user.toObject() );
            us.username.should.be.equal( user.username );
        } );

        it( 'By email', async () => {
            const user = mongoUsers[ 0 ];
            const us = await UserService.getUser( user.email );
            us.should.be.an( 'object' );
            us.toObject().should.be.deep.equal( user.toObject() );
            us.email.should.be.equal( user.email );
        } );

        it( 'By id', async () => {
            const user = mongoUsers[ 0 ];
            // Get by id
            const us = await UserService.getUser( user._id );
            us.should.be.an( 'object' );
            us.toObject().should.be.deep.equal( user.toObject() );
            us._id.toString().should.be.equal( user._id.toString() );
        } );

        describe( 'Projection', () => {    
            const userEmail = mongoUsers[ 0 ].email;
    
            const testProjection = async projection => {
                const user = await UserService.getUser( userEmail, projection );
                await verifyProjectionProps( [ user ], projection );
            };
    
            it( 'Project username / firstname / lastname', async () => {
                const projection = { username: 1, firstname: 1, lastname: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project email', async () => {
                const projection = { email: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project createdAt / updatedAt', async () => {
                const projection = { createdAt: 1, updatedAt: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project roles', async () => {
                const projection = { roles: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project password / refreshToken', async () => {
                const projection = { password: 1, refreshToken: 1 };
                await testProjection( projection );
            } );
        } );

    } );
    
    describe( 'Get User By RefreshToken', () => {
        before( done => {
            const us = mongoUsers[ 0 ];
            const token = AuthHelpers.generateRefreshToken( us );
            us.refreshToken = token;
            us.save()
                .then( () => done() )
                .catch( done );
        } );

        it( 'Not found', async() => {
            const userInToken = { username: 'us20', email: 'us20@gmail.com'};
            const token = AuthHelpers.generateRefreshToken( userInToken );
            const user = await UserService.getUserByRefreshToken( token );
            expect( user ).to.be.undefined;
        } );

        it( 'Get user', async() => {
            const userInToken = mongoUsers[ 0 ];
            const user = await UserService.getUserByRefreshToken( userInToken.refreshToken );
            expect( user ).to.not.be.undefined;
            user.should.be.an( 'object' );
            user.toObject().should.be.deep.equal( userInToken.toObject() );
        } );

        describe( 'Projection', () => {    
            const userId = mongoUsers[ 0 ].refreshToken;
    
            const testProjection = async projection => {
                const user = await UserService.getUserByRefreshToken( userId, projection );
                await verifyProjectionProps( [ user ], projection );
            };
    
            it( 'Project username / firstname / lastname', async () => {
                const projection = { username: 1, firstname: 1, lastname: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project email', async () => {
                const projection = { email: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project createdAt / updatedAt', async () => {
                const projection = { createdAt: 1, updatedAt: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project roles', async () => {
                const projection = { roles: 1 };
                await testProjection( projection );
            } );
    
            it( 'Project password / refreshToken', async () => {
                const projection = { password: 1, refreshToken: 1 };
                await testProjection( projection );
            } );
        } );
    } );

    describe( 'Create User', () => {
        //mongoose.set( 'debug', true );

        let user3 = {
            username: 'User3',
            firstname: 'admin',
            lastname: 'ADMIN',
            password: 'Admin?123',
            email: 'user3@exemple.com',
            roles: [ 1000, 2000 ]
        };

        it( 'Correct', async () => {
            const pwd = user3.password;
            const newUser = new User( { ...user3 } );

            const user = await UserService.createUser( newUser );
            user.should.to.be.an( 'object' );

            const userFound = await UserService.getUser( user.username );
            expect( userFound ).to.not.be.undefined;
            userFound.should.to.be.an( 'object' );
            userFound.toObject().should.be.deep.equal( user.toObject() );
            userFound.toObject().password.should.not.be.equal( pwd );
        } );

        it( 'Correct => Test passwords', async () => {
            let testPassword = async ( pwd, idx ) => {
                const userCreate = {
                    ...user3,
                    username: `userPasswords${idx}`,
                    email: `userPwd${idx}@test.com`,
                    password: pwd
                };

                const newUser = new User( userCreate );
    
                const user = await UserService.createUser( newUser );
                user.should.to.be.an( 'object' );
    
                const userFound = await UserService.getUser( user.username );
                expect( userFound ).to.not.be.undefined;
                userFound.should.to.be.an( 'object' );
                userFound.toObject().should.be.deep.equal( user.toObject() );
                ( await AuthHelpers.comparePasswords( pwd, userFound.toObject().password ) ).should.be.ok;
            };
            
            //console.log( 'Test passwords!', passwordsCorrect );

            for( const idx of passwordsCorrect.keys() ) {
                const pwd = passwordsCorrect[ idx ];
                //console.log( idx + '.- Create: ' + pwd );
                await testPassword( pwd, idx );
                //console.log( 'Passed!' );
            }
            await User.deleteMany( { firstname: 'userPasswords' } ); // Clean
        } );

        describe( 'Errors', () => {
            // General test for create error
            const testCreate = async ( newUser, attributes ) => {
                try {
                    //console.log( 'Create', newUser );
                    return await UserService.createUser( newUser );
                } catch( e ) {
                    e.should.to.haveOwnProperty( 'message' );
                    e.should.to.be.instanceOf( CustomError );
                    
                    const message = JSON.parse( e.message );

                    for( const attr of attributes ) {
                        message.should.to.haveOwnProperty( attr );
                    }

                    throw e;
                }
            };

            const testRequired = async ( attributes ) => {
                const newUser = new User( {
                    ...user3
                } );
                
                for( const attr of attributes ) {
                    newUser.email = ( attr != 'email' ) ? 'User4@test.com' : undefined;
                    newUser.email = ( attr != 'username' ) ? 'User4' : undefined;
                    newUser[ attr ] = undefined;
                }
                
                try {
                    await testCreate( newUser, attributes );
                } catch( e ) {
                    const message = JSON.parse( e.message );

                    for( const attr of attributes ) {
                        message[ attr ].message.should.match( /is required/ );
                    }
                }
            };

            const testRepeated = async () => {
                try {
                    await testCreate( new User( { ...user3 } ), [ 'email', 'username' ] );
                } catch( e ) {
                    const message = JSON.parse( e.message );

                    message.email.message.should.match( /already exists/ );
                    message.username.message.should.match( /already exists/ );
                }
            };

            const testTooShort = async ( newUser, attributes ) => {
                try {
                    await testCreate( newUser, attributes );
                } catch( e ) {
                    const message = JSON.parse( e.message );
                    for( const attr of attributes ) {
                        message[ attr ].message.should.match( /shorter than/ );
                    }
                }
            };

            it( 'Repeated', async () => await testRepeated() );

            it( 'Required email / username', async () => await testRequired( [ 'email', 'username' ] )  );
            it( 'Required firstname / lastname / password', async () => await testRequired( [ 'firstname', 'lastname', 'password' ] )  );


            it( 'Too short email / username / firstname / lastname', async () => {
                await testTooShort( new User( { 
                    ...user3, 
                    username: 'U4',
                    email : 'em@em.com',
                    firstname: 'U4',
                    lastname: 'L4'
                } ), [ 'email', 'username', 'firstname', 'lastname' ] );
            } );

            it( 'Email => Not valid form', async () => {
                try {
                    await testCreate( new User( { 
                        ...user3, 
                        username: 'User4',
                        email : 'user4testemail'
                    } ), [ 'email' ] );
                } catch( e ) {
                    const message = JSON.parse( e.message );
                    message.email.message.should.match( /should be a valid address/ );
                }
            } );

            it( 'Username => Not valid form', async() => {
                for( const char of specialCharacters ) {
                    try {
                        await testCreate( new User( { 
                            ...user3, 
                            username: 'User4' + char,
                            email : 'User4@test.com'
                        } ), [ 'username' ] );
                    } catch( e ) {
                        //console.log( 'Error', e.message );
                        const message = JSON.parse( e.message );
                        message.username.message.should.match( /The username cannot contain special characters/ );
                    }
                }
            } );

            it( 'Password => Not valid form', async() => {
                for( const pwd of passwordsError ) {
                    try {
                        let res = await testCreate( new User( { 
                            ...user3, 
                            username: 'User4',
                            email: 'User4@test.com',
                            password: pwd
                        } ), [ 'password' ] );
                        res.should.not.be.ok;

                    } catch( e ) {
                        //console.log( 'Error', e.message );
                        const message = JSON.parse( e.message );
                        message.password.message.should.match( /The password must have/ );
                    }
                }
            } );

            it( 'Roles => Not valid include', async () => {
                try {
                    await testCreate( new User( { 
                        ...user3, 
                        username: 'User4',
                        email : 'user4@test.com',
                        roles: [ 3000 ]
                    } ), [ 'roles' ] );
                } catch( e ) {
                    const message = JSON.parse( e.message );
                    message.roles.message.should.match( /Roles must contain user rights/ );
                }
            } );
        } );
    } );

    describe( 'Update User', () => {
        let user;
        let _id = mongoUsers[ 0 ]._id;

        beforeEach( done => {
            UserService.getUser( _id )
                .then( us => {
                    user = us.toObject();
                    delete user.password;
                    delete user.__v;
                    //console.log( 'My user', user );
                    done();
                } )
                .catch( done );
        } );

        describe( 'Correct', () => {
            it( 'Doing nothing', async () => {
                const userModif = ( await UserService.updateUser( user._id, user ) ).toObject();
                delete userModif.__v;
                delete userModif.password;

                userModif.updatedAt.should.be.not.equal( user.updatedAt );
                
                delete user.updatedAt;
                delete userModif.updatedAt;
                userModif.should.be.deep.equal( user );
            } );

            it( 'Change data', async () => {
                user = {
                    ...user,
                    username: 'User5',
                    email: 'user5@test.com',
                    firstname: 'user5',
                    lastname: 'test',
                    roles: [ 2000 ],
                    refreshToken: [] // Cannot modify refreshToken, they should be different
                };

                const userModif = ( await UserService.updateUser( user._id, user ) ).toObject();
                delete userModif.password;
                delete userModif.__v;

                userModif.updatedAt.should.be.not.equal( user.updatedAt );
                userModif.refreshToken.should.be.not.equal( user.refreshToken );
                
                delete userModif.refreshToken;
                delete user.refreshToken;
                delete user.updatedAt;
                delete userModif.updatedAt;
                userModif.should.be.deep.equal( user );
            } );

            it( 'Correct => Cannot modify id / createdAt / updatedAt / refreshToken', async () => {
                const usrBody = {
                    _id: '123456789123456789',
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    refreshToken: [ 'k54adw4d5a4d54ds8se7f']
                };

                const userModif = ( await UserService.updateUser( user._id, usrBody ) ).toObject();
    
                userModif._id.toString().should.be.equal( user._id.toString() );
                userModif._id.toString().should.not.be.equal( usrBody._id.toString() );
    
                userModif.createdAt.toString().should.be.equal( user.createdAt.toString() );
                userModif.createdAt.toString().should.not.be.equal( usrBody.createdAt.toString() );

                userModif.updatedAt.should.not.be.equal( usrBody.updatedAt );

                userModif.refreshToken.should.contain( user.refreshToken[ 0 ] );
                userModif.refreshToken.should.not.contain( usrBody.refreshToken[ 0 ] );
            } );

            it( 'Correct => Test passwords', async () => {
                let testPassword = async pwd => {
                    const userUpdated = await UserService.updateUser( user._id, { password: pwd } );
                    userUpdated.should.to.be.an( 'object' );
                    userUpdated.toObject().password.should.not.be.equal( pwd );
                    ( await AuthHelpers.comparePasswords( pwd, userUpdated.toObject().password ) ).should.be.ok;
                };

                for( const pwd of passwordsCorrect ) {
                    await testPassword( pwd );
                }
            } );
        } );


        describe( 'Errors', () => {
            // General test for update error
            const testUpdate = async ( user, attributes ) => {
                try {
                //console.log( 'Create', newUser );
                    await UserService.updateUser( user._id, user );
                } catch( e ) {
                    e.should.to.haveOwnProperty( 'message' );
                    e.should.to.be.instanceOf( CustomError );
                
                    const message = JSON.parse( e.message );

                    for( const attr of attributes ) {
                        message.should.to.haveOwnProperty( attr );
                    }

                    throw e;
                }
            };

            const testRepeated = async () => {
                try {
                    await testUpdate( { 
                        _id: user._id,
                        username: mongoUsers[ 1 ].username,
                        email: mongoUsers[ 1 ].email
                    }, [ 'email', 'username' ] );
                } catch( e ) {
                    const message = JSON.parse( e.message );

                    message.email.message.should.match( /already exists/ );
                    message.username.message.should.match( /already exists/ );
                }
            };

            const testTooShort = async ( user, attributes ) => {
                try {
                    await testUpdate( user, attributes );
                } catch( e ) {
                    const message = JSON.parse( e.message );
                    for( const attr of attributes ) {
                        message[ attr ].message.should.match( /shorter than/ );
                    }
                }
            };

            it( 'Not found user', async () => {
                try {
                    await UserService.updateUser( '12345879', {} );
                } catch( e ) {
                    e.should.be.instanceOf( CustomError );
                    e.message.should.be.equal( 'User not found' );
                }
            } );

            it( 'Repeated', async () => await testRepeated() );

            it( 'Too short email / username / firstname / lastname', async () => {
                await testTooShort( { 
                    _id: user._id,
                    username: 'U4',
                    email : 'em@em.com',
                    firstname: 'U4',
                    lastname: 'L4',
                }, [ 'email', 'username', 'firstname', 'lastname' ] );
            } );

            it( 'Email => Not valid form', async () => {
                try {
                    const usr = { _id: user._id, email : 'user4testemail' };
                    await testUpdate( usr, [ 'email' ] );
                } catch( e ) {
                    const message = JSON.parse( e.message );
                    message.email.message.should.match( /should be a valid address/ );
                }
            } );

            it( 'Username => Not valid form', async () => {
                const usr = { _id: user._id };

                for( const char of specialCharacters ) {
                    try {
                        usr.username = 'User4' + char;
                        await testUpdate( usr, [ 'username' ] );
                    } catch( e ) {
                        //console.log( 'Error', e.message );
                        const message = JSON.parse( e.message );
                        message.username.message.should.match( /The username cannot contain special characters/ );
                    }
                }
            } );

            it( 'Roles => Not valid include', async () => {
                try {
                    const usr = { _id: user._id, roles: [ 3000 ] };
                    await testUpdate( usr, [ 'roles' ] );
                } catch( e ) {
                    const message = JSON.parse( e.message );
                    message.roles.message.should.match( /Roles must contain user rights/ );
                }
            } );

            it( 'Password => Not valid form', async() => {
                for( const pwd of passwordsError ) {
                    try {
                        let res = await testUpdate( { 
                            _id: user._id,
                            password: pwd
                        }, [ 'password' ] );
                        res.should.not.be.ok;

                    } catch( e ) {
                        //console.log( 'Error', e.message );
                        const message = JSON.parse( e.message );
                        message.password.message.should.match( /The password must have/ );
                    }
                }
            } );
        } );
    } );

    describe( 'Update Refresh Token', () => {
        let user;
        let _id = mongoUsers[ 0 ]._id;

        beforeEach( done => {
            UserService.getUser( _id )
                .then( us => {
                    user = us.toObject();
                    delete user.password;
                    delete user.__v;
                    //console.log( 'My user', user );
                    done();
                } )
                .catch( done );
        } );

        describe( 'Correct', () => {
            it( 'New refresh token', async() => {
                const newToken = AuthHelpers.generateRefreshToken( user );
                let userUpdated = await UserService.updateRefreshTokenUser( user._id, [ newToken ] );
                userUpdated.refreshToken[ 0 ].should.be.a( 'string' );
                userUpdated.refreshToken.should.contain( newToken );
            } );
        } );

        describe( 'Errors', () => {
            it( 'Not found user', async () => {
                try {
                    const newToken = AuthHelpers.generateAccesToken( user );
                    await UserService.updateRefreshTokenUser( '12345879', newToken );
                } catch( e ) {
                    e.should.be.instanceOf( CustomError );
                    e.message.should.be.equal( 'User not found' );
                }
            } );

            it( 'Invalid token', async() => {
                try {
                    let res = await UserService.updateRefreshTokenUser( user._id, 'kbdjbwko' );;
                    res.should.not.be.ok;
                } catch( e ) {
                    if ( e instanceof CustomError ) {
                        const message = JSON.parse( e.message );
                        message.should.have.property( 'refreshToken' );
                        message.refreshToken.message.should.be.equal( AuthHelpers.refreshTokenRulesMessage );
                    } else {
                        throw e;
                    }
                }
            } );
        } );
    } );

    describe( 'Delete User', () => {
        const userRef = {
            firstname: 'delete',
            lastname: 'DELETE',
            password: 'Delete?123',
            roles: [ 1000, 2000 ],
        };

        const users = [
            new User( {
                ...userRef,
                username: 'delete1',
                email: 'delete1@test.com',
                password: 'Admin?123',
            } ),
            new User( {
                ...userRef,
                username: 'delete2',
                email: 'delete2@test.com',
                password: 'Admin?123'
            } ),
            new User( {
                ...userRef,
                username: 'delete3',
                email: 'delete3@test.com',
                password: 'Admin?123'
            } )
        ];

        before( done => {
            ( async () => {
                for( const idx of users.keys() ) {
                    users[ idx ] = await UserService.createUser( users[ idx ] );
                }
            } )().then( done ).catch( done );
        } );

        describe( 'Correct', () => {
            it( 'Delete By Id', async () => {
                const user = users.pop();
                const userDeleted = await UserService.deleteUser( user._id );
                userDeleted.should.be.an( 'object' ).and.have.property( 'deletedCount' );
                userDeleted.deletedCount.should.be.eq( 1 );
            } );

            it( 'Delete By username', async () => {
                const user = users.pop();
                const userDeleted = await UserService.deleteUser( user.username );
                userDeleted.should.be.an( 'object' ).and.have.property( 'deletedCount' );
                userDeleted.deletedCount.should.be.eq( 1 );
            } );

            it( 'Delete By id', async () => {
                const user = users.pop();
                const userDeleted = await UserService.deleteUser( user._id );
                userDeleted.should.be.an( 'object' ).and.have.property( 'deletedCount' );
                userDeleted.deletedCount.should.be.eq( 1 );
            } );
        } );

        describe( 'Errors', () => {
            it( 'Not found user', async () => {
                try {
                    await UserService.deleteUser( 'usernotExists' );
                } catch( e ) {
                    e.should.be.instanceOf( CustomError );
                    e.message.should.be.equal( 'User not found' );
                }
            } );
        } );
    } );

    after( async () => {
        console.log( '== Test finished ==' );
        await closeConfig();
    } );
} );