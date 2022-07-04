# gen-password-with-domain
chrome-extension which can generate password with domain name and your password seeds

## TL;DR
this extension will md5 domain name and password seeds, then get the password.

## how it work
```javascript
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
 
 function generatePassword() {
     let _domain = document.getElementById("domain").value;
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
   
     let _ret = password(buckets, _domain + _date + _words)

     document.getElementById("result").value = _ret;
 }
```
all code is simple, in line 65 get domain + date(year-mouth) + words, then md5 it.
and line 22-24 to make sure password has each item selected(A-Z,a-z ...)
