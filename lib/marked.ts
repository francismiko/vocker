import hljs from "highlight.js";
import { Marked, type MarkedExtension } from "marked";
import { baseUrl } from "marked-base-url";
import { markedHighlight } from "marked-highlight";
import markedKatex from "marked-katex-extension";

const basicConfig: MarkedExtension = {
	pedantic: false,
	gfm: true,
	breaks: true,
};

const highlight: MarkedExtension = markedHighlight({
	langPrefix: "hljs language-",
	highlight(code, lang) {
		const language = hljs.getLanguage(lang) ? lang : "plaintext";
		return hljs.highlight(code, { language }).value;
	},
});

const katex: MarkedExtension = markedKatex({
	displayMode: true,
});

export const marked = new Marked()
	.use(basicConfig)
	.use(highlight)
	.use(katex)
	.use(baseUrl);
