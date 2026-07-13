(function() {
  "use strict";
  var _a;
  var MatchPattern = (_a = class {
    /**
    * Parse a match pattern string. If it is invalid, the constructor will throw an
    * `InvalidMatchPattern` error.
    *
    * @param matchPattern The match pattern to parse.
    */
    constructor(matchPattern) {
      if (matchPattern === "<all_urls>") {
        this.isAllUrls = true;
        this.protocolMatches = [..._a.PROTOCOLS];
        this.hostnameMatch = "*";
        this.pathnameMatch = "*";
      } else {
        const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
        if (groups == null) throw new InvalidMatchPattern(matchPattern, "Incorrect format");
        const [_, protocol, hostname, pathname] = groups;
        validateProtocol(matchPattern, protocol);
        validateHostname(matchPattern, hostname);
        this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
        this.hostnameMatch = hostname;
        this.pathnameMatch = pathname;
      }
    }
    /** Check if a URL is included in a pattern. */
    includes(url) {
      const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
      if (this.isAllUrls) return !this.isUnknownProtocol(u);
      return !!this.protocolMatches.find((protocol) => {
        if (protocol === "http") return this.isHttpMatch(u);
        if (protocol === "https") return this.isHttpsMatch(u);
        if (protocol === "file") return this.isFileMatch(u);
        if (protocol === "ftp") return this.isFtpMatch(u);
        if (protocol === "urn") return this.isUrnMatch(u);
      });
    }
    isHttpMatch(url) {
      return url.protocol === "http:" && this.isHostPathMatch(url);
    }
    isHttpsMatch(url) {
      return url.protocol === "https:" && this.isHostPathMatch(url);
    }
    isHostPathMatch(url) {
      if (!this.hostnameMatch || !this.pathnameMatch) return false;
      const hostnameMatchRegexs = [this.convertPatternToRegex(this.hostnameMatch), this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))];
      const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
      return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
    }
    isUnknownProtocol(url) {
      return !this.protocolMatches.includes(url.protocol.slice(0, -1));
    }
    isPathMatch(url) {
      if (!this.pathnameMatch) return false;
      return this.convertPatternToRegex(this.pathnameMatch).test(url.pathname);
    }
    isFileMatch(url) {
      return url.protocol === "file:" && this.isPathMatch(url);
    }
    isFtpMatch(_url) {
      throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
    }
    isUrnMatch(_url) {
      throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
    }
    convertPatternToRegex(pattern) {
      const starsReplaced = this.escapeForRegex(pattern).replace(/\\\*/g, ".*");
      return RegExp(`^${starsReplaced}$`);
    }
    escapeForRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  }, _a.PROTOCOLS = [
    "http",
    "https",
    "file",
    "ftp",
    "urn",
    "ws",
    "wss"
  ], _a);
  var InvalidMatchPattern = class extends Error {
    constructor(matchPattern, reason) {
      super(`Invalid match pattern "${matchPattern}": ${reason}`);
    }
  };
  function validateProtocol(matchPattern, protocol) {
    if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*") throw new InvalidMatchPattern(matchPattern, `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`);
  }
  function validateHostname(matchPattern, hostname) {
    if (hostname.includes(":")) throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
    if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*.")) throw new InvalidMatchPattern(matchPattern, `If using a wildcard (*), it must go at the start of the hostname`);
  }
  function defineBackground(arg) {
    if (typeof arg === "function")
      return { main: arg };
    return arg;
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var browserPolyfill = { exports: {} };
  (function(module, exports) {
    (function(global2, factory) {
      {
        factory(module);
      }
    })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : commonjsGlobal, function(module2) {
      var _a2, _b;
      if (!((_b = (_a2 = globalThis.chrome) == null ? void 0 : _a2.runtime) == null ? void 0 : _b.id)) {
        throw new Error("This script should only be loaded in a browser extension.");
      }
      if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
        const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
        const wrapAPIs = (extensionAPIs) => {
          const apiMetadata = {
            "alarms": {
              "clear": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "clearAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "get": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "bookmarks": {
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getChildren": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getRecent": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getSubTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTree": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "browserAction": {
              "disable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "enable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "getBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getBadgeText": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "openPopup": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setBadgeText": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "browsingData": {
              "remove": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "removeCache": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCookies": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeDownloads": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFormData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeHistory": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeLocalStorage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePasswords": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePluginData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "settings": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "commands": {
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "contextMenus": {
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "cookies": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAllCookieStores": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "set": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "devtools": {
              "inspectedWindow": {
                "eval": {
                  "minArgs": 1,
                  "maxArgs": 2,
                  "singleCallbackArg": false
                }
              },
              "panels": {
                "create": {
                  "minArgs": 3,
                  "maxArgs": 3,
                  "singleCallbackArg": true
                },
                "elements": {
                  "createSidebarPane": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              }
            },
            "downloads": {
              "cancel": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "download": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "erase": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFileIcon": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "open": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "pause": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFile": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "resume": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "extension": {
              "isAllowedFileSchemeAccess": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "isAllowedIncognitoAccess": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "history": {
              "addUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "deleteRange": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getVisits": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "i18n": {
              "detectLanguage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAcceptLanguages": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "identity": {
              "launchWebAuthFlow": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "idle": {
              "queryState": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "management": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getSelf": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setEnabled": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "uninstallSelf": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "notifications": {
              "clear": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPermissionLevel": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "pageAction": {
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "hide": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "permissions": {
              "contains": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "request": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "runtime": {
              "getBackgroundPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPlatformInfo": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "openOptionsPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "requestUpdateCheck": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "sendMessage": {
                "minArgs": 1,
                "maxArgs": 3
              },
              "sendNativeMessage": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "setUninstallURL": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "sessions": {
              "getDevices": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getRecentlyClosed": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "restore": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "storage": {
              "local": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "managed": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "sync": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              }
            },
            "tabs": {
              "captureVisibleTab": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "detectLanguage": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "discard": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "duplicate": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "executeScript": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getZoom": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getZoomSettings": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goBack": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goForward": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "highlight": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "insertCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "query": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "reload": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "sendMessage": {
                "minArgs": 2,
                "maxArgs": 3
              },
              "setZoom": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "setZoomSettings": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "update": {
                "minArgs": 1,
                "maxArgs": 2
              }
            },
            "topSites": {
              "get": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "webNavigation": {
              "getAllFrames": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFrame": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "webRequest": {
              "handlerBehaviorChanged": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "windows": {
              "create": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getLastFocused": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            }
          };
          if (Object.keys(apiMetadata).length === 0) {
            throw new Error("api-metadata.json has not been included in browser-polyfill");
          }
          class DefaultWeakMap extends WeakMap {
            constructor(createItem, items = void 0) {
              super(items);
              this.createItem = createItem;
            }
            get(key) {
              if (!this.has(key)) {
                this.set(key, this.createItem(key));
              }
              return super.get(key);
            }
          }
          const isThenable = (value) => {
            return value && typeof value === "object" && typeof value.then === "function";
          };
          const makeCallback = (promise, metadata) => {
            return (...callbackArgs) => {
              if (extensionAPIs.runtime.lastError) {
                promise.reject(new Error(extensionAPIs.runtime.lastError.message));
              } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                promise.resolve(callbackArgs[0]);
              } else {
                promise.resolve(callbackArgs);
              }
            };
          };
          const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
          const wrapAsyncFunction = (name, metadata) => {
            return function asyncFunctionWrapper(target, ...args) {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                if (metadata.fallbackToNoCallback) {
                  try {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  } catch (cbError) {
                    console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                    target[name](...args);
                    metadata.fallbackToNoCallback = false;
                    metadata.noCallback = true;
                    resolve();
                  }
                } else if (metadata.noCallback) {
                  target[name](...args);
                  resolve();
                } else {
                  target[name](...args, makeCallback({
                    resolve,
                    reject
                  }, metadata));
                }
              });
            };
          };
          const wrapMethod = (target, method, wrapper) => {
            return new Proxy(method, {
              apply(targetMethod, thisObj, args) {
                return wrapper.call(thisObj, target, ...args);
              }
            });
          };
          let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
          const wrapObject = (target, wrappers = {}, metadata = {}) => {
            let cache = /* @__PURE__ */ Object.create(null);
            let handlers = {
              has(proxyTarget2, prop) {
                return prop in target || prop in cache;
              },
              get(proxyTarget2, prop, receiver) {
                if (prop in cache) {
                  return cache[prop];
                }
                if (!(prop in target)) {
                  return void 0;
                }
                let value = target[prop];
                if (typeof value === "function") {
                  if (typeof wrappers[prop] === "function") {
                    value = wrapMethod(target, target[prop], wrappers[prop]);
                  } else if (hasOwnProperty(metadata, prop)) {
                    let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                    value = wrapMethod(target, target[prop], wrapper);
                  } else {
                    value = value.bind(target);
                  }
                } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                  value = wrapObject(value, wrappers[prop], metadata[prop]);
                } else if (hasOwnProperty(metadata, "*")) {
                  value = wrapObject(value, wrappers[prop], metadata["*"]);
                } else {
                  Object.defineProperty(cache, prop, {
                    configurable: true,
                    enumerable: true,
                    get() {
                      return target[prop];
                    },
                    set(value2) {
                      target[prop] = value2;
                    }
                  });
                  return value;
                }
                cache[prop] = value;
                return value;
              },
              set(proxyTarget2, prop, value, receiver) {
                if (prop in cache) {
                  cache[prop] = value;
                } else {
                  target[prop] = value;
                }
                return true;
              },
              defineProperty(proxyTarget2, prop, desc) {
                return Reflect.defineProperty(cache, prop, desc);
              },
              deleteProperty(proxyTarget2, prop) {
                return Reflect.deleteProperty(cache, prop);
              }
            };
            let proxyTarget = Object.create(target);
            return new Proxy(proxyTarget, handlers);
          };
          const wrapEvent = (wrapperMap) => ({
            addListener(target, listener, ...args) {
              target.addListener(wrapperMap.get(listener), ...args);
            },
            hasListener(target, listener) {
              return target.hasListener(wrapperMap.get(listener));
            },
            removeListener(target, listener) {
              target.removeListener(wrapperMap.get(listener));
            }
          });
          const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
            if (typeof listener !== "function") {
              return listener;
            }
            return function onRequestFinished(req) {
              const wrappedReq = wrapObject(
                req,
                {},
                {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                }
              );
              listener(wrappedReq);
            };
          });
          const onMessageWrappers = new DefaultWeakMap((listener) => {
            if (typeof listener !== "function") {
              return listener;
            }
            return function onMessage(message, sender, sendResponse) {
              let didCallSendResponse = false;
              let wrappedSendResponse;
              let sendResponsePromise = new Promise((resolve) => {
                wrappedSendResponse = function(response) {
                  didCallSendResponse = true;
                  resolve(response);
                };
              });
              let result;
              try {
                result = listener(message, sender, wrappedSendResponse);
              } catch (err) {
                result = Promise.reject(err);
              }
              const isResultThenable = result !== true && isThenable(result);
              if (result !== true && !isResultThenable && !didCallSendResponse) {
                return false;
              }
              const sendPromisedResult = (promise) => {
                promise.then((msg) => {
                  sendResponse(msg);
                }, (error) => {
                  let message2;
                  if (error && (error instanceof Error || typeof error.message === "string")) {
                    message2 = error.message;
                  } else {
                    message2 = "An unexpected error occurred";
                  }
                  sendResponse({
                    __mozWebExtensionPolyfillReject__: true,
                    message: message2
                  });
                }).catch((err) => {
                  console.error("Failed to send onMessage rejected reply", err);
                });
              };
              if (isResultThenable) {
                sendPromisedResult(result);
              } else {
                sendPromisedResult(sendResponsePromise);
              }
              return true;
            };
          });
          const wrappedSendMessageCallback = ({
            reject,
            resolve
          }, reply) => {
            if (extensionAPIs.runtime.lastError) {
              if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                resolve();
              } else {
                reject(new Error(extensionAPIs.runtime.lastError.message));
              }
            } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
              reject(new Error(reply.message));
            } else {
              resolve(reply);
            }
          };
          const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
            if (args.length < metadata.minArgs) {
              throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
            }
            if (args.length > metadata.maxArgs) {
              throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
            }
            return new Promise((resolve, reject) => {
              const wrappedCb = wrappedSendMessageCallback.bind(null, {
                resolve,
                reject
              });
              args.push(wrappedCb);
              apiNamespaceObj.sendMessage(...args);
            });
          };
          const staticWrappers = {
            devtools: {
              network: {
                onRequestFinished: wrapEvent(onRequestFinishedWrappers)
              }
            },
            runtime: {
              onMessage: wrapEvent(onMessageWrappers),
              onMessageExternal: wrapEvent(onMessageWrappers),
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3
              })
            },
            tabs: {
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3
              })
            }
          };
          const settingMetadata = {
            clear: {
              minArgs: 1,
              maxArgs: 1
            },
            get: {
              minArgs: 1,
              maxArgs: 1
            },
            set: {
              minArgs: 1,
              maxArgs: 1
            }
          };
          apiMetadata.privacy = {
            network: {
              "*": settingMetadata
            },
            services: {
              "*": settingMetadata
            },
            websites: {
              "*": settingMetadata
            }
          };
          return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
        };
        module2.exports = wrapAPIs(chrome);
      } else {
        module2.exports = globalThis.browser;
      }
    });
  })(browserPolyfill);
  var browserPolyfillExports = browserPolyfill.exports;
  const originalBrowser = /* @__PURE__ */ getDefaultExportFromCjs(browserPolyfillExports);
  var browser = originalBrowser;
  const AUTH_BTN = /login|sign\s*in|log\s*in|signin/i;
  const SIGNUP_BTN = /sign\s*up|register|create\s*account|get\s*started|join/i;
  const SEARCH_RELATED = /search|find|query|look\s*up|browse|catalog|filter|sort/i;
  const SUBMIT_BTN = /submit|save|continue|next|done|finish|confirm/i;
  function buildPageState(goal, page) {
    var _a2, _b;
    page.visibleText.toLowerCase();
    const hasPasswordField = page.inputs.some((i) => i.visible && i.type === "password");
    const hasEmailField = page.inputs.some((i) => i.visible && (i.type === "email" || /email/i.test(textOf(i))));
    const hasSearchField = page.inputs.some((i) => i.visible && SEARCH_RELATED.test(textOf(i)));
    const hasForm = page.forms.length > 0 || page.inputs.filter((i) => i.visible).length > 1;
    const mainHeading = ((_a2 = page.headings.filter((h) => h.level <= 2).sort((a, b) => a.level - b.level)[0]) == null ? void 0 : _a2.text) || "";
    const urlLower = page.url.toLowerCase();
    const authInputs = page.inputs.filter((i) => i.visible && (i.type === "password" || i.type === "email" || !SEARCH_RELATED.test(textOf(i)))).map((i) => ({ placeholder: i.placeholder, type: i.type, label: i.label }));
    const formInputs = page.inputs.filter((i) => i.visible).map((i) => ({ placeholder: i.placeholder, type: i.type, label: i.label, name: i.name, required: i.required }));
    const loginButton = findBtn(page, AUTH_BTN);
    const signupButton = findBtn(page, SIGNUP_BTN);
    const submitButton = findBtn(page, SUBMIT_BTN);
    const submitButtonText = (submitButton == null ? void 0 : submitButton.text) || ((_b = page.forms[0]) == null ? void 0 : _b.submitText) || null;
    const goalLower = goal.toLowerCase();
    const isAuthGoal = /login|sign\s*in|log\s*in|authenticate/i.test(goalLower);
    const isSignupGoal = /register|sign\s*up|create\s*account/i.test(goalLower);
    const isCreateGoal = /create|make|new|add|upload|post|start/i.test(goalLower);
    const isSearchGoal = /search|find|look\s*up|query/i.test(goalLower);
    const isIssueGoal = /issue|pull\s*request|pr/i.test(goalLower);
    const isCheckoutGoal = /checkout|book|buy|purchase|order|pay/i.test(goalLower);
    const isSettingsGoal = /settings|profile|password|preferences|edit|update|change/i.test(goalLower);
    const pageType = detectPageType(page, goalLower, {
      hasPasswordField,
      hasEmailField,
      hasSearchField,
      hasForm,
      loginButton,
      signupButton,
      submitButton,
      mainHeading,
      isAuthGoal,
      isSignupGoal,
      isCreateGoal,
      isSearchGoal,
      isIssueGoal,
      isCheckoutGoal,
      isSettingsGoal,
      urlLower
    });
    const pagePurpose = page.pagePurpose || "";
    const availableTargets = [];
    if (pageType === "login" || isAuthGoal) {
      for (const btn of page.buttons) {
        if (!btn.visible) continue;
        if (AUTH_BTN.test(btn.text) || /login|sign/i.test(btn.text)) {
          availableTargets.push({ text: btn.text, elementType: "button", confidence: 94, action: "click" });
        }
      }
      for (const link of page.links) {
        if (!link.visible) continue;
        if (AUTH_BTN.test(link.text) || /login|sign/i.test(link.text)) {
          availableTargets.push({ text: link.text, elementType: "link", confidence: 88, action: "click" });
        }
      }
      for (const inp of page.inputs) {
        if (!inp.visible) continue;
        if (inp.type === "password" || inp.type === "email" || /email|user|phone|mobile/i.test(textOf(inp))) {
          availableTargets.push({ text: inp.placeholder || inp.label || inp.name || "input field", elementType: "input", confidence: 80, action: "input" });
        }
      }
    }
    if (pageType === "signup" || isSignupGoal) {
      for (const btn of page.buttons) {
        if (!btn.visible) continue;
        if (SIGNUP_BTN.test(btn.text) || /register|sign\s*up|create/i.test(btn.text)) {
          availableTargets.push({ text: btn.text, elementType: "button", confidence: 94, action: "click" });
        }
      }
      for (const inp of page.inputs) {
        if (!inp.visible) continue;
        if (inp.type === "password" || inp.type === "email" || /name|user|email|phone/i.test(textOf(inp))) {
          availableTargets.push({ text: inp.placeholder || inp.label || inp.name || "field", elementType: "input", confidence: 82, action: "input" });
        }
      }
    }
    if (isCreateGoal && (isIssueGoal || /repo/i.test(goalLower))) {
      for (const link of page.links) {
        if (!link.visible) continue;
        if (/issues?|pulls?|pull.request/i.test(link.text) && /\/[^/]+\/[^/]+/.test(page.url)) {
          availableTargets.push({ text: link.text, elementType: "link", confidence: 92, action: "click" });
        }
      }
      for (const btn of page.buttons) {
        if (!btn.visible) continue;
        if (/new\s+(issue|pull\s*request)|create/i.test(btn.text)) {
          availableTargets.push({ text: btn.text, elementType: "button", confidence: 96, action: "click" });
        }
      }
      for (const link of page.links) {
        if (!link.visible) continue;
        if (/new\s+(issue|pull\s*request)/i.test(link.text)) {
          availableTargets.push({ text: link.text, elementType: "link", confidence: 90, action: "click" });
        }
      }
    }
    if (isSearchGoal) {
      for (const inp of page.inputs) {
        if (!inp.visible) continue;
        if (SEARCH_RELATED.test(textOf(inp))) {
          availableTargets.push({ text: inp.placeholder || inp.label || "search", elementType: "input", confidence: 92, action: "input" });
        }
      }
      for (const btn of page.buttons) {
        if (!btn.visible) continue;
        if (SEARCH_RELATED.test(btn.text) || /go|find/i.test(btn.text)) {
          availableTargets.push({ text: btn.text, elementType: "button", confidence: 80, action: "click" });
        }
      }
    }
    if (availableTargets.length === 0) {
      for (const btn of page.buttons) {
        if (!btn.visible) continue;
        if (btn.text && !SEARCH_RELATED.test(btn.text)) {
          availableTargets.push({ text: btn.text, elementType: "button", confidence: 55, action: "click" });
        }
      }
      for (const link of page.links) {
        if (!link.visible) continue;
        if (link.text && !SEARCH_RELATED.test(link.text)) {
          availableTargets.push({ text: link.text, elementType: "link", confidence: 50, action: "click" });
        }
      }
      for (const inp of page.inputs) {
        if (!inp.visible) continue;
        availableTargets.push({ text: inp.placeholder || inp.label || inp.name || "input", elementType: "input", confidence: 45, action: "input" });
      }
    }
    return {
      pageType,
      pagePurpose,
      url: page.url,
      title: page.title,
      domain: page.domain,
      mainHeading,
      visibleErrors: [...page.errorMessages, ...page.validationMessages],
      successMessages: page.successMessages,
      validationMessages: page.validationMessages,
      hasActiveModal: page.dialogs.length > 0,
      hasActiveDialog: page.dialogs.length > 0,
      hasPasswordField,
      hasEmailField,
      hasSearchField,
      hasForm,
      submitButtonText,
      loginButton,
      signupButton,
      authInputs,
      formInputs,
      disabledButtons: page.disabledButtons.map((b) => b.text),
      breadcrumbs: page.breadcrumbs,
      toasts: page.toasts,
      availableTargets: availableTargets.slice(0, 10),
      workflowHint: page.activeWorkflow || ""
    };
  }
  function findBtn(page, pattern) {
    for (const btn of page.buttons) {
      if (btn.visible && pattern.test(btn.text)) return { text: btn.text };
    }
    for (const link of page.links) {
      if (link.visible && pattern.test(link.text)) return { text: link.text };
    }
    return null;
  }
  function textOf(inp) {
    return (inp.placeholder || inp.label || inp.name || inp.type || "").toLowerCase();
  }
  function detectPageType(page, goalLower, deps) {
    const {
      hasPasswordField,
      hasEmailField,
      hasSearchField,
      hasForm,
      loginButton,
      signupButton,
      submitButton,
      mainHeading,
      isAuthGoal,
      isSignupGoal,
      isCreateGoal,
      isSearchGoal,
      isIssueGoal,
      isCheckoutGoal,
      isSettingsGoal,
      urlLower
    } = deps;
    const url = urlLower;
    const hasErrors = page.errorMessages.length > 0 || page.validationMessages.length > 0;
    const purpose = page.pagePurpose.toLowerCase();
    const wf = page.activeWorkflow;
    if (wf === "login" || purpose.includes("login") || isAuthGoal && (hasPasswordField || loginButton && !signupButton)) {
      if (hasPasswordField || hasEmailField || hasForm) return "login";
      if (loginButton) return "login";
    }
    if (wf === "signup" || purpose.includes("registration") || isSignupGoal) return "signup";
    if (isCreateGoal && isIssueGoal) {
      if (url.includes("/issues/new") || url.includes("/new/issue") || url.includes("/issues/new/choose")) return "issue_form";
      if (/\/issues?(\/|$)/.test(url) && !url.includes("/new")) return "issues_list";
      if (url.includes("/pulls") && !url.includes("/new")) return "pull_requests";
      if (/\/[^/]+\/[^/]+(\/|$)/.test(url) && !url.includes("issues") && !url.includes("pulls")) return "repo";
      if (url === "https://github.com/" || url === "https://github.com" || /^https?:\/\/github\.com\/?$/.test(url)) return "dashboard";
    }
    if (isCheckoutGoal) {
      if (url.includes("/checkout") || url.includes("/payment") || url.includes("/review")) return "checkout";
      if (url.includes("/cart")) return "cart";
      if (purpose.includes("checkout") || purpose.includes("payment")) return "checkout";
    }
    if (isSettingsGoal || wf === "settings" || purpose.includes("settings") || purpose.includes("profile")) return "settings";
    if (isSearchGoal || hasSearchField) return "search";
    if (hasErrors) return "error_page";
    if (hasPasswordField || hasEmailField || loginButton && hasForm) return "login";
    if (signupButton && hasForm) return "signup";
    if (submitButton && hasForm && !loginButton && !signupButton) return "form";
    if (hasForm) return "form";
    const headingText = mainHeading.toLowerCase();
    if (/dashboard|overview|home|feed|inbox/i.test(headingText)) return "dashboard";
    if (/search|find|browse|results/i.test(headingText)) return "search_results";
    if (page.links.filter((l) => l.visible).length > 5) return "landing";
    if (page.buttons.filter((b) => b.visible).length > 3) return "landing";
    return "unknown";
  }
  function findTarget(state, pattern) {
    for (const t of state.availableTargets) {
      if (pattern.test(t.text)) return t;
    }
    return null;
  }
  function findTargetByType(state, elementType) {
    const target = state.availableTargets.find((t) => t.elementType === elementType);
    return target || null;
  }
  function hasUrlChanged(memory, state) {
    return memory.previousUrl !== "" && state.url !== memory.previousUrl;
  }
  const loginWorkflow = {
    name: "login",
    goalPattern: /login|sign\s*in|log\s*in|signin|authenticate|log\s*me\s*in/i,
    stages: [
      {
        id: "click_login",
        name: "Open Login Form",
        description: "Click the sign-in button to open the login form",
        isOnThisPage(state) {
          return state.loginButton !== null || state.pageType === "login";
        },
        getAction(state) {
          if (state.loginButton) {
            return {
              highlightTarget: { text: state.loginButton.text, role: "button", elementType: "button", confidence: 95 },
              instruction: `Click the **${state.loginButton.text}** button highlighted on your screen. It's usually in the top-right corner.`,
              details: [
                `The **${state.loginButton.text}** button will open a sign-in form where you can enter your credentials.`,
                `Once the form appears, I'll guide you through filling in your email and password.`,
                `After you sign in, I'll automatically detect the next page and continue guiding you.`
              ],
              summary: `You're on **${state.domain}** — click the sign-in button to get started.`
            };
          }
          const target = findTarget(state, /login|sign\s*in|log\s*in/i);
          if (target) {
            return {
              highlightTarget: { text: target.text, role: "button", elementType: target.elementType, confidence: target.confidence },
              instruction: `Click the **${target.text}** button highlighted on your screen.`,
              details: [
                `This will open the sign-in form where you can enter your email address and password.`,
                `After you sign in, I'll automatically continue guiding you.`
              ],
              summary: `You're on **${state.domain}** — let's sign you in.`
            };
          }
          return null;
        },
        isComplete(state, memory) {
          if (state.pageType === "login") return true;
          if (state.hasActiveDialog || state.hasActiveModal) return true;
          if (state.hasPasswordField && state.hasForm) return true;
          return hasUrlChanged(memory, state);
        }
      },
      {
        id: "fill_credentials",
        name: "Sign In",
        description: "Enter your email and password, then click sign in",
        isOnThisPage(state) {
          if (state.pageType === "login") return true;
          if (state.hasPasswordField && state.hasEmailField) return true;
          if (state.hasActiveDialog && (state.hasPasswordField || state.authInputs.length >= 2)) return true;
          return false;
        },
        getAction(state) {
          const pwField = state.authInputs.find((i) => i.type === "password");
          const emailField = state.authInputs.find((i) => i.type === "email" || /email|user|phone|mobile/i.test(i.label + " " + i.placeholder));
          const firstField = emailField || state.authInputs.find((i) => i.type !== "password") || state.authInputs[0];
          const details = [];
          if (firstField) {
            const label = firstField.placeholder || firstField.label || "Email or username";
            details.push(`Type your **${label}** in the first field.`);
          } else {
            details.push(`Enter your **email address or username** in the first input field.`);
          }
          if (pwField) {
            const label = pwField.placeholder || pwField.label || "Password";
            details.push(`Type your **${label}** in the password field.`);
          } else {
            details.push(`Type your **password** in the password field.`);
          }
          const signInBtn = findTarget(state, /sign\s*in|login|log\s*in|continue|submit/i);
          if (signInBtn) {
            details.push(`Click **${signInBtn.text}** to complete sign-in.`);
          } else if (state.submitButtonText) {
            details.push(`Click **${state.submitButtonText}** to complete sign-in.`);
          } else {
            details.push(`Click the **Sign In** button to complete sign-in.`);
          }
          details.push(`After signing in, I'll automatically detect the next page and continue guiding you.`);
          const highlightTarget = firstField ? { text: firstField.placeholder || firstField.label || "email", role: "textbox", elementType: "input", confidence: 85 } : null;
          return {
            highlightTarget,
            instruction: `Enter your credentials here on **${state.domain}**. Type your email address and password, then click **Sign In**. I'll automatically detect the next step once you're logged in.`,
            details,
            summary: `You're on the sign-in page for **${state.domain}** — enter your credentials to continue.`
          };
        },
        isComplete(state, _memory) {
          if (state.successMessages.length > 0) return true;
          if (state.pageType === "dashboard" || state.pageType === "landing") return true;
          return hasUrlChanged(_memory, state);
        }
      }
    ]
  };
  const signupWorkflow = {
    name: "signup",
    goalPattern: /register|sign\s*up|create\s*account/i,
    stages: [
      {
        id: "fill_signup_form",
        name: "Fill Registration Form",
        description: "Fill in the registration form fields",
        isOnThisPage(state) {
          return state.pageType === "signup" || state.signupButton !== null && state.hasForm;
        },
        getAction(state) {
          const details = [];
          const inputs = state.formInputs.filter((i) => i.type !== "hidden");
          for (const inp of inputs.slice(0, 5)) {
            const label = inp.placeholder || inp.label || inp.name || "field";
            if (inp.type === "password") {
              if (!details.some((d) => d.includes("password"))) details.push(`Choose a strong password and enter it in the **${label}** field.`);
            } else if (inp.type === "email") {
              details.push(`Enter your email address in the **${label}** field.`);
            } else if (!details.some((d) => d.includes(label))) {
              details.push(`Fill in **${label}**${inp.required ? " (required)" : ""}.`);
            }
          }
          const submitBtn = findTarget(state, /create|sign\s*up|register|submit|continue/i) || findTarget(state, /submit|continue|next/i);
          if (submitBtn) {
            details.push(`Finally, click **${submitBtn.text}** to create your account.`);
          } else if (state.submitButtonText) {
            details.push(`Finally, click **${state.submitButtonText}** to create your account.`);
          } else {
            details.push(`Finally, click the **Sign Up** button to create your account.`);
          }
          details.push(`After registration, I'll automatically continue guiding you.`);
          const firstInput = inputs[0];
          return {
            highlightTarget: firstInput ? { text: firstInput.placeholder || firstInput.label || "first field", role: "textbox", elementType: "input", confidence: 80 } : null,
            instruction: `Let's set up your account on **${state.domain}**. Fill in the required information below to create your account.`,
            details,
            summary: `You're on the registration page for **${state.domain}** — let's create your account.`
          };
        },
        isComplete(state, _memory) {
          if (state.successMessages.length > 0) return true;
          const urlChanged = hasUrlChanged(_memory, state);
          if (urlChanged) return true;
          return false;
        }
      }
    ]
  };
  const createIssueWorkflow = {
    name: "create_issue",
    goalPattern: /create\s+(a\s+)?(new\s+)?(issue|pull\s*request|pr)\b/i,
    stages: [
      {
        id: "open_repo",
        name: "Open Repository",
        description: "Navigate to the repository where you want to create the item",
        isOnThisPage(state) {
          return state.pageType === "dashboard" || state.pageType === "landing" || state.pageType === "unknown";
        },
        getAction(state) {
          const target = findTarget(state, /repo|project|repository/i);
          findTargetByType(state, "link");
          return {
            highlightTarget: target ? { text: target.text, role: "link", elementType: "link", confidence: target.confidence } : null,
            instruction: `To create an ${state.url.includes("github") ? "issue" : "item"}, you first need to open the repository or project where it belongs. Look for a repository in your list or use the search bar.`,
            details: [
              `${state.url.includes("github") ? "Issues and pull requests belong to individual repositories." : "Items belong to specific projects."}`,
              `Find and click on the **repository** or **project** where you want to create this.`,
              `Once you're inside, I'll guide you to the next step.`,
              `I'll automatically detect when you navigate to a repository and continue guiding you.`
            ],
            summary: `You're on **${state.domain}** — first, open the repository where the item belongs.`
          };
        },
        isComplete(state, _memory) {
          return state.pageType === "repo" || state.pageType === "issues_list" || state.pageType === "issue_form" || hasUrlChanged(_memory, state);
        }
      },
      {
        id: "open_issues_tab",
        name: "Open Issues Tab",
        description: "Click the Issues tab in the repository",
        isOnThisPage(state) {
          return state.pageType === "repo" || state.pageType === "unknown" && /\/[^/]+\/[^/]+/.test(state.url);
        },
        getAction(state) {
          const issuesTab = findTarget(state, /issues?/i);
          if (issuesTab) {
            return {
              highlightTarget: { text: issuesTab.text, role: "tab", elementType: "tab", confidence: issuesTab.confidence },
              instruction: `Now click the **${issuesTab.text}** tab in the repository navigation bar.`,
              details: [
                `The Issues tab shows all current and past issues for this repository.`,
                `Once on the issues page, I'll guide you to click **New Issue**.`
              ],
              summary: `You're in the **${state.domain}** repository — let's open the Issues tab.`
            };
          }
          return {
            highlightTarget: null,
            instruction: `Look for the **Issues** tab near the top of the repository page and click it.`,
            details: [
              `The Issues tab is usually in the navigation bar below the repository name.`,
              `Once you're there, I'll help you create a new issue.`
            ],
            summary: `You're in the repository — find and click the **Issues** tab.`
          };
        },
        isComplete(state, _memory) {
          return state.pageType === "issues_list" || state.pageType === "issue_form";
        }
      },
      {
        id: "click_new_issue",
        name: "Click New Issue",
        description: "Click the New Issue button",
        isOnThisPage(state) {
          return state.pageType === "issues_list" || state.pageType === "pull_requests";
        },
        getAction(state) {
          const target = findTarget(state, /new\s+(issue|pull\s*request)|create/i);
          if (target) {
            return {
              highlightTarget: { text: target.text, role: "button", elementType: "button", confidence: target.confidence },
              instruction: `Click the **${target.text}** button highlighted on your screen.`,
              details: [
                `This opens the form where you can write the title and description.`,
                `Fill in the details and submit to create the issue.`
              ],
              summary: `You're on the issues list — click **New Issue** to continue.`
            };
          }
          return {
            highlightTarget: null,
            instruction: `Click the **New Issue** button on this page.`,
            details: [
              `It's usually a green button near the top right of the issues list.`,
              `Fill in the form and submit to create your issue.`
            ],
            summary: `Look for the **New Issue** button on this page.`
          };
        },
        isComplete(state, _memory) {
          return state.pageType === "issue_form";
        }
      },
      {
        id: "fill_issue_form",
        name: "Fill Issue Form",
        description: "Write the issue title and description, then submit",
        isOnThisPage(state) {
          return state.pageType === "issue_form";
        },
        getAction(state) {
          const titleInput = state.formInputs.find((i) => /title|subject/i.test(i.placeholder || i.label || i.name));
          const bodyInput = state.formInputs.find((i) => /description|body|comment/i.test(i.placeholder || i.label || i.name));
          const details = [];
          if (titleInput) {
            details.push(`Write a clear, descriptive title in the **${titleInput.placeholder || titleInput.label || "title"}** field.`);
          } else {
            details.push(`Write a clear, descriptive **title** for your issue.`);
          }
          if (bodyInput) {
            details.push(`Add details in the **${bodyInput.placeholder || bodyInput.label || "description"}** field — explain the problem or feature request.`);
          } else {
            details.push(`Add **details** in the description field — explain what the issue is about.`);
          }
          details.push(`Click **Submit new issue** to create it.`);
          const firstField = titleInput || bodyInput || state.formInputs[0];
          return {
            highlightTarget: firstField ? { text: firstField.placeholder || firstField.label || "title", role: "textbox", elementType: "input", confidence: 85 } : null,
            instruction: `Now fill in the issue form. Give your issue a clear title and description, then submit it.`,
            details,
            summary: `You're on the new issue form — write your issue details here.`
          };
        },
        isComplete(state, _memory) {
          if (state.successMessages.length > 0) return true;
          if (state.pageType === "issues_list" || state.pageType === "repo" || state.pageType === "dashboard") return true;
          return false;
        }
      }
    ]
  };
  const searchWorkflow = {
    name: "search",
    goalPattern: /search|find|look\s*for|look\s*up|query/i,
    stages: [
      {
        id: "do_search",
        name: "Search",
        description: "Enter your search query",
        isOnThisPage(_state) {
          return true;
        },
        getAction(state) {
          const searchInput = state.availableTargets.find((t) => t.elementType === "input" && /search|find/i.test(t.text));
          if (searchInput) {
            return {
              highlightTarget: { text: searchInput.text, role: "textbox", elementType: "input", confidence: searchInput.confidence },
              instruction: `Type what you're looking for in the **${searchInput.text}** field, then press **Enter** or click the search button.`,
              details: [
                `Enter your search terms in the field highlighted on your screen.`,
                `Press Enter or click the search button to see results.`,
                `I'll help you navigate the results.`
              ],
              summary: `You're on **${state.domain}** — let's search for what you need.`
            };
          }
          const input = findTargetByType(state, "input");
          if (input) {
            return {
              highlightTarget: { text: input.text, role: "textbox", elementType: "input", confidence: input.confidence },
              instruction: `Type your search query here. I'll help you find what you need.`,
              details: [
                `Enter your search terms in the field highlighted on your screen.`,
                `Press Enter or click the search button.`
              ],
              summary: `You're on **${state.domain}** — let's search.`
            };
          }
          return null;
        },
        isComplete(state, _memory) {
          return state.pageType === "search_results" || hasUrlChanged(_memory, state);
        }
      }
    ]
  };
  const bookCheckoutWorkflow = {
    name: "checkout",
    goalPattern: /book|reserve|order|purchase|buy|checkout|pay|place\s*order/i,
    stages: [
      {
        id: "go_to_checkout",
        name: "Go to Checkout",
        description: "Navigate to the checkout or payment page",
        isOnThisPage(state) {
          return state.pageType !== "checkout" && state.pageType !== "checkout_review";
        },
        getAction(state) {
          const cartBtn = findTarget(state, /cart|checkout|buy|purchase|order/i);
          if (cartBtn) {
            return {
              highlightTarget: { text: cartBtn.text, role: "button", elementType: cartBtn.elementType, confidence: cartBtn.confidence },
              instruction: `Click the **${cartBtn.text}** button highlighted on your screen to start the checkout process.`,
              details: [
                `This will take you to the checkout or payment page.`,
                `I'll guide you through filling in the required details.`
              ],
              summary: `You're on **${state.domain}** — let's start your checkout.`
            };
          }
          return null;
        },
        isComplete(state, _memory) {
          return state.pageType === "checkout" || state.pageType === "checkout_review" || state.pageType === "cart";
        }
      },
      {
        id: "fill_checkout",
        name: "Complete Checkout",
        description: "Fill in checkout details and confirm",
        isOnThisPage(state) {
          return state.pageType === "checkout" || state.pageType === "checkout_review" || state.pageType === "cart";
        },
        getAction(state) {
          const details = [];
          const inputs = state.formInputs.filter((i) => i.type !== "hidden");
          for (const inp of inputs.slice(0, 5)) {
            const label = inp.placeholder || inp.label || inp.name || "field";
            if (!details.some((d) => d.includes(label))) {
              details.push(`Fill in **${label}**${inp.required ? " (required)" : ""}.`);
            }
          }
          const payBtn = findTarget(state, /pay|confirm|order|purchase|place\s*order|buy|submit/i);
          if (payBtn) {
            details.push(`Review your order, then click **${payBtn.text}** to complete.`);
          } else if (state.submitButtonText) {
            details.push(`Review your order, then click **${state.submitButtonText}** to complete.`);
          } else {
            details.push(`Review your order carefully, then click **Place Order** or **Pay Now** to complete.`);
          }
          details.push(`After your order is placed, I'll automatically confirm it for you.`);
          return {
            highlightTarget: null,
            instruction: `Let's complete your order on **${state.domain}**. Fill in the required information and confirm your purchase.`,
            details,
            summary: `You're on the checkout page for **${state.domain}** — let's complete your order.`
          };
        },
        isComplete(state, _memory) {
          if (state.successMessages.length > 0) return true;
          return false;
        }
      }
    ]
  };
  const settingsWorkflow = {
    name: "settings",
    goalPattern: /settings|profile|password|preferences|edit|update|change|modify/i,
    stages: [
      {
        id: "go_to_settings",
        name: "Open Settings",
        description: "Navigate to the settings or profile page",
        isOnThisPage(state) {
          return state.pageType !== "settings" && state.pageType !== "profile";
        },
        getAction(state) {
          const target = findTarget(state, /settings|profile|account|preferences/i);
          if (target) {
            return {
              highlightTarget: { text: target.text, role: "link", elementType: target.elementType, confidence: target.confidence },
              instruction: `Click the **${target.text}** option highlighted on your screen to open your settings.`,
              details: [
                `This will take you to your settings page where you can make changes.`,
                `From there, you can update your preferences, change your password, or modify your profile.`
              ],
              summary: `You're on **${state.domain}** — let's open your settings.`
            };
          }
          return null;
        },
        isComplete(state, _memory) {
          return state.pageType === "settings" || state.pageType === "profile";
        }
      },
      {
        id: "adjust_settings",
        name: "Update Settings",
        description: "Make the desired changes",
        isOnThisPage(state) {
          return state.pageType === "settings" || state.pageType === "profile";
        },
        getAction(state) {
          const inputs = state.formInputs.filter((i) => i.type !== "hidden");
          const details = inputs.slice(0, 5).map((inp) => {
            const label = inp.placeholder || inp.label || inp.name || "field";
            return `You can update **${label}** here.`;
          });
          if (details.length === 0) {
            details.push("Look for the setting you want to change on this page.");
          }
          const saveBtn = findTarget(state, /save|update|apply|change|submit/i) || (state.submitButtonText ? { text: state.submitButtonText } : null);
          if (saveBtn) {
            details.push(`Click **${saveBtn.text}** to save your changes.`);
          } else {
            details.push(`Look for a **Save** or **Update** button to apply your changes.`);
          }
          return {
            highlightTarget: null,
            instruction: `You can update your settings here on **${state.domain}**. Make the changes you need and save them.`,
            details,
            summary: `You're on the settings page for **${state.domain}** — make your changes here.`
          };
        },
        isComplete(state, _memory) {
          if (state.successMessages.length > 0) return true;
          return false;
        }
      }
    ]
  };
  const genericFormWorkflow = {
    name: "form",
    goalPattern: /create|make|new|add|upload|post|start|fill|submit|apply/i,
    stages: [
      {
        id: "fill_form",
        name: "Complete Form",
        description: "Fill in the form and submit",
        isOnThisPage(_state) {
          return true;
        },
        getAction(state) {
          const inputs = state.formInputs.filter((i) => i.type !== "hidden");
          const details = inputs.slice(0, 5).map((inp) => {
            const label = inp.placeholder || inp.label || inp.name || "field";
            if (inp.type === "password") return `Choose a **password** and enter it in the ${label} field.`;
            if (inp.type === "email") return `Enter your **email address** in the ${label} field.`;
            return `Fill in **${label}**${inp.required ? " (required)" : ""}.`;
          });
          if (details.length === 0) {
            details.push("Start filling in the fields on this form.");
          }
          const submitTarget = state.submitButtonText ? { text: state.submitButtonText } : findTarget(state, /submit|save|continue|next|done|finish|create|add/i);
          if (submitTarget) {
            details.push(`Click **${submitTarget.text}** to submit the form.`);
          } else {
            details.push(`Click the **Submit** button to complete the form.`);
          }
          details.push(`I'll automatically detect the next step once the form is submitted.`);
          const firstInput = inputs[0];
          return {
            highlightTarget: firstInput ? { text: firstInput.placeholder || firstInput.label || "first field", role: "textbox", elementType: "input", confidence: 75 } : null,
            instruction: `Let's complete this form on **${state.domain}**. Fill in the required details below.`,
            details,
            summary: `You're on a form on **${state.domain}** — fill in the details.`
          };
        },
        isComplete(state, _memory) {
          if (state.successMessages.length > 0) return true;
          return hasUrlChanged(_memory, state);
        }
      }
    ]
  };
  const allWorkflows = [
    loginWorkflow,
    signupWorkflow,
    createIssueWorkflow,
    searchWorkflow,
    bookCheckoutWorkflow,
    settingsWorkflow,
    genericFormWorkflow
  ];
  function planWorkflow(goal, state, memory) {
    const goalLower = goal.toLowerCase();
    for (const wf of allWorkflows) {
      if (!wf.goalPattern.test(goalLower)) continue;
      let foundCurrentStage = null;
      let foundStageIndex = -1;
      for (let i = 0; i < wf.stages.length; i++) {
        const stage = wf.stages[i];
        const stageCompleted = memory.completedStageIds.includes(stage.id);
        if (stage.isOnThisPage(state)) {
          foundCurrentStage = stage;
          foundStageIndex = i;
          if (stageCompleted) {
            if (stage.isComplete(state, memory)) {
              continue;
            }
            break;
          }
          if (!stage.isComplete(state, memory)) {
            break;
          }
          if (stage.isComplete(state, memory)) {
            if (i + 1 < wf.stages.length) {
              foundCurrentStage = wf.stages[i + 1];
              foundStageIndex = i + 1;
            }
            break;
          }
        }
      }
      if (foundCurrentStage) {
        const completed = foundStageIndex >= wf.stages.length - 1 && foundCurrentStage.isComplete(state, memory);
        const action = foundCurrentStage.getAction(state);
        if (!action) {
          const stageCompleted = foundCurrentStage.isComplete(state, memory);
          if (stageCompleted && foundStageIndex < wf.stages.length - 1) {
            const nextStage = wf.stages[foundStageIndex + 1];
            const nextAction = nextStage.getAction(state);
            if (nextAction) {
              return {
                workflow: wf,
                currentStage: nextStage,
                action: nextAction,
                completed: false,
                confidence: 75
              };
            }
          }
          return null;
        }
        return {
          workflow: wf,
          currentStage: foundCurrentStage,
          action,
          completed,
          confidence: completed ? 95 : action.highlightTarget ? 85 : 70
        };
      }
    }
    return null;
  }
  const memoryStore = /* @__PURE__ */ new Map();
  function getMemoryKey(goal, url) {
    try {
      return `${goal}::${new URL(url).hostname}`;
    } catch {
      return `${goal}::unknown`;
    }
  }
  function getOrCreateMemory(goal, url) {
    const key = getMemoryKey(goal, url);
    let mem = memoryStore.get(key);
    if (!mem) {
      let domain = "";
      try {
        domain = new URL(url).hostname;
      } catch {
        domain = "unknown";
      }
      mem = {
        goal,
        website: domain,
        currentStageId: "",
        completedStageIds: [],
        previousUrl: url,
        expectedNextAction: "",
        lastHighlightSent: null,
        lastHighlightConfirmed: false,
        lastError: null,
        lastSuccess: null
      };
      memoryStore.set(key, mem);
    } else if (url !== mem.previousUrl) {
      mem.previousUrl = url;
    }
    return mem;
  }
  function analyzePageForGoal(goal, page) {
    const memory = getOrCreateMemory(goal, page.url);
    const state = buildPageState(goal, page);
    const domain = state.domain.replace(/^www\./, "");
    const hasErrors = state.visibleErrors.length > 0;
    const hasSuccess = state.successMessages.length > 0;
    if (hasSuccess) {
      const successText = state.successMessages[0];
      if (!memory.completedStageIds.includes(memory.currentStageId) && memory.currentStageId) {
        memory.completedStageIds.push(memory.currentStageId);
      }
      memory.lastSuccess = successText;
      memory.lastError = null;
      return {
        pageSummary: `You're on **${state.title || domain}** — ${successText}`,
        currentStage: "Complete",
        instruction: `✅ ${successText}`,
        details: ["All steps have been completed successfully. Let me know if you need help with anything else."],
        highlightTarget: null,
        highlightConfirmed: false,
        expectedNextPage: page.url,
        successMessage: successText,
        completed: true,
        confidence: 98
      };
    }
    if (hasErrors) {
      const errorText = state.visibleErrors[0];
      memory.lastError = errorText;
      memory.lastSuccess = null;
      const isAuthGoal = /login|sign\s*in|log\s*in|authenticate/i.test(goal);
      let recoveryHint = "Please correct the issue and try again.";
      let highlightTarget = null;
      if (/incorrect|invalid|wrong|mismatch|not\s+found/i.test(errorText)) {
        if (isAuthGoal) {
          if (/password/i.test(errorText)) {
            recoveryHint = 'Check that Caps Lock is off and your password is correct. If you have forgotten your password, look for a "Forgot Password" link.';
            const pwField = state.authInputs.find((i) => i.type === "password");
            if (pwField) {
              highlightTarget = { text: pwField.placeholder || pwField.label || "password field", role: "textbox", elementType: "input", confidence: 85 };
            }
          } else if (/username|email/i.test(errorText)) {
            recoveryHint = "Double-check your email or username. Make sure you are using the account you registered with.";
            const emailField = state.authInputs.find((i) => i.type === "email" || /email|user/i.test(i.label + " " + i.placeholder));
            if (emailField) {
              highlightTarget = { text: emailField.placeholder || emailField.label || "email field", role: "textbox", elementType: "input", confidence: 85 };
            }
          } else {
            recoveryHint = "Please verify your credentials and try signing in again.";
          }
        }
      } else if (/required/i.test(errorText)) {
        recoveryHint = "Some required fields are missing. Please fill them in before continuing.";
      } else if (/already\s+exists|taken/i.test(errorText)) {
        recoveryHint = "That choice is already taken. Try something different.";
      }
      return {
        pageSummary: `You're on **${domain}** — the form returned an error`,
        currentStage: memory.currentStageId || "Form",
        instruction: `**${errorText}** — ${recoveryHint} I will continue automatically once you correct it.`,
        details: [
          `The form returned: "${errorText}"`,
          recoveryHint,
          "I will automatically detect when the issue is resolved and continue guiding you."
        ],
        highlightTarget,
        highlightConfirmed: false,
        expectedNextPage: page.url,
        successMessage: "",
        completed: false,
        confidence: highlightTarget ? 70 : 45
      };
    }
    memory.lastError = null;
    const plan = planWorkflow(goal, state, memory);
    if (!plan) {
      const target = state.availableTargets[0] || null;
      return {
        pageSummary: `You're on **${state.title || domain}** — I can see the page but I am not sure about the next step.`,
        currentStage: "Explore",
        instruction: target ? `I found **${target.text}** on this page. Try clicking it to move forward.` : `I am analyzing this page. Try navigating to where you want to go on **${domain}**.`,
        details: target ? [`Click **${target.text}** highlighted on your screen.`] : ["Try using the navigation menu or type a more specific request."],
        highlightTarget: target ? { text: target.text, role: target.elementType === "link" ? "link" : "button", elementType: target.elementType, confidence: target.confidence } : null,
        highlightConfirmed: false,
        expectedNextPage: page.url,
        successMessage: "",
        completed: false,
        confidence: (target == null ? void 0 : target.confidence) || 30
      };
    }
    memory.currentStageId = plan.currentStage.id;
    if (plan.completed && !memory.completedStageIds.includes(plan.currentStage.id)) {
      memory.completedStageIds.push(plan.currentStage.id);
    }
    return {
      pageSummary: plan.action.summary,
      currentStage: plan.currentStage.name,
      instruction: plan.action.instruction,
      details: plan.action.details,
      highlightTarget: plan.action.highlightTarget,
      highlightConfirmed: false,
      expectedNextPage: page.url,
      successMessage: plan.completed ? `Task complete! ${plan.currentStage.name} finished.` : "",
      completed: plan.completed,
      confidence: plan.completed ? 95 : plan.confidence
    };
  }
  function resetTaskMemory(goal, url) {
    const key = getMemoryKey(goal, url);
    memoryStore.delete(key);
  }
  function getCompletedSteps(goal, url) {
    const key = getMemoryKey(goal, url);
    const mem = memoryStore.get(key);
    if (!mem) return [];
    return [
      ...mem.completedStageIds.map((id) => ({ instruction: `Stage: ${id}`, completed: true }))
    ];
  }
  function confirmHighlight(goal, url, success) {
    const mem = memoryStore.get(getMemoryKey(goal, url));
    if (mem) {
      mem.lastHighlightConfirmed = success;
    }
  }
  const readyTabs = /* @__PURE__ */ new Set();
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const definition = defineBackground({
    main() {
      browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {
        browser.action.onClicked.addListener(async (tab) => {
          await browser.sidePanel.open({ tabId: tab.id });
        });
      });
      const state = {
        mode: null,
        active: false,
        currentSteps: [],
        currentStepIndex: 0,
        currentTabId: null
      };
      async function sendToContent(tabId, message) {
        try {
          return await browser.tabs.sendMessage(tabId, message);
        } catch (err) {
          console.warn(`[WebGuider] sendToContent failed for tab ${tabId}:`, err);
          return null;
        }
      }
      async function injectContentScript(tabId) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId },
            files: ["content-scripts/content.js"]
          });
          console.log(`[WebGuider] Content script injected into tab ${tabId}`);
          await sleep(300);
          return true;
        } catch (err) {
          console.warn(`[WebGuider] Failed to inject content script into tab ${tabId}:`, err);
          return false;
        }
      }
      async function analyzeCurrentTab(tabId) {
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const result = await browser.tabs.sendMessage(tabId, { type: "ANALYZE_PAGE" });
            if (result) {
              readyTabs.add(tabId);
            }
            return result;
          } catch (err) {
            console.warn(`[WebGuider] analyzeCurrentTab attempt ${attempt + 1}/3 failed for tab ${tabId}:`, err);
            if (attempt === 0) {
              const injected = await injectContentScript(tabId);
              if (injected) {
                await sleep(500);
                continue;
              }
            }
            if (attempt < 2) {
              await sleep(500);
            }
          }
        }
        return null;
      }
      browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        var _a2, _b, _c;
        switch (message.type) {
          case "CONTENT_SCRIPT_READY": {
            const tabId = (_a2 = sender.tab) == null ? void 0 : _a2.id;
            if (tabId) {
              readyTabs.add(tabId);
              console.log(`[WebGuider] Content script ready in tab ${tabId}`);
            }
            sendResponse({ received: true });
            break;
          }
          case "EXPLORE_ANALYZE": {
            (async () => {
              var _a3;
              try {
                const tabs = await browser.tabs.query({ active: true, currentWindow: true });
                const tabId = (_a3 = tabs[0]) == null ? void 0 : _a3.id;
                if (!tabId) {
                  sendResponse({ error: "No active tab", completed: false, confidence: 0, nextInstruction: "Unable to inspect current webpage. No active tab found." });
                  return;
                }
                console.log(`[WebGuider] EXPLORE_ANALYZE for tab ${tabId}, goal:`, message.goal);
                const pageData = await analyzeCurrentTab(tabId);
                if (!pageData) {
                  sendResponse({ error: "Cannot access page", completed: false, confidence: 0, nextInstruction: "Unable to inspect current webpage. Content script is not responding. Try reloading the page or navigating to a different URL." });
                  return;
                }
                if (pageData.error) {
                  sendResponse({ error: pageData.error, completed: false, confidence: 0, nextInstruction: "The page analysis encountered an error. Please try again." });
                  return;
                }
                const result = analyzePageForGoal(message.goal, pageData);
                sendResponse(result);
              } catch (err) {
                console.error("[WebGuider] EXPLORE_ANALYZE error:", err);
                sendResponse({ error: String(err), completed: false, confidence: 0, nextInstruction: "An unexpected error occurred. Please try again." });
              }
            })();
            return true;
          }
          case "EXPLORE_RESET": {
            (async () => {
              var _a3;
              try {
                const tabs = await browser.tabs.query({ active: true, currentWindow: true });
                if ((_a3 = tabs[0]) == null ? void 0 : _a3.url) {
                  resetTaskMemory(message.goal, tabs[0].url);
                }
              } catch (err) {
                console.warn("[WebGuider] EXPLORE_RESET error:", err);
              }
              sendResponse({ success: true });
            })();
            return true;
          }
          case "EXPLORE_GET_PROGRESS": {
            (async () => {
              var _a3;
              try {
                const tabs = await browser.tabs.query({ active: true, currentWindow: true });
                if ((_a3 = tabs[0]) == null ? void 0 : _a3.url) {
                  const steps = getCompletedSteps(message.goal, tabs[0].url);
                  sendResponse({ steps });
                } else {
                  sendResponse({ steps: [] });
                }
              } catch (err) {
                console.warn("[WebGuider] EXPLORE_GET_PROGRESS error:", err);
                sendResponse({ steps: [] });
              }
            })();
            return true;
          }
          case "PAGE_CHANGED": {
            sendResponse({ received: true });
            break;
          }
          case "URL_CHANGED": {
            const tabId = (_b = sender.tab) == null ? void 0 : _b.id;
            if (tabId) readyTabs.delete(tabId);
            sendResponse({ received: true });
            break;
          }
          case "GET_PAGE_INFO": {
            (async () => {
              var _a3;
              const tabId = ((_a3 = sender.tab) == null ? void 0 : _a3.id) || state.currentTabId;
              if (!tabId) {
                sendResponse({ url: "", title: "", domain: "" });
                return;
              }
              const result = await sendToContent(tabId, { type: "GET_PAGE_INFO" });
              sendResponse(result || { url: "", title: "", domain: "" });
            })();
            return true;
          }
          case "CONFIRM_HIGHLIGHT": {
            (async () => {
              var _a3;
              try {
                const tabs = await browser.tabs.query({ active: true, currentWindow: true });
                if ((_a3 = tabs[0]) == null ? void 0 : _a3.url) {
                  confirmHighlight(message.goal, tabs[0].url, message.success);
                }
              } catch (err) {
                console.warn("[WebGuider] CONFIRM_HIGHLIGHT error:", err);
              }
              sendResponse({ received: true });
            })();
            return true;
          }
          case "START_GUIDE": {
            state.mode = "explore";
            state.active = true;
            state.currentSteps = message.steps;
            state.currentStepIndex = 0;
            state.currentTabId = ((_c = sender.tab) == null ? void 0 : _c.id) || null;
            if (state.currentTabId) {
              sendToContent(state.currentTabId, {
                type: "START_GUIDE",
                steps: state.currentSteps
              });
            }
            sendResponse({ success: true });
            break;
          }
          case "STEP_NEXT": {
            if (state.currentStepIndex < state.currentSteps.length - 1) {
              state.currentStepIndex++;
              if (state.currentTabId) {
                sendToContent(state.currentTabId, {
                  type: "HIGHLIGHT_STEP",
                  step: state.currentSteps[state.currentStepIndex]
                });
              }
            } else {
              state.active = false;
              if (state.currentTabId) {
                sendToContent(state.currentTabId, { type: "STOP_GUIDE" });
              }
            }
            sendResponse({ success: true, completed: !state.active });
            break;
          }
          case "STEP_PREV": {
            if (state.currentStepIndex > 0) {
              state.currentStepIndex--;
              if (state.currentTabId) {
                sendToContent(state.currentTabId, {
                  type: "HIGHLIGHT_STEP",
                  step: state.currentSteps[state.currentStepIndex]
                });
              }
            }
            sendResponse({ success: true });
            break;
          }
          case "STOP_GUIDE": {
            state.active = false;
            state.currentSteps = [];
            state.currentStepIndex = 0;
            if (state.currentTabId) {
              sendToContent(state.currentTabId, { type: "STOP_GUIDE" });
            }
            sendResponse({ success: true });
            break;
          }
          case "GET_STATE": {
            sendResponse(state);
            break;
          }
          case "SEND_NOTIFICATION": {
            browser.notifications.create({
              type: "basic",
              iconUrl: "/icons/icon-48.png",
              title: "Web-Guider",
              message: message.text
            });
            sendResponse({ success: true });
            break;
          }
          case "HIGHLIGHT_SELECTOR": {
            (async () => {
              var _a3;
              const tabId = ((_a3 = sender.tab) == null ? void 0 : _a3.id) || state.currentTabId;
              if (tabId) {
                await sendToContent(tabId, { type: "HIGHLIGHT_SELECTOR", selector: message.selector });
              }
              sendResponse({ success: true });
            })();
            return true;
          }
          default:
            sendResponse({ error: "Unknown message type: " + message.type });
        }
        return true;
      });
      browser.runtime.onInstalled.addListener((details) => {
        if (details.reason === "install") {
          browser.storage.local.set({
            installed: true,
            installDate: Date.now(),
            preferences: {
              theme: "system",
              model: "gpt-4",
              voiceEnabled: false,
              autoProgress: true
            }
          });
        }
      });
      browser.tabs.onActivated.addListener((activeInfo) => {
        state.currentTabId = activeInfo.tabId;
      });
    }
  });
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  var logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  function setupWebSocket(onMessage) {
    const serverUrl = `${"ws:"}//${"localhost"}:${3e3}`;
    logger.debug("Connecting to dev server @", serverUrl);
    const ws = new WebSocket(serverUrl, "vite-hmr");
    ws.addEventListener("open", () => {
      logger.debug("Connected to dev server");
    });
    ws.addEventListener("close", () => {
      logger.debug("Disconnected from dev server");
    });
    ws.addEventListener("error", (event) => {
      logger.error("Failed to connect to dev server", event);
    });
    ws.addEventListener("message", (e) => {
      var _a2, _b;
      try {
        const message = JSON.parse(e.data);
        if (message.type === "custom" && ((_b = (_a2 = message.event) == null ? void 0 : _a2.startsWith) == null ? void 0 : _b.call(_a2, "wxt:"))) {
          onMessage == null ? void 0 : onMessage(message);
        }
      } catch (err) {
        logger.error("Failed to handle message", err);
      }
    });
    return ws;
  }
  function keepServiceWorkerAlive() {
    setInterval(async () => {
      await browser.runtime.getPlatformInfo();
    }, 5e3);
  }
  function reloadContentScript(payload) {
    const manifest = browser.runtime.getManifest();
    if (manifest.manifest_version == 2) {
      void reloadContentScriptMv2();
    } else {
      void reloadContentScriptMv3(payload);
    }
  }
  async function reloadContentScriptMv3({
    registration,
    contentScript
  }) {
    if (registration === "runtime") {
      await reloadRuntimeContentScriptMv3(contentScript);
    } else {
      await reloadManifestContentScriptMv3(contentScript);
    }
  }
  async function reloadManifestContentScriptMv3(contentScript) {
    const id = `wxt:${contentScript.js[0]}`;
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const existing = registered.find((cs) => cs.id === id);
    if (existing) {
      logger.debug("Updating content script", existing);
      await browser.scripting.updateContentScripts([{ ...contentScript, id }]);
    } else {
      logger.debug("Registering new content script...");
      await browser.scripting.registerContentScripts([{ ...contentScript, id }]);
    }
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadRuntimeContentScriptMv3(contentScript) {
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const matches = registered.filter((cs) => {
      var _a2, _b;
      const hasJs = (_a2 = contentScript.js) == null ? void 0 : _a2.find((js) => {
        var _a3;
        return (_a3 = cs.js) == null ? void 0 : _a3.includes(js);
      });
      const hasCss = (_b = contentScript.css) == null ? void 0 : _b.find((css) => {
        var _a3;
        return (_a3 = cs.css) == null ? void 0 : _a3.includes(css);
      });
      return hasJs || hasCss;
    });
    if (matches.length === 0) {
      logger.log(
        "Content script is not registered yet, nothing to reload",
        contentScript
      );
      return;
    }
    await browser.scripting.updateContentScripts(matches);
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadTabsForContentScript(contentScript) {
    const allTabs = await browser.tabs.query({});
    const matchPatterns = contentScript.matches.map(
      (match) => new MatchPattern(match)
    );
    const matchingTabs = allTabs.filter((tab) => {
      const url = tab.url;
      if (!url)
        return false;
      return !!matchPatterns.find((pattern) => pattern.includes(url));
    });
    await Promise.all(matchingTabs.map((tab) => browser.tabs.reload(tab.id)));
  }
  async function reloadContentScriptMv2(_payload) {
    throw Error("TODO: reloadContentScriptMv2");
  }
  {
    try {
      const ws = setupWebSocket((message) => {
        if (message.event === "wxt:reload-extension")
          browser.runtime.reload();
        if (message.event === "wxt:reload-content-script" && message.data != null)
          reloadContentScript(message.data);
      });
      if (true) {
        ws.addEventListener("open", () => {
          const msg = { type: "custom", event: "wxt:background-initialized" };
          ws.send(JSON.stringify(msg));
        });
        keepServiceWorkerAlive();
      }
    } catch (err) {
      logger.error("Failed to setup web socket connection with dev server", err);
    }
    browser.commands.onCommand.addListener((command) => {
      if (command === "wxt:reload-extension") {
        browser.runtime.reload();
      }
    });
  }
  try {
    const res = definition.main();
    if (res instanceof Promise) {
      console.warn(
        "The background's main() function return a promise, but it must be synchronous"
      );
    }
  } catch (err) {
    logger.error("The background crashed on startup!");
    throw err;
  }
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9saWIvaW5kZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3guanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsL2Rpc3QvYnJvd3Nlci1wb2x5ZmlsbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9jaHVuay1GTlRFMkwyNy5qcyIsIi4uLy4uL3NyYy9saWIvc3RhdGVFbmdpbmUudHMiLCIuLi8uLi9zcmMvbGliL3dvcmtmbG93UGxhbm5lci50cyIsIi4uLy4uL3NyYy9saWIvZXhwbG9yZXJFbmdpbmUudHMiLCIuLi8uLi9zcmMvZW50cnlwb2ludHMvYmFja2dyb3VuZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL2luZGV4LnRzXG4vKipcbiogQ2xhc3MgZm9yIHBhcnNpbmcgYW5kIHBlcmZvcm1pbmcgb3BlcmF0aW9ucyBvbiBtYXRjaCBwYXR0ZXJucy5cbipcbiogQGV4YW1wbGVcbiogICBjb25zdCBwYXR0ZXJuID0gbmV3IE1hdGNoUGF0dGVybignKjovL2dvb2dsZS5jb20vKicpO1xuKlxuKiAgIHBhdHRlcm4uaW5jbHVkZXMoJ2h0dHBzOi8vZ29vZ2xlLmNvbScpOyAvLyB0cnVlXG4qICAgcGF0dGVybi5pbmNsdWRlcygnaHR0cDovL3lvdXR1YmUuY29tL3dhdGNoP3Y9MTIzJyk7IC8vIGZhbHNlXG4qL1xudmFyIE1hdGNoUGF0dGVybiA9IGNsYXNzIE1hdGNoUGF0dGVybiB7XG5cdHN0YXRpYyB7XG5cdFx0dGhpcy5QUk9UT0NPTFMgPSBbXG5cdFx0XHRcImh0dHBcIixcblx0XHRcdFwiaHR0cHNcIixcblx0XHRcdFwiZmlsZVwiLFxuXHRcdFx0XCJmdHBcIixcblx0XHRcdFwidXJuXCIsXG5cdFx0XHRcIndzXCIsXG5cdFx0XHRcIndzc1wiXG5cdFx0XTtcblx0fVxuXHQvKipcblx0KiBQYXJzZSBhIG1hdGNoIHBhdHRlcm4gc3RyaW5nLiBJZiBpdCBpcyBpbnZhbGlkLCB0aGUgY29uc3RydWN0b3Igd2lsbCB0aHJvdyBhblxuXHQqIGBJbnZhbGlkTWF0Y2hQYXR0ZXJuYCBlcnJvci5cblx0KlxuXHQqIEBwYXJhbSBtYXRjaFBhdHRlcm4gVGhlIG1hdGNoIHBhdHRlcm4gdG8gcGFyc2UuXG5cdCovXG5cdGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybikge1xuXHRcdGlmIChtYXRjaFBhdHRlcm4gPT09IFwiPGFsbF91cmxzPlwiKSB7XG5cdFx0XHR0aGlzLmlzQWxsVXJscyA9IHRydWU7XG5cdFx0XHR0aGlzLnByb3RvY29sTWF0Y2hlcyA9IFsuLi5NYXRjaFBhdHRlcm4uUFJPVE9DT0xTXTtcblx0XHRcdHRoaXMuaG9zdG5hbWVNYXRjaCA9IFwiKlwiO1xuXHRcdFx0dGhpcy5wYXRobmFtZU1hdGNoID0gXCIqXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGdyb3VwcyA9IC8oLiopOlxcL1xcLyguKj8pKFxcLy4qKS8uZXhlYyhtYXRjaFBhdHRlcm4pO1xuXHRcdFx0aWYgKGdyb3VwcyA9PSBudWxsKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIFwiSW5jb3JyZWN0IGZvcm1hdFwiKTtcblx0XHRcdGNvbnN0IFtfLCBwcm90b2NvbCwgaG9zdG5hbWUsIHBhdGhuYW1lXSA9IGdyb3Vwcztcblx0XHRcdHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCk7XG5cdFx0XHR2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpO1xuXHRcdFx0dGhpcy5wcm90b2NvbE1hdGNoZXMgPSBwcm90b2NvbCA9PT0gXCIqXCIgPyBbXCJodHRwXCIsIFwiaHR0cHNcIl0gOiBbcHJvdG9jb2xdO1xuXHRcdFx0dGhpcy5ob3N0bmFtZU1hdGNoID0gaG9zdG5hbWU7XG5cdFx0XHR0aGlzLnBhdGhuYW1lTWF0Y2ggPSBwYXRobmFtZTtcblx0XHR9XG5cdH1cblx0LyoqIENoZWNrIGlmIGEgVVJMIGlzIGluY2x1ZGVkIGluIGEgcGF0dGVybi4gKi9cblx0aW5jbHVkZXModXJsKSB7XG5cdFx0Y29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmwgaW5zdGFuY2VvZiBMb2NhdGlvbiA/IG5ldyBVUkwodXJsLmhyZWYpIDogdXJsO1xuXHRcdGlmICh0aGlzLmlzQWxsVXJscykgcmV0dXJuICF0aGlzLmlzVW5rbm93blByb3RvY29sKHUpO1xuXHRcdHJldHVybiAhIXRoaXMucHJvdG9jb2xNYXRjaGVzLmZpbmQoKHByb3RvY29sKSA9PiB7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiaHR0cFwiKSByZXR1cm4gdGhpcy5pc0h0dHBNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJodHRwc1wiKSByZXR1cm4gdGhpcy5pc0h0dHBzTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiZmlsZVwiKSByZXR1cm4gdGhpcy5pc0ZpbGVNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJmdHBcIikgcmV0dXJuIHRoaXMuaXNGdHBNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJ1cm5cIikgcmV0dXJuIHRoaXMuaXNVcm5NYXRjaCh1KTtcblx0XHR9KTtcblx0fVxuXHRpc0h0dHBNYXRjaCh1cmwpIHtcblx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImh0dHA6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcblx0fVxuXHRpc0h0dHBzTWF0Y2godXJsKSB7XG5cdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwczpcIiAmJiB0aGlzLmlzSG9zdFBhdGhNYXRjaCh1cmwpO1xuXHR9XG5cdGlzSG9zdFBhdGhNYXRjaCh1cmwpIHtcblx0XHRpZiAoIXRoaXMuaG9zdG5hbWVNYXRjaCB8fCAhdGhpcy5wYXRobmFtZU1hdGNoKSByZXR1cm4gZmFsc2U7XG5cdFx0Y29uc3QgaG9zdG5hbWVNYXRjaFJlZ2V4cyA9IFt0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gpLCB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gucmVwbGFjZSgvXlxcKlxcLi8sIFwiXCIpKV07XG5cdFx0Y29uc3QgcGF0aG5hbWVNYXRjaFJlZ2V4ID0gdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5wYXRobmFtZU1hdGNoKTtcblx0XHRyZXR1cm4gISFob3N0bmFtZU1hdGNoUmVnZXhzLmZpbmQoKHJlZ2V4KSA9PiByZWdleC50ZXN0KHVybC5ob3N0bmFtZSkpICYmIHBhdGhuYW1lTWF0Y2hSZWdleC50ZXN0KHVybC5wYXRobmFtZSk7XG5cdH1cblx0aXNVbmtub3duUHJvdG9jb2wodXJsKSB7XG5cdFx0cmV0dXJuICF0aGlzLnByb3RvY29sTWF0Y2hlcy5pbmNsdWRlcyh1cmwucHJvdG9jb2wuc2xpY2UoMCwgLTEpKTtcblx0fVxuXHRpc1BhdGhNYXRjaCh1cmwpIHtcblx0XHRpZiAoIXRoaXMucGF0aG5hbWVNYXRjaCkgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLnBhdGhuYW1lTWF0Y2gpLnRlc3QodXJsLnBhdGhuYW1lKTtcblx0fVxuXHRpc0ZpbGVNYXRjaCh1cmwpIHtcblx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImZpbGU6XCIgJiYgdGhpcy5pc1BhdGhNYXRjaCh1cmwpO1xuXHR9XG5cdGlzRnRwTWF0Y2goX3VybCkge1xuXHRcdHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiBmdHA6Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuXHR9XG5cdGlzVXJuTWF0Y2goX3VybCkge1xuXHRcdHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiB1cm46Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuXHR9XG5cdGNvbnZlcnRQYXR0ZXJuVG9SZWdleChwYXR0ZXJuKSB7XG5cdFx0Y29uc3Qgc3RhcnNSZXBsYWNlZCA9IHRoaXMuZXNjYXBlRm9yUmVnZXgocGF0dGVybikucmVwbGFjZSgvXFxcXFxcKi9nLCBcIi4qXCIpO1xuXHRcdHJldHVybiBSZWdFeHAoYF4ke3N0YXJzUmVwbGFjZWR9JGApO1xuXHR9XG5cdGVzY2FwZUZvclJlZ2V4KHN0cmluZykge1xuXHRcdHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuXHR9XG59O1xudmFyIEludmFsaWRNYXRjaFBhdHRlcm4gPSBjbGFzcyBleHRlbmRzIEVycm9yIHtcblx0Y29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuLCByZWFzb24pIHtcblx0XHRzdXBlcihgSW52YWxpZCBtYXRjaCBwYXR0ZXJuIFwiJHttYXRjaFBhdHRlcm59XCI6ICR7cmVhc29ufWApO1xuXHR9XG59O1xuZnVuY3Rpb24gdmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKSB7XG5cdGlmICghTWF0Y2hQYXR0ZXJuLlBST1RPQ09MUy5pbmNsdWRlcyhwcm90b2NvbCkgJiYgcHJvdG9jb2wgIT09IFwiKlwiKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGAke3Byb3RvY29sfSBub3QgYSB2YWxpZCBwcm90b2NvbCAoJHtNYXRjaFBhdHRlcm4uUFJPVE9DT0xTLmpvaW4oXCIsIFwiKX0pYCk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpIHtcblx0aWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiOlwiKSkgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBgSG9zdG5hbWUgY2Fubm90IGluY2x1ZGUgYSBwb3J0YCk7XG5cdGlmIChob3N0bmFtZS5pbmNsdWRlcyhcIipcIikgJiYgaG9zdG5hbWUubGVuZ3RoID4gMSAmJiAhaG9zdG5hbWUuc3RhcnRzV2l0aChcIiouXCIpKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGBJZiB1c2luZyBhIHdpbGRjYXJkICgqKSwgaXQgbXVzdCBnbyBhdCB0aGUgc3RhcnQgb2YgdGhlIGhvc3RuYW1lYCk7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IEludmFsaWRNYXRjaFBhdHRlcm4sIE1hdGNoUGF0dGVybiB9O1xuIiwiLy8gc3JjL3NhbmRib3gvZGVmaW5lLXVubGlzdGVkLXNjcmlwdC50c1xuZnVuY3Rpb24gZGVmaW5lVW5saXN0ZWRTY3JpcHQoYXJnKSB7XG4gIGlmICh0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpXG4gICAgcmV0dXJuIHsgbWFpbjogYXJnIH07XG4gIHJldHVybiBhcmc7XG59XG5cbi8vIHNyYy9zYW5kYm94L2RlZmluZS1iYWNrZ3JvdW5kLnRzXG5mdW5jdGlvbiBkZWZpbmVCYWNrZ3JvdW5kKGFyZykge1xuICBpZiAodHlwZW9mIGFyZyA9PT0gXCJmdW5jdGlvblwiKVxuICAgIHJldHVybiB7IG1haW46IGFyZyB9O1xuICByZXR1cm4gYXJnO1xufVxuXG4vLyBzcmMvc2FuZGJveC9kZWZpbmUtY29udGVudC1zY3JpcHQudHNcbmZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cblxuLy8gc3JjL3NhbmRib3gvaW5kZXgudHNcbmV4cG9ydCAqIGZyb20gXCJAd2ViZXh0LWNvcmUvbWF0Y2gtcGF0dGVybnNcIjtcbmV4cG9ydCB7XG4gIGRlZmluZUJhY2tncm91bmQsXG4gIGRlZmluZUNvbnRlbnRTY3JpcHQsXG4gIGRlZmluZVVubGlzdGVkU2NyaXB0XG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCIsIFtcIm1vZHVsZVwiXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBmYWN0b3J5KG1vZHVsZSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1vZCA9IHtcbiAgICAgIGV4cG9ydHM6IHt9XG4gICAgfTtcbiAgICBmYWN0b3J5KG1vZCk7XG4gICAgZ2xvYmFsLmJyb3dzZXIgPSBtb2QuZXhwb3J0cztcbiAgfVxufSkodHlwZW9mIGdsb2JhbFRoaXMgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxUaGlzIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24gKG1vZHVsZSkge1xuICAvKiB3ZWJleHRlbnNpb24tcG9seWZpbGwgLSB2MC4xMC4wIC0gRnJpIEF1ZyAxMiAyMDIyIDE5OjQyOjQ0ICovXG5cbiAgLyogLSotIE1vZGU6IGluZGVudC10YWJzLW1vZGU6IG5pbDsganMtaW5kZW50LWxldmVsOiAyIC0qLSAqL1xuXG4gIC8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG5cbiAgLyogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICAgKiBMaWNlbnNlLCB2LiAyLjAuIElmIGEgY29weSBvZiB0aGUgTVBMIHdhcyBub3QgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzXG4gICAqIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uICovXG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGlmICghZ2xvYmFsVGhpcy5jaHJvbWU/LnJ1bnRpbWU/LmlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzLmJyb3dzZXIgPT09IFwidW5kZWZpbmVkXCIgfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbFRoaXMuYnJvd3NlcikgIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjsgLy8gV3JhcHBpbmcgdGhlIGJ1bGsgb2YgdGhpcyBwb2x5ZmlsbCBpbiBhIG9uZS10aW1lLXVzZSBmdW5jdGlvbiBpcyBhIG1pbm9yXG4gICAgLy8gb3B0aW1pemF0aW9uIGZvciBGaXJlZm94LiBTaW5jZSBTcGlkZXJtb25rZXkgZG9lcyBub3QgZnVsbHkgcGFyc2UgdGhlXG4gICAgLy8gY29udGVudHMgb2YgYSBmdW5jdGlvbiB1bnRpbCB0aGUgZmlyc3QgdGltZSBpdCdzIGNhbGxlZCwgYW5kIHNpbmNlIGl0IHdpbGxcbiAgICAvLyBuZXZlciBhY3R1YWxseSBuZWVkIHRvIGJlIGNhbGxlZCwgdGhpcyBhbGxvd3MgdGhlIHBvbHlmaWxsIHRvIGJlIGluY2x1ZGVkXG4gICAgLy8gaW4gRmlyZWZveCBuZWFybHkgZm9yIGZyZWUuXG5cbiAgICBjb25zdCB3cmFwQVBJcyA9IGV4dGVuc2lvbkFQSXMgPT4ge1xuICAgICAgLy8gTk9URTogYXBpTWV0YWRhdGEgaXMgYXNzb2NpYXRlZCB0byB0aGUgY29udGVudCBvZiB0aGUgYXBpLW1ldGFkYXRhLmpzb24gZmlsZVxuICAgICAgLy8gYXQgYnVpbGQgdGltZSBieSByZXBsYWNpbmcgdGhlIGZvbGxvd2luZyBcImluY2x1ZGVcIiB3aXRoIHRoZSBjb250ZW50IG9mIHRoZVxuICAgICAgLy8gSlNPTiBmaWxlLlxuICAgICAgY29uc3QgYXBpTWV0YWRhdGEgPSB7XG4gICAgICAgIFwiYWxhcm1zXCI6IHtcbiAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY2xlYXJBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJib29rbWFya3NcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q2hpbGRyZW5cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRSZWNlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRTdWJUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VHJlZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NlckFjdGlvblwiOiB7XG4gICAgICAgICAgXCJkaXNhYmxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZW5hYmxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3JcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3JcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJyb3dzaW5nRGF0YVwiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDYWNoZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNvb2tpZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVEb3dubG9hZHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVGb3JtRGF0YVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUhpc3RvcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVMb2NhbFN0b3JhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVQYXNzd29yZHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVQbHVnaW5EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb21tYW5kc1wiOiB7XG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZXh0TWVudXNcIjoge1xuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29va2llc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxDb29raWVTdG9yZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkZXZ0b29sc1wiOiB7XG4gICAgICAgICAgXCJpbnNwZWN0ZWRXaW5kb3dcIjoge1xuICAgICAgICAgICAgXCJldmFsXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhbmVsc1wiOiB7XG4gICAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMyxcbiAgICAgICAgICAgICAgXCJzaW5nbGVDYWxsYmFja0FyZ1wiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbGVtZW50c1wiOiB7XG4gICAgICAgICAgICAgIFwiY3JlYXRlU2lkZWJhclBhbmVcIjoge1xuICAgICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZG93bmxvYWRzXCI6IHtcbiAgICAgICAgICBcImNhbmNlbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRvd25sb2FkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZXJhc2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRGaWxlSWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJwYXVzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZpbGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN1bWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZXh0ZW5zaW9uXCI6IHtcbiAgICAgICAgICBcImlzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpc0FsbG93ZWRJbmNvZ25pdG9BY2Nlc3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJoaXN0b3J5XCI6IHtcbiAgICAgICAgICBcImFkZFVybFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZUFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZVJhbmdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VmlzaXRzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaTE4blwiOiB7XG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFjY2VwdExhbmd1YWdlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImlkZW50aXR5XCI6IHtcbiAgICAgICAgICBcImxhdW5jaFdlYkF1dGhGbG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRsZVwiOiB7XG4gICAgICAgICAgXCJxdWVyeVN0YXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibWFuYWdlbWVudFwiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRTZWxmXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0RW5hYmxlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVuaW5zdGFsbFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJub3RpZmljYXRpb25zXCI6IHtcbiAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UGVybWlzc2lvbkxldmVsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGFnZUFjdGlvblwiOiB7XG4gICAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGlkZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2hvd1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInBlcm1pc3Npb25zXCI6IHtcbiAgICAgICAgICBcImNvbnRhaW5zXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVxdWVzdFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInJ1bnRpbWVcIjoge1xuICAgICAgICAgIFwiZ2V0QmFja2dyb3VuZFBhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQbGF0Zm9ybUluZm9cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuT3B0aW9uc1BhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0VXBkYXRlQ2hlY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmROYXRpdmVNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VW5pbnN0YWxsVVJMXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic2Vzc2lvbnNcIjoge1xuICAgICAgICAgIFwiZ2V0RGV2aWNlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudGx5Q2xvc2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVzdG9yZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInN0b3JhZ2VcIjoge1xuICAgICAgICAgIFwibG9jYWxcIjoge1xuICAgICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtYW5hZ2VkXCI6IHtcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInN5bmNcIjoge1xuICAgICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0YWJzXCI6IHtcbiAgICAgICAgICBcImNhcHR1cmVWaXNpYmxlVGFiXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGV0ZWN0TGFuZ3VhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkaXNjYXJkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZHVwbGljYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZXhlY3V0ZVNjcmlwdFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEN1cnJlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Wm9vbVNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ29CYWNrXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ29Gb3J3YXJkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGlnaGxpZ2h0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaW5zZXJ0Q1NTXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInF1ZXJ5XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVsb2FkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ1NTXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0Wm9vbVNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwidG9wU2l0ZXNcIjoge1xuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViTmF2aWdhdGlvblwiOiB7XG4gICAgICAgICAgXCJnZXRBbGxGcmFtZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRGcmFtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndlYlJlcXVlc3RcIjoge1xuICAgICAgICAgIFwiaGFuZGxlckJlaGF2aW9yQ2hhbmdlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndpbmRvd3NcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldExhc3RGb2N1c2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhhcGlNZXRhZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBBIFdlYWtNYXAgc3ViY2xhc3Mgd2hpY2ggY3JlYXRlcyBhbmQgc3RvcmVzIGEgdmFsdWUgZm9yIGFueSBrZXkgd2hpY2ggZG9lc1xuICAgICAgICogbm90IGV4aXN0IHdoZW4gYWNjZXNzZWQsIGJ1dCBiZWhhdmVzIGV4YWN0bHkgYXMgYW4gb3JkaW5hcnkgV2Vha01hcFxuICAgICAgICogb3RoZXJ3aXNlLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNyZWF0ZUl0ZW1cbiAgICAgICAqICAgICAgICBBIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgdmFsdWUgZm9yIGFueVxuICAgICAgICogICAgICAgIGtleSB3aGljaCBkb2VzIG5vdCBleGlzdCwgdGhlIGZpcnN0IHRpbWUgaXQgaXMgYWNjZXNzZWQuIFRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHJlY2VpdmVzLCBhcyBpdHMgb25seSBhcmd1bWVudCwgdGhlIGtleSBiZWluZyBjcmVhdGVkLlxuICAgICAgICovXG5cblxuICAgICAgY2xhc3MgRGVmYXVsdFdlYWtNYXAgZXh0ZW5kcyBXZWFrTWFwIHtcbiAgICAgICAgY29uc3RydWN0b3IoY3JlYXRlSXRlbSwgaXRlbXMgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdXBlcihpdGVtcyk7XG4gICAgICAgICAgdGhpcy5jcmVhdGVJdGVtID0gY3JlYXRlSXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldChrZXkpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgdGhpcy5jcmVhdGVJdGVtKGtleSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCB3aXRoIGEgYHRoZW5gIG1ldGhvZCwgYW5kIGNhblxuICAgICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0LlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAgICovXG5cblxuICAgICAgY29uc3QgaXNUaGVuYWJsZSA9IHZhbHVlID0+IHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoLCB3aGVuIGNhbGxlZCwgd2lsbCByZXNvbHZlIG9yIHJlamVjdFxuICAgICAgICogdGhlIGdpdmVuIHByb21pc2UgYmFzZWQgb24gaG93IGl0IGlzIGNhbGxlZDpcbiAgICAgICAqXG4gICAgICAgKiAtIElmLCB3aGVuIGNhbGxlZCwgYGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcmAgY29udGFpbnMgYSBub24tbnVsbCBvYmplY3QsXG4gICAgICAgKiAgIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIHdpdGggdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gSWYgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGV4YWN0bHkgb25lIGFyZ3VtZW50LCB0aGUgcHJvbWlzZSBpc1xuICAgICAgICogICByZXNvbHZlZCB0byB0aGF0IHZhbHVlLlxuICAgICAgICogLSBPdGhlcndpc2UsIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHRvIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZVxuICAgICAgICogICBmdW5jdGlvbidzIGFyZ3VtZW50cy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gcHJvbWlzZVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSByZXNvbHV0aW9uIGFuZCByZWplY3Rpb24gZnVuY3Rpb25zIG9mIGFcbiAgICAgICAqICAgICAgICBwcm9taXNlLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZS5yZXNvbHZlXG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZXNvbHV0aW9uIGZ1bmN0aW9uLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZS5yZWplY3RcbiAgICAgICAqICAgICAgICBUaGUgcHJvbWlzZSdzIHJlamVjdGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtZXRhZGF0YVxuICAgICAgICogICAgICAgIE1ldGFkYXRhIGFib3V0IHRoZSB3cmFwcGVkIG1ldGhvZCB3aGljaCBoYXMgY3JlYXRlZCB0aGUgY2FsbGJhY2suXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnXG4gICAgICAgKiAgICAgICAgV2hldGhlciBvciBub3QgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCBvbmx5IHRoZSBmaXJzdFxuICAgICAgICogICAgICAgIGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjaywgYWx0ZXJuYXRpdmVseSBhbiBhcnJheSBvZiBhbGwgdGhlXG4gICAgICAgKiAgICAgICAgY2FsbGJhY2sgYXJndW1lbnRzIGlzIHJlc29sdmVkLiBCeSBkZWZhdWx0LCBpZiB0aGUgY2FsbGJhY2tcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggb25seSBhIHNpbmdsZSBhcmd1bWVudCwgdGhhdCB3aWxsIGJlXG4gICAgICAgKiAgICAgICAgcmVzb2x2ZWQgdG8gdGhlIHByb21pc2UsIHdoaWxlIGFsbCBhcmd1bWVudHMgd2lsbCBiZSByZXNvbHZlZCBhc1xuICAgICAgICogICAgICAgIGFuIGFycmF5IGlmIG11bHRpcGxlIGFyZSBnaXZlbi5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gICAgICAgKiAgICAgICAgVGhlIGdlbmVyYXRlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAqL1xuXG5cbiAgICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fCBjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgY29uc3QgcGx1cmFsaXplQXJndW1lbnRzID0gbnVtQXJncyA9PiBudW1BcmdzID09IDEgPyBcImFyZ3VtZW50XCIgOiBcImFyZ3VtZW50c1wiO1xuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBmb3IgYSBtZXRob2Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgbWV0YWRhdGEuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgICAqICAgICAgICBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHdoaWNoIGlzIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1pbkFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBmZXdlciB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAgICogICAgICAgIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggbW9yZSB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAgICogICAgICAgVGhlIGdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAgICovXG5cblxuICAgICAgY29uc3Qgd3JhcEFzeW5jRnVuY3Rpb24gPSAobmFtZSwgbWV0YWRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFzeW5jRnVuY3Rpb25XcmFwcGVyKHRhcmdldCwgLi4uYXJncykge1xuICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbGVhc3QgJHttZXRhZGF0YS5taW5BcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5taW5BcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEuZmFsbGJhY2tUb05vQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBBUEkgbWV0aG9kIGhhcyBjdXJyZW50bHkgbm8gY2FsbGJhY2sgb24gQ2hyb21lLCBidXQgaXQgcmV0dXJuIGEgcHJvbWlzZSBvbiBGaXJlZm94LFxuICAgICAgICAgICAgICAvLyBhbmQgc28gdGhlIHBvbHlmaWxsIHdpbGwgdHJ5IHRvIGNhbGwgaXQgd2l0aCBhIGNhbGxiYWNrIGZpcnN0LCBhbmQgaXQgd2lsbCBmYWxsYmFja1xuICAgICAgICAgICAgICAvLyB0byBub3QgcGFzc2luZyB0aGUgY2FsbGJhY2sgaWYgdGhlIGZpcnN0IGNhbGwgZmFpbHMuXG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoY2JFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHtuYW1lfSBBUEkgbWV0aG9kIGRvZXNuJ3Qgc2VlbSB0byBzdXBwb3J0IHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIsIGAgKyBcImZhbGxpbmcgYmFjayB0byBjYWxsIGl0IHdpdGhvdXQgYSBjYWxsYmFjazogXCIsIGNiRXJyb3IpO1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTsgLy8gVXBkYXRlIHRoZSBBUEkgbWV0aG9kIG1ldGFkYXRhLCBzbyB0aGF0IHRoZSBuZXh0IEFQSSBjYWxscyB3aWxsIG5vdCB0cnkgdG9cbiAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIHVuc3VwcG9ydGVkIGNhbGxiYWNrIGFueW1vcmUuXG5cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLm5vQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFdyYXBzIGFuIGV4aXN0aW5nIG1ldGhvZCBvZiB0aGUgdGFyZ2V0IG9iamVjdCwgc28gdGhhdCBjYWxscyB0byBpdCBhcmVcbiAgICAgICAqIGludGVyY2VwdGVkIGJ5IHRoZSBnaXZlbiB3cmFwcGVyIGZ1bmN0aW9uLiBUaGUgd3JhcHBlciBmdW5jdGlvbiByZWNlaXZlcyxcbiAgICAgICAqIGFzIGl0cyBmaXJzdCBhcmd1bWVudCwgdGhlIG9yaWdpbmFsIGB0YXJnZXRgIG9iamVjdCwgZm9sbG93ZWQgYnkgZWFjaCBvZlxuICAgICAgICogdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XG4gICAgICAgKiAgICAgICAgVGhlIG9yaWdpbmFsIHRhcmdldCBvYmplY3QgdGhhdCB0aGUgd3JhcHBlZCBtZXRob2QgYmVsb25ncyB0by5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG1ldGhvZFxuICAgICAgICogICAgICAgIFRoZSBtZXRob2QgYmVpbmcgd3JhcHBlZC4gVGhpcyBpcyB1c2VkIGFzIHRoZSB0YXJnZXQgb2YgdGhlIFByb3h5XG4gICAgICAgKiAgICAgICAgb2JqZWN0IHdoaWNoIGlzIGNyZWF0ZWQgdG8gd3JhcCB0aGUgbWV0aG9kLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gd3JhcHBlclxuICAgICAgICogICAgICAgIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHdoaWNoIGlzIGNhbGxlZCBpbiBwbGFjZSBvZiBhIGRpcmVjdCBpbnZvY2F0aW9uXG4gICAgICAgKiAgICAgICAgb2YgdGhlIHdyYXBwZWQgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtQcm94eTxmdW5jdGlvbj59XG4gICAgICAgKiAgICAgICAgQSBQcm94eSBvYmplY3QgZm9yIHRoZSBnaXZlbiBtZXRob2QsIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIHdyYXBwZXJcbiAgICAgICAqICAgICAgICBtZXRob2QgaW4gaXRzIHBsYWNlLlxuICAgICAgICovXG5cblxuICAgICAgY29uc3Qgd3JhcE1ldGhvZCA9ICh0YXJnZXQsIG1ldGhvZCwgd3JhcHBlcikgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KG1ldGhvZCwge1xuICAgICAgICAgIGFwcGx5KHRhcmdldE1ldGhvZCwgdGhpc09iaiwgYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHdyYXBwZXIuY2FsbCh0aGlzT2JqLCB0YXJnZXQsIC4uLmFyZ3MpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBoYXNPd25Qcm9wZXJ0eSA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gb2JqZWN0IGluIGEgUHJveHkgd2hpY2ggaW50ZXJjZXB0cyBhbmQgd3JhcHMgY2VydGFpbiBtZXRob2RzXG4gICAgICAgKiBiYXNlZCBvbiB0aGUgZ2l2ZW4gYHdyYXBwZXJzYCBhbmQgYG1ldGFkYXRhYCBvYmplY3RzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgdGFyZ2V0IG9iamVjdCB0byB3cmFwLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbd3JhcHBlcnMgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBzcGVjaWFsIGNhc2VzLiBBbnlcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBwcmVzZW50IGluIHRoaXMgb2JqZWN0IHRyZWUgaXMgY2FsbGVkIGluIHBsYWNlIG9mIHRoZVxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYHRhcmdldGAgb2JqZWN0IHRyZWUuIFRoZXNlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciBtZXRob2RzIGFyZSBpbnZva2VkIGFzIGRlc2NyaWJlZCBpbiB7QHNlZSB3cmFwTWV0aG9kfS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gW21ldGFkYXRhID0ge31dXG4gICAgICAgKiAgICAgICAgQW4gb2JqZWN0IHRyZWUgY29udGFpbmluZyBtZXRhZGF0YSB1c2VkIHRvIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVcbiAgICAgICAqICAgICAgICBQcm9taXNlLWJhc2VkIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBhc3luY2hyb25vdXMuIEFueSBmdW5jdGlvbiBpblxuICAgICAgICogICAgICAgIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZSB3aGljaCBoYXMgYSBjb3JyZXNwb25kaW5nIG1ldGFkYXRhIG9iamVjdFxuICAgICAgICogICAgICAgIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgbWV0YWRhdGFgIHRyZWUgaXMgcmVwbGFjZWQgd2l0aCBhblxuICAgICAgICogICAgICAgIGF1dG9tYXRpY2FsbHktZ2VuZXJhdGVkIHdyYXBwZXIgZnVuY3Rpb24sIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICogICAgICAgIHtAc2VlIHdyYXBBc3luY0Z1bmN0aW9ufVxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtQcm94eTxvYmplY3Q+fVxuICAgICAgICovXG5cbiAgICAgIGNvbnN0IHdyYXBPYmplY3QgPSAodGFyZ2V0LCB3cmFwcGVycyA9IHt9LCBtZXRhZGF0YSA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHtcbiAgICAgICAgICBoYXMocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBnZXQocHJveHlUYXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gY2FjaGVbcHJvcF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghKHByb3AgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgbWV0aG9kIG9uIHRoZSB1bmRlcmx5aW5nIG9iamVjdC4gQ2hlY2sgaWYgd2UgbmVlZCB0byBkb1xuICAgICAgICAgICAgICAvLyBhbnkgd3JhcHBpbmcuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBzcGVjaWFsLWNhc2Ugd3JhcHBlciBmb3IgdGhpcyBtZXRob2QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyc1twcm9wXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhc3luYyBtZXRob2QgdGhhdCB3ZSBoYXZlIG1ldGFkYXRhIGZvci4gQ3JlYXRlIGFcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHdyYXBwZXIgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIG1ldGhvZCwgYm91bmQgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAoaGFzT3duUHJvcGVydHkod3JhcHBlcnMsIHByb3ApIHx8IGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvYmplY3QgdGhhdCB3ZSBuZWVkIHRvIGRvIHNvbWUgd3JhcHBpbmcgZm9yIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgICAvLyBtZXRhZGF0YS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAgIC8vIFdyYXAgYWxsIHByb3BlcnRpZXMgaW4gKiBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW1wiKlwiXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGRvIGFueSB3cmFwcGluZyBmb3IgdGhpcyBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgLy8gc28ganVzdCBmb3J3YXJkIGFsbCBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcblxuICAgICAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHNldChwcm94eVRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBkZWZpbmVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCwgZGVzYykge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIGRlc2MpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBkZWxldGVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoY2FjaGUsIHByb3ApO1xuICAgICAgICAgIH1cblxuICAgICAgICB9OyAvLyBQZXIgY29udHJhY3Qgb2YgdGhlIFByb3h5IEFQSSwgdGhlIFwiZ2V0XCIgcHJveHkgaGFuZGxlciBtdXN0IHJldHVybiB0aGVcbiAgICAgICAgLy8gb3JpZ2luYWwgdmFsdWUgb2YgdGhlIHRhcmdldCBpZiB0aGF0IHZhbHVlIGlzIGRlY2xhcmVkIHJlYWQtb25seSBhbmRcbiAgICAgICAgLy8gbm9uLWNvbmZpZ3VyYWJsZS4gRm9yIHRoaXMgcmVhc29uLCB3ZSBjcmVhdGUgYW4gb2JqZWN0IHdpdGggdGhlXG4gICAgICAgIC8vIHByb3RvdHlwZSBzZXQgdG8gYHRhcmdldGAgaW5zdGVhZCBvZiB1c2luZyBgdGFyZ2V0YCBkaXJlY3RseS5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIGNhbm5vdCByZXR1cm4gYSBjdXN0b20gb2JqZWN0IGZvciBBUElzIHRoYXRcbiAgICAgICAgLy8gYXJlIGRlY2xhcmVkIHJlYWQtb25seSBhbmQgbm9uLWNvbmZpZ3VyYWJsZSwgc3VjaCBhcyBgY2hyb21lLmRldnRvb2xzYC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlIHByb3h5IGhhbmRsZXJzIHRoZW1zZWx2ZXMgd2lsbCBzdGlsbCB1c2UgdGhlIG9yaWdpbmFsIGB0YXJnZXRgXG4gICAgICAgIC8vIGluc3RlYWQgb2YgdGhlIGBwcm94eVRhcmdldGAsIHNvIHRoYXQgdGhlIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgYXJlXG4gICAgICAgIC8vIGRlcmVmZXJlbmNlZCB2aWEgdGhlIG9yaWdpbmFsIHRhcmdldHMuXG5cbiAgICAgICAgbGV0IHByb3h5VGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHByb3h5VGFyZ2V0LCBoYW5kbGVycyk7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgc2V0IG9mIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBhbiBldmVudCBvYmplY3QsIHdoaWNoIGhhbmRsZXNcbiAgICAgICAqIHdyYXBwaW5nIG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0aGF0IHRob3NlIG1lc3NhZ2VzIGFyZSBwYXNzZWQuXG4gICAgICAgKlxuICAgICAgICogQSBzaW5nbGUgd3JhcHBlciBpcyBjcmVhdGVkIGZvciBlYWNoIGxpc3RlbmVyIGZ1bmN0aW9uLCBhbmQgc3RvcmVkIGluIGFcbiAgICAgICAqIG1hcC4gU3Vic2VxdWVudCBjYWxscyB0byBgYWRkTGlzdGVuZXJgLCBgaGFzTGlzdGVuZXJgLCBvciBgcmVtb3ZlTGlzdGVuZXJgXG4gICAgICAgKiByZXRyaWV2ZSB0aGUgb3JpZ2luYWwgd3JhcHBlciwgc28gdGhhdCAgYXR0ZW1wdHMgdG8gcmVtb3ZlIGFcbiAgICAgICAqIHByZXZpb3VzbHktYWRkZWQgbGlzdGVuZXIgd29yayBhcyBleHBlY3RlZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0RlZmF1bHRXZWFrTWFwPGZ1bmN0aW9uLCBmdW5jdGlvbj59IHdyYXBwZXJNYXBcbiAgICAgICAqICAgICAgICBBIERlZmF1bHRXZWFrTWFwIG9iamVjdCB3aGljaCB3aWxsIGNyZWF0ZSB0aGUgYXBwcm9wcmlhdGUgd3JhcHBlclxuICAgICAgICogICAgICAgIGZvciBhIGdpdmVuIGxpc3RlbmVyIGZ1bmN0aW9uIHdoZW4gb25lIGRvZXMgbm90IGV4aXN0LCBhbmQgcmV0cmlldmVcbiAgICAgICAqICAgICAgICBhbiBleGlzdGluZyBvbmUgd2hlbiBpdCBkb2VzLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICAgKi9cblxuXG4gICAgICBjb25zdCB3cmFwRXZlbnQgPSB3cmFwcGVyTWFwID0+ICh7XG4gICAgICAgIGFkZExpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIsIC4uLmFyZ3MpIHtcbiAgICAgICAgICB0YXJnZXQuYWRkTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpLCAuLi5hcmdzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBoYXNMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5oYXNMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lcikpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgb25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycyA9IG5ldyBEZWZhdWx0V2Vha01hcChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYW4gb25SZXF1ZXN0RmluaXNoZWQgbGlzdGVuZXIgZnVuY3Rpb24gc28gdGhhdCBpdCB3aWxsIHJldHVybiBhXG4gICAgICAgICAqIGBnZXRDb250ZW50KClgIHByb3BlcnR5IHdoaWNoIHJldHVybnMgYSBgUHJvbWlzZWAgcmF0aGVyIHRoYW4gdXNpbmcgYVxuICAgICAgICAgKiBjYWxsYmFjayBBUEkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXFcbiAgICAgICAgICogICAgICAgIFRoZSBIQVIgZW50cnkgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgbmV0d29yayByZXF1ZXN0LlxuICAgICAgICAgKi9cblxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvblJlcXVlc3RGaW5pc2hlZChyZXEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9XG4gICAgICAgICAgLyogd3JhcHBlcnMgKi9cbiAgICAgICAgICAsIHtcbiAgICAgICAgICAgIGdldENvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgbWluQXJnczogMCxcbiAgICAgICAgICAgICAgbWF4QXJnczogMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3RlbmVyKHdyYXBwZWRSZXEpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCBvbk1lc3NhZ2VXcmFwcGVycyA9IG5ldyBEZWZhdWx0V2Vha01hcChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2suIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlIHJlc3BvbnNlIGlzXG4gICAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAgICogICAgICAgIERldGFpbHMgYWJvdXQgdGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAgICogICAgICAgIHRoYXQgdmFsdWUgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICAgKiAgICAgICAgeWllbGQgYSByZXNwb25zZS4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgKi9cblxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvbk1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgICBsZXQgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IGZhbHNlO1xuICAgICAgICAgIGxldCB3cmFwcGVkU2VuZFJlc3BvbnNlO1xuICAgICAgICAgIGxldCBzZW5kUmVzcG9uc2VQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB3cmFwcGVkU2VuZFJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIGRpZENhbGxTZW5kUmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGV0IHJlc3VsdDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBpc1Jlc3VsdFRoZW5hYmxlID0gcmVzdWx0ICE9PSB0cnVlICYmIGlzVGhlbmFibGUocmVzdWx0KTsgLy8gSWYgdGhlIGxpc3RlbmVyIGRpZG4ndCByZXR1cm5lZCB0cnVlIG9yIGEgUHJvbWlzZSwgb3IgY2FsbGVkXG4gICAgICAgICAgLy8gd3JhcHBlZFNlbmRSZXNwb25zZSBzeW5jaHJvbm91c2x5LCB3ZSBjYW4gZXhpdCBlYXJsaWVyXG4gICAgICAgICAgLy8gYmVjYXVzZSB0aGVyZSB3aWxsIGJlIG5vIHJlc3BvbnNlIHNlbnQgZnJvbSB0aGlzIGxpc3RlbmVyLlxuXG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0gLy8gQSBzbWFsbCBoZWxwZXIgdG8gc2VuZCB0aGUgbWVzc2FnZSBpZiB0aGUgcHJvbWlzZSByZXNvbHZlc1xuICAgICAgICAgIC8vIGFuZCBhbiBlcnJvciBpZiB0aGUgcHJvbWlzZSByZWplY3RzIChhIHdyYXBwZWQgc2VuZE1lc3NhZ2UgaGFzXG4gICAgICAgICAgLy8gdG8gdHJhbnNsYXRlIHRoZSBtZXNzYWdlIGludG8gYSByZXNvbHZlZCBwcm9taXNlIG9yIGEgcmVqZWN0ZWRcbiAgICAgICAgICAvLyBwcm9taXNlKS5cblxuXG4gICAgICAgICAgY29uc3Qgc2VuZFByb21pc2VkUmVzdWx0ID0gcHJvbWlzZSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4obXNnID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgICAgaWYgKGVycm9yICYmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yIHx8IHR5cGVvZiBlcnJvci5tZXNzYWdlID09PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWRcIjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgX19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAvLyBQcmludCBhbiBlcnJvciBvbiB0aGUgY29uc29sZSBpZiB1bmFibGUgdG8gc2VuZCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2VuZCBvbk1lc3NhZ2UgcmVqZWN0ZWQgcmVwbHlcIiwgZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07IC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgICAvLyByZXN1bHQsIG90aGVyd2lzZSB3YWl0IHRoZSBwcm9taXNlIHJlbGF0ZWQgdG8gdGhlIHdyYXBwZWRTZW5kUmVzcG9uc2VcbiAgICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG5cblxuICAgICAgICAgIGlmIChpc1Jlc3VsdFRoZW5hYmxlKSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VuZFByb21pc2VkUmVzdWx0KHNlbmRSZXNwb25zZVByb21pc2UpO1xuICAgICAgICAgIH0gLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuXG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7XG4gICAgICAgIHJlamVjdCxcbiAgICAgICAgcmVzb2x2ZVxuICAgICAgfSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAvLyBEZXRlY3Qgd2hlbiBub25lIG9mIHRoZSBsaXN0ZW5lcnMgcmVwbGllZCB0byB0aGUgc2VuZE1lc3NhZ2UgY2FsbCBhbmQgcmVzb2x2ZVxuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPT09IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IGJhY2sgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGludG9cbiAgICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3Qgd3JhcHBlZFNlbmRNZXNzYWdlID0gKG5hbWUsIG1ldGFkYXRhLCBhcGlOYW1lc3BhY2VPYmosIC4uLmFyZ3MpID0+IHtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbGVhc3QgJHttZXRhZGF0YS5taW5BcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5taW5BcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiBtZXRhZGF0YS5tYXhBcmdzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkQ2IgPSB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjay5iaW5kKG51bGwsIHtcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgY29uc3Qgc3RhdGljV3JhcHBlcnMgPSB7XG4gICAgICAgIGRldnRvb2xzOiB7XG4gICAgICAgICAgbmV0d29yazoge1xuICAgICAgICAgICAgb25SZXF1ZXN0RmluaXNoZWQ6IHdyYXBFdmVudChvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcnVudGltZToge1xuICAgICAgICAgIG9uTWVzc2FnZTogd3JhcEV2ZW50KG9uTWVzc2FnZVdyYXBwZXJzKSxcbiAgICAgICAgICBvbk1lc3NhZ2VFeHRlcm5hbDogd3JhcEV2ZW50KG9uTWVzc2FnZVdyYXBwZXJzKSxcbiAgICAgICAgICBzZW5kTWVzc2FnZTogd3JhcHBlZFNlbmRNZXNzYWdlLmJpbmQobnVsbCwgXCJzZW5kTWVzc2FnZVwiLCB7XG4gICAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgICAgbWF4QXJnczogM1xuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHRhYnM6IHtcbiAgICAgICAgICBzZW5kTWVzc2FnZTogd3JhcHBlZFNlbmRNZXNzYWdlLmJpbmQobnVsbCwgXCJzZW5kTWVzc2FnZVwiLCB7XG4gICAgICAgICAgICBtaW5BcmdzOiAyLFxuICAgICAgICAgICAgbWF4QXJnczogM1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBzZXR0aW5nTWV0YWRhdGEgPSB7XG4gICAgICAgIGNsZWFyOiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGdldDoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGFwaU1ldGFkYXRhLnByaXZhY3kgPSB7XG4gICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHNlcnZpY2VzOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICB3ZWJzaXRlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiB3cmFwT2JqZWN0KGV4dGVuc2lvbkFQSXMsIHN0YXRpY1dyYXBwZXJzLCBhcGlNZXRhZGF0YSk7XG4gICAgfTsgLy8gVGhlIGJ1aWxkIHByb2Nlc3MgYWRkcyBhIFVNRCB3cmFwcGVyIGFyb3VuZCB0aGlzIGZpbGUsIHdoaWNoIG1ha2VzIHRoZVxuICAgIC8vIGBtb2R1bGVgIHZhcmlhYmxlIGF2YWlsYWJsZS5cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3cmFwQVBJcyhjaHJvbWUpO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsVGhpcy5icm93c2VyO1xuICB9XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJyb3dzZXItcG9seWZpbGwuanMubWFwXG4iLCIvLyBzcmMvYnJvd3Nlci50c1xuaW1wb3J0IG9yaWdpbmFsQnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG52YXIgYnJvd3NlciA9IG9yaWdpbmFsQnJvd3NlcjtcblxuZXhwb3J0IHtcbiAgYnJvd3NlclxufTtcbiIsImltcG9ydCB0eXBlIHsgUGFnZVN0YXRlLCBQYWdlVHlwZSB9IGZyb20gJy4uL3R5cGVzJztcblxuaW50ZXJmYWNlIFBhZ2VEYXRhIHtcbiAgdXJsOiBzdHJpbmc7XG4gIGRvbWFpbjogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aXNpYmxlVGV4dDogc3RyaW5nO1xuICBidXR0b25zOiB7IHRleHQ6IHN0cmluZzsgc2VsZWN0b3I6IHN0cmluZzsgdHlwZTogc3RyaW5nOyB2aXNpYmxlOiBib29sZWFuIH1bXTtcbiAgbGlua3M6IHsgdGV4dDogc3RyaW5nOyBocmVmOiBzdHJpbmc7IHNlbGVjdG9yOiBzdHJpbmc7IHZpc2libGU6IGJvb2xlYW4gfVtdO1xuICBpbnB1dHM6IHsgdHlwZTogc3RyaW5nOyBuYW1lOiBzdHJpbmc7IHBsYWNlaG9sZGVyOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHNlbGVjdG9yOiBzdHJpbmc7IHJlcXVpcmVkOiBib29sZWFuOyB2aXNpYmxlOiBib29sZWFuIH1bXTtcbiAgZm9ybXM6IHsgYWN0aW9uOiBzdHJpbmc7IG1ldGhvZDogc3RyaW5nOyBmaWVsZHM6IG51bWJlcjsgc3VibWl0VGV4dDogc3RyaW5nOyBzZWxlY3Rvcjogc3RyaW5nIH1bXTtcbiAgaGVhZGluZ3M6IHsgbGV2ZWw6IG51bWJlcjsgdGV4dDogc3RyaW5nOyBzZWxlY3Rvcjogc3RyaW5nIH1bXTtcbiAgbmF2aWdhdGlvbjogeyBsaW5rczogeyB0ZXh0OiBzdHJpbmc7IGhyZWY6IHN0cmluZyB9W10gfVtdO1xuICBkaWFsb2dzOiB7IHRleHQ6IHN0cmluZzsgc2VsZWN0b3I6IHN0cmluZyB9W107XG4gIGFyaWFMYWJlbHM6IHsgbGFiZWw6IHN0cmluZzsgdGFnOiBzdHJpbmc7IHNlbGVjdG9yOiBzdHJpbmcgfVtdO1xuICBwbGFjZWhvbGRlcnM6IHN0cmluZ1tdO1xuICBpbWFnZXM6IHsgYWx0OiBzdHJpbmc7IHNyYzogc3RyaW5nOyBzZWxlY3Rvcjogc3RyaW5nIH1bXTtcbiAgc2VsZWN0RWxlbWVudDogeyBuYW1lOiBzdHJpbmc7IG9wdGlvbnM6IHN0cmluZ1tdOyBzZWxlY3Rvcjogc3RyaW5nIH1bXTtcbiAgY2hlY2tib3hlczogeyB0eXBlOiBzdHJpbmc7IG5hbWU6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgY2hlY2tlZDogYm9vbGVhbjsgc2VsZWN0b3I6IHN0cmluZyB9W107XG4gIHRhYnM6IHsgdGV4dDogc3RyaW5nOyBzZWxlY3RlZDogYm9vbGVhbjsgcm9sZTogc3RyaW5nOyBzZWxlY3Rvcjogc3RyaW5nIH1bXTtcbiAgc3VjY2Vzc01lc3NhZ2VzOiBzdHJpbmdbXTtcbiAgZXJyb3JNZXNzYWdlczogc3RyaW5nW107XG4gIHZhbGlkYXRpb25NZXNzYWdlczogc3RyaW5nW107XG4gIGRpc2FibGVkQnV0dG9uczogeyB0ZXh0OiBzdHJpbmc7IHNlbGVjdG9yOiBzdHJpbmcgfVtdO1xuICBicmVhZGNydW1iczogc3RyaW5nW107XG4gIHRvYXN0czogc3RyaW5nW107XG4gIHBhZ2VQdXJwb3NlOiBzdHJpbmc7XG4gIGFjdGl2ZVdvcmtmbG93OiBzdHJpbmc7XG4gIHBhZ2VTdGF0ZTogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiB0ZXh0TG93ZXIodDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuICh0IHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBjbGVhbih0OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdC5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoVGV4dChhY3R1YWw6IHN0cmluZywgcGF0dGVybjogUmVnRXhwKTogYm9vbGVhbiB7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QoY2xlYW4oYWN0dWFsKSk7XG59XG5cbmNvbnN0IEFVVEhfQlROID0gL2xvZ2lufHNpZ25cXHMqaW58bG9nXFxzKmlufHNpZ25pbi9pO1xuY29uc3QgU0lHTlVQX0JUTiA9IC9zaWduXFxzKnVwfHJlZ2lzdGVyfGNyZWF0ZVxccyphY2NvdW50fGdldFxccypzdGFydGVkfGpvaW4vaTtcbmNvbnN0IFNFQVJDSF9SRUxBVEVEID0gL3NlYXJjaHxmaW5kfHF1ZXJ5fGxvb2tcXHMqdXB8YnJvd3NlfGNhdGFsb2d8ZmlsdGVyfHNvcnQvaTtcbmNvbnN0IFNVQk1JVF9CVE4gPSAvc3VibWl0fHNhdmV8Y29udGludWV8bmV4dHxkb25lfGZpbmlzaHxjb25maXJtL2k7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFBhZ2VTdGF0ZShnb2FsOiBzdHJpbmcsIHBhZ2U6IFBhZ2VEYXRhKTogUGFnZVN0YXRlIHtcbiAgY29uc3QgdGV4dCA9IHBhZ2UudmlzaWJsZVRleHQudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgaGFzUGFzc3dvcmRGaWVsZCA9IHBhZ2UuaW5wdXRzLnNvbWUoKGkpID0+IGkudmlzaWJsZSAmJiBpLnR5cGUgPT09ICdwYXNzd29yZCcpO1xuICBjb25zdCBoYXNFbWFpbEZpZWxkID0gcGFnZS5pbnB1dHMuc29tZSgoaSkgPT4gaS52aXNpYmxlICYmIChpLnR5cGUgPT09ICdlbWFpbCcgfHwgL2VtYWlsL2kudGVzdCh0ZXh0T2YoaSkpKSk7XG4gIGNvbnN0IGhhc1NlYXJjaEZpZWxkID0gcGFnZS5pbnB1dHMuc29tZSgoaSkgPT4gaS52aXNpYmxlICYmIFNFQVJDSF9SRUxBVEVELnRlc3QodGV4dE9mKGkpKSk7XG4gIGNvbnN0IGhhc0Zvcm0gPSBwYWdlLmZvcm1zLmxlbmd0aCA+IDAgfHwgcGFnZS5pbnB1dHMuZmlsdGVyKChpKSA9PiBpLnZpc2libGUpLmxlbmd0aCA+IDE7XG4gIGNvbnN0IG1haW5IZWFkaW5nID0gcGFnZS5oZWFkaW5ncy5maWx0ZXIoKGgpID0+IGgubGV2ZWwgPD0gMikuc29ydCgoYSwgYikgPT4gYS5sZXZlbCAtIGIubGV2ZWwpWzBdPy50ZXh0IHx8ICcnO1xuICBjb25zdCB1cmxMb3dlciA9IHBhZ2UudXJsLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3QgYXV0aElucHV0cyA9IHBhZ2UuaW5wdXRzXG4gICAgLmZpbHRlcigoaSkgPT4gaS52aXNpYmxlICYmIChpLnR5cGUgPT09ICdwYXNzd29yZCcgfHwgaS50eXBlID09PSAnZW1haWwnIHx8ICFTRUFSQ0hfUkVMQVRFRC50ZXN0KHRleHRPZihpKSkpKVxuICAgIC5tYXAoKGkpID0+ICh7IHBsYWNlaG9sZGVyOiBpLnBsYWNlaG9sZGVyLCB0eXBlOiBpLnR5cGUsIGxhYmVsOiBpLmxhYmVsIH0pKTtcblxuICBjb25zdCBmb3JtSW5wdXRzID0gcGFnZS5pbnB1dHNcbiAgICAuZmlsdGVyKChpKSA9PiBpLnZpc2libGUpXG4gICAgLm1hcCgoaSkgPT4gKHsgcGxhY2Vob2xkZXI6IGkucGxhY2Vob2xkZXIsIHR5cGU6IGkudHlwZSwgbGFiZWw6IGkubGFiZWwsIG5hbWU6IGkubmFtZSwgcmVxdWlyZWQ6IGkucmVxdWlyZWQgfSkpO1xuXG4gIGNvbnN0IGxvZ2luQnV0dG9uID0gZmluZEJ0bihwYWdlLCBBVVRIX0JUTik7XG4gIGNvbnN0IHNpZ251cEJ1dHRvbiA9IGZpbmRCdG4ocGFnZSwgU0lHTlVQX0JUTik7XG4gIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGZpbmRCdG4ocGFnZSwgU1VCTUlUX0JUTik7XG5cbiAgY29uc3Qgc3VibWl0QnV0dG9uVGV4dCA9IHN1Ym1pdEJ1dHRvbj8udGV4dCB8fCBwYWdlLmZvcm1zWzBdPy5zdWJtaXRUZXh0IHx8IG51bGw7XG5cbiAgY29uc3QgZ29hbExvd2VyID0gZ29hbC50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBpc0F1dGhHb2FsID0gL2xvZ2lufHNpZ25cXHMqaW58bG9nXFxzKmlufGF1dGhlbnRpY2F0ZS9pLnRlc3QoZ29hbExvd2VyKTtcbiAgY29uc3QgaXNTaWdudXBHb2FsID0gL3JlZ2lzdGVyfHNpZ25cXHMqdXB8Y3JlYXRlXFxzKmFjY291bnQvaS50ZXN0KGdvYWxMb3dlcik7XG4gIGNvbnN0IGlzQ3JlYXRlR29hbCA9IC9jcmVhdGV8bWFrZXxuZXd8YWRkfHVwbG9hZHxwb3N0fHN0YXJ0L2kudGVzdChnb2FsTG93ZXIpO1xuICBjb25zdCBpc1NlYXJjaEdvYWwgPSAvc2VhcmNofGZpbmR8bG9va1xccyp1cHxxdWVyeS9pLnRlc3QoZ29hbExvd2VyKTtcbiAgY29uc3QgaXNJc3N1ZUdvYWwgPSAvaXNzdWV8cHVsbFxccypyZXF1ZXN0fHByL2kudGVzdChnb2FsTG93ZXIpO1xuICBjb25zdCBpc0NoZWNrb3V0R29hbCA9IC9jaGVja291dHxib29rfGJ1eXxwdXJjaGFzZXxvcmRlcnxwYXkvaS50ZXN0KGdvYWxMb3dlcik7XG4gIGNvbnN0IGlzU2V0dGluZ3NHb2FsID0gL3NldHRpbmdzfHByb2ZpbGV8cGFzc3dvcmR8cHJlZmVyZW5jZXN8ZWRpdHx1cGRhdGV8Y2hhbmdlL2kudGVzdChnb2FsTG93ZXIpO1xuXG4gIGNvbnN0IHBhZ2VUeXBlID0gZGV0ZWN0UGFnZVR5cGUocGFnZSwgZ29hbExvd2VyLCB7XG4gICAgaGFzUGFzc3dvcmRGaWVsZCwgaGFzRW1haWxGaWVsZCwgaGFzU2VhcmNoRmllbGQsIGhhc0Zvcm0sXG4gICAgbG9naW5CdXR0b24sIHNpZ251cEJ1dHRvbiwgc3VibWl0QnV0dG9uLCBtYWluSGVhZGluZyxcbiAgICBpc0F1dGhHb2FsLCBpc1NpZ251cEdvYWwsIGlzQ3JlYXRlR29hbCwgaXNTZWFyY2hHb2FsLFxuICAgIGlzSXNzdWVHb2FsLCBpc0NoZWNrb3V0R29hbCwgaXNTZXR0aW5nc0dvYWwsIHVybExvd2VyLFxuICB9KTtcblxuICBjb25zdCBwYWdlUHVycG9zZSA9IHBhZ2UucGFnZVB1cnBvc2UgfHwgJyc7XG5cbiAgY29uc3QgYXZhaWxhYmxlVGFyZ2V0czogeyB0ZXh0OiBzdHJpbmc7IGVsZW1lbnRUeXBlOiBzdHJpbmc7IGNvbmZpZGVuY2U6IG51bWJlcjsgYWN0aW9uOiBzdHJpbmcgfVtdID0gW107XG5cbiAgaWYgKHBhZ2VUeXBlID09PSAnbG9naW4nIHx8IGlzQXV0aEdvYWwpIHtcbiAgICBmb3IgKGNvbnN0IGJ0biBvZiBwYWdlLmJ1dHRvbnMpIHtcbiAgICAgIGlmICghYnRuLnZpc2libGUpIGNvbnRpbnVlO1xuICAgICAgaWYgKEFVVEhfQlROLnRlc3QoYnRuLnRleHQpIHx8IC9sb2dpbnxzaWduL2kudGVzdChidG4udGV4dCkpIHtcbiAgICAgICAgYXZhaWxhYmxlVGFyZ2V0cy5wdXNoKHsgdGV4dDogYnRuLnRleHQsIGVsZW1lbnRUeXBlOiAnYnV0dG9uJywgY29uZmlkZW5jZTogOTQsIGFjdGlvbjogJ2NsaWNrJyB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBsaW5rIG9mIHBhZ2UubGlua3MpIHtcbiAgICAgIGlmICghbGluay52aXNpYmxlKSBjb250aW51ZTtcbiAgICAgIGlmIChBVVRIX0JUTi50ZXN0KGxpbmsudGV4dCkgfHwgL2xvZ2lufHNpZ24vaS50ZXN0KGxpbmsudGV4dCkpIHtcbiAgICAgICAgYXZhaWxhYmxlVGFyZ2V0cy5wdXNoKHsgdGV4dDogbGluay50ZXh0LCBlbGVtZW50VHlwZTogJ2xpbmsnLCBjb25maWRlbmNlOiA4OCwgYWN0aW9uOiAnY2xpY2snIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGlucCBvZiBwYWdlLmlucHV0cykge1xuICAgICAgaWYgKCFpbnAudmlzaWJsZSkgY29udGludWU7XG4gICAgICBpZiAoaW5wLnR5cGUgPT09ICdwYXNzd29yZCcgfHwgaW5wLnR5cGUgPT09ICdlbWFpbCcgfHwgL2VtYWlsfHVzZXJ8cGhvbmV8bW9iaWxlL2kudGVzdCh0ZXh0T2YoaW5wKSkpIHtcbiAgICAgICAgYXZhaWxhYmxlVGFyZ2V0cy5wdXNoKHsgdGV4dDogaW5wLnBsYWNlaG9sZGVyIHx8IGlucC5sYWJlbCB8fCBpbnAubmFtZSB8fCAnaW5wdXQgZmllbGQnLCBlbGVtZW50VHlwZTogJ2lucHV0JywgY29uZmlkZW5jZTogODAsIGFjdGlvbjogJ2lucHV0JyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAocGFnZVR5cGUgPT09ICdzaWdudXAnIHx8IGlzU2lnbnVwR29hbCkge1xuICAgIGZvciAoY29uc3QgYnRuIG9mIHBhZ2UuYnV0dG9ucykge1xuICAgICAgaWYgKCFidG4udmlzaWJsZSkgY29udGludWU7XG4gICAgICBpZiAoU0lHTlVQX0JUTi50ZXN0KGJ0bi50ZXh0KSB8fCAvcmVnaXN0ZXJ8c2lnblxccyp1cHxjcmVhdGUvaS50ZXN0KGJ0bi50ZXh0KSkge1xuICAgICAgICBhdmFpbGFibGVUYXJnZXRzLnB1c2goeyB0ZXh0OiBidG4udGV4dCwgZWxlbWVudFR5cGU6ICdidXR0b24nLCBjb25maWRlbmNlOiA5NCwgYWN0aW9uOiAnY2xpY2snIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGlucCBvZiBwYWdlLmlucHV0cykge1xuICAgICAgaWYgKCFpbnAudmlzaWJsZSkgY29udGludWU7XG4gICAgICBpZiAoaW5wLnR5cGUgPT09ICdwYXNzd29yZCcgfHwgaW5wLnR5cGUgPT09ICdlbWFpbCcgfHwgL25hbWV8dXNlcnxlbWFpbHxwaG9uZS9pLnRlc3QodGV4dE9mKGlucCkpKSB7XG4gICAgICAgIGF2YWlsYWJsZVRhcmdldHMucHVzaCh7IHRleHQ6IGlucC5wbGFjZWhvbGRlciB8fCBpbnAubGFiZWwgfHwgaW5wLm5hbWUgfHwgJ2ZpZWxkJywgZWxlbWVudFR5cGU6ICdpbnB1dCcsIGNvbmZpZGVuY2U6IDgyLCBhY3Rpb246ICdpbnB1dCcgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzQ3JlYXRlR29hbCAmJiAoaXNJc3N1ZUdvYWwgfHwgL3JlcG8vaS50ZXN0KGdvYWxMb3dlcikpKSB7XG4gICAgZm9yIChjb25zdCBsaW5rIG9mIHBhZ2UubGlua3MpIHtcbiAgICAgIGlmICghbGluay52aXNpYmxlKSBjb250aW51ZTtcbiAgICAgIGlmICgvaXNzdWVzP3xwdWxscz98cHVsbC5yZXF1ZXN0L2kudGVzdChsaW5rLnRleHQpICYmIC9cXC9bXi9dK1xcL1teL10rLy50ZXN0KHBhZ2UudXJsKSkge1xuICAgICAgICBhdmFpbGFibGVUYXJnZXRzLnB1c2goeyB0ZXh0OiBsaW5rLnRleHQsIGVsZW1lbnRUeXBlOiAnbGluaycsIGNvbmZpZGVuY2U6IDkyLCBhY3Rpb246ICdjbGljaycgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgYnRuIG9mIHBhZ2UuYnV0dG9ucykge1xuICAgICAgaWYgKCFidG4udmlzaWJsZSkgY29udGludWU7XG4gICAgICBpZiAoL25ld1xccysoaXNzdWV8cHVsbFxccypyZXF1ZXN0KXxjcmVhdGUvaS50ZXN0KGJ0bi50ZXh0KSkge1xuICAgICAgICBhdmFpbGFibGVUYXJnZXRzLnB1c2goeyB0ZXh0OiBidG4udGV4dCwgZWxlbWVudFR5cGU6ICdidXR0b24nLCBjb25maWRlbmNlOiA5NiwgYWN0aW9uOiAnY2xpY2snIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGxpbmsgb2YgcGFnZS5saW5rcykge1xuICAgICAgaWYgKCFsaW5rLnZpc2libGUpIGNvbnRpbnVlO1xuICAgICAgaWYgKC9uZXdcXHMrKGlzc3VlfHB1bGxcXHMqcmVxdWVzdCkvaS50ZXN0KGxpbmsudGV4dCkpIHtcbiAgICAgICAgYXZhaWxhYmxlVGFyZ2V0cy5wdXNoKHsgdGV4dDogbGluay50ZXh0LCBlbGVtZW50VHlwZTogJ2xpbmsnLCBjb25maWRlbmNlOiA5MCwgYWN0aW9uOiAnY2xpY2snIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChpc1NlYXJjaEdvYWwpIHtcbiAgICBmb3IgKGNvbnN0IGlucCBvZiBwYWdlLmlucHV0cykge1xuICAgICAgaWYgKCFpbnAudmlzaWJsZSkgY29udGludWU7XG4gICAgICBpZiAoU0VBUkNIX1JFTEFURUQudGVzdCh0ZXh0T2YoaW5wKSkpIHtcbiAgICAgICAgYXZhaWxhYmxlVGFyZ2V0cy5wdXNoKHsgdGV4dDogaW5wLnBsYWNlaG9sZGVyIHx8IGlucC5sYWJlbCB8fCAnc2VhcmNoJywgZWxlbWVudFR5cGU6ICdpbnB1dCcsIGNvbmZpZGVuY2U6IDkyLCBhY3Rpb246ICdpbnB1dCcgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgYnRuIG9mIHBhZ2UuYnV0dG9ucykge1xuICAgICAgaWYgKCFidG4udmlzaWJsZSkgY29udGludWU7XG4gICAgICBpZiAoU0VBUkNIX1JFTEFURUQudGVzdChidG4udGV4dCkgfHwgL2dvfGZpbmQvaS50ZXN0KGJ0bi50ZXh0KSkge1xuICAgICAgICBhdmFpbGFibGVUYXJnZXRzLnB1c2goeyB0ZXh0OiBidG4udGV4dCwgZWxlbWVudFR5cGU6ICdidXR0b24nLCBjb25maWRlbmNlOiA4MCwgYWN0aW9uOiAnY2xpY2snIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChhdmFpbGFibGVUYXJnZXRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoY29uc3QgYnRuIG9mIHBhZ2UuYnV0dG9ucykge1xuICAgICAgaWYgKCFidG4udmlzaWJsZSkgY29udGludWU7XG4gICAgICBpZiAoYnRuLnRleHQgJiYgIVNFQVJDSF9SRUxBVEVELnRlc3QoYnRuLnRleHQpKSB7XG4gICAgICAgIGF2YWlsYWJsZVRhcmdldHMucHVzaCh7IHRleHQ6IGJ0bi50ZXh0LCBlbGVtZW50VHlwZTogJ2J1dHRvbicsIGNvbmZpZGVuY2U6IDU1LCBhY3Rpb246ICdjbGljaycgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgbGluayBvZiBwYWdlLmxpbmtzKSB7XG4gICAgICBpZiAoIWxpbmsudmlzaWJsZSkgY29udGludWU7XG4gICAgICBpZiAobGluay50ZXh0ICYmICFTRUFSQ0hfUkVMQVRFRC50ZXN0KGxpbmsudGV4dCkpIHtcbiAgICAgICAgYXZhaWxhYmxlVGFyZ2V0cy5wdXNoKHsgdGV4dDogbGluay50ZXh0LCBlbGVtZW50VHlwZTogJ2xpbmsnLCBjb25maWRlbmNlOiA1MCwgYWN0aW9uOiAnY2xpY2snIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGlucCBvZiBwYWdlLmlucHV0cykge1xuICAgICAgaWYgKCFpbnAudmlzaWJsZSkgY29udGludWU7XG4gICAgICBhdmFpbGFibGVUYXJnZXRzLnB1c2goeyB0ZXh0OiBpbnAucGxhY2Vob2xkZXIgfHwgaW5wLmxhYmVsIHx8IGlucC5uYW1lIHx8ICdpbnB1dCcsIGVsZW1lbnRUeXBlOiAnaW5wdXQnLCBjb25maWRlbmNlOiA0NSwgYWN0aW9uOiAnaW5wdXQnIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGFnZVR5cGUsXG4gICAgcGFnZVB1cnBvc2UsXG4gICAgdXJsOiBwYWdlLnVybCxcbiAgICB0aXRsZTogcGFnZS50aXRsZSxcbiAgICBkb21haW46IHBhZ2UuZG9tYWluLFxuICAgIG1haW5IZWFkaW5nLFxuICAgIHZpc2libGVFcnJvcnM6IFsuLi5wYWdlLmVycm9yTWVzc2FnZXMsIC4uLnBhZ2UudmFsaWRhdGlvbk1lc3NhZ2VzXSxcbiAgICBzdWNjZXNzTWVzc2FnZXM6IHBhZ2Uuc3VjY2Vzc01lc3NhZ2VzLFxuICAgIHZhbGlkYXRpb25NZXNzYWdlczogcGFnZS52YWxpZGF0aW9uTWVzc2FnZXMsXG4gICAgaGFzQWN0aXZlTW9kYWw6IHBhZ2UuZGlhbG9ncy5sZW5ndGggPiAwLFxuICAgIGhhc0FjdGl2ZURpYWxvZzogcGFnZS5kaWFsb2dzLmxlbmd0aCA+IDAsXG4gICAgaGFzUGFzc3dvcmRGaWVsZCxcbiAgICBoYXNFbWFpbEZpZWxkLFxuICAgIGhhc1NlYXJjaEZpZWxkLFxuICAgIGhhc0Zvcm0sXG4gICAgc3VibWl0QnV0dG9uVGV4dCxcbiAgICBsb2dpbkJ1dHRvbixcbiAgICBzaWdudXBCdXR0b24sXG4gICAgYXV0aElucHV0cyxcbiAgICBmb3JtSW5wdXRzLFxuICAgIGRpc2FibGVkQnV0dG9uczogcGFnZS5kaXNhYmxlZEJ1dHRvbnMubWFwKChiKSA9PiBiLnRleHQpLFxuICAgIGJyZWFkY3J1bWJzOiBwYWdlLmJyZWFkY3J1bWJzLFxuICAgIHRvYXN0czogcGFnZS50b2FzdHMsXG4gICAgYXZhaWxhYmxlVGFyZ2V0czogYXZhaWxhYmxlVGFyZ2V0cy5zbGljZSgwLCAxMCksXG4gICAgd29ya2Zsb3dIaW50OiBwYWdlLmFjdGl2ZVdvcmtmbG93IHx8ICcnLFxuICB9O1xufVxuXG50eXBlIE1hdGNoZWRCdXR0b24gPSB7IHRleHQ6IHN0cmluZyB9IHwgbnVsbDtcbmZ1bmN0aW9uIGZpbmRCdG4ocGFnZTogUGFnZURhdGEsIHBhdHRlcm46IFJlZ0V4cCk6IE1hdGNoZWRCdXR0b24ge1xuICBmb3IgKGNvbnN0IGJ0biBvZiBwYWdlLmJ1dHRvbnMpIHtcbiAgICBpZiAoYnRuLnZpc2libGUgJiYgcGF0dGVybi50ZXN0KGJ0bi50ZXh0KSkgcmV0dXJuIHsgdGV4dDogYnRuLnRleHQgfTtcbiAgfVxuICBmb3IgKGNvbnN0IGxpbmsgb2YgcGFnZS5saW5rcykge1xuICAgIGlmIChsaW5rLnZpc2libGUgJiYgcGF0dGVybi50ZXN0KGxpbmsudGV4dCkpIHJldHVybiB7IHRleHQ6IGxpbmsudGV4dCB9O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiB0ZXh0T2YoaW5wOiB7IHBsYWNlaG9sZGVyPzogc3RyaW5nOyBsYWJlbD86IHN0cmluZzsgbmFtZT86IHN0cmluZzsgdHlwZT86IHN0cmluZyB9KTogc3RyaW5nIHtcbiAgcmV0dXJuIChpbnAucGxhY2Vob2xkZXIgfHwgaW5wLmxhYmVsIHx8IGlucC5uYW1lIHx8IGlucC50eXBlIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBkZXRlY3RQYWdlVHlwZShcbiAgcGFnZTogUGFnZURhdGEsXG4gIGdvYWxMb3dlcjogc3RyaW5nLFxuICBkZXBzOiB7XG4gICAgaGFzUGFzc3dvcmRGaWVsZDogYm9vbGVhbjsgaGFzRW1haWxGaWVsZDogYm9vbGVhbjsgaGFzU2VhcmNoRmllbGQ6IGJvb2xlYW47IGhhc0Zvcm06IGJvb2xlYW47XG4gICAgbG9naW5CdXR0b246IHsgdGV4dDogc3RyaW5nIH0gfCBudWxsOyBzaWdudXBCdXR0b246IHsgdGV4dDogc3RyaW5nIH0gfCBudWxsO1xuICAgIHN1Ym1pdEJ1dHRvbjogeyB0ZXh0OiBzdHJpbmcgfSB8IG51bGw7IG1haW5IZWFkaW5nOiBzdHJpbmc7XG4gICAgaXNBdXRoR29hbDogYm9vbGVhbjsgaXNTaWdudXBHb2FsOiBib29sZWFuOyBpc0NyZWF0ZUdvYWw6IGJvb2xlYW47IGlzU2VhcmNoR29hbDogYm9vbGVhbjtcbiAgICBpc0lzc3VlR29hbDogYm9vbGVhbjsgaXNDaGVja291dEdvYWw6IGJvb2xlYW47IGlzU2V0dGluZ3NHb2FsOiBib29sZWFuO1xuICAgIHVybExvd2VyOiBzdHJpbmc7XG4gIH1cbik6IFBhZ2VUeXBlIHtcbiAgY29uc3QgeyBoYXNQYXNzd29yZEZpZWxkLCBoYXNFbWFpbEZpZWxkLCBoYXNTZWFyY2hGaWVsZCwgaGFzRm9ybSxcbiAgICBsb2dpbkJ1dHRvbiwgc2lnbnVwQnV0dG9uLCBzdWJtaXRCdXR0b24sIG1haW5IZWFkaW5nLFxuICAgIGlzQXV0aEdvYWwsIGlzU2lnbnVwR29hbCwgaXNDcmVhdGVHb2FsLCBpc1NlYXJjaEdvYWwsXG4gICAgaXNJc3N1ZUdvYWwsIGlzQ2hlY2tvdXRHb2FsLCBpc1NldHRpbmdzR29hbCwgdXJsTG93ZXIgfSA9IGRlcHM7XG5cbiAgY29uc3QgdXJsID0gdXJsTG93ZXI7XG4gIGNvbnN0IGhhc0Vycm9ycyA9IHBhZ2UuZXJyb3JNZXNzYWdlcy5sZW5ndGggPiAwIHx8IHBhZ2UudmFsaWRhdGlvbk1lc3NhZ2VzLmxlbmd0aCA+IDA7XG4gIGNvbnN0IHB1cnBvc2UgPSBwYWdlLnBhZ2VQdXJwb3NlLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IHdmID0gcGFnZS5hY3RpdmVXb3JrZmxvdztcblxuICBpZiAod2YgPT09ICdsb2dpbicgfHwgcHVycG9zZS5pbmNsdWRlcygnbG9naW4nKSB8fCAoaXNBdXRoR29hbCAmJiAoaGFzUGFzc3dvcmRGaWVsZCB8fCAobG9naW5CdXR0b24gJiYgIXNpZ251cEJ1dHRvbikpKSkge1xuICAgIGlmIChoYXNQYXNzd29yZEZpZWxkIHx8IGhhc0VtYWlsRmllbGQgfHwgaGFzRm9ybSkgcmV0dXJuICdsb2dpbic7XG4gICAgaWYgKGxvZ2luQnV0dG9uKSByZXR1cm4gJ2xvZ2luJztcbiAgfVxuXG4gIGlmICh3ZiA9PT0gJ3NpZ251cCcgfHwgcHVycG9zZS5pbmNsdWRlcygncmVnaXN0cmF0aW9uJykgfHwgaXNTaWdudXBHb2FsKSByZXR1cm4gJ3NpZ251cCc7XG5cbiAgaWYgKGlzQ3JlYXRlR29hbCAmJiBpc0lzc3VlR29hbCkge1xuICAgIGlmICh1cmwuaW5jbHVkZXMoJy9pc3N1ZXMvbmV3JykgfHwgdXJsLmluY2x1ZGVzKCcvbmV3L2lzc3VlJykgfHwgdXJsLmluY2x1ZGVzKCcvaXNzdWVzL25ldy9jaG9vc2UnKSkgcmV0dXJuICdpc3N1ZV9mb3JtJztcbiAgICBpZiAoL1xcL2lzc3Vlcz8oXFwvfCQpLy50ZXN0KHVybCkgJiYgIXVybC5pbmNsdWRlcygnL25ldycpKSByZXR1cm4gJ2lzc3Vlc19saXN0JztcbiAgICBpZiAodXJsLmluY2x1ZGVzKCcvcHVsbHMnKSAmJiAhdXJsLmluY2x1ZGVzKCcvbmV3JykpIHJldHVybiAncHVsbF9yZXF1ZXN0cyc7XG4gICAgaWYgKC9cXC9bXi9dK1xcL1teL10rKFxcL3wkKS8udGVzdCh1cmwpICYmICF1cmwuaW5jbHVkZXMoJ2lzc3VlcycpICYmICF1cmwuaW5jbHVkZXMoJ3B1bGxzJykpIHJldHVybiAncmVwbyc7XG4gICAgaWYgKHVybCA9PT0gJ2h0dHBzOi8vZ2l0aHViLmNvbS8nIHx8IHVybCA9PT0gJ2h0dHBzOi8vZ2l0aHViLmNvbScgfHwgL15odHRwcz86XFwvXFwvZ2l0aHViXFwuY29tXFwvPyQvLnRlc3QodXJsKSkgcmV0dXJuICdkYXNoYm9hcmQnO1xuICB9XG5cbiAgaWYgKGlzQ2hlY2tvdXRHb2FsKSB7XG4gICAgaWYgKHVybC5pbmNsdWRlcygnL2NoZWNrb3V0JykgfHwgdXJsLmluY2x1ZGVzKCcvcGF5bWVudCcpIHx8IHVybC5pbmNsdWRlcygnL3JldmlldycpKSByZXR1cm4gJ2NoZWNrb3V0JztcbiAgICBpZiAodXJsLmluY2x1ZGVzKCcvY2FydCcpKSByZXR1cm4gJ2NhcnQnO1xuICAgIGlmIChwdXJwb3NlLmluY2x1ZGVzKCdjaGVja291dCcpIHx8IHB1cnBvc2UuaW5jbHVkZXMoJ3BheW1lbnQnKSkgcmV0dXJuICdjaGVja291dCc7XG4gIH1cblxuICBpZiAoaXNTZXR0aW5nc0dvYWwgfHwgd2YgPT09ICdzZXR0aW5ncycgfHwgcHVycG9zZS5pbmNsdWRlcygnc2V0dGluZ3MnKSB8fCBwdXJwb3NlLmluY2x1ZGVzKCdwcm9maWxlJykpIHJldHVybiAnc2V0dGluZ3MnO1xuXG4gIGlmIChpc1NlYXJjaEdvYWwgfHwgaGFzU2VhcmNoRmllbGQpIHJldHVybiAnc2VhcmNoJztcbiAgaWYgKGhhc0Vycm9ycykgcmV0dXJuICdlcnJvcl9wYWdlJztcbiAgaWYgKGhhc1Bhc3N3b3JkRmllbGQgfHwgaGFzRW1haWxGaWVsZCB8fCAobG9naW5CdXR0b24gJiYgaGFzRm9ybSkpIHJldHVybiAnbG9naW4nO1xuICBpZiAoc2lnbnVwQnV0dG9uICYmIGhhc0Zvcm0pIHJldHVybiAnc2lnbnVwJztcbiAgaWYgKHN1Ym1pdEJ1dHRvbiAmJiBoYXNGb3JtICYmICFsb2dpbkJ1dHRvbiAmJiAhc2lnbnVwQnV0dG9uKSByZXR1cm4gJ2Zvcm0nO1xuICBpZiAoaGFzRm9ybSkgcmV0dXJuICdmb3JtJztcblxuICBjb25zdCBoZWFkaW5nVGV4dCA9IG1haW5IZWFkaW5nLnRvTG93ZXJDYXNlKCk7XG4gIGlmICgvZGFzaGJvYXJkfG92ZXJ2aWV3fGhvbWV8ZmVlZHxpbmJveC9pLnRlc3QoaGVhZGluZ1RleHQpKSByZXR1cm4gJ2Rhc2hib2FyZCc7XG4gIGlmICgvc2VhcmNofGZpbmR8YnJvd3NlfHJlc3VsdHMvaS50ZXN0KGhlYWRpbmdUZXh0KSkgcmV0dXJuICdzZWFyY2hfcmVzdWx0cyc7XG5cbiAgaWYgKHBhZ2UubGlua3MuZmlsdGVyKChsKSA9PiBsLnZpc2libGUpLmxlbmd0aCA+IDUpIHJldHVybiAnbGFuZGluZyc7XG4gIGlmIChwYWdlLmJ1dHRvbnMuZmlsdGVyKChiKSA9PiBiLnZpc2libGUpLmxlbmd0aCA+IDMpIHJldHVybiAnbGFuZGluZyc7XG5cbiAgcmV0dXJuICd1bmtub3duJztcbn1cbiIsImltcG9ydCB0eXBlIHsgUGFnZVN0YXRlLCBFeHBsb3Jlck1lbW9yeSwgSGlnaGxpZ2h0VGFyZ2V0IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtmbG93QWN0aW9uIHtcbiAgaGlnaGxpZ2h0VGFyZ2V0OiBIaWdobGlnaHRUYXJnZXQgfCBudWxsO1xuICBpbnN0cnVjdGlvbjogc3RyaW5nO1xuICBkZXRhaWxzOiBzdHJpbmdbXTtcbiAgc3VtbWFyeTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtmbG93U3RhZ2Uge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIGlzT25UaGlzUGFnZShzdGF0ZTogUGFnZVN0YXRlKTogYm9vbGVhbjtcbiAgZ2V0QWN0aW9uKHN0YXRlOiBQYWdlU3RhdGUpOiBXb3JrZmxvd0FjdGlvbiB8IG51bGw7XG4gIGlzQ29tcGxldGUoc3RhdGU6IFBhZ2VTdGF0ZSwgbWVtb3J5OiBFeHBsb3Jlck1lbW9yeSk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV29ya2Zsb3cge1xuICBuYW1lOiBzdHJpbmc7XG4gIGdvYWxQYXR0ZXJuOiBSZWdFeHA7XG4gIHN0YWdlczogV29ya2Zsb3dTdGFnZVtdO1xufVxuXG5mdW5jdGlvbiBmaW5kVGFyZ2V0KHN0YXRlOiBQYWdlU3RhdGUsIHBhdHRlcm46IFJlZ0V4cCk6IHsgdGV4dDogc3RyaW5nOyBlbGVtZW50VHlwZTogc3RyaW5nOyBjb25maWRlbmNlOiBudW1iZXIgfSB8IG51bGwge1xuICBmb3IgKGNvbnN0IHQgb2Ygc3RhdGUuYXZhaWxhYmxlVGFyZ2V0cykge1xuICAgIGlmIChwYXR0ZXJuLnRlc3QodC50ZXh0KSkgcmV0dXJuIHQ7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGZpbmRUYXJnZXRCeVR5cGUoc3RhdGU6IFBhZ2VTdGF0ZSwgZWxlbWVudFR5cGU6IHN0cmluZyk6IHsgdGV4dDogc3RyaW5nOyBlbGVtZW50VHlwZTogc3RyaW5nOyBjb25maWRlbmNlOiBudW1iZXIgfSB8IG51bGwge1xuICBjb25zdCB0YXJnZXQgPSBzdGF0ZS5hdmFpbGFibGVUYXJnZXRzLmZpbmQoKHQpID0+IHQuZWxlbWVudFR5cGUgPT09IGVsZW1lbnRUeXBlKTtcbiAgcmV0dXJuIHRhcmdldCB8fCBudWxsO1xufVxuXG5mdW5jdGlvbiBoYXNVcmxDaGFuZ2VkKG1lbW9yeTogRXhwbG9yZXJNZW1vcnksIHN0YXRlOiBQYWdlU3RhdGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIG1lbW9yeS5wcmV2aW91c1VybCAhPT0gJycgJiYgc3RhdGUudXJsICE9PSBtZW1vcnkucHJldmlvdXNVcmw7XG59XG5cbmNvbnN0IGxvZ2luV29ya2Zsb3c6IFdvcmtmbG93ID0ge1xuICBuYW1lOiAnbG9naW4nLFxuICBnb2FsUGF0dGVybjogL2xvZ2lufHNpZ25cXHMqaW58bG9nXFxzKmlufHNpZ25pbnxhdXRoZW50aWNhdGV8bG9nXFxzKm1lXFxzKmluL2ksXG4gIHN0YWdlczogW1xuICAgIHtcbiAgICAgIGlkOiAnY2xpY2tfbG9naW4nLFxuICAgICAgbmFtZTogJ09wZW4gTG9naW4gRm9ybScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NsaWNrIHRoZSBzaWduLWluIGJ1dHRvbiB0byBvcGVuIHRoZSBsb2dpbiBmb3JtJyxcbiAgICAgIGlzT25UaGlzUGFnZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGUubG9naW5CdXR0b24gIT09IG51bGwgfHwgc3RhdGUucGFnZVR5cGUgPT09ICdsb2dpbic7XG4gICAgICB9LFxuICAgICAgZ2V0QWN0aW9uKHN0YXRlKSB7XG4gICAgICAgIGlmIChzdGF0ZS5sb2dpbkJ1dHRvbikge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoaWdobGlnaHRUYXJnZXQ6IHsgdGV4dDogc3RhdGUubG9naW5CdXR0b24udGV4dCwgcm9sZTogJ2J1dHRvbicsIGVsZW1lbnRUeXBlOiAnYnV0dG9uJywgY29uZmlkZW5jZTogOTUgfSxcbiAgICAgICAgICAgIGluc3RydWN0aW9uOiBgQ2xpY2sgdGhlICoqJHtzdGF0ZS5sb2dpbkJ1dHRvbi50ZXh0fSoqIGJ1dHRvbiBoaWdobGlnaHRlZCBvbiB5b3VyIHNjcmVlbi4gSXQncyB1c3VhbGx5IGluIHRoZSB0b3AtcmlnaHQgY29ybmVyLmAsXG4gICAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAgIGBUaGUgKioke3N0YXRlLmxvZ2luQnV0dG9uLnRleHR9KiogYnV0dG9uIHdpbGwgb3BlbiBhIHNpZ24taW4gZm9ybSB3aGVyZSB5b3UgY2FuIGVudGVyIHlvdXIgY3JlZGVudGlhbHMuYCxcbiAgICAgICAgICAgICAgYE9uY2UgdGhlIGZvcm0gYXBwZWFycywgSSdsbCBndWlkZSB5b3UgdGhyb3VnaCBmaWxsaW5nIGluIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkLmAsXG4gICAgICAgICAgICAgIGBBZnRlciB5b3Ugc2lnbiBpbiwgSSdsbCBhdXRvbWF0aWNhbGx5IGRldGVjdCB0aGUgbmV4dCBwYWdlIGFuZCBjb250aW51ZSBndWlkaW5nIHlvdS5gLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHN1bW1hcnk6IGBZb3UncmUgb24gKioke3N0YXRlLmRvbWFpbn0qKiDigJQgY2xpY2sgdGhlIHNpZ24taW4gYnV0dG9uIHRvIGdldCBzdGFydGVkLmAsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0YXJnZXQgPSBmaW5kVGFyZ2V0KHN0YXRlLCAvbG9naW58c2lnblxccyppbnxsb2dcXHMqaW4vaSk7XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGlnaGxpZ2h0VGFyZ2V0OiB7IHRleHQ6IHRhcmdldC50ZXh0LCByb2xlOiAnYnV0dG9uJywgZWxlbWVudFR5cGU6IHRhcmdldC5lbGVtZW50VHlwZSBhcyBhbnksIGNvbmZpZGVuY2U6IHRhcmdldC5jb25maWRlbmNlIH0sXG4gICAgICAgICAgICBpbnN0cnVjdGlvbjogYENsaWNrIHRoZSAqKiR7dGFyZ2V0LnRleHR9KiogYnV0dG9uIGhpZ2hsaWdodGVkIG9uIHlvdXIgc2NyZWVuLmAsXG4gICAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAgIGBUaGlzIHdpbGwgb3BlbiB0aGUgc2lnbi1pbiBmb3JtIHdoZXJlIHlvdSBjYW4gZW50ZXIgeW91ciBlbWFpbCBhZGRyZXNzIGFuZCBwYXNzd29yZC5gLFxuICAgICAgICAgICAgICBgQWZ0ZXIgeW91IHNpZ24gaW4sIEknbGwgYXV0b21hdGljYWxseSBjb250aW51ZSBndWlkaW5nIHlvdS5gLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHN1bW1hcnk6IGBZb3UncmUgb24gKioke3N0YXRlLmRvbWFpbn0qKiDigJQgbGV0J3Mgc2lnbiB5b3UgaW4uYCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSxcbiAgICAgIGlzQ29tcGxldGUoc3RhdGUsIG1lbW9yeSkge1xuICAgICAgICBpZiAoc3RhdGUucGFnZVR5cGUgPT09ICdsb2dpbicpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAoc3RhdGUuaGFzQWN0aXZlRGlhbG9nIHx8IHN0YXRlLmhhc0FjdGl2ZU1vZGFsKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKHN0YXRlLmhhc1Bhc3N3b3JkRmllbGQgJiYgc3RhdGUuaGFzRm9ybSkgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBoYXNVcmxDaGFuZ2VkKG1lbW9yeSwgc3RhdGUpO1xuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnZmlsbF9jcmVkZW50aWFscycsXG4gICAgICBuYW1lOiAnU2lnbiBJbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0VudGVyIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkLCB0aGVuIGNsaWNrIHNpZ24gaW4nLFxuICAgICAgaXNPblRoaXNQYWdlKHN0YXRlKSB7XG4gICAgICAgIGlmIChzdGF0ZS5wYWdlVHlwZSA9PT0gJ2xvZ2luJykgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChzdGF0ZS5oYXNQYXNzd29yZEZpZWxkICYmIHN0YXRlLmhhc0VtYWlsRmllbGQpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAoc3RhdGUuaGFzQWN0aXZlRGlhbG9nICYmIChzdGF0ZS5oYXNQYXNzd29yZEZpZWxkIHx8IHN0YXRlLmF1dGhJbnB1dHMubGVuZ3RoID49IDIpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIGdldEFjdGlvbihzdGF0ZSkge1xuICAgICAgICBjb25zdCBwd0ZpZWxkID0gc3RhdGUuYXV0aElucHV0cy5maW5kKChpKSA9PiBpLnR5cGUgPT09ICdwYXNzd29yZCcpO1xuICAgICAgICBjb25zdCBlbWFpbEZpZWxkID0gc3RhdGUuYXV0aElucHV0cy5maW5kKChpKSA9PiBpLnR5cGUgPT09ICdlbWFpbCcgfHwgL2VtYWlsfHVzZXJ8cGhvbmV8bW9iaWxlL2kudGVzdChpLmxhYmVsICsgJyAnICsgaS5wbGFjZWhvbGRlcikpO1xuICAgICAgICBjb25zdCBmaXJzdEZpZWxkID0gZW1haWxGaWVsZCB8fCBzdGF0ZS5hdXRoSW5wdXRzLmZpbmQoKGkpID0+IGkudHlwZSAhPT0gJ3Bhc3N3b3JkJykgfHwgc3RhdGUuYXV0aElucHV0c1swXTtcblxuICAgICAgICBjb25zdCBkZXRhaWxzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBpZiAoZmlyc3RGaWVsZCkge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gZmlyc3RGaWVsZC5wbGFjZWhvbGRlciB8fCBmaXJzdEZpZWxkLmxhYmVsIHx8ICdFbWFpbCBvciB1c2VybmFtZSc7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKGBUeXBlIHlvdXIgKioke2xhYmVsfSoqIGluIHRoZSBmaXJzdCBmaWVsZC5gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZXRhaWxzLnB1c2goYEVudGVyIHlvdXIgKiplbWFpbCBhZGRyZXNzIG9yIHVzZXJuYW1lKiogaW4gdGhlIGZpcnN0IGlucHV0IGZpZWxkLmApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwd0ZpZWxkKSB7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBwd0ZpZWxkLnBsYWNlaG9sZGVyIHx8IHB3RmllbGQubGFiZWwgfHwgJ1Bhc3N3b3JkJztcbiAgICAgICAgICBkZXRhaWxzLnB1c2goYFR5cGUgeW91ciAqKiR7bGFiZWx9KiogaW4gdGhlIHBhc3N3b3JkIGZpZWxkLmApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRldGFpbHMucHVzaChgVHlwZSB5b3VyICoqcGFzc3dvcmQqKiBpbiB0aGUgcGFzc3dvcmQgZmllbGQuYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaWduSW5CdG4gPSBmaW5kVGFyZ2V0KHN0YXRlLCAvc2lnblxccyppbnxsb2dpbnxsb2dcXHMqaW58Y29udGludWV8c3VibWl0L2kpO1xuICAgICAgICBpZiAoc2lnbkluQnRuKSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKGBDbGljayAqKiR7c2lnbkluQnRuLnRleHR9KiogdG8gY29tcGxldGUgc2lnbi1pbi5gKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5zdWJtaXRCdXR0b25UZXh0KSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKGBDbGljayAqKiR7c3RhdGUuc3VibWl0QnV0dG9uVGV4dH0qKiB0byBjb21wbGV0ZSBzaWduLWluLmApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRldGFpbHMucHVzaChgQ2xpY2sgdGhlICoqU2lnbiBJbioqIGJ1dHRvbiB0byBjb21wbGV0ZSBzaWduLWluLmApO1xuICAgICAgICB9XG4gICAgICAgIGRldGFpbHMucHVzaChgQWZ0ZXIgc2lnbmluZyBpbiwgSSdsbCBhdXRvbWF0aWNhbGx5IGRldGVjdCB0aGUgbmV4dCBwYWdlIGFuZCBjb250aW51ZSBndWlkaW5nIHlvdS5gKTtcblxuICAgICAgICBjb25zdCBoaWdobGlnaHRUYXJnZXQ6IEhpZ2hsaWdodFRhcmdldCB8IG51bGwgPSBmaXJzdEZpZWxkXG4gICAgICAgICAgPyB7IHRleHQ6IGZpcnN0RmllbGQucGxhY2Vob2xkZXIgfHwgZmlyc3RGaWVsZC5sYWJlbCB8fCAnZW1haWwnLCByb2xlOiAndGV4dGJveCcsIGVsZW1lbnRUeXBlOiAnaW5wdXQnLCBjb25maWRlbmNlOiA4NSB9XG4gICAgICAgICAgOiBudWxsO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaGlnaGxpZ2h0VGFyZ2V0LFxuICAgICAgICAgIGluc3RydWN0aW9uOiBgRW50ZXIgeW91ciBjcmVkZW50aWFscyBoZXJlIG9uICoqJHtzdGF0ZS5kb21haW59KiouIFR5cGUgeW91ciBlbWFpbCBhZGRyZXNzIGFuZCBwYXNzd29yZCwgdGhlbiBjbGljayAqKlNpZ24gSW4qKi4gSSdsbCBhdXRvbWF0aWNhbGx5IGRldGVjdCB0aGUgbmV4dCBzdGVwIG9uY2UgeW91J3JlIGxvZ2dlZCBpbi5gLFxuICAgICAgICAgIGRldGFpbHMsXG4gICAgICAgICAgc3VtbWFyeTogYFlvdSdyZSBvbiB0aGUgc2lnbi1pbiBwYWdlIGZvciAqKiR7c3RhdGUuZG9tYWlufSoqIOKAlCBlbnRlciB5b3VyIGNyZWRlbnRpYWxzIHRvIGNvbnRpbnVlLmAsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgaXNDb21wbGV0ZShzdGF0ZSwgX21lbW9yeSkge1xuICAgICAgICBpZiAoc3RhdGUuc3VjY2Vzc01lc3NhZ2VzLmxlbmd0aCA+IDApIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAoc3RhdGUucGFnZVR5cGUgPT09ICdkYXNoYm9hcmQnIHx8IHN0YXRlLnBhZ2VUeXBlID09PSAnbGFuZGluZycpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gaGFzVXJsQ2hhbmdlZChfbWVtb3J5LCBzdGF0ZSk7XG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG59O1xuXG5jb25zdCBzaWdudXBXb3JrZmxvdzogV29ya2Zsb3cgPSB7XG4gIG5hbWU6ICdzaWdudXAnLFxuICBnb2FsUGF0dGVybjogL3JlZ2lzdGVyfHNpZ25cXHMqdXB8Y3JlYXRlXFxzKmFjY291bnQvaSxcbiAgc3RhZ2VzOiBbXG4gICAge1xuICAgICAgaWQ6ICdmaWxsX3NpZ251cF9mb3JtJyxcbiAgICAgIG5hbWU6ICdGaWxsIFJlZ2lzdHJhdGlvbiBGb3JtJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRmlsbCBpbiB0aGUgcmVnaXN0cmF0aW9uIGZvcm0gZmllbGRzJyxcbiAgICAgIGlzT25UaGlzUGFnZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGUucGFnZVR5cGUgPT09ICdzaWdudXAnIHx8IChzdGF0ZS5zaWdudXBCdXR0b24gIT09IG51bGwgJiYgc3RhdGUuaGFzRm9ybSk7XG4gICAgICB9LFxuICAgICAgZ2V0QWN0aW9uKHN0YXRlKSB7XG4gICAgICAgIGNvbnN0IGRldGFpbHM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGNvbnN0IGlucHV0cyA9IHN0YXRlLmZvcm1JbnB1dHMuZmlsdGVyKChpKSA9PiBpLnR5cGUgIT09ICdoaWRkZW4nKTtcbiAgICAgICAgZm9yIChjb25zdCBpbnAgb2YgaW5wdXRzLnNsaWNlKDAsIDUpKSB7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBpbnAucGxhY2Vob2xkZXIgfHwgaW5wLmxhYmVsIHx8IGlucC5uYW1lIHx8ICdmaWVsZCc7XG4gICAgICAgICAgaWYgKGlucC50eXBlID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgICBpZiAoIWRldGFpbHMuc29tZSgoZCkgPT4gZC5pbmNsdWRlcygncGFzc3dvcmQnKSkpIGRldGFpbHMucHVzaChgQ2hvb3NlIGEgc3Ryb25nIHBhc3N3b3JkIGFuZCBlbnRlciBpdCBpbiB0aGUgKioke2xhYmVsfSoqIGZpZWxkLmApO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaW5wLnR5cGUgPT09ICdlbWFpbCcpIHtcbiAgICAgICAgICAgIGRldGFpbHMucHVzaChgRW50ZXIgeW91ciBlbWFpbCBhZGRyZXNzIGluIHRoZSAqKiR7bGFiZWx9KiogZmllbGQuYCk7XG4gICAgICAgICAgfSBlbHNlIGlmICghZGV0YWlscy5zb21lKChkKSA9PiBkLmluY2x1ZGVzKGxhYmVsKSkpIHtcbiAgICAgICAgICAgIGRldGFpbHMucHVzaChgRmlsbCBpbiAqKiR7bGFiZWx9Kioke2lucC5yZXF1aXJlZCA/ICcgKHJlcXVpcmVkKScgOiAnJ30uYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3VibWl0QnRuID0gZmluZFRhcmdldChzdGF0ZSwgL2NyZWF0ZXxzaWduXFxzKnVwfHJlZ2lzdGVyfHN1Ym1pdHxjb250aW51ZS9pKSB8fCBmaW5kVGFyZ2V0KHN0YXRlLCAvc3VibWl0fGNvbnRpbnVlfG5leHQvaSk7XG4gICAgICAgIGlmIChzdWJtaXRCdG4pIHtcbiAgICAgICAgICBkZXRhaWxzLnB1c2goYEZpbmFsbHksIGNsaWNrICoqJHtzdWJtaXRCdG4udGV4dH0qKiB0byBjcmVhdGUgeW91ciBhY2NvdW50LmApO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLnN1Ym1pdEJ1dHRvblRleHQpIHtcbiAgICAgICAgICBkZXRhaWxzLnB1c2goYEZpbmFsbHksIGNsaWNrICoqJHtzdGF0ZS5zdWJtaXRCdXR0b25UZXh0fSoqIHRvIGNyZWF0ZSB5b3VyIGFjY291bnQuYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKGBGaW5hbGx5LCBjbGljayB0aGUgKipTaWduIFVwKiogYnV0dG9uIHRvIGNyZWF0ZSB5b3VyIGFjY291bnQuYCk7XG4gICAgICAgIH1cbiAgICAgICAgZGV0YWlscy5wdXNoKGBBZnRlciByZWdpc3RyYXRpb24sIEknbGwgYXV0b21hdGljYWxseSBjb250aW51ZSBndWlkaW5nIHlvdS5gKTtcblxuICAgICAgICBjb25zdCBmaXJzdElucHV0ID0gaW5wdXRzWzBdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhpZ2hsaWdodFRhcmdldDogZmlyc3RJbnB1dFxuICAgICAgICAgICAgPyB7IHRleHQ6IGZpcnN0SW5wdXQucGxhY2Vob2xkZXIgfHwgZmlyc3RJbnB1dC5sYWJlbCB8fCAnZmlyc3QgZmllbGQnLCByb2xlOiAndGV4dGJveCcsIGVsZW1lbnRUeXBlOiAnaW5wdXQnLCBjb25maWRlbmNlOiA4MCB9XG4gICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgaW5zdHJ1Y3Rpb246IGBMZXQncyBzZXQgdXAgeW91ciBhY2NvdW50IG9uICoqJHtzdGF0ZS5kb21haW59KiouIEZpbGwgaW4gdGhlIHJlcXVpcmVkIGluZm9ybWF0aW9uIGJlbG93IHRvIGNyZWF0ZSB5b3VyIGFjY291bnQuYCxcbiAgICAgICAgICBkZXRhaWxzLFxuICAgICAgICAgIHN1bW1hcnk6IGBZb3UncmUgb24gdGhlIHJlZ2lzdHJhdGlvbiBwYWdlIGZvciAqKiR7c3RhdGUuZG9tYWlufSoqIOKAlCBsZXQncyBjcmVhdGUgeW91ciBhY2NvdW50LmAsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgaXNDb21wbGV0ZShzdGF0ZSwgX21lbW9yeSkge1xuICAgICAgICBpZiAoc3RhdGUuc3VjY2Vzc01lc3NhZ2VzLmxlbmd0aCA+IDApIHJldHVybiB0cnVlO1xuICAgICAgICBjb25zdCB1cmxDaGFuZ2VkID0gaGFzVXJsQ2hhbmdlZChfbWVtb3J5LCBzdGF0ZSk7XG4gICAgICAgIGlmICh1cmxDaGFuZ2VkKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICB9LFxuICBdLFxufTtcblxuY29uc3QgY3JlYXRlSXNzdWVXb3JrZmxvdzogV29ya2Zsb3cgPSB7XG4gIG5hbWU6ICdjcmVhdGVfaXNzdWUnLFxuICBnb2FsUGF0dGVybjogL2NyZWF0ZVxccysoYVxccyspPyhuZXdcXHMrKT8oaXNzdWV8cHVsbFxccypyZXF1ZXN0fHByKVxcYi9pLFxuICBzdGFnZXM6IFtcbiAgICB7XG4gICAgICBpZDogJ29wZW5fcmVwbycsXG4gICAgICBuYW1lOiAnT3BlbiBSZXBvc2l0b3J5JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTmF2aWdhdGUgdG8gdGhlIHJlcG9zaXRvcnkgd2hlcmUgeW91IHdhbnQgdG8gY3JlYXRlIHRoZSBpdGVtJyxcbiAgICAgIGlzT25UaGlzUGFnZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGUucGFnZVR5cGUgPT09ICdkYXNoYm9hcmQnIHx8IHN0YXRlLnBhZ2VUeXBlID09PSAnbGFuZGluZycgfHwgc3RhdGUucGFnZVR5cGUgPT09ICd1bmtub3duJztcbiAgICAgIH0sXG4gICAgICBnZXRBY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZmluZFRhcmdldChzdGF0ZSwgL3JlcG98cHJvamVjdHxyZXBvc2l0b3J5L2kpO1xuICAgICAgICBjb25zdCBhbnlMaW5rID0gZmluZFRhcmdldEJ5VHlwZShzdGF0ZSwgJ2xpbmsnKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoaWdobGlnaHRUYXJnZXQ6IHRhcmdldFxuICAgICAgICAgICAgPyB7IHRleHQ6IHRhcmdldC50ZXh0LCByb2xlOiAnbGluaycsIGVsZW1lbnRUeXBlOiAnbGluaycsIGNvbmZpZGVuY2U6IHRhcmdldC5jb25maWRlbmNlIH1cbiAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICBpbnN0cnVjdGlvbjogYFRvIGNyZWF0ZSBhbiAke3N0YXRlLnVybC5pbmNsdWRlcygnZ2l0aHViJykgPyAnaXNzdWUnIDogJ2l0ZW0nfSwgeW91IGZpcnN0IG5lZWQgdG8gb3BlbiB0aGUgcmVwb3NpdG9yeSBvciBwcm9qZWN0IHdoZXJlIGl0IGJlbG9uZ3MuIExvb2sgZm9yIGEgcmVwb3NpdG9yeSBpbiB5b3VyIGxpc3Qgb3IgdXNlIHRoZSBzZWFyY2ggYmFyLmAsXG4gICAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgICAgYCR7c3RhdGUudXJsLmluY2x1ZGVzKCdnaXRodWInKSA/ICdJc3N1ZXMgYW5kIHB1bGwgcmVxdWVzdHMgYmVsb25nIHRvIGluZGl2aWR1YWwgcmVwb3NpdG9yaWVzLicgOiAnSXRlbXMgYmVsb25nIHRvIHNwZWNpZmljIHByb2plY3RzLid9YCxcbiAgICAgICAgICAgIGBGaW5kIGFuZCBjbGljayBvbiB0aGUgKipyZXBvc2l0b3J5Kiogb3IgKipwcm9qZWN0Kiogd2hlcmUgeW91IHdhbnQgdG8gY3JlYXRlIHRoaXMuYCxcbiAgICAgICAgICAgIGBPbmNlIHlvdSdyZSBpbnNpZGUsIEknbGwgZ3VpZGUgeW91IHRvIHRoZSBuZXh0IHN0ZXAuYCxcbiAgICAgICAgICAgIGBJJ2xsIGF1dG9tYXRpY2FsbHkgZGV0ZWN0IHdoZW4geW91IG5hdmlnYXRlIHRvIGEgcmVwb3NpdG9yeSBhbmQgY29udGludWUgZ3VpZGluZyB5b3UuYCxcbiAgICAgICAgICBdLFxuICAgICAgICAgIHN1bW1hcnk6IGBZb3UncmUgb24gKioke3N0YXRlLmRvbWFpbn0qKiDigJQgZmlyc3QsIG9wZW4gdGhlIHJlcG9zaXRvcnkgd2hlcmUgdGhlIGl0ZW0gYmVsb25ncy5gLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGlzQ29tcGxldGUoc3RhdGUsIF9tZW1vcnkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnBhZ2VUeXBlID09PSAncmVwbycgfHwgc3RhdGUucGFnZVR5cGUgPT09ICdpc3N1ZXNfbGlzdCcgfHwgc3RhdGUucGFnZVR5cGUgPT09ICdpc3N1ZV9mb3JtJyB8fCBoYXNVcmxDaGFuZ2VkKF9tZW1vcnksIHN0YXRlKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ29wZW5faXNzdWVzX3RhYicsXG4gICAgICBuYW1lOiAnT3BlbiBJc3N1ZXMgVGFiJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2xpY2sgdGhlIElzc3VlcyB0YWIgaW4gdGhlIHJlcG9zaXRvcnknLFxuICAgICAgaXNPblRoaXNQYWdlKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZS5wYWdlVHlwZSA9PT0gJ3JlcG8nIHx8IChzdGF0ZS5wYWdlVHlwZSA9PT0gJ3Vua25vd24nICYmIC9cXC9bXi9dK1xcL1teL10rLy50ZXN0KHN0YXRlLnVybCkpO1xuICAgICAgfSxcbiAgICAgIGdldEFjdGlvbihzdGF0ZSkge1xuICAgICAgICBjb25zdCBpc3N1ZXNUYWIgPSBmaW5kVGFyZ2V0KHN0YXRlLCAvaXNzdWVzPy9pKTtcbiAgICAgICAgaWYgKGlzc3Vlc1RhYikge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoaWdobGlnaHRUYXJnZXQ6IHsgdGV4dDogaXNzdWVzVGFiLnRleHQsIHJvbGU6ICd0YWInLCBlbGVtZW50VHlwZTogJ3RhYicsIGNvbmZpZGVuY2U6IGlzc3Vlc1RhYi5jb25maWRlbmNlIH0sXG4gICAgICAgICAgICBpbnN0cnVjdGlvbjogYE5vdyBjbGljayB0aGUgKioke2lzc3Vlc1RhYi50ZXh0fSoqIHRhYiBpbiB0aGUgcmVwb3NpdG9yeSBuYXZpZ2F0aW9uIGJhci5gLFxuICAgICAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgICAgICBgVGhlIElzc3VlcyB0YWIgc2hvd3MgYWxsIGN1cnJlbnQgYW5kIHBhc3QgaXNzdWVzIGZvciB0aGlzIHJlcG9zaXRvcnkuYCxcbiAgICAgICAgICAgICAgYE9uY2Ugb24gdGhlIGlzc3VlcyBwYWdlLCBJJ2xsIGd1aWRlIHlvdSB0byBjbGljayAqKk5ldyBJc3N1ZSoqLmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc3VtbWFyeTogYFlvdSdyZSBpbiB0aGUgKioke3N0YXRlLmRvbWFpbn0qKiByZXBvc2l0b3J5IOKAlCBsZXQncyBvcGVuIHRoZSBJc3N1ZXMgdGFiLmAsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhpZ2hsaWdodFRhcmdldDogbnVsbCxcbiAgICAgICAgICBpbnN0cnVjdGlvbjogYExvb2sgZm9yIHRoZSAqKklzc3VlcyoqIHRhYiBuZWFyIHRoZSB0b3Agb2YgdGhlIHJlcG9zaXRvcnkgcGFnZSBhbmQgY2xpY2sgaXQuYCxcbiAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICBgVGhlIElzc3VlcyB0YWIgaXMgdXN1YWxseSBpbiB0aGUgbmF2aWdhdGlvbiBiYXIgYmVsb3cgdGhlIHJlcG9zaXRvcnkgbmFtZS5gLFxuICAgICAgICAgICAgYE9uY2UgeW91J3JlIHRoZXJlLCBJJ2xsIGhlbHAgeW91IGNyZWF0ZSBhIG5ldyBpc3N1ZS5gLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgc3VtbWFyeTogYFlvdSdyZSBpbiB0aGUgcmVwb3NpdG9yeSDigJQgZmluZCBhbmQgY2xpY2sgdGhlICoqSXNzdWVzKiogdGFiLmAsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgaXNDb21wbGV0ZShzdGF0ZSwgX21lbW9yeSkge1xuICAgICAgICByZXR1cm4gc3RhdGUucGFnZVR5cGUgPT09ICdpc3N1ZXNfbGlzdCcgfHwgc3RhdGUucGFnZVR5cGUgPT09ICdpc3N1ZV9mb3JtJztcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2NsaWNrX25ld19pc3N1ZScsXG4gICAgICBuYW1lOiAnQ2xpY2sgTmV3IElzc3VlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2xpY2sgdGhlIE5ldyBJc3N1ZSBidXR0b24nLFxuICAgICAgaXNPblRoaXNQYWdlKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZS5wYWdlVHlwZSA9PT0gJ2lzc3Vlc19saXN0JyB8fCBzdGF0ZS5wYWdlVHlwZSA9PT0gJ3B1bGxfcmVxdWVzdHMnO1xuICAgICAgfSxcbiAgICAgIGdldEFjdGlvbihzdGF0ZSkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBmaW5kVGFyZ2V0KHN0YXRlLCAvbmV3XFxzKyhpc3N1ZXxwdWxsXFxzKnJlcXVlc3QpfGNyZWF0ZS9pKTtcbiAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoaWdobGlnaHRUYXJnZXQ6IHsgdGV4dDogdGFyZ2V0LnRleHQsIHJvbGU6ICdidXR0b24nLCBlbGVtZW50VHlwZTogJ2J1dHRvbicsIGNvbmZpZGVuY2U6IHRhcmdldC5jb25maWRlbmNlIH0sXG4gICAgICAgICAgICBpbnN0cnVjdGlvbjogYENsaWNrIHRoZSAqKiR7dGFyZ2V0LnRleHR9KiogYnV0dG9uIGhpZ2hsaWdodGVkIG9uIHlvdXIgc2NyZWVuLmAsXG4gICAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAgIGBUaGlzIG9wZW5zIHRoZSBmb3JtIHdoZXJlIHlvdSBjYW4gd3JpdGUgdGhlIHRpdGxlIGFuZCBkZXNjcmlwdGlvbi5gLFxuICAgICAgICAgICAgICBgRmlsbCBpbiB0aGUgZGV0YWlscyBhbmQgc3VibWl0IHRvIGNyZWF0ZSB0aGUgaXNzdWUuYCxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzdW1tYXJ5OiBgWW91J3JlIG9uIHRoZSBpc3N1ZXMgbGlzdCDigJQgY2xpY2sgKipOZXcgSXNzdWUqKiB0byBjb250aW51ZS5gLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoaWdobGlnaHRUYXJnZXQ6IG51bGwsXG4gICAgICAgICAgaW5zdHJ1Y3Rpb246IGBDbGljayB0aGUgKipOZXcgSXNzdWUqKiBidXR0b24gb24gdGhpcyBwYWdlLmAsXG4gICAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgICAgYEl0J3MgdXN1YWxseSBhIGdyZWVuIGJ1dHRvbiBuZWFyIHRoZSB0b3AgcmlnaHQgb2YgdGhlIGlzc3VlcyBsaXN0LmAsXG4gICAgICAgICAgICBgRmlsbCBpbiB0aGUgZm9ybSBhbmQgc3VibWl0IHRvIGNyZWF0ZSB5b3VyIGlzc3VlLmAsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBzdW1tYXJ5OiBgTG9vayBmb3IgdGhlICoqTmV3IElzc3VlKiogYnV0dG9uIG9uIHRoaXMgcGFnZS5gLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGlzQ29tcGxldGUoc3RhdGUsIF9tZW1vcnkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnBhZ2VUeXBlID09PSAnaXNzdWVfZm9ybSc7XG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdmaWxsX2lzc3VlX2Zvcm0nLFxuICAgICAgbmFtZTogJ0ZpbGwgSXNzdWUgRm9ybScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1dyaXRlIHRoZSBpc3N1ZSB0aXRsZSBhbmQgZGVzY3JpcHRpb24sIHRoZW4gc3VibWl0JyxcbiAgICAgIGlzT25UaGlzUGFnZShzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGUucGFnZVR5cGUgPT09ICdpc3N1ZV9mb3JtJztcbiAgICAgIH0sXG4gICAgICBnZXRBY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgY29uc3QgdGl0bGVJbnB1dCA9IHN0YXRlLmZvcm1JbnB1dHMuZmluZCgoaSkgPT4gL3RpdGxlfHN1YmplY3QvaS50ZXN0KGkucGxhY2Vob2xkZXIgfHwgaS5sYWJlbCB8fCBpLm5hbWUpKTtcbiAgICAgICAgY29uc3QgYm9keUlucHV0ID0gc3RhdGUuZm9ybUlucHV0cy5maW5kKChpKSA9PiAvZGVzY3JpcHRpb258Ym9keXxjb21tZW50L2kudGVzdChpLnBsYWNlaG9sZGVyIHx8IGkubGFiZWwgfHwgaS5uYW1lKSk7XG5cbiAgICAgICAgY29uc3QgZGV0YWlsczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgaWYgKHRpdGxlSW5wdXQpIHtcbiAgICAgICAgICBkZXRhaWxzLnB1c2goYFdyaXRlIGEgY2xlYXIsIGRlc2NyaXB0aXZlIHRpdGxlIGluIHRoZSAqKiR7dGl0bGVJbnB1dC5wbGFjZWhvbGRlciB8fCB0aXRsZUlucHV0LmxhYmVsIHx8ICd0aXRsZSd9KiogZmllbGQuYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKGBXcml0ZSBhIGNsZWFyLCBkZXNjcmlwdGl2ZSAqKnRpdGxlKiogZm9yIHlvdXIgaXNzdWUuYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJvZHlJbnB1dCkge1xuICAgICAgICAgIGRldGFpbHMucHVzaChgQWRkIGRldGFpbHMgaW4gdGhlICoqJHtib2R5SW5wdXQucGxhY2Vob2xkZXIgfHwgYm9keUlucHV0LmxhYmVsIHx8ICdkZXNjcmlwdGlvbid9KiogZmllbGQg4oCUIGV4cGxhaW4gdGhlIHByb2JsZW0gb3IgZmVhdHVyZSByZXF1ZXN0LmApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRldGFpbHMucHVzaChgQWRkICoqZGV0YWlscyoqIGluIHRoZSBkZXNjcmlwdGlvbiBmaWVsZCDigJQgZXhwbGFpbiB3aGF0IHRoZSBpc3N1ZSBpcyBhYm91dC5gKTtcbiAgICAgICAgfVxuICAgICAgICBkZXRhaWxzLnB1c2goYENsaWNrICoqU3VibWl0IG5ldyBpc3N1ZSoqIHRvIGNyZWF0ZSBpdC5gKTtcblxuICAgICAgICBjb25zdCBmaXJzdEZpZWxkID0gdGl0bGVJbnB1dCB8fCBib2R5SW5wdXQgfHwgc3RhdGUuZm9ybUlucHV0c1swXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoaWdobGlnaHRUYXJnZXQ6IGZpcnN0RmllbGRcbiAgICAgICAgICAgID8geyB0ZXh0OiBmaXJzdEZpZWxkLnBsYWNlaG9sZGVyIHx8IGZpcnN0RmllbGQubGFiZWwgfHwgJ3RpdGxlJywgcm9sZTogJ3RleHRib3gnLCBlbGVtZW50VHlwZTogJ2lucHV0JywgY29uZmlkZW5jZTogODUgfVxuICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgIGluc3RydWN0aW9uOiBgTm93IGZpbGwgaW4gdGhlIGlzc3VlIGZvcm0uIEdpdmUgeW91ciBpc3N1ZSBhIGNsZWFyIHRpdGxlIGFuZCBkZXNjcmlwdGlvbiwgdGhlbiBzdWJtaXQgaXQuYCxcbiAgICAgICAgICBkZXRhaWxzLFxuICAgICAgICAgIHN1bW1hcnk6IGBZb3UncmUgb24gdGhlIG5ldyBpc3N1ZSBmb3JtIOKAlCB3cml0ZSB5b3VyIGlzc3VlIGRldGFpbHMgaGVyZS5gLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGlzQ29tcGxldGUoc3RhdGUsIF9tZW1vcnkpIHtcbiAgICAgICAgaWYgKHN0YXRlLnN1Y2Nlc3NNZXNzYWdlcy5sZW5ndGggPiAwKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKHN0YXRlLnBhZ2VUeXBlID09PSAnaXNzdWVzX2xpc3QnIHx8IHN0YXRlLnBhZ2VUeXBlID09PSAncmVwbycgfHwgc3RhdGUucGFnZVR5cGUgPT09ICdkYXNoYm9hcmQnKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICB9LFxuICBdLFxufTtcblxuY29uc3Qgc2VhcmNoV29ya2Zsb3c6IFdvcmtmbG93ID0ge1xuICBuYW1lOiAnc2VhcmNoJyxcbiAgZ29hbFBhdHRlcm46IC9zZWFyY2h8ZmluZHxsb29rXFxzKmZvcnxsb29rXFxzKnVwfHF1ZXJ5L2ksXG4gIHN0YWdlczogW1xuICAgIHtcbiAgICAgIGlkOiAnZG9fc2VhcmNoJyxcbiAgICAgIG5hbWU6ICdTZWFyY2gnLFxuICAgICAgZGVzY3JpcHRpb246ICdFbnRlciB5b3VyIHNlYXJjaCBxdWVyeScsXG4gICAgICBpc09uVGhpc1BhZ2UoX3N0YXRlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIGdldEFjdGlvbihzdGF0ZSkge1xuICAgICAgICBjb25zdCBzZWFyY2hJbnB1dCA9IHN0YXRlLmF2YWlsYWJsZVRhcmdldHMuZmluZCgodCkgPT4gdC5lbGVtZW50VHlwZSA9PT0gJ2lucHV0JyAmJiAvc2VhcmNofGZpbmQvaS50ZXN0KHQudGV4dCkpO1xuICAgICAgICBpZiAoc2VhcmNoSW5wdXQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGlnaGxpZ2h0VGFyZ2V0OiB7IHRleHQ6IHNlYXJjaElucHV0LnRleHQsIHJvbGU6ICd0ZXh0Ym94JywgZWxlbWVudFR5cGU6ICdpbnB1dCcsIGNvbmZpZGVuY2U6IHNlYXJjaElucHV0LmNvbmZpZGVuY2UgfSxcbiAgICAgICAgICAgIGluc3RydWN0aW9uOiBgVHlwZSB3aGF0IHlvdSdyZSBsb29raW5nIGZvciBpbiB0aGUgKioke3NlYXJjaElucHV0LnRleHR9KiogZmllbGQsIHRoZW4gcHJlc3MgKipFbnRlcioqIG9yIGNsaWNrIHRoZSBzZWFyY2ggYnV0dG9uLmAsXG4gICAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAgIGBFbnRlciB5b3VyIHNlYXJjaCB0ZXJtcyBpbiB0aGUgZmllbGQgaGlnaGxpZ2h0ZWQgb24geW91ciBzY3JlZW4uYCxcbiAgICAgICAgICAgICAgYFByZXNzIEVudGVyIG9yIGNsaWNrIHRoZSBzZWFyY2ggYnV0dG9uIHRvIHNlZSByZXN1bHRzLmAsXG4gICAgICAgICAgICAgIGBJJ2xsIGhlbHAgeW91IG5hdmlnYXRlIHRoZSByZXN1bHRzLmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc3VtbWFyeTogYFlvdSdyZSBvbiAqKiR7c3RhdGUuZG9tYWlufSoqIOKAlCBsZXQncyBzZWFyY2ggZm9yIHdoYXQgeW91IG5lZWQuYCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZmluZFRhcmdldEJ5VHlwZShzdGF0ZSwgJ2lucHV0Jyk7XG4gICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoaWdobGlnaHRUYXJnZXQ6IHsgdGV4dDogaW5wdXQudGV4dCwgcm9sZTogJ3RleHRib3gnLCBlbGVtZW50VHlwZTogJ2lucHV0JywgY29uZmlkZW5jZTogaW5wdXQuY29uZmlkZW5jZSB9LFxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb246IGBUeXBlIHlvdXIgc2VhcmNoIHF1ZXJ5IGhlcmUuIEknbGwgaGVscCB5b3UgZmluZCB3aGF0IHlvdSBuZWVkLmAsXG4gICAgICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAgIGBFbnRlciB5b3VyIHNlYXJjaCB0ZXJtcyBpbiB0aGUgZmllbGQgaGlnaGxpZ2h0ZWQgb24geW91ciBzY3JlZW4uYCxcbiAgICAgICAgICAgICAgYFByZXNzIEVudGVyIG9yIGNsaWNrIHRoZSBzZWFyY2ggYnV0dG9uLmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc3VtbWFyeTogYFlvdSdyZSBvbiAqKiR7c3RhdGUuZG9tYWlufSoqIOKAlCBsZXQncyBzZWFyY2guYCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSxcbiAgICAgIGlzQ29tcGxldGUoc3RhdGUsIF9tZW1vcnkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnBhZ2VUeXBlID09PSAnc2VhcmNoX3Jlc3VsdHMnIHx8IGhhc1VybENoYW5nZWQoX21lbW9yeSwgc3RhdGUpO1xuICAgICAgfSxcbiAgICB9LFxuICBdLFxufTtcblxuY29uc3QgYm9va0NoZWNrb3V0V29ya2Zsb3c6IFdvcmtmbG93ID0ge1xuICBuYW1lOiAnY2hlY2tvdXQnLFxuICBnb2FsUGF0dGVybjogL2Jvb2t8cmVzZXJ2ZXxvcmRlcnxwdXJjaGFzZXxidXl8Y2hlY2tvdXR8cGF5fHBsYWNlXFxzKm9yZGVyL2ksXG4gIHN0YWdlczogW1xuICAgIHtcbiAgICAgIGlkOiAnZ29fdG9fY2hlY2tvdXQnLFxuICAgICAgbmFtZTogJ0dvIHRvIENoZWNrb3V0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTmF2aWdhdGUgdG8gdGhlIGNoZWNrb3V0IG9yIHBheW1lbnQgcGFnZScsXG4gICAgICBpc09uVGhpc1BhZ2Uoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnBhZ2VUeXBlICE9PSAnY2hlY2tvdXQnICYmIHN0YXRlLnBhZ2VUeXBlICE9PSAnY2hlY2tvdXRfcmV2aWV3JztcbiAgICAgIH0sXG4gICAgICBnZXRBY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgY29uc3QgY2FydEJ0biA9IGZpbmRUYXJnZXQoc3RhdGUsIC9jYXJ0fGNoZWNrb3V0fGJ1eXxwdXJjaGFzZXxvcmRlci9pKTtcbiAgICAgICAgaWYgKGNhcnRCdG4pIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGlnaGxpZ2h0VGFyZ2V0OiB7IHRleHQ6IGNhcnRCdG4udGV4dCwgcm9sZTogJ2J1dHRvbicsIGVsZW1lbnRUeXBlOiBjYXJ0QnRuLmVsZW1lbnRUeXBlIGFzIGFueSwgY29uZmlkZW5jZTogY2FydEJ0bi5jb25maWRlbmNlIH0sXG4gICAgICAgICAgICBpbnN0cnVjdGlvbjogYENsaWNrIHRoZSAqKiR7Y2FydEJ0bi50ZXh0fSoqIGJ1dHRvbiBoaWdobGlnaHRlZCBvbiB5b3VyIHNjcmVlbiB0byBzdGFydCB0aGUgY2hlY2tvdXQgcHJvY2Vzcy5gLFxuICAgICAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgICAgICBgVGhpcyB3aWxsIHRha2UgeW91IHRvIHRoZSBjaGVja291dCBvciBwYXltZW50IHBhZ2UuYCxcbiAgICAgICAgICAgICAgYEknbGwgZ3VpZGUgeW91IHRocm91Z2ggZmlsbGluZyBpbiB0aGUgcmVxdWlyZWQgZGV0YWlscy5gLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHN1bW1hcnk6IGBZb3UncmUgb24gKioke3N0YXRlLmRvbWFpbn0qKiDigJQgbGV0J3Mgc3RhcnQgeW91ciBjaGVja291dC5gLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgaXNDb21wbGV0ZShzdGF0ZSwgX21lbW9yeSkge1xuICAgICAgICByZXR1cm4gc3RhdGUucGFnZVR5cGUgPT09ICdjaGVja291dCcgfHwgc3RhdGUucGFnZVR5cGUgPT09ICdjaGVja291dF9yZXZpZXcnIHx8IHN0YXRlLnBhZ2VUeXBlID09PSAnY2FydCc7XG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdmaWxsX2NoZWNrb3V0JyxcbiAgICAgIG5hbWU6ICdDb21wbGV0ZSBDaGVja291dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZpbGwgaW4gY2hlY2tvdXQgZGV0YWlscyBhbmQgY29uZmlybScsXG4gICAgICBpc09uVGhpc1BhZ2Uoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnBhZ2VUeXBlID09PSAnY2hlY2tvdXQnIHx8IHN0YXRlLnBhZ2VUeXBlID09PSAnY2hlY2tvdXRfcmV2aWV3JyB8fCBzdGF0ZS5wYWdlVHlwZSA9PT0gJ2NhcnQnO1xuICAgICAgfSxcbiAgICAgIGdldEFjdGlvbihzdGF0ZSkge1xuICAgICAgICBjb25zdCBkZXRhaWxzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBjb25zdCBpbnB1dHMgPSBzdGF0ZS5mb3JtSW5wdXRzLmZpbHRlcigoaSkgPT4gaS50eXBlICE9PSAnaGlkZGVuJyk7XG4gICAgICAgIGZvciAoY29uc3QgaW5wIG9mIGlucHV0cy5zbGljZSgwLCA1KSkge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gaW5wLnBsYWNlaG9sZGVyIHx8IGlucC5sYWJlbCB8fCBpbnAubmFtZSB8fCAnZmllbGQnO1xuICAgICAgICAgIGlmICghZGV0YWlscy5zb21lKChkKSA9PiBkLmluY2x1ZGVzKGxhYmVsKSkpIHtcbiAgICAgICAgICAgIGRldGFpbHMucHVzaChgRmlsbCBpbiAqKiR7bGFiZWx9Kioke2lucC5yZXF1aXJlZCA/ICcgKHJlcXVpcmVkKScgOiAnJ30uYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBheUJ0biA9IGZpbmRUYXJnZXQoc3RhdGUsIC9wYXl8Y29uZmlybXxvcmRlcnxwdXJjaGFzZXxwbGFjZVxccypvcmRlcnxidXl8c3VibWl0L2kpO1xuICAgICAgICBpZiAocGF5QnRuKSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKGBSZXZpZXcgeW91ciBvcmRlciwgdGhlbiBjbGljayAqKiR7cGF5QnRuLnRleHR9KiogdG8gY29tcGxldGUuYCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUuc3VibWl0QnV0dG9uVGV4dCkge1xuICAgICAgICAgIGRldGFpbHMucHVzaChgUmV2aWV3IHlvdXIgb3JkZXIsIHRoZW4gY2xpY2sgKioke3N0YXRlLnN1Ym1pdEJ1dHRvblRleHR9KiogdG8gY29tcGxldGUuYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKGBSZXZpZXcgeW91ciBvcmRlciBjYXJlZnVsbHksIHRoZW4gY2xpY2sgKipQbGFjZSBPcmRlcioqIG9yICoqUGF5IE5vdyoqIHRvIGNvbXBsZXRlLmApO1xuICAgICAgICB9XG4gICAgICAgIGRldGFpbHMucHVzaChgQWZ0ZXIgeW91ciBvcmRlciBpcyBwbGFjZWQsIEknbGwgYXV0b21hdGljYWxseSBjb25maXJtIGl0IGZvciB5b3UuYCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoaWdobGlnaHRUYXJnZXQ6IG51bGwsXG4gICAgICAgICAgaW5zdHJ1Y3Rpb246IGBMZXQncyBjb21wbGV0ZSB5b3VyIG9yZGVyIG9uICoqJHtzdGF0ZS5kb21haW59KiouIEZpbGwgaW4gdGhlIHJlcXVpcmVkIGluZm9ybWF0aW9uIGFuZCBjb25maXJtIHlvdXIgcHVyY2hhc2UuYCxcbiAgICAgICAgICBkZXRhaWxzLFxuICAgICAgICAgIHN1bW1hcnk6IGBZb3UncmUgb24gdGhlIGNoZWNrb3V0IHBhZ2UgZm9yICoqJHtzdGF0ZS5kb21haW59Kiog4oCUIGxldCdzIGNvbXBsZXRlIHlvdXIgb3JkZXIuYCxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBpc0NvbXBsZXRlKHN0YXRlLCBfbWVtb3J5KSB7XG4gICAgICAgIGlmIChzdGF0ZS5zdWNjZXNzTWVzc2FnZXMubGVuZ3RoID4gMCkgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgfSxcbiAgXSxcbn07XG5cbmNvbnN0IHNldHRpbmdzV29ya2Zsb3c6IFdvcmtmbG93ID0ge1xuICBuYW1lOiAnc2V0dGluZ3MnLFxuICBnb2FsUGF0dGVybjogL3NldHRpbmdzfHByb2ZpbGV8cGFzc3dvcmR8cHJlZmVyZW5jZXN8ZWRpdHx1cGRhdGV8Y2hhbmdlfG1vZGlmeS9pLFxuICBzdGFnZXM6IFtcbiAgICB7XG4gICAgICBpZDogJ2dvX3RvX3NldHRpbmdzJyxcbiAgICAgIG5hbWU6ICdPcGVuIFNldHRpbmdzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTmF2aWdhdGUgdG8gdGhlIHNldHRpbmdzIG9yIHByb2ZpbGUgcGFnZScsXG4gICAgICBpc09uVGhpc1BhZ2Uoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnBhZ2VUeXBlICE9PSAnc2V0dGluZ3MnICYmIHN0YXRlLnBhZ2VUeXBlICE9PSAncHJvZmlsZSc7XG4gICAgICB9LFxuICAgICAgZ2V0QWN0aW9uKHN0YXRlKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGZpbmRUYXJnZXQoc3RhdGUsIC9zZXR0aW5nc3xwcm9maWxlfGFjY291bnR8cHJlZmVyZW5jZXMvaSk7XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGlnaGxpZ2h0VGFyZ2V0OiB7IHRleHQ6IHRhcmdldC50ZXh0LCByb2xlOiAnbGluaycsIGVsZW1lbnRUeXBlOiB0YXJnZXQuZWxlbWVudFR5cGUgYXMgYW55LCBjb25maWRlbmNlOiB0YXJnZXQuY29uZmlkZW5jZSB9LFxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb246IGBDbGljayB0aGUgKioke3RhcmdldC50ZXh0fSoqIG9wdGlvbiBoaWdobGlnaHRlZCBvbiB5b3VyIHNjcmVlbiB0byBvcGVuIHlvdXIgc2V0dGluZ3MuYCxcbiAgICAgICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICAgYFRoaXMgd2lsbCB0YWtlIHlvdSB0byB5b3VyIHNldHRpbmdzIHBhZ2Ugd2hlcmUgeW91IGNhbiBtYWtlIGNoYW5nZXMuYCxcbiAgICAgICAgICAgICAgYEZyb20gdGhlcmUsIHlvdSBjYW4gdXBkYXRlIHlvdXIgcHJlZmVyZW5jZXMsIGNoYW5nZSB5b3VyIHBhc3N3b3JkLCBvciBtb2RpZnkgeW91ciBwcm9maWxlLmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc3VtbWFyeTogYFlvdSdyZSBvbiAqKiR7c3RhdGUuZG9tYWlufSoqIOKAlCBsZXQncyBvcGVuIHlvdXIgc2V0dGluZ3MuYCxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSxcbiAgICAgIGlzQ29tcGxldGUoc3RhdGUsIF9tZW1vcnkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnBhZ2VUeXBlID09PSAnc2V0dGluZ3MnIHx8IHN0YXRlLnBhZ2VUeXBlID09PSAncHJvZmlsZSc7XG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdhZGp1c3Rfc2V0dGluZ3MnLFxuICAgICAgbmFtZTogJ1VwZGF0ZSBTZXR0aW5ncycsXG4gICAgICBkZXNjcmlwdGlvbjogJ01ha2UgdGhlIGRlc2lyZWQgY2hhbmdlcycsXG4gICAgICBpc09uVGhpc1BhZ2Uoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnBhZ2VUeXBlID09PSAnc2V0dGluZ3MnIHx8IHN0YXRlLnBhZ2VUeXBlID09PSAncHJvZmlsZSc7XG4gICAgICB9LFxuICAgICAgZ2V0QWN0aW9uKHN0YXRlKSB7XG4gICAgICAgIGNvbnN0IGlucHV0cyA9IHN0YXRlLmZvcm1JbnB1dHMuZmlsdGVyKChpKSA9PiBpLnR5cGUgIT09ICdoaWRkZW4nKTtcbiAgICAgICAgY29uc3QgZGV0YWlsczogc3RyaW5nW10gPSBpbnB1dHMuc2xpY2UoMCwgNSkubWFwKChpbnApID0+IHtcbiAgICAgICAgICBjb25zdCBsYWJlbCA9IGlucC5wbGFjZWhvbGRlciB8fCBpbnAubGFiZWwgfHwgaW5wLm5hbWUgfHwgJ2ZpZWxkJztcbiAgICAgICAgICByZXR1cm4gYFlvdSBjYW4gdXBkYXRlICoqJHtsYWJlbH0qKiBoZXJlLmA7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZGV0YWlscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBkZXRhaWxzLnB1c2goJ0xvb2sgZm9yIHRoZSBzZXR0aW5nIHlvdSB3YW50IHRvIGNoYW5nZSBvbiB0aGlzIHBhZ2UuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzYXZlQnRuID0gZmluZFRhcmdldChzdGF0ZSwgL3NhdmV8dXBkYXRlfGFwcGx5fGNoYW5nZXxzdWJtaXQvaSkgfHwgKHN0YXRlLnN1Ym1pdEJ1dHRvblRleHQgPyB7IHRleHQ6IHN0YXRlLnN1Ym1pdEJ1dHRvblRleHQsIGVsZW1lbnRUeXBlOiAnYnV0dG9uJyBhcyBjb25zdCwgY29uZmlkZW5jZTogNzAgfSA6IG51bGwpO1xuICAgICAgICBpZiAoc2F2ZUJ0bikge1xuICAgICAgICAgIGRldGFpbHMucHVzaChgQ2xpY2sgKioke3NhdmVCdG4udGV4dH0qKiB0byBzYXZlIHlvdXIgY2hhbmdlcy5gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZXRhaWxzLnB1c2goYExvb2sgZm9yIGEgKipTYXZlKiogb3IgKipVcGRhdGUqKiBidXR0b24gdG8gYXBwbHkgeW91ciBjaGFuZ2VzLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoaWdobGlnaHRUYXJnZXQ6IG51bGwsXG4gICAgICAgICAgaW5zdHJ1Y3Rpb246IGBZb3UgY2FuIHVwZGF0ZSB5b3VyIHNldHRpbmdzIGhlcmUgb24gKioke3N0YXRlLmRvbWFpbn0qKi4gTWFrZSB0aGUgY2hhbmdlcyB5b3UgbmVlZCBhbmQgc2F2ZSB0aGVtLmAsXG4gICAgICAgICAgZGV0YWlscyxcbiAgICAgICAgICBzdW1tYXJ5OiBgWW91J3JlIG9uIHRoZSBzZXR0aW5ncyBwYWdlIGZvciAqKiR7c3RhdGUuZG9tYWlufSoqIOKAlCBtYWtlIHlvdXIgY2hhbmdlcyBoZXJlLmAsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgaXNDb21wbGV0ZShzdGF0ZSwgX21lbW9yeSkge1xuICAgICAgICBpZiAoc3RhdGUuc3VjY2Vzc01lc3NhZ2VzLmxlbmd0aCA+IDApIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG59O1xuXG5jb25zdCBnZW5lcmljRm9ybVdvcmtmbG93OiBXb3JrZmxvdyA9IHtcbiAgbmFtZTogJ2Zvcm0nLFxuICBnb2FsUGF0dGVybjogL2NyZWF0ZXxtYWtlfG5ld3xhZGR8dXBsb2FkfHBvc3R8c3RhcnR8ZmlsbHxzdWJtaXR8YXBwbHkvaSxcbiAgc3RhZ2VzOiBbXG4gICAge1xuICAgICAgaWQ6ICdmaWxsX2Zvcm0nLFxuICAgICAgbmFtZTogJ0NvbXBsZXRlIEZvcm0nLFxuICAgICAgZGVzY3JpcHRpb246ICdGaWxsIGluIHRoZSBmb3JtIGFuZCBzdWJtaXQnLFxuICAgICAgaXNPblRoaXNQYWdlKF9zdGF0ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBnZXRBY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgY29uc3QgaW5wdXRzID0gc3RhdGUuZm9ybUlucHV0cy5maWx0ZXIoKGkpID0+IGkudHlwZSAhPT0gJ2hpZGRlbicpO1xuICAgICAgICBjb25zdCBkZXRhaWxzOiBzdHJpbmdbXSA9IGlucHV0cy5zbGljZSgwLCA1KS5tYXAoKGlucCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gaW5wLnBsYWNlaG9sZGVyIHx8IGlucC5sYWJlbCB8fCBpbnAubmFtZSB8fCAnZmllbGQnO1xuICAgICAgICAgIGlmIChpbnAudHlwZSA9PT0gJ3Bhc3N3b3JkJykgcmV0dXJuIGBDaG9vc2UgYSAqKnBhc3N3b3JkKiogYW5kIGVudGVyIGl0IGluIHRoZSAke2xhYmVsfSBmaWVsZC5gO1xuICAgICAgICAgIGlmIChpbnAudHlwZSA9PT0gJ2VtYWlsJykgcmV0dXJuIGBFbnRlciB5b3VyICoqZW1haWwgYWRkcmVzcyoqIGluIHRoZSAke2xhYmVsfSBmaWVsZC5gO1xuICAgICAgICAgIHJldHVybiBgRmlsbCBpbiAqKiR7bGFiZWx9Kioke2lucC5yZXF1aXJlZCA/ICcgKHJlcXVpcmVkKScgOiAnJ30uYDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChkZXRhaWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGRldGFpbHMucHVzaCgnU3RhcnQgZmlsbGluZyBpbiB0aGUgZmllbGRzIG9uIHRoaXMgZm9ybS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN1Ym1pdFRhcmdldCA9IHN0YXRlLnN1Ym1pdEJ1dHRvblRleHRcbiAgICAgICAgICA/IHsgdGV4dDogc3RhdGUuc3VibWl0QnV0dG9uVGV4dCwgZWxlbWVudFR5cGU6ICdidXR0b24nIGFzIGNvbnN0LCBjb25maWRlbmNlOiA4MCB9XG4gICAgICAgICAgOiBmaW5kVGFyZ2V0KHN0YXRlLCAvc3VibWl0fHNhdmV8Y29udGludWV8bmV4dHxkb25lfGZpbmlzaHxjcmVhdGV8YWRkL2kpO1xuICAgICAgICBpZiAoc3VibWl0VGFyZ2V0KSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKGBDbGljayAqKiR7c3VibWl0VGFyZ2V0LnRleHR9KiogdG8gc3VibWl0IHRoZSBmb3JtLmApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRldGFpbHMucHVzaChgQ2xpY2sgdGhlICoqU3VibWl0KiogYnV0dG9uIHRvIGNvbXBsZXRlIHRoZSBmb3JtLmApO1xuICAgICAgICB9XG4gICAgICAgIGRldGFpbHMucHVzaChgSSdsbCBhdXRvbWF0aWNhbGx5IGRldGVjdCB0aGUgbmV4dCBzdGVwIG9uY2UgdGhlIGZvcm0gaXMgc3VibWl0dGVkLmApO1xuXG4gICAgICAgIGNvbnN0IGZpcnN0SW5wdXQgPSBpbnB1dHNbMF07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaGlnaGxpZ2h0VGFyZ2V0OiBmaXJzdElucHV0XG4gICAgICAgICAgICA/IHsgdGV4dDogZmlyc3RJbnB1dC5wbGFjZWhvbGRlciB8fCBmaXJzdElucHV0LmxhYmVsIHx8ICdmaXJzdCBmaWVsZCcsIHJvbGU6ICd0ZXh0Ym94JywgZWxlbWVudFR5cGU6ICdpbnB1dCcsIGNvbmZpZGVuY2U6IDc1IH1cbiAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICBpbnN0cnVjdGlvbjogYExldCdzIGNvbXBsZXRlIHRoaXMgZm9ybSBvbiAqKiR7c3RhdGUuZG9tYWlufSoqLiBGaWxsIGluIHRoZSByZXF1aXJlZCBkZXRhaWxzIGJlbG93LmAsXG4gICAgICAgICAgZGV0YWlscyxcbiAgICAgICAgICBzdW1tYXJ5OiBgWW91J3JlIG9uIGEgZm9ybSBvbiAqKiR7c3RhdGUuZG9tYWlufSoqIOKAlCBmaWxsIGluIHRoZSBkZXRhaWxzLmAsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgaXNDb21wbGV0ZShzdGF0ZSwgX21lbW9yeSkge1xuICAgICAgICBpZiAoc3RhdGUuc3VjY2Vzc01lc3NhZ2VzLmxlbmd0aCA+IDApIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gaGFzVXJsQ2hhbmdlZChfbWVtb3J5LCBzdGF0ZSk7XG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG59O1xuXG5jb25zdCBhbGxXb3JrZmxvd3M6IFdvcmtmbG93W10gPSBbXG4gIGxvZ2luV29ya2Zsb3csXG4gIHNpZ251cFdvcmtmbG93LFxuICBjcmVhdGVJc3N1ZVdvcmtmbG93LFxuICBzZWFyY2hXb3JrZmxvdyxcbiAgYm9va0NoZWNrb3V0V29ya2Zsb3csXG4gIHNldHRpbmdzV29ya2Zsb3csXG4gIGdlbmVyaWNGb3JtV29ya2Zsb3csXG5dO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBsYW5uZXJSZXN1bHQge1xuICB3b3JrZmxvdzogV29ya2Zsb3c7XG4gIGN1cnJlbnRTdGFnZTogV29ya2Zsb3dTdGFnZTtcbiAgYWN0aW9uOiBXb3JrZmxvd0FjdGlvbjtcbiAgY29tcGxldGVkOiBib29sZWFuO1xuICBjb25maWRlbmNlOiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGFuV29ya2Zsb3coZ29hbDogc3RyaW5nLCBzdGF0ZTogUGFnZVN0YXRlLCBtZW1vcnk6IEV4cGxvcmVyTWVtb3J5KTogUGxhbm5lclJlc3VsdCB8IG51bGwge1xuICBjb25zdCBnb2FsTG93ZXIgPSBnb2FsLnRvTG93ZXJDYXNlKCk7XG5cbiAgZm9yIChjb25zdCB3ZiBvZiBhbGxXb3JrZmxvd3MpIHtcbiAgICBpZiAoIXdmLmdvYWxQYXR0ZXJuLnRlc3QoZ29hbExvd2VyKSkgY29udGludWU7XG5cbiAgICBsZXQgZm91bmRDdXJyZW50U3RhZ2U6IFdvcmtmbG93U3RhZ2UgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgZm91bmRTdGFnZUluZGV4ID0gLTE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdmLnN0YWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc3RhZ2UgPSB3Zi5zdGFnZXNbaV07XG4gICAgICBjb25zdCBzdGFnZUNvbXBsZXRlZCA9IG1lbW9yeS5jb21wbGV0ZWRTdGFnZUlkcy5pbmNsdWRlcyhzdGFnZS5pZCk7XG5cbiAgICAgIGlmIChzdGFnZS5pc09uVGhpc1BhZ2Uoc3RhdGUpKSB7XG4gICAgICAgIGZvdW5kQ3VycmVudFN0YWdlID0gc3RhZ2U7XG4gICAgICAgIGZvdW5kU3RhZ2VJbmRleCA9IGk7XG5cbiAgICAgICAgaWYgKHN0YWdlQ29tcGxldGVkKSB7XG4gICAgICAgICAgaWYgKHN0YWdlLmlzQ29tcGxldGUoc3RhdGUsIG1lbW9yeSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3RhZ2UuaXNDb21wbGV0ZShzdGF0ZSwgbWVtb3J5KSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YWdlLmlzQ29tcGxldGUoc3RhdGUsIG1lbW9yeSkpIHtcbiAgICAgICAgICBpZiAoaSArIDEgPCB3Zi5zdGFnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3VuZEN1cnJlbnRTdGFnZSA9IHdmLnN0YWdlc1tpICsgMV07XG4gICAgICAgICAgICBmb3VuZFN0YWdlSW5kZXggPSBpICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm91bmRDdXJyZW50U3RhZ2UpIHtcbiAgICAgIGNvbnN0IGNvbXBsZXRlZCA9IGZvdW5kU3RhZ2VJbmRleCA+PSB3Zi5zdGFnZXMubGVuZ3RoIC0gMSAmJiBmb3VuZEN1cnJlbnRTdGFnZS5pc0NvbXBsZXRlKHN0YXRlLCBtZW1vcnkpO1xuXG4gICAgICBjb25zdCBhY3Rpb24gPSBmb3VuZEN1cnJlbnRTdGFnZS5nZXRBY3Rpb24oc3RhdGUpO1xuICAgICAgaWYgKCFhY3Rpb24pIHtcbiAgICAgICAgY29uc3Qgc3RhZ2VDb21wbGV0ZWQgPSBmb3VuZEN1cnJlbnRTdGFnZS5pc0NvbXBsZXRlKHN0YXRlLCBtZW1vcnkpO1xuICAgICAgICBpZiAoc3RhZ2VDb21wbGV0ZWQgJiYgZm91bmRTdGFnZUluZGV4IDwgd2Yuc3RhZ2VzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBjb25zdCBuZXh0U3RhZ2UgPSB3Zi5zdGFnZXNbZm91bmRTdGFnZUluZGV4ICsgMV07XG4gICAgICAgICAgY29uc3QgbmV4dEFjdGlvbiA9IG5leHRTdGFnZS5nZXRBY3Rpb24oc3RhdGUpO1xuICAgICAgICAgIGlmIChuZXh0QWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB3b3JrZmxvdzogd2YsXG4gICAgICAgICAgICAgIGN1cnJlbnRTdGFnZTogbmV4dFN0YWdlLFxuICAgICAgICAgICAgICBhY3Rpb246IG5leHRBY3Rpb24sXG4gICAgICAgICAgICAgIGNvbXBsZXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgIGNvbmZpZGVuY2U6IDc1LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdvcmtmbG93OiB3ZixcbiAgICAgICAgY3VycmVudFN0YWdlOiBmb3VuZEN1cnJlbnRTdGFnZSxcbiAgICAgICAgYWN0aW9uLFxuICAgICAgICBjb21wbGV0ZWQsXG4gICAgICAgIGNvbmZpZGVuY2U6IGNvbXBsZXRlZCA/IDk1IDogYWN0aW9uLmhpZ2hsaWdodFRhcmdldCA/IDg1IDogNzAsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBSaWNoRXhwbG9yZXJSZXNwb25zZSwgRXhwbG9yZXJNZW1vcnksIEhpZ2hsaWdodFRhcmdldCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGJ1aWxkUGFnZVN0YXRlIH0gZnJvbSAnLi9zdGF0ZUVuZ2luZSc7XG5pbXBvcnQgeyBwbGFuV29ya2Zsb3csIHR5cGUgUGxhbm5lclJlc3VsdCB9IGZyb20gJy4vd29ya2Zsb3dQbGFubmVyJztcblxuaW50ZXJmYWNlIFBhZ2VEYXRhIHtcbiAgdXJsOiBzdHJpbmc7XG4gIGRvbWFpbjogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aXNpYmxlVGV4dDogc3RyaW5nO1xuICBidXR0b25zOiB7IHRleHQ6IHN0cmluZzsgc2VsZWN0b3I6IHN0cmluZzsgdHlwZTogc3RyaW5nOyB2aXNpYmxlOiBib29sZWFuIH1bXTtcbiAgbGlua3M6IHsgdGV4dDogc3RyaW5nOyBocmVmOiBzdHJpbmc7IHNlbGVjdG9yOiBzdHJpbmc7IHZpc2libGU6IGJvb2xlYW4gfVtdO1xuICBpbnB1dHM6IHsgdHlwZTogc3RyaW5nOyBuYW1lOiBzdHJpbmc7IHBsYWNlaG9sZGVyOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmc7IHNlbGVjdG9yOiBzdHJpbmc7IHJlcXVpcmVkOiBib29sZWFuOyB2aXNpYmxlOiBib29sZWFuIH1bXTtcbiAgZm9ybXM6IHsgYWN0aW9uOiBzdHJpbmc7IG1ldGhvZDogc3RyaW5nOyBmaWVsZHM6IG51bWJlcjsgc3VibWl0VGV4dDogc3RyaW5nOyBzZWxlY3Rvcjogc3RyaW5nIH1bXTtcbiAgaGVhZGluZ3M6IHsgbGV2ZWw6IG51bWJlcjsgdGV4dDogc3RyaW5nOyBzZWxlY3Rvcjogc3RyaW5nIH1bXTtcbiAgbmF2aWdhdGlvbjogeyBsaW5rczogeyB0ZXh0OiBzdHJpbmc7IGhyZWY6IHN0cmluZyB9W10gfVtdO1xuICBkaWFsb2dzOiB7IHRleHQ6IHN0cmluZzsgc2VsZWN0b3I6IHN0cmluZyB9W107XG4gIGFyaWFMYWJlbHM6IHsgbGFiZWw6IHN0cmluZzsgdGFnOiBzdHJpbmc7IHNlbGVjdG9yOiBzdHJpbmcgfVtdO1xuICBwbGFjZWhvbGRlcnM6IHN0cmluZ1tdO1xuICBpbWFnZXM6IHsgYWx0OiBzdHJpbmc7IHNyYzogc3RyaW5nOyBzZWxlY3Rvcjogc3RyaW5nIH1bXTtcbiAgc2VsZWN0RWxlbWVudDogeyBuYW1lOiBzdHJpbmc7IG9wdGlvbnM6IHN0cmluZ1tdOyBzZWxlY3Rvcjogc3RyaW5nIH1bXTtcbiAgY2hlY2tib3hlczogeyB0eXBlOiBzdHJpbmc7IG5hbWU6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgY2hlY2tlZDogYm9vbGVhbjsgc2VsZWN0b3I6IHN0cmluZyB9W107XG4gIHRhYnM6IHsgdGV4dDogc3RyaW5nOyBzZWxlY3RlZDogYm9vbGVhbjsgcm9sZTogc3RyaW5nOyBzZWxlY3Rvcjogc3RyaW5nIH1bXTtcbiAgc3VjY2Vzc01lc3NhZ2VzOiBzdHJpbmdbXTtcbiAgZXJyb3JNZXNzYWdlczogc3RyaW5nW107XG4gIHZhbGlkYXRpb25NZXNzYWdlczogc3RyaW5nW107XG4gIGRpc2FibGVkQnV0dG9uczogeyB0ZXh0OiBzdHJpbmc7IHNlbGVjdG9yOiBzdHJpbmcgfVtdO1xuICBicmVhZGNydW1iczogc3RyaW5nW107XG4gIHRvYXN0czogc3RyaW5nW107XG4gIHBhZ2VQdXJwb3NlOiBzdHJpbmc7XG4gIGFjdGl2ZVdvcmtmbG93OiBzdHJpbmc7XG4gIHBhZ2VTdGF0ZTogc3RyaW5nO1xufVxuXG5jb25zdCBtZW1vcnlTdG9yZTogTWFwPHN0cmluZywgRXhwbG9yZXJNZW1vcnk+ID0gbmV3IE1hcCgpO1xuXG5mdW5jdGlvbiBnZXRNZW1vcnlLZXkoZ29hbDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IHN0cmluZyB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGAke2dvYWx9Ojoke25ldyBVUkwodXJsKS5ob3N0bmFtZX1gO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gYCR7Z29hbH06OnVua25vd25gO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldE9yQ3JlYXRlTWVtb3J5KGdvYWw6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBFeHBsb3Jlck1lbW9yeSB7XG4gIGNvbnN0IGtleSA9IGdldE1lbW9yeUtleShnb2FsLCB1cmwpO1xuICBsZXQgbWVtID0gbWVtb3J5U3RvcmUuZ2V0KGtleSk7XG4gIGlmICghbWVtKSB7XG4gICAgbGV0IGRvbWFpbiA9ICcnO1xuICAgIHRyeSB7IGRvbWFpbiA9IG5ldyBVUkwodXJsKS5ob3N0bmFtZTsgfSBjYXRjaCB7IGRvbWFpbiA9ICd1bmtub3duJzsgfVxuICAgIG1lbSA9IHtcbiAgICAgIGdvYWwsXG4gICAgICB3ZWJzaXRlOiBkb21haW4sXG4gICAgICBjdXJyZW50U3RhZ2VJZDogJycsXG4gICAgICBjb21wbGV0ZWRTdGFnZUlkczogW10sXG4gICAgICBwcmV2aW91c1VybDogdXJsLFxuICAgICAgZXhwZWN0ZWROZXh0QWN0aW9uOiAnJyxcbiAgICAgIGxhc3RIaWdobGlnaHRTZW50OiBudWxsLFxuICAgICAgbGFzdEhpZ2hsaWdodENvbmZpcm1lZDogZmFsc2UsXG4gICAgICBsYXN0RXJyb3I6IG51bGwsXG4gICAgICBsYXN0U3VjY2VzczogbnVsbCxcbiAgICB9O1xuICAgIG1lbW9yeVN0b3JlLnNldChrZXksIG1lbSk7XG4gIH0gZWxzZSBpZiAodXJsICE9PSBtZW0ucHJldmlvdXNVcmwpIHtcbiAgICBtZW0ucHJldmlvdXNVcmwgPSB1cmw7XG4gIH1cbiAgcmV0dXJuIG1lbTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFuYWx5emVQYWdlRm9yR29hbChnb2FsOiBzdHJpbmcsIHBhZ2U6IFBhZ2VEYXRhKTogUmljaEV4cGxvcmVyUmVzcG9uc2Uge1xuICBjb25zdCBtZW1vcnkgPSBnZXRPckNyZWF0ZU1lbW9yeShnb2FsLCBwYWdlLnVybCk7XG4gIGNvbnN0IHN0YXRlID0gYnVpbGRQYWdlU3RhdGUoZ29hbCwgcGFnZSk7XG5cbiAgY29uc3QgZG9tYWluID0gc3RhdGUuZG9tYWluLnJlcGxhY2UoL153d3dcXC4vLCAnJyk7XG5cbiAgY29uc3QgaGFzRXJyb3JzID0gc3RhdGUudmlzaWJsZUVycm9ycy5sZW5ndGggPiAwO1xuICBjb25zdCBoYXNTdWNjZXNzID0gc3RhdGUuc3VjY2Vzc01lc3NhZ2VzLmxlbmd0aCA+IDA7XG5cbiAgaWYgKGhhc1N1Y2Nlc3MpIHtcbiAgICBjb25zdCBzdWNjZXNzVGV4dCA9IHN0YXRlLnN1Y2Nlc3NNZXNzYWdlc1swXTtcbiAgICBpZiAoIW1lbW9yeS5jb21wbGV0ZWRTdGFnZUlkcy5pbmNsdWRlcyhtZW1vcnkuY3VycmVudFN0YWdlSWQpICYmIG1lbW9yeS5jdXJyZW50U3RhZ2VJZCkge1xuICAgICAgbWVtb3J5LmNvbXBsZXRlZFN0YWdlSWRzLnB1c2gobWVtb3J5LmN1cnJlbnRTdGFnZUlkKTtcbiAgICB9XG4gICAgbWVtb3J5Lmxhc3RTdWNjZXNzID0gc3VjY2Vzc1RleHQ7XG4gICAgbWVtb3J5Lmxhc3RFcnJvciA9IG51bGw7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhZ2VTdW1tYXJ5OiBgWW91J3JlIG9uICoqJHtzdGF0ZS50aXRsZSB8fCBkb21haW59Kiog4oCUICR7c3VjY2Vzc1RleHR9YCxcbiAgICAgIGN1cnJlbnRTdGFnZTogJ0NvbXBsZXRlJyxcbiAgICAgIGluc3RydWN0aW9uOiBg4pyFICR7c3VjY2Vzc1RleHR9YCxcbiAgICAgIGRldGFpbHM6IFsnQWxsIHN0ZXBzIGhhdmUgYmVlbiBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5LiBMZXQgbWUga25vdyBpZiB5b3UgbmVlZCBoZWxwIHdpdGggYW55dGhpbmcgZWxzZS4nXSxcbiAgICAgIGhpZ2hsaWdodFRhcmdldDogbnVsbCxcbiAgICAgIGhpZ2hsaWdodENvbmZpcm1lZDogZmFsc2UsXG4gICAgICBleHBlY3RlZE5leHRQYWdlOiBwYWdlLnVybCxcbiAgICAgIHN1Y2Nlc3NNZXNzYWdlOiBzdWNjZXNzVGV4dCxcbiAgICAgIGNvbXBsZXRlZDogdHJ1ZSxcbiAgICAgIGNvbmZpZGVuY2U6IDk4LFxuICAgIH07XG4gIH1cblxuICBpZiAoaGFzRXJyb3JzKSB7XG4gICAgY29uc3QgZXJyb3JUZXh0ID0gc3RhdGUudmlzaWJsZUVycm9yc1swXTtcbiAgICBtZW1vcnkubGFzdEVycm9yID0gZXJyb3JUZXh0O1xuICAgIG1lbW9yeS5sYXN0U3VjY2VzcyA9IG51bGw7XG5cbiAgICBjb25zdCBpc0F1dGhHb2FsID0gL2xvZ2lufHNpZ25cXHMqaW58bG9nXFxzKmlufGF1dGhlbnRpY2F0ZS9pLnRlc3QoZ29hbCk7XG5cbiAgICBsZXQgcmVjb3ZlcnlIaW50ID0gJ1BsZWFzZSBjb3JyZWN0IHRoZSBpc3N1ZSBhbmQgdHJ5IGFnYWluLic7XG4gICAgbGV0IGhpZ2hsaWdodFRhcmdldDogSGlnaGxpZ2h0VGFyZ2V0IHwgbnVsbCA9IG51bGw7XG5cbiAgICBpZiAoL2luY29ycmVjdHxpbnZhbGlkfHdyb25nfG1pc21hdGNofG5vdFxccytmb3VuZC9pLnRlc3QoZXJyb3JUZXh0KSkge1xuICAgICAgaWYgKGlzQXV0aEdvYWwpIHtcbiAgICAgICAgaWYgKC9wYXNzd29yZC9pLnRlc3QoZXJyb3JUZXh0KSkge1xuICAgICAgICAgIHJlY292ZXJ5SGludCA9ICdDaGVjayB0aGF0IENhcHMgTG9jayBpcyBvZmYgYW5kIHlvdXIgcGFzc3dvcmQgaXMgY29ycmVjdC4gSWYgeW91IGhhdmUgZm9yZ290dGVuIHlvdXIgcGFzc3dvcmQsIGxvb2sgZm9yIGEgXCJGb3Jnb3QgUGFzc3dvcmRcIiBsaW5rLic7XG4gICAgICAgICAgY29uc3QgcHdGaWVsZCA9IHN0YXRlLmF1dGhJbnB1dHMuZmluZCgoaSkgPT4gaS50eXBlID09PSAncGFzc3dvcmQnKTtcbiAgICAgICAgICBpZiAocHdGaWVsZCkge1xuICAgICAgICAgICAgaGlnaGxpZ2h0VGFyZ2V0ID0geyB0ZXh0OiBwd0ZpZWxkLnBsYWNlaG9sZGVyIHx8IHB3RmllbGQubGFiZWwgfHwgJ3Bhc3N3b3JkIGZpZWxkJywgcm9sZTogJ3RleHRib3gnLCBlbGVtZW50VHlwZTogJ2lucHV0JywgY29uZmlkZW5jZTogODUgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoL3VzZXJuYW1lfGVtYWlsL2kudGVzdChlcnJvclRleHQpKSB7XG4gICAgICAgICAgcmVjb3ZlcnlIaW50ID0gJ0RvdWJsZS1jaGVjayB5b3VyIGVtYWlsIG9yIHVzZXJuYW1lLiBNYWtlIHN1cmUgeW91IGFyZSB1c2luZyB0aGUgYWNjb3VudCB5b3UgcmVnaXN0ZXJlZCB3aXRoLic7XG4gICAgICAgICAgY29uc3QgZW1haWxGaWVsZCA9IHN0YXRlLmF1dGhJbnB1dHMuZmluZCgoaSkgPT4gaS50eXBlID09PSAnZW1haWwnIHx8IC9lbWFpbHx1c2VyL2kudGVzdChpLmxhYmVsICsgJyAnICsgaS5wbGFjZWhvbGRlcikpO1xuICAgICAgICAgIGlmIChlbWFpbEZpZWxkKSB7XG4gICAgICAgICAgICBoaWdobGlnaHRUYXJnZXQgPSB7IHRleHQ6IGVtYWlsRmllbGQucGxhY2Vob2xkZXIgfHwgZW1haWxGaWVsZC5sYWJlbCB8fCAnZW1haWwgZmllbGQnLCByb2xlOiAndGV4dGJveCcsIGVsZW1lbnRUeXBlOiAnaW5wdXQnLCBjb25maWRlbmNlOiA4NSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWNvdmVyeUhpbnQgPSAnUGxlYXNlIHZlcmlmeSB5b3VyIGNyZWRlbnRpYWxzIGFuZCB0cnkgc2lnbmluZyBpbiBhZ2Fpbi4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgvcmVxdWlyZWQvaS50ZXN0KGVycm9yVGV4dCkpIHtcbiAgICAgIHJlY292ZXJ5SGludCA9ICdTb21lIHJlcXVpcmVkIGZpZWxkcyBhcmUgbWlzc2luZy4gUGxlYXNlIGZpbGwgdGhlbSBpbiBiZWZvcmUgY29udGludWluZy4nO1xuICAgIH0gZWxzZSBpZiAoL2FscmVhZHlcXHMrZXhpc3RzfHRha2VuL2kudGVzdChlcnJvclRleHQpKSB7XG4gICAgICByZWNvdmVyeUhpbnQgPSAnVGhhdCBjaG9pY2UgaXMgYWxyZWFkeSB0YWtlbi4gVHJ5IHNvbWV0aGluZyBkaWZmZXJlbnQuJztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcGFnZVN1bW1hcnk6IGBZb3UncmUgb24gKioke2RvbWFpbn0qKiDigJQgdGhlIGZvcm0gcmV0dXJuZWQgYW4gZXJyb3JgLFxuICAgICAgY3VycmVudFN0YWdlOiBtZW1vcnkuY3VycmVudFN0YWdlSWQgfHwgJ0Zvcm0nLFxuICAgICAgaW5zdHJ1Y3Rpb246IGAqKiR7ZXJyb3JUZXh0fSoqIOKAlCAke3JlY292ZXJ5SGludH0gSSB3aWxsIGNvbnRpbnVlIGF1dG9tYXRpY2FsbHkgb25jZSB5b3UgY29ycmVjdCBpdC5gLFxuICAgICAgZGV0YWlsczogW1xuICAgICAgICBgVGhlIGZvcm0gcmV0dXJuZWQ6IFwiJHtlcnJvclRleHR9XCJgLFxuICAgICAgICByZWNvdmVyeUhpbnQsXG4gICAgICAgICdJIHdpbGwgYXV0b21hdGljYWxseSBkZXRlY3Qgd2hlbiB0aGUgaXNzdWUgaXMgcmVzb2x2ZWQgYW5kIGNvbnRpbnVlIGd1aWRpbmcgeW91LicsXG4gICAgICBdLFxuICAgICAgaGlnaGxpZ2h0VGFyZ2V0LFxuICAgICAgaGlnaGxpZ2h0Q29uZmlybWVkOiBmYWxzZSxcbiAgICAgIGV4cGVjdGVkTmV4dFBhZ2U6IHBhZ2UudXJsLFxuICAgICAgc3VjY2Vzc01lc3NhZ2U6ICcnLFxuICAgICAgY29tcGxldGVkOiBmYWxzZSxcbiAgICAgIGNvbmZpZGVuY2U6IGhpZ2hsaWdodFRhcmdldCA/IDcwIDogNDUsXG4gICAgfTtcbiAgfVxuXG4gIG1lbW9yeS5sYXN0RXJyb3IgPSBudWxsO1xuXG4gIGNvbnN0IHBsYW4gPSBwbGFuV29ya2Zsb3coZ29hbCwgc3RhdGUsIG1lbW9yeSk7XG5cbiAgaWYgKCFwbGFuKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gc3RhdGUuYXZhaWxhYmxlVGFyZ2V0c1swXSB8fCBudWxsO1xuICAgIHJldHVybiB7XG4gICAgICBwYWdlU3VtbWFyeTogYFlvdSdyZSBvbiAqKiR7c3RhdGUudGl0bGUgfHwgZG9tYWlufSoqIOKAlCBJIGNhbiBzZWUgdGhlIHBhZ2UgYnV0IEkgYW0gbm90IHN1cmUgYWJvdXQgdGhlIG5leHQgc3RlcC5gLFxuICAgICAgY3VycmVudFN0YWdlOiAnRXhwbG9yZScsXG4gICAgICBpbnN0cnVjdGlvbjogdGFyZ2V0XG4gICAgICAgID8gYEkgZm91bmQgKioke3RhcmdldC50ZXh0fSoqIG9uIHRoaXMgcGFnZS4gVHJ5IGNsaWNraW5nIGl0IHRvIG1vdmUgZm9yd2FyZC5gXG4gICAgICAgIDogYEkgYW0gYW5hbHl6aW5nIHRoaXMgcGFnZS4gVHJ5IG5hdmlnYXRpbmcgdG8gd2hlcmUgeW91IHdhbnQgdG8gZ28gb24gKioke2RvbWFpbn0qKi5gLFxuICAgICAgZGV0YWlsczogdGFyZ2V0XG4gICAgICAgID8gW2BDbGljayAqKiR7dGFyZ2V0LnRleHR9KiogaGlnaGxpZ2h0ZWQgb24geW91ciBzY3JlZW4uYF1cbiAgICAgICAgOiBbJ1RyeSB1c2luZyB0aGUgbmF2aWdhdGlvbiBtZW51IG9yIHR5cGUgYSBtb3JlIHNwZWNpZmljIHJlcXVlc3QuJ10sXG4gICAgICBoaWdobGlnaHRUYXJnZXQ6IHRhcmdldFxuICAgICAgICA/IHsgdGV4dDogdGFyZ2V0LnRleHQsIHJvbGU6IHRhcmdldC5lbGVtZW50VHlwZSA9PT0gJ2xpbmsnID8gJ2xpbmsnIDogJ2J1dHRvbicsIGVsZW1lbnRUeXBlOiB0YXJnZXQuZWxlbWVudFR5cGUgYXMgYW55LCBjb25maWRlbmNlOiB0YXJnZXQuY29uZmlkZW5jZSB9XG4gICAgICAgIDogbnVsbCxcbiAgICAgIGhpZ2hsaWdodENvbmZpcm1lZDogZmFsc2UsXG4gICAgICBleHBlY3RlZE5leHRQYWdlOiBwYWdlLnVybCxcbiAgICAgIHN1Y2Nlc3NNZXNzYWdlOiAnJyxcbiAgICAgIGNvbXBsZXRlZDogZmFsc2UsXG4gICAgICBjb25maWRlbmNlOiB0YXJnZXQ/LmNvbmZpZGVuY2UgfHwgMzAsXG4gICAgfTtcbiAgfVxuXG4gIG1lbW9yeS5jdXJyZW50U3RhZ2VJZCA9IHBsYW4uY3VycmVudFN0YWdlLmlkO1xuICBpZiAocGxhbi5jb21wbGV0ZWQgJiYgIW1lbW9yeS5jb21wbGV0ZWRTdGFnZUlkcy5pbmNsdWRlcyhwbGFuLmN1cnJlbnRTdGFnZS5pZCkpIHtcbiAgICBtZW1vcnkuY29tcGxldGVkU3RhZ2VJZHMucHVzaChwbGFuLmN1cnJlbnRTdGFnZS5pZCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBhZ2VTdW1tYXJ5OiBwbGFuLmFjdGlvbi5zdW1tYXJ5LFxuICAgIGN1cnJlbnRTdGFnZTogcGxhbi5jdXJyZW50U3RhZ2UubmFtZSxcbiAgICBpbnN0cnVjdGlvbjogcGxhbi5hY3Rpb24uaW5zdHJ1Y3Rpb24sXG4gICAgZGV0YWlsczogcGxhbi5hY3Rpb24uZGV0YWlscyxcbiAgICBoaWdobGlnaHRUYXJnZXQ6IHBsYW4uYWN0aW9uLmhpZ2hsaWdodFRhcmdldCxcbiAgICBoaWdobGlnaHRDb25maXJtZWQ6IGZhbHNlLFxuICAgIGV4cGVjdGVkTmV4dFBhZ2U6IHBhZ2UudXJsLFxuICAgIHN1Y2Nlc3NNZXNzYWdlOiBwbGFuLmNvbXBsZXRlZCA/IGBUYXNrIGNvbXBsZXRlISAke3BsYW4uY3VycmVudFN0YWdlLm5hbWV9IGZpbmlzaGVkLmAgOiAnJyxcbiAgICBjb21wbGV0ZWQ6IHBsYW4uY29tcGxldGVkLFxuICAgIGNvbmZpZGVuY2U6IHBsYW4uY29tcGxldGVkID8gOTUgOiBwbGFuLmNvbmZpZGVuY2UsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldFRhc2tNZW1vcnkoZ29hbDogc3RyaW5nLCB1cmw6IHN0cmluZykge1xuICBjb25zdCBrZXkgPSBnZXRNZW1vcnlLZXkoZ29hbCwgdXJsKTtcbiAgbWVtb3J5U3RvcmUuZGVsZXRlKGtleSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wbGV0ZWRTdGVwcyhnb2FsOiBzdHJpbmcsIHVybDogc3RyaW5nKTogeyBpbnN0cnVjdGlvbjogc3RyaW5nOyBjb21wbGV0ZWQ6IGJvb2xlYW4gfVtdIHtcbiAgY29uc3Qga2V5ID0gZ2V0TWVtb3J5S2V5KGdvYWwsIHVybCk7XG4gIGNvbnN0IG1lbSA9IG1lbW9yeVN0b3JlLmdldChrZXkpO1xuICBpZiAoIW1lbSkgcmV0dXJuIFtdO1xuICByZXR1cm4gW1xuICAgIC4uLm1lbS5jb21wbGV0ZWRTdGFnZUlkcy5tYXAoKGlkKSA9PiAoeyBpbnN0cnVjdGlvbjogYFN0YWdlOiAke2lkfWAsIGNvbXBsZXRlZDogdHJ1ZSB9KSksXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25maXJtSGlnaGxpZ2h0KGdvYWw6IHN0cmluZywgdXJsOiBzdHJpbmcsIHN1Y2Nlc3M6IGJvb2xlYW4pIHtcbiAgY29uc3QgbWVtID0gbWVtb3J5U3RvcmUuZ2V0KGdldE1lbW9yeUtleShnb2FsLCB1cmwpKTtcbiAgaWYgKG1lbSkge1xuICAgIG1lbS5sYXN0SGlnaGxpZ2h0Q29uZmlybWVkID0gc3VjY2VzcztcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBFeHBsb3JlU3RlcCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGFuYWx5emVQYWdlRm9yR29hbCwgcmVzZXRUYXNrTWVtb3J5LCBnZXRDb21wbGV0ZWRTdGVwcywgY29uZmlybUhpZ2hsaWdodCB9IGZyb20gJy4uL2xpYi9leHBsb3JlckVuZ2luZSc7XG5cbmludGVyZmFjZSBTZXNzaW9uU3RhdGUge1xuICBtb2RlOiAndHV0b3InIHwgJ2V4cGxvcmUnIHwgbnVsbDtcbiAgYWN0aXZlOiBib29sZWFuO1xuICBjdXJyZW50U3RlcHM6IEV4cGxvcmVTdGVwW107XG4gIGN1cnJlbnRTdGVwSW5kZXg6IG51bWJlcjtcbiAgY3VycmVudFRhYklkOiBudW1iZXIgfCBudWxsO1xufVxuXG5jb25zdCByZWFkeVRhYnMgPSBuZXcgU2V0PG51bWJlcj4oKTtcblxuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQmFja2dyb3VuZCh7XG4gIG1haW4oKSB7XG4gICAgYnJvd3Nlci5zaWRlUGFuZWwuc2V0UGFuZWxCZWhhdmlvcih7IG9wZW5QYW5lbE9uQWN0aW9uQ2xpY2s6IHRydWUgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgYnJvd3Nlci5hY3Rpb24ub25DbGlja2VkLmFkZExpc3RlbmVyKGFzeW5jICh0YWIpID0+IHtcbiAgICAgICAgYXdhaXQgYnJvd3Nlci5zaWRlUGFuZWwub3Blbih7IHRhYklkOiB0YWIuaWQhIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGF0ZTogU2Vzc2lvblN0YXRlID0ge1xuICAgICAgbW9kZTogbnVsbCxcbiAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICBjdXJyZW50U3RlcHM6IFtdLFxuICAgICAgY3VycmVudFN0ZXBJbmRleDogMCxcbiAgICAgIGN1cnJlbnRUYWJJZDogbnVsbCxcbiAgICB9O1xuXG4gICAgYXN5bmMgZnVuY3Rpb24gc2VuZFRvQ29udGVudCh0YWJJZDogbnVtYmVyLCBtZXNzYWdlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGJyb3dzZXIudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgbWVzc2FnZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBbV2ViR3VpZGVyXSBzZW5kVG9Db250ZW50IGZhaWxlZCBmb3IgdGFiICR7dGFiSWR9OmAsIGVycik7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIGluamVjdENvbnRlbnRTY3JpcHQodGFiSWQ6IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgICAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICAgICAgICBmaWxlczogWydjb250ZW50LXNjcmlwdHMvY29udGVudC5qcyddLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coYFtXZWJHdWlkZXJdIENvbnRlbnQgc2NyaXB0IGluamVjdGVkIGludG8gdGFiICR7dGFiSWR9YCk7XG4gICAgICAgIGF3YWl0IHNsZWVwKDMwMCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgW1dlYkd1aWRlcl0gRmFpbGVkIHRvIGluamVjdCBjb250ZW50IHNjcmlwdCBpbnRvIHRhYiAke3RhYklkfTpgLCBlcnIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gYW5hbHl6ZUN1cnJlbnRUYWIodGFiSWQ6IG51bWJlcik6IFByb21pc2U8YW55IHwgbnVsbD4ge1xuICAgICAgZm9yIChsZXQgYXR0ZW1wdCA9IDA7IGF0dGVtcHQgPCAzOyBhdHRlbXB0KyspIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIHsgdHlwZTogJ0FOQUxZWkVfUEFHRScgfSk7XG4gICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgcmVhZHlUYWJzLmFkZCh0YWJJZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgW1dlYkd1aWRlcl0gYW5hbHl6ZUN1cnJlbnRUYWIgYXR0ZW1wdCAke2F0dGVtcHQgKyAxfS8zIGZhaWxlZCBmb3IgdGFiICR7dGFiSWR9OmAsIGVycik7XG4gICAgICAgICAgaWYgKGF0dGVtcHQgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGluamVjdGVkID0gYXdhaXQgaW5qZWN0Q29udGVudFNjcmlwdCh0YWJJZCk7XG4gICAgICAgICAgICBpZiAoaW5qZWN0ZWQpIHtcbiAgICAgICAgICAgICAgYXdhaXQgc2xlZXAoNTAwKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhdHRlbXB0IDwgMikge1xuICAgICAgICAgICAgYXdhaXQgc2xlZXAoNTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2U6IGFueSwgc2VuZGVyOiBhbnksIHNlbmRSZXNwb25zZTogYW55KSA9PiB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlICdDT05URU5UX1NDUklQVF9SRUFEWSc6IHtcbiAgICAgICAgICBjb25zdCB0YWJJZCA9IHNlbmRlci50YWI/LmlkO1xuICAgICAgICAgIGlmICh0YWJJZCkge1xuICAgICAgICAgICAgcmVhZHlUYWJzLmFkZCh0YWJJZCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW1dlYkd1aWRlcl0gQ29udGVudCBzY3JpcHQgcmVhZHkgaW4gdGFiICR7dGFiSWR9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHJlY2VpdmVkOiB0cnVlIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSAnRVhQTE9SRV9BTkFMWVpFJzoge1xuICAgICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgYnJvd3Nlci50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pO1xuICAgICAgICAgICAgICBjb25zdCB0YWJJZCA9IHRhYnNbMF0/LmlkO1xuICAgICAgICAgICAgICBpZiAoIXRhYklkKSB7XG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgZXJyb3I6ICdObyBhY3RpdmUgdGFiJywgY29tcGxldGVkOiBmYWxzZSwgY29uZmlkZW5jZTogMCwgbmV4dEluc3RydWN0aW9uOiAnVW5hYmxlIHRvIGluc3BlY3QgY3VycmVudCB3ZWJwYWdlLiBObyBhY3RpdmUgdGFiIGZvdW5kLicgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbV2ViR3VpZGVyXSBFWFBMT1JFX0FOQUxZWkUgZm9yIHRhYiAke3RhYklkfSwgZ29hbDpgLCBtZXNzYWdlLmdvYWwpO1xuICAgICAgICAgICAgICBjb25zdCBwYWdlRGF0YSA9IGF3YWl0IGFuYWx5emVDdXJyZW50VGFiKHRhYklkKTtcbiAgICAgICAgICAgICAgaWYgKCFwYWdlRGF0YSkge1xuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IGVycm9yOiAnQ2Fubm90IGFjY2VzcyBwYWdlJywgY29tcGxldGVkOiBmYWxzZSwgY29uZmlkZW5jZTogMCwgbmV4dEluc3RydWN0aW9uOiAnVW5hYmxlIHRvIGluc3BlY3QgY3VycmVudCB3ZWJwYWdlLiBDb250ZW50IHNjcmlwdCBpcyBub3QgcmVzcG9uZGluZy4gVHJ5IHJlbG9hZGluZyB0aGUgcGFnZSBvciBuYXZpZ2F0aW5nIHRvIGEgZGlmZmVyZW50IFVSTC4nIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAocGFnZURhdGEuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBlcnJvcjogcGFnZURhdGEuZXJyb3IsIGNvbXBsZXRlZDogZmFsc2UsIGNvbmZpZGVuY2U6IDAsIG5leHRJbnN0cnVjdGlvbjogJ1RoZSBwYWdlIGFuYWx5c2lzIGVuY291bnRlcmVkIGFuIGVycm9yLiBQbGVhc2UgdHJ5IGFnYWluLicgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGFuYWx5emVQYWdlRm9yR29hbChtZXNzYWdlLmdvYWwsIHBhZ2VEYXRhKTtcbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHJlc3VsdCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1dlYkd1aWRlcl0gRVhQTE9SRV9BTkFMWVpFIGVycm9yOicsIGVycik7XG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IGVycm9yOiBTdHJpbmcoZXJyKSwgY29tcGxldGVkOiBmYWxzZSwgY29uZmlkZW5jZTogMCwgbmV4dEluc3RydWN0aW9uOiAnQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2Fpbi4nIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlICdFWFBMT1JFX1JFU0VUJzoge1xuICAgICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgYnJvd3Nlci50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pO1xuICAgICAgICAgICAgICBpZiAodGFic1swXT8udXJsKSB7XG4gICAgICAgICAgICAgICAgcmVzZXRUYXNrTWVtb3J5KG1lc3NhZ2UuZ29hbCwgdGFic1swXS51cmwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbV2ViR3VpZGVyXSBFWFBMT1JFX1JFU0VUIGVycm9yOicsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlICdFWFBMT1JFX0dFVF9QUk9HUkVTUyc6IHtcbiAgICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgdGFicyA9IGF3YWl0IGJyb3dzZXIudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgaWYgKHRhYnNbMF0/LnVybCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXBzID0gZ2V0Q29tcGxldGVkU3RlcHMobWVzc2FnZS5nb2FsLCB0YWJzWzBdLnVybCk7XG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3RlcHMgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3RlcHM6IFtdIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbV2ViR3VpZGVyXSBFWFBMT1JFX0dFVF9QUk9HUkVTUyBlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdGVwczogW10gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ1BBR0VfQ0hBTkdFRCc6IHtcbiAgICAgICAgICBzZW5kUmVzcG9uc2UoeyByZWNlaXZlZDogdHJ1ZSB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ1VSTF9DSEFOR0VEJzoge1xuICAgICAgICAgIGNvbnN0IHRhYklkID0gc2VuZGVyLnRhYj8uaWQ7XG4gICAgICAgICAgaWYgKHRhYklkKSByZWFkeVRhYnMuZGVsZXRlKHRhYklkKTtcbiAgICAgICAgICBzZW5kUmVzcG9uc2UoeyByZWNlaXZlZDogdHJ1ZSB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ0dFVF9QQUdFX0lORk8nOiB7XG4gICAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhYklkID0gc2VuZGVyLnRhYj8uaWQgfHwgc3RhdGUuY3VycmVudFRhYklkO1xuICAgICAgICAgICAgaWYgKCF0YWJJZCkge1xuICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyB1cmw6ICcnLCB0aXRsZTogJycsIGRvbWFpbjogJycgfSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNlbmRUb0NvbnRlbnQodGFiSWQsIHsgdHlwZTogJ0dFVF9QQUdFX0lORk8nIH0pO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHJlc3VsdCB8fCB7IHVybDogJycsIHRpdGxlOiAnJywgZG9tYWluOiAnJyB9KTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSAnQ09ORklSTV9ISUdITElHSFQnOiB7XG4gICAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBicm93c2VyLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWUgfSk7XG4gICAgICAgICAgICAgIGlmICh0YWJzWzBdPy51cmwpIHtcbiAgICAgICAgICAgICAgICBjb25maXJtSGlnaGxpZ2h0KG1lc3NhZ2UuZ29hbCwgdGFic1swXS51cmwsIG1lc3NhZ2Uuc3VjY2Vzcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tXZWJHdWlkZXJdIENPTkZJUk1fSElHSExJR0hUIGVycm9yOicsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyByZWNlaXZlZDogdHJ1ZSB9KTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSAnU1RBUlRfR1VJREUnOiB7XG4gICAgICAgICAgc3RhdGUubW9kZSA9ICdleHBsb3JlJztcbiAgICAgICAgICBzdGF0ZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgIHN0YXRlLmN1cnJlbnRTdGVwcyA9IG1lc3NhZ2Uuc3RlcHMgYXMgRXhwbG9yZVN0ZXBbXTtcbiAgICAgICAgICBzdGF0ZS5jdXJyZW50U3RlcEluZGV4ID0gMDtcbiAgICAgICAgICBzdGF0ZS5jdXJyZW50VGFiSWQgPSBzZW5kZXIudGFiPy5pZCB8fCBudWxsO1xuXG4gICAgICAgICAgaWYgKHN0YXRlLmN1cnJlbnRUYWJJZCkge1xuICAgICAgICAgICAgc2VuZFRvQ29udGVudChzdGF0ZS5jdXJyZW50VGFiSWQsIHtcbiAgICAgICAgICAgICAgdHlwZTogJ1NUQVJUX0dVSURFJyxcbiAgICAgICAgICAgICAgc3RlcHM6IHN0YXRlLmN1cnJlbnRTdGVwcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSAnU1RFUF9ORVhUJzoge1xuICAgICAgICAgIGlmIChzdGF0ZS5jdXJyZW50U3RlcEluZGV4IDwgc3RhdGUuY3VycmVudFN0ZXBzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRTdGVwSW5kZXgrKztcbiAgICAgICAgICAgIGlmIChzdGF0ZS5jdXJyZW50VGFiSWQpIHtcbiAgICAgICAgICAgICAgc2VuZFRvQ29udGVudChzdGF0ZS5jdXJyZW50VGFiSWQsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnSElHSExJR0hUX1NURVAnLFxuICAgICAgICAgICAgICAgIHN0ZXA6IHN0YXRlLmN1cnJlbnRTdGVwc1tzdGF0ZS5jdXJyZW50U3RlcEluZGV4XSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHN0YXRlLmN1cnJlbnRUYWJJZCkge1xuICAgICAgICAgICAgICBzZW5kVG9Db250ZW50KHN0YXRlLmN1cnJlbnRUYWJJZCwgeyB0eXBlOiAnU1RPUF9HVUlERScgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUsIGNvbXBsZXRlZDogIXN0YXRlLmFjdGl2ZSB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ1NURVBfUFJFVic6IHtcbiAgICAgICAgICBpZiAoc3RhdGUuY3VycmVudFN0ZXBJbmRleCA+IDApIHtcbiAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRTdGVwSW5kZXgtLTtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5jdXJyZW50VGFiSWQpIHtcbiAgICAgICAgICAgICAgc2VuZFRvQ29udGVudChzdGF0ZS5jdXJyZW50VGFiSWQsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnSElHSExJR0hUX1NURVAnLFxuICAgICAgICAgICAgICAgIHN0ZXA6IHN0YXRlLmN1cnJlbnRTdGVwc1tzdGF0ZS5jdXJyZW50U3RlcEluZGV4XSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlICdTVE9QX0dVSURFJzoge1xuICAgICAgICAgIHN0YXRlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgIHN0YXRlLmN1cnJlbnRTdGVwcyA9IFtdO1xuICAgICAgICAgIHN0YXRlLmN1cnJlbnRTdGVwSW5kZXggPSAwO1xuICAgICAgICAgIGlmIChzdGF0ZS5jdXJyZW50VGFiSWQpIHtcbiAgICAgICAgICAgIHNlbmRUb0NvbnRlbnQoc3RhdGUuY3VycmVudFRhYklkLCB7IHR5cGU6ICdTVE9QX0dVSURFJyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ0dFVF9TVEFURSc6IHtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoc3RhdGUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSAnU0VORF9OT1RJRklDQVRJT04nOiB7XG4gICAgICAgICAgYnJvd3Nlci5ub3RpZmljYXRpb25zLmNyZWF0ZSh7XG4gICAgICAgICAgICB0eXBlOiAnYmFzaWMnLFxuICAgICAgICAgICAgaWNvblVybDogJy9pY29ucy9pY29uLTQ4LnBuZycsXG4gICAgICAgICAgICB0aXRsZTogJ1dlYi1HdWlkZXInLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZS50ZXh0IGFzIHN0cmluZyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSAnSElHSExJR0hUX1NFTEVDVE9SJzoge1xuICAgICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YWJJZCA9IHNlbmRlci50YWI/LmlkIHx8IHN0YXRlLmN1cnJlbnRUYWJJZDtcbiAgICAgICAgICAgIGlmICh0YWJJZCkge1xuICAgICAgICAgICAgICBhd2FpdCBzZW5kVG9Db250ZW50KHRhYklkLCB7IHR5cGU6ICdISUdITElHSFRfU0VMRUNUT1InLCBzZWxlY3RvcjogbWVzc2FnZS5zZWxlY3RvciB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHsgZXJyb3I6ICdVbmtub3duIG1lc3NhZ2UgdHlwZTogJyArIG1lc3NhZ2UudHlwZSB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKChkZXRhaWxzKSA9PiB7XG4gICAgICBpZiAoZGV0YWlscy5yZWFzb24gPT09ICdpbnN0YWxsJykge1xuICAgICAgICBicm93c2VyLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgICAgICBpbnN0YWxsZWQ6IHRydWUsXG4gICAgICAgICAgaW5zdGFsbERhdGU6IERhdGUubm93KCksXG4gICAgICAgICAgcHJlZmVyZW5jZXM6IHtcbiAgICAgICAgICAgIHRoZW1lOiAnc3lzdGVtJyxcbiAgICAgICAgICAgIG1vZGVsOiAnZ3B0LTQnLFxuICAgICAgICAgICAgdm9pY2VFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGF1dG9Qcm9ncmVzczogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGJyb3dzZXIudGFicy5vbkFjdGl2YXRlZC5hZGRMaXN0ZW5lcigoYWN0aXZlSW5mbykgPT4ge1xuICAgICAgc3RhdGUuY3VycmVudFRhYklkID0gYWN0aXZlSW5mby50YWJJZDtcbiAgICB9KTtcbiAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbImdsb2JhbCIsInRoaXMiLCJtb2R1bGUiLCJfYSIsInByb3h5VGFyZ2V0IiwidmFsdWUiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7QUFVQSxNQUFJLGdCQUFlLFdBQW1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFrQnJDLFlBQVksY0FBYztBQUN6QixVQUFJLGlCQUFpQixjQUFjO0FBQ2xDLGFBQUssWUFBWTtBQUNqQixhQUFLLGtCQUFrQixDQUFDLEdBQUcsR0FBYSxTQUFTO0FBQ2pELGFBQUssZ0JBQWdCO0FBQ3JCLGFBQUssZ0JBQWdCO0FBQUEsTUFDdEIsT0FBTztBQUNOLGNBQU0sU0FBUyx1QkFBdUIsS0FBSyxZQUFZO0FBQ3ZELFlBQUksVUFBVSxLQUFNLE9BQU0sSUFBSSxvQkFBb0IsY0FBYyxrQkFBa0I7QUFDbEYsY0FBTSxDQUFDLEdBQUcsVUFBVSxVQUFVLFFBQVEsSUFBSTtBQUMxQyx5QkFBaUIsY0FBYyxRQUFRO0FBQ3ZDLHlCQUFpQixjQUFjLFFBQVE7QUFDdkMsYUFBSyxrQkFBa0IsYUFBYSxNQUFNLENBQUMsUUFBUSxPQUFPLElBQUksQ0FBQyxRQUFRO0FBQ3ZFLGFBQUssZ0JBQWdCO0FBQ3JCLGFBQUssZ0JBQWdCO0FBQUEsTUFDdEI7QUFBQSxJQUNEO0FBQUE7QUFBQSxJQUVBLFNBQVMsS0FBSztBQUNiLFlBQU0sSUFBSSxPQUFPLFFBQVEsV0FBVyxJQUFJLElBQUksR0FBRyxJQUFJLGVBQWUsV0FBVyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7QUFDakcsVUFBSSxLQUFLLFVBQVcsUUFBTyxDQUFDLEtBQUssa0JBQWtCLENBQUM7QUFD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
