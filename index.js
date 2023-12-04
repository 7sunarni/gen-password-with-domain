 /*
  * JavaScript MD5
  * https://github.com/blueimp/JavaScript-MD5
  *
  * Copyright 2011, Sebastian Tschan
  * https://blueimp.net
  *
  * Licensed under the MIT license:
  * https://opensource.org/licenses/MIT
  *
  * Based on
  * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
  * Digest Algorithm, as defined in RFC 1321.
  * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
  * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
  * Distributed under the BSD License
  * See http://pajhome.org.uk/crypt/md5 for more info.
  */

 /* global define */

 /* eslint-disable strict */
 "use strict";

 /**
  * Add integers, wrapping at 2^32.
  * This uses 16-bit operations internally to work around bugs in interpreters.
  *
  * @param {number} x First integer
  * @param {number} y Second integer
  * @returns {number} Sum
  */
 function safeAdd(x, y) {
     var lsw = (x & 0xffff) + (y & 0xffff);
     var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
     return (msw << 16) | (lsw & 0xffff);
 }

 /**
  * Bitwise rotate a 32-bit number to the left.
  *
  * @param {number} num 32-bit number
  * @param {number} cnt Rotation count
  * @returns {number} Rotated number
  */
 function bitRotateLeft(num, cnt) {
     return (num << cnt) | (num >>> (32 - cnt));
 }

 /**
  * Basic operation the algorithm uses.
  *
  * @param {number} q q
  * @param {number} a a
  * @param {number} b b
  * @param {number} x x
  * @param {number} s s
  * @param {number} t t
  * @returns {number} Result
  */
 function md5cmn(q, a, b, x, s, t) {
     return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
 }
 /**
  * Basic operation the algorithm uses.
  *
  * @param {number} a a
  * @param {number} b b
  * @param {number} c c
  * @param {number} d d
  * @param {number} x x
  * @param {number} s s
  * @param {number} t t
  * @returns {number} Result
  */
 function md5ff(a, b, c, d, x, s, t) {
     return md5cmn((b & c) | (~b & d), a, b, x, s, t);
 }
 /**
  * Basic operation the algorithm uses.
  *
  * @param {number} a a
  * @param {number} b b
  * @param {number} c c
  * @param {number} d d
  * @param {number} x x
  * @param {number} s s
  * @param {number} t t
  * @returns {number} Result
  */
 function md5gg(a, b, c, d, x, s, t) {
     return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
 }
 /**
  * Basic operation the algorithm uses.
  *
  * @param {number} a a
  * @param {number} b b
  * @param {number} c c
  * @param {number} d d
  * @param {number} x x
  * @param {number} s s
  * @param {number} t t
  * @returns {number} Result
  */
 function md5hh(a, b, c, d, x, s, t) {
     return md5cmn(b ^ c ^ d, a, b, x, s, t);
 }
 /**
  * Basic operation the algorithm uses.
  *
  * @param {number} a a
  * @param {number} b b
  * @param {number} c c
  * @param {number} d d
  * @param {number} x x
  * @param {number} s s
  * @param {number} t t
  * @returns {number} Result
  */
 function md5ii(a, b, c, d, x, s, t) {
     return md5cmn(c ^ (b | ~d), a, b, x, s, t);
 }

 /**
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  *
  * @param {Array} x Array of little-endian words
  * @param {number} len Bit length
  * @returns {Array<number>} MD5 Array
  */
 function binlMD5(x, len) {
     /* append padding */
     x[len >> 5] |= 0x80 << len % 32;
     x[(((len + 64) >>> 9) << 4) + 14] = len;

     var i;
     var olda;
     var oldb;
     var oldc;
     var oldd;
     var a = 1732584193;
     var b = -271733879;
     var c = -1732584194;
     var d = 271733878;

     for (i = 0; i < x.length; i += 16) {
         olda = a;
         oldb = b;
         oldc = c;
         oldd = d;

         a = md5ff(a, b, c, d, x[i], 7, -680876936);
         d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
         c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
         b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
         a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
         d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
         c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
         b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
         a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
         d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
         c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
         b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
         a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
         d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
         c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
         b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

         a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
         d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
         c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
         b = md5gg(b, c, d, a, x[i], 20, -373897302);
         a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
         d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
         c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
         b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
         a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
         d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
         c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
         b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
         a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
         d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
         c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
         b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

         a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
         d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
         c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
         b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
         a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
         d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
         c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
         b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
         a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
         d = md5hh(d, a, b, c, x[i], 11, -358537222);
         c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
         b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
         a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
         d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
         c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
         b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

         a = md5ii(a, b, c, d, x[i], 6, -198630844);
         d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
         c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
         b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
         a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
         d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
         c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
         b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
         a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
         d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
         c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
         b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
         a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
         d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
         c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
         b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

         a = safeAdd(a, olda);
         b = safeAdd(b, oldb);
         c = safeAdd(c, oldc);
         d = safeAdd(d, oldd);
     }
     return [a, b, c, d];
 }

 /**
  * Convert an array of little-endian words to a string
  *
  * @param {Array<number>} input MD5 Array
  * @returns {string} MD5 string
  */
 function binl2rstr(input) {
     var i;
     var output = "";
     var length32 = input.length * 32;
     for (i = 0; i < length32; i += 8) {
         output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
     }
     return output;
 }

 /**
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  *
  * @param {string} input Raw input string
  * @returns {Array<number>} Array of little-endian words
  */
 function rstr2binl(input) {
     var i;
     var output = [];
     output[(input.length >> 2) - 1] = undefined;
     for (i = 0; i < output.length; i += 1) {
         output[i] = 0;
     }
     var length8 = input.length * 8;
     for (i = 0; i < length8; i += 8) {
         output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
     }
     return output;
 }

 /**
  * Calculate the MD5 of a raw string
  *
  * @param {string} s Input string
  * @returns {string} Raw MD5 string
  */
 function rstrMD5(s) {
     return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
 }

 /**
  * Calculates the HMAC-MD5 of a key and some data (raw strings)
  *
  * @param {string} key HMAC key
  * @param {string} data Raw input string
  * @returns {string} Raw MD5 string
  */
 function rstrHMACMD5(key, data) {
     var i;
     var bkey = rstr2binl(key);
     var ipad = [];
     var opad = [];
     var hash;
     ipad[15] = opad[15] = undefined;
     if (bkey.length > 16) {
         bkey = binlMD5(bkey, key.length * 8);
     }
     for (i = 0; i < 16; i += 1) {
         ipad[i] = bkey[i] ^ 0x36363636;
         opad[i] = bkey[i] ^ 0x5c5c5c5c;
     }
     hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
     return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
 }

 /**
  * Convert a raw string to a hex string
  *
  * @param {string} input Raw input string
  * @returns {string} Hex encoded string
  */
 function rstr2hex(input) {
     var hexTab = "0123456789abcdef";
     var output = "";
     var x;
     var i;
     for (i = 0; i < input.length; i += 1) {
         x = input.charCodeAt(i);
         output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
     }
     return output;
 }

 function rstr2hex2(input) {
     var hexTab = "0123456789";
     var output = [];
     var x;
     var i;
     for (i = 0; i < input.length; i += 1) {
         x = input.charCodeAt(i);
         output.push(hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f));
     }
     return output;
 }

 /**
  * Encode a string as UTF-8
  *
  * @param {string} input Input string
  * @returns {string} UTF8 string
  */
 function str2rstrUTF8(input) {
     return unescape(encodeURIComponent(input));
 }

 /**
  * Encodes input string as raw MD5 string
  *
  * @param {string} s Input string
  * @returns {string} Raw MD5 string
  */
 function rawMD5(s) {
     return rstrMD5(str2rstrUTF8(s));
 }
 /**
  * Encodes input string as Hex encoded string
  *
  * @param {string} s Input string
  * @returns {string} Hex encoded string
  */
 function hexMD5(s) {
     return rstr2hex(rawMD5(s));
 }
 /**
  * Calculates the raw HMAC-MD5 for the given key and data
  *
  * @param {string} k HMAC key
  * @param {string} d Input string
  * @returns {string} Raw MD5 string
  */
 function rawHMACMD5(k, d) {
     return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
 }
 /**
  * Calculates the Hex encoded HMAC-MD5 for the given key and data
  *
  * @param {string} k HMAC key
  * @param {string} d Input string
  * @returns {string} Raw MD5 string
  */
 function hexHMACMD5(k, d) {
     return rstr2hex(rawHMACMD5(k, d));
 }

 /**
  * Calculates MD5 value for a given string.
  * If a key is provided, calculates the HMAC-MD5 value.
  * Returns a Hex encoded string unless the raw argument is given.
  *
  * @param {string} string Input string
  * @param {string} [key] HMAC key
  * @param {boolean} [raw] Raw output switch
  * @returns {string} MD5 output
  */
 function md5(string, key, raw) {
     if (!key) {
         if (!raw) {
             return hexMD5(string);
         }
         return rawMD5(string);
     }
     if (!raw) {
         return hexHMACMD5(key, string);
     }
     return rawHMACMD5(key, string);
 }

 if (typeof define === "function" && define.amd) {
     define(function() {
         return md5;
     });
 } else if (typeof module === "object" && module.exports) {
     module.exports = md5;
 } else {
     // $.md5 = md5; TODO:
 }

 function password(buckets, raw) {
     let md5str = md5(raw);

     let ret = "";
     for (let i = 0; i < md5str.length; i += 2) {
         let x = md5str.charCodeAt(i);
         let x2 = md5str.charCodeAt(i + 1);
         x = x + x2;

         let bucketsLength = buckets.length;
         let bucket = "";
         if ((i / 2) < bucketsLength) {
             bucket = buckets[i / 2];
         } else {
             bucket = buckets[x % bucketsLength];
         }

        ret = ret.concat(bucket[x % bucket.length]);
     }
     return ret;
 }

 /**
 * Copy a string to clipboard
 * @param  {String} string         The string to be copied to clipboard
 * @return {Boolean}               returns a boolean correspondent to the success of the copy operation.
 * @see https://stackoverflow.com/a/53951634/938822
 */
