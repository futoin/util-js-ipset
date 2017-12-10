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
        try {
            this._v4.add( addr, value );
        } catch ( _ ) {
            this._v6.add( addr, value );
        }
    }

    /**
     * Remove address from IP set
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     */
    remove( addr ) {
        try {
            this._v4.remove( addr );
        } catch ( _ ) {
            this._v6.remove( addr );
        }
    }

    /**
     * Try to match addr against ipset producing associated value
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     * @return {any} value - any associated value or undefined
     */
    match( addr ) {
        try {
            return this._v4.match( addr );
        } catch ( _ ) {
            return this._v6.match( addr );
        }
    }

    /**
     * Convert raw string or object to implementation instance
     * @param {string|object} addr - instance implementing *ip-address* interface or string representation
     * @return {object} instance of address implementation
     */
    convertAddress( addr ) {
        try {
            return this._v4.convertAddress( addr );
        } catch ( _ ) {
            return this._v6.convertAddress( addr );
        }
    }
}

module.exports = IPSet;
