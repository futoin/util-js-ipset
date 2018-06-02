
  [![NPM Version](https://img.shields.io/npm/v/futoin-ipset.svg?style=flat)](https://www.npmjs.com/package/futoin-ipset)
  [![NPM Downloads](https://img.shields.io/npm/dm/futoin-ipset.svg?style=flat)](https://www.npmjs.com/package/futoin-ipset)
  [![Build Status](https://travis-ci.org/futoin/util-js-ipset.svg)](https://travis-ci.org/futoin/util-js-ipset)
  [![stable](https://img.shields.io/badge/stability-stable-green.svg?style=flat)](https://www.npmjs.com/package/futoin-ipset)

  [![NPM](https://nodei.co/npm/futoin-ipset.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/futoin-ipset/)

# About

In absence of anything else up-to-date, pure JS and decent for efficient processing of large
IP set matching with associative value outcome.

Key features:
* IPv4 and IPv6 support on top of [ip-address](https://www.npmjs.com/package/ip-address) module.
* Efficient prefix matching relying on JS Map implementation performance.
* Dynamic ipset manipulation.
* Associate any value for classification of match
* Transparent IPv4-mapped IPv6 conversion to plain IPv4

**Documentation** --> [FutoIn Guide](https://futoin.org/docs/miscjs/ipset/)

Author: [Andrey Galkin](mailto:andrey@futoin.org)


# Installation for Node.js

Command line:
```sh
$ npm install futoin-ipset --save
```
or:

```sh
$ yarn add futoin-ipset --save
```

# Browser installation

The module can be used with `webpack` or any other CommonJS packer. However, please
ensure to use ES6->ES5 transpilation for older browsers.

Pre-packed UMD module is available in dist/futoin-ipset.js. However, Map polyfill is
required for older browsers.

There is no browser use case yet though.

# Examples

```javascript
const { IPSet, Address4, Address6 } = require( 'futoin-ipset' );

// universal IPv4/IPv6 set
const ipset = new IPSet();

const Region2 = {}; // any ref can be associated

// cheap operations
ipset.add( '1.2.2.0/23', 'Region 1' );
ipset.add( new Address4('2.3.4.0/24'), Region2 ); // instance of ip-address.Address4 can be also passed
ipset.add( 'abcd::/48', 'Region 1' );
ipset.add( new Address6('bcda::/56'), Region2 ); // ... or instance of ip-address.Address6
ipset.add( '2.3.4.5/32', 'blacklist' );
ipset.add( 'abcd:1234:5678:9abc::/64', 'blacklist' );

ipset.remove( 'bcda::/56' );

// matching
console.log(
    ipset.match( '1.2.3.4' ), // 'Region 1',
    ipset.match( '2.3.4.1' ), // Region2 ref
    ipset.match( new Address4('2.3.4.5') ), // 'blacklist'
    ipset.match( 'abcd:1234:5678:9abc::123' ), // 'blacklist'
    ipset.match( 'bcda::/56' ), // undefined
);

// just a handy helper
ipset.convertAddress('1.2.3.4') -> instance of Address4
ipset.convertAddress('1.2.3.4/23') -> instance of Address4
ipset.convertAddress('::1') -> instance of Address6
```

# Matching logic

Internally, ipset is a map of prefix lengths to map of network address to referenced value, like:

    IP version map of
        /23 -> map of
            1.2.2.0 -> ref
            1.1.0.0 -> ref
        /32 -> map of
            1.2.3.4 -> ref

Trivial and fast enough pure JS algo:

1. Determine IPv4 or IPv6 set to use
1. Go from longest to smallest *registered* prefix length
    - get net address with specified prefix length based on address in question
    - if known net then return associated value
1. Otherwise, return undefined

    
# API documentation

## Classes

<dl>
<dt><a href="#IPSet">IPSet</a></dt>
<dd><p>Universal IPv4/IPv6 wrapper</p>
</dd>
<dt><a href="#IPSet4">IPSet4</a></dt>
<dd><p>IPv4 specialization of IPSetBase</p>
</dd>
<dt><a href="#IPSet6">IPSet6</a></dt>
<dd><p>IPv6 specialization of IPSetBase</p>
</dd>
<dt><a href="#IPSetBase">IPSetBase</a></dt>
<dd><p>Universal based for IPv4 and IPv6 ipsets</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#$as">$as</a></dt>
<dd><p><strong>window.FutoIn.ipset</strong> - browser-only reference to futoin-ipset module</p>
</dd>
</dl>

<a name="IPSet"></a>

## IPSet
Universal IPv4/IPv6 wrapper

**Kind**: global class  

* [IPSet](#IPSet)
    * [.add(addr, value)](#IPSet+add)
    * [.remove(addr)](#IPSet+remove)
    * [.match(addr)](#IPSet+match) ⇒ <code>any</code>
    * [.convertAddress(addr, ipv6to4)](#IPSet+convertAddress) ⇒ <code>object</code>

<a name="IPSet+add"></a>

### ipSet.add(addr, value)
Add address to IP set

**Kind**: instance method of [<code>IPSet</code>](#IPSet)  

| Param | Type | Description |
| --- | --- | --- |
| addr | <code>string</code> \| <code>object</code> | instance implementing *ip-address* interface or string representation |
| value | <code>any</code> | any value to associate |

<a name="IPSet+remove"></a>

### ipSet.remove(addr)
Remove address from IP set

**Kind**: instance method of [<code>IPSet</code>](#IPSet)  

| Param | Type | Description |
| --- | --- | --- |
| addr | <code>string</code> \| <code>object</code> | instance implementing *ip-address* interface or string representation |

<a name="IPSet+match"></a>

### ipSet.match(addr) ⇒ <code>any</code>
Try to match addr against ipset producing associated value

**Kind**: instance method of [<code>IPSet</code>](#IPSet)  
**Returns**: <code>any</code> - value - any associated value or undefined  

| Param | Type | Description |
| --- | --- | --- |
| addr | <code>string</code> \| <code>object</code> | instance implementing *ip-address* interface or string representation |

<a name="IPSet+convertAddress"></a>

### ipSet.convertAddress(addr, ipv6to4) ⇒ <code>object</code>
Convert raw string or object to implementation instance

**Kind**: instance method of [<code>IPSet</code>](#IPSet)  
**Returns**: <code>object</code> - instance of address implementation  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| addr | <code>string</code> \| <code>object</code> |  | instance implementing *ip-address* interface or string representation |
| ipv6to4 | <code>boolean</code> | <code>false</code> | control if IPv4-in-IPv6 should be converted to plain IPv4 |

<a name="IPSet4"></a>

## IPSet4
IPv4 specialization of IPSetBase

**Kind**: global class  
<a name="IPSet6"></a>

## IPSet6
IPv6 specialization of IPSetBase

**Kind**: global class  
<a name="IPSetBase"></a>

## IPSetBase
Universal based for IPv4 and IPv6 ipsets

**Kind**: global class  

* [IPSetBase](#IPSetBase)
    * [new IPSetBase(address_impl)](#new_IPSetBase_new)
    * [.add(addr, value)](#IPSetBase+add) ⇒ <code>object</code>
    * [.remove(addr)](#IPSetBase+remove) ⇒ <code>object</code>
    * [.match(addr)](#IPSetBase+match) ⇒ <code>any</code>
    * [.convertAddress(addr)](#IPSetBase+convertAddress) ⇒ <code>object</code>

<a name="new_IPSetBase_new"></a>

### new IPSetBase(address_impl)
C-tor


| Param | Type | Description |
| --- | --- | --- |
| address_impl | <code>class</code> | Address4 or Address6 class reference |

<a name="IPSetBase+add"></a>

### ipSetBase.add(addr, value) ⇒ <code>object</code>
Add address to IP set

**Kind**: instance method of [<code>IPSetBase</code>](#IPSetBase)  
**Returns**: <code>object</code> - converted IP address  

| Param | Type | Description |
| --- | --- | --- |
| addr | <code>string</code> \| <code>object</code> | instance implementing *ip-address* interface or string representation |
| value | <code>any</code> | any value to associate |

<a name="IPSetBase+remove"></a>

### ipSetBase.remove(addr) ⇒ <code>object</code>
Remove address from IP set

**Kind**: instance method of [<code>IPSetBase</code>](#IPSetBase)  
**Returns**: <code>object</code> - converted IP address  

| Param | Type | Description |
| --- | --- | --- |
| addr | <code>string</code> \| <code>object</code> | instance implementing *ip-address* interface or string representation |

<a name="IPSetBase+match"></a>

### ipSetBase.match(addr) ⇒ <code>any</code>
Try to match addr against ipset producing associated value

**Kind**: instance method of [<code>IPSetBase</code>](#IPSetBase)  
**Returns**: <code>any</code> - value - any associated value or undefined  

| Param | Type | Description |
| --- | --- | --- |
| addr | <code>string</code> \| <code>object</code> | instance implementing *ip-address* interface or string representation |

<a name="IPSetBase+convertAddress"></a>

### ipSetBase.convertAddress(addr) ⇒ <code>object</code>
Convert raw string or object to implementation instance

**Kind**: instance method of [<code>IPSetBase</code>](#IPSetBase)  
**Returns**: <code>object</code> - instance of address implementation  

| Param | Type | Description |
| --- | --- | --- |
| addr | <code>string</code> \| <code>object</code> | instance implementing *ip-address* interface or string representation |

<a name="$as"></a>

## $as
**window.FutoIn.ipset** - browser-only reference to futoin-ipset module

**Kind**: global variable  


*documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)*.