function copyToClipboard(string) {
    let textarea;
    let result;
  
    try {
      textarea = document.createElement('textarea');
      textarea.setAttribute('readonly', true);
      textarea.setAttribute('contenteditable', true);
      textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
      textarea.value = string;
  
      document.body.appendChild(textarea);
  
      textarea.focus();
      textarea.select();
  
      const range = document.createRange();
      range.selectNodeContents(textarea);
  
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
  
      textarea.setSelectionRange(0, textarea.value.length);
      result = document.execCommand('copy');
    } catch (err) {
      console.error(err);
      result = null;
    } finally {
      document.body.removeChild(textarea);
    }
  
    // manual copy fallback using prompt
    if (!result) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
      result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
      if (!result) {
        return false;
      }
    }
    return true;
  }

 function generatePassword() {
         
     let _host = document.getElementById("host").value;
     let _date = document.getElementById("date").value;
     let _words = document.getElementById("words").value;
     let ll = "abcdefghijklmnopqrstuvwxyz";
     let ul = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     let n = "0123456789";
     let s1 = "!@#$%^&*()";
     let s2 = "~-=_+";

     let buckets = [];


     if (document.getElementById("upperLetter").checked === true) {
         buckets.push(ul);
     }
     if (document.getElementById("lowerLetter").checked === true) {
         buckets.push(ll);
     }
     if (document.getElementById("number").checked === true) {
         buckets.push(n);
     }
     if (document.getElementById("symbol1").checked === true) {
         buckets.push(s1);
     }
     if (document.getElementById("symbol2").checked === true) {
         buckets.push(s2);
     }
   
    let _ret = password(buckets, _host + _date + _words)
    saveConfig()
    let _len = document.getElementById("length").value;
    _ret = _ret.slice(0,_len);
    document.getElementById("result").value = _ret;
    copyToClipboard(_ret);
    if  (navigator && navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(_ret);
    }
 }

 function showPassword() {
    var p = document.getElementById("words");
    if (p.type === "password") {
      p.type = "text";
    } else {
      p.type = "password";
    }
 }

 function getByAPI(){
    let alias = document.getElementById("alias").value;
    if (alias === "") {
        return 
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200 && this.responseText !== "" ) {
        document.getElementById("host").value = this.responseText;
        getLastUpdate()
    }
    };
    xhttp.open("GET", "api/host?alias="+alias, true);
    xhttp.send();
 }

 function getLastUpdate(){
    let alias = document.getElementById("alias").value;
    if (alias === "") {
        return 
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200 && this.responseText !== "" ) {
        document.getElementById("date").value = this.responseText; 
    }
    };
    xhttp.open("GET", "api/date?alias="+alias, true);
    xhttp.send();
 }

 function getConfig(){
    if (chrome.runtime) {
        let host = document.getElementById("host").value;
        if (host === "") {
            return
        }
        getByChromeExtension(host);
        return
    } 
    // TODO: use web cache
    getByAPI()
 }

 function saveConfig(){
    let alias = document.getElementById("alias").value;
    let host = document.getElementById("host").value;
    let date = document.getElementById("date").value;
    let lowerLetter = document.getElementById("lowerLetter").checked;
    let upperLetter = document.getElementById("upperLetter").checked;
    let number = document.getElementById("number").checked;
    let symbol1 = document.getElementById("symbol1").checked;
    let symbol2 = document.getElementById("symbol2").checked;

    if (chrome.runtime) {
        saveByChromeExtension(alias, host, date, lowerLetter, upperLetter, number, symbol1, symbol2);
    } else {
        saveByAPI(alias, host, date, lowerLetter, upperLetter, number, symbol1, symbol2)
    }
}

