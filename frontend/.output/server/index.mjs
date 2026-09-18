globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { t as FastResponse } from "./_libs/srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/architecture-BZDmnkXE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a9f-dw1DMZ8KWMrSQkWcyf/xuc2CBBY\"",
		"mtime": "2026-09-18T09:53:12.174Z",
		"size": 23199,
		"path": "../public/assets/architecture-BZDmnkXE.js"
	},
	"/assets/arrow-right-Qmyu1sE5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-Vy0qnF9ZxBYcF7ri9fHDqxrg9Ns\"",
		"mtime": "2026-09-18T09:53:12.175Z",
		"size": 154,
		"path": "../public/assets/arrow-right-Qmyu1sE5.js"
	},
	"/assets/microscope-Dg2w8mYz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"290-pI/sPJa2/S6rLNJZJ+FTQMop1ZI\"",
		"mtime": "2026-09-18T09:53:12.176Z",
		"size": 656,
		"path": "../public/assets/microscope-Dg2w8mYz.js"
	},
	"/assets/routes-BD-Li0R2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5f2c-JXqN0ogK0X9pD406yj5zwKBZDr4\"",
		"mtime": "2026-09-18T09:53:12.176Z",
		"size": 24364,
		"path": "../public/assets/routes-BD-Li0R2.js"
	},
	"/assets/recommendations-4WBe-yqb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58a4-K9eIIAZkiM+orXiXzIJ9m3MPO00\"",
		"mtime": "2026-09-18T09:53:12.176Z",
		"size": 22692,
		"path": "../public/assets/recommendations-4WBe-yqb.js"
	},
	"/assets/scan-DiHa7Xwu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5188-XgAY0gRwsCTyujvLE4ICv3wtbE8\"",
		"mtime": "2026-09-18T09:53:12.177Z",
		"size": 20872,
		"path": "../public/assets/scan-DiHa7Xwu.js"
	},
	"/assets/sparkles-DZTIdgAM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e3-vCyXQKLK6+vLQ4DjIuuXUtPGuc8\"",
		"mtime": "2026-09-18T09:53:12.197Z",
		"size": 483,
		"path": "../public/assets/sparkles-DZTIdgAM.js"
	},
	"/assets/images-C9KIwR-q.jpg": {
		"type": "image/jpeg",
		"etag": "\"b00c-Q6Opyi/yoZ6975M4RLfv//HW6tA\"",
		"mtime": "2026-09-18T09:53:12.201Z",
		"size": 45068,
		"path": "../public/assets/images-C9KIwR-q.jpg"
	},
	"/assets/index-DcbFCkeq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e723-ZLVpr1ZIsHxLoB64PoRqQpn6+Lw\"",
		"mtime": "2026-09-18T09:53:12.173Z",
		"size": 386851,
		"path": "../public/assets/index-DcbFCkeq.js"
	},
	"/assets/styles-DsO2lpIc.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1fd84-rjtT10q47BdHsXy4170rez2P1HM\"",
		"mtime": "2026-09-18T09:53:12.202Z",
		"size": 130436,
		"path": "../public/assets/styles-DsO2lpIc.css"
	},
	"/ai_architecture.jpg": {
		"type": "image/jpeg",
		"etag": "\"a6c81-nk0PmN7a1bcG+PVYjH/cu9Tz/A8\"",
		"mtime": "2026-09-17T23:40:19.400Z",
		"size": 683137,
		"path": "../public/ai_architecture.jpg"
	},
	"/dermatology_treatments.jpg": {
		"type": "image/jpeg",
		"etag": "\"894db-tDZP6rBTuoVU7u9yPh6lxsrzAZc\"",
		"mtime": "2026-09-17T23:38:59.959Z",
		"size": 562395,
		"path": "../public/dermatology_treatments.jpg"
	},
	"/dermoscopy_benign.jpg": {
		"type": "image/jpeg",
		"etag": "\"a346c-uNyV0tnaNM+2hsQrh9IOTolxe+4\"",
		"mtime": "2026-09-17T23:38:12.795Z",
		"size": 668780,
		"path": "../public/dermoscopy_benign.jpg"
	},
	"/dermoscopy_suspicious.jpg": {
		"type": "image/jpeg",
		"etag": "\"b64cd-cADjwZ6CPkVsDHOGoKDsUbsH6wk\"",
		"mtime": "2026-09-17T23:37:37.039Z",
		"size": 746701,
		"path": "../public/dermoscopy_suspicious.jpg"
	},
	"/assets/dermatology_treatments-KMcgPC_P.jpg": {
		"type": "image/jpeg",
		"etag": "\"894db-tDZP6rBTuoVU7u9yPh6lxsrzAZc\"",
		"mtime": "2026-09-18T09:53:12.198Z",
		"size": 562395,
		"path": "../public/assets/dermatology_treatments-KMcgPC_P.jpg"
	},
	"/assets/ai_architecture-7EXCsY9E.jpg": {
		"type": "image/jpeg",
		"etag": "\"a6c81-nk0PmN7a1bcG+PVYjH/cu9Tz/A8\"",
		"mtime": "2026-09-18T09:53:12.197Z",
		"size": 683137,
		"path": "../public/assets/ai_architecture-7EXCsY9E.jpg"
	},
	"/skin_doctor.png": {
		"type": "image/png",
		"etag": "\"a10d9-SL0hEPoMzrkRG7ECobgjmbvysIc\"",
		"mtime": "2026-07-23T09:40:00.821Z",
		"size": 659673,
		"path": "../public/skin_doctor.png"
	},
	"/assets/dermoscopy_benign-DLOJ2l3X.jpg": {
		"type": "image/jpeg",
		"etag": "\"a346c-uNyV0tnaNM+2hsQrh9IOTolxe+4\"",
		"mtime": "2026-09-18T09:53:12.198Z",
		"size": 668780,
		"path": "../public/assets/dermoscopy_benign-DLOJ2l3X.jpg"
	},
	"/assets/dermoscopy_suspicious-CxdkHb1Q.jpg": {
		"type": "image/jpeg",
		"etag": "\"b64cd-cADjwZ6CPkVsDHOGoKDsUbsH6wk\"",
		"mtime": "2026-09-18T09:53:12.199Z",
		"size": 746701,
		"path": "../public/assets/dermoscopy_suspicious-CxdkHb1Q.jpg"
	},
	"/assets/skin_doctor-C7hwhg1q.png": {
		"type": "image/png",
		"etag": "\"a10d9-SL0hEPoMzrkRG7ECobgjmbvysIc\"",
		"mtime": "2026-09-18T09:53:12.201Z",
		"size": 659673,
		"path": "../public/assets/skin_doctor-C7hwhg1q.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_jiti@_2a2ad7b3a42ccb73ae0648f3f823b6cb/node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_40s5ap = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_40s5ap
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_jiti@_2a2ad7b3a42ccb73ae0648f3f823b6cb/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_jiti@_2a2ad7b3a42ccb73ae0648f3f823b6cb/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_jiti@_2a2ad7b3a42ccb73ae0648f3f823b6cb/node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260603-beta_jiti@_2a2ad7b3a42ccb73ae0648f3f823b6cb/node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
