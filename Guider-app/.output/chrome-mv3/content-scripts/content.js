var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
(function() {
  "use strict";
  var _a, _b, _isTopFrame, _abortController, _locationWatcher, __ContentScriptContext_instances, stopOldScripts_fn, listenForNewerScripts_fn;
  function defineContentScript(definition2) {
    return definition2;
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
      var _a2, _b2;
      if (!((_b2 = (_a2 = globalThis.chrome) == null ? void 0 : _a2.runtime) == null ? void 0 : _b2.id)) {
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
  const definition = defineContentScript({
    matches: ["<all_urls>"],
    runAt: "document_idle",
    main() {
      let observer = null;
      let pageLoaded = false;
      let currentHighlightElement = null;
      let highlightPositionUpdater = null;
      let clickDismissListener = null;
      let retryTimeout = null;
      function analyzePage() {
        try {
          return {
            url: location.href,
            domain: location.hostname,
            title: document.title,
            visibleText: extractVisibleText(),
            buttons: extractButtons(),
            links: extractLinks(),
            inputs: extractInputs(),
            forms: extractForms(),
            headings: extractHeadings(),
            navigation: extractNavigation(),
            dialogs: extractDialogs(),
            ariaLabels: extractAriaLabels(),
            placeholders: extractPlaceholders(),
            images: extractImages(),
            selectElement: extractSelects(),
            checkboxes: extractCheckboxes(),
            tabs: extractTabs(),
            successMessages: extractSuccessMessages(),
            errorMessages: extractErrorMessages(),
            validationMessages: extractValidationMessages(),
            disabledButtons: extractDisabledButtons(),
            breadcrumbs: extractBreadcrumbs(),
            toasts: extractToasts(),
            pagePurpose: extractPagePurpose(),
            activeWorkflow: extractActiveWorkflow(),
            pageState: document.readyState
          };
        } catch (err) {
          console.error("[WebGuider] analyzePage error:", err);
          return {
            url: location.href,
            domain: location.hostname,
            title: document.title,
            visibleText: "",
            buttons: [],
            links: [],
            inputs: [],
            forms: [],
            headings: [],
            navigation: [],
            dialogs: [],
            ariaLabels: [],
            placeholders: [],
            images: [],
            selectElement: [],
            checkboxes: [],
            tabs: [],
            successMessages: [],
            errorMessages: [],
            validationMessages: [],
            disabledButtons: [],
            breadcrumbs: [],
            toasts: [],
            pagePurpose: "",
            activeWorkflow: "",
            pageState: document.readyState
          };
        }
      }
      function extractVisibleText() {
        const body = document.body;
        if (!body) return "";
        const clone = body.cloneNode(true);
        const tagsToRemove = clone.querySelectorAll('script, style, noscript, iframe, svg, [aria-hidden="true"]');
        tagsToRemove.forEach((el) => el.remove());
        return (clone.textContent || "").replace(/\s+/g, " ").trim().slice(0, 3e3);
      }
      function extractButtons() {
        const els = document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"]');
        return Array.from(els).slice(0, 80).map((el) => ({
          text: (el.textContent || el.value || "").trim().slice(0, 60),
          selector: generateSelector(el),
          type: el.tagName.toLowerCase(),
          visible: isVisible(el)
        })).filter((b) => b.text || b.selector);
      }
      function extractLinks() {
        const els = document.querySelectorAll("a[href]");
        return Array.from(els).slice(0, 80).map((el) => ({
          text: (el.textContent || "").trim().slice(0, 60),
          href: el.href,
          selector: generateSelector(el),
          visible: isVisible(el)
        })).filter((l) => l.text || l.href);
      }
      function extractInputs() {
        const els = document.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="hidden"]), textarea, select');
        return Array.from(els).slice(0, 40).map((el) => ({
          type: el.type || "text",
          name: el.name || "",
          placeholder: el.placeholder || "",
          label: getLabel(el),
          selector: generateSelector(el),
          required: el.required || false,
          visible: isVisible(el)
        }));
      }
      function extractForms() {
        const forms = document.querySelectorAll("form");
        return Array.from(forms).slice(0, 10).map((form) => {
          var _a2;
          return {
            action: form.action || "",
            method: form.method || "get",
            fields: Array.from(form.querySelectorAll("input, textarea, select")).length,
            submitText: (((_a2 = form.querySelector('button[type="submit"], input[type="submit"]')) == null ? void 0 : _a2.textContent) || "").trim(),
            selector: generateSelector(form)
          };
        });
      }
      function extractHeadings() {
        const els = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        return Array.from(els).slice(0, 30).map((el) => ({
          level: parseInt(el.tagName[1]),
          text: (el.textContent || "").trim().slice(0, 100),
          selector: generateSelector(el)
        }));
      }
      function extractNavigation() {
        const navs = document.querySelectorAll('nav, [role="navigation"], header');
        return Array.from(navs).slice(0, 5).map((nav) => ({
          links: Array.from(nav.querySelectorAll("a")).slice(0, 20).map((a) => ({
            text: (a.textContent || "").trim().slice(0, 40),
            href: a.href
          }))
        }));
      }
      function extractDialogs() {
        const els = document.querySelectorAll('[role="dialog"], [role="alertdialog"], dialog, .modal, [class*="modal"]');
        return Array.from(els).slice(0, 10).filter((el) => isVisible(el)).map((el) => ({
          text: (el.textContent || "").trim().slice(0, 200),
          selector: generateSelector(el)
        }));
      }
      function extractAriaLabels() {
        const els = document.querySelectorAll('[aria-label]:not([aria-label=""]), [aria-describedby]');
        return Array.from(els).slice(0, 40).map((el) => ({
          label: el.getAttribute("aria-label") || "",
          tag: el.tagName.toLowerCase(),
          selector: generateSelector(el)
        }));
      }
      function extractPlaceholders() {
        const els = document.querySelectorAll("[placeholder]");
        return Array.from(new Set(Array.from(els).map((el) => el.placeholder))).slice(0, 20);
      }
      function extractImages() {
        const els = document.querySelectorAll('img[alt]:not([alt=""])');
        return Array.from(els).slice(0, 30).map((el) => {
          var _a2;
          return {
            alt: el.alt,
            src: (_a2 = el.src) == null ? void 0 : _a2.slice(0, 100),
            selector: generateSelector(el)
          };
        });
      }
      function extractSelects() {
        const els = document.querySelectorAll("select");
        return Array.from(els).slice(0, 20).map((el) => ({
          name: el.name || "",
          options: Array.from(el.options).map((o) => o.text).slice(0, 10),
          selector: generateSelector(el)
        }));
      }
      function extractCheckboxes() {
        const els = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
        return Array.from(els).slice(0, 20).map((el) => ({
          type: el.type,
          name: el.name || "",
          label: getLabel(el),
          checked: el.checked,
          selector: generateSelector(el)
        }));
      }
      function extractTabs() {
        const els = document.querySelectorAll('[role="tab"], [role="tabpanel"], [data-tab]');
        return Array.from(els).slice(0, 20).map((el) => ({
          text: (el.textContent || "").trim().slice(0, 40),
          selected: el.getAttribute("aria-selected") === "true" || el.classList.contains("active"),
          role: el.getAttribute("role") || "",
          selector: generateSelector(el)
        }));
      }
      function extractSuccessMessages() {
        var _a2;
        const results = [];
        const selectors = [
          '[role="status"][aria-live="polite"]',
          '[role="alert"][aria-live="assertive"]',
          ".success, .alert-success, .notification-success, .toast-success",
          '[data-testid*="success"]',
          '[class*="success"]:not([class*="error"]):not([class*="danger"])'
        ].join(", ");
        const els = document.querySelectorAll(selectors);
        els.forEach((el) => {
          const text = (el.textContent || "").trim();
          if (text && text.length > 5 && text.length < 200 && isVisible(el)) {
            const style = window.getComputedStyle(el);
            const color = style.color || "";
            const bg = style.backgroundColor || "";
            const isGreen = /green|#00|#0a|#2e|rgb\(0,\s*1/i.test(color + bg);
            if (isGreen || /success/i.test(el.className)) {
              results.push(text);
            }
          }
        });
        if (results.length === 0) {
          const bodyText = ((_a2 = document.body) == null ? void 0 : _a2.innerText) || "";
          const successPatterns = [
            /successfully|completed successfully|has been created|has been updated|you('| a)re all set|changes saved|your changes have been|account created|signed in successfully|logged in successfully|welcome back/i
          ];
          for (const p of successPatterns) {
            const match = bodyText.match(p);
            if (match) {
              const sentence = extractNearbySentence(bodyText, match.index);
              if (sentence) results.push(sentence);
            }
          }
        }
        return results.slice(0, 3);
      }
      function extractErrorMessages() {
        var _a2;
        const results = [];
        const selectors = [
          '[role="alert"]',
          '[aria-live="assertive"]',
          ".error, .alert-error, .alert-danger, .notification-error",
          '[data-testid*="error"]',
          '[class*="error"]:not([class*="success"])',
          ".field-error, .form-error, .validation-error",
          ".invalid-feedback",
          "[data-error]"
        ].join(", ");
        const els = document.querySelectorAll(selectors);
        els.forEach((el) => {
          const text = (el.textContent || "").trim();
          if (text && text.length > 3 && text.length < 300 && isVisible(el)) {
            const style = window.getComputedStyle(el);
            const color = style.color || "";
            const isRed = /red|#e[0-9a-f]{3,}|#c[0-9a-f]{3,}|#d[0-9a-f]{3,}|rgb\(2[0-9][0-9]|rgb\(1[8-9]/i.test(color);
            if (isRed || /error|danger|invalid|required/i.test(el.className + el.id)) {
              if (!results.includes(text)) results.push(text);
            }
          }
        });
        if (results.length === 0) {
          const bodyText = ((_a2 = document.body) == null ? void 0 : _a2.innerText) || "";
          const errorPatterns = [
            /incorrect\s+(username|password|email|otp|pwd)|invalid\s+(username|password|email|otp|credentials?)|wrong\s+(password|otp|email|username)/i,
            /(username|password|email)\s+(is\s+)?(required|invalid|incorrect|wrong|taken|already\s+exists)/i,
            /(login|sign\s*in)\s+(failed|unsuccessful|error)/i,
            /(password|otp)\s+(doesn't\s+match|do\s+not\s+match|mismatch)/i,
            /(payment|transaction|order)\s+(failed|declined|rejected|error)/i,
            /(repository|package|name)\s+(already\s+exists|is\s+taken|invalid)/i,
            /(access|permission)\s+denied|unauthorized|forbidden/i,
            /(not\s+found|page\s+not\s+found|404)/i,
            /(something\s+went\s+wrong|try\s+again|please\s+try\s+again)/i
          ];
          for (const p of errorPatterns) {
            const match = bodyText.match(p);
            if (match) {
              const sentence = extractNearbySentence(bodyText, match.index);
              if (sentence && !results.includes(sentence)) results.push(sentence);
            }
          }
        }
        return results.slice(0, 3);
      }
      function extractValidationMessages() {
        const results = [];
        const els = document.querySelectorAll(
          ".field-validation-error, .validation-summary-errors, .text-danger, [data-valmsg-for]"
        );
        els.forEach((el) => {
          const text = (el.textContent || "").trim();
          if (text && text.length > 3 && isVisible(el)) {
            if (!results.includes(text)) results.push(text);
          }
        });
        document.querySelectorAll("input:invalid, textarea:invalid, select:invalid").forEach((el) => {
          const label = getLabel(el);
          const validationMsg = el.validationMessage;
          if (validationMsg) {
            const msg = label ? `"${label}" — ${validationMsg}` : validationMsg;
            if (!results.includes(msg)) results.push(msg);
          }
        });
        return results.slice(0, 5);
      }
      function extractDisabledButtons() {
        return Array.from(document.querySelectorAll(
          'button:disabled, [role="button"][aria-disabled="true"], input[type="submit"]:disabled, a.disabled'
        )).slice(0, 10).map((el) => ({
          text: (el.textContent || el.value || "").trim().slice(0, 60),
          selector: generateSelector(el)
        })).filter((b) => b.text);
      }
      function extractBreadcrumbs() {
        const nav = document.querySelector('nav[aria-label="Breadcrumb"], .breadcrumb, [role="navigation"][aria-label*="breadcrumb"]');
        if (nav) {
          return Array.from(nav.querySelectorAll('a, span, [aria-current="page"]')).map(
            (el) => (el.textContent || "").trim()
          ).filter(Boolean);
        }
        const items = document.querySelectorAll('[itemprop="itemListElement"]');
        if (items.length > 0) {
          return Array.from(items).map(
            (el) => {
              var _a2;
              return (((_a2 = el.querySelector('[itemprop="name"]')) == null ? void 0 : _a2.textContent) || el.textContent || "").trim();
            }
          ).filter(Boolean);
        }
        return [];
      }
      function extractToasts() {
        const results = [];
        const els = document.querySelectorAll(
          '[role="status"], [role="log"], [aria-live="polite"], .toast, .notification, .alert:not([role="alert"])'
        );
        els.forEach((el) => {
          if (el.closest('[role="dialog"], dialog, .modal')) return;
          const text = (el.textContent || "").trim();
          if (text && text.length > 3 && text.length < 300 && isVisible(el)) {
            if (!results.includes(text)) results.push(text);
          }
        });
        return results.slice(0, 3);
      }
      function extractPagePurpose() {
        var _a2, _b2, _c, _d;
        const url = location.pathname + location.search;
        const title = document.title.toLowerCase();
        const h1 = ((_b2 = (_a2 = document.querySelector("h1")) == null ? void 0 : _a2.textContent) == null ? void 0 : _b2.toLowerCase().trim()) || "";
        const mainHeading = ((_d = (_c = document.querySelector("h1, h2")) == null ? void 0 : _c.textContent) == null ? void 0 : _d.toLowerCase().trim()) || "";
        const purposeMap = [
          [/\/login|log(in|out)|signin|auth|authenticate/i, "Login / Authentication"],
          [/\/signup|register|create-account|sign-up/i, "Account Registration"],
          [/\/dashboard|my-account|account(\/|$)/i, "Dashboard / Account Overview"],
          [/\/settings|preferences|profile\/edit/i, "Settings / Profile Management"],
          [/\/search|find|results\?search/i, "Search Results"],
          [/\/checkout|cart|payment|order\/review/i, "Checkout / Payment"],
          [/\/orders?(\/|$)|purchases?|history/i, "Order History"],
          [/\/products?(\/|$)|items?(\/|$)|catalog|shop/i, "Product / Catalog Browsing"],
          [/\/create|new(\/|$)|add(\/|$)/i, "Create New Item"],
          [/\/edit|update|modify|change/i, "Edit / Update"],
          [/\/issues?(\/|$)|bugs?|tickets/i, "Issue / Ticket Management"],
          [/\/repos?(itory)?(\/|$)|projects?(\/|$)/i, "Repository / Project View"],
          [/\/pulls?|merge|pull-request/i, "Pull Requests"],
          [/\/wiki|docs?|documentation|help|support/i, "Documentation / Help"],
          [/\/profile(\/|$)|user(\/|$)/i, "User Profile"],
          [/\/notifications|inbox|messages/i, "Notifications / Messages"]
        ];
        for (const [pattern, purpose] of purposeMap) {
          if (pattern.test(url) || pattern.test(title) || pattern.test(h1)) {
            return purpose;
          }
        }
        if (/dashboard|overview|home\s*page|welcome/i.test(mainHeading)) return "Dashboard / Home";
        if (/login|sign\s*in|log\s*in/i.test(mainHeading)) return "Login / Authentication";
        if (/register|sign\s*up|create\s*account/i.test(mainHeading)) return "Account Registration";
        if (/settings|preferences|profile/i.test(mainHeading)) return "Settings / Profile";
        if (/search|find|browse/i.test(mainHeading)) return "Search / Browse";
        return "";
      }
      function extractActiveWorkflow() {
        const url = location.pathname + location.search;
        const title = document.title.toLowerCase();
        if (/\/login|log(in|out)|signin|auth/i.test(url) || /login|sign\s*in/i.test(title)) return "login";
        if (/register|signup|create-account|sign-up/i.test(url) || /register|sign\s*up/i.test(title)) return "signup";
        if (/\/checkout|cart|payment/i.test(url) || /checkout|cart/i.test(title)) return "checkout";
        if (/\/orders?(\/|$)|order\/confirm/i.test(url)) return "order-confirmation";
        if (/\/settings|preferences|profile/i.test(url)) return "settings";
        if (/\/create|new(\/|$)/i.test(url)) return "creation";
        if (/\/edit|update/i.test(url)) return "editing";
        const activeEl = document.querySelector('[aria-current="page"], [aria-current="step"], .active, .current');
        if (activeEl) {
          const text = (activeEl.textContent || "").toLowerCase().trim();
          if (text) return text;
        }
        return "";
      }
      function extractNearbySentence(text, index) {
        const before = text.slice(Math.max(0, index - 80), index);
        const after = text.slice(index, index + 200);
        const sentenceStart = Math.max(before.lastIndexOf(".") + 1, before.lastIndexOf("!") + 1, before.lastIndexOf("?") + 1, 0);
        const sentenceEnd = (() => {
          const endMatch = after.match(/[.!?](\s|$)/);
          return endMatch ? endMatch.index + 1 : after.length;
        })();
        return (before.slice(sentenceStart) + after.slice(0, sentenceEnd)).trim();
      }
      function getLabel(el) {
        const id = el.getAttribute("id");
        if (id) {
          const labelEl = document.querySelector(`label[for="${id}"]`);
          if (labelEl) return (labelEl.textContent || "").trim();
        }
        const parent = el.closest("label");
        if (parent) return (parent.textContent || "").trim().replace(el.textContent || "", "").trim();
        const ariaLabel = el.getAttribute("aria-label");
        if (ariaLabel) return ariaLabel;
        return "";
      }
      function isVisible(el) {
        if (!el.offsetParent && el.tagName !== "BODY") return false;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) return false;
        return true;
      }
      function generateSelector(el) {
        if (el.id) return `#${CSS.escape(el.id)}`;
        if (el.getAttribute("data-testid")) return `[data-testid="${el.getAttribute("data-testid")}"]`;
        if (el.getAttribute("name")) return `${el.tagName.toLowerCase()}[name="${el.getAttribute("name")}"]`;
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter((c) => c.tagName === el.tagName);
          if (siblings.length > 1) {
            const index = siblings.indexOf(el) + 1;
            return `${el.tagName.toLowerCase()}:nth-child(${index})`;
          }
        }
        return el.tagName.toLowerCase();
      }
      function findElementSmart(target) {
        const { text, role, elementType } = target;
        if (!text) return null;
        const textLower = text.toLowerCase().trim();
        if (!textLower) return null;
        const candidates = [];
        function scoreByVisibility(el) {
          if (!isVisible(el)) return -50;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return -50;
          const viewportH = window.innerHeight;
          const viewportW = window.innerWidth;
          const centerY = viewportH / 2;
          const centerX = viewportW / 2;
          const elCenterY = rect.top + rect.height / 2;
          const elCenterX = rect.left + rect.width / 2;
          const distFromCenter = Math.sqrt((elCenterX - centerX) ** 2 + (elCenterY - centerY) ** 2);
          return Math.max(0, 30 - distFromCenter / 50);
        }
        function normalizeText(t) {
          return t.replace(/\s+/g, " ").trim().toLowerCase();
        }
        function addCandidate(el, strategy, confBonus) {
          if (candidates.some((c) => c.element === el)) return;
          const visScore = scoreByVisibility(el);
          const totalConf = Math.min(100, Math.max(0, confBonus + visScore));
          candidates.push({
            element: el,
            selector: generateSelector(el),
            confidence: totalConf,
            strategy
          });
        }
        const roleTagMap = {
          button: 'button, [role="button"], input[type="submit"], input[type="button"]',
          link: 'a, [role="link"]',
          textbox: 'input, textarea, [role="textbox"]',
          input: 'input, textarea, select, [role="textbox"], [role="combobox"]',
          tab: '[role="tab"]',
          menuitem: '[role="menuitem"]',
          option: '[role="option"]',
          combobox: '[role="combobox"], select',
          dialog: '[role="dialog"], [role="alertdialog"], dialog',
          checkbox: 'input[type="checkbox"], [role="checkbox"]',
          radio: 'input[type="radio"], [role="radio"]'
        };
        const elementTypeMap = {
          button: 'button, [role="button"], input[type="submit"], input[type="button"]',
          link: 'a, [role="link"]',
          input: 'input, textarea, select, [role="textbox"], [role="combobox"]',
          form: "form"
        };
        const queryParts = [];
        if (role && roleTagMap[role]) {
          queryParts.push(roleTagMap[role]);
        }
        if (elementType && elementTypeMap[elementType]) {
          queryParts.push(elementTypeMap[elementType]);
        }
        queryParts.push('button, a, input, textarea, select, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [tabindex]:not([tabindex="-1"])');
        const query = queryParts.join(", ");
        const allInteractive = document.querySelectorAll(query);
        for (const el of allInteractive) {
          const elText = normalizeText(el.textContent || "");
          const elValue = normalizeText(el.value || "");
          const elPlaceholder = normalizeText(el.placeholder || "");
          const elAriaLabel = normalizeText(el.getAttribute("aria-label") || "");
          const elTitle = normalizeText(el.title || "");
          const elName = normalizeText(el.getAttribute("name") || "");
          const elAlt = normalizeText(el.getAttribute("alt") || "");
          if (elText === textLower) {
            addCandidate(el, "exact-text-match", 99);
          } else if (elAriaLabel === textLower) {
            addCandidate(el, "aria-label-exact", 97);
          } else if (elTitle === textLower) {
            addCandidate(el, "title-exact", 95);
          } else if (elPlaceholder === textLower) {
            addCandidate(el, "placeholder-exact", 94);
          } else if (elValue === textLower) {
            addCandidate(el, "value-exact", 93);
          } else if (elName === textLower) {
            addCandidate(el, "name-exact", 92);
          } else if (elAlt === textLower) {
            addCandidate(el, "alt-text-exact", 91);
          } else if (elText.includes(textLower)) {
            addCandidate(el, "text-contains", 82);
          } else if (elAriaLabel.includes(textLower)) {
            addCandidate(el, "aria-label-contains", 80);
          } else if (elTitle.includes(textLower)) {
            addCandidate(el, "title-contains", 78);
          } else if (elPlaceholder.includes(textLower)) {
            addCandidate(el, "placeholder-contains", 76);
          } else if (elName.includes(textLower)) {
            addCandidate(el, "name-contains", 72);
          } else if (elAlt.includes(textLower)) {
            addCandidate(el, "alt-text-contains", 70);
          } else if (textLower.includes(elText) && elText.length > 0) {
            addCandidate(el, "query-contains-element-text", 60);
          }
        }
        if (candidates.length === 0 && textLower.length > 1) {
          const allElements = document.querySelectorAll("*");
          for (const el of allElements) {
            if (el.children.length > 0 && !el.matches('button, a, input, textarea, select, [role="button"]')) continue;
            const elText = normalizeText(el.textContent || "");
            if (elText === textLower) {
              addCandidate(el, "broad-exact-text", 80);
            } else if (elText.includes(textLower)) {
              addCandidate(el, "broad-text-contains", 55);
            }
          }
        }
        if (candidates.length === 0 && textLower.length > 1) {
          try {
            const safeText = textLower.replace(/['"]/g, "");
            const xpathResult = document.evaluate(
              `//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${safeText}')]`,
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );
            for (let i = 0; i < xpathResult.snapshotLength && i < 20; i++) {
              const el = xpathResult.snapshotItem(i);
              if (el instanceof HTMLElement && !candidates.some((c) => c.element === el)) {
                addCandidate(el, "xpath-fallback", 50);
              }
            }
          } catch {
          }
        }
        if (candidates.length === 0 && textLower.length > 1) {
          try {
            const safeText = textLower.replace(/['"]/g, "");
            const partialXpath = document.evaluate(
              `//*[contains(translate(@aria-label, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${safeText}')]`,
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );
            for (let i = 0; i < partialXpath.snapshotLength && i < 10; i++) {
              const el = partialXpath.snapshotItem(i);
              if (el instanceof HTMLElement && !candidates.some((c) => c.element === el)) {
                addCandidate(el, "aria-label-xpath", 45);
              }
            }
          } catch {
          }
        }
        candidates.sort((a, b) => b.confidence - a.confidence);
        return candidates[0] || null;
      }
      const HIGHLIGHT_STYLE_ID = "wg-highlight-style";
      function injectHighlightStyles() {
        if (document.getElementById(HIGHLIGHT_STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = HIGHLIGHT_STYLE_ID;
        style.textContent = `
        @keyframes wg-glow-pulse {
          0%, 100% { box-shadow: 0 0 5px rgba(99,102,241,0.4), 0 0 10px rgba(99,102,241,0.2); }
          50% { box-shadow: 0 0 15px rgba(99,102,241,0.8), 0 0 30px rgba(99,102,241,0.4), 0 0 45px rgba(99,102,241,0.2); }
        }
        @keyframes wg-bounce-arrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .wg-highlight-overlay {
          position: fixed !important;
          pointer-events: none !important;
          z-index: 2147483646 !important;
          border: 3px solid #6366f1 !important;
          border-radius: 6px !important;
          animation: wg-glow-pulse 1.5s ease-in-out infinite !important;
          transition: all 0.15s ease !important;
          background: rgba(99,102,241,0.08) !important;
        }
        .wg-highlight-arrow {
          position: fixed !important;
          z-index: 2147483647 !important;
          pointer-events: none !important;
          animation: wg-bounce-arrow 1s ease-in-out infinite !important;
          color: #6366f1 !important;
          font-size: 28px !important;
          line-height: 1 !important;
          text-shadow: 0 2px 8px rgba(99,102,241,0.5) !important;
        }
        .wg-highlight-tooltip {
          position: fixed !important;
          z-index: 2147483647 !important;
          pointer-events: none !important;
          background: #4f46e5 !important;
          color: white !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          padding: 4px 12px !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 12px rgba(79,70,229,0.4) !important;
          white-space: nowrap !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .wg-highlight-tooltip::after {
          content: '' !important;
          position: absolute !important;
          top: 100% !important;
          left: 50% !important;
          margin-left: -5px !important;
          border: 5px solid transparent !important;
          border-top-color: #4f46e5 !important;
        }
      `;
        document.head.appendChild(style);
      }
      function clearHighlights() {
        if (retryTimeout) {
          clearTimeout(retryTimeout);
          retryTimeout = null;
        }
        if (currentHighlightElement) {
          currentHighlightElement.style.outline = "";
          currentHighlightElement.style.outlineOffset = "";
          currentHighlightElement.style.position = "";
          currentHighlightElement.style.zIndex = "";
          currentHighlightElement = null;
        }
        if (clickDismissListener) {
          document.removeEventListener("click", clickDismissListener, true);
          clickDismissListener = null;
        }
        if (highlightPositionUpdater) {
          highlightPositionUpdater();
          highlightPositionUpdater = null;
        }
        document.querySelectorAll(".wg-highlight-overlay, .wg-highlight-arrow, .wg-highlight-tooltip").forEach((el) => el.remove());
      }
      function showSmartHighlight(element) {
        clearHighlights();
        injectHighlightStyles();
        currentHighlightElement = element;
        element.style.outline = "3px solid #6366f1";
        element.style.outlineOffset = "2px";
        element.style.position = "relative";
        element.style.zIndex = "2147483645";
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        const rect = element.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        const overlay = document.createElement("div");
        overlay.className = "wg-highlight-overlay";
        overlay.style.top = `${rect.top + scrollY - 4}px`;
        overlay.style.left = `${rect.left + scrollX - 4}px`;
        overlay.style.width = `${rect.width + 8}px`;
        overlay.style.height = `${rect.height + 8}px`;
        document.body.appendChild(overlay);
        const arrow = document.createElement("div");
        arrow.className = "wg-highlight-arrow";
        arrow.textContent = "👆";
        arrow.style.top = `${rect.top + scrollY - 40}px`;
        arrow.style.left = `${rect.left + scrollX + rect.width / 2 - 14}px`;
        document.body.appendChild(arrow);
        const tooltip = document.createElement("div");
        tooltip.className = "wg-highlight-tooltip";
        tooltip.textContent = "Next Step";
        tooltip.style.top = `${rect.top + scrollY - 70}px`;
        tooltip.style.left = `${rect.left + scrollX + rect.width / 2 - 35}px`;
        document.body.appendChild(tooltip);
        const updatePositions = () => {
          const r = element.getBoundingClientRect();
          overlay.style.top = `${r.top + window.scrollY - 4}px`;
          overlay.style.left = `${r.left + window.scrollX - 4}px`;
          overlay.style.width = `${r.width + 8}px`;
          overlay.style.height = `${r.height + 8}px`;
          arrow.style.top = `${r.top + window.scrollY - 40}px`;
          arrow.style.left = `${r.left + window.scrollX + r.width / 2 - 14}px`;
          tooltip.style.top = `${r.top + window.scrollY - 70}px`;
          tooltip.style.left = `${r.left + window.scrollX + r.width / 2 - 35}px`;
        };
        window.addEventListener("scroll", updatePositions, { passive: true });
        window.addEventListener("resize", updatePositions, { passive: true });
        const positionObserver = new MutationObserver(() => updatePositions());
        positionObserver.observe(document.body, { attributes: true, attributeFilter: ["style", "class"], subtree: true });
        highlightPositionUpdater = () => {
          window.removeEventListener("scroll", updatePositions);
          window.removeEventListener("resize", updatePositions);
          positionObserver.disconnect();
        };
        clickDismissListener = (e) => {
          const target = e.target;
          if (element.contains(target) || target === element) {
            clearHighlights();
          }
        };
        document.addEventListener("click", clickDismissListener, true);
      }
      function handleHighlightRequest(target) {
        const result = findElementSmart(target);
        if (!result) {
          clearHighlights();
          console.warn(`[WebGuider] Could not find element matching "${target.text}" (role: ${target.role || "any"}, type: ${target.elementType || "any"}) — no candidates found`);
          return { success: false, error: `Could not find element matching "${target.text}" on the page.` };
        }
        if (result.confidence < 25) {
          clearHighlights();
          console.warn(`[WebGuider] Could not find element matching "${target.text}" — best candidate confidence ${result.confidence} (${result.strategy}) below threshold`);
          return { success: false, error: `Could not reliably find "${target.text}" on the page (confidence too low: ${result.confidence}%).` };
        }
        showSmartHighlight(result.element);
        console.log(`[WebGuider] Highlighted "${target.text}" → found via ${result.strategy} (confidence: ${result.confidence}%)`);
        return { success: true, selector: result.selector, confidence: result.confidence };
      }
      function handleHighlightWithRetry(target, attempt = 0) {
        const result = handleHighlightRequest(target);
        if (!result.success && attempt < 2) {
          const fallbackTarget = { ...target };
          if (attempt === 0) {
            fallbackTarget.text = target.text;
            fallbackTarget.role = void 0;
          } else if (attempt === 1) {
            const words = target.text.split(/\s+/);
            if (words.length > 1) {
              fallbackTarget.text = words[words.length - 1];
            } else {
              return result;
            }
          }
          retryTimeout = setTimeout(() => {
            handleHighlightWithRetry(fallbackTarget, attempt + 1);
          }, 500);
          return { success: false, error: `Retrying with fallback strategy (attempt ${attempt + 1})...` };
        }
        return result;
      }
      function startMutationWatching() {
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => {
          if (!pageLoaded) return;
          browser.runtime.sendMessage({ type: "PAGE_CHANGED" }).catch(() => {
          });
        });
        observer.observe(document.body || document.documentElement, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class", "style", "aria-hidden", "role"]
        });
      }
      function startUrlWatching() {
        let previousUrl = location.href;
        setInterval(() => {
          if (location.href !== previousUrl) {
            previousUrl = location.href;
            clearHighlights();
            browser.runtime.sendMessage({ type: "URL_CHANGED", url: location.href }).catch(() => {
            });
          }
        }, 500);
        new MutationObserver(() => {
          if (location.href !== previousUrl) {
            previousUrl = location.href;
            clearHighlights();
            browser.runtime.sendMessage({ type: "URL_CHANGED", url: location.href }).catch(() => {
            });
          }
        }).observe(document, { subtree: true, childList: true });
      }
      browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        var _a2;
        switch (message.type) {
          case "ANALYZE_PAGE":
            try {
              sendResponse(analyzePage());
            } catch (err) {
              console.error("[WebGuider] ANALYZE_PAGE failed:", err);
              sendResponse({ error: String(err) });
            }
            break;
          case "HIGHLIGHT_STEP":
            if ((_a2 = message.step) == null ? void 0 : _a2.selector) {
              const el = document.querySelector(message.step.selector);
              if (el) showSmartHighlight(el);
            }
            sendResponse({ success: true });
            break;
          case "HIGHLIGHT_SELECTOR":
            if (message.selector) {
              const el = document.querySelector(message.selector);
              if (el) {
                showSmartHighlight(el);
                sendResponse({ success: true });
              } else {
                sendResponse({ success: false, error: "Selector did not match any element" });
              }
            } else {
              sendResponse({ success: false, error: "No selector provided" });
            }
            break;
          case "FIND_AND_HIGHLIGHT":
            if (message.target) {
              const hlResult = handleHighlightWithRetry(message.target);
              sendResponse(hlResult);
            } else {
              sendResponse({ success: false, error: "No target provided" });
            }
            break;
          case "STOP_GUIDE":
            clearHighlights();
            sendResponse({ success: true });
            break;
          case "GET_PAGE_INFO":
            sendResponse({ url: location.href, title: document.title, domain: location.hostname });
            break;
          default:
            sendResponse({ error: "Unknown message type: " + message.type });
        }
        return true;
      });
      function onReady() {
        pageLoaded = true;
        startMutationWatching();
        startUrlWatching();
        browser.runtime.sendMessage({ type: "CONTENT_SCRIPT_READY", url: location.href }).catch(() => {
        });
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", onReady);
      } else {
        onReady();
      }
    }
  });
  const __vite_import_meta_env__ = {};
  function print$1(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  var logger$1 = {
    debug: (...args) => print$1(console.debug, ...args),
    log: (...args) => print$1(console.log, ...args),
    warn: (...args) => print$1(console.warn, ...args),
    error: (...args) => print$1(console.error, ...args)
  };
  var WxtLocationChangeEvent = (_a = class extends Event {
    constructor(newUrl, oldUrl) {
      super(_a.EVENT_NAME, {});
      this.newUrl = newUrl;
      this.oldUrl = oldUrl;
    }
  }, __publicField(_a, "EVENT_NAME", getUniqueEventName("wxt:locationchange")), _a);
  function getUniqueEventName(eventName) {
    const entrypointName = typeof __vite_import_meta_env__ === "undefined" ? "build" : "content";
    return `${browser.runtime.id}:${entrypointName}:${eventName}`;
  }
  function createLocationWatcher(ctx) {
    let interval;
    let oldUrl;
    return {
      /**
       * Ensure the location watcher is actively looking for URL changes. If it's already watching,
       * this is a noop.
       */
      run() {
        if (interval != null)
          return;
        oldUrl = new URL(location.href);
        interval = ctx.setInterval(() => {
          let newUrl = new URL(location.href);
          if (newUrl.href !== oldUrl.href) {
            window.dispatchEvent(new WxtLocationChangeEvent(newUrl, oldUrl));
            oldUrl = newUrl;
          }
        }, 1e3);
      }
    };
  }
  var ContentScriptContext = (_b = class {
    constructor(contentScriptName, options) {
      __privateAdd(this, __ContentScriptContext_instances);
      __privateAdd(this, _isTopFrame, window.self === window.top);
      __privateAdd(this, _abortController);
      __privateAdd(this, _locationWatcher, createLocationWatcher(this));
      this.contentScriptName = contentScriptName;
      this.options = options;
      __privateSet(this, _abortController, new AbortController());
      if (__privateGet(this, _isTopFrame)) {
        __privateMethod(this, __ContentScriptContext_instances, stopOldScripts_fn).call(this);
      }
      this.setTimeout(() => {
        __privateMethod(this, __ContentScriptContext_instances, listenForNewerScripts_fn).call(this);
      });
    }
    get signal() {
      return __privateGet(this, _abortController).signal;
    }
    abort(reason) {
      return __privateGet(this, _abortController).abort(reason);
    }
    get isInvalid() {
      if (browser.runtime.id == null) {
        this.notifyInvalidated();
      }
      return this.signal.aborted;
    }
    get isValid() {
      return !this.isInvalid;
    }
    /**
     * Add a listener that is called when the content script's context is invalidated.
     *
     * @returns A function to remove the listener.
     *
     * @example
     * browser.runtime.onMessage.addListener(cb);
     * const removeInvalidatedListener = ctx.onInvalidated(() => {
     *   browser.runtime.onMessage.removeListener(cb);
     * })
     * // ...
     * removeInvalidatedListener();
     */
    onInvalidated(cb) {
      this.signal.addEventListener("abort", cb);
      return () => this.signal.removeEventListener("abort", cb);
    }
    /**
     * Return a promise that never resolves. Useful if you have an async function that shouldn't run
     * after the context is expired.
     *
     * @example
     * const getValueFromStorage = async () => {
     *   if (ctx.isInvalid) return ctx.block();
     *
     *   // ...
     * }
     */
    block() {
      return new Promise(() => {
      });
    }
    /**
     * Wrapper around `window.setInterval` that automatically clears the interval when invalidated.
     */
    setInterval(handler, timeout) {
      const id = setInterval(() => {
        if (this.isValid)
          handler();
      }, timeout);
      this.onInvalidated(() => clearInterval(id));
      return id;
    }
    /**
     * Wrapper around `window.setTimeout` that automatically clears the interval when invalidated.
     */
    setTimeout(handler, timeout) {
      const id = setTimeout(() => {
        if (this.isValid)
          handler();
      }, timeout);
      this.onInvalidated(() => clearTimeout(id));
      return id;
    }
    /**
     * Wrapper around `window.requestAnimationFrame` that automatically cancels the request when
     * invalidated.
     */
    requestAnimationFrame(callback) {
      const id = requestAnimationFrame((...args) => {
        if (this.isValid)
          callback(...args);
      });
      this.onInvalidated(() => cancelAnimationFrame(id));
      return id;
    }
    /**
     * Wrapper around `window.requestIdleCallback` that automatically cancels the request when
     * invalidated.
     */
    requestIdleCallback(callback, options) {
      const id = requestIdleCallback((...args) => {
        if (!this.signal.aborted)
          callback(...args);
      }, options);
      this.onInvalidated(() => cancelIdleCallback(id));
      return id;
    }
    /**
     * Call `target.addEventListener` and remove the event listener when the context is invalidated.
     *
     * Includes additional events useful for content scripts:
     *
     * - `"wxt:locationchange"` - Triggered when HTML5 history mode is used to change URL. Content
     *   scripts are not reloaded when navigating this way, so this can be used to reset the content
     *   script state on URL change, or run custom code.
     *
     * @example
     * ctx.addEventListener(document, "visibilitychange", () => {
     *   // ...
     * });
     * ctx.addEventListener(document, "wxt:locationchange", () => {
     *   // ...
     * });
     */
    addEventListener(target, type, handler, options) {
      var _a2;
      if (type === "wxt:locationchange") {
        if (this.isValid)
          __privateGet(this, _locationWatcher).run();
      }
      (_a2 = target.addEventListener) == null ? void 0 : _a2.call(
        target,
        type.startsWith("wxt:") ? getUniqueEventName(type) : type,
        // @ts-expect-error: Event don't match, but that's OK, EventTarget doesn't allow custom types in the callback
        handler,
        {
          ...options,
          signal: this.signal
        }
      );
    }
    /**
     * @internal
     * Abort the abort controller and execute all `onInvalidated` listeners.
     */
    notifyInvalidated() {
      this.abort("Content script context invalidated");
      logger$1.debug(
        `Content script "${this.contentScriptName}" context invalidated`
      );
    }
  }, _isTopFrame = new WeakMap(), _abortController = new WeakMap(), _locationWatcher = new WeakMap(), __ContentScriptContext_instances = new WeakSet(), stopOldScripts_fn = function() {
    window.postMessage(
      {
        event: _b.SCRIPT_STARTED_MESSAGE_TYPE,
        contentScriptName: this.contentScriptName
      },
      "*"
    );
  }, listenForNewerScripts_fn = function() {
    const cb = (event) => {
      var _a2, _b2;
      if (((_a2 = event.data) == null ? void 0 : _a2.type) === _b.SCRIPT_STARTED_MESSAGE_TYPE && ((_b2 = event.data) == null ? void 0 : _b2.contentScriptName) === this.contentScriptName) {
        this.notifyInvalidated();
      }
    };
    addEventListener("message", cb);
    this.onInvalidated(() => removeEventListener("message", cb));
  }, __publicField(_b, "SCRIPT_STARTED_MESSAGE_TYPE", "wxt:content-script-started"), _b);
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
  (async () => {
    try {
      const { main, ...options } = definition;
      const ctx = new ContentScriptContext("content", options);
      await main(ctx);
    } catch (err) {
      logger.error(
        `The content script "${"content"}" crashed on startup!`,
        err
      );
    }
  })();
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsL2Rpc3QvYnJvd3Nlci1wb2x5ZmlsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9jaHVuay1GTlRFMkwyNy5qcyIsIi4uLy4uLy4uL3NyYy9lbnRyeXBvaW50cy9jb250ZW50LnRzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NsaWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzcmMvc2FuZGJveC9kZWZpbmUtdW5saXN0ZWQtc2NyaXB0LnRzXG5mdW5jdGlvbiBkZWZpbmVVbmxpc3RlZFNjcmlwdChhcmcpIHtcbiAgaWYgKHR5cGVvZiBhcmcgPT09IFwiZnVuY3Rpb25cIilcbiAgICByZXR1cm4geyBtYWluOiBhcmcgfTtcbiAgcmV0dXJuIGFyZztcbn1cblxuLy8gc3JjL3NhbmRib3gvZGVmaW5lLWJhY2tncm91bmQudHNcbmZ1bmN0aW9uIGRlZmluZUJhY2tncm91bmQoYXJnKSB7XG4gIGlmICh0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpXG4gICAgcmV0dXJuIHsgbWFpbjogYXJnIH07XG4gIHJldHVybiBhcmc7XG59XG5cbi8vIHNyYy9zYW5kYm94L2RlZmluZS1jb250ZW50LXNjcmlwdC50c1xuZnVuY3Rpb24gZGVmaW5lQ29udGVudFNjcmlwdChkZWZpbml0aW9uKSB7XG4gIHJldHVybiBkZWZpbml0aW9uO1xufVxuXG4vLyBzcmMvc2FuZGJveC9pbmRleC50c1xuZXhwb3J0ICogZnJvbSBcIkB3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJuc1wiO1xuZXhwb3J0IHtcbiAgZGVmaW5lQmFja2dyb3VuZCxcbiAgZGVmaW5lQ29udGVudFNjcmlwdCxcbiAgZGVmaW5lVW5saXN0ZWRTY3JpcHRcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIiwgW1wibW9kdWxlXCJdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGZhY3RvcnkobW9kdWxlKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbW9kID0ge1xuICAgICAgZXhwb3J0czoge31cbiAgICB9O1xuICAgIGZhY3RvcnkobW9kKTtcbiAgICBnbG9iYWwuYnJvd3NlciA9IG1vZC5leHBvcnRzO1xuICB9XG59KSh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFRoaXMgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbiAobW9kdWxlKSB7XG4gIC8qIHdlYmV4dGVuc2lvbi1wb2x5ZmlsbCAtIHYwLjEwLjAgLSBGcmkgQXVnIDEyIDIwMjIgMTk6NDI6NDQgKi9cblxuICAvKiAtKi0gTW9kZTogaW5kZW50LXRhYnMtbW9kZTogbmlsOyBqcy1pbmRlbnQtbGV2ZWw6IDIgLSotICovXG5cbiAgLyogdmltOiBzZXQgc3RzPTIgc3c9MiBldCB0dz04MDogKi9cblxuICAvKiBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljXG4gICAqIExpY2Vuc2UsIHYuIDIuMC4gSWYgYSBjb3B5IG9mIHRoZSBNUEwgd2FzIG5vdCBkaXN0cmlidXRlZCB3aXRoIHRoaXNcbiAgICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHA6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy4gKi9cbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgaWYgKCFnbG9iYWxUaGlzLmNocm9tZT8ucnVudGltZT8uaWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIHNjcmlwdCBzaG91bGQgb25seSBiZSBsb2FkZWQgaW4gYSBicm93c2VyIGV4dGVuc2lvbi5cIik7XG4gIH1cblxuICBpZiAodHlwZW9mIGdsb2JhbFRoaXMuYnJvd3NlciA9PT0gXCJ1bmRlZmluZWRcIiB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsVGhpcy5icm93c2VyKSAhPT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgIGNvbnN0IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSA9IFwiVGhlIG1lc3NhZ2UgcG9ydCBjbG9zZWQgYmVmb3JlIGEgcmVzcG9uc2Ugd2FzIHJlY2VpdmVkLlwiOyAvLyBXcmFwcGluZyB0aGUgYnVsayBvZiB0aGlzIHBvbHlmaWxsIGluIGEgb25lLXRpbWUtdXNlIGZ1bmN0aW9uIGlzIGEgbWlub3JcbiAgICAvLyBvcHRpbWl6YXRpb24gZm9yIEZpcmVmb3guIFNpbmNlIFNwaWRlcm1vbmtleSBkb2VzIG5vdCBmdWxseSBwYXJzZSB0aGVcbiAgICAvLyBjb250ZW50cyBvZiBhIGZ1bmN0aW9uIHVudGlsIHRoZSBmaXJzdCB0aW1lIGl0J3MgY2FsbGVkLCBhbmQgc2luY2UgaXQgd2lsbFxuICAgIC8vIG5ldmVyIGFjdHVhbGx5IG5lZWQgdG8gYmUgY2FsbGVkLCB0aGlzIGFsbG93cyB0aGUgcG9seWZpbGwgdG8gYmUgaW5jbHVkZWRcbiAgICAvLyBpbiBGaXJlZm94IG5lYXJseSBmb3IgZnJlZS5cblxuICAgIGNvbnN0IHdyYXBBUElzID0gZXh0ZW5zaW9uQVBJcyA9PiB7XG4gICAgICAvLyBOT1RFOiBhcGlNZXRhZGF0YSBpcyBhc3NvY2lhdGVkIHRvIHRoZSBjb250ZW50IG9mIHRoZSBhcGktbWV0YWRhdGEuanNvbiBmaWxlXG4gICAgICAvLyBhdCBidWlsZCB0aW1lIGJ5IHJlcGxhY2luZyB0aGUgZm9sbG93aW5nIFwiaW5jbHVkZVwiIHdpdGggdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgICAvLyBKU09OIGZpbGUuXG4gICAgICBjb25zdCBhcGlNZXRhZGF0YSA9IHtcbiAgICAgICAgXCJhbGFybXNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjbGVhckFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJvb2ttYXJrc1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDaGlsZHJlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFN1YlRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJicm93c2VyQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImRpc2FibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlbmFibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuUG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NpbmdEYXRhXCI6IHtcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNhY2hlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ29va2llc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZURvd25sb2Fkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZvcm1EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlSGlzdG9yeVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUxvY2FsU3RvcmFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBhc3N3b3Jkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBsdWdpbkRhdGFcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbW1hbmRzXCI6IHtcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbnRleHRNZW51c1wiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb29raWVzXCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbENvb2tpZVN0b3Jlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRldnRvb2xzXCI6IHtcbiAgICAgICAgICBcImluc3BlY3RlZFdpbmRvd1wiOiB7XG4gICAgICAgICAgICBcImV2YWxcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDIsXG4gICAgICAgICAgICAgIFwic2luZ2xlQ2FsbGJhY2tBcmdcIjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicGFuZWxzXCI6IHtcbiAgICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDMsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVsZW1lbnRzXCI6IHtcbiAgICAgICAgICAgICAgXCJjcmVhdGVTaWRlYmFyUGFuZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkb3dubG9hZHNcIjoge1xuICAgICAgICAgIFwiY2FuY2VsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZG93bmxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlcmFzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZpbGVJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhdXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRmlsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlc3VtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJleHRlbnNpb25cIjoge1xuICAgICAgICAgIFwiaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImlzQWxsb3dlZEluY29nbml0b0FjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhpc3RvcnlcIjoge1xuICAgICAgICAgIFwiYWRkVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlUmFuZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVVcmxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRWaXNpdHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpMThuXCI6IHtcbiAgICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWNjZXB0TGFuZ3VhZ2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRlbnRpdHlcIjoge1xuICAgICAgICAgIFwibGF1bmNoV2ViQXV0aEZsb3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpZGxlXCI6IHtcbiAgICAgICAgICBcInF1ZXJ5U3RhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYW5hZ2VtZW50XCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRFbmFibGVkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidW5pbnN0YWxsU2VsZlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm5vdGlmaWNhdGlvbnNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQZXJtaXNzaW9uTGV2ZWxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWdlQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0SWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGVybWlzc2lvbnNcIjoge1xuICAgICAgICAgIFwiY29udGFpbnNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicnVudGltZVwiOiB7XG4gICAgICAgICAgXCJnZXRCYWNrZ3JvdW5kUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBsYXRmb3JtSW5mb1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5PcHRpb25zUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlcXVlc3RVcGRhdGVDaGVja1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE5hdGl2ZU1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRVbmluc3RhbGxVUkxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXNzaW9uc1wiOiB7XG4gICAgICAgICAgXCJnZXREZXZpY2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UmVjZW50bHlDbG9zZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN0b3JlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3RvcmFnZVwiOiB7XG4gICAgICAgICAgXCJsb2NhbFwiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1hbmFnZWRcIjoge1xuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic3luY1wiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRhYnNcIjoge1xuICAgICAgICAgIFwiY2FwdHVyZVZpc2libGVUYWJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRpc2NhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkdXBsaWNhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJleGVjdXRlU2NyaXB0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0JhY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0ZvcndhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWdobGlnaHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpbnNlcnRDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicXVlcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZWxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0b3BTaXRlc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJOYXZpZ2F0aW9uXCI6IHtcbiAgICAgICAgICBcImdldEFsbEZyYW1lc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZyYW1lXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViUmVxdWVzdFwiOiB7XG4gICAgICAgICAgXCJoYW5kbGVyQmVoYXZpb3JDaGFuZ2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2luZG93c1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDdXJyZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0TGFzdEZvY3VzZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKE9iamVjdC5rZXlzKGFwaU1ldGFkYXRhKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYXBpLW1ldGFkYXRhLmpzb24gaGFzIG5vdCBiZWVuIGluY2x1ZGVkIGluIGJyb3dzZXItcG9seWZpbGxcIik7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEEgV2Vha01hcCBzdWJjbGFzcyB3aGljaCBjcmVhdGVzIGFuZCBzdG9yZXMgYSB2YWx1ZSBmb3IgYW55IGtleSB3aGljaCBkb2VzXG4gICAgICAgKiBub3QgZXhpc3Qgd2hlbiBhY2Nlc3NlZCwgYnV0IGJlaGF2ZXMgZXhhY3RseSBhcyBhbiBvcmRpbmFyeSBXZWFrTWFwXG4gICAgICAgKiBvdGhlcndpc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3JlYXRlSXRlbVxuICAgICAgICogICAgICAgIEEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2YWx1ZSBmb3IgYW55XG4gICAgICAgKiAgICAgICAga2V5IHdoaWNoIGRvZXMgbm90IGV4aXN0LCB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZC4gVGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gcmVjZWl2ZXMsIGFzIGl0cyBvbmx5IGFyZ3VtZW50LCB0aGUga2V5IGJlaW5nIGNyZWF0ZWQuXG4gICAgICAgKi9cblxuXG4gICAgICBjbGFzcyBEZWZhdWx0V2Vha01hcCBleHRlbmRzIFdlYWtNYXAge1xuICAgICAgICBjb25zdHJ1Y3RvcihjcmVhdGVJdGVtLCBpdGVtcyA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHN1cGVyKGl0ZW1zKTtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUl0ZW0gPSBjcmVhdGVJdGVtO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0KGtleSkge1xuICAgICAgICAgIGlmICghdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB0aGlzLmNyZWF0ZUl0ZW0oa2V5KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHN1cGVyLmdldChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBvYmplY3QgaXMgYW4gb2JqZWN0IHdpdGggYSBgdGhlbmAgbWV0aG9kLCBhbmQgY2FuXG4gICAgICAgKiB0aGVyZWZvcmUgYmUgYXNzdW1lZCB0byBiZWhhdmUgYXMgYSBQcm9taXNlLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3QuXG4gICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdGhlbmFibGUuXG4gICAgICAgKi9cblxuXG4gICAgICBjb25zdCBpc1RoZW5hYmxlID0gdmFsdWUgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gd2hpY2gsIHdoZW4gY2FsbGVkLCB3aWxsIHJlc29sdmUgb3IgcmVqZWN0XG4gICAgICAgKiB0aGUgZ2l2ZW4gcHJvbWlzZSBiYXNlZCBvbiBob3cgaXQgaXMgY2FsbGVkOlxuICAgICAgICpcbiAgICAgICAqIC0gSWYsIHdoZW4gY2FsbGVkLCBgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yYCBjb250YWlucyBhIG5vbi1udWxsIG9iamVjdCxcbiAgICAgICAqICAgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgd2l0aCB0aGF0IHZhbHVlLlxuICAgICAgICogLSBJZiB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggZXhhY3RseSBvbmUgYXJndW1lbnQsIHRoZSBwcm9taXNlIGlzXG4gICAgICAgKiAgIHJlc29sdmVkIHRvIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIE90aGVyd2lzZSwgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgdG8gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlXG4gICAgICAgKiAgIGZ1bmN0aW9uJ3MgYXJndW1lbnRzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9taXNlXG4gICAgICAgKiAgICAgICAgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJlc29sdXRpb24gYW5kIHJlamVjdGlvbiBmdW5jdGlvbnMgb2YgYVxuICAgICAgICogICAgICAgIHByb21pc2UuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9taXNlLnJlc29sdmVcbiAgICAgICAqICAgICAgICBUaGUgcHJvbWlzZSdzIHJlc29sdXRpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9taXNlLnJlamVjdFxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVqZWN0aW9uIGZ1bmN0aW9uLlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGFkYXRhXG4gICAgICAgKiAgICAgICAgTWV0YWRhdGEgYWJvdXQgdGhlIHdyYXBwZWQgbWV0aG9kIHdoaWNoIGhhcyBjcmVhdGVkIHRoZSBjYWxsYmFjay5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAgICAgICAqICAgICAgICBUaGUgZ2VuZXJhdGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICovXG5cblxuICAgICAgY29uc3QgbWFrZUNhbGxiYWNrID0gKHByb21pc2UsIG1ldGFkYXRhKSA9PiB7XG4gICAgICAgIHJldHVybiAoLi4uY2FsbGJhY2tBcmdzKSA9PiB7XG4gICAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgIHByb21pc2UucmVqZWN0KG5ldyBFcnJvcihleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnIHx8IGNhbGxiYWNrQXJncy5sZW5ndGggPD0gMSAmJiBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZShjYWxsYmFja0FyZ3NbMF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBwbHVyYWxpemVBcmd1bWVudHMgPSBudW1BcmdzID0+IG51bUFyZ3MgPT0gMSA/IFwiYXJndW1lbnRcIiA6IFwiYXJndW1lbnRzXCI7XG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSB3cmFwcGVyIGZ1bmN0aW9uIGZvciBhIG1ldGhvZCB3aXRoIHRoZSBnaXZlbiBuYW1lIGFuZCBtZXRhZGF0YS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAgICogICAgICAgIFRoZSBuYW1lIG9mIHRoZSBtZXRob2Qgd2hpY2ggaXMgYmVpbmcgd3JhcHBlZC5cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtZXRhZGF0YVxuICAgICAgICogICAgICAgIE1ldGFkYXRhIGFib3V0IHRoZSBtZXRob2QgYmVpbmcgd3JhcHBlZC5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWluQXJnc1xuICAgICAgICogICAgICAgIFRoZSBtaW5pbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbXVzdCBiZSBwYXNzZWQgdG8gdGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24uIElmIGNhbGxlZCB3aXRoIGZld2VyIHRoYW4gdGhpcyBudW1iZXIgb2YgYXJndW1lbnRzLCB0aGVcbiAgICAgICAqICAgICAgICB3cmFwcGVyIHdpbGwgcmFpc2UgYW4gZXhjZXB0aW9uLlxuICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBtZXRhZGF0YS5tYXhBcmdzXG4gICAgICAgKiAgICAgICAgVGhlIG1heGltdW0gbnVtYmVyIG9mIGFyZ3VtZW50cyB3aGljaCBtYXkgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBtb3JlIHRoYW4gdGhpcyBudW1iZXIgb2YgYXJndW1lbnRzLCB0aGVcbiAgICAgICAqICAgICAgICB3cmFwcGVyIHdpbGwgcmFpc2UgYW4gZXhjZXB0aW9uLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2Z1bmN0aW9uKG9iamVjdCwgLi4uKil9XG4gICAgICAgKiAgICAgICBUaGUgZ2VuZXJhdGVkIHdyYXBwZXIgZnVuY3Rpb24uXG4gICAgICAgKi9cblxuXG4gICAgICBjb25zdCB3cmFwQXN5bmNGdW5jdGlvbiA9IChuYW1lLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYXN5bmNGdW5jdGlvbldyYXBwZXIodGFyZ2V0LCAuLi5hcmdzKSB7XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPiBtZXRhZGF0YS5tYXhBcmdzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjaykge1xuICAgICAgICAgICAgICAvLyBUaGlzIEFQSSBtZXRob2QgaGFzIGN1cnJlbnRseSBubyBjYWxsYmFjayBvbiBDaHJvbWUsIGJ1dCBpdCByZXR1cm4gYSBwcm9taXNlIG9uIEZpcmVmb3gsXG4gICAgICAgICAgICAgIC8vIGFuZCBzbyB0aGUgcG9seWZpbGwgd2lsbCB0cnkgdG8gY2FsbCBpdCB3aXRoIGEgY2FsbGJhY2sgZmlyc3QsIGFuZCBpdCB3aWxsIGZhbGxiYWNrXG4gICAgICAgICAgICAgIC8vIHRvIG5vdCBwYXNzaW5nIHRoZSBjYWxsYmFjayBpZiB0aGUgZmlyc3QgY2FsbCBmYWlscy5cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncywgbWFrZUNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgICB9LCBtZXRhZGF0YSkpO1xuICAgICAgICAgICAgICB9IGNhdGNoIChjYkVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGAke25hbWV9IEFQSSBtZXRob2QgZG9lc24ndCBzZWVtIHRvIHN1cHBvcnQgdGhlIGNhbGxiYWNrIHBhcmFtZXRlciwgYCArIFwiZmFsbGluZyBiYWNrIHRvIGNhbGwgaXQgd2l0aG91dCBhIGNhbGxiYWNrOiBcIiwgY2JFcnJvcik7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MpOyAvLyBVcGRhdGUgdGhlIEFQSSBtZXRob2QgbWV0YWRhdGEsIHNvIHRoYXQgdGhlIG5leHQgQVBJIGNhbGxzIHdpbGwgbm90IHRyeSB0b1xuICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgdW5zdXBwb3J0ZWQgY2FsbGJhY2sgYW55bW9yZS5cblxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmZhbGxiYWNrVG9Ob0NhbGxiYWNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubm9DYWxsYmFjayA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1ldGFkYXRhLm5vQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncywgbWFrZUNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICB9LCBtZXRhZGF0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gZXhpc3RpbmcgbWV0aG9kIG9mIHRoZSB0YXJnZXQgb2JqZWN0LCBzbyB0aGF0IGNhbGxzIHRvIGl0IGFyZVxuICAgICAgICogaW50ZXJjZXB0ZWQgYnkgdGhlIGdpdmVuIHdyYXBwZXIgZnVuY3Rpb24uIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHJlY2VpdmVzLFxuICAgICAgICogYXMgaXRzIGZpcnN0IGFyZ3VtZW50LCB0aGUgb3JpZ2luYWwgYHRhcmdldGAgb2JqZWN0LCBmb2xsb3dlZCBieSBlYWNoIG9mXG4gICAgICAgKiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgb3JpZ2luYWwgdGFyZ2V0IG9iamVjdCB0aGF0IHRoZSB3cmFwcGVkIG1ldGhvZCBiZWxvbmdzIHRvLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbWV0aG9kXG4gICAgICAgKiAgICAgICAgVGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLiBUaGlzIGlzIHVzZWQgYXMgdGhlIHRhcmdldCBvZiB0aGUgUHJveHlcbiAgICAgICAqICAgICAgICBvYmplY3Qgd2hpY2ggaXMgY3JlYXRlZCB0byB3cmFwIHRoZSBtZXRob2QuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgVGhlIHdyYXBwZXIgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHBsYWNlIG9mIGEgZGlyZWN0IGludm9jYXRpb25cbiAgICAgICAqICAgICAgICBvZiB0aGUgd3JhcHBlZCBtZXRob2QuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PGZ1bmN0aW9uPn1cbiAgICAgICAqICAgICAgICBBIFByb3h5IG9iamVjdCBmb3IgdGhlIGdpdmVuIG1ldGhvZCwgd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gd3JhcHBlclxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiBpdHMgcGxhY2UuXG4gICAgICAgKi9cblxuXG4gICAgICBjb25zdCB3cmFwTWV0aG9kID0gKHRhcmdldCwgbWV0aG9kLCB3cmFwcGVyKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkobWV0aG9kLCB7XG4gICAgICAgICAgYXBwbHkodGFyZ2V0TWV0aG9kLCB0aGlzT2JqLCBhcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gd3JhcHBlci5jYWxsKHRoaXNPYmosIHRhcmdldCwgLi4uYXJncyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgbGV0IGhhc093blByb3BlcnR5ID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBvYmplY3QgaW4gYSBQcm94eSB3aGljaCBpbnRlcmNlcHRzIGFuZCB3cmFwcyBjZXJ0YWluIG1ldGhvZHNcbiAgICAgICAqIGJhc2VkIG9uIHRoZSBnaXZlbiBgd3JhcHBlcnNgIGFuZCBgbWV0YWRhdGFgIG9iamVjdHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICAgICAgICogICAgICAgIFRoZSB0YXJnZXQgb2JqZWN0IHRvIHdyYXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IFt3cmFwcGVycyA9IHt9XVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgd3JhcHBlciBmdW5jdGlvbnMgZm9yIHNwZWNpYWwgY2FzZXMuIEFueVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHByZXNlbnQgaW4gdGhpcyBvYmplY3QgdHJlZSBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgdGhlXG4gICAgICAgKiAgICAgICAgbWV0aG9kIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZS4gVGhlc2VcbiAgICAgICAqICAgICAgICB3cmFwcGVyIG1ldGhvZHMgYXJlIGludm9rZWQgYXMgZGVzY3JpYmVkIGluIHtAc2VlIHdyYXBNZXRob2R9LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbbWV0YWRhdGEgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIG1ldGFkYXRhIHVzZWQgdG8gYXV0b21hdGljYWxseSBnZW5lcmF0ZVxuICAgICAgICogICAgICAgIFByb21pc2UtYmFzZWQgd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cy4gQW55IGZ1bmN0aW9uIGluXG4gICAgICAgKiAgICAgICAgdGhlIGB0YXJnZXRgIG9iamVjdCB0cmVlIHdoaWNoIGhhcyBhIGNvcnJlc3BvbmRpbmcgbWV0YWRhdGEgb2JqZWN0XG4gICAgICAgKiAgICAgICAgaW4gdGhlIHNhbWUgbG9jYXRpb24gaW4gdGhlIGBtZXRhZGF0YWAgdHJlZSBpcyByZXBsYWNlZCB3aXRoIGFuXG4gICAgICAgKiAgICAgICAgYXV0b21hdGljYWxseS1nZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbiwgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgKiAgICAgICAge0BzZWUgd3JhcEFzeW5jRnVuY3Rpb259XG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PG9iamVjdD59XG4gICAgICAgKi9cblxuICAgICAgY29uc3Qgd3JhcE9iamVjdCA9ICh0YXJnZXQsIHdyYXBwZXJzID0ge30sIG1ldGFkYXRhID0ge30pID0+IHtcbiAgICAgICAgbGV0IGNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgbGV0IGhhbmRsZXJzID0ge1xuICAgICAgICAgIGhhcyhwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb3AgaW4gdGFyZ2V0IHx8IHByb3AgaW4gY2FjaGU7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGdldChwcm94eVRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWNoZVtwcm9wXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCEocHJvcCBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRhcmdldFtwcm9wXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBtZXRob2Qgb24gdGhlIHVuZGVybHlpbmcgb2JqZWN0LiBDaGVjayBpZiB3ZSBuZWVkIHRvIGRvXG4gICAgICAgICAgICAgIC8vIGFueSB3cmFwcGluZy5cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB3cmFwcGVyc1twcm9wXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBhIHNwZWNpYWwtY2FzZSB3cmFwcGVyIGZvciB0aGlzIG1ldGhvZC5cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBNZXRob2QodGFyZ2V0LCB0YXJnZXRbcHJvcF0sIHdyYXBwZXJzW3Byb3BdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGFuIGFzeW5jIG1ldGhvZCB0aGF0IHdlIGhhdmUgbWV0YWRhdGEgZm9yLiBDcmVhdGUgYVxuICAgICAgICAgICAgICAgIC8vIFByb21pc2Ugd3JhcHBlciBmb3IgaXQuXG4gICAgICAgICAgICAgICAgbGV0IHdyYXBwZXIgPSB3cmFwQXN5bmNGdW5jdGlvbihwcm9wLCBtZXRhZGF0YVtwcm9wXSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgbWV0aG9kIHRoYXQgd2UgZG9uJ3Qga25vdyBvciBjYXJlIGFib3V0LiBSZXR1cm4gdGhlXG4gICAgICAgICAgICAgICAgLy8gb3JpZ2luYWwgbWV0aG9kLCBib3VuZCB0byB0aGUgdW5kZXJseWluZyBvYmplY3QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIChoYXNPd25Qcm9wZXJ0eSh3cmFwcGVycywgcHJvcCkgfHwgaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSkge1xuICAgICAgICAgICAgICAvLyBUaGlzIGlzIGFuIG9iamVjdCB0aGF0IHdlIG5lZWQgdG8gZG8gc29tZSB3cmFwcGluZyBmb3IgdGhlIGNoaWxkcmVuXG4gICAgICAgICAgICAgIC8vIG9mLiBDcmVhdGUgYSBzdWItb2JqZWN0IHdyYXBwZXIgZm9yIGl0IHdpdGggdGhlIGFwcHJvcHJpYXRlIGNoaWxkXG4gICAgICAgICAgICAgIC8vIG1ldGFkYXRhLlxuICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBPYmplY3QodmFsdWUsIHdyYXBwZXJzW3Byb3BdLCBtZXRhZGF0YVtwcm9wXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBcIipcIikpIHtcbiAgICAgICAgICAgICAgLy8gV3JhcCBhbGwgcHJvcGVydGllcyBpbiAqIG5hbWVzcGFjZS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbXCIqXCJdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gZG8gYW55IHdyYXBwaW5nIGZvciB0aGlzIHByb3BlcnR5LFxuICAgICAgICAgICAgICAvLyBzbyBqdXN0IGZvcndhcmQgYWxsIGFjY2VzcyB0byB0aGUgdW5kZXJseWluZyBvYmplY3QuXG4gICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjYWNoZSwgcHJvcCwge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuXG4gICAgICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FjaGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgc2V0KHByb3h5VGFyZ2V0LCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGRlZmluZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wLCBkZXNjKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShjYWNoZSwgcHJvcCwgZGVzYyk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShjYWNoZSwgcHJvcCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH07IC8vIFBlciBjb250cmFjdCBvZiB0aGUgUHJveHkgQVBJLCB0aGUgXCJnZXRcIiBwcm94eSBoYW5kbGVyIG11c3QgcmV0dXJuIHRoZVxuICAgICAgICAvLyBvcmlnaW5hbCB2YWx1ZSBvZiB0aGUgdGFyZ2V0IGlmIHRoYXQgdmFsdWUgaXMgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZFxuICAgICAgICAvLyBub24tY29uZmlndXJhYmxlLiBGb3IgdGhpcyByZWFzb24sIHdlIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCB0aGVcbiAgICAgICAgLy8gcHJvdG90eXBlIHNldCB0byBgdGFyZ2V0YCBpbnN0ZWFkIG9mIHVzaW5nIGB0YXJnZXRgIGRpcmVjdGx5LlxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY2Fubm90IHJldHVybiBhIGN1c3RvbSBvYmplY3QgZm9yIEFQSXMgdGhhdFxuICAgICAgICAvLyBhcmUgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZCBub24tY29uZmlndXJhYmxlLCBzdWNoIGFzIGBjaHJvbWUuZGV2dG9vbHNgLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGUgcHJveHkgaGFuZGxlcnMgdGhlbXNlbHZlcyB3aWxsIHN0aWxsIHVzZSB0aGUgb3JpZ2luYWwgYHRhcmdldGBcbiAgICAgICAgLy8gaW5zdGVhZCBvZiB0aGUgYHByb3h5VGFyZ2V0YCwgc28gdGhhdCB0aGUgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBhcmVcbiAgICAgICAgLy8gZGVyZWZlcmVuY2VkIHZpYSB0aGUgb3JpZ2luYWwgdGFyZ2V0cy5cblxuICAgICAgICBsZXQgcHJveHlUYXJnZXQgPSBPYmplY3QuY3JlYXRlKHRhcmdldCk7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkocHJveHlUYXJnZXQsIGhhbmRsZXJzKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSBzZXQgb2Ygd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IG9iamVjdCwgd2hpY2ggaGFuZGxlc1xuICAgICAgICogd3JhcHBpbmcgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRoYXQgdGhvc2UgbWVzc2FnZXMgYXJlIHBhc3NlZC5cbiAgICAgICAqXG4gICAgICAgKiBBIHNpbmdsZSB3cmFwcGVyIGlzIGNyZWF0ZWQgZm9yIGVhY2ggbGlzdGVuZXIgZnVuY3Rpb24sIGFuZCBzdG9yZWQgaW4gYVxuICAgICAgICogbWFwLiBTdWJzZXF1ZW50IGNhbGxzIHRvIGBhZGRMaXN0ZW5lcmAsIGBoYXNMaXN0ZW5lcmAsIG9yIGByZW1vdmVMaXN0ZW5lcmBcbiAgICAgICAqIHJldHJpZXZlIHRoZSBvcmlnaW5hbCB3cmFwcGVyLCBzbyB0aGF0ICBhdHRlbXB0cyB0byByZW1vdmUgYVxuICAgICAgICogcHJldmlvdXNseS1hZGRlZCBsaXN0ZW5lciB3b3JrIGFzIGV4cGVjdGVkLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RGVmYXVsdFdlYWtNYXA8ZnVuY3Rpb24sIGZ1bmN0aW9uPn0gd3JhcHBlck1hcFxuICAgICAgICogICAgICAgIEEgRGVmYXVsdFdlYWtNYXAgb2JqZWN0IHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBhcHByb3ByaWF0ZSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgZm9yIGEgZ2l2ZW4gbGlzdGVuZXIgZnVuY3Rpb24gd2hlbiBvbmUgZG9lcyBub3QgZXhpc3QsIGFuZCByZXRyaWV2ZVxuICAgICAgICogICAgICAgIGFuIGV4aXN0aW5nIG9uZSB3aGVuIGl0IGRvZXMuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgICAqL1xuXG5cbiAgICAgIGNvbnN0IHdyYXBFdmVudCA9IHdyYXBwZXJNYXAgPT4gKHtcbiAgICAgICAgYWRkTGlzdGVuZXIodGFyZ2V0LCBsaXN0ZW5lciwgLi4uYXJncykge1xuICAgICAgICAgIHRhcmdldC5hZGRMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lciksIC4uLmFyZ3MpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhc0xpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Lmhhc0xpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlTGlzdGVuZXIodGFyZ2V0LCBsaXN0ZW5lcikge1xuICAgICAgICAgIHRhcmdldC5yZW1vdmVMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lcikpO1xuICAgICAgICB9XG5cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXcmFwcyBhbiBvblJlcXVlc3RGaW5pc2hlZCBsaXN0ZW5lciBmdW5jdGlvbiBzbyB0aGF0IGl0IHdpbGwgcmV0dXJuIGFcbiAgICAgICAgICogYGdldENvbnRlbnQoKWAgcHJvcGVydHkgd2hpY2ggcmV0dXJucyBhIGBQcm9taXNlYCByYXRoZXIgdGhhbiB1c2luZyBhXG4gICAgICAgICAqIGNhbGxiYWNrIEFQSS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlcVxuICAgICAgICAgKiAgICAgICAgVGhlIEhBUiBlbnRyeSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBuZXR3b3JrIHJlcXVlc3QuXG4gICAgICAgICAqL1xuXG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uUmVxdWVzdEZpbmlzaGVkKHJlcSkge1xuICAgICAgICAgIGNvbnN0IHdyYXBwZWRSZXEgPSB3cmFwT2JqZWN0KHJlcSwge31cbiAgICAgICAgICAvKiB3cmFwcGVycyAqL1xuICAgICAgICAgICwge1xuICAgICAgICAgICAgZ2V0Q29udGVudDoge1xuICAgICAgICAgICAgICBtaW5BcmdzOiAwLFxuICAgICAgICAgICAgICBtYXhBcmdzOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGlzdGVuZXIod3JhcHBlZFJlcSk7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG9uTWVzc2FnZVdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXcmFwcyBhIG1lc3NhZ2UgbGlzdGVuZXIgZnVuY3Rpb24gc28gdGhhdCBpdCBtYXkgc2VuZCByZXNwb25zZXMgYmFzZWQgb25cbiAgICAgICAgICogaXRzIHJldHVybiB2YWx1ZSwgcmF0aGVyIHRoYW4gYnkgcmV0dXJuaW5nIGEgc2VudGluZWwgdmFsdWUgYW5kIGNhbGxpbmcgYVxuICAgICAgICAgKiBjYWxsYmFjay4gSWYgdGhlIGxpc3RlbmVyIGZ1bmN0aW9uIHJldHVybnMgYSBQcm9taXNlLCB0aGUgcmVzcG9uc2UgaXNcbiAgICAgICAgICogc2VudCB3aGVuIHRoZSBwcm9taXNlIGVpdGhlciByZXNvbHZlcyBvciByZWplY3RzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0geyp9IG1lc3NhZ2VcbiAgICAgICAgICogICAgICAgIFRoZSBtZXNzYWdlIHNlbnQgYnkgdGhlIG90aGVyIGVuZCBvZiB0aGUgY2hhbm5lbC5cbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHNlbmRlclxuICAgICAgICAgKiAgICAgICAgRGV0YWlscyBhYm91dCB0aGUgc2VuZGVyIG9mIHRoZSBtZXNzYWdlLlxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCopfSBzZW5kUmVzcG9uc2VcbiAgICAgICAgICogICAgICAgIEEgY2FsbGJhY2sgd2hpY2gsIHdoZW4gY2FsbGVkIHdpdGggYW4gYXJiaXRyYXJ5IGFyZ3VtZW50LCBzZW5kc1xuICAgICAgICAgKiAgICAgICAgdGhhdCB2YWx1ZSBhcyBhIHJlc3BvbnNlLlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgICAgICogICAgICAgIFRydWUgaWYgdGhlIHdyYXBwZWQgbGlzdGVuZXIgcmV0dXJuZWQgYSBQcm9taXNlLCB3aGljaCB3aWxsIGxhdGVyXG4gICAgICAgICAqICAgICAgICB5aWVsZCBhIHJlc3BvbnNlLiBGYWxzZSBvdGhlcndpc2UuXG4gICAgICAgICAqL1xuXG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIGxldCBkaWRDYWxsU2VuZFJlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHdyYXBwZWRTZW5kUmVzcG9uc2U7XG4gICAgICAgICAgbGV0IHNlbmRSZXNwb25zZVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHdyYXBwZWRTZW5kUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsZXQgcmVzdWx0O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGxpc3RlbmVyKG1lc3NhZ2UsIHNlbmRlciwgd3JhcHBlZFNlbmRSZXNwb25zZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGlzUmVzdWx0VGhlbmFibGUgPSByZXN1bHQgIT09IHRydWUgJiYgaXNUaGVuYWJsZShyZXN1bHQpOyAvLyBJZiB0aGUgbGlzdGVuZXIgZGlkbid0IHJldHVybmVkIHRydWUgb3IgYSBQcm9taXNlLCBvciBjYWxsZWRcbiAgICAgICAgICAvLyB3cmFwcGVkU2VuZFJlc3BvbnNlIHN5bmNocm9ub3VzbHksIHdlIGNhbiBleGl0IGVhcmxpZXJcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoZXJlIHdpbGwgYmUgbm8gcmVzcG9uc2Ugc2VudCBmcm9tIHRoaXMgbGlzdGVuZXIuXG5cbiAgICAgICAgICBpZiAocmVzdWx0ICE9PSB0cnVlICYmICFpc1Jlc3VsdFRoZW5hYmxlICYmICFkaWRDYWxsU2VuZFJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSAvLyBBIHNtYWxsIGhlbHBlciB0byBzZW5kIHRoZSBtZXNzYWdlIGlmIHRoZSBwcm9taXNlIHJlc29sdmVzXG4gICAgICAgICAgLy8gYW5kIGFuIGVycm9yIGlmIHRoZSBwcm9taXNlIHJlamVjdHMgKGEgd3JhcHBlZCBzZW5kTWVzc2FnZSBoYXNcbiAgICAgICAgICAvLyB0byB0cmFuc2xhdGUgdGhlIG1lc3NhZ2UgaW50byBhIHJlc29sdmVkIHByb21pc2Ugb3IgYSByZWplY3RlZFxuICAgICAgICAgIC8vIHByb21pc2UpLlxuXG5cbiAgICAgICAgICBjb25zdCBzZW5kUHJvbWlzZWRSZXN1bHQgPSBwcm9taXNlID0+IHtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihtc2cgPT4ge1xuICAgICAgICAgICAgICAvLyBzZW5kIHRoZSBtZXNzYWdlIHZhbHVlLlxuICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UobXNnKTtcbiAgICAgICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgLy8gU2VuZCBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGlmIHRoZSByZWplY3RlZCB2YWx1ZVxuICAgICAgICAgICAgICAvLyBpcyBhbiBpbnN0YW5jZSBvZiBlcnJvciwgb3IgdGhlIG9iamVjdCBpdHNlbGYgb3RoZXJ3aXNlLlxuICAgICAgICAgICAgICBsZXQgbWVzc2FnZTtcblxuICAgICAgICAgICAgICBpZiAoZXJyb3IgJiYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgfHwgdHlwZW9mIGVycm9yLm1lc3NhZ2UgPT09IFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZFwiO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBfX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X186IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIC8vIFByaW50IGFuIGVycm9yIG9uIHRoZSBjb25zb2xlIGlmIHVuYWJsZSB0byBzZW5kIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzZW5kIG9uTWVzc2FnZSByZWplY3RlZCByZXBseVwiLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTsgLy8gSWYgdGhlIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgc2VuZCB0aGUgcmVzb2x2ZWQgdmFsdWUgYXMgYVxuICAgICAgICAgIC8vIHJlc3VsdCwgb3RoZXJ3aXNlIHdhaXQgdGhlIHByb21pc2UgcmVsYXRlZCB0byB0aGUgd3JhcHBlZFNlbmRSZXNwb25zZVxuICAgICAgICAgIC8vIGNhbGxiYWNrIHRvIHJlc29sdmUgYW5kIHNlbmQgaXQgYXMgYSByZXNwb25zZS5cblxuXG4gICAgICAgICAgaWYgKGlzUmVzdWx0VGhlbmFibGUpIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlZFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQoc2VuZFJlc3BvbnNlUHJvbWlzZSk7XG4gICAgICAgICAgfSAvLyBMZXQgQ2hyb21lIGtub3cgdGhhdCB0aGUgbGlzdGVuZXIgaXMgcmVwbHlpbmcuXG5cblxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZUNhbGxiYWNrID0gKHtcbiAgICAgICAgcmVqZWN0LFxuICAgICAgICByZXNvbHZlXG4gICAgICB9LCByZXBseSkgPT4ge1xuICAgICAgICBpZiAoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIC8vIERldGVjdCB3aGVuIG5vbmUgb2YgdGhlIGxpc3RlbmVycyByZXBsaWVkIHRvIHRoZSBzZW5kTWVzc2FnZSBjYWxsIGFuZCByZXNvbHZlXG4gICAgICAgICAgLy8gdGhlIHByb21pc2UgdG8gdW5kZWZpbmVkIGFzIGluIEZpcmVmb3guXG4gICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3dlYmV4dGVuc2lvbi1wb2x5ZmlsbC9pc3N1ZXMvMTMwXG4gICAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSA9PT0gQ0hST01FX1NFTkRfTUVTU0FHRV9DQUxMQkFDS19OT19SRVNQT05TRV9NRVNTQUdFKSB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlcGx5ICYmIHJlcGx5Ll9fbW96V2ViRXh0ZW5zaW9uUG9seWZpbGxSZWplY3RfXykge1xuICAgICAgICAgIC8vIENvbnZlcnQgYmFjayB0aGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZXJyb3IgaW50b1xuICAgICAgICAgIC8vIGFuIEVycm9yIGluc3RhbmNlLlxuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IocmVwbHkubWVzc2FnZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVwbHkpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2UgPSAobmFtZSwgbWV0YWRhdGEsIGFwaU5hbWVzcGFjZU9iaiwgLi4uYXJncykgPT4ge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPCBtZXRhZGF0YS5taW5BcmdzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHdyYXBwZWRDYiA9IHdyYXBwZWRTZW5kTWVzc2FnZUNhbGxiYWNrLmJpbmQobnVsbCwge1xuICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGFyZ3MucHVzaCh3cmFwcGVkQ2IpO1xuICAgICAgICAgIGFwaU5hbWVzcGFjZU9iai5zZW5kTWVzc2FnZSguLi5hcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBzdGF0aWNXcmFwcGVycyA9IHtcbiAgICAgICAgZGV2dG9vbHM6IHtcbiAgICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgICBvblJlcXVlc3RGaW5pc2hlZDogd3JhcEV2ZW50KG9uUmVxdWVzdEZpbmlzaGVkV3JhcHBlcnMpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBydW50aW1lOiB7XG4gICAgICAgICAgb25NZXNzYWdlOiB3cmFwRXZlbnQob25NZXNzYWdlV3JhcHBlcnMpLFxuICAgICAgICAgIG9uTWVzc2FnZUV4dGVybmFsOiB3cmFwRXZlbnQob25NZXNzYWdlV3JhcHBlcnMpLFxuICAgICAgICAgIHNlbmRNZXNzYWdlOiB3cmFwcGVkU2VuZE1lc3NhZ2UuYmluZChudWxsLCBcInNlbmRNZXNzYWdlXCIsIHtcbiAgICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgICBtYXhBcmdzOiAzXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgdGFiczoge1xuICAgICAgICAgIHNlbmRNZXNzYWdlOiB3cmFwcGVkU2VuZE1lc3NhZ2UuYmluZChudWxsLCBcInNlbmRNZXNzYWdlXCIsIHtcbiAgICAgICAgICAgIG1pbkFyZ3M6IDIsXG4gICAgICAgICAgICBtYXhBcmdzOiAzXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHNldHRpbmdNZXRhZGF0YSA9IHtcbiAgICAgICAgY2xlYXI6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH0sXG4gICAgICAgIHNldDoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgYXBpTWV0YWRhdGEucHJpdmFjeSA9IHtcbiAgICAgICAgbmV0d29yazoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgc2VydmljZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHdlYnNpdGVzOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHdyYXBPYmplY3QoZXh0ZW5zaW9uQVBJcywgc3RhdGljV3JhcHBlcnMsIGFwaU1ldGFkYXRhKTtcbiAgICB9OyAvLyBUaGUgYnVpbGQgcHJvY2VzcyBhZGRzIGEgVU1EIHdyYXBwZXIgYXJvdW5kIHRoaXMgZmlsZSwgd2hpY2ggbWFrZXMgdGhlXG4gICAgLy8gYG1vZHVsZWAgdmFyaWFibGUgYXZhaWxhYmxlLlxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHdyYXBBUElzKGNocm9tZSk7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxUaGlzLmJyb3dzZXI7XG4gIH1cbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnJvd3Nlci1wb2x5ZmlsbC5qcy5tYXBcbiIsIi8vIHNyYy9icm93c2VyLnRzXG5pbXBvcnQgb3JpZ2luYWxCcm93c2VyIGZyb20gXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjtcbnZhciBicm93c2VyID0gb3JpZ2luYWxCcm93c2VyO1xuXG5leHBvcnQge1xuICBicm93c2VyXG59O1xuIiwiaW1wb3J0IHR5cGUgeyBIaWdobGlnaHRUYXJnZXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbnRlbnRTY3JpcHQoe1xuICBtYXRjaGVzOiBbJzxhbGxfdXJscz4nXSxcbiAgcnVuQXQ6ICdkb2N1bWVudF9pZGxlJyxcbiAgbWFpbigpIHtcbiAgICBsZXQgbGFzdFVybCA9IGxvY2F0aW9uLmhyZWY7XG4gICAgbGV0IG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHBhZ2VMb2FkZWQgPSBmYWxzZTtcbiAgICBsZXQgY3VycmVudEhpZ2hsaWdodEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGhpZ2hsaWdodFBvc2l0aW9uVXBkYXRlcjogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGNsaWNrRGlzbWlzc0xpc3RlbmVyOiAoKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJldHJ5VGltZW91dDogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcblxuICAgIGZ1bmN0aW9uIGFuYWx5emVQYWdlKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1cmw6IGxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgZG9tYWluOiBsb2NhdGlvbi5ob3N0bmFtZSxcbiAgICAgICAgICB0aXRsZTogZG9jdW1lbnQudGl0bGUsXG4gICAgICAgICAgdmlzaWJsZVRleHQ6IGV4dHJhY3RWaXNpYmxlVGV4dCgpLFxuICAgICAgICAgIGJ1dHRvbnM6IGV4dHJhY3RCdXR0b25zKCksXG4gICAgICAgICAgbGlua3M6IGV4dHJhY3RMaW5rcygpLFxuICAgICAgICAgIGlucHV0czogZXh0cmFjdElucHV0cygpLFxuICAgICAgICAgIGZvcm1zOiBleHRyYWN0Rm9ybXMoKSxcbiAgICAgICAgICBoZWFkaW5nczogZXh0cmFjdEhlYWRpbmdzKCksXG4gICAgICAgICAgbmF2aWdhdGlvbjogZXh0cmFjdE5hdmlnYXRpb24oKSxcbiAgICAgICAgICBkaWFsb2dzOiBleHRyYWN0RGlhbG9ncygpLFxuICAgICAgICAgIGFyaWFMYWJlbHM6IGV4dHJhY3RBcmlhTGFiZWxzKCksXG4gICAgICAgICAgcGxhY2Vob2xkZXJzOiBleHRyYWN0UGxhY2Vob2xkZXJzKCksXG4gICAgICAgICAgaW1hZ2VzOiBleHRyYWN0SW1hZ2VzKCksXG4gICAgICAgICAgc2VsZWN0RWxlbWVudDogZXh0cmFjdFNlbGVjdHMoKSxcbiAgICAgICAgICBjaGVja2JveGVzOiBleHRyYWN0Q2hlY2tib3hlcygpLFxuICAgICAgICAgIHRhYnM6IGV4dHJhY3RUYWJzKCksXG4gICAgICAgICAgc3VjY2Vzc01lc3NhZ2VzOiBleHRyYWN0U3VjY2Vzc01lc3NhZ2VzKCksXG4gICAgICAgICAgZXJyb3JNZXNzYWdlczogZXh0cmFjdEVycm9yTWVzc2FnZXMoKSxcbiAgICAgICAgICB2YWxpZGF0aW9uTWVzc2FnZXM6IGV4dHJhY3RWYWxpZGF0aW9uTWVzc2FnZXMoKSxcbiAgICAgICAgICBkaXNhYmxlZEJ1dHRvbnM6IGV4dHJhY3REaXNhYmxlZEJ1dHRvbnMoKSxcbiAgICAgICAgICBicmVhZGNydW1iczogZXh0cmFjdEJyZWFkY3J1bWJzKCksXG4gICAgICAgICAgdG9hc3RzOiBleHRyYWN0VG9hc3RzKCksXG4gICAgICAgICAgcGFnZVB1cnBvc2U6IGV4dHJhY3RQYWdlUHVycG9zZSgpLFxuICAgICAgICAgIGFjdGl2ZVdvcmtmbG93OiBleHRyYWN0QWN0aXZlV29ya2Zsb3coKSxcbiAgICAgICAgICBwYWdlU3RhdGU6IGRvY3VtZW50LnJlYWR5U3RhdGUsXG4gICAgICAgIH07XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignW1dlYkd1aWRlcl0gYW5hbHl6ZVBhZ2UgZXJyb3I6JywgZXJyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1cmw6IGxvY2F0aW9uLmhyZWYsIGRvbWFpbjogbG9jYXRpb24uaG9zdG5hbWUsIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgICB2aXNpYmxlVGV4dDogJycsIGJ1dHRvbnM6IFtdLCBsaW5rczogW10sIGlucHV0czogW10sIGZvcm1zOiBbXSxcbiAgICAgICAgICBoZWFkaW5nczogW10sIG5hdmlnYXRpb246IFtdLCBkaWFsb2dzOiBbXSwgYXJpYUxhYmVsczogW10sXG4gICAgICAgICAgcGxhY2Vob2xkZXJzOiBbXSwgaW1hZ2VzOiBbXSwgc2VsZWN0RWxlbWVudDogW10sIGNoZWNrYm94ZXM6IFtdLFxuICAgICAgICAgIHRhYnM6IFtdLCBzdWNjZXNzTWVzc2FnZXM6IFtdLCBlcnJvck1lc3NhZ2VzOiBbXSwgdmFsaWRhdGlvbk1lc3NhZ2VzOiBbXSxcbiAgICAgICAgICBkaXNhYmxlZEJ1dHRvbnM6IFtdLCBicmVhZGNydW1iczogW10sIHRvYXN0czogW10sXG4gICAgICAgICAgcGFnZVB1cnBvc2U6ICcnLCBhY3RpdmVXb3JrZmxvdzogJycsIHBhZ2VTdGF0ZTogZG9jdW1lbnQucmVhZHlTdGF0ZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0VmlzaWJsZVRleHQoKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgICAgaWYgKCFib2R5KSByZXR1cm4gJyc7XG4gICAgICBjb25zdCBjbG9uZSA9IGJvZHkuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgdGFnc1RvUmVtb3ZlID0gY2xvbmUucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0LCBzdHlsZSwgbm9zY3JpcHQsIGlmcmFtZSwgc3ZnLCBbYXJpYS1oaWRkZW49XCJ0cnVlXCJdJyk7XG4gICAgICB0YWdzVG9SZW1vdmUuZm9yRWFjaCgoZWwpID0+IGVsLnJlbW92ZSgpKTtcbiAgICAgIHJldHVybiAoY2xvbmUudGV4dENvbnRlbnQgfHwgJycpLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCkuc2xpY2UoMCwgMzAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0cmFjdEJ1dHRvbnMoKSB7XG4gICAgICBjb25zdCBlbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24sIFtyb2xlPVwiYnV0dG9uXCJdLCBpbnB1dFt0eXBlPVwic3VibWl0XCJdLCBpbnB1dFt0eXBlPVwiYnV0dG9uXCJdJyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShlbHMpLnNsaWNlKDAsIDgwKS5tYXAoKGVsKSA9PiAoe1xuICAgICAgICB0ZXh0OiAoZWwudGV4dENvbnRlbnQgfHwgKGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnKS50cmltKCkuc2xpY2UoMCwgNjApLFxuICAgICAgICBzZWxlY3RvcjogZ2VuZXJhdGVTZWxlY3RvcihlbCBhcyBIVE1MRWxlbWVudCksXG4gICAgICAgIHR5cGU6IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgdmlzaWJsZTogaXNWaXNpYmxlKGVsIGFzIEhUTUxFbGVtZW50KSxcbiAgICAgIH0pKS5maWx0ZXIoKGIpID0+IGIudGV4dCB8fCBiLnNlbGVjdG9yKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0TGlua3MoKSB7XG4gICAgICBjb25zdCBlbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWZdJyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShlbHMpLnNsaWNlKDAsIDgwKS5tYXAoKGVsKSA9PiAoe1xuICAgICAgICB0ZXh0OiAoZWwudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKS5zbGljZSgwLCA2MCksXG4gICAgICAgIGhyZWY6IChlbCBhcyBIVE1MQW5jaG9yRWxlbWVudCkuaHJlZixcbiAgICAgICAgc2VsZWN0b3I6IGdlbmVyYXRlU2VsZWN0b3IoZWwgYXMgSFRNTEVsZW1lbnQpLFxuICAgICAgICB2aXNpYmxlOiBpc1Zpc2libGUoZWwgYXMgSFRNTEVsZW1lbnQpLFxuICAgICAgfSkpLmZpbHRlcigobCkgPT4gbC50ZXh0IHx8IGwuaHJlZik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0cmFjdElucHV0cygpIHtcbiAgICAgIGNvbnN0IGVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1cInN1Ym1pdFwiXSk6bm90KFt0eXBlPVwiYnV0dG9uXCJdKTpub3QoW3R5cGU9XCJoaWRkZW5cIl0pLCB0ZXh0YXJlYSwgc2VsZWN0Jyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShlbHMpLnNsaWNlKDAsIDQwKS5tYXAoKGVsKSA9PiAoe1xuICAgICAgICB0eXBlOiAoZWwgYXMgSFRNTElucHV0RWxlbWVudCkudHlwZSB8fCAndGV4dCcsXG4gICAgICAgIG5hbWU6IChlbCBhcyBIVE1MSW5wdXRFbGVtZW50KS5uYW1lIHx8ICcnLFxuICAgICAgICBwbGFjZWhvbGRlcjogKGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnBsYWNlaG9sZGVyIHx8ICcnLFxuICAgICAgICBsYWJlbDogZ2V0TGFiZWwoZWwgYXMgSFRNTEVsZW1lbnQpLFxuICAgICAgICBzZWxlY3RvcjogZ2VuZXJhdGVTZWxlY3RvcihlbCBhcyBIVE1MRWxlbWVudCksXG4gICAgICAgIHJlcXVpcmVkOiAoZWwgYXMgSFRNTElucHV0RWxlbWVudCkucmVxdWlyZWQgfHwgZmFsc2UsXG4gICAgICAgIHZpc2libGU6IGlzVmlzaWJsZShlbCBhcyBIVE1MRWxlbWVudCksXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0cmFjdEZvcm1zKCkge1xuICAgICAgY29uc3QgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShmb3Jtcykuc2xpY2UoMCwgMTApLm1hcCgoZm9ybSkgPT4gKHtcbiAgICAgICAgYWN0aW9uOiAoZm9ybSBhcyBIVE1MRm9ybUVsZW1lbnQpLmFjdGlvbiB8fCAnJyxcbiAgICAgICAgbWV0aG9kOiAoZm9ybSBhcyBIVE1MRm9ybUVsZW1lbnQpLm1ldGhvZCB8fCAnZ2V0JyxcbiAgICAgICAgZmllbGRzOiBBcnJheS5mcm9tKGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKSkubGVuZ3RoLFxuICAgICAgICBzdWJtaXRUZXh0OiAoZm9ybS5xdWVyeVNlbGVjdG9yKCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXSwgaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScpPy50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpLFxuICAgICAgICBzZWxlY3RvcjogZ2VuZXJhdGVTZWxlY3Rvcihmb3JtIGFzIEhUTUxFbGVtZW50KSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0SGVhZGluZ3MoKSB7XG4gICAgICBjb25zdCBlbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdoMSwgaDIsIGgzLCBoNCwgaDUsIGg2Jyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShlbHMpLnNsaWNlKDAsIDMwKS5tYXAoKGVsKSA9PiAoe1xuICAgICAgICBsZXZlbDogcGFyc2VJbnQoZWwudGFnTmFtZVsxXSksXG4gICAgICAgIHRleHQ6IChlbC50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpLnNsaWNlKDAsIDEwMCksXG4gICAgICAgIHNlbGVjdG9yOiBnZW5lcmF0ZVNlbGVjdG9yKGVsIGFzIEhUTUxFbGVtZW50KSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0TmF2aWdhdGlvbigpIHtcbiAgICAgIGNvbnN0IG5hdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCduYXYsIFtyb2xlPVwibmF2aWdhdGlvblwiXSwgaGVhZGVyJyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShuYXZzKS5zbGljZSgwLCA1KS5tYXAoKG5hdikgPT4gKHtcbiAgICAgICAgbGlua3M6IEFycmF5LmZyb20obmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKSkuc2xpY2UoMCwgMjApLm1hcCgoYSkgPT4gKHtcbiAgICAgICAgICB0ZXh0OiAoYS50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpLnNsaWNlKDAsIDQwKSxcbiAgICAgICAgICBocmVmOiAoYSBhcyBIVE1MQW5jaG9yRWxlbWVudCkuaHJlZixcbiAgICAgICAgfSkpLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dHJhY3REaWFsb2dzKCkge1xuICAgICAgY29uc3QgZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3JvbGU9XCJkaWFsb2dcIl0sIFtyb2xlPVwiYWxlcnRkaWFsb2dcIl0sIGRpYWxvZywgLm1vZGFsLCBbY2xhc3MqPVwibW9kYWxcIl0nKTtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGVscykuc2xpY2UoMCwgMTApLmZpbHRlcigoZWwpID0+IGlzVmlzaWJsZShlbCBhcyBIVE1MRWxlbWVudCkpLm1hcCgoZWwpID0+ICh7XG4gICAgICAgIHRleHQ6IChlbC50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpLnNsaWNlKDAsIDIwMCksXG4gICAgICAgIHNlbGVjdG9yOiBnZW5lcmF0ZVNlbGVjdG9yKGVsIGFzIEhUTUxFbGVtZW50KSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0QXJpYUxhYmVscygpIHtcbiAgICAgIGNvbnN0IGVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1thcmlhLWxhYmVsXTpub3QoW2FyaWEtbGFiZWw9XCJcIl0pLCBbYXJpYS1kZXNjcmliZWRieV0nKTtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGVscykuc2xpY2UoMCwgNDApLm1hcCgoZWwpID0+ICh7XG4gICAgICAgIGxhYmVsOiBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSB8fCAnJyxcbiAgICAgICAgdGFnOiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHNlbGVjdG9yOiBnZW5lcmF0ZVNlbGVjdG9yKGVsIGFzIEhUTUxFbGVtZW50KSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0UGxhY2Vob2xkZXJzKCkge1xuICAgICAgY29uc3QgZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3BsYWNlaG9sZGVyXScpO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChBcnJheS5mcm9tKGVscykubWFwKChlbCkgPT4gKGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnBsYWNlaG9sZGVyKSkpLnNsaWNlKDAsIDIwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0SW1hZ2VzKCkge1xuICAgICAgY29uc3QgZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nW2FsdF06bm90KFthbHQ9XCJcIl0pJyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShlbHMpLnNsaWNlKDAsIDMwKS5tYXAoKGVsKSA9PiAoe1xuICAgICAgICBhbHQ6IChlbCBhcyBIVE1MSW1hZ2VFbGVtZW50KS5hbHQsXG4gICAgICAgIHNyYzogKGVsIGFzIEhUTUxJbWFnZUVsZW1lbnQpLnNyYz8uc2xpY2UoMCwgMTAwKSxcbiAgICAgICAgc2VsZWN0b3I6IGdlbmVyYXRlU2VsZWN0b3IoZWwgYXMgSFRNTEVsZW1lbnQpLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dHJhY3RTZWxlY3RzKCkge1xuICAgICAgY29uc3QgZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2VsZWN0Jyk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShlbHMpLnNsaWNlKDAsIDIwKS5tYXAoKGVsKSA9PiAoe1xuICAgICAgICBuYW1lOiAoZWwgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLm5hbWUgfHwgJycsXG4gICAgICAgIG9wdGlvbnM6IEFycmF5LmZyb20oKGVsIGFzIEhUTUxTZWxlY3RFbGVtZW50KS5vcHRpb25zKS5tYXAoKG8pID0+IG8udGV4dCkuc2xpY2UoMCwgMTApLFxuICAgICAgICBzZWxlY3RvcjogZ2VuZXJhdGVTZWxlY3RvcihlbCBhcyBIVE1MRWxlbWVudCksXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0cmFjdENoZWNrYm94ZXMoKSB7XG4gICAgICBjb25zdCBlbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0sIGlucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20oZWxzKS5zbGljZSgwLCAyMCkubWFwKChlbCkgPT4gKHtcbiAgICAgICAgdHlwZTogKGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnR5cGUsXG4gICAgICAgIG5hbWU6IChlbCBhcyBIVE1MSW5wdXRFbGVtZW50KS5uYW1lIHx8ICcnLFxuICAgICAgICBsYWJlbDogZ2V0TGFiZWwoZWwgYXMgSFRNTEVsZW1lbnQpLFxuICAgICAgICBjaGVja2VkOiAoZWwgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCxcbiAgICAgICAgc2VsZWN0b3I6IGdlbmVyYXRlU2VsZWN0b3IoZWwgYXMgSFRNTEVsZW1lbnQpLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dHJhY3RUYWJzKCkge1xuICAgICAgY29uc3QgZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3JvbGU9XCJ0YWJcIl0sIFtyb2xlPVwidGFicGFuZWxcIl0sIFtkYXRhLXRhYl0nKTtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGVscykuc2xpY2UoMCwgMjApLm1hcCgoZWwpID0+ICh7XG4gICAgICAgIHRleHQ6IChlbC50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpLnNsaWNlKDAsIDQwKSxcbiAgICAgICAgc2VsZWN0ZWQ6IGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScgfHwgZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSxcbiAgICAgICAgcm9sZTogZWwuZ2V0QXR0cmlidXRlKCdyb2xlJykgfHwgJycsXG4gICAgICAgIHNlbGVjdG9yOiBnZW5lcmF0ZVNlbGVjdG9yKGVsIGFzIEhUTUxFbGVtZW50KSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0U3VjY2Vzc01lc3NhZ2VzKCk6IHN0cmluZ1tdIHtcbiAgICAgIGNvbnN0IHJlc3VsdHM6IHN0cmluZ1tdID0gW107XG4gICAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgICdbcm9sZT1cInN0YXR1c1wiXVthcmlhLWxpdmU9XCJwb2xpdGVcIl0nLFxuICAgICAgICAnW3JvbGU9XCJhbGVydFwiXVthcmlhLWxpdmU9XCJhc3NlcnRpdmVcIl0nLFxuICAgICAgICAnLnN1Y2Nlc3MsIC5hbGVydC1zdWNjZXNzLCAubm90aWZpY2F0aW9uLXN1Y2Nlc3MsIC50b2FzdC1zdWNjZXNzJyxcbiAgICAgICAgJ1tkYXRhLXRlc3RpZCo9XCJzdWNjZXNzXCJdJyxcbiAgICAgICAgJ1tjbGFzcyo9XCJzdWNjZXNzXCJdOm5vdChbY2xhc3MqPVwiZXJyb3JcIl0pOm5vdChbY2xhc3MqPVwiZGFuZ2VyXCJdKScsXG4gICAgICBdLmpvaW4oJywgJyk7XG4gICAgICBjb25zdCBlbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihzZWxlY3RvcnMpO1xuICAgICAgZWxzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IHRleHQgPSAoZWwudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiA1ICYmIHRleHQubGVuZ3RoIDwgMjAwICYmIGlzVmlzaWJsZShlbCkpIHtcbiAgICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgICBjb25zdCBjb2xvciA9IHN0eWxlLmNvbG9yIHx8ICcnO1xuICAgICAgICAgIGNvbnN0IGJnID0gc3R5bGUuYmFja2dyb3VuZENvbG9yIHx8ICcnO1xuICAgICAgICAgIGNvbnN0IGlzR3JlZW4gPSAvZ3JlZW58IzAwfCMwYXwjMmV8cmdiXFwoMCxcXHMqMS9pLnRlc3QoY29sb3IgKyBiZyk7XG4gICAgICAgICAgaWYgKGlzR3JlZW4gfHwgL3N1Y2Nlc3MvaS50ZXN0KGVsLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0ZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IGJvZHlUZXh0ID0gZG9jdW1lbnQuYm9keT8uaW5uZXJUZXh0IHx8ICcnO1xuICAgICAgICBjb25zdCBzdWNjZXNzUGF0dGVybnMgPSBbXG4gICAgICAgICAgL3N1Y2Nlc3NmdWxseXxjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5fGhhcyBiZWVuIGNyZWF0ZWR8aGFzIGJlZW4gdXBkYXRlZHx5b3UoJ3wgYSlyZSBhbGwgc2V0fGNoYW5nZXMgc2F2ZWR8eW91ciBjaGFuZ2VzIGhhdmUgYmVlbnxhY2NvdW50IGNyZWF0ZWR8c2lnbmVkIGluIHN1Y2Nlc3NmdWxseXxsb2dnZWQgaW4gc3VjY2Vzc2Z1bGx5fHdlbGNvbWUgYmFjay9pLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2Ygc3VjY2Vzc1BhdHRlcm5zKSB7XG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSBib2R5VGV4dC5tYXRjaChwKTtcbiAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbnRlbmNlID0gZXh0cmFjdE5lYXJieVNlbnRlbmNlKGJvZHlUZXh0LCBtYXRjaC5pbmRleCEpO1xuICAgICAgICAgICAgaWYgKHNlbnRlbmNlKSByZXN1bHRzLnB1c2goc2VudGVuY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHMuc2xpY2UoMCwgMyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0cmFjdEVycm9yTWVzc2FnZXMoKTogc3RyaW5nW10ge1xuICAgICAgY29uc3QgcmVzdWx0czogc3RyaW5nW10gPSBbXTtcbiAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgJ1tyb2xlPVwiYWxlcnRcIl0nLFxuICAgICAgICAnW2FyaWEtbGl2ZT1cImFzc2VydGl2ZVwiXScsXG4gICAgICAgICcuZXJyb3IsIC5hbGVydC1lcnJvciwgLmFsZXJ0LWRhbmdlciwgLm5vdGlmaWNhdGlvbi1lcnJvcicsXG4gICAgICAgICdbZGF0YS10ZXN0aWQqPVwiZXJyb3JcIl0nLFxuICAgICAgICAnW2NsYXNzKj1cImVycm9yXCJdOm5vdChbY2xhc3MqPVwic3VjY2Vzc1wiXSknLFxuICAgICAgICAnLmZpZWxkLWVycm9yLCAuZm9ybS1lcnJvciwgLnZhbGlkYXRpb24tZXJyb3InLFxuICAgICAgICAnLmludmFsaWQtZmVlZGJhY2snLFxuICAgICAgICAnW2RhdGEtZXJyb3JdJyxcbiAgICAgIF0uam9pbignLCAnKTtcbiAgICAgIGNvbnN0IGVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KHNlbGVjdG9ycyk7XG4gICAgICBlbHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgY29uc3QgdGV4dCA9IChlbC50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpO1xuICAgICAgICBpZiAodGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IDMgJiYgdGV4dC5sZW5ndGggPCAzMDAgJiYgaXNWaXNpYmxlKGVsKSkge1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICAgIGNvbnN0IGNvbG9yID0gc3R5bGUuY29sb3IgfHwgJyc7XG4gICAgICAgICAgY29uc3QgaXNSZWQgPSAvcmVkfCNlWzAtOWEtZl17Myx9fCNjWzAtOWEtZl17Myx9fCNkWzAtOWEtZl17Myx9fHJnYlxcKDJbMC05XVswLTldfHJnYlxcKDFbOC05XS9pLnRlc3QoY29sb3IpO1xuICAgICAgICAgIGlmIChpc1JlZCB8fCAvZXJyb3J8ZGFuZ2VyfGludmFsaWR8cmVxdWlyZWQvaS50ZXN0KGVsLmNsYXNzTmFtZSArIGVsLmlkKSkge1xuICAgICAgICAgICAgaWYgKCFyZXN1bHRzLmluY2x1ZGVzKHRleHQpKSByZXN1bHRzLnB1c2godGV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCBib2R5VGV4dCA9IGRvY3VtZW50LmJvZHk/LmlubmVyVGV4dCB8fCAnJztcbiAgICAgICAgY29uc3QgZXJyb3JQYXR0ZXJucyA9IFtcbiAgICAgICAgICAvaW5jb3JyZWN0XFxzKyh1c2VybmFtZXxwYXNzd29yZHxlbWFpbHxvdHB8cHdkKXxpbnZhbGlkXFxzKyh1c2VybmFtZXxwYXNzd29yZHxlbWFpbHxvdHB8Y3JlZGVudGlhbHM/KXx3cm9uZ1xccysocGFzc3dvcmR8b3RwfGVtYWlsfHVzZXJuYW1lKS9pLFxuICAgICAgICAgIC8odXNlcm5hbWV8cGFzc3dvcmR8ZW1haWwpXFxzKyhpc1xccyspPyhyZXF1aXJlZHxpbnZhbGlkfGluY29ycmVjdHx3cm9uZ3x0YWtlbnxhbHJlYWR5XFxzK2V4aXN0cykvaSxcbiAgICAgICAgICAvKGxvZ2lufHNpZ25cXHMqaW4pXFxzKyhmYWlsZWR8dW5zdWNjZXNzZnVsfGVycm9yKS9pLFxuICAgICAgICAgIC8ocGFzc3dvcmR8b3RwKVxccysoZG9lc24ndFxccyttYXRjaHxkb1xccytub3RcXHMrbWF0Y2h8bWlzbWF0Y2gpL2ksXG4gICAgICAgICAgLyhwYXltZW50fHRyYW5zYWN0aW9ufG9yZGVyKVxccysoZmFpbGVkfGRlY2xpbmVkfHJlamVjdGVkfGVycm9yKS9pLFxuICAgICAgICAgIC8ocmVwb3NpdG9yeXxwYWNrYWdlfG5hbWUpXFxzKyhhbHJlYWR5XFxzK2V4aXN0c3xpc1xccyt0YWtlbnxpbnZhbGlkKS9pLFxuICAgICAgICAgIC8oYWNjZXNzfHBlcm1pc3Npb24pXFxzK2RlbmllZHx1bmF1dGhvcml6ZWR8Zm9yYmlkZGVuL2ksXG4gICAgICAgICAgLyhub3RcXHMrZm91bmR8cGFnZVxccytub3RcXHMrZm91bmR8NDA0KS9pLFxuICAgICAgICAgIC8oc29tZXRoaW5nXFxzK3dlbnRcXHMrd3Jvbmd8dHJ5XFxzK2FnYWlufHBsZWFzZVxccyt0cnlcXHMrYWdhaW4pL2ksXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3QgcCBvZiBlcnJvclBhdHRlcm5zKSB7XG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSBib2R5VGV4dC5tYXRjaChwKTtcbiAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbnRlbmNlID0gZXh0cmFjdE5lYXJieVNlbnRlbmNlKGJvZHlUZXh0LCBtYXRjaC5pbmRleCEpO1xuICAgICAgICAgICAgaWYgKHNlbnRlbmNlICYmICFyZXN1bHRzLmluY2x1ZGVzKHNlbnRlbmNlKSkgcmVzdWx0cy5wdXNoKHNlbnRlbmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzLnNsaWNlKDAsIDMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dHJhY3RWYWxpZGF0aW9uTWVzc2FnZXMoKTogc3RyaW5nW10ge1xuICAgICAgY29uc3QgcmVzdWx0czogc3RyaW5nW10gPSBbXTtcbiAgICAgIGNvbnN0IGVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICAnLmZpZWxkLXZhbGlkYXRpb24tZXJyb3IsIC52YWxpZGF0aW9uLXN1bW1hcnktZXJyb3JzLCAudGV4dC1kYW5nZXIsIFtkYXRhLXZhbG1zZy1mb3JdJ1xuICAgICAgKTtcbiAgICAgIGVscy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBjb25zdCB0ZXh0ID0gKGVsLnRleHRDb250ZW50IHx8ICcnKS50cmltKCk7XG4gICAgICAgIGlmICh0ZXh0ICYmIHRleHQubGVuZ3RoID4gMyAmJiBpc1Zpc2libGUoZWwpKSB7XG4gICAgICAgICAgaWYgKCFyZXN1bHRzLmluY2x1ZGVzKHRleHQpKSByZXN1bHRzLnB1c2godGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MSW5wdXRFbGVtZW50PignaW5wdXQ6aW52YWxpZCwgdGV4dGFyZWE6aW52YWxpZCwgc2VsZWN0OmludmFsaWQnKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBjb25zdCBsYWJlbCA9IGdldExhYmVsKGVsKTtcbiAgICAgICAgY29uc3QgdmFsaWRhdGlvbk1zZyA9IGVsLnZhbGlkYXRpb25NZXNzYWdlO1xuICAgICAgICBpZiAodmFsaWRhdGlvbk1zZykge1xuICAgICAgICAgIGNvbnN0IG1zZyA9IGxhYmVsID8gYFwiJHtsYWJlbH1cIiDigJQgJHt2YWxpZGF0aW9uTXNnfWAgOiB2YWxpZGF0aW9uTXNnO1xuICAgICAgICAgIGlmICghcmVzdWx0cy5pbmNsdWRlcyhtc2cpKSByZXN1bHRzLnB1c2gobXNnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0cy5zbGljZSgwLCA1KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0RGlzYWJsZWRCdXR0b25zKCk6IHsgdGV4dDogc3RyaW5nOyBzZWxlY3Rvcjogc3RyaW5nIH1bXSB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcbiAgICAgICAgJ2J1dHRvbjpkaXNhYmxlZCwgW3JvbGU9XCJidXR0b25cIl1bYXJpYS1kaXNhYmxlZD1cInRydWVcIl0sIGlucHV0W3R5cGU9XCJzdWJtaXRcIl06ZGlzYWJsZWQsIGEuZGlzYWJsZWQnXG4gICAgICApKS5zbGljZSgwLCAxMCkubWFwKChlbCkgPT4gKHtcbiAgICAgICAgdGV4dDogKGVsLnRleHRDb250ZW50IHx8IChlbCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB8fCAnJykudHJpbSgpLnNsaWNlKDAsIDYwKSxcbiAgICAgICAgc2VsZWN0b3I6IGdlbmVyYXRlU2VsZWN0b3IoZWwpLFxuICAgICAgfSkpLmZpbHRlcigoYikgPT4gYi50ZXh0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0QnJlYWRjcnVtYnMoKTogc3RyaW5nW10ge1xuICAgICAgY29uc3QgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ25hdlthcmlhLWxhYmVsPVwiQnJlYWRjcnVtYlwiXSwgLmJyZWFkY3J1bWIsIFtyb2xlPVwibmF2aWdhdGlvblwiXVthcmlhLWxhYmVsKj1cImJyZWFkY3J1bWJcIl0nKTtcbiAgICAgIGlmIChuYXYpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EsIHNwYW4sIFthcmlhLWN1cnJlbnQ9XCJwYWdlXCJdJykpLm1hcCgoZWwpID0+XG4gICAgICAgICAgKGVsLnRleHRDb250ZW50IHx8ICcnKS50cmltKClcbiAgICAgICAgKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICBjb25zdCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbaXRlbXByb3A9XCJpdGVtTGlzdEVsZW1lbnRcIl0nKTtcbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGl0ZW1zKS5tYXAoKGVsKSA9PlxuICAgICAgICAgIChlbC5xdWVyeVNlbGVjdG9yKCdbaXRlbXByb3A9XCJuYW1lXCJdJyk/LnRleHRDb250ZW50IHx8IGVsLnRleHRDb250ZW50IHx8ICcnKS50cmltKClcbiAgICAgICAgKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0cmFjdFRvYXN0cygpOiBzdHJpbmdbXSB7XG4gICAgICBjb25zdCByZXN1bHRzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgY29uc3QgZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXG4gICAgICAgICdbcm9sZT1cInN0YXR1c1wiXSwgW3JvbGU9XCJsb2dcIl0sIFthcmlhLWxpdmU9XCJwb2xpdGVcIl0sIC50b2FzdCwgLm5vdGlmaWNhdGlvbiwgLmFsZXJ0Om5vdChbcm9sZT1cImFsZXJ0XCJdKSdcbiAgICAgICk7XG4gICAgICBlbHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgaWYgKGVsLmNsb3Nlc3QoJ1tyb2xlPVwiZGlhbG9nXCJdLCBkaWFsb2csIC5tb2RhbCcpKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHRleHQgPSAoZWwudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAzICYmIHRleHQubGVuZ3RoIDwgMzAwICYmIGlzVmlzaWJsZShlbCkpIHtcbiAgICAgICAgICBpZiAoIXJlc3VsdHMuaW5jbHVkZXModGV4dCkpIHJlc3VsdHMucHVzaCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0cy5zbGljZSgwLCAzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0UGFnZVB1cnBvc2UoKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IHVybCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoO1xuICAgICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC50aXRsZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgY29uc3QgaDEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoMScpPy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKS50cmltKCkgfHwgJyc7XG4gICAgICBjb25zdCBtYWluSGVhZGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2gxLCBoMicpPy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKS50cmltKCkgfHwgJyc7XG5cbiAgICAgIGNvbnN0IHB1cnBvc2VNYXA6IFtSZWdFeHAsIHN0cmluZ11bXSA9IFtcbiAgICAgICAgWy9cXC9sb2dpbnxsb2coaW58b3V0KXxzaWduaW58YXV0aHxhdXRoZW50aWNhdGUvaSwgJ0xvZ2luIC8gQXV0aGVudGljYXRpb24nXSxcbiAgICAgICAgWy9cXC9zaWdudXB8cmVnaXN0ZXJ8Y3JlYXRlLWFjY291bnR8c2lnbi11cC9pLCAnQWNjb3VudCBSZWdpc3RyYXRpb24nXSxcbiAgICAgICAgWy9cXC9kYXNoYm9hcmR8bXktYWNjb3VudHxhY2NvdW50KFxcL3wkKS9pLCAnRGFzaGJvYXJkIC8gQWNjb3VudCBPdmVydmlldyddLFxuICAgICAgICBbL1xcL3NldHRpbmdzfHByZWZlcmVuY2VzfHByb2ZpbGVcXC9lZGl0L2ksICdTZXR0aW5ncyAvIFByb2ZpbGUgTWFuYWdlbWVudCddLFxuICAgICAgICBbL1xcL3NlYXJjaHxmaW5kfHJlc3VsdHNcXD9zZWFyY2gvaSwgJ1NlYXJjaCBSZXN1bHRzJ10sXG4gICAgICAgIFsvXFwvY2hlY2tvdXR8Y2FydHxwYXltZW50fG9yZGVyXFwvcmV2aWV3L2ksICdDaGVja291dCAvIFBheW1lbnQnXSxcbiAgICAgICAgWy9cXC9vcmRlcnM/KFxcL3wkKXxwdXJjaGFzZXM/fGhpc3RvcnkvaSwgJ09yZGVyIEhpc3RvcnknXSxcbiAgICAgICAgWy9cXC9wcm9kdWN0cz8oXFwvfCQpfGl0ZW1zPyhcXC98JCl8Y2F0YWxvZ3xzaG9wL2ksICdQcm9kdWN0IC8gQ2F0YWxvZyBCcm93c2luZyddLFxuICAgICAgICBbL1xcL2NyZWF0ZXxuZXcoXFwvfCQpfGFkZChcXC98JCkvaSwgJ0NyZWF0ZSBOZXcgSXRlbSddLFxuICAgICAgICBbL1xcL2VkaXR8dXBkYXRlfG1vZGlmeXxjaGFuZ2UvaSwgJ0VkaXQgLyBVcGRhdGUnXSxcbiAgICAgICAgWy9cXC9pc3N1ZXM/KFxcL3wkKXxidWdzP3x0aWNrZXRzL2ksICdJc3N1ZSAvIFRpY2tldCBNYW5hZ2VtZW50J10sXG4gICAgICAgIFsvXFwvcmVwb3M/KGl0b3J5KT8oXFwvfCQpfHByb2plY3RzPyhcXC98JCkvaSwgJ1JlcG9zaXRvcnkgLyBQcm9qZWN0IFZpZXcnXSxcbiAgICAgICAgWy9cXC9wdWxscz98bWVyZ2V8cHVsbC1yZXF1ZXN0L2ksICdQdWxsIFJlcXVlc3RzJ10sXG4gICAgICAgIFsvXFwvd2lraXxkb2NzP3xkb2N1bWVudGF0aW9ufGhlbHB8c3VwcG9ydC9pLCAnRG9jdW1lbnRhdGlvbiAvIEhlbHAnXSxcbiAgICAgICAgWy9cXC9wcm9maWxlKFxcL3wkKXx1c2VyKFxcL3wkKS9pLCAnVXNlciBQcm9maWxlJ10sXG4gICAgICAgIFsvXFwvbm90aWZpY2F0aW9uc3xpbmJveHxtZXNzYWdlcy9pLCAnTm90aWZpY2F0aW9ucyAvIE1lc3NhZ2VzJ10sXG4gICAgICBdO1xuXG4gICAgICBmb3IgKGNvbnN0IFtwYXR0ZXJuLCBwdXJwb3NlXSBvZiBwdXJwb3NlTWFwKSB7XG4gICAgICAgIGlmIChwYXR0ZXJuLnRlc3QodXJsKSB8fCBwYXR0ZXJuLnRlc3QodGl0bGUpIHx8IHBhdHRlcm4udGVzdChoMSkpIHtcbiAgICAgICAgICByZXR1cm4gcHVycG9zZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoL2Rhc2hib2FyZHxvdmVydmlld3xob21lXFxzKnBhZ2V8d2VsY29tZS9pLnRlc3QobWFpbkhlYWRpbmcpKSByZXR1cm4gJ0Rhc2hib2FyZCAvIEhvbWUnO1xuICAgICAgaWYgKC9sb2dpbnxzaWduXFxzKmlufGxvZ1xccyppbi9pLnRlc3QobWFpbkhlYWRpbmcpKSByZXR1cm4gJ0xvZ2luIC8gQXV0aGVudGljYXRpb24nO1xuICAgICAgaWYgKC9yZWdpc3RlcnxzaWduXFxzKnVwfGNyZWF0ZVxccyphY2NvdW50L2kudGVzdChtYWluSGVhZGluZykpIHJldHVybiAnQWNjb3VudCBSZWdpc3RyYXRpb24nO1xuICAgICAgaWYgKC9zZXR0aW5nc3xwcmVmZXJlbmNlc3xwcm9maWxlL2kudGVzdChtYWluSGVhZGluZykpIHJldHVybiAnU2V0dGluZ3MgLyBQcm9maWxlJztcbiAgICAgIGlmICgvc2VhcmNofGZpbmR8YnJvd3NlL2kudGVzdChtYWluSGVhZGluZykpIHJldHVybiAnU2VhcmNoIC8gQnJvd3NlJztcblxuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dHJhY3RBY3RpdmVXb3JrZmxvdygpOiBzdHJpbmcge1xuICAgICAgY29uc3QgdXJsID0gbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2g7XG4gICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnRpdGxlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmICgvXFwvbG9naW58bG9nKGlufG91dCl8c2lnbmlufGF1dGgvaS50ZXN0KHVybCkgfHwgL2xvZ2lufHNpZ25cXHMqaW4vaS50ZXN0KHRpdGxlKSkgcmV0dXJuICdsb2dpbic7XG4gICAgICBpZiAoL3JlZ2lzdGVyfHNpZ251cHxjcmVhdGUtYWNjb3VudHxzaWduLXVwL2kudGVzdCh1cmwpIHx8IC9yZWdpc3RlcnxzaWduXFxzKnVwL2kudGVzdCh0aXRsZSkpIHJldHVybiAnc2lnbnVwJztcbiAgICAgIGlmICgvXFwvY2hlY2tvdXR8Y2FydHxwYXltZW50L2kudGVzdCh1cmwpIHx8IC9jaGVja291dHxjYXJ0L2kudGVzdCh0aXRsZSkpIHJldHVybiAnY2hlY2tvdXQnO1xuICAgICAgaWYgKC9cXC9vcmRlcnM/KFxcL3wkKXxvcmRlclxcL2NvbmZpcm0vaS50ZXN0KHVybCkpIHJldHVybiAnb3JkZXItY29uZmlybWF0aW9uJztcbiAgICAgIGlmICgvXFwvc2V0dGluZ3N8cHJlZmVyZW5jZXN8cHJvZmlsZS9pLnRlc3QodXJsKSkgcmV0dXJuICdzZXR0aW5ncyc7XG4gICAgICBpZiAoL1xcL2NyZWF0ZXxuZXcoXFwvfCQpL2kudGVzdCh1cmwpKSByZXR1cm4gJ2NyZWF0aW9uJztcbiAgICAgIGlmICgvXFwvZWRpdHx1cGRhdGUvaS50ZXN0KHVybCkpIHJldHVybiAnZWRpdGluZyc7XG5cbiAgICAgIGNvbnN0IGFjdGl2ZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2FyaWEtY3VycmVudD1cInBhZ2VcIl0sIFthcmlhLWN1cnJlbnQ9XCJzdGVwXCJdLCAuYWN0aXZlLCAuY3VycmVudCcpO1xuICAgICAgaWYgKGFjdGl2ZUVsKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSAoYWN0aXZlRWwudGV4dENvbnRlbnQgfHwgJycpLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgICAgICBpZiAodGV4dCkgcmV0dXJuIHRleHQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0TmVhcmJ5U2VudGVuY2UodGV4dDogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IHRleHQuc2xpY2UoTWF0aC5tYXgoMCwgaW5kZXggLSA4MCksIGluZGV4KTtcbiAgICAgIGNvbnN0IGFmdGVyID0gdGV4dC5zbGljZShpbmRleCwgaW5kZXggKyAyMDApO1xuICAgICAgY29uc3Qgc2VudGVuY2VTdGFydCA9IE1hdGgubWF4KGJlZm9yZS5sYXN0SW5kZXhPZignLicpICsgMSwgYmVmb3JlLmxhc3RJbmRleE9mKCchJykgKyAxLCBiZWZvcmUubGFzdEluZGV4T2YoJz8nKSArIDEsIDApO1xuICAgICAgY29uc3Qgc2VudGVuY2VFbmQgPSAoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbmRNYXRjaCA9IGFmdGVyLm1hdGNoKC9bLiE/XShcXHN8JCkvKTtcbiAgICAgICAgcmV0dXJuIGVuZE1hdGNoID8gZW5kTWF0Y2guaW5kZXghICsgMSA6IGFmdGVyLmxlbmd0aDtcbiAgICAgIH0pKCk7XG4gICAgICByZXR1cm4gKGJlZm9yZS5zbGljZShzZW50ZW5jZVN0YXJ0KSArIGFmdGVyLnNsaWNlKDAsIHNlbnRlbmNlRW5kKSkudHJpbSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldExhYmVsKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XG4gICAgICBjb25zdCBpZCA9IGVsLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgIGlmIChpZCkge1xuICAgICAgICBjb25zdCBsYWJlbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbGFiZWxbZm9yPVwiJHtpZH1cIl1gKTtcbiAgICAgICAgaWYgKGxhYmVsRWwpIHJldHVybiAobGFiZWxFbC50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpO1xuICAgICAgfVxuICAgICAgY29uc3QgcGFyZW50ID0gZWwuY2xvc2VzdCgnbGFiZWwnKTtcbiAgICAgIGlmIChwYXJlbnQpIHJldHVybiAocGFyZW50LnRleHRDb250ZW50IHx8ICcnKS50cmltKCkucmVwbGFjZShlbC50ZXh0Q29udGVudCB8fCAnJywgJycpLnRyaW0oKTtcbiAgICAgIGNvbnN0IGFyaWFMYWJlbCA9IGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgaWYgKGFyaWFMYWJlbCkgcmV0dXJuIGFyaWFMYWJlbDtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1Zpc2libGUoZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgICBpZiAoIWVsLm9mZnNldFBhcmVudCAmJiBlbC50YWdOYW1lICE9PSAnQk9EWScpIHJldHVybiBmYWxzZTtcbiAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgaWYgKHN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fCBzdHlsZS52aXNpYmlsaXR5ID09PSAnaGlkZGVuJyB8fCBwYXJzZUZsb2F0KHN0eWxlLm9wYWNpdHkpID09PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVNlbGVjdG9yKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XG4gICAgICBpZiAoZWwuaWQpIHJldHVybiBgIyR7Q1NTLmVzY2FwZShlbC5pZCl9YDtcbiAgICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVzdGlkJykpIHJldHVybiBgW2RhdGEtdGVzdGlkPVwiJHtlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVzdGlkJyl9XCJdYDtcbiAgICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSkgcmV0dXJuIGAke2VsLnRhZ05hbWUudG9Mb3dlckNhc2UoKX1bbmFtZT1cIiR7ZWwuZ2V0QXR0cmlidXRlKCduYW1lJyl9XCJdYDtcbiAgICAgIGNvbnN0IHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGNvbnN0IHNpYmxpbmdzID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbHRlcigoYykgPT4gYy50YWdOYW1lID09PSBlbC50YWdOYW1lKTtcbiAgICAgICAgaWYgKHNpYmxpbmdzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHNpYmxpbmdzLmluZGV4T2YoZWwpICsgMTtcbiAgICAgICAgICByZXR1cm4gYCR7ZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpfTpudGgtY2hpbGQoJHtpbmRleH0pYDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgU21hcnRNYXRjaFJlc3VsdCB7XG4gICAgICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgICAgIHNlbGVjdG9yOiBzdHJpbmc7XG4gICAgICBjb25maWRlbmNlOiBudW1iZXI7XG4gICAgICBzdHJhdGVneTogc3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRFbGVtZW50U21hcnQodGFyZ2V0OiBIaWdobGlnaHRUYXJnZXQpOiBTbWFydE1hdGNoUmVzdWx0IHwgbnVsbCB7XG4gICAgICBjb25zdCB7IHRleHQsIHJvbGUsIGVsZW1lbnRUeXBlIH0gPSB0YXJnZXQ7XG4gICAgICBpZiAoIXRleHQpIHJldHVybiBudWxsO1xuXG4gICAgICBjb25zdCB0ZXh0TG93ZXIgPSB0ZXh0LnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgICAgaWYgKCF0ZXh0TG93ZXIpIHJldHVybiBudWxsO1xuXG4gICAgICBjb25zdCBjYW5kaWRhdGVzOiBTbWFydE1hdGNoUmVzdWx0W10gPSBbXTtcblxuICAgICAgZnVuY3Rpb24gc2NvcmVCeVZpc2liaWxpdHkoZWw6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFpc1Zpc2libGUoZWwpKSByZXR1cm4gLTUwO1xuICAgICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmIChyZWN0LndpZHRoID09PSAwIHx8IHJlY3QuaGVpZ2h0ID09PSAwKSByZXR1cm4gLTUwO1xuICAgICAgICBjb25zdCB2aWV3cG9ydEggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIGNvbnN0IHZpZXdwb3J0VyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gdmlld3BvcnRIIC8gMjtcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IHZpZXdwb3J0VyAvIDI7XG4gICAgICAgIGNvbnN0IGVsQ2VudGVyWSA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgLyAyO1xuICAgICAgICBjb25zdCBlbENlbnRlclggPSByZWN0LmxlZnQgKyByZWN0LndpZHRoIC8gMjtcbiAgICAgICAgY29uc3QgZGlzdEZyb21DZW50ZXIgPSBNYXRoLnNxcnQoKGVsQ2VudGVyWCAtIGNlbnRlclgpICoqIDIgKyAoZWxDZW50ZXJZIC0gY2VudGVyWSkgKiogMik7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCAzMCAtIGRpc3RGcm9tQ2VudGVyIC8gNTApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBub3JtYWxpemVUZXh0KHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0LnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYWRkQ2FuZGlkYXRlKGVsOiBIVE1MRWxlbWVudCwgc3RyYXRlZ3k6IHN0cmluZywgY29uZkJvbnVzOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGNhbmRpZGF0ZXMuc29tZSgoYykgPT4gYy5lbGVtZW50ID09PSBlbCkpIHJldHVybjtcbiAgICAgICAgY29uc3QgdmlzU2NvcmUgPSBzY29yZUJ5VmlzaWJpbGl0eShlbCk7XG4gICAgICAgIGNvbnN0IHRvdGFsQ29uZiA9IE1hdGgubWluKDEwMCwgTWF0aC5tYXgoMCwgY29uZkJvbnVzICsgdmlzU2NvcmUpKTtcbiAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHtcbiAgICAgICAgICBlbGVtZW50OiBlbCxcbiAgICAgICAgICBzZWxlY3RvcjogZ2VuZXJhdGVTZWxlY3RvcihlbCksXG4gICAgICAgICAgY29uZmlkZW5jZTogdG90YWxDb25mLFxuICAgICAgICAgIHN0cmF0ZWd5LFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgcm9sZVRhZ01hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgYnV0dG9uOiAnYnV0dG9uLCBbcm9sZT1cImJ1dHRvblwiXSwgaW5wdXRbdHlwZT1cInN1Ym1pdFwiXSwgaW5wdXRbdHlwZT1cImJ1dHRvblwiXScsXG4gICAgICAgIGxpbms6ICdhLCBbcm9sZT1cImxpbmtcIl0nLFxuICAgICAgICB0ZXh0Ym94OiAnaW5wdXQsIHRleHRhcmVhLCBbcm9sZT1cInRleHRib3hcIl0nLFxuICAgICAgICBpbnB1dDogJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0LCBbcm9sZT1cInRleHRib3hcIl0sIFtyb2xlPVwiY29tYm9ib3hcIl0nLFxuICAgICAgICB0YWI6ICdbcm9sZT1cInRhYlwiXScsXG4gICAgICAgIG1lbnVpdGVtOiAnW3JvbGU9XCJtZW51aXRlbVwiXScsXG4gICAgICAgIG9wdGlvbjogJ1tyb2xlPVwib3B0aW9uXCJdJyxcbiAgICAgICAgY29tYm9ib3g6ICdbcm9sZT1cImNvbWJvYm94XCJdLCBzZWxlY3QnLFxuICAgICAgICBkaWFsb2c6ICdbcm9sZT1cImRpYWxvZ1wiXSwgW3JvbGU9XCJhbGVydGRpYWxvZ1wiXSwgZGlhbG9nJyxcbiAgICAgICAgY2hlY2tib3g6ICdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0sIFtyb2xlPVwiY2hlY2tib3hcIl0nLFxuICAgICAgICByYWRpbzogJ2lucHV0W3R5cGU9XCJyYWRpb1wiXSwgW3JvbGU9XCJyYWRpb1wiXScsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBlbGVtZW50VHlwZU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgYnV0dG9uOiAnYnV0dG9uLCBbcm9sZT1cImJ1dHRvblwiXSwgaW5wdXRbdHlwZT1cInN1Ym1pdFwiXSwgaW5wdXRbdHlwZT1cImJ1dHRvblwiXScsXG4gICAgICAgIGxpbms6ICdhLCBbcm9sZT1cImxpbmtcIl0nLFxuICAgICAgICBpbnB1dDogJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0LCBbcm9sZT1cInRleHRib3hcIl0sIFtyb2xlPVwiY29tYm9ib3hcIl0nLFxuICAgICAgICBmb3JtOiAnZm9ybScsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBxdWVyeVBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICBpZiAocm9sZSAmJiByb2xlVGFnTWFwW3JvbGVdKSB7XG4gICAgICAgIHF1ZXJ5UGFydHMucHVzaChyb2xlVGFnTWFwW3JvbGVdKTtcbiAgICAgIH1cbiAgICAgIGlmIChlbGVtZW50VHlwZSAmJiBlbGVtZW50VHlwZU1hcFtlbGVtZW50VHlwZV0pIHtcbiAgICAgICAgcXVlcnlQYXJ0cy5wdXNoKGVsZW1lbnRUeXBlTWFwW2VsZW1lbnRUeXBlXSk7XG4gICAgICB9XG4gICAgICBxdWVyeVBhcnRzLnB1c2goJ2J1dHRvbiwgYSwgaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QsIFtyb2xlPVwiYnV0dG9uXCJdLCBbcm9sZT1cImxpbmtcIl0sIFtyb2xlPVwidGFiXCJdLCBbcm9sZT1cIm1lbnVpdGVtXCJdLCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknKTtcblxuICAgICAgY29uc3QgcXVlcnkgPSBxdWVyeVBhcnRzLmpvaW4oJywgJyk7XG4gICAgICBjb25zdCBhbGxJbnRlcmFjdGl2ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KHF1ZXJ5KTtcblxuICAgICAgZm9yIChjb25zdCBlbCBvZiBhbGxJbnRlcmFjdGl2ZSkge1xuICAgICAgICBjb25zdCBlbFRleHQgPSBub3JtYWxpemVUZXh0KGVsLnRleHRDb250ZW50IHx8ICcnKTtcbiAgICAgICAgY29uc3QgZWxWYWx1ZSA9IG5vcm1hbGl6ZVRleHQoKGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnKTtcbiAgICAgICAgY29uc3QgZWxQbGFjZWhvbGRlciA9IG5vcm1hbGl6ZVRleHQoZWwucGxhY2Vob2xkZXIgfHwgJycpO1xuICAgICAgICBjb25zdCBlbEFyaWFMYWJlbCA9IG5vcm1hbGl6ZVRleHQoZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJykgfHwgJycpO1xuICAgICAgICBjb25zdCBlbFRpdGxlID0gbm9ybWFsaXplVGV4dChlbC50aXRsZSB8fCAnJyk7XG4gICAgICAgIGNvbnN0IGVsTmFtZSA9IG5vcm1hbGl6ZVRleHQoZWwuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgJycpO1xuICAgICAgICBjb25zdCBlbEFsdCA9IG5vcm1hbGl6ZVRleHQoZWwuZ2V0QXR0cmlidXRlKCdhbHQnKSB8fCAnJyk7XG5cbiAgICAgICAgaWYgKGVsVGV4dCA9PT0gdGV4dExvd2VyKSB7IGFkZENhbmRpZGF0ZShlbCwgJ2V4YWN0LXRleHQtbWF0Y2gnLCA5OSk7IH1cbiAgICAgICAgZWxzZSBpZiAoZWxBcmlhTGFiZWwgPT09IHRleHRMb3dlcikgeyBhZGRDYW5kaWRhdGUoZWwsICdhcmlhLWxhYmVsLWV4YWN0JywgOTcpOyB9XG4gICAgICAgIGVsc2UgaWYgKGVsVGl0bGUgPT09IHRleHRMb3dlcikgeyBhZGRDYW5kaWRhdGUoZWwsICd0aXRsZS1leGFjdCcsIDk1KTsgfVxuICAgICAgICBlbHNlIGlmIChlbFBsYWNlaG9sZGVyID09PSB0ZXh0TG93ZXIpIHsgYWRkQ2FuZGlkYXRlKGVsLCAncGxhY2Vob2xkZXItZXhhY3QnLCA5NCk7IH1cbiAgICAgICAgZWxzZSBpZiAoZWxWYWx1ZSA9PT0gdGV4dExvd2VyKSB7IGFkZENhbmRpZGF0ZShlbCwgJ3ZhbHVlLWV4YWN0JywgOTMpOyB9XG4gICAgICAgIGVsc2UgaWYgKGVsTmFtZSA9PT0gdGV4dExvd2VyKSB7IGFkZENhbmRpZGF0ZShlbCwgJ25hbWUtZXhhY3QnLCA5Mik7IH1cbiAgICAgICAgZWxzZSBpZiAoZWxBbHQgPT09IHRleHRMb3dlcikgeyBhZGRDYW5kaWRhdGUoZWwsICdhbHQtdGV4dC1leGFjdCcsIDkxKTsgfVxuICAgICAgICBlbHNlIGlmIChlbFRleHQuaW5jbHVkZXModGV4dExvd2VyKSkgeyBhZGRDYW5kaWRhdGUoZWwsICd0ZXh0LWNvbnRhaW5zJywgODIpOyB9XG4gICAgICAgIGVsc2UgaWYgKGVsQXJpYUxhYmVsLmluY2x1ZGVzKHRleHRMb3dlcikpIHsgYWRkQ2FuZGlkYXRlKGVsLCAnYXJpYS1sYWJlbC1jb250YWlucycsIDgwKTsgfVxuICAgICAgICBlbHNlIGlmIChlbFRpdGxlLmluY2x1ZGVzKHRleHRMb3dlcikpIHsgYWRkQ2FuZGlkYXRlKGVsLCAndGl0bGUtY29udGFpbnMnLCA3OCk7IH1cbiAgICAgICAgZWxzZSBpZiAoZWxQbGFjZWhvbGRlci5pbmNsdWRlcyh0ZXh0TG93ZXIpKSB7IGFkZENhbmRpZGF0ZShlbCwgJ3BsYWNlaG9sZGVyLWNvbnRhaW5zJywgNzYpOyB9XG4gICAgICAgIGVsc2UgaWYgKGVsTmFtZS5pbmNsdWRlcyh0ZXh0TG93ZXIpKSB7IGFkZENhbmRpZGF0ZShlbCwgJ25hbWUtY29udGFpbnMnLCA3Mik7IH1cbiAgICAgICAgZWxzZSBpZiAoZWxBbHQuaW5jbHVkZXModGV4dExvd2VyKSkgeyBhZGRDYW5kaWRhdGUoZWwsICdhbHQtdGV4dC1jb250YWlucycsIDcwKTsgfVxuICAgICAgICBlbHNlIGlmICh0ZXh0TG93ZXIuaW5jbHVkZXMoZWxUZXh0KSAmJiBlbFRleHQubGVuZ3RoID4gMCkgeyBhZGRDYW5kaWRhdGUoZWwsICdxdWVyeS1jb250YWlucy1lbGVtZW50LXRleHQnLCA2MCk7IH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNhbmRpZGF0ZXMubGVuZ3RoID09PSAwICYmIHRleHRMb3dlci5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IGFsbEVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJyonKTtcbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBhbGxFbGVtZW50cykge1xuICAgICAgICAgIGlmIChlbC5jaGlsZHJlbi5sZW5ndGggPiAwICYmICFlbC5tYXRjaGVzKCdidXR0b24sIGEsIGlucHV0LCB0ZXh0YXJlYSwgc2VsZWN0LCBbcm9sZT1cImJ1dHRvblwiXScpKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBlbFRleHQgPSBub3JtYWxpemVUZXh0KGVsLnRleHRDb250ZW50IHx8ICcnKTtcbiAgICAgICAgICBpZiAoZWxUZXh0ID09PSB0ZXh0TG93ZXIpIHtcbiAgICAgICAgICAgIGFkZENhbmRpZGF0ZShlbCwgJ2Jyb2FkLWV4YWN0LXRleHQnLCA4MCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbFRleHQuaW5jbHVkZXModGV4dExvd2VyKSkge1xuICAgICAgICAgICAgYWRkQ2FuZGlkYXRlKGVsLCAnYnJvYWQtdGV4dC1jb250YWlucycsIDU1KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNhbmRpZGF0ZXMubGVuZ3RoID09PSAwICYmIHRleHRMb3dlci5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgc2FmZVRleHQgPSB0ZXh0TG93ZXIucmVwbGFjZSgvWydcIl0vZywgJycpO1xuICAgICAgICAgIGNvbnN0IHhwYXRoUmVzdWx0ID0gZG9jdW1lbnQuZXZhbHVhdGUoXG4gICAgICAgICAgICBgLy8qW2NvbnRhaW5zKHRyYW5zbGF0ZSh0ZXh0KCksICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWicsICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicpLCAnJHtzYWZlVGV4dH0nKV1gLFxuICAgICAgICAgICAgZG9jdW1lbnQsIG51bGwsIFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9TTkFQU0hPVF9UWVBFLCBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHhwYXRoUmVzdWx0LnNuYXBzaG90TGVuZ3RoICYmIGkgPCAyMDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IHhwYXRoUmVzdWx0LnNuYXBzaG90SXRlbShpKTtcbiAgICAgICAgICAgIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmICFjYW5kaWRhdGVzLnNvbWUoKGMpID0+IGMuZWxlbWVudCA9PT0gZWwpKSB7XG4gICAgICAgICAgICAgIGFkZENhbmRpZGF0ZShlbCwgJ3hwYXRoLWZhbGxiYWNrJywgNTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgfVxuXG4gICAgICBpZiAoY2FuZGlkYXRlcy5sZW5ndGggPT09IDAgJiYgdGV4dExvd2VyLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBzYWZlVGV4dCA9IHRleHRMb3dlci5yZXBsYWNlKC9bJ1wiXS9nLCAnJyk7XG4gICAgICAgICAgY29uc3QgcGFydGlhbFhwYXRoID0gZG9jdW1lbnQuZXZhbHVhdGUoXG4gICAgICAgICAgICBgLy8qW2NvbnRhaW5zKHRyYW5zbGF0ZShAYXJpYS1sYWJlbCwgJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJywgJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JyksICcke3NhZmVUZXh0fScpXWAsXG4gICAgICAgICAgICBkb2N1bWVudCwgbnVsbCwgWFBhdGhSZXN1bHQuT1JERVJFRF9OT0RFX1NOQVBTSE9UX1RZUEUsIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGlhbFhwYXRoLnNuYXBzaG90TGVuZ3RoICYmIGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IHBhcnRpYWxYcGF0aC5zbmFwc2hvdEl0ZW0oaSk7XG4gICAgICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhY2FuZGlkYXRlcy5zb21lKChjKSA9PiBjLmVsZW1lbnQgPT09IGVsKSkge1xuICAgICAgICAgICAgICBhZGRDYW5kaWRhdGUoZWwsICdhcmlhLWxhYmVsLXhwYXRoJywgNDUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgfVxuXG4gICAgICBjYW5kaWRhdGVzLnNvcnQoKGEsIGIpID0+IGIuY29uZmlkZW5jZSAtIGEuY29uZmlkZW5jZSk7XG4gICAgICByZXR1cm4gY2FuZGlkYXRlc1swXSB8fCBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IEhJR0hMSUdIVF9TVFlMRV9JRCA9ICd3Zy1oaWdobGlnaHQtc3R5bGUnO1xuXG4gICAgZnVuY3Rpb24gaW5qZWN0SGlnaGxpZ2h0U3R5bGVzKCkge1xuICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEhJR0hMSUdIVF9TVFlMRV9JRCkpIHJldHVybjtcbiAgICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHN0eWxlLmlkID0gSElHSExJR0hUX1NUWUxFX0lEO1xuICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBgXG4gICAgICAgIEBrZXlmcmFtZXMgd2ctZ2xvdy1wdWxzZSB7XG4gICAgICAgICAgMCUsIDEwMCUgeyBib3gtc2hhZG93OiAwIDAgNXB4IHJnYmEoOTksMTAyLDI0MSwwLjQpLCAwIDAgMTBweCByZ2JhKDk5LDEwMiwyNDEsMC4yKTsgfVxuICAgICAgICAgIDUwJSB7IGJveC1zaGFkb3c6IDAgMCAxNXB4IHJnYmEoOTksMTAyLDI0MSwwLjgpLCAwIDAgMzBweCByZ2JhKDk5LDEwMiwyNDEsMC40KSwgMCAwIDQ1cHggcmdiYSg5OSwxMDIsMjQxLDAuMik7IH1cbiAgICAgICAgfVxuICAgICAgICBAa2V5ZnJhbWVzIHdnLWJvdW5jZS1hcnJvdyB7XG4gICAgICAgICAgMCUsIDEwMCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7IH1cbiAgICAgICAgICA1MCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTZweCk7IH1cbiAgICAgICAgfVxuICAgICAgICAud2ctaGlnaGxpZ2h0LW92ZXJsYXkge1xuICAgICAgICAgIHBvc2l0aW9uOiBmaXhlZCAhaW1wb3J0YW50O1xuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgei1pbmRleDogMjE0NzQ4MzY0NiAhaW1wb3J0YW50O1xuICAgICAgICAgIGJvcmRlcjogM3B4IHNvbGlkICM2MzY2ZjEgIWltcG9ydGFudDtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA2cHggIWltcG9ydGFudDtcbiAgICAgICAgICBhbmltYXRpb246IHdnLWdsb3ctcHVsc2UgMS41cyBlYXNlLWluLW91dCBpbmZpbml0ZSAhaW1wb3J0YW50O1xuICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjE1cyBlYXNlICFpbXBvcnRhbnQ7XG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSg5OSwxMDIsMjQxLDAuMDgpICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLndnLWhpZ2hsaWdodC1hcnJvdyB7XG4gICAgICAgICAgcG9zaXRpb246IGZpeGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgei1pbmRleDogMjE0NzQ4MzY0NyAhaW1wb3J0YW50O1xuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgYW5pbWF0aW9uOiB3Zy1ib3VuY2UtYXJyb3cgMXMgZWFzZS1pbi1vdXQgaW5maW5pdGUgIWltcG9ydGFudDtcbiAgICAgICAgICBjb2xvcjogIzYzNjZmMSAhaW1wb3J0YW50O1xuICAgICAgICAgIGZvbnQtc2l6ZTogMjhweCAhaW1wb3J0YW50O1xuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxICFpbXBvcnRhbnQ7XG4gICAgICAgICAgdGV4dC1zaGFkb3c6IDAgMnB4IDhweCByZ2JhKDk5LDEwMiwyNDEsMC41KSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIC53Zy1oaWdobGlnaHQtdG9vbHRpcCB7XG4gICAgICAgICAgcG9zaXRpb246IGZpeGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgei1pbmRleDogMjE0NzQ4MzY0NyAhaW1wb3J0YW50O1xuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgYmFja2dyb3VuZDogIzRmNDZlNSAhaW1wb3J0YW50O1xuICAgICAgICAgIGNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDAgIWltcG9ydGFudDtcbiAgICAgICAgICBwYWRkaW5nOiA0cHggMTJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDZweCAhaW1wb3J0YW50O1xuICAgICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSg3OSw3MCwyMjksMC40KSAhaW1wb3J0YW50O1xuICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXAgIWltcG9ydGFudDtcbiAgICAgICAgICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAnU2Vnb2UgVUknLCBSb2JvdG8sIHNhbnMtc2VyaWYgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICAud2ctaGlnaGxpZ2h0LXRvb2x0aXA6OmFmdGVyIHtcbiAgICAgICAgICBjb250ZW50OiAnJyAhaW1wb3J0YW50O1xuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZSAhaW1wb3J0YW50O1xuICAgICAgICAgIHRvcDogMTAwJSAhaW1wb3J0YW50O1xuICAgICAgICAgIGxlZnQ6IDUwJSAhaW1wb3J0YW50O1xuICAgICAgICAgIG1hcmdpbi1sZWZ0OiAtNXB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgYm9yZGVyOiA1cHggc29saWQgdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgICBib3JkZXItdG9wLWNvbG9yOiAjNGY0NmU1ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgIGA7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckhpZ2hsaWdodHMoKSB7XG4gICAgICBpZiAocmV0cnlUaW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dChyZXRyeVRpbWVvdXQpO1xuICAgICAgICByZXRyeVRpbWVvdXQgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRIaWdobGlnaHRFbGVtZW50KSB7XG4gICAgICAgIGN1cnJlbnRIaWdobGlnaHRFbGVtZW50LnN0eWxlLm91dGxpbmUgPSAnJztcbiAgICAgICAgY3VycmVudEhpZ2hsaWdodEVsZW1lbnQuc3R5bGUub3V0bGluZU9mZnNldCA9ICcnO1xuICAgICAgICBjdXJyZW50SGlnaGxpZ2h0RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICAgICAgICBjdXJyZW50SGlnaGxpZ2h0RWxlbWVudC5zdHlsZS56SW5kZXggPSAnJztcbiAgICAgICAgY3VycmVudEhpZ2hsaWdodEVsZW1lbnQgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKGNsaWNrRGlzbWlzc0xpc3RlbmVyKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tEaXNtaXNzTGlzdGVuZXIsIHRydWUpO1xuICAgICAgICBjbGlja0Rpc21pc3NMaXN0ZW5lciA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoaGlnaGxpZ2h0UG9zaXRpb25VcGRhdGVyKSB7XG4gICAgICAgIGhpZ2hsaWdodFBvc2l0aW9uVXBkYXRlcigpO1xuICAgICAgICBoaWdobGlnaHRQb3NpdGlvblVwZGF0ZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndnLWhpZ2hsaWdodC1vdmVybGF5LCAud2ctaGlnaGxpZ2h0LWFycm93LCAud2ctaGlnaGxpZ2h0LXRvb2x0aXAnKS5mb3JFYWNoKChlbCkgPT4gZWwucmVtb3ZlKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dTbWFydEhpZ2hsaWdodChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgY2xlYXJIaWdobGlnaHRzKCk7XG4gICAgICBpbmplY3RIaWdobGlnaHRTdHlsZXMoKTtcblxuICAgICAgY3VycmVudEhpZ2hsaWdodEVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gJzNweCBzb2xpZCAjNjM2NmYxJztcbiAgICAgIGVsZW1lbnQuc3R5bGUub3V0bGluZU9mZnNldCA9ICcycHgnO1xuICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9ICcyMTQ3NDgzNjQ1JztcblxuICAgICAgZWxlbWVudC5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInIH0pO1xuXG4gICAgICBjb25zdCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHNjcm9sbFggPSB3aW5kb3cuc2Nyb2xsWCB8fCB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgICBjb25zdCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xuXG4gICAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBvdmVybGF5LmNsYXNzTmFtZSA9ICd3Zy1oaWdobGlnaHQtb3ZlcmxheSc7XG4gICAgICBvdmVybGF5LnN0eWxlLnRvcCA9IGAke3JlY3QudG9wICsgc2Nyb2xsWSAtIDR9cHhgO1xuICAgICAgb3ZlcmxheS5zdHlsZS5sZWZ0ID0gYCR7cmVjdC5sZWZ0ICsgc2Nyb2xsWCAtIDR9cHhgO1xuICAgICAgb3ZlcmxheS5zdHlsZS53aWR0aCA9IGAke3JlY3Qud2lkdGggKyA4fXB4YDtcbiAgICAgIG92ZXJsYXkuc3R5bGUuaGVpZ2h0ID0gYCR7cmVjdC5oZWlnaHQgKyA4fXB4YDtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XG5cbiAgICAgIGNvbnN0IGFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBhcnJvdy5jbGFzc05hbWUgPSAnd2ctaGlnaGxpZ2h0LWFycm93JztcbiAgICAgIGFycm93LnRleHRDb250ZW50ID0gJ/CfkYYnO1xuICAgICAgYXJyb3cuc3R5bGUudG9wID0gYCR7cmVjdC50b3AgKyBzY3JvbGxZIC0gNDB9cHhgO1xuICAgICAgYXJyb3cuc3R5bGUubGVmdCA9IGAke3JlY3QubGVmdCArIHNjcm9sbFggKyByZWN0LndpZHRoIC8gMiAtIDE0fXB4YDtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYXJyb3cpO1xuXG4gICAgICBjb25zdCB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0b29sdGlwLmNsYXNzTmFtZSA9ICd3Zy1oaWdobGlnaHQtdG9vbHRpcCc7XG4gICAgICB0b29sdGlwLnRleHRDb250ZW50ID0gJ05leHQgU3RlcCc7XG4gICAgICB0b29sdGlwLnN0eWxlLnRvcCA9IGAke3JlY3QudG9wICsgc2Nyb2xsWSAtIDcwfXB4YDtcbiAgICAgIHRvb2x0aXAuc3R5bGUubGVmdCA9IGAke3JlY3QubGVmdCArIHNjcm9sbFggKyByZWN0LndpZHRoIC8gMiAtIDM1fXB4YDtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XG5cbiAgICAgIGNvbnN0IHVwZGF0ZVBvc2l0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgciA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUudG9wID0gYCR7ci50b3AgKyB3aW5kb3cuc2Nyb2xsWSAtIDR9cHhgO1xuICAgICAgICBvdmVybGF5LnN0eWxlLmxlZnQgPSBgJHtyLmxlZnQgKyB3aW5kb3cuc2Nyb2xsWCAtIDR9cHhgO1xuICAgICAgICBvdmVybGF5LnN0eWxlLndpZHRoID0gYCR7ci53aWR0aCArIDh9cHhgO1xuICAgICAgICBvdmVybGF5LnN0eWxlLmhlaWdodCA9IGAke3IuaGVpZ2h0ICsgOH1weGA7XG4gICAgICAgIGFycm93LnN0eWxlLnRvcCA9IGAke3IudG9wICsgd2luZG93LnNjcm9sbFkgLSA0MH1weGA7XG4gICAgICAgIGFycm93LnN0eWxlLmxlZnQgPSBgJHtyLmxlZnQgKyB3aW5kb3cuc2Nyb2xsWCArIHIud2lkdGggLyAyIC0gMTR9cHhgO1xuICAgICAgICB0b29sdGlwLnN0eWxlLnRvcCA9IGAke3IudG9wICsgd2luZG93LnNjcm9sbFkgLSA3MH1weGA7XG4gICAgICAgIHRvb2x0aXAuc3R5bGUubGVmdCA9IGAke3IubGVmdCArIHdpbmRvdy5zY3JvbGxYICsgci53aWR0aCAvIDIgLSAzNX1weGA7XG4gICAgICB9O1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlUG9zaXRpb25zLCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlUG9zaXRpb25zLCB7IHBhc3NpdmU6IHRydWUgfSk7XG5cbiAgICAgIGNvbnN0IHBvc2l0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB1cGRhdGVQb3NpdGlvbnMoKSk7XG4gICAgICBwb3NpdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgeyBhdHRyaWJ1dGVzOiB0cnVlLCBhdHRyaWJ1dGVGaWx0ZXI6IFsnc3R5bGUnLCAnY2xhc3MnXSwgc3VidHJlZTogdHJ1ZSB9KTtcblxuICAgICAgaGlnaGxpZ2h0UG9zaXRpb25VcGRhdGVyID0gKCkgPT4ge1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlUG9zaXRpb25zKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZVBvc2l0aW9ucyk7XG4gICAgICAgIHBvc2l0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgfTtcblxuICAgICAgY2xpY2tEaXNtaXNzTGlzdGVuZXIgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgaWYgKGVsZW1lbnQuY29udGFpbnModGFyZ2V0KSB8fCB0YXJnZXQgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICBjbGVhckhpZ2hsaWdodHMoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tEaXNtaXNzTGlzdGVuZXIsIHRydWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZUhpZ2hsaWdodFJlcXVlc3QodGFyZ2V0OiBIaWdobGlnaHRUYXJnZXQpOiB7IHN1Y2Nlc3M6IGJvb2xlYW47IHNlbGVjdG9yPzogc3RyaW5nOyBjb25maWRlbmNlPzogbnVtYmVyOyBlcnJvcj86IHN0cmluZyB9IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZpbmRFbGVtZW50U21hcnQodGFyZ2V0KTtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIGNsZWFySGlnaGxpZ2h0cygpO1xuICAgICAgICBjb25zb2xlLndhcm4oYFtXZWJHdWlkZXJdIENvdWxkIG5vdCBmaW5kIGVsZW1lbnQgbWF0Y2hpbmcgXCIke3RhcmdldC50ZXh0fVwiIChyb2xlOiAke3RhcmdldC5yb2xlIHx8ICdhbnknfSwgdHlwZTogJHt0YXJnZXQuZWxlbWVudFR5cGUgfHwgJ2FueSd9KSDigJQgbm8gY2FuZGlkYXRlcyBmb3VuZGApO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBDb3VsZCBub3QgZmluZCBlbGVtZW50IG1hdGNoaW5nIFwiJHt0YXJnZXQudGV4dH1cIiBvbiB0aGUgcGFnZS5gIH07XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0LmNvbmZpZGVuY2UgPCAyNSkge1xuICAgICAgICBjbGVhckhpZ2hsaWdodHMoKTtcbiAgICAgICAgY29uc29sZS53YXJuKGBbV2ViR3VpZGVyXSBDb3VsZCBub3QgZmluZCBlbGVtZW50IG1hdGNoaW5nIFwiJHt0YXJnZXQudGV4dH1cIiDigJQgYmVzdCBjYW5kaWRhdGUgY29uZmlkZW5jZSAke3Jlc3VsdC5jb25maWRlbmNlfSAoJHtyZXN1bHQuc3RyYXRlZ3l9KSBiZWxvdyB0aHJlc2hvbGRgKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgQ291bGQgbm90IHJlbGlhYmx5IGZpbmQgXCIke3RhcmdldC50ZXh0fVwiIG9uIHRoZSBwYWdlIChjb25maWRlbmNlIHRvbyBsb3c6ICR7cmVzdWx0LmNvbmZpZGVuY2V9JSkuYCB9O1xuICAgICAgfVxuICAgICAgc2hvd1NtYXJ0SGlnaGxpZ2h0KHJlc3VsdC5lbGVtZW50KTtcbiAgICAgIGNvbnNvbGUubG9nKGBbV2ViR3VpZGVyXSBIaWdobGlnaHRlZCBcIiR7dGFyZ2V0LnRleHR9XCIg4oaSIGZvdW5kIHZpYSAke3Jlc3VsdC5zdHJhdGVneX0gKGNvbmZpZGVuY2U6ICR7cmVzdWx0LmNvbmZpZGVuY2V9JSlgKTtcbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHNlbGVjdG9yOiByZXN1bHQuc2VsZWN0b3IsIGNvbmZpZGVuY2U6IHJlc3VsdC5jb25maWRlbmNlIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlSGlnaGxpZ2h0V2l0aFJldHJ5KHRhcmdldDogSGlnaGxpZ2h0VGFyZ2V0LCBhdHRlbXB0OiBudW1iZXIgPSAwKTogeyBzdWNjZXNzOiBib29sZWFuOyBzZWxlY3Rvcj86IHN0cmluZzsgY29uZmlkZW5jZT86IG51bWJlcjsgZXJyb3I/OiBzdHJpbmcgfSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBoYW5kbGVIaWdobGlnaHRSZXF1ZXN0KHRhcmdldCk7XG4gICAgICBpZiAoIXJlc3VsdC5zdWNjZXNzICYmIGF0dGVtcHQgPCAyKSB7XG4gICAgICAgIGNvbnN0IGZhbGxiYWNrVGFyZ2V0ID0geyAuLi50YXJnZXQgfTtcbiAgICAgICAgaWYgKGF0dGVtcHQgPT09IDApIHtcbiAgICAgICAgICBmYWxsYmFja1RhcmdldC50ZXh0ID0gdGFyZ2V0LnRleHQ7XG4gICAgICAgICAgZmFsbGJhY2tUYXJnZXQucm9sZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIGlmIChhdHRlbXB0ID09PSAxKSB7XG4gICAgICAgICAgY29uc3Qgd29yZHMgPSB0YXJnZXQudGV4dC5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgIGlmICh3b3Jkcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBmYWxsYmFja1RhcmdldC50ZXh0ID0gd29yZHNbd29yZHMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHJ5VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGhhbmRsZUhpZ2hsaWdodFdpdGhSZXRyeShmYWxsYmFja1RhcmdldCwgYXR0ZW1wdCArIDEpO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBSZXRyeWluZyB3aXRoIGZhbGxiYWNrIHN0cmF0ZWd5IChhdHRlbXB0ICR7YXR0ZW1wdCArIDF9KS4uLmAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRNdXRhdGlvbldhdGNoaW5nKCkge1xuICAgICAgaWYgKG9ic2VydmVyKSBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgaWYgKCFwYWdlTG9hZGVkKSByZXR1cm47XG4gICAgICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdQQUdFX0NIQU5HRUQnIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIH0pO1xuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwge1xuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydjbGFzcycsICdzdHlsZScsICdhcmlhLWhpZGRlbicsICdyb2xlJ10sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydFVybFdhdGNoaW5nKCkge1xuICAgICAgbGV0IHByZXZpb3VzVXJsID0gbG9jYXRpb24uaHJlZjtcbiAgICAgIGNvbnN0IGNoZWNrSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmIChsb2NhdGlvbi5ocmVmICE9PSBwcmV2aW91c1VybCkge1xuICAgICAgICAgIHByZXZpb3VzVXJsID0gbG9jYXRpb24uaHJlZjtcbiAgICAgICAgICBsYXN0VXJsID0gbG9jYXRpb24uaHJlZjtcbiAgICAgICAgICBjbGVhckhpZ2hsaWdodHMoKTtcbiAgICAgICAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnVVJMX0NIQU5HRUQnLCB1cmw6IGxvY2F0aW9uLmhyZWYgfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICB9XG4gICAgICB9LCA1MDApO1xuICAgICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICBpZiAobG9jYXRpb24uaHJlZiAhPT0gcHJldmlvdXNVcmwpIHtcbiAgICAgICAgICBwcmV2aW91c1VybCA9IGxvY2F0aW9uLmhyZWY7XG4gICAgICAgICAgbGFzdFVybCA9IGxvY2F0aW9uLmhyZWY7XG4gICAgICAgICAgY2xlYXJIaWdobGlnaHRzKCk7XG4gICAgICAgICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ1VSTF9DSEFOR0VEJywgdXJsOiBsb2NhdGlvbi5ocmVmIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgfVxuICAgICAgfSkub2JzZXJ2ZShkb2N1bWVudCwgeyBzdWJ0cmVlOiB0cnVlLCBjaGlsZExpc3Q6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZTogYW55LCBfc2VuZGVyOiBhbnksIHNlbmRSZXNwb25zZTogYW55KSA9PiB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlICdBTkFMWVpFX1BBR0UnOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoYW5hbHl6ZVBhZ2UoKSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbV2ViR3VpZGVyXSBBTkFMWVpFX1BBR0UgZmFpbGVkOicsIGVycik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBlcnJvcjogU3RyaW5nKGVycikgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdISUdITElHSFRfU1RFUCc6XG4gICAgICAgICAgaWYgKG1lc3NhZ2Uuc3RlcD8uc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihtZXNzYWdlLnN0ZXAuc2VsZWN0b3IpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgaWYgKGVsKSBzaG93U21hcnRIaWdobGlnaHQoZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdISUdITElHSFRfU0VMRUNUT1InOlxuICAgICAgICAgIGlmIChtZXNzYWdlLnNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IobWVzc2FnZS5zZWxlY3RvcikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgICAgc2hvd1NtYXJ0SGlnaGxpZ2h0KGVsKTtcbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ1NlbGVjdG9yIGRpZCBub3QgbWF0Y2ggYW55IGVsZW1lbnQnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdObyBzZWxlY3RvciBwcm92aWRlZCcgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdGSU5EX0FORF9ISUdITElHSFQnOlxuICAgICAgICAgIGlmIChtZXNzYWdlLnRhcmdldCkge1xuICAgICAgICAgICAgY29uc3QgaGxSZXN1bHQgPSBoYW5kbGVIaWdobGlnaHRXaXRoUmV0cnkobWVzc2FnZS50YXJnZXQgYXMgSGlnaGxpZ2h0VGFyZ2V0KTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZShobFJlc3VsdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ05vIHRhcmdldCBwcm92aWRlZCcgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdTVE9QX0dVSURFJzpcbiAgICAgICAgICBjbGVhckhpZ2hsaWdodHMoKTtcbiAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdHRVRfUEFHRV9JTkZPJzpcbiAgICAgICAgICBzZW5kUmVzcG9uc2UoeyB1cmw6IGxvY2F0aW9uLmhyZWYsIHRpdGxlOiBkb2N1bWVudC50aXRsZSwgZG9tYWluOiBsb2NhdGlvbi5ob3N0bmFtZSB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBlcnJvcjogJ1Vua25vd24gbWVzc2FnZSB0eXBlOiAnICsgbWVzc2FnZS50eXBlIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBvblJlYWR5KCkge1xuICAgICAgcGFnZUxvYWRlZCA9IHRydWU7XG4gICAgICBzdGFydE11dGF0aW9uV2F0Y2hpbmcoKTtcbiAgICAgIHN0YXJ0VXJsV2F0Y2hpbmcoKTtcbiAgICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdDT05URU5UX1NDUklQVF9SRUFEWScsIHVybDogbG9jYXRpb24uaHJlZiB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIG9uUmVhZHkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvblJlYWR5KCk7XG4gICAgfVxuICB9LFxufSk7XG4iLCJpbXBvcnQge1xuICBicm93c2VyXG59IGZyb20gXCIuL2NodW5rLUZOVEUyTDI3LmpzXCI7XG5cbi8vIHNyYy9zYW5kYm94L3V0aWxzL2xvZ2dlci50c1xuZnVuY3Rpb24gcHJpbnQobWV0aG9kLCAuLi5hcmdzKSB7XG4gIGlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gXCJwcm9kdWN0aW9uXCIpXG4gICAgcmV0dXJuO1xuICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXJncy5zaGlmdCgpO1xuICAgIG1ldGhvZChgW3d4dF0gJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xuICB9XG59XG52YXIgbG9nZ2VyID0ge1xuICBkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuICBsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG4gIHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuXG4vLyBzcmMvY2xpZW50L2NvbnRlbnQtc2NyaXB0cy9jdXN0b20tZXZlbnRzLnRzXG52YXIgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCA9IGNsYXNzIF9XeHRMb2NhdGlvbkNoYW5nZUV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICBjb25zdHJ1Y3RvcihuZXdVcmwsIG9sZFVybCkge1xuICAgIHN1cGVyKF9XeHRMb2NhdGlvbkNoYW5nZUV2ZW50LkVWRU5UX05BTUUsIHt9KTtcbiAgICB0aGlzLm5ld1VybCA9IG5ld1VybDtcbiAgICB0aGlzLm9sZFVybCA9IG9sZFVybDtcbiAgfVxuICBzdGF0aWMgRVZFTlRfTkFNRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpsb2NhdGlvbmNoYW5nZVwiKTtcbn07XG5mdW5jdGlvbiBnZXRVbmlxdWVFdmVudE5hbWUoZXZlbnROYW1lKSB7XG4gIGNvbnN0IGVudHJ5cG9pbnROYW1lID0gdHlwZW9mIGltcG9ydC5tZXRhLmVudiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwiYnVpbGRcIiA6IGltcG9ydC5tZXRhLmVudi5FTlRSWVBPSU5UO1xuICByZXR1cm4gYCR7YnJvd3Nlci5ydW50aW1lLmlkfToke2VudHJ5cG9pbnROYW1lfToke2V2ZW50TmFtZX1gO1xufVxuXG4vLyBzcmMvY2xpZW50L2NvbnRlbnQtc2NyaXB0cy9sb2NhdGlvbi13YXRjaGVyLnRzXG5mdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG4gIGxldCBpbnRlcnZhbDtcbiAgbGV0IG9sZFVybDtcbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBFbnN1cmUgdGhlIGxvY2F0aW9uIHdhdGNoZXIgaXMgYWN0aXZlbHkgbG9va2luZyBmb3IgVVJMIGNoYW5nZXMuIElmIGl0J3MgYWxyZWFkeSB3YXRjaGluZyxcbiAgICAgKiB0aGlzIGlzIGEgbm9vcC5cbiAgICAgKi9cbiAgICBydW4oKSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgIT0gbnVsbClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgb2xkVXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICAgIGludGVydmFsID0gY3R4LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IG5ld1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG4gICAgICAgIGlmIChuZXdVcmwuaHJlZiAhPT0gb2xkVXJsLmhyZWYpIHtcbiAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgV3h0TG9jYXRpb25DaGFuZ2VFdmVudChuZXdVcmwsIG9sZFVybCkpO1xuICAgICAgICAgIG9sZFVybCA9IG5ld1VybDtcbiAgICAgICAgfVxuICAgICAgfSwgMWUzKTtcbiAgICB9XG4gIH07XG59XG5cbi8vIHNyYy9jbGllbnQvY29udGVudC1zY3JpcHRzL2NvbnRlbnQtc2NyaXB0LWNvbnRleHQudHNcbnZhciBDb250ZW50U2NyaXB0Q29udGV4dCA9IGNsYXNzIF9Db250ZW50U2NyaXB0Q29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRlbnRTY3JpcHROYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5jb250ZW50U2NyaXB0TmFtZSA9IGNvbnRlbnRTY3JpcHROYW1lO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy4jYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgIGlmICh0aGlzLiNpc1RvcEZyYW1lKSB7XG4gICAgICB0aGlzLiNzdG9wT2xkU2NyaXB0cygpO1xuICAgIH1cbiAgICB0aGlzLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy4jbGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCk7XG4gICAgfSk7XG4gIH1cbiAgc3RhdGljIFNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSA9IFwid3h0OmNvbnRlbnQtc2NyaXB0LXN0YXJ0ZWRcIjtcbiAgI2lzVG9wRnJhbWUgPSB3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcDtcbiAgI2Fib3J0Q29udHJvbGxlcjtcbiAgI2xvY2F0aW9uV2F0Y2hlciA9IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcih0aGlzKTtcbiAgZ2V0IHNpZ25hbCgpIHtcbiAgICByZXR1cm4gdGhpcy4jYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcbiAgfVxuICBhYm9ydChyZWFzb24pIHtcbiAgICByZXR1cm4gdGhpcy4jYWJvcnRDb250cm9sbGVyLmFib3J0KHJlYXNvbik7XG4gIH1cbiAgZ2V0IGlzSW52YWxpZCgpIHtcbiAgICBpZiAoYnJvd3Nlci5ydW50aW1lLmlkID09IG51bGwpIHtcbiAgICAgIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2lnbmFsLmFib3J0ZWQ7XG4gIH1cbiAgZ2V0IGlzVmFsaWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzSW52YWxpZDtcbiAgfVxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBzY3JpcHQncyBjb250ZXh0IGlzIGludmFsaWRhdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2IpO1xuICAgKiBjb25zdCByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyID0gY3R4Lm9uSW52YWxpZGF0ZWQoKCkgPT4ge1xuICAgKiAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIoY2IpO1xuICAgKiB9KVxuICAgKiAvLyAuLi5cbiAgICogcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lcigpO1xuICAgKi9cbiAgb25JbnZhbGlkYXRlZChjYikge1xuICAgIHRoaXMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybiBhIHByb21pc2UgdGhhdCBuZXZlciByZXNvbHZlcy4gVXNlZnVsIGlmIHlvdSBoYXZlIGFuIGFzeW5jIGZ1bmN0aW9uIHRoYXQgc2hvdWxkbid0IHJ1blxuICAgKiBhZnRlciB0aGUgY29udGV4dCBpcyBleHBpcmVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBnZXRWYWx1ZUZyb21TdG9yYWdlID0gYXN5bmMgKCkgPT4ge1xuICAgKiAgIGlmIChjdHguaXNJbnZhbGlkKSByZXR1cm4gY3R4LmJsb2NrKCk7XG4gICAqXG4gICAqICAgLy8gLi4uXG4gICAqIH1cbiAgICovXG4gIGJsb2NrKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0SW50ZXJ2YWxgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsIHdoZW4gaW52YWxpZGF0ZWQuXG4gICAqL1xuICBzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG4gICAgY29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKVxuICAgICAgICBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0VGltZW91dGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWwgd2hlbiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHNldFRpbWVvdXQoaGFuZGxlciwgdGltZW91dCkge1xuICAgIGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKVxuICAgICAgICBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFyVGltZW91dChpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqL1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcbiAgICBjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZClcbiAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgfSk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqL1xuICByZXF1ZXN0SWRsZUNhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgY29uc3QgaWQgPSByZXF1ZXN0SWRsZUNhbGxiYWNrKCguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc2lnbmFsLmFib3J0ZWQpXG4gICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgIH0sIG9wdGlvbnMpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxJZGxlQ2FsbGJhY2soaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIENhbGwgYHRhcmdldC5hZGRFdmVudExpc3RlbmVyYCBhbmQgcmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lciB3aGVuIHRoZSBjb250ZXh0IGlzIGludmFsaWRhdGVkLlxuICAgKlxuICAgKiBJbmNsdWRlcyBhZGRpdGlvbmFsIGV2ZW50cyB1c2VmdWwgZm9yIGNvbnRlbnQgc2NyaXB0czpcbiAgICpcbiAgICogLSBgXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcImAgLSBUcmlnZ2VyZWQgd2hlbiBIVE1MNSBoaXN0b3J5IG1vZGUgaXMgdXNlZCB0byBjaGFuZ2UgVVJMLiBDb250ZW50XG4gICAqICAgc2NyaXB0cyBhcmUgbm90IHJlbG9hZGVkIHdoZW4gbmF2aWdhdGluZyB0aGlzIHdheSwgc28gdGhpcyBjYW4gYmUgdXNlZCB0byByZXNldCB0aGUgY29udGVudFxuICAgKiAgIHNjcmlwdCBzdGF0ZSBvbiBVUkwgY2hhbmdlLCBvciBydW4gY3VzdG9tIGNvZGUuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGN0eC5hZGRFdmVudExpc3RlbmVyKGRvY3VtZW50LCBcInZpc2liaWxpdHljaGFuZ2VcIiwgKCkgPT4ge1xuICAgKiAgIC8vIC4uLlxuICAgKiB9KTtcbiAgICogY3R4LmFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsIFwid3h0OmxvY2F0aW9uY2hhbmdlXCIsICgpID0+IHtcbiAgICogICAvLyAuLi5cbiAgICogfSk7XG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlID09PSBcInd4dDpsb2NhdGlvbmNoYW5nZVwiKSB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKVxuICAgICAgICB0aGlzLiNsb2NhdGlvbldhdGNoZXIucnVuKCk7XG4gICAgfVxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyPy4oXG4gICAgICB0eXBlLnN0YXJ0c1dpdGgoXCJ3eHQ6XCIpID8gZ2V0VW5pcXVlRXZlbnROYW1lKHR5cGUpIDogdHlwZSxcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3I6IEV2ZW50IGRvbid0IG1hdGNoLCBidXQgdGhhdCdzIE9LLCBFdmVudFRhcmdldCBkb2Vzbid0IGFsbG93IGN1c3RvbSB0eXBlcyBpbiB0aGUgY2FsbGJhY2tcbiAgICAgIGhhbmRsZXIsXG4gICAgICB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHNpZ25hbDogdGhpcy5zaWduYWxcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQWJvcnQgdGhlIGFib3J0IGNvbnRyb2xsZXIgYW5kIGV4ZWN1dGUgYWxsIGBvbkludmFsaWRhdGVkYCBsaXN0ZW5lcnMuXG4gICAqL1xuICBub3RpZnlJbnZhbGlkYXRlZCgpIHtcbiAgICB0aGlzLmFib3J0KFwiQ29udGVudCBzY3JpcHQgY29udGV4dCBpbnZhbGlkYXRlZFwiKTtcbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICBgQ29udGVudCBzY3JpcHQgXCIke3RoaXMuY29udGVudFNjcmlwdE5hbWV9XCIgY29udGV4dCBpbnZhbGlkYXRlZGBcbiAgICApO1xuICB9XG4gICNzdG9wT2xkU2NyaXB0cygpIHtcbiAgICB3aW5kb3cucG9zdE1lc3NhZ2UoXG4gICAgICB7XG4gICAgICAgIGV2ZW50OiBfQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLFxuICAgICAgICBjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZVxuICAgICAgfSxcbiAgICAgIFwiKlwiXG4gICAgKTtcbiAgfVxuICAjbGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCkge1xuICAgIGNvbnN0IGNiID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQuZGF0YT8udHlwZSA9PT0gX0NvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSAmJiBldmVudC5kYXRhPy5jb250ZW50U2NyaXB0TmFtZSA9PT0gdGhpcy5jb250ZW50U2NyaXB0TmFtZSkge1xuICAgICAgICB0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBhZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBjYik7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IHJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGNiKSk7XG4gIH1cbn07XG5cbi8vIHNyYy9jbGllbnQvY29udGVudC1zY3JpcHRzL3VpL2luZGV4LnRzXG5pbXBvcnQgeyBjcmVhdGVJc29sYXRlZEVsZW1lbnQgfSBmcm9tIFwiQHdlYmV4dC1jb3JlL2lzb2xhdGVkLWVsZW1lbnRcIjtcbmZ1bmN0aW9uIGNyZWF0ZUludGVncmF0ZWRVaShjdHgsIG9wdGlvbnMpIHtcbiAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQob3B0aW9ucy50YWcgfHwgXCJkaXZcIik7XG4gIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwiZGF0YS13eHQtaW50ZWdyYXRlZFwiLCBcIlwiKTtcbiAgbGV0IG1vdW50ZWQgPSB2b2lkIDA7XG4gIGNvbnN0IG1vdW50ID0gKCkgPT4ge1xuICAgIGFwcGx5UG9zaXRpb24od3JhcHBlciwgdm9pZCAwLCBvcHRpb25zKTtcbiAgICBtb3VudFVpKHdyYXBwZXIsIG9wdGlvbnMpO1xuICAgIG1vdW50ZWQgPSBvcHRpb25zLm9uTW91bnQ/Lih3cmFwcGVyKTtcbiAgfTtcbiAgY29uc3QgcmVtb3ZlID0gKCkgPT4ge1xuICAgIG9wdGlvbnMub25SZW1vdmU/Lihtb3VudGVkKTtcbiAgICB3cmFwcGVyLnJlbW92ZSgpO1xuICAgIG1vdW50ZWQgPSB2b2lkIDA7XG4gIH07XG4gIGN0eC5vbkludmFsaWRhdGVkKHJlbW92ZSk7XG4gIHJldHVybiB7XG4gICAgZ2V0IG1vdW50ZWQoKSB7XG4gICAgICByZXR1cm4gbW91bnRlZDtcbiAgICB9LFxuICAgIHdyYXBwZXIsXG4gICAgbW91bnQsXG4gICAgcmVtb3ZlXG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVJZnJhbWVVaShjdHgsIG9wdGlvbnMpIHtcbiAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwiZGF0YS13eHQtaWZyYW1lXCIsIFwiXCIpO1xuICBjb25zdCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO1xuICBpZnJhbWUuc3JjID0gYnJvd3Nlci5ydW50aW1lLmdldFVSTChvcHRpb25zLnBhZ2UpO1xuICB3cmFwcGVyLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGxldCBtb3VudGVkID0gdm9pZCAwO1xuICBjb25zdCBtb3VudCA9ICgpID0+IHtcbiAgICBhcHBseVBvc2l0aW9uKHdyYXBwZXIsIGlmcmFtZSwgb3B0aW9ucyk7XG4gICAgbW91bnRVaSh3cmFwcGVyLCBvcHRpb25zKTtcbiAgICBtb3VudGVkID0gb3B0aW9ucy5vbk1vdW50Py4od3JhcHBlciwgaWZyYW1lKTtcbiAgfTtcbiAgY29uc3QgcmVtb3ZlID0gKCkgPT4ge1xuICAgIG9wdGlvbnMub25SZW1vdmU/Lihtb3VudGVkKTtcbiAgICB3cmFwcGVyLnJlbW92ZSgpO1xuICAgIG1vdW50ZWQgPSB2b2lkIDA7XG4gIH07XG4gIGN0eC5vbkludmFsaWRhdGVkKHJlbW92ZSk7XG4gIHJldHVybiB7XG4gICAgZ2V0IG1vdW50ZWQoKSB7XG4gICAgICByZXR1cm4gbW91bnRlZDtcbiAgICB9LFxuICAgIGlmcmFtZSxcbiAgICB3cmFwcGVyLFxuICAgIG1vdW50LFxuICAgIHJlbW92ZVxuICB9O1xufVxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2hhZG93Um9vdFVpKGN0eCwgb3B0aW9ucykge1xuICBjb25zdCBjc3MgPSBbb3B0aW9ucy5jc3MgPz8gXCJcIl07XG4gIGlmIChjdHgub3B0aW9ucz8uY3NzSW5qZWN0aW9uTW9kZSA9PT0gXCJ1aVwiKSB7XG4gICAgY29uc3QgZW50cnlDc3MgPSBhd2FpdCBsb2FkQ3NzKCk7XG4gICAgY3NzLnB1c2goZW50cnlDc3MucmVwbGFjZUFsbChcIjpyb290XCIsIFwiOmhvc3RcIikpO1xuICB9XG4gIGNvbnN0IHtcbiAgICBpc29sYXRlZEVsZW1lbnQ6IHVpQ29udGFpbmVyLFxuICAgIHBhcmVudEVsZW1lbnQ6IHNoYWRvd0hvc3QsXG4gICAgc2hhZG93XG4gIH0gPSBhd2FpdCBjcmVhdGVJc29sYXRlZEVsZW1lbnQoe1xuICAgIG5hbWU6IG9wdGlvbnMubmFtZSxcbiAgICBjc3M6IHtcbiAgICAgIHRleHRDb250ZW50OiBjc3Muam9pbihcIlxcblwiKS50cmltKClcbiAgICB9LFxuICAgIG1vZGU6IG9wdGlvbnMubW9kZSA/PyBcIm9wZW5cIixcbiAgICBpc29sYXRlRXZlbnRzOiBvcHRpb25zLmlzb2xhdGVFdmVudHNcbiAgfSk7XG4gIHNoYWRvd0hvc3Quc2V0QXR0cmlidXRlKFwiZGF0YS13eHQtc2hhZG93LXJvb3RcIiwgXCJcIik7XG4gIGxldCBtb3VudGVkO1xuICBjb25zdCBtb3VudCA9ICgpID0+IHtcbiAgICBtb3VudFVpKHNoYWRvd0hvc3QsIG9wdGlvbnMpO1xuICAgIGFwcGx5UG9zaXRpb24oc2hhZG93SG9zdCwgc2hhZG93LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLCBvcHRpb25zKTtcbiAgICBtb3VudGVkID0gb3B0aW9ucy5vbk1vdW50KHVpQ29udGFpbmVyLCBzaGFkb3csIHNoYWRvd0hvc3QpO1xuICB9O1xuICBjb25zdCByZW1vdmUgPSAoKSA9PiB7XG4gICAgb3B0aW9ucy5vblJlbW92ZT8uKG1vdW50ZWQpO1xuICAgIHNoYWRvd0hvc3QucmVtb3ZlKCk7XG4gICAgd2hpbGUgKHVpQ29udGFpbmVyLmxhc3RDaGlsZClcbiAgICAgIHVpQ29udGFpbmVyLnJlbW92ZUNoaWxkKHVpQ29udGFpbmVyLmxhc3RDaGlsZCk7XG4gICAgbW91bnRlZCA9IHZvaWQgMDtcbiAgfTtcbiAgY3R4Lm9uSW52YWxpZGF0ZWQocmVtb3ZlKTtcbiAgcmV0dXJuIHtcbiAgICBzaGFkb3csXG4gICAgc2hhZG93SG9zdCxcbiAgICB1aUNvbnRhaW5lcixcbiAgICBtb3VudCxcbiAgICByZW1vdmUsXG4gICAgZ2V0IG1vdW50ZWQoKSB7XG4gICAgICByZXR1cm4gbW91bnRlZDtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBhcHBseVBvc2l0aW9uKHJvb3QsIHBvc2l0aW9uZWRFbGVtZW50LCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLnBvc2l0aW9uID09PSBcImlubGluZVwiKVxuICAgIHJldHVybjtcbiAgaWYgKG9wdGlvbnMuekluZGV4ICE9IG51bGwpXG4gICAgcm9vdC5zdHlsZS56SW5kZXggPSBTdHJpbmcob3B0aW9ucy56SW5kZXgpO1xuICByb290LnN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XG4gIHJvb3Quc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gIHJvb3Quc3R5bGUud2lkdGggPSBcIjBcIjtcbiAgcm9vdC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgcm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBpZiAocG9zaXRpb25lZEVsZW1lbnQpIHtcbiAgICBpZiAob3B0aW9ucy5wb3NpdGlvbiA9PT0gXCJvdmVybGF5XCIpIHtcbiAgICAgIHBvc2l0aW9uZWRFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgaWYgKG9wdGlvbnMuYWxpZ25tZW50Py5zdGFydHNXaXRoKFwiYm90dG9tLVwiKSlcbiAgICAgICAgcG9zaXRpb25lZEVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCIwXCI7XG4gICAgICBlbHNlXG4gICAgICAgIHBvc2l0aW9uZWRFbGVtZW50LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgaWYgKG9wdGlvbnMuYWxpZ25tZW50Py5lbmRzV2l0aChcIi1yaWdodFwiKSlcbiAgICAgICAgcG9zaXRpb25lZEVsZW1lbnQuc3R5bGUucmlnaHQgPSBcIjBcIjtcbiAgICAgIGVsc2VcbiAgICAgICAgcG9zaXRpb25lZEVsZW1lbnQuc3R5bGUubGVmdCA9IFwiMFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvbmVkRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcbiAgICAgIHBvc2l0aW9uZWRFbGVtZW50LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgICAgcG9zaXRpb25lZEVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCIwXCI7XG4gICAgICBwb3NpdGlvbmVkRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwXCI7XG4gICAgICBwb3NpdGlvbmVkRWxlbWVudC5zdHlsZS5yaWdodCA9IFwiMFwiO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gZ2V0QW5jaG9yKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuYW5jaG9yID09IG51bGwpXG4gICAgcmV0dXJuIGRvY3VtZW50LmJvZHk7XG4gIGxldCByZXNvbHZlZCA9IHR5cGVvZiBvcHRpb25zLmFuY2hvciA9PT0gXCJmdW5jdGlvblwiID8gb3B0aW9ucy5hbmNob3IoKSA6IG9wdGlvbnMuYW5jaG9yO1xuICBpZiAodHlwZW9mIHJlc29sdmVkID09PSBcInN0cmluZ1wiKVxuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHJlc29sdmVkKSA/PyB2b2lkIDA7XG4gIHJldHVybiByZXNvbHZlZCA/PyB2b2lkIDA7XG59XG5mdW5jdGlvbiBtb3VudFVpKHJvb3QsIG9wdGlvbnMpIHtcbiAgY29uc3QgYW5jaG9yID0gZ2V0QW5jaG9yKG9wdGlvbnMpO1xuICBpZiAoYW5jaG9yID09IG51bGwpXG4gICAgdGhyb3cgRXJyb3IoXG4gICAgICBcIkZhaWxlZCB0byBtb3VudCBjb250ZW50IHNjcmlwdCBVSTogY291bGQgbm90IGZpbmQgYW5jaG9yIGVsZW1lbnRcIlxuICAgICk7XG4gIHN3aXRjaCAob3B0aW9ucy5hcHBlbmQpIHtcbiAgICBjYXNlIHZvaWQgMDpcbiAgICBjYXNlIFwibGFzdFwiOlxuICAgICAgYW5jaG9yLmFwcGVuZChyb290KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJmaXJzdFwiOlxuICAgICAgYW5jaG9yLnByZXBlbmQocm9vdCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicmVwbGFjZVwiOlxuICAgICAgYW5jaG9yLnJlcGxhY2VXaXRoKHJvb3QpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImFmdGVyXCI6XG4gICAgICBhbmNob3IucGFyZW50RWxlbWVudD8uaW5zZXJ0QmVmb3JlKHJvb3QsIGFuY2hvci5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImJlZm9yZVwiOlxuICAgICAgYW5jaG9yLnBhcmVudEVsZW1lbnQ/Lmluc2VydEJlZm9yZShyb290LCBhbmNob3IpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIG9wdGlvbnMuYXBwZW5kKGFuY2hvciwgcm9vdCk7XG4gICAgICBicmVhaztcbiAgfVxufVxuYXN5bmMgZnVuY3Rpb24gbG9hZENzcygpIHtcbiAgY29uc3QgdXJsID0gYnJvd3Nlci5ydW50aW1lLmdldFVSTChcbiAgICBgL2NvbnRlbnQtc2NyaXB0cy8ke2ltcG9ydC5tZXRhLmVudi5FTlRSWVBPSU5UfS5jc3NgXG4gICk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICByZXR1cm4gYXdhaXQgcmVzLnRleHQoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nZ2VyLndhcm4oXG4gICAgICBgRmFpbGVkIHRvIGxvYWQgc3R5bGVzIEAgJHt1cmx9LiBEaWQgeW91IGZvcmdldCB0byBpbXBvcnQgdGhlIHN0eWxlc2hlZXQgaW4geW91ciBlbnRyeXBvaW50P2AsXG4gICAgICBlcnJcbiAgICApO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG59XG5leHBvcnQge1xuICBDb250ZW50U2NyaXB0Q29udGV4dCxcbiAgY3JlYXRlSWZyYW1lVWksXG4gIGNyZWF0ZUludGVncmF0ZWRVaSxcbiAgY3JlYXRlU2hhZG93Um9vdFVpXG59O1xuIl0sIm5hbWVzIjpbImRlZmluaXRpb24iLCJnbG9iYWwiLCJ0aGlzIiwibW9kdWxlIiwiX2IiLCJfYSIsInByb3h5VGFyZ2V0IiwidmFsdWUiLCJtZXNzYWdlIiwicHJpbnQiLCJsb2dnZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBZUEsV0FBUyxvQkFBb0JBLGFBQVk7QUFDdkMsV0FBT0E7QUFBQSxFQUNUOzs7Ozs7O0FDakJBLEtBQUMsU0FBVUMsU0FBUSxTQUFTO0FBR2lCO0FBQ3pDLGdCQUFRLE1BQU07QUFBQSxNQUNsQjtBQUFBLElBT0EsR0FBRyxPQUFPLGVBQWUsY0FBYyxh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