function saveByChromeExtension(alias, host, date, ll, ul, number, s1, s2) {
    let v = {}
    v[host] = {
        alias: alias,
        host:host,
        date:date,
        ll:ll,
        ul:ul,
        number:number,
        s1:s1,
        s2:s2,
    }
    chrome.storage.local.set(v).then(()=>{
    });
}

function getByChromeExtension(host) {
    chrome.storage.local.get([host]).then((result) =>{
        let config = result[host];
        if (config.date !== ""){
            document.getElementById("date").value = config.date;
        }
        document.getElementById("lowerLetter").checked = config.ll;
        document.getElementById("upperLetter").checked = config.ul;
        document.getElementById("number").checked = config.number;
        document.getElementById("symbol1").checked = config.s1;
        document.getElementById("symbol2").checked = config.s2;
        return result
    });
}


 function saveByAPI(alias, host, date, lowerLetter, upperLetter, number, symbol1, symbol2){
    let post = JSON.stringify({host: host, alias:alias, date: date})

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {              
        }
    };
    xhttp.open("POST", "api/date", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhttp.send(post);
 }

 window.addEventListener('load', function(evt) {
     document.getElementById("generate").addEventListener("click", generatePassword);
     document.getElementById("showPassword").addEventListener("click", showPassword);
     document.getElementById("getHostByAlias").addEventListener("click", getConfig);
     document.getElementById("getLastUpdate").addEventListener("click", getLastUpdate);
     if (chrome && chrome.tabs){
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            var tab = tabs[0];
            var url = new URL(tab.url)
            var host = url.hostname
            document.getElementById("host").value = host;
        });
     }

     
 });
