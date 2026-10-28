import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as gsapWithCSS, t as TextPlugin } from "../_libs/gsap.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BRusjk6X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseStat(value) {
	const match = value.trim().match(/^([\d,.]+)([KMB])?$/i);
	if (!match) return {
		number: 0,
		decimals: 0,
		suffix: "",
		fallback: value
	};
	const numeric = match[1];
	const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;
	return {
		number: Number(numeric.replace(/,/g, "")),
		decimals,
		suffix: match[2] ?? "",
		fallback: value
	};
}
function formatStat(n, decimals, suffix) {
	return (decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-US")) + suffix;
}
var tweens = /* @__PURE__ */ new WeakMap();
function paintCount(el, duration = 1.2) {
	const parsed = parseStat(el.dataset.count ?? "");
	tweens.get(el)?.kill();
	if (!parsed.number) {
		el.textContent = parsed.fallback;
		return 0;
	}
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || duration <= 0) {
		el.textContent = formatStat(parsed.number, parsed.decimals, parsed.suffix);
		return 0;
	}
	const state = { n: 0 };
	el.textContent = formatStat(0, parsed.decimals, parsed.suffix);
	const tween = gsapWithCSS.to(state, {
		n: parsed.number,
		duration,
		ease: "power3.out",
		onUpdate: () => {
			el.textContent = formatStat(state.n, parsed.decimals, parsed.suffix);
		},
		onComplete: () => {
			el.textContent = formatStat(parsed.number, parsed.decimals, parsed.suffix);
		}
	});
	tweens.set(el, tween);
	return duration;
}
function CountUp({ value, className = "" }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const el = ref.current;
		if (!el || el.textContent) return;
		el.textContent = "0";
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		ref,
		className,
		"data-count": value
	});
}
gsapWithCSS.registerPlugin(TextPlugin);
function wordsOf(text) {
	return text.trim().split(/\s+/).filter(Boolean);
}
function escapeHtml(text) {
	return text.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
}
function FlipLabel({ ar, en, className = "", intervalMs = 1e4 }) {
	const elRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = elRef.current;
		if (!el) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let showingAr = true;
		let timer;
		let tween = null;
		const mount = (text, dir) => {
			el.setAttribute("dir", dir);
			el.setAttribute("lang", dir === "rtl" ? "ar" : "en");
			el.innerHTML = wordsOf(text).map((w) => `<span class="word">${escapeHtml(w)}</span>`).join(" ");
		};
		mount(ar, "rtl");
		const flip = () => {
			const nextAr = !showingAr;
			const nextText = nextAr ? ar : en;
			const nextDir = nextAr ? "rtl" : "ltr";
			const nextWords = wordsOf(nextText);
			if (reduce) {
				showingAr = nextAr;
				mount(nextText, nextDir);
				return;
			}
			tween?.kill();
			const tl = gsapWithCSS.timeline({ onComplete: () => {
				showingAr = nextAr;
				Array.from(el.querySelectorAll(".word")).forEach((span, i) => {
					if (!nextWords[i]) span.remove();
				});
			} });
			tween = tl;
			while (el.querySelectorAll(".word").length < nextWords.length) {
				const span = document.createElement("span");
				span.className = "word";
				span.innerHTML = "&nbsp;";
				span.style.opacity = "0";
				el.appendChild(span);
			}
			el.setAttribute("dir", nextDir);
			el.setAttribute("lang", nextAr ? "ar" : "en");
			Array.from(el.querySelectorAll(".word")).forEach((span, i) => {
				const target = nextWords[i] ?? "";
				const at = i * .09;
				tl.to(span, {
					rotateX: 88,
					opacity: 0,
					duration: .24,
					ease: "power2.in"
				}, at);
				tl.to(span, {
					duration: .32,
					text: {
						value: target || "\xA0",
						delimiter: ""
					},
					ease: "none"
				}, at + .24);
				tl.fromTo(span, { rotateX: -88 }, {
					rotateX: 0,
					opacity: target ? 1 : 0,
					duration: .34,
					ease: "power2.out"
				}, at + .24);
			});
		};
		timer = window.setInterval(flip, intervalMs);
		return () => {
			if (timer) window.clearInterval(timer);
			tween?.kill();
		};
	}, [
		ar,
		en,
		intervalMs
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `flip-label-wrap ${className}`.trim(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flip-label-sizer",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ar }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: en })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			ref: elRef,
			className: "flip-label",
			"aria-live": "polite",
			"aria-label": `${ar} / ${en}`,
			children: ar
		})]
	});
}
var STATS = {
	views: "324,941",
	subscribers: "3.51K",
	videos: "629",
	programs: "28"
};
function Home() {
	const boardRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const board = boardRef.current;
		if (!board) return;
		const cards = Array.from(board.querySelectorAll("[data-card]"));
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			gsapWithCSS.set(cards, {
				autoAlpha: 1,
				y: 0
			});
			cards.forEach((card) => {
				const el = card.querySelector("[data-count]");
				if (el) paintCount(el, 0);
			});
			return;
		}
		gsapWithCSS.set(cards, {
			autoAlpha: 0,
			y: 28
		});
		const tl = gsapWithCSS.timeline({ defaults: { ease: "power2.out" } });
		cards.forEach((card, index) => {
			const countDuration = index === 0 ? 1.35 : .95;
			tl.to(card, {
				autoAlpha: 1,
				y: 0,
				duration: .42
			});
			tl.call(() => {
				const el = card.querySelector("[data-count]");
				if (el) paintCount(el, countDuration);
			});
			tl.to({}, { duration: countDuration });
		});
		return () => {
			tl.kill();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "screen-shell bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: boardRef,
			className: "panel-card stat-board rounded-lg bg-surface",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stat-kicker",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipLabel, {
						ar: "قناة إذاعة البحرين",
						en: "Radio Bahrain Channel"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-card": true,
					className: "hero-group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hero-stat stat-hero rounded-lg text-on-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
							value: STATS.views,
							className: "stat-hero-num"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "stat-hero-label",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipLabel, {
							ar: "إجمالي المشاهدات",
							en: "Total Views"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stat-tiles",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							value: STATS.subscribers,
							ar: "عدد المشتركين",
							en: "Subscribers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							value: STATS.videos,
							ar: "عدد الفيديوهات",
							en: "Videos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							value: STATS.programs,
							ar: "البرامج",
							en: "Programs"
						})
					]
				})
			]
		})
	});
}
function StatCard({ value, ar, en }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		"data-card": true,
		className: "tile-card rounded-md bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
			value,
			className: "tile-num"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tile-label",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipLabel, {
				ar,
				en
			})
		})]
	});
}
//#endregion
export { Home as component };
