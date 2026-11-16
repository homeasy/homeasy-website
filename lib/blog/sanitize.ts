import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Cleans the article HTML before it is stored: only plain article tags survive, so nothing typed or pasted
 * into the editor (scripts, styles, frames, event handlers) can reach the public page.
 */
export function cleanArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "h4", "strong", "em", "u", "s", "code", "pre", "blockquote", "ul", "ol", "li", "hr", "br", "a", "img"],
    allowedAttributes: { a: ["href", "rel"], img: ["src", "alt", "width", "height", "loading"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      h1: "h2", // the article title is the page's only H1
      b: "strong",
      i: "em",
      a: (tagName, attribs) => ({
        tagName,
        attribs: { href: attribs.href ?? "", ...(/^https?:\/\//i.test(attribs.href ?? "") && !/^https?:\/\/(www\.)?homeasy\.io/i.test(attribs.href) ? { rel: "noopener noreferrer" } : {}) },
      }),
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
  }).trim();
}
