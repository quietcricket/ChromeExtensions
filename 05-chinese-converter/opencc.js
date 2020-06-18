/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/opencc-js@0.2.1/opencc.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
"use strict";
if ("undefined" == typeof window) var fetch = require("node-fetch");
const OpenCC = {
    _makeEmptyTrie: () => [{}],
    _addWord: (n, t, e) => {
        for (const e of t) {
            const t = n[0];
            e in t || (t[e] = OpenCC._makeEmptyTrie()), n = t[e]
        }
        n.push(e)
    },
    _hasValue: n => 2 == n.length,
    _longestPrefix: (n, t) => {
        const e = [];
        let a, o = [];
        for (const i of t) {
            o.push(i);
            const t = n[0];
            if (!(i in t)) break;
            n = t[i], OpenCC._hasValue(n) && (a = n[1], e.push(...o), o = [])
        }
        if (e.length) return [e.join(""), a]
    },
    _load_dict: async (n, t) => {
        const e = chrome.runtime.getURL("/");
        async function a(n) { const t = await fetch(e + n + ".txt"); return await t.text() }
        let o;
        "from" == t ? o = { cn: ["STCharacters", "STPhrases"], hk: ["HKVariantsRev", "HKVariantsRevPhrases"], tw: ["TWVariantsRev", "TWVariantsRevPhrases"], twp: ["TWVariantsRev", "TWVariantsRevPhrases", "TWPhrasesRev"], jp: ["JPVariantsRev", "JPShinjitaiCharacters", "JPShinjitaiPhrases"] } [n] : "to" == t && (o = { cn: ["TSCharacters", "TSPhrases"], hk: ["HKVariants"], tw: ["TWVariants"], twp: ["TWVariants", "TWPhrasesIT", "TWPhrasesName", "TWPhrasesOther"], jp: ["JPVariants"] } [n]);
        const i = OpenCC._makeEmptyTrie();
        for (const n of o) {
            const t = (await a(n)).split("\n");
            for (const n of t)
                if (n && !n.startsWith("#")) {
                    const [t, e] = n.split("\t");
                    OpenCC._addWord(i, t, e.split(" ")[0])
                }
        }
        return i
    },
    _convert: (n, t) => {
        const e = [];
        for (; t.length;) {
            const a = OpenCC._longestPrefix(n, t);
            if (a) {
                const [n, o] = a;
                e.push(o), t = t.slice(n.length)
            } else {
                const n = t[Symbol.iterator]().next().value;
                e.push(n), t = t.slice(n.length)
            }
        }
        return e.join("")
    },
    Converter: async function(n, t) { let e, a; return "t" != n && (e = await OpenCC._load_dict(n, "from")), "t" != t && (a = await OpenCC._load_dict(t, "to")), o => ("t" != n && (o = OpenCC._convert(e, o)), "t" != t && (o = OpenCC._convert(a, o)), o) },
    CustomConverter: function(n) { const t = OpenCC._makeEmptyTrie(); for (const [e, a] of Object.entries(n)) OpenCC._addWord(t, e, a); return n => OpenCC._convert(t, n) },
    HTMLConverter: function(n, t, e, a) { return { convert: function() {! function t(o, i) { if (o.lang == e ? (i = !0, o.shouldChangeLang = !0, o.lang = a) : o.lang && o.lang.length && (i = !1), i) { if ("SCRIPT" == o.tagName) return; if ("STYLE" == o.tagName) return; "META" == o.tagName && "description" == o.name ? (void 0 === o.originalContent && (o.originalContent = o.content), o.content = n(o.originalContent)) : "META" == o.tagName && "keywords" == o.name ? (void 0 === o.originalContent && (o.originalContent = o.content), o.content = n(o.originalContent)) : "IMG" == o.tagName ? (void 0 === o.originalAlt && (o.originalAlt = o.alt), o.alt = n(o.originalAlt)) : "INPUT" == o.tagName && "button" == o.type && (void 0 === o.originalValue && (o.originalValue = o.value), o.value = n(o.originalValue)) } for (const e of o.childNodes) e.nodeType == Node.TEXT_NODE && i ? (void 0 === e.originalString && (e.originalString = e.nodeValue), e.nodeValue = n(e.originalString)) : t(e, i) }(t, !1) }, restore: function() {! function n(t) { t.shouldChangeLang && (t.lang = e), void 0 !== t.originalString && (t.nodeValue = t.originalString), "META" == t.tagName && "description" == t.name ? void 0 !== t.originalContent && (t.content = t.originalContent) : "META" == t.tagName && "keywords" == t.name ? void 0 !== t.originalContent && (t.content = t.originalContent) : "IMG" == t.tagName ? void 0 !== t.originalAlt && (t.alt = t.originalAlt) : "INPUT" == t.tagName && "button" == t.type && void 0 !== t.originalValue && (t.value = t.originalValue); for (const e of t.childNodes) n(e) }(t) } } }
};
try { module.exports = exports = OpenCC } catch (n) {}
//# sourceMappingURL=/sm/3bf3e0acfc963ac04d9293da9f6536231f0b8370aa9f86ad42c20eb10af8cad4.map