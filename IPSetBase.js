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

/**
 * Universal based for IPv4 and IPv6 ipsets
 */
class IPSetBase {
    /**
     * C-tor
     * @param {class} address_impl - Address4 or Address6 class reference
     */
    constructor( address_impl ) {
        this._adr = address_impl;

        // Prefix Map
        this._pm = new Map();

        // Sorted Prefix Length List
        this._spll = [];
    }

    /**
     * Add address to IP set
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     * @param {any} value - any value to associate
     */
    add( addr, value ) {
        addr = this.convertAddress( addr );

        const prefix_len = addr.subnetMask;
        const prefix = addr.startAddress().correctForm();

        const global_prefix_map = this._pm;
        let prefix_map = global_prefix_map.get( prefix_len );

        if ( !prefix_map ) {
            prefix_map = new Map();
            global_prefix_map.set( prefix_len, prefix_map );
            this._updateSPLL();
        }

        prefix_map.set( prefix, value );
    }

    /**
     * Remove address from IP set
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     */
    remove( addr ) {
        addr = this.convertAddress( addr );

        const prefix_len = addr.subnetMask;
        const prefix = addr.startAddress().correctForm();

        const global_prefix_map = this._pm;
        const prefix_map = global_prefix_map.get( prefix_len );

        if ( prefix_map ) {
            prefix_map.delete( prefix );

            if ( !prefix_map.size ) {
                global_prefix_map.delete( prefix_len );
                this._updateSPLL();
            }
        }
    }

    /**
     * Try to match addr against ipset producing associated value
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     * @return {any} value - any associated value or undefined
     */
    match( addr ) {
        addr = this.convertAddress( addr );

        const global_prefix_map = this._pm;

        for ( let prefix_len of this._spll ) {
            const prefix_mix = `${addr.correctForm()}/${prefix_len}`;
            const prefix = this.convertAddress( prefix_mix )
                .startAddress()
                .correctForm();

            // NOTE: prefix len & prefix map assumed to be in sync
            const value = global_prefix_map.get( prefix_len ).get( prefix );

            if ( value ) {
                return value;
            }
        }

        return undefined;
    }

    /**
     * Convert raw string or object to implementation instance
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     * @return {object} instance of address implementation
     */
    convertAddress( addr ) {
        const impl = this._adr;
        let res = addr;

        if ( !( res instanceof impl ) ) {
            res = new impl( addr );
        }

        if ( ! res.valid ) {
            throw new Error( `Invalid address "${addr}"` );
        }

        return res;
    }

    _updateSPLL() {
        // arithmetically sort in revere order
        this._spll = Array.from( this._pm.keys() ).sort( ( a, b ) => b - a );
    }
}

module.exports = IPSetBase;
