'use strict';

// ensure it works with frozen one
Object.freeze( Object.prototype );

const isNode = ( typeof window === "undefined" );
const hidereq = require;
const { IPSet, Address4, Address6 } = isNode ? hidereq( '../index' ) : window.FutoIn.ipset;
const expect = isNode ? hidereq( 'chai' ).expect : window.chai.expect;

describe( 'IPSet', function() {
    it ( 'should convert IPv4', function() {
        const ips = new IPSet();
        expect( ips.convertAddress( '1.2.3.4/23' ) ).to.be.instanceof( Address4 );
    } );

    it ( 'should convert IPv6', function() {
        const ips = new IPSet();
        expect( ips.convertAddress( '0203:123:0000::1/30' ) ).to.be.instanceof( Address6 );
    } );

    it ( 'should add IPv4', function() {
        const ips = new IPSet();
        ips.add( '1.2.3.4/23', 'OK' );

        expect( ips._v4._pm.size ).to.equal( 1 );
        expect( ips._v6._pm.size ).to.equal( 0 );

        expect( ips._v4._pm.get( 23 ) ).to.be.ok;
        expect( ips._v4._pm.get( 23 ).get( '1.2.2.0' ) ).to.equal( 'OK' );
    } );

    it ( 'should add IPv6', function() {
        const ips = new IPSet();
        ips.add( '0203:123:0000::1/30', 'OK' );

        expect( ips._v4._pm.size ).to.equal( 0 );
        expect( ips._v6._pm.size ).to.equal( 1 );

        expect( ips._v6._pm.get( 30 ) ).to.be.ok;
        expect( ips._v6._pm.get( 30 ).get( '203:120::' ) ).to.equal( 'OK' );
    } );

    it ( 'should remove IPv4', function() {
        const ips = new IPSet();
        ips.add( '1.2.3.4/23', 'OK' );

        expect( ips._v4._pm.size ).to.equal( 1 );
        expect( ips._v6._pm.size ).to.equal( 0 );

        ips.remove( '1.2.3.4/23' );

        expect( ips._v4._pm.size ).to.equal( 0 );
        expect( ips._v6._pm.size ).to.equal( 0 );
    } );

    it ( 'should remove IPv6', function() {
        const ips = new IPSet();
        ips.add( '0203:123:0000::1/30', 'OK' );

        expect( ips._v4._pm.size ).to.equal( 0 );
        expect( ips._v6._pm.size ).to.equal( 1 );

        ips.remove( '0203:123:0000::1/30' );

        expect( ips._v4._pm.size ).to.equal( 0 );
        expect( ips._v6._pm.size ).to.equal( 0 );
    } );

    it ( 'should succeed on removal of unknown', function() {
        const ips = new IPSet();
        ips.add( '0203:123:0000::1/30', 'OK' );

        expect( ips._v4._pm.size ).to.equal( 0 );
        expect( ips._v6._pm.size ).to.equal( 1 );

        ips.remove( '0203:113:0000::1/30' );
        ips.remove( '0203:123:0000::1/29' );
        ips.remove( '0203:123:0000::1/31' );

        expect( ips._v4._pm.size ).to.equal( 0 );
        expect( ips._v6._pm.size ).to.equal( 1 );
    } );

    it ( 'should properly match', function() {
        const ips = new IPSet();

        ips.add( '1.2.3.4/16', 'fail' );
        ips.add( '1.2.3.4/23', 'V4' );
        ips.add( '1.2.1.4/23', 'fail' );
        ips.add( '1.2.3.4/32', 'fail' );
        ips.add( '0203:123:0000::1/16', 'fail' );
        ips.add( '0203:123:0000::1/30', 'V6' );
        ips.add( '0203:119:0000::1/30', 'fail' );
        ips.add( '0203:123:0000::1/128', 'fail' );

        expect( ips.match( '1.2.3.3' ) ).to.equal( 'V4' );
        expect( ips.match( '2.2.3.3' ) ).to.be.undefined;

        expect( ips.match( '0203:123:0000::2' ) ).to.equal( 'V6' );
        expect( ips.match( '03::' ) ).to.be.undefined;

        expect( ips.match( ips.convertAddress( '1.2.3.3' ) ) ).to.equal( 'V4' );
        expect( ips.match( ips.convertAddress( '0203:123:0000::2' ) ) ).to.equal( 'V6' );
    } );
} );
