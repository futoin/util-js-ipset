'use strict';

/**
 * @file
 *
 * Copyright 2017 FutoIn Project (https://futoin.org)
 * Copyright 2017 Andrey Galkin <andrey@futoin.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const IPSet4 = require( './IPSet4' );
const IPSet6 = require( './IPSet6' );

const IPV4INV6_PREFIX = 96;

/**
 * Universal IPv4/IPv6 wrapper
 */
class IPSet {
    constructor() {
        this._v4 = new IPSet4();
        this._v6 = new IPSet6();
    }


    /**
     * Add address to IP set
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     * @param {any} value - any value to associate
     */
    add( addr, value ) {
        const addr_obj = this.convertAddress( addr, true );

        if ( addr_obj.v4 ) {
            this._v4.add( addr_obj, value );
        } else {
            this._v6.add( addr_obj, value );
        }
    }

    /**
     * Remove address from IP set
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     */
    remove( addr ) {
        const addr_obj = this.convertAddress( addr, true );

        if ( addr_obj.v4 ) {
            this._v4.remove( addr_obj );
        } else {
            this._v6.remove( addr_obj );
        }
    }

    /**
     * Try to match addr against ipset producing associated value
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     * @return {any} value - any associated value or undefined
     */
    match( addr ) {
        const addr_obj = this.convertAddress( addr, true );

        if ( addr_obj.v4 ) {
            return this._v4.match( addr_obj );
        } else {
            return this._v6.match( addr_obj );
        }
    }

    /**
     * Convert raw string or object to implementation instance
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     * @param {boolean} ipv6to4 - control if IPv4-in-IPv6 should be converted to plain IPv4
     * @return {object} instance of address implementation
     */
    convertAddress( addr, ipv6to4=false ) {
        try {
            return this._v4.convertAddress( addr );
        } catch ( _ ) {
            const res = this._v6.convertAddress( addr );
            const groups = res.parsedAddress;

            if ( ipv6to4 &&
                 ( res.subnetMask >= IPV4INV6_PREFIX ) &&
                 !parseInt( groups[0], 16 ) &&
                 !parseInt( groups[1], 16 ) &&
                 !parseInt( groups[2], 16 ) &&
                 !parseInt( groups[3], 16 ) &&
                 !parseInt( groups[4], 16 ) &&
                 ( parseInt( groups[5], 16 ) === 0xFFFF )
            ) {
                return this._v4.convertAddress( this._6to4( res ) );
            }

            return res;
        }
    }

    _4to6( v4_addr ) {
        const mask = v4_addr.subnetMask + IPV4INV6_PREFIX;
        return `::ffff:${v4_addr.toGroup6()}/${mask}`;
    }

    _6to4( v6_addr ) {
        const base = v6_addr.to4().correctForm();
        const mask = v6_addr.subnetMask - IPV4INV6_PREFIX;
        const safe_mask = mask < 0 ? 0 : mask;
        return `${base}/${safe_mask}`;
    }
}

module.exports = IPSet;
