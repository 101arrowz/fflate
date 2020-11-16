// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"347E4":[function(require,module,exports) {
var Refresh = require('react-refresh/runtime');

Refresh.injectIntoGlobalHook(window);

window.$RefreshReg$ = function () {};

window.$RefreshSig$ = function () {
  return function (type) {
    return type;
  };
};
},{"react-refresh/runtime":"3emQt"}],"3emQt":[function(require,module,exports) {
'use strict';

if ("development" === 'production') {
  module.exports = require('./cjs/react-refresh-runtime.production.min.js');
} else {
  module.exports = require('./cjs/react-refresh-runtime.development.js');
}
},{"./cjs/react-refresh-runtime.development.js":"1COxt"}],"1COxt":[function(require,module,exports) {
/** @license React v0.6.0
 * react-refresh-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

if ("development" !== "production") {
  (function () {
    'use strict'; // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.

    var hasSymbol = typeof Symbol === 'function' && Symbol.for; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?

    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map; // We never remove these associations.
    // It's OK to reference families, but use WeakMap/Set for types.

    var allFamiliesByID = new Map();
    var allFamiliesByType = new PossiblyWeakMap();
    var allSignaturesByType = new PossiblyWeakMap(); // This WeakMap is read by React, so we only put families
    // that have actually been edited here. This keeps checks fast.
    // $FlowIssue

    var updatedFamiliesByType = new PossiblyWeakMap(); // This is cleared on every performReactRefresh() call.
    // It is an array of [Family, NextType] tuples.

    var pendingUpdates = []; // This is injected by the renderer via DevTools global hook.

    var helpersByRendererID = new Map();
    var helpersByRoot = new Map(); // We keep track of mounted roots so we can schedule updates.

    var mountedRoots = new Set(); // If a root captures an error, we add its element to this Map so we can retry on edit.

    var failedRoots = new Map();
    var didSomeRootFailOnMount = false;

    function computeFullKey(signature) {
      if (signature.fullKey !== null) {
        return signature.fullKey;
      }

      var fullKey = signature.ownKey;
      var hooks;

      try {
        hooks = signature.getCustomHooks();
      } catch (err) {
        // This can happen in an edge case, e.g. if expression like Foo.useSomething
        // depends on Foo which is lazily initialized during rendering.
        // In that case just assume we'll have to remount.
        signature.forceReset = true;
        signature.fullKey = fullKey;
        return fullKey;
      }

      for (var i = 0; i < hooks.length; i++) {
        var hook = hooks[i];

        if (typeof hook !== 'function') {
          // Something's wrong. Assume we need to remount.
          signature.forceReset = true;
          signature.fullKey = fullKey;
          return fullKey;
        }

        var nestedHookSignature = allSignaturesByType.get(hook);

        if (nestedHookSignature === undefined) {
          // No signature means Hook wasn't in the source code, e.g. in a library.
          // We'll skip it because we can assume it won't change during this session.
          continue;
        }

        var nestedHookKey = computeFullKey(nestedHookSignature);

        if (nestedHookSignature.forceReset) {
          signature.forceReset = true;
        }

        fullKey += '\n---\n' + nestedHookKey;
      }

      signature.fullKey = fullKey;
      return fullKey;
    }

    function haveEqualSignatures(prevType, nextType) {
      var prevSignature = allSignaturesByType.get(prevType);
      var nextSignature = allSignaturesByType.get(nextType);

      if (prevSignature === undefined && nextSignature === undefined) {
        return true;
      }

      if (prevSignature === undefined || nextSignature === undefined) {
        return false;
      }

      if (computeFullKey(prevSignature) !== computeFullKey(nextSignature)) {
        return false;
      }

      if (nextSignature.forceReset) {
        return false;
      }

      return true;
    }

    function isReactClass(type) {
      return type.prototype && type.prototype.isReactComponent;
    }

    function canPreserveStateBetween(prevType, nextType) {
      if (isReactClass(prevType) || isReactClass(nextType)) {
        return false;
      }

      if (haveEqualSignatures(prevType, nextType)) {
        return true;
      }

      return false;
    }

    function resolveFamily(type) {
      // Only check updated types to keep lookups fast.
      return updatedFamiliesByType.get(type);
    }

    function performReactRefresh() {
      {
        if (pendingUpdates.length === 0) {
          return null;
        }

        var staleFamilies = new Set();
        var updatedFamilies = new Set();
        var updates = pendingUpdates;
        pendingUpdates = [];
        updates.forEach(function (_ref) {
          var family = _ref[0],
              nextType = _ref[1]; // Now that we got a real edit, we can create associations
          // that will be read by the React reconciler.

          var prevType = family.current;
          updatedFamiliesByType.set(prevType, family);
          updatedFamiliesByType.set(nextType, family);
          family.current = nextType; // Determine whether this should be a re-render or a re-mount.

          if (canPreserveStateBetween(prevType, nextType)) {
            updatedFamilies.add(family);
          } else {
            staleFamilies.add(family);
          }
        }); // TODO: rename these fields to something more meaningful.

        var update = {
          updatedFamilies: updatedFamilies,
          // Families that will re-render preserving state
          staleFamilies: staleFamilies // Families that will be remounted

        };
        helpersByRendererID.forEach(function (helpers) {
          // Even if there are no roots, set the handler on first update.
          // This ensures that if *new* roots are mounted, they'll use the resolve handler.
          helpers.setRefreshHandler(resolveFamily);
        });
        var didError = false;
        var firstError = null;
        failedRoots.forEach(function (element, root) {
          var helpers = helpersByRoot.get(root);

          if (helpers === undefined) {
            throw new Error('Could not find helpers for a root. This is a bug in React Refresh.');
          }

          try {
            helpers.scheduleRoot(root, element);
          } catch (err) {
            if (!didError) {
              didError = true;
              firstError = err;
            } // Keep trying other roots.

          }
        });
        mountedRoots.forEach(function (root) {
          var helpers = helpersByRoot.get(root);

          if (helpers === undefined) {
            throw new Error('Could not find helpers for a root. This is a bug in React Refresh.');
          }

          try {
            helpers.scheduleRefresh(root, update);
          } catch (err) {
            if (!didError) {
              didError = true;
              firstError = err;
            } // Keep trying other roots.

          }
        });

        if (didError) {
          throw firstError;
        }

        return update;
      }
    }

    function register(type, id) {
      {
        if (type === null) {
          return;
        }

        if (typeof type !== 'function' && typeof type !== 'object') {
          return;
        } // This can happen in an edge case, e.g. if we register
        // return value of a HOC but it returns a cached component.
        // Ignore anything but the first registration for each type.


        if (allFamiliesByType.has(type)) {
          return;
        } // Create family or remember to update it.
        // None of this bookkeeping affects reconciliation
        // until the first performReactRefresh() call above.


        var family = allFamiliesByID.get(id);

        if (family === undefined) {
          family = {
            current: type
          };
          allFamiliesByID.set(id, family);
        } else {
          pendingUpdates.push([family, type]);
        }

        allFamiliesByType.set(type, family); // Visit inner types because we might not have registered them.

        if (typeof type === 'object' && type !== null) {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              register(type.render, id + '$render');
              break;

            case REACT_MEMO_TYPE:
              register(type.type, id + '$type');
              break;
          }
        }
      }
    }

    function setSignature(type, key) {
      var forceReset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var getCustomHooks = arguments.length > 3 ? arguments[3] : undefined;
      {
        allSignaturesByType.set(type, {
          forceReset: forceReset,
          ownKey: key,
          fullKey: null,
          getCustomHooks: getCustomHooks || function () {
            return [];
          }
        });
      }
    } // This is lazily called during first render for a type.
    // It captures Hook list at that time so inline requires don't break comparisons.


    function collectCustomHooksForSignature(type) {
      {
        var signature = allSignaturesByType.get(type);

        if (signature !== undefined) {
          computeFullKey(signature);
        }
      }
    }

    function getFamilyByID(id) {
      {
        return allFamiliesByID.get(id);
      }
    }

    function getFamilyByType(type) {
      {
        return allFamiliesByType.get(type);
      }
    }

    function findAffectedHostInstances(families) {
      {
        var affectedInstances = new Set();
        mountedRoots.forEach(function (root) {
          var helpers = helpersByRoot.get(root);

          if (helpers === undefined) {
            throw new Error('Could not find helpers for a root. This is a bug in React Refresh.');
          }

          var instancesForRoot = helpers.findHostInstancesForRefresh(root, families);
          instancesForRoot.forEach(function (inst) {
            affectedInstances.add(inst);
          });
        });
        return affectedInstances;
      }
    }

    function injectIntoGlobalHook(globalObject) {
      {
        // For React Native, the global hook will be set up by require('react-devtools-core').
        // That code will run before us. So we need to monkeypatch functions on existing hook.
        // For React Web, the global hook will be set up by the extension.
        // This will also run before us.
        var hook = globalObject.__REACT_DEVTOOLS_GLOBAL_HOOK__;

        if (hook === undefined) {
          // However, if there is no DevTools extension, we'll need to set up the global hook ourselves.
          // Note that in this case it's important that renderer code runs *after* this method call.
          // Otherwise, the renderer will think that there is no global hook, and won't do the injection.
          var nextID = 0;
          globalObject.__REACT_DEVTOOLS_GLOBAL_HOOK__ = hook = {
            supportsFiber: true,
            inject: function (injected) {
              return nextID++;
            },
            onCommitFiberRoot: function (id, root, maybePriorityLevel, didError) {},
            onCommitFiberUnmount: function () {}
          };
        } // Here, we just want to get a reference to scheduleRefresh.


        var oldInject = hook.inject;

        hook.inject = function (injected) {
          var id = oldInject.apply(this, arguments);

          if (typeof injected.scheduleRefresh === 'function' && typeof injected.setRefreshHandler === 'function') {
            // This version supports React Refresh.
            helpersByRendererID.set(id, injected);
          }

          return id;
        }; // We also want to track currently mounted roots.


        var oldOnCommitFiberRoot = hook.onCommitFiberRoot;

        hook.onCommitFiberRoot = function (id, root, maybePriorityLevel, didError) {
          var helpers = helpersByRendererID.get(id);

          if (helpers === undefined) {
            return;
          }

          helpersByRoot.set(root, helpers);
          var current = root.current;
          var alternate = current.alternate; // We need to determine whether this root has just (un)mounted.
          // This logic is copy-pasted from similar logic in the DevTools backend.
          // If this breaks with some refactoring, you'll want to update DevTools too.

          if (alternate !== null) {
            var wasMounted = alternate.memoizedState != null && alternate.memoizedState.element != null;
            var isMounted = current.memoizedState != null && current.memoizedState.element != null;

            if (!wasMounted && isMounted) {
              // Mount a new root.
              mountedRoots.add(root);
              failedRoots.delete(root);
            } else if (wasMounted && isMounted) {// Update an existing root.
              // This doesn't affect our mounted root Set.
            } else if (wasMounted && !isMounted) {
              // Unmount an existing root.
              mountedRoots.delete(root);

              if (didError) {
                // We'll remount it on future edits.
                // Remember what was rendered so we can restore it.
                failedRoots.set(root, alternate.memoizedState.element);
              } else {
                helpersByRoot.delete(root);
              }
            } else if (!wasMounted && !isMounted) {
              if (didError && !failedRoots.has(root)) {
                // The root had an error during the initial mount.
                // We can't read its last element from the memoized state
                // because there was no previously committed alternate.
                // Ideally, it would be nice if we had a way to extract
                // the last attempted rendered element, but accessing the update queue
                // would tie this package too closely to the reconciler version.
                // So instead, we just set a flag.
                // TODO: Maybe we could fix this as the same time as when we fix
                // DevTools to not depend on `alternate.memoizedState.element`.
                didSomeRootFailOnMount = true;
              }
            }
          } else {
            // Mount a new root.
            mountedRoots.add(root);
          }

          return oldOnCommitFiberRoot.apply(this, arguments);
        };
      }
    }

    function hasUnrecoverableErrors() {
      return didSomeRootFailOnMount;
    } // Exposed for testing.


    function _getMountedRootCount() {
      {
        return mountedRoots.size;
      }
    } // This is a wrapper over more primitive functions for setting signature.
    // Signatures let us decide whether the Hook order has changed on refresh.
    //
    // This function is intended to be used as a transform target, e.g.:
    // var _s = createSignatureFunctionForTransform()
    //
    // function Hello() {
    //   const [foo, setFoo] = useState(0);
    //   const value = useCustomHook();
    //   _s(); /* Second call triggers collecting the custom Hook list.
    //          * This doesn't happen during the module evaluation because we
    //          * don't want to change the module order with inline requires.
    //          * Next calls are noops. */
    //   return <h1>Hi</h1>;
    // }
    //
    // /* First call specifies the signature: */
    // _s(
    //   Hello,
    //   'useState{[foo, setFoo]}(0)',
    //   () => [useCustomHook], /* Lazy to avoid triggering inline requires */
    // );


    function createSignatureFunctionForTransform() {
      {
        var call = 0;
        var savedType;
        var hasCustomHooks;
        return function (type, key, forceReset, getCustomHooks) {
          switch (call++) {
            case 0:
              savedType = type;
              hasCustomHooks = typeof getCustomHooks === 'function';
              setSignature(type, key, forceReset, getCustomHooks);
              break;

            case 1:
              if (hasCustomHooks) {
                collectCustomHooksForSignature(savedType);
              }

              break;
          }

          return type;
        };
      }
    }

    function isLikelyComponentType(type) {
      {
        switch (typeof type) {
          case 'function':
            {
              // First, deal with classes.
              if (type.prototype != null) {
                if (type.prototype.isReactComponent) {
                  // React class.
                  return true;
                }

                var ownNames = Object.getOwnPropertyNames(type.prototype);

                if (ownNames.length > 1 || ownNames[0] !== 'constructor') {
                  // This looks like a class.
                  return false;
                } // eslint-disable-next-line no-proto


                if (type.prototype.__proto__ !== Object.prototype) {
                  // It has a superclass.
                  return false;
                } // Pass through.
                // This looks like a regular function with empty prototype.

              } // For plain functions and arrows, use name as a heuristic.


              var name = type.name || type.displayName;
              return typeof name === 'string' && /^[A-Z]/.test(name);
            }

          case 'object':
            {
              if (type != null) {
                switch (type.$$typeof) {
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_MEMO_TYPE:
                    // Definitely React components.
                    return true;

                  default:
                    return false;
                }
              }

              return false;
            }

          default:
            {
              return false;
            }
        }
      }
    }

    var ReactFreshRuntime = Object.freeze({
      performReactRefresh: performReactRefresh,
      register: register,
      setSignature: setSignature,
      collectCustomHooksForSignature: collectCustomHooksForSignature,
      getFamilyByID: getFamilyByID,
      getFamilyByType: getFamilyByType,
      findAffectedHostInstances: findAffectedHostInstances,
      injectIntoGlobalHook: injectIntoGlobalHook,
      hasUnrecoverableErrors: hasUnrecoverableErrors,
      _getMountedRootCount: _getMountedRootCount,
      createSignatureFunctionForTransform: createSignatureFunctionForTransform,
      isLikelyComponentType: isLikelyComponentType
    }); // This is hacky but makes it work with both Rollup and Jest.

    var runtime = ReactFreshRuntime.default || ReactFreshRuntime;
    module.exports = runtime;
  })();
}
},{}],"3GkXV":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "e5f29bf6168a5afdf95bee56b3dd2e5a";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets;

function getHostname() {
  return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}

function getPort() {
  return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare


var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = getHostname();
  var port = getPort();
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || hmrAcceptCheck(module.bundle.root, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(module.bundle.root, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };

  newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now());
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      var hostname = getHostname();
      var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
      var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;

      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(module.bundle.root, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(module.bundle.root, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"77qLy":[function(require,module,exports) {
require('./bundle-manifest').register(JSON.parse("{\"6ZU7a\":\"index.e5f29bf6.js\",\"ICYPF\":\"workers.17a6a580.js\"}"));
},{"./bundle-manifest":"5G1rV"}],"5G1rV":[function(require,module,exports) {
"use strict";

var mapping = {};

function register(pairs) {
  var keys = Object.keys(pairs);

  for (var i = 0; i < keys.length; i++) {
    mapping[keys[i]] = pairs[keys[i]];
  }
}

function resolve(id) {
  var resolved = mapping[id];

  if (resolved == null) {
    throw new Error('Could not resolve bundle with id ' + id);
  }

  return resolved;
}

module.exports.register = register;
module.exports.resolve = resolve;
},{}],"3BJrQ":[function(require,module,exports) {
"use strict";

var helpers = require("../node_modules/@parcel/transformer-react-refresh-wrap/lib/helpers/helpers.js");

var prevRefreshReg = window.$RefreshReg$;
var prevRefreshSig = window.$RefreshSig$;
helpers.prelude(module);

try {
  var _react = _interopRequireDefault(require("react"));

  var _App = _interopRequireDefault(require("./App"));

  var _reactDom = require("react-dom");

  var _jsxFileName = "/Users/arjunb/Dev/fflate/demo/index.tsx";

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  if ("development" == 'production') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.ts');
    }
  }

  (0, _reactDom.render)( /*#__PURE__*/_react.default.createElement(_App.default, {
    __self: void 0,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11,
      columnNumber: 8
    }
  }), document.getElementById('app'));
  helpers.postlude(module);
} finally {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
},{"react":"4uhoE","./App":"3D3WR","react-dom":"4uhoE","../node_modules/@parcel/transformer-react-refresh-wrap/lib/helpers/helpers.js":"1t8mc"}],"4uhoE":[function(require,module,exports) {
var n=require("preact/hooks"),t=require("preact");function e(n,t){for(var e in t)n[e]=t[e];return n}function r(n,t){for(var e in n)if("__source"!==e&&!(e in t))return!0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return!0;return!1}function o(n){this.props=n}function u(n,e){function o(n){var t=this.props.ref,o=t==n.ref;return!o&&t&&(t.call?t(null):t.current=null),e?!e(this.props,n)||!o:r(this.props,n)}function u(e){return this.shouldComponentUpdate=o,t.createElement(n,e)}return u.displayName="Memo("+(n.displayName||n.name)+")",u.prototype.isReactComponent=!0,u.__f=!0,u}(o.prototype=new t.Component).isPureReactComponent=!0,o.prototype.shouldComponentUpdate=function(n,t){return r(this.props,n)||r(this.state,t)};var i=t.options.__b;t.options.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),i&&i(n)};var c="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function l(n){function t(t,r){var o=e({},t);return delete o.ref,n(o,(r=t.ref||r)&&("object"!=typeof r||"current"in r)?r:null)}return t.$$typeof=c,t.render=t,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var f=function(n,e){return null==n?null:t.toChildArray(t.toChildArray(n).map(e))},a={map:f,forEach:f,count:function(n){return n?t.toChildArray(n).length:0},only:function(n){var e=t.toChildArray(n);if(1!==e.length)throw"Children.only";return e[0]},toArray:t.toChildArray},s=t.options.__e;function p(n){return n&&(n.__c&&n.__c.__H&&(n.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c()}),n.__c.__H=null),(n=e({},n)).__c=null,n.__k=n.__k&&n.__k.map(p)),n}function h(n){return n&&(n.__v=null,n.__k=n.__k&&n.__k.map(h)),n}function v(){this.__u=0,this.t=null,this.__b=null}function d(n){var t=n.__.__c;return t&&t.__e&&t.__e(n)}function x(n){var e,r,o;function u(u){if(e||(e=n()).then(function(n){r=n.default||n},function(n){o=n}),o)throw o;if(!r)throw e;return t.createElement(r,u)}return u.displayName="Lazy",u.__f=!0,u}function m(){this.o=null,this.u=null}t.options.__e=function(n,t,e){if(n.then)for(var r,o=t;o=o.__;)if((r=o.__c)&&r.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),r.__c(n,t.__c);s(n,t,e)},(v.prototype=new t.Component).__c=function(n,t){var e=this;null==e.t&&(e.t=[]),e.t.push(t);var r=d(e.__v),o=!1,u=function(){o||(o=!0,t.componentWillUnmount=t.__c,r?r(i):i())};t.__c=t.componentWillUnmount,t.componentWillUnmount=function(){u(),t.__c&&t.__c()};var i=function(){var n;if(!--e.__u)for(e.__v.__k[0]=h(e.state.__e),e.setState({__e:e.__b=null});n=e.t.pop();)n.forceUpdate()},c=e.__v;c&&!0===c.__h||e.__u++||e.setState({__e:e.__b=e.__v.__k[0]}),n.then(u,u)},v.prototype.componentWillUnmount=function(){this.t=[]},v.prototype.render=function(n,e){this.__b&&(this.__v.__k&&(this.__v.__k[0]=p(this.__b)),this.__b=null);var r=e.__e&&t.createElement(t.Fragment,null,n.fallback);return r&&(r.__h=null),[t.createElement(t.Fragment,null,e.__e?null:n.children),r]};var b=function(n,t,e){if(++e[1]===e[0]&&n.u.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.u.size))for(e=n.o;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.o=e=e[2]}};function y(n){return this.getChildContext=function(){return n.context},n.children}function _(n){var e=this,r=n.i,o=t.createElement(y,{context:e.context},n.__v);e.componentWillUnmount=function(){var n=e.l.parentNode;n&&n.removeChild(e.l),t.__u(e.s)},e.i&&e.i!==r&&(e.componentWillUnmount(),e.p=!1),n.__v?e.p?(r.__k=e.__k,t.render(o,r),e.__k=r.__k):(e.l=document.createTextNode(""),e.__k=r.__k,t.hydrate("",r),r.appendChild(e.l),e.p=!0,e.i=r,t.render(o,r,e.l),r.__k=e.__k,e.__k=e.l.__k):e.p&&e.componentWillUnmount(),e.s=o}function S(n,e){return t.createElement(_,{__v:n,i:e})}(m.prototype=new t.Component).__e=function(n){var t=this,e=d(t.__v),r=t.u.get(n);return r[0]++,function(o){var u=function(){t.props.revealOrder?(r.push(o),b(t,n,r)):o()};e?e(u):u()}},m.prototype.render=function(n){this.o=null,this.u=new Map;var e=t.toChildArray(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&e.reverse();for(var r=e.length;r--;)this.u.set(e[r],this.o=[1,0,this.o]);return n.children},m.prototype.componentDidUpdate=m.prototype.componentDidMount=function(){var n=this;this.u.forEach(function(t,e){b(n,e,t)})};var w="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,g=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,E="undefined"!=typeof Symbol?/fil|che|rad/i:/fil|che|ra/i;function C(n,e,r){return null==e.__k&&(e.textContent=""),t.render(n,e),"function"==typeof r&&r(),n?n.__c:null}function R(n,e,r){return t.hydrate(n,e),"function"==typeof r&&r(),n?n.__c:null}t.Component.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(n){Object.defineProperty(t.Component.prototype,n,{configurable:!0,get:function(){return this["UNSAFE_"+n]},set:function(t){Object.defineProperty(this,n,{configurable:!0,writable:!0,value:t})}})});var O=t.options.event;function k(){}function A(){return this.cancelBubble}function N(){return this.defaultPrevented}t.options.event=function(n){return O&&(n=O(n)),n.persist=k,n.isPropagationStopped=A,n.isDefaultPrevented=N,n.nativeEvent=n};var L,U={configurable:!0,get:function(){return this.class}},M=t.options.vnode;t.options.vnode=function(n){var e=n.type,r=n.props,o=r;if("string"==typeof e){for(var u in o={},r){var i=r[u];"defaultValue"===u&&"value"in r&&null==r.value?u="value":"download"===u&&!0===i?i="":/ondoubleclick/i.test(u)?u="ondblclick":/^onchange(textarea|input)/i.test(u+e)&&!E.test(r.type)?u="oninput":/^on(Ani|Tra|Tou|BeforeInp)/.test(u)?u=u.toLowerCase():g.test(u)?u=u.replace(/[A-Z0-9]/,"-$&").toLowerCase():null===i&&(i=void 0),o[u]=i}"select"==e&&o.multiple&&Array.isArray(o.value)&&(o.value=t.toChildArray(r.children).forEach(function(n){n.props.selected=-1!=o.value.indexOf(n.props.value)})),n.props=o}e&&r.class!=r.className&&(U.enumerable="className"in r,null!=r.className&&(o.class=r.className),Object.defineProperty(o,"className",U)),n.$$typeof=w,M&&M(n)};var j=t.options.__r;t.options.__r=function(n){j&&j(n),L=n.__c};var D={ReactCurrentDispatcher:{current:{readContext:function(n){return L.__n[n.__c].props.value}}}};function F(n){return t.createElement.bind(null,n)}function I(n){return!!n&&n.$$typeof===w}function T(n){return I(n)?t.cloneElement.apply(null,arguments):n}function W(n){return!!n.__k&&(t.render(null,n),!0)}function P(n){return n&&(n.base||1===n.nodeType&&n)||null}var z=function(n,t){return n(t)},V=t.Fragment,q={useState:n.useState,useReducer:n.useReducer,useEffect:n.useEffect,useLayoutEffect:n.useLayoutEffect,useRef:n.useRef,useImperativeHandle:n.useImperativeHandle,useMemo:n.useMemo,useCallback:n.useCallback,useContext:n.useContext,useDebugValue:n.useDebugValue,version:"16.8.0",Children:a,render:C,hydrate:R,unmountComponentAtNode:W,createPortal:S,createElement:t.createElement,createContext:t.createContext,createFactory:F,cloneElement:T,createRef:t.createRef,Fragment:t.Fragment,isValidElement:I,findDOMNode:P,Component:t.Component,PureComponent:o,memo:u,forwardRef:l,unstable_batchedUpdates:z,StrictMode:V,Suspense:v,SuspenseList:m,lazy:x,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:D};Object.keys(n).forEach(function(t){exports[t]=n[t]}),exports.createElement=t.createElement,exports.createContext=t.createContext,exports.createRef=t.createRef,exports.Fragment=t.Fragment,exports.Component=t.Component,exports.version="16.8.0",exports.Children=a,exports.render=C,exports.hydrate=R,exports.unmountComponentAtNode=W,exports.createPortal=S,exports.createFactory=F,exports.cloneElement=T,exports.isValidElement=I,exports.findDOMNode=P,exports.PureComponent=o,exports.memo=u,exports.forwardRef=l,exports.unstable_batchedUpdates=z,exports.StrictMode=V,exports.Suspense=v,exports.SuspenseList=m,exports.lazy=x,exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=D,exports.default=q;

},{"preact/hooks":"4RdzQ","preact":"4BgmU"}],"4RdzQ":[function(require,module,exports) {
var n,t,r,o=require("preact"),u=0,i=[],c=o.options.__r,e=o.options.diffed,f=o.options.__c,a=o.options.unmount;function p(n,r){o.options.__h&&o.options.__h(t,n,u||r),u=0;var i=t.__H||(t.__H={__:[],__h:[]});return n>=i.__.length&&i.__.push({}),i.__[n]}function v(n){return u=1,s(A,n)}function s(r,o,u){var i=p(n++,2);return i.t=r,i.__c||(i.__=[u?u(o):A(void 0,o),function(n){var t=i.t(i.__[0],n);i.__[0]!==t&&(i.__=[t,i.__[1]],i.__c.setState({}))}],i.__c=t),i.__}function x(r,u){var i=p(n++,4);!o.options.__s&&q(i.__H,u)&&(i.__=r,i.__H=u,t.__h.push(i))}function m(t,r){var o=p(n++,7);return q(o.__H,r)&&(o.__=t(),o.__H=r,o.__h=t),o.__}function y(){i.forEach(function(n){if(n.__P)try{n.__H.__h.forEach(h),n.__H.__h.forEach(_),n.__H.__h=[]}catch(t){n.__H.__h=[],o.options.__e(t,n.__v)}}),i=[]}o.options.__r=function(r){c&&c(r),n=0;var o=(t=r.__c).__H;o&&(o.__h.forEach(h),o.__h.forEach(_),o.__h=[])},o.options.diffed=function(n){e&&e(n);var t=n.__c;t&&t.__H&&t.__H.__h.length&&(1!==i.push(t)&&r===o.options.requestAnimationFrame||((r=o.options.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(o),l&&cancelAnimationFrame(t),setTimeout(n)},o=setTimeout(r,100);l&&(t=requestAnimationFrame(r))})(y))},o.options.__c=function(n,t){t.some(function(n){try{n.__h.forEach(h),n.__h=n.__h.filter(function(n){return!n.__||_(n)})}catch(r){t.some(function(n){n.__h&&(n.__h=[])}),t=[],o.options.__e(r,n.__v)}}),f&&f(n,t)},o.options.unmount=function(n){a&&a(n);var t=n.__c;if(t&&t.__H)try{t.__H.__.forEach(h)}catch(n){o.options.__e(n,t.__v)}};var l="function"==typeof requestAnimationFrame;function h(n){"function"==typeof n.__c&&n.__c()}function _(n){n.__c=n.__()}function q(n,t){return!n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function A(n,t){return"function"==typeof t?t(n):t}exports.useState=v,exports.useReducer=s,exports.useEffect=function(r,u){var i=p(n++,3);!o.options.__s&&q(i.__H,u)&&(i.__=r,i.__H=u,t.__H.__h.push(i))},exports.useLayoutEffect=x,exports.useRef=function(n){return u=5,m(function(){return{current:n}},[])},exports.useImperativeHandle=function(n,t,r){u=6,x(function(){"function"==typeof n?n(t()):n&&(n.current=t())},null==r?r:r.concat(n))},exports.useMemo=m,exports.useCallback=function(n,t){return u=8,m(function(){return n},t)},exports.useContext=function(r){var o=t.context[r.__c],u=p(n++,9);return u.__c=r,o?(null==u.__&&(u.__=!0,o.sub(t)),o.props.value):r.__},exports.useDebugValue=function(n,t){o.options.useDebugValue&&o.options.useDebugValue(t?t(n):n)},exports.useErrorBoundary=function(r){var o=p(n++,10),u=v();return o.__=r,t.componentDidCatch||(t.componentDidCatch=function(n){o.__&&o.__(n),u[1](n)}),[u[0],function(){u[1](void 0)}]};

},{"preact":"4BgmU"}],"4BgmU":[function(require,module,exports) {
var n,l,u,t,i,o,r,f={},e=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n)}function p(n,l,u){var t,i,o,r=arguments,f={};for(o in l)"key"==o?t=l[o]:"ref"==o?i=l[o]:f[o]=l[o];if(arguments.length>3)for(u=[u],o=3;o<arguments.length;o++)u.push(r[o]);if(null!=u&&(f.children=u),"function"==typeof n&&null!=n.defaultProps)for(o in n.defaultProps)void 0===f[o]&&(f[o]=n.defaultProps[o]);return v(n,f,t,i,null)}function v(l,u,t,i,o){var r={type:l,props:u,key:t,ref:i,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),null!=n.vnode&&n.vnode(r),r}function h(n){return n.children}function y(n,l){this.props=n,this.context=l}function d(n,l){if(null==l)return n.__?d(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?d(n):null}function _(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return _(n)}}function w(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!x.__r++||i!==n.debounceRendering)&&((i=n.debounceRendering)||t)(x)}function x(){for(var n;x.__r=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,t,i,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(t=s({},o)).__v=t,i=N(f,o,t,l.__n,void 0!==f.ownerSVGElement,null!=o.__h?[r]:null,u,null==r?d(o):r,o.__h),T(u,o),i!=r&&_(o)))})}function k(n,l,u,t,i,o,r,c,s,p){var y,_,w,x,k,m,b,A=t&&t.__k||e,P=A.length;for(s==f&&(s=null!=r?r[0]:P?d(t,0):null),u.__k=[],y=0;y<l.length;y++)if(null!=(x=u.__k[y]=null==(x=l[y])||"boolean"==typeof x?null:"string"==typeof x||"number"==typeof x?v(null,x,null,null,x):Array.isArray(x)?v(h,{children:x},null,null,null):null!=x.__e||null!=x.__c?v(x.type,x.props,x.key,null,x.__v):x)){if(x.__=u,x.__b=u.__b+1,null===(w=A[y])||w&&x.key==w.key&&x.type===w.type)A[y]=void 0;else for(_=0;_<P;_++){if((w=A[_])&&x.key==w.key&&x.type===w.type){A[_]=void 0;break}w=null}k=N(n,x,w=w||f,i,o,r,c,s,p),(_=x.ref)&&w.ref!=_&&(b||(b=[]),w.ref&&b.push(w.ref,null,x),b.push(_,x.__c||k,x)),null!=k?(null==m&&(m=k),s=g(n,x,w,A,r,k,s),p||"option"!=u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&w.__e==s&&s.parentNode!=n&&(s=d(w))}if(u.__e=m,null!=r&&"function"!=typeof u.type)for(y=r.length;y--;)null!=r[y]&&a(r[y]);for(y=P;y--;)null!=A[y]&&H(A[y],A[y]);if(b)for(y=0;y<b.length;y++)j(b[y],b[++y],b[++y])}function g(n,l,u,t,i,o,r){var f,e,c;if(void 0!==l.__d)f=l.__d,l.__d=void 0;else if(i==u||o!=r||null==o.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(o),f=null;else{for(e=r,c=0;(e=e.nextSibling)&&c<t.length;c+=2)if(e==o)break n;n.insertBefore(o,r),f=r}return void 0!==f?f:o.nextSibling}function m(n,l,u,t,i){var o;for(o in u)"children"===o||"key"===o||o in l||A(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||A(n,o,l[o],u[o],t)}function b(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||c.test(l)?u:u+"px"}function A(n,l,u,t,i){var o,r,f;if(i&&"className"==l&&(l="class"),"style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||b(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||b(n.style,l,u[l])}else"o"===l[0]&&"n"===l[1]?(o=l!==(l=l.replace(/Capture$/,"")),(r=l.toLowerCase())in n&&(l=r),l=l.slice(2),n.l||(n.l={}),n.l[l+o]=u,f=o?C:P,u?t||n.addEventListener(l,f,o):n.removeEventListener(l,f,o)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&"download"!==l&&"href"!==l&&!i&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u))}function P(l){this.l[l.type+!1](n.event?n.event(l):l)}function C(l){this.l[l.type+!0](n.event?n.event(l):l)}function z(n,l,u){var t,i;for(t=0;t<n.__k.length;t++)(i=n.__k[t])&&(i.__=n,i.__e&&("function"==typeof i.type&&i.__k.length>1&&z(i,l,u),l=g(u,i,i,n.__k,null,i.__e,l),"function"==typeof n.type&&(n.__d=l)))}function N(l,u,t,i,o,r,f,e,c){var a,p,v,d,_,w,x,g,m,b,A,P=u.type;if(void 0!==u.constructor)return null;null!=t.__h&&(c=t.__h,e=u.__e=t.__e,u.__h=null,r=[e]),(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(g=u.props,m=(a=P.contextType)&&i[a.__c],b=a?m?m.props.value:a.__:i,t.__c?x=(p=u.__c=t.__c).__=p.__E:("prototype"in P&&P.prototype.render?u.__c=p=new P(g,b):(u.__c=p=new y(g,b),p.constructor=P,p.render=I),m&&m.sub(p),p.props=g,p.state||(p.state={}),p.context=b,p.__n=i,v=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=P.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=s({},p.__s)),s(p.__s,P.getDerivedStateFromProps(g,p.__s))),d=p.props,_=p.state,v)null==P.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==P.getDerivedStateFromProps&&g!==d&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(g,b),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(g,p.__s,b)||u.__v===t.__v){p.props=g,p.state=p.__s,u.__v!==t.__v&&(p.__d=!1),p.__v=u,u.__e=t.__e,u.__k=t.__k,p.__h.length&&f.push(p),z(u,e,l);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(g,p.__s,b),null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(d,_,w)})}p.context=b,p.props=g,p.state=p.__s,(a=n.__r)&&a(u),p.__d=!1,p.__v=u,p.__P=l,a=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(i=s(s({},i),p.getChildContext())),v||null==p.getSnapshotBeforeUpdate||(w=p.getSnapshotBeforeUpdate(d,_)),A=null!=a&&a.type==h&&null==a.key?a.props.children:a,k(l,Array.isArray(A)?A:[A],u,t,i,o,r,f,e,c),p.base=u.__e,u.__h=null,p.__h.length&&f.push(p),x&&(p.__E=p.__=null),p.__e=!1}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=$(t.__e,u,t,i,o,r,f,c);(a=n.diffed)&&a(u)}catch(l){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),n.__e(l,u,t)}return u.__e}function T(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u)})}catch(l){n.__e(l,u.__v)}})}function $(n,l,u,t,i,o,r,c){var s,a,p,v,h,y=u.props,d=l.props;if(i="svg"===l.type||i,null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,c=!1}if(null===l.type)y===d||c&&n.data===d||(n.data=d);else{if(null!=o&&(o=e.slice.call(n.childNodes)),p=(y=u.props||f).dangerouslySetInnerHTML,v=d.dangerouslySetInnerHTML,!c){if(null!=o)for(y={},h=0;h<n.attributes.length;h++)y[n.attributes[h].name]=n.attributes[h].value;(v||p)&&(v&&(p&&v.__html==p.__html||v.__html===n.innerHTML)||(n.innerHTML=v&&v.__html||""))}m(n,d,y,i,c),v?l.__k=[]:(s=l.props.children,k(n,Array.isArray(s)?s:[s],l,u,t,"foreignObject"!==l.type&&i,o,r,f,c)),c||("value"in d&&void 0!==(s=d.value)&&(s!==n.value||"progress"===l.type&&!s)&&A(n,"value",s,y.value,!1),"checked"in d&&void 0!==(s=d.checked)&&s!==n.checked&&A(n,"checked",s,y.checked,!1))}return n}function j(l,u,t){try{"function"==typeof l?l(u):l.current=u}catch(l){n.__e(l,t)}}function H(l,u,t){var i,o,r;if(n.unmount&&n.unmount(l),(i=l.ref)&&(i.current&&i.current!==l.__e||j(i,null,u)),t||"function"==typeof l.type||(t=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(i=l.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(l){n.__e(l,u)}i.base=i.__P=null}if(i=l.__k)for(r=0;r<i.length;r++)i[r]&&H(i[r],u,t);null!=o&&a(o)}function I(n,l,u){return this.constructor(n,u)}function L(l,u,t){var i,r,c;n.__&&n.__(l,u),r=(i=t===o)?null:t&&t.__k||u.__k,l=p(h,null,[l]),c=[],N(u,(i?u:t||u).__k=l,r||f,f,void 0!==u.ownerSVGElement,t&&!i?[t]:r?null:u.childNodes.length?e.slice.call(u.childNodes):null,c,t||f,i),T(c,l)}n={__e:function(n,l){for(var u,t,i,o=l.__h;l=l.__;)if((u=l.__c)&&!u.__)try{if((t=u.constructor)&&null!=t.getDerivedStateFromError&&(u.setState(t.getDerivedStateFromError(n)),i=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),i=u.__d),i)return l.__h=o,u.__E=u}catch(l){n=l}throw n}},l=function(n){return null!=n&&void 0===n.constructor},y.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(s({},u),this.props)),n&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),w(this))},y.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),w(this))},y.prototype.render=h,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,x.__r=0,o=f,r=0,exports.render=L,exports.hydrate=function(n,l){L(n,l,o)},exports.createElement=p,exports.h=p,exports.Fragment=h,exports.createRef=function(){return{current:null}},exports.isValidElement=l,exports.Component=y,exports.cloneElement=function(n,l,u){var t,i,o,r=arguments,f=s({},n.props);for(o in l)"key"==o?t=l[o]:"ref"==o?i=l[o]:f[o]=l[o];if(arguments.length>3)for(u=[u],o=3;o<arguments.length;o++)u.push(r[o]);return null!=u&&(f.children=u),v(n.type,f,t||n.key,i||n.ref,null)},exports.createContext=function(n,l){var u={__c:l="__cC"+r++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n,u,t){return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(w)},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u},exports.toChildArray=function n(l,u){return u=u||[],null==l||"boolean"==typeof l||(Array.isArray(l)?l.some(function(l){n(l,u)}):u.push(l)),u},exports.__u=H,exports.options=n;

},{}],"3D3WR":[function(require,module,exports) {
"use strict";

var helpers = require("../node_modules/@parcel/transformer-react-refresh-wrap/lib/helpers/helpers.js");

var prevRefreshReg = window.$RefreshReg$;
var prevRefreshSig = window.$RefreshSig$;
helpers.prelude(module);

try {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = _interopRequireWildcard(require("react"));

  var _filePicker = _interopRequireDefault(require("./components/file-picker"));

  var _codeBox = _interopRequireDefault(require("./components/code-box"));

  var _jsxFileName = "/Users/arjunb/Dev/fflate/demo/App.tsx";

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  const App = () => {
    const [files, setFiles] = (0, _react.useState)([]);
    const cbRef = (0, _react.useRef)(null);
    (0, _react.useEffect)(() => {
      if (files && files.length) {
        cbRef.current.scrollIntoView({
          behavior: 'smooth' // Hopefully IE just ignores this value

        });
      }
    }, [files]);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        fontSize: '70px',
        justifyContent: 'space-between',
        flexDirection: 'row',
        overflow: 'hidden',
        width: '100%',
        fontWeight: 'bold'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        paddingLeft: '0.25em'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 26,
        columnNumber: 9
      }
    }, "fflate", /*#__PURE__*/_react.default.createElement("div", {
      style: {
        color: 'gray',
        fontSize: '0.25em',
        fontWeight: 'lighter'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28,
        columnNumber: 11
      }
    }, "a fast compression library by ", /*#__PURE__*/_react.default.createElement("a", {
      href: "//github.com/101arrowz",
      style: {
        color: 'gray'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 32,
        columnNumber: 44
      }
    }, "101arrowz"))), /*#__PURE__*/_react.default.createElement("a", {
      href: "//github.com/101arrowz/fflate",
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "80",
      height: "80",
      viewBox: "0 0 250 250",
      fill: "white",
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 35,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("path", {
      d: "M0 0l115 115h15l12 27 108 108V0z",
      fill: "black",
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 36,
        columnNumber: 13
      }
    }), /*#__PURE__*/_react.default.createElement("path", {
      d: "M128 109c-15-9-9-19-9-19 3-7 2-11 2-11-1-7 3-2 3-2 4 5 2 11 2 11-3 10 5 15 9 16",
      style: {
        transformOrigin: '130px 106px'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 37,
        columnNumber: 13
      }
    }), /*#__PURE__*/_react.default.createElement("path", {
      d: "M115 115s4 2 5 0l14-14c3-2 6-3 8-3-8-11-15-24 2-41 5-5 10-7 16-7 1-2 3-7 12-11 0 0 5 3 7 16 4 2 8 5 12 9s7 8 9 12c14 3 17 7 17 7-4 8-9 11-11 11 0 6-2 11-7 16-16 16-30 10-41 2 0 3-1 7-5 11l-12 11c-1 1 1 5 1 5z",
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 38,
        columnNumber: 13
      }
    })))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        width: '100%',
        flex: 1
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 42,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        maxWidth: '80%',
        fontSize: 'calc(15px + 0.6vw)',
        paddingTop: '4vh',
        paddingBottom: '2vh'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 51,
        columnNumber: 9
      }
    }, "You've found ", /*#__PURE__*/_react.default.createElement("a", {
      href: "//npmjs.com/package/fflate",
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 52,
        columnNumber: 24
      }
    }, "fflate"), ", the fastest pure JavaScript compression library in existence.", /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 53,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 53,
        columnNumber: 17
      }
    }), "You can both pack and expand Zlib, GZIP, DEFLATE, or ZIP files very quickly with just a few lines of code.", /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 55,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 55,
        columnNumber: 17
      }
    }), "Weighing in at a measly 8kB for basic compression and decompression, you don't need to worry about your bundle size ballooning.", /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 57,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 57,
        columnNumber: 17
      }
    }), "Despite utilizing multiple cores, supporting data streams, and being very memory efficient, fflate is compatible with both Node.js and browsers as old as IE11.", /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 59,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 59,
        columnNumber: 17
      }
    }), "You can read more about fflate on ", /*#__PURE__*/_react.default.createElement("a", {
      href: "//github.com/package/fflate",
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 60,
        columnNumber: 45
      }
    }, "GitHub"), ". Try the demo below to see its performance for yourself. The code boxes are editable; try changing parameters or using a different compression format.", /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 61,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 61,
        columnNumber: 17
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      style: {
        fontSize: '0.75em'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 62,
        columnNumber: 11
      }
    }, "Disclaimer: I added a ", /*#__PURE__*/_react.default.createElement("span", {
      style: {
        fontStyle: 'italic'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 62,
        columnNumber: 70
      }
    }, "lot"), " of sugar (around 4 hundred lines) to the UZIP and Pako APIs to make the demo clean and asynchronous, but the fflate API is unmodified."), /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 63,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 63,
        columnNumber: 17
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: '2vh'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 65,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement(_filePicker.default, {
      allowDirs: true,
      onFiles: setFiles,
      onError: console.log,
      onDrag: () => {},
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 72,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 73,
        columnNumber: 13
      }
    }, files ? (files.length || 'No') + ' file' + (files.length == 1 ? '' : 's') + ' selected' : 'Loading...'), /*#__PURE__*/_react.default.createElement("br", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 74,
        columnNumber: 13
      }
    })), (!files || files.length) && /*#__PURE__*/_react.default.createElement(_codeBox.default, {
      files: files,
      forwardRef: cbRef,
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 76,
        columnNumber: 41
      }
    }) || null)));
  };

  var _default = App;
  exports.default = _default;
  helpers.postlude(module);
} finally {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
},{"react":"4uhoE","./components/file-picker":"72I8d","./components/code-box":"r7mN8","../node_modules/@parcel/transformer-react-refresh-wrap/lib/helpers/helpers.js":"1t8mc"}],"72I8d":[function(require,module,exports) {
"use strict";

var helpers = require("../../../node_modules/@parcel/transformer-react-refresh-wrap/lib/helpers/helpers.js");

var prevRefreshReg = window.$RefreshReg$;
var prevRefreshSig = window.$RefreshSig$;
helpers.prelude(module);

try {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = _interopRequireWildcard(require("react"));

  var _jsxFileName = "/Users/arjunb/Dev/fflate/demo/components/file-picker/index.tsx";

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  const supportsInputDirs = ('webkitdirectory' in HTMLInputElement.prototype);
  const supportsRelativePath = ('webkitRelativePath' in File.prototype);
  const supportsDirs = typeof DataTransferItem != 'undefined' && 'webkitGetAsEntry' in DataTransferItem.prototype;

  const readRecurse = (dir, onComplete, onError) => {
    let files = [];
    let total = 0;
    let errored = false;
    let reachedEnd = false;

    const onErr = err => {
      if (!errored) {
        errored = true;
        onError(err);
      }
    };

    const onDone = f => {
      files = files.concat(f);
      if (! --total && reachedEnd) onComplete(files);
    };

    const reader = dir.createReader();

    const onRead = entries => {
      if (!entries.length && !errored) {
        if (!total) onComplete(files);else reachedEnd = true;
      } else reader.readEntries(onRead, onError);

      for (const entry of entries) {
        ++total;
        if (entry.isFile) entry.file(f => onDone([new File([f], entry.fullPath.slice(1), f)]), onErr);else readRecurse(entry, onDone, onErr);
      }
    };

    reader.readEntries(onRead, onError);
  };

  const FilePicker = ({
    onFiles,
    onDrag,
    onError,
    style,
    allowDirs,
    children,
    ...props
  }) => {
    const inputRef = (0, _react.useRef)(null);
    const dirInputRef = (0, _react.useRef)(null);
    const dragRef = (0, _react.useRef)(0);
    const [inputHover, setInputHover] = (0, _react.useState)(false);
    const [dirInputHover, setDirInputHover] = (0, _react.useState)(false);
    const [isHovering, setIsHovering] = (0, _react.useState)(false);
    (0, _react.useEffect)(() => {
      // only init'd when support dirs
      if (dirInputRef.current) {
        dirInputRef.current.setAttribute('webkitdirectory', '');
      }
    }, []);
    const rootProps = {
      onDrop(ev) {
        ev.preventDefault();
        const tf = ev.dataTransfer;
        if (!tf.files.length) onError('Please drop some files in');else {
          onFiles(null);

          if (supportsDirs && allowDirs) {
            let outFiles = [];
            let lft = tf.items.length;
            let errored = false;

            const onErr = err => {
              if (!errored) {
                errored = true;
                onError(err);
              }
            };

            const onDone = f => {
              outFiles = outFiles.concat(f);
              if (! --lft && !errored) onFiles(outFiles);
            };

            for (let i = 0; i < tf.items.length; ++i) {
              const entry = tf.items[i].webkitGetAsEntry();
              if (entry.isFile) entry.file(f => onDone([f]), onErr);else readRecurse(entry, onDone, onErr);
            }
          } else onFiles(Array.prototype.slice.call(tf.files));
        }
        setIsHovering(false);
      },

      onDragEnter() {
        ++dragRef.current;
        onDrag(true);
        setIsHovering(true);
      },

      onDragOver(ev) {
        ev.preventDefault();
      },

      onDragLeave() {
        if (! --dragRef.current) {
          onDrag(false);
          setIsHovering(false);
        }
      },

      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
      }
    };
    const inputProps = {
      onInput(ev) {
        const t = ev.currentTarget,
              files = t.files;

        if (supportsRelativePath) {
          const outFiles = Array(files.length);

          for (let i = 0; i < files.length; ++i) {
            const file = files[i];
            outFiles[i] = new File([file], file.webkitRelativePath || file.name, file);
          }

          onFiles(outFiles);
        } else onFiles(Array.prototype.slice.call(files));

        t.value = '';
      },

      style: {
        display: 'none'
      },
      multiple: true
    };
    const buttonStyles = {
      cursor: 'default',
      minWidth: '8vw',
      height: '6vh',
      margin: '1vmin',
      padding: '1vmin',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 2px 1px rgba(0, 0, 0, 0.2), 0 2px 4px 2px rgba(0, 0, 0, 0.15), 0 4px 8px 4px rgba(0, 0, 0, 0.12)',
      border: '1px solid black',
      borderRadius: '6px',
      transition: 'background-color 300ms ease-in-out',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      MozUserSelect: 'none',
      userSelect: 'none'
    };
    return /*#__PURE__*/_react.default.createElement("div", _extends({}, props, rootProps, {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 145,
        columnNumber: 5
      }
    }), children, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        transition: 'transform ' + (isHovering ? 300 : 50) + 'ms ease-in-out',
        transform: isHovering ? 'scale(1.5)' : 'none'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 147,
        columnNumber: 7
      }
    }, "Drag and Drop"), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        borderBottom: '1px solid gray',
        margin: '1.5vh',
        color: 'gray',
        lineHeight: 0,
        paddingTop: '1.5vh',
        marginBottom: '3vh',
        width: '100%'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 151,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      style: {
        background: 'white',
        padding: '0.25em'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 160,
        columnNumber: 9
      }
    }, "OR")), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 162,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("input", _extends({
      type: "file",
      ref: inputRef
    }, inputProps, {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 169,
        columnNumber: 9
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      onClick: () => inputRef.current.click(),
      onMouseOver: () => setInputHover(true),
      onMouseOut: () => setInputHover(false),
      style: { ...buttonStyles,
        backgroundColor: inputHover ? 'rgba(0, 0, 0, 0.14)' : 'white'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 170,
        columnNumber: 9
      }
    }, "Select Files"), supportsInputDirs && allowDirs && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        boxShadow: '1px 0 black',
        height: '100%'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 176,
        columnNumber: 13
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 176,
        columnNumber: 71
      }
    })), /*#__PURE__*/_react.default.createElement("input", _extends({
      type: "file",
      ref: dirInputRef
    }, inputProps, {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 177,
        columnNumber: 13
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      onClick: () => dirInputRef.current.click(),
      onMouseOver: () => setDirInputHover(true),
      onMouseOut: () => setDirInputHover(false),
      style: { ...buttonStyles,
        marginLeft: '8vmin',
        backgroundColor: dirInputHover ? 'rgba(0, 0, 0, 0.14)' : 'white'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 178,
        columnNumber: 13
      }
    }, "Select Folders"))));
  };

  var _default = FilePicker;
  exports.default = _default;
  helpers.postlude(module);
} finally {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
},{"react":"4uhoE","../../../node_modules/@parcel/transformer-react-refresh-wrap/lib/helpers/helpers.js":"1t8mc"}],"1t8mc":[function(require,module,exports) {
"use strict";

var Refresh = require('react-refresh/runtime');

function debounce(func, delay) {
  if ("development" === 'test') {
    return function (args) {
      func.call(null, args);
    };
  } else {
    var timeout = undefined;
    return function (args) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        timeout = undefined;
        func.call(null, args);
      }, delay);
    };
  }
}

var enqueueUpdate = debounce(function () {
  Refresh.performReactRefresh();
}, 30); // Everthing below is either adapted or copied from
// https://github.com/facebook/metro/blob/61de16bd1edd7e738dd0311c89555a644023ab2d/packages/metro/src/lib/polyfills/require.js
// MIT License - Copyright (c) Facebook, Inc. and its affiliates.

module.exports.prelude = function (module) {
  window.$RefreshReg$ = function (type, id) {
    Refresh.register(type, module.id + ' ' + id);
  };

  window.$RefreshSig$ = Refresh.createSignatureFunctionForTransform;
};

module.exports.postlude = function (module) {
  if (isReactRefreshBoundary(module.exports)) {
    registerExportsForReactRefresh(module);

    if (module.hot) {
      module.hot.dispose(function (data) {
        if (Refresh.hasUnrecoverableErrors()) {
          window.location.reload();
        }

        data.prevExports = module.exports;
      });
      module.hot.accept(function (getParents) {
        var prevExports = module.hot.data.prevExports;
        var nextExports = module.exports; // Since we just executed the code for it, it's possible
        // that the new exports make it ineligible for being a boundary.

        var isNoLongerABoundary = !isReactRefreshBoundary(nextExports); // It can also become ineligible if its exports are incompatible
        // with the previous exports.
        // For example, if you add/remove/change exports, we'll want
        // to re-execute the importing modules, and force those components
        // to re-render. Similarly, if you convert a class component
        // to a function, we want to invalidate the boundary.

        var didInvalidate = shouldInvalidateReactRefreshBoundary(prevExports, nextExports);

        if (isNoLongerABoundary || didInvalidate) {
          // We'll be conservative. The only case in which we won't do a full
          // reload is if all parent modules are also refresh boundaries.
          // In that case we'll add them to the current queue.
          var parents = getParents();

          if (parents.length === 0) {
            // Looks like we bubbled to the root. Can't recover from that.
            window.location.reload();
            return;
          }

          return parents;
        }

        enqueueUpdate();
      });
    }
  }
};

function isReactRefreshBoundary(exports) {
  if (Refresh.isLikelyComponentType(exports)) {
    return true;
  }

  if (exports == null || typeof exports !== 'object') {
    // Exit if we can't iterate over exports.
    return false;
  }

  var hasExports = false;
  var areAllExportsComponents = true;

  for (var key in exports) {
    hasExports = true;

    if (key === '__esModule') {
      continue;
    }

    var desc = Object.getOwnPropertyDescriptor(exports, key);

    if (desc && desc.get) {
      // Don't invoke getters as they may have side effects.
      return false;
    }

    var exportValue = exports[key];

    if (!Refresh.isLikelyComponentType(exportValue)) {
      areAllExportsComponents = false;
    }
  }

  return hasExports && areAllExportsComponents;
}

function shouldInvalidateReactRefreshBoundary(prevExports, nextExports) {
  var prevSignature = getRefreshBoundarySignature(prevExports);
  var nextSignature = getRefreshBoundarySignature(nextExports);

  if (prevSignature.length !== nextSignature.length) {
    return true;
  }

  for (var i = 0; i < nextSignature.length; i++) {
    if (prevSignature[i] !== nextSignature[i]) {
      return true;
    }
  }

  return false;
} // When this signature changes, it's unsafe to stop at this refresh boundary.


function getRefreshBoundarySignature(exports) {
  var signature = [];
  signature.push(Refresh.getFamilyByType(exports));

  if (exports == null || typeof exports !== 'object') {
    // Exit if we can't iterate over exports.
    // (This is important for legacy environments.)
    return signature;
  }

  for (var key in exports) {
    if (key === '__esModule') {
      continue;
    }

    var desc = Object.getOwnPropertyDescriptor(exports, key);

    if (desc && desc.get) {
      continue;
    }

    var exportValue = exports[key];
    signature.push(key);
    signature.push(Refresh.getFamilyByType(exportValue));
  }

  return signature;
}

function registerExportsForReactRefresh(module) {
  var exports = module.exports,
      id = module.id;
  Refresh.register(exports, id + ' %exports%');

  if (exports == null || typeof exports !== 'object') {
    // Exit if we can't iterate over exports.
    // (This is important for legacy environments.)
    return;
  }

  for (var key in exports) {
    var desc = Object.getOwnPropertyDescriptor(exports, key);

    if (desc && desc.get) {
      // Don't invoke getters as they may have side effects.
      continue;
    }

    var exportValue = exports[key];
    Refresh.register(exportValue, id + ' %exports% ' + key);
  }
}
},{"react-refresh/runtime":"3emQt"}],"r7mN8":[function(require,module,exports) {
"use strict";

var helpers = require("../../../node_modules/@parcel/transformer-react-refresh-wrap/lib/helpers/helpers.js");

var prevRefreshReg = window.$RefreshReg$;
var prevRefreshSig = window.$RefreshSig$;
helpers.prelude(module);

try {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = _interopRequireWildcard(require("react"));

  var _prism = require("./prism");

  require("./prism.css");

  var _sandbox = _interopRequireDefault(require("./sandbox"));

  var _jsxFileName = "/Users/arjunb/Dev/fflate/demo/components/code-box/index.tsx";

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  const canStream = ('stream' in File.prototype);
  const rn = 'Running...';
  const wt = 'Waiting...';
  const tm = typeof performance != 'undefined' ? () => performance.now() : () => Date.now();
  const presets = {
    'Basic GZIP compression': {
      fflate: `var left = files.length;
var filesLengths = {};
// This function binds the variable "file" to the local scope, which makes
// parallel processing possible.
// If you use ES6, you can declare variables with "let" to automatically bind
// the variable to the scope rather than using a separate function.
var processFile = function(i) {
  var file = files[i];
  fileToU8(file, function(buf) {
    fflate.gzip(buf, {
      level: 6,

      // These are optional, but fflate supports the metadata

      mtime: file.lastModified,
      filename: file.name
    }, function(err, data) {
      if (err) callback(err);
      else {
        filesLengths[file.name] = [data.length, file.size];
    
        // If you want to download the file to check it for yourself:
        // download(data, 'myFile.gz');
  
        // If everyone else has finished processing already...
        if (!--left) {
          // Then return.
          callback(prettySizes(filesLengths));
        }
      }
    });
  });
}
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`,
      uzip: `var left = files.length;
var filesLengths = {};
var processFile = function(i) {
  var file = files[i];
  fileToU8(file, function(buf) {

    // UZIP doesn't natively support GZIP, but I patched in support for it.
    // In other words, you're better off using fflate for GZIP.
  
    // Also, UZIP runs synchronously on the main thread. It relies on global
    // state, so you can't even run it in the background without causing bugs.
  
    // But just for the sake of a performance comparison, try it out.
    uzipWorker.gzip(buf, function(err, data) {
      if (err) callback(err);
      else {
        filesLengths[file.name] = [data.length, file.size];
        if (!--left) callback(prettySizes(filesLengths));
      }
    });
  });
}
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`,
      pako: `var left = files.length;
var filesLengths = {};
var processFile = function(i) {
  var file = files[i];
  fileToU8(file, function(buf) {

    // Unlike UZIP, Pako natively supports GZIP, and it doesn't rely on global
    // state. However, it's still 46kB for this basic functionality as opposed
    // to fflate's 7kB, not to mention the fact that there's no easy way to use
    // it asynchronously. I had to add a worker proxy for this to work.

    pakoWorker.gzip(buf, function(err, data) {
      if (err) callback(err)
      else {
        filesLengths[file.name] = [data.length, file.size];
        if (!--left) callback(prettySizes(filesLengths));
      }
    });
  });
}
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`
    },
    'ZIP archive creation': {
      fflate: `// fflate's ZIP API is asynchronous and parallelized (multithreaded)
var left = files.length;
var zipObj = {};
var ALREADY_COMPRESSED = [
  'zip', 'gz', 'png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'ppt', 'pptx',
  'xls', 'xlsx', 'heic', 'heif', '7z', 'bz2', 'rar', 'gif', 'webp', 'webm'
];

// Yet again, this is necessary for parallelization.
var processFile = function(i) {
  var file = files[i];
  var ext = file.name.slice(file.name.lastIndexOf('.') + 1);
  fileToU8(file, function(buf) {
    // With fflate, we can choose which files we want to compress
    zipObj[file.name] = [buf, {
      level: ALREADY_COMPRESSED.indexOf(ext) == -1 ? 6 : 0
    }];
    
    // If we didn't want to specify options:
    // zipObj[file.name] = buf;

    if (!--left) {
      fflate.zip(zipObj, {
        // If you want to control options for every file, you can do so here
        // They are merged with the per-file options (if they exist)
        // mem: 9
      }, function(err, out) {
        if (err) callback(err);
        else {
          // You may want to try downloading to see that fflate actually works:
          // download(out, 'fflate-demo.zip');
          callback('Length ' + out.length);
        }
      });
    }
  });
}
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`,
      uzip: `var left = files.length;
var processFile = function(i) {
  var file = files[i];
  fileToU8(file, function(buf) {
    // With UZIP, you cannot control the compression level of a file
    // However, it skips compressing ZIP, JPEG, and PNG files out of the box.
    zipObj.add(file.name, buf);
    if (!--left) {
      zipObj.ondata = function(err, out) {
        if (err) callback(err);
        else callback('Length ' + out.length);
      }
      zipObj.end();
    }
  });
}
// Reminder that this is custom sugar
var zipObj = uzipWorker.zip();
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`,
      pako: `var left = files.length;

// Internally, this uses JSZip. Despite its clean API, it suffers from
// abysmal performance and awful compression ratios, particularly in v3.2.0
// and up.
// If you choose JSZip, make sure to use v3.1.5 for adequate performance
// (2-3x slower than fflate) instead of the latest version, which is 20-30x
// slower than fflate.

var zipObj = pakoWorker.zip();
var processFile = function(i) {
  var file = files[i];
  fileToU8(file, function(buf) {
    // With JSZip, you cannot control the compression level of a file
    zipObj.add(file.name, buf);
    if (!--left) {
      zipObj.ondata = function(err, out) {
        if (err) callback(err);
        else callback('Length ' + out.length);
      }
      zipObj.end();
    }
  });
}
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`
    }
  };

  if (canStream) {
    presets['Streaming GZIP compression'] = {
      fflate: `const { AsyncGzip } = fflate;
// Theoretically, you could do this on every file, but I haven't done that here
// for the sake of simplicity.
const file = files[0];
const gzipStream = new AsyncGzip({ level: 6 });
// We can stream the file through GZIP to reduce memory usage
const fakeResponse = new Response(
  file.stream().pipeThrough(toNativeStream(gzipStream))
);
fakeResponse.arrayBuffer().then(buf => {
  callback('Length ' + buf.byteLength);
});`,
      uzip: `// UZIP doesn't support streaming to any extent
callback(new Error('unsupported'));`,
      pako: `// Hundreds of lines of code to make this run on a Worker...
const file = files[0];
// In case this wasn't clear already, Pako doesn't actually support this,
// you need to create a custom async stream. I suppose you could copy the
// code used in this demo, which is on GitHub under the demo/ directory.
const gzipStream = pakoWorker.createGzip();
const fakeResponse = new Response(
  file.stream().pipeThrough(toNativeStream(gzipStream))
);
fakeResponse.arrayBuffer().then(buf => {
  callback('Length ' + buf.byteLength);
});`
    };
  }

  const availablePresets = Object.keys(presets);

  const CodeHighlight = ({
    code,
    preset,
    onInput
  }) => {
    const highlight = (0, _react.useMemo)(() => ({
      __html: _prism.Prism.highlight(code + '\n', _prism.Prism.languages.javascript, 'javascript')
    }), [code]);
    const pre = (0, _react.useRef)(null);
    const ta = (0, _react.useRef)(null);
    (0, _react.useEffect)(() => {
      pre.current.addEventListener('scroll', () => {
        ta.current.scrollLeft = pre.current.scrollLeft;
        ta.current.style.left = pre.current.scrollLeft + 'px';
      }, {
        passive: true
      });
      ta.current.addEventListener('scroll', () => {
        pre.current.scrollLeft = ta.current.scrollLeft;
      }, {
        passive: true
      });
    }, []);
    (0, _react.useEffect)(() => {
      ta.current.value = code;
    }, [preset]);
    return /*#__PURE__*/_react.default.createElement("pre", {
      ref: pre,
      style: {
        position: 'relative',
        backgroundColor: '#2a2734',
        color: '#9a86fd',
        maxWidth: 'calc(90vw - 2em)',
        fontSize: '0.7em',
        marginTop: '1em',
        marginBottom: '1em',
        padding: '1em',
        overflow: 'auto',
        fontFamily: 'Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 255,
        columnNumber: 5
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      dangerouslySetInnerHTML: highlight,
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 267,
        columnNumber: 7
      }
    }), /*#__PURE__*/_react.default.createElement("textarea", {
      ref: ta,
      autoComplete: "off",
      autoCorrect: "off",
      autoCapitalize: "off",
      spellCheck: "false",
      style: {
        border: 0,
        resize: 'none',
        outline: 'none',
        position: 'absolute',
        background: 'transparent',
        whiteSpace: 'pre',
        top: 0,
        left: 0,
        width: 'calc(100% - 1em)',
        height: 'calc(100% - 2em)',
        overflow: 'hidden',
        lineHeight: 'inherit',
        fontSize: 'inherit',
        padding: 'inherit',
        paddingRight: 0,
        color: 'transparent',
        caretColor: 'white',
        fontFamily: 'inherit'
      },
      onKeyDown: e => {
        const t = e.currentTarget;
        let val = t.value;
        const loc = t.selectionStart;

        if (e.key == 'Enter') {
          const lastNL = val.lastIndexOf('\n', loc - 1);
          let indent = 0;

          for (; val.charCodeAt(indent + lastNL + 1) == 32; ++indent);

          const lastChar = val.charAt(loc - 1);
          const nextChar = val.charAt(loc);
          if (lastChar == '{' || lastChar == '(' || lastChar == '[') indent += 2;
          const addNL = nextChar == '}' || nextChar == ')' || nextChar == ']';
          const tail = val.slice(t.selectionEnd);
          val = val.slice(0, loc) + '\n';

          for (let i = 0; i < indent; ++i) val += ' ';

          if (addNL) {
            if (lastChar == '{' && nextChar == '}' || lastChar == '[' && nextChar == ']' || lastChar == '(' && nextChar == ')') {
              val += '\n';

              for (let i = 2; i < indent; ++i) val += ' ';
            } else {
              const end = Math.min(indent, 2);
              indent -= end;
              val = val.slice(0, -end);
            }
          }

          t.value = val += tail;
          t.selectionStart = t.selectionEnd = loc + indent + 1;
          ta.current.scrollLeft = 0;
        } else if (e.key == 'Tab') {
          t.value = val = val.slice(0, loc) + '  ' + val.slice(t.selectionEnd);
          t.selectionStart = t.selectionEnd = loc + 2;
        } else if (t.selectionStart == t.selectionEnd) {
          if (e.key == 'Backspace') {
            if (val.charCodeAt(loc - 1) == 32 && !val.slice(val.lastIndexOf('\n', loc - 1), loc).trim().length) {
              t.value = val.slice(0, loc - 1) + val.slice(loc);
              t.selectionStart = t.selectionEnd = loc - 1;
            } else if (val.charAt(loc - 1) == '{' && val.charAt(loc) == '}' || val.charAt(loc - 1) == '[' && val.charAt(loc) == ']' || val.charAt(loc - 1) == '(' && val.charAt(loc) == ')') {
              t.value = val.slice(0, loc) + val.slice(loc + 1); // hack, doesn't work always

              t.selectionStart = t.selectionEnd = loc;
            }

            return;
          } else {
            switch (e.key) {
              case '{':
              case '[':
              case '(':
                t.value = val = val.slice(0, loc) + (e.key == '{' ? '}' : e.key == '[' ? ']' : ')') + val.slice(loc);
                t.selectionStart = t.selectionEnd = loc;
                break;

              case '}':
              case ']':
              case ')':
                // BUG: if the cursor is moved, this false activates
                if (e.key == val.charAt(loc)) {
                  t.value = val.slice(0, loc) + val.slice(loc + 1);
                  t.selectionStart = t.selectionEnd = loc;
                } else {
                  const lastNL = val.lastIndexOf('\n', loc - 1);
                  const sl = val.slice(lastNL, loc);
                  const o = loc - (sl.length > 1 && !sl.trim().length ? 2 : 0);
                  t.value = val.slice(0, o) + val.slice(loc);
                  t.selectionStart = t.selectionEnd = o;
                }

            }

            return;
          }

          ;
        } else return;

        e.preventDefault();
        onInput(val);
      },
      onInput: e => onInput(e.currentTarget.value),
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 268,
        columnNumber: 7
      }
    }, code));
  };

  const CodeBox = ({
    files,
    forwardRef
  }) => {
    const [preset, setPreset] = (0, _react.useState)('Basic GZIP compression');
    const [{
      fflate,
      uzip,
      pako
    }, setCodes] = (0, _react.useState)(presets[preset]);
    const [ffl, setFFL] = (0, _react.useState)('');
    const [uz, setUZ] = (0, _react.useState)('');
    const [pk, setPK] = (0, _react.useState)('');
    (0, _react.useEffect)(() => {
      if (!files) {
        setFFL('');
        setUZ('');
        setPK('');
      }
    }, [files]);

    const onInput = (lib, code) => {
      const codes = {
        fflate,
        uzip,
        pako
      };
      codes[lib] = code;
      setCodes(codes);
      setPreset('Custom');
    };

    const [hover, setHover] = (0, _react.useState)(false);
    return /*#__PURE__*/_react.default.createElement("div", {
      ref: forwardRef,
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flexWrap: 'wrap'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 406,
        columnNumber: 5
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 414,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("label", {
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 415,
        columnNumber: 7
      }
    }, "Preset: "), /*#__PURE__*/_react.default.createElement("select", {
      value: preset,
      onChange: e => {
        let newPreset = e.currentTarget.value;
        if (newPreset != 'Custom') setCodes(presets[newPreset]);
        setPreset(newPreset);
      },
      style: {
        marginTop: '2em'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 416,
        columnNumber: 9
      }
    }, availablePresets.map(preset => /*#__PURE__*/_react.default.createElement("option", {
      key: preset,
      value: preset,
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 423,
        columnNumber: 43
      }
    }, preset)), /*#__PURE__*/_react.default.createElement("option", {
      value: "Custom",
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 424,
        columnNumber: 11
      }
    }, "Custom"))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
        flexWrap: 'wrap'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 427,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        padding: '2vmin'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 435,
        columnNumber: 9
      }
    }, "fflate:", /*#__PURE__*/_react.default.createElement(CodeHighlight, {
      code: fflate,
      preset: preset,
      onInput: t => onInput('fflate', t),
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 437,
        columnNumber: 11
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: ffl
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 438,
        columnNumber: 11
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 440,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        padding: '2vmin'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 446,
        columnNumber: 11
      }
    }, "UZIP (shimmed):", /*#__PURE__*/_react.default.createElement(CodeHighlight, {
      code: uzip,
      preset: preset,
      onInput: t => onInput('uzip', t),
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 448,
        columnNumber: 13
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: uz
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 449,
        columnNumber: 13
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        padding: '2vmin'
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 451,
        columnNumber: 11
      }
    }, "Pako (shimmed):", /*#__PURE__*/_react.default.createElement(CodeHighlight, {
      code: pako,
      preset: preset,
      onInput: t => onInput('pako', t),
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 453,
        columnNumber: 13
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: pk
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 454,
        columnNumber: 13
      }
    })))), /*#__PURE__*/_react.default.createElement("button", {
      disabled: pk == 'Waiting...' || pk == 'Running...',
      style: {
        cursor: 'default',
        width: '20vmin',
        height: '6vh',
        fontSize: '1.25em',
        margin: '1vmin',
        padding: '1vmin',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px 1px rgba(0, 0, 0, 0.2), 0 2px 4px 2px rgba(0, 0, 0, 0.15), 0 4px 8px 4px rgba(0, 0, 0, 0.12)',
        border: '1px solid black',
        borderRadius: '6px',
        transition: 'background-color 300ms ease-in-out',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        MozUserSelect: 'none',
        userSelect: 'none',
        outline: 'none',
        backgroundColor: hover ? 'rgba(0, 0, 0, 0.2)' : 'white'
      },
      onMouseOver: () => setHover(true),
      onMouseLeave: () => setHover(false),
      onClick: () => {
        setHover(false);
        const ts = tm();
        setFFL(rn);
        setUZ(wt);
        setPK(wt);
        (0, _sandbox.default)(fflate, files, out => {
          const tf = tm();
          setFFL('Finished in <span style="font-weight:bold">' + (tf - ts).toFixed(3) + 'ms</span>: ' + out);
          (0, _sandbox.default)(uzip, files, out => {
            const tu = tm();
            setUZ('Finished in <span style="font-weight:bold">' + (tu - tf).toFixed(3) + 'ms:</span> ' + out);
            (0, _sandbox.default)(pako, files, out => {
              setPK('Finished in <span style="font-weight:bold">' + (tm() - tu).toFixed(3) + 'ms:</span> ' + out);
            });
          });
        });
      },
      __self: void 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 458,
        columnNumber: 7
      }
    }, "Run"));
  };

  var _default = CodeBox;
  exports.default = _default;
  helpers.postlude(module);
} finally {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
},{"react":"4uhoE","./prism":"34QQc","./prism.css":"KqWt4","./sandbox":"4lfLh","../../../node_modules/@parcel/transformer-react-refresh-wrap/lib/helpers/helpers.js":"1t8mc"}],"34QQc":[function(require,module,exports) {
/* PrismJS 1.22.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=clike+javascript */
var Prism = function (u) {
  var c = /\blang(?:uage)?-([\w-]+)\b/i,
      n = 0,
      M = {
    manual: u.Prism && u.Prism.manual,
    disableWorkerMessageHandler: u.Prism && u.Prism.disableWorkerMessageHandler,
    util: {
      encode: function e(n) {
        return n instanceof W ? new W(n.type, e(n.content), n.alias) : Array.isArray(n) ? n.map(e) : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
      },
      type: function (e) {
        return Object.prototype.toString.call(e).slice(8, -1);
      },
      objId: function (e) {
        return e.__id || Object.defineProperty(e, "__id", {
          value: ++n
        }), e.__id;
      },
      clone: function t(e, r) {
        var a, n;

        switch (r = r || {}, M.util.type(e)) {
          case "Object":
            if (n = M.util.objId(e), r[n]) return r[n];

            for (var i in a = {}, r[n] = a, e) e.hasOwnProperty(i) && (a[i] = t(e[i], r));

            return a;

          case "Array":
            return n = M.util.objId(e), r[n] ? r[n] : (a = [], r[n] = a, e.forEach(function (e, n) {
              a[n] = t(e, r);
            }), a);

          default:
            return e;
        }
      },
      getLanguage: function (e) {
        for (; e && !c.test(e.className);) e = e.parentElement;

        return e ? (e.className.match(c) || [, "none"])[1].toLowerCase() : "none";
      },
      currentScript: function () {
        if ("undefined" == typeof document) return null;
        if ("currentScript" in document) return document.currentScript;

        try {
          throw new Error();
        } catch (e) {
          var n = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(e.stack) || [])[1];

          if (n) {
            var t = document.getElementsByTagName("script");

            for (var r in t) if (t[r].src == n) return t[r];
          }

          return null;
        }
      },
      isActive: function (e, n, t) {
        for (var r = "no-" + n; e;) {
          var a = e.classList;
          if (a.contains(n)) return !0;
          if (a.contains(r)) return !1;
          e = e.parentElement;
        }

        return !!t;
      }
    },
    languages: {
      extend: function (e, n) {
        var t = M.util.clone(M.languages[e]);

        for (var r in n) t[r] = n[r];

        return t;
      },
      insertBefore: function (t, e, n, r) {
        var a = (r = r || M.languages)[t],
            i = {};

        for (var l in a) if (a.hasOwnProperty(l)) {
          if (l == e) for (var o in n) n.hasOwnProperty(o) && (i[o] = n[o]);
          n.hasOwnProperty(l) || (i[l] = a[l]);
        }

        var s = r[t];
        return r[t] = i, M.languages.DFS(M.languages, function (e, n) {
          n === s && e != t && (this[e] = i);
        }), i;
      },
      DFS: function e(n, t, r, a) {
        a = a || {};
        var i = M.util.objId;

        for (var l in n) if (n.hasOwnProperty(l)) {
          t.call(n, l, n[l], r || l);
          var o = n[l],
              s = M.util.type(o);
          "Object" !== s || a[i(o)] ? "Array" !== s || a[i(o)] || (a[i(o)] = !0, e(o, t, l, a)) : (a[i(o)] = !0, e(o, t, null, a));
        }
      }
    },
    plugins: {},
    highlightAll: function (e, n) {
      M.highlightAllUnder(document, e, n);
    },
    highlightAllUnder: function (e, n, t) {
      var r = {
        callback: t,
        container: e,
        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
      };
      M.hooks.run("before-highlightall", r), r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)), M.hooks.run("before-all-elements-highlight", r);

      for (var a, i = 0; a = r.elements[i++];) M.highlightElement(a, !0 === n, r.callback);
    },
    highlightElement: function (e, n, t) {
      var r = M.util.getLanguage(e),
          a = M.languages[r];
      e.className = e.className.replace(c, "").replace(/\s+/g, " ") + " language-" + r;
      var i = e.parentElement;
      i && "pre" === i.nodeName.toLowerCase() && (i.className = i.className.replace(c, "").replace(/\s+/g, " ") + " language-" + r);
      var l = {
        element: e,
        language: r,
        grammar: a,
        code: e.textContent
      };

      function o(e) {
        l.highlightedCode = e, M.hooks.run("before-insert", l), l.element.innerHTML = l.highlightedCode, M.hooks.run("after-highlight", l), M.hooks.run("complete", l), t && t.call(l.element);
      }

      if (M.hooks.run("before-sanity-check", l), !l.code) return M.hooks.run("complete", l), void (t && t.call(l.element));
      if (M.hooks.run("before-highlight", l), l.grammar) {
        if (n && u.Worker) {
          var s = new Worker(M.filename);
          s.onmessage = function (e) {
            o(e.data);
          }, s.postMessage(JSON.stringify({
            language: l.language,
            code: l.code,
            immediateClose: !0
          }));
        } else o(M.highlight(l.code, l.grammar, l.language));
      } else o(M.util.encode(l.code));
    },
    highlight: function (e, n, t) {
      var r = {
        code: e,
        grammar: n,
        language: t
      };
      return M.hooks.run("before-tokenize", r), r.tokens = M.tokenize(r.code, r.grammar), M.hooks.run("after-tokenize", r), W.stringify(M.util.encode(r.tokens), r.language);
    },
    tokenize: function (e, n) {
      var t = n.rest;

      if (t) {
        for (var r in t) n[r] = t[r];

        delete n.rest;
      }

      var a = new i();
      return I(a, a.head, e), function e(n, t, r, a, i, l) {
        for (var o in r) if (r.hasOwnProperty(o) && r[o]) {
          var s = r[o];
          s = Array.isArray(s) ? s : [s];

          for (var u = 0; u < s.length; ++u) {
            if (l && l.cause == o + "," + u) return;
            var c = s[u],
                g = c.inside,
                f = !!c.lookbehind,
                h = !!c.greedy,
                d = 0,
                v = c.alias;

            if (h && !c.pattern.global) {
              var p = c.pattern.toString().match(/[imsuy]*$/)[0];
              c.pattern = RegExp(c.pattern.source, p + "g");
            }

            for (var m = c.pattern || c, y = a.next, k = i; y !== t.tail && !(l && k >= l.reach); k += y.value.length, y = y.next) {
              var b = y.value;
              if (t.length > n.length) return;

              if (!(b instanceof W)) {
                var x = 1;

                if (h && y != t.tail.prev) {
                  m.lastIndex = k;
                  var w = m.exec(n);
                  if (!w) break;
                  var A = w.index + (f && w[1] ? w[1].length : 0),
                      P = w.index + w[0].length,
                      S = k;

                  for (S += y.value.length; S <= A;) y = y.next, S += y.value.length;

                  if (S -= y.value.length, k = S, y.value instanceof W) continue;

                  for (var E = y; E !== t.tail && (S < P || "string" == typeof E.value); E = E.next) x++, S += E.value.length;

                  x--, b = n.slice(k, S), w.index -= k;
                } else {
                  m.lastIndex = 0;
                  var w = m.exec(b);
                }

                if (w) {
                  f && (d = w[1] ? w[1].length : 0);
                  var A = w.index + d,
                      O = w[0].slice(d),
                      P = A + O.length,
                      L = b.slice(0, A),
                      N = b.slice(P),
                      j = k + b.length;
                  l && j > l.reach && (l.reach = j);
                  var C = y.prev;
                  L && (C = I(t, C, L), k += L.length), z(t, C, x);

                  var _ = new W(o, g ? M.tokenize(O, g) : O, v, O);

                  y = I(t, C, _), N && I(t, y, N), 1 < x && e(n, t, r, y.prev, k, {
                    cause: o + "," + u,
                    reach: j
                  });
                }
              }
            }
          }
        }
      }(e, a, n, a.head, 0), function (e) {
        var n = [],
            t = e.head.next;

        for (; t !== e.tail;) n.push(t.value), t = t.next;

        return n;
      }(a);
    },
    hooks: {
      all: {},
      add: function (e, n) {
        var t = M.hooks.all;
        t[e] = t[e] || [], t[e].push(n);
      },
      run: function (e, n) {
        var t = M.hooks.all[e];
        if (t && t.length) for (var r, a = 0; r = t[a++];) r(n);
      }
    },
    Token: W
  };

  function W(e, n, t, r) {
    this.type = e, this.content = n, this.alias = t, this.length = 0 | (r || "").length;
  }

  function i() {
    var e = {
      value: null,
      prev: null,
      next: null
    },
        n = {
      value: null,
      prev: e,
      next: null
    };
    e.next = n, this.head = e, this.tail = n, this.length = 0;
  }

  function I(e, n, t) {
    var r = n.next,
        a = {
      value: t,
      prev: n,
      next: r
    };
    return n.next = a, r.prev = a, e.length++, a;
  }

  function z(e, n, t) {
    for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next;

    (n.next = r).prev = n, e.length -= a;
  }

  if (u.Prism = M, W.stringify = function n(e, t) {
    if ("string" == typeof e) return e;

    if (Array.isArray(e)) {
      var r = "";
      return e.forEach(function (e) {
        r += n(e, t);
      }), r;
    }

    var a = {
      type: e.type,
      content: n(e.content, t),
      tag: "span",
      classes: ["token", e.type],
      attributes: {},
      language: t
    },
        i = e.alias;
    i && (Array.isArray(i) ? Array.prototype.push.apply(a.classes, i) : a.classes.push(i)), M.hooks.run("wrap", a);
    var l = "";

    for (var o in a.attributes) l += " " + o + '="' + (a.attributes[o] || "").replace(/"/g, "&quot;") + '"';

    return "<" + a.tag + ' class="' + a.classes.join(" ") + '"' + l + ">" + a.content + "</" + a.tag + ">";
  }, !u.document) return u.addEventListener && (M.disableWorkerMessageHandler || u.addEventListener("message", function (e) {
    var n = JSON.parse(e.data),
        t = n.language,
        r = n.code,
        a = n.immediateClose;
    u.postMessage(M.highlight(r, M.languages[t], t)), a && u.close();
  }, !1)), M;
  var e = M.util.currentScript();

  function t() {
    M.manual || M.highlightAll();
  }

  if (e && (M.filename = e.src, e.hasAttribute("data-manual") && (M.manual = !0)), !M.manual) {
    var r = document.readyState;
    "loading" === r || "interactive" === r && e && e.defer ? document.addEventListener("DOMContentLoaded", t) : window.requestAnimationFrame ? window.requestAnimationFrame(t) : window.setTimeout(t, 16);
  }

  return M;
}(module.exports);

Prism.languages.clike = {
  comment: [{
    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    lookbehind: !0
  }, {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: !0,
    greedy: !0
  }],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  "class-name": {
    pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: {
      punctuation: /[.\\]/
    }
  },
  keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [Prism.languages.clike["class-name"], {
    pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
    lookbehind: !0
  }],
  keyword: [{
    pattern: /((?:^|})\s*)(?:catch|finally)\b/,
    lookbehind: !0
  }, {
    pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    lookbehind: !0
  }],
  number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
}), Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/, Prism.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      "regex-source": {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: !0,
        alias: "language-regex",
        inside: Prism.languages.regex
      },
      "regex-flags": /[a-z]+$/,
      "regex-delimiter": /^\/|\/$/
    }
  },
  "function-variable": {
    pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
    alias: "function"
  },
  parameter: [{
    pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }, {
    pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
    inside: Prism.languages.javascript
  }, {
    pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }, {
    pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
    lookbehind: !0,
    inside: Prism.languages.javascript
  }],
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
}), Prism.languages.insertBefore("javascript", "string", {
  "template-string": {
    pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
    greedy: !0,
    inside: {
      "template-punctuation": {
        pattern: /^`|`$/,
        alias: "string"
      },
      interpolation: {
        pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
        lookbehind: !0,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\${|}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      string: /[\s\S]+/
    }
  }
}), Prism.languages.markup && Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.js = Prism.languages.javascript;
module.exports.Prism = Prism;
},{}],"KqWt4":[function() {},{}],"4lfLh":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var fflate = _interopRequireWildcard(require("../../.."));

var _streamAdapter = _interopRequireDefault(require("./stream-adapter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const concat = chunks => {
  const out = new Uint8Array(chunks.reduce((a, v) => v.length + a, 0));
  let loc = 0;

  for (const chunk of chunks) {
    out.set(chunk, loc);
    loc += chunk.length;
  }

  return out;
};

const createWorkerProxy = (lib, keys) => {
  const p = {};

  for (const k of keys) {
    const base = function (cb) {
      const w = new Worker(require("../../util/workers.ts"));
      w.postMessage([lib, k]);

      w.onmessage = function (msg) {
        const args = msg.data;
        args.unshift(null);
        cb.apply(null, args);
      };

      w.onerror = err => cb(err);

      return w;
    };

    if (k != 'zip' && k != 'unzip') {
      p[k] = function (dat, cb) {
        const chks = [];
        const w = base((err, dat, final) => {
          if (err) cb(err);else {
            if (final) {
              if (!chks.length) cb(null, dat);else cb(null, concat(chks));
            } else chks.push(dat);
          }
        });
        w.postMessage([dat, true], [dat.buffer]);
      };

      p['create' + k.slice(0, 1).toUpperCase() + k.slice(1)] = function () {
        let trueCb = arguments[0];
        const w = base((err, dat, final) => {
          trueCb(err, dat, final);
        });
        const out = {
          ondata: trueCb,

          push(v, f) {
            if (!out.ondata) throw 'no callback';
            trueCb = out.ondata;
            w.postMessage([v, f], [v.buffer]);
          },

          terminate() {
            w.terminate();
          }

        };
        return out;
      };
    } else {
      p[k] = function () {
        let trueCb = arguments[0];
        const w = base((err, dat) => {
          trueCb(err, dat);
        });
        const out = {
          ondata: trueCb,

          add(name, buf) {
            buf = new Uint8Array(buf);
            w.postMessage([name, buf], [buf.buffer]);
          },

          end() {
            if (!out.ondata) throw 'no callback';
            trueCb = out.ondata;
            w.postMessage(null);
          }

        };
        return out;
      };
    }
  }

  return p;
};

const keys = ['zip', 'unzip', 'deflate', 'inflate', 'gzip', 'gunzip', 'zlib', 'unzlib'];
const uzipWorker = createWorkerProxy('uzip', keys);
const pakoWorker = createWorkerProxy('pako', keys);

const fileToU8 = (file, cb) => {
  const fr = new FileReader();

  fr.onloadend = () => {
    cb(new Uint8Array(fr.result));
  };

  fr.readAsArrayBuffer(file);
};

const download = (file, name) => {
  const url = URL.createObjectURL(new Blob([file]));
  const dl = document.createElement('a');
  dl.download = name || 'fflate-demo-' + Date.now() + '.dat';
  dl.href = url;
  dl.click();
  URL.revokeObjectURL(url);
};

const bts = ['B', ' kB', ' MB', ' GB'];

const hrbt = bt => {
  let i = 0;

  for (; bt > 1023; ++i) bt /= 1024;

  return bt.toFixed(i != 0) + bts[i];
};

const prettySizes = files => {
  let out = '\n\n';
  let tot = 0;
  let totc = 0;
  let cnt = 0;

  for (const k in files) {
    ++cnt;
    out += '<span style="font-weight:bold">' + k + '</span> compressed from <span style="font-weight:bold;color:red">' + hrbt(files[k][1]) + '</span> to <span style="font-weight:bold;color:green">' + hrbt(files[k][0]) + '</span>\n';
    totc += files[k][0];
    tot += files[k][1];
  }

  return out + (cnt > 1 ? '\n\n<span style="font-weight:bold">In total, all files originally <span style="font-style:italic;color:red">' + hrbt(tot) + '</span>, compressed to <span style="font-style:italic;color:green">' + hrbt(totc) + '</span></span>' : '');
};

const exec = (code, files, callback) => {
  const scope = {
    fflate,
    uzipWorker,
    pakoWorker,
    toNativeStream: _streamAdapter.default,
    callback,
    fileToU8,
    files,
    download,
    prettySizes
  };

  try {
    new Function('"use strict";' + Object.keys(scope).map(k => 'var ' + k + ' = this["' + k + '"];').join('') + code).call(scope);
  } catch (e) {
    callback(e);
  }
};

var _default = exec;
exports.default = _default;
},{"./stream-adapter":"51P0v","../../util/workers.ts":"3XBnh","../../..":"3Zx7k"}],"51P0v":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = stream => {
  const writable = new WritableStream({
    write(dat) {
      stream.push(dat);
    },

    close() {
      stream.push(new Uint8Array(0), true);
    }

  });
  const readable = new ReadableStream({
    start(controller) {
      stream.ondata = (err, chunk, final) => {
        if (err) writable.abort(err.message);
        controller.enqueue(chunk);
        if (final) controller.close();
      };
    }

  });
  return {
    readable,
    writable
  };
};

exports.default = _default;
},{}],"3XBnh":[function(require,module,exports) {
module.exports = require('./get-worker-url')(require('./relative-path')("6ZU7a", "ICYPF"));
},{"./get-worker-url":"3jI9r","./relative-path":"Q4PMS"}],"3jI9r":[function(require,module,exports) {
"use strict";

/* global self, Blob */
var bundleUrl = require('./bundle-url');

module.exports = function (relativePath) {
  var workerUrl = bundleUrl.getBundleURL() + relativePath;

  if (bundleUrl.getOrigin(workerUrl) === self.location.origin) {
    // If the worker bundle's url is on the same origin as the document,
    // use the worker bundle's own url.
    return workerUrl;
  } else {
    // Otherwise, create a blob URL which loads the worker bundle with `importScripts`.
    return URL.createObjectURL(new Blob(['importScripts(' + JSON.stringify(workerUrl) + ');']));
  }
};
},{"./bundle-url":"10N7P"}],"10N7P":[function(require,module,exports) {
"use strict";

/* globals document:readonly */
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
} // TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.


function getOrigin(url) {
  let matches = ('' + url).match(/(https?|file|ftp):\/\/[^/]+/);

  if (!matches) {
    throw new Error('Origin not found');
  }

  return matches[0];
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;
},{}],"Q4PMS":[function(require,module,exports) {
"use strict";

var resolve = require('./bundle-manifest').resolve;

module.exports = function (fromId, toId) {
  return relative(dirname(resolve(fromId)), resolve(toId));
};

function dirname(_filePath) {
  if (_filePath === '') {
    return '.';
  }

  var filePath = _filePath[_filePath.length - 1] === '/' ? _filePath.slice(0, _filePath.length - 1) : _filePath;
  var slashIndex = filePath.lastIndexOf('/');
  return slashIndex === -1 ? '.' : filePath.slice(0, slashIndex);
}

function relative(from, to) {
  if (from === to) {
    return '';
  }

  var fromParts = from.split('/');

  if (fromParts[0] === '.') {
    fromParts.shift();
  }

  var toParts = to.split('/');

  if (toParts[0] === '.') {
    toParts.shift();
  } // Find where path segments diverge.


  var i;
  var divergeIndex;

  for (i = 0; (i < toParts.length || i < fromParts.length) && divergeIndex == null; i++) {
    if (fromParts[i] !== toParts[i]) {
      divergeIndex = i;
    }
  } // If there are segments from "from" beyond the point of divergence,
  // return back up the path to that point using "..".


  var parts = [];

  for (i = 0; i < fromParts.length - divergeIndex; i++) {
    parts.push('..');
  } // If there are segments from "to" beyond the point of divergence,
  // continue using the remaining segments.


  if (toParts.length > divergeIndex) {
    parts.push.apply(parts, toParts.slice(divergeIndex));
  }

  return parts.join('/');
}

module.exports._dirname = dirname;
module.exports._relative = relative;
},{"./bundle-manifest":"5G1rV"}],"3Zx7k":[function(require,module,exports) {
"use strict"; // DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad

exports.__esModule = true;
exports.unzipSync = exports.unzip = exports.zipSync = exports.zip = exports.strFromU8 = exports.strToU8 = exports.decompressSync = exports.decompress = exports.AsyncDecompress = exports.Decompress = exports.Compress = exports.compressSync = exports.AsyncCompress = exports.compress = exports.unzlibSync = exports.unzlib = exports.AsyncUnzlib = exports.Unzlib = exports.zlibSync = exports.zlib = exports.AsyncZlib = exports.Zlib = exports.gunzipSync = exports.gunzip = exports.AsyncGunzip = exports.Gunzip = exports.gzipSync = exports.gzip = exports.AsyncGzip = exports.Gzip = exports.inflateSync = exports.inflate = exports.AsyncInflate = exports.Inflate = exports.deflateSync = exports.deflate = exports.AsyncDeflate = exports.Deflate = void 0; // Much of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// Many optimizations have been made, so the bundle size is ultimately smaller but performance is similar.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).

var node_worker_1 = require("./node-worker"); // aliases for shorter compressed code (most minifers don't do this)


var u8 = Uint8Array,
    u16 = Uint16Array,
    u32 = Uint32Array;

var mskr = function (v, o) {
  for (var i = 0; i < 32; ++i) o[i] = (1 << v[i]) - 1;

  return o;
}; // fixed length extra bits


var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0,
/* unused */
0, 0,
/* impossible */
0]),
    flebmsk = mskr(fleb, new u8(32)); // fixed distance extra bits
// see fleb note

var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13,
/* unused */
0, 0]),
    fdebmsk = mskr(fdeb, new u16(32)); // code length index map

var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]); // get base, reverse index map from extra bits

var freb = function (eb, start) {
  var b = new u16(31);

  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  } // numbers here are at max 18 bits


  var r = new u32(b[30]);

  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }

  return [b, r];
};

var _a = freb(fleb, 2),
    fl = _a[0],
    revfl = _a[1]; // we can ignore the fact that the other numbers are wrong; they never happen anyway


fl[28] = 258, revfl[258] = 28;

var _b = freb(fdeb, 0),
    fd = _b[0],
    revfd = _b[1]; // map of value to reverse (assuming 16 bits)


var rev = new u16(32768);

for (var i = 0; i < 32768; ++i) {
  // reverse table algorithm from UZIP.js
  var x = (i & 0xAAAAAAAA) >>> 1 | (i & 0x55555555) << 1;
  x = (x & 0xCCCCCCCC) >>> 2 | (x & 0x33333333) << 2;
  x = (x & 0xF0F0F0F0) >>> 4 | (x & 0x0F0F0F0F) << 4;
  rev[i] = ((x & 0xFF00FF00) >>> 8 | (x & 0x00FF00FF) << 8) >>> 1;
} // create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?


var hMap = function (cd, mb, r) {
  var s = cd.length; // index

  var i = 0; // u16 "map": index -> # of codes with bit length = index

  var l = new u16(mb); // length of cd must be 288 (total # of codes)

  for (; i < s; ++i) ++l[cd[i] - 1]; // u16 "map": index -> minimum code for bit length = index


  var le = new u16(mb);

  for (i = 0; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }

  var co;

  if (r) {
    // u16 "map": index -> number of actual bits, symbol for code
    co = new u16(1 << mb); // bits to remove for reverser

    var rvb = 15 - mb;

    for (i = 0; i < s; ++i) {
      // ignore 0 lengths
      if (cd[i]) {
        // num encoding both symbol and bits read
        var sv = i << 4 | cd[i]; // free bits

        var r_1 = mb - cd[i]; // start value

        var v = le[cd[i] - 1]++ << r_1; // m is end value

        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          // every 16 bit value starting with the code yields the same result
          co[rev[v] >>> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);

    for (i = 0; i < s; ++i) co[i] = rev[le[cd[i] - 1]++] >>> 15 - cd[i];
  }

  return co;
}; // fixed length tree


var flt = new u8(288);

for (var i = 0; i < 144; ++i) flt[i] = 8;

for (var i = 144; i < 256; ++i) flt[i] = 9;

for (var i = 256; i < 280; ++i) flt[i] = 7;

for (var i = 280; i < 288; ++i) flt[i] = 8; // fixed distance tree


var fdt = new u8(32);

for (var i = 0; i < 32; ++i) fdt[i] = 5; // fixed length map


var flm = hMap(flt, 9, 0),
    flrm = hMap(flt, 9, 1); // fixed distance map

var fdm = hMap(fdt, 5, 0),
    fdrm = hMap(fdt, 5, 1); // find max of array

var max = function (a) {
  var m = a[0];

  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m) m = a[i];
  }

  return m;
}; // read d, starting at bit p and mask with m


var bits = function (d, p, m) {
  var o = p >>> 3;
  return (d[o] | d[o + 1] << 8) >>> (p & 7) & m;
}; // read d, starting at bit p continuing for at least 16 bits


var bits16 = function (d, p) {
  var o = p >>> 3;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >>> (p & 7);
}; // get end of byte


var shft = function (p) {
  return (p >>> 3) + (p & 7 && 1);
}; // typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice


var slc = function (v, s, e) {
  if (s == null || s < 0) s = 0;
  if (e == null || e > v.length) e = v.length;
  var n = new v.constructor(e - s);
  n.set(v.subarray(s, e));
  return n;
}; // expands raw DEFLATE data


var inflt = function (dat, buf, st) {
  var noSt = !st || st.i;
  if (!st) st = {}; // source length

  var sl = dat.length; // have to estimate size

  var noBuf = !buf || st; // Assumes roughly 33% compression ratio average

  if (!buf) buf = new u8(sl * 3); // ensure buffer can fit at least l elements

  var cbuf = noBuf ? function (l) {
    var bl = buf.length; // need to increase size to fit

    if (l > bl) {
      // Double or set to necessary, whichever is greater
      var nbuf = new u8(Math.max(bl << 1, l));
      nbuf.set(buf);
      buf = nbuf;
    }
  } : function () {}; //  last chunk         bitpos           bytes

  var final = st.f || 0,
      pos = st.p || 0,
      bt = st.b || 0,
      lm = st.l,
      dm = st.d,
      lbt = st.m,
      dbt = st.n;
  if (final && !lm) return buf; // total bits

  var tbts = sl << 3;

  do {
    if (!lm) {
      // BFINAL - this is only 1 when last chunk is next
      st.f = final = bits(dat, pos, 1); // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman

      var type = bits(dat, pos + 1, 3);
      pos += 3;

      if (!type) {
        // go to end of byte boundary
        var s = shft(pos) + 4,
            l = dat[s - 4] | dat[s - 3] << 8,
            t = s + l;

        if (t > sl) {
          if (noSt) throw 'unexpected EOF';
          break;
        } // ensure size


        cbuf(bt + l); // Copy over uncompressed data

        buf.set(dat.subarray(s, t), bt); // Get new bitpos, update byte count

        st.b = bt += l, st.p = pos = t << 3;
        continue;
      } else if (type == 1) lm = flrm, dm = fdrm, lbt = 9, dbt = 5;else if (type == 2) {
        //  literal                          dist                               lengths
        var hLit = bits(dat, pos, 31) + 257,
            hDist = bits(dat, pos + 5, 31) + 1,
            hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + hDist;
        pos += 14; // length+distance tree

        var ldt = new u8(tl); // code length tree

        var clt = new u8(19);

        for (var i = 0; i < hcLen; ++i) {
          // use index map to get real code
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }

        pos += hcLen * 3; // code lengths bits

        var clb = max(clt),
            clbmsk = (1 << clb) - 1;
        if (!noSt && pos + tl * (clb + 7) > tbts) break; // code lengths map

        var clm = hMap(clt, clb, 1);

        for (var i = 0; i < ldt.length;) {
          var r = clm[bits(dat, pos, clbmsk)]; // bits read

          pos += r & 15; // symbol

          var s = r >>> 4; // code length to copy

          if (s < 16) {
            ldt[i++] = s;
          } else {
            //  copy   count
            var c = 0,
                n = 0;
            if (s == 16) n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];else if (s == 17) n = 3 + bits(dat, pos, 7), pos += 3;else if (s == 18) n = 11 + bits(dat, pos, 127), pos += 7;

            while (n--) ldt[i++] = c;
          }
        } //    length tree                 distance tree


        var lt = ldt.subarray(0, hLit),
            dt = ldt.subarray(hLit); // max length bits

        lbt = max(lt); // max dist bits

        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else throw 'invalid block type';

      if (pos > tbts) throw 'unexpected EOF';
    } // Make sure the buffer can hold this + the largest possible addition
    // maximum chunk size (practically, theoretically infinite) is 2^17;


    cbuf(bt + 131072);
    var lms = (1 << lbt) - 1,
        dms = (1 << dbt) - 1;
    var mxa = lbt + dbt + 18;

    while (noSt || pos + mxa < tbts) {
      // bits read, code
      var c = lm[bits16(dat, pos) & lms],
          sym = c >>> 4;
      pos += c & 15;
      if (pos > tbts) throw 'unexpected EOF';
      if (!c) throw 'invalid length/literal';
      if (sym < 256) buf[bt++] = sym;else if (sym == 256) {
        lm = null;
        break;
      } else {
        var add = sym - 254; // no extra bits needed if less

        if (sym > 264) {
          // index
          var i = sym - 257;
          add = bits(dat, pos, flebmsk[i]) + fl[i];
          pos += fleb[i];
        } // dist


        var d = dm[bits16(dat, pos) & dms],
            dsym = d >>> 4;
        if (!d) throw 'invalid distance';
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) dt += bits16(dat, pos) & fdebmsk[dsym], pos += fdeb[dsym];
        if (pos > tbts) throw 'unexpected EOF';
        cbuf(bt + 131072);
        var end = bt + add;

        while (bt < end) {
          buf[bt] = buf[bt++ - dt];
          buf[bt] = buf[bt++ - dt];
          buf[bt] = buf[bt++ - dt];
        }

        bt = end;
      }
    }

    st.l = lm, st.p = pos, st.b = bt;
    if (lm) final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);

  return bt == buf.length ? buf : slc(buf, 0, bt);
}; // starting at p, write the minimum number of bits that can hold v to ds


var wbits = function (d, p, v) {
  v <<= p & 7;
  var o = p >>> 3;
  d[o] |= v;
  d[o + 1] |= v >>> 8;
}; // starting at p, write the minimum number of bits (>8) that can hold v to ds


var wbits16 = function (d, p, v) {
  v <<= p & 7;
  var o = p >>> 3;
  d[o] |= v;
  d[o + 1] |= v >>> 8;
  d[o + 2] |= v >>> 16;
}; // creates code lengths from a frequency table


var hTree = function (d, mb) {
  // Need extra info to make a tree
  var t = [];

  for (var i = 0; i < d.length; ++i) {
    if (d[i]) t.push({
      s: i,
      f: d[i]
    });
  }

  var s = t.length;
  var t2 = t.slice();
  if (!s) return [new u8(0), 0];

  if (s == 1) {
    var v = new u8(t[0].s + 1);
    v[t[0].s] = 1;
    return [v, 1];
  }

  t.sort(function (a, b) {
    return a.f - b.f;
  }); // after i2 reaches last ind, will be stopped
  // freq must be greater than largest possible number of symbols

  t.push({
    s: -1,
    f: 25001
  });
  var l = t[0],
      r = t[1],
      i0 = 0,
      i1 = 1,
      i2 = 2;
  t[0] = {
    s: -1,
    f: l.f + r.f,
    l: l,
    r: r
  }; // efficient algorithm from UZIP.js
  // i0 is lookbehind, i2 is lookahead - after processing two low-freq
  // symbols that combined have high freq, will start processing i2 (high-freq,
  // non-composite) symbols instead
  // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/

  while (i1 != s - 1) {
    l = t[t[i0].f < t[i2].f ? i0++ : i2++];
    r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
    t[i1++] = {
      s: -1,
      f: l.f + r.f,
      l: l,
      r: r
    };
  }

  var maxSym = t2[0].s;

  for (var i = 1; i < s; ++i) {
    if (t2[i].s > maxSym) maxSym = t2[i].s;
  } // code lengths


  var tr = new u16(maxSym + 1); // max bits in tree

  var mbt = ln(t[i1 - 1], tr, 0);

  if (mbt > mb) {
    // more algorithms from UZIP.js
    // TODO: find out how this code works (debt)
    //  ind    debt
    var i = 0,
        dt = 0; //    left            cost

    var lft = mbt - mb,
        cst = 1 << lft;
    t2.sort(function (a, b) {
      return tr[b.s] - tr[a.s] || a.f - b.f;
    });

    for (; i < s; ++i) {
      var i2_1 = t2[i].s;

      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else break;
    }

    dt >>>= lft;

    while (dt > 0) {
      var i2_2 = t2[i].s;
      if (tr[i2_2] < mb) dt -= 1 << mb - tr[i2_2]++ - 1;else ++i;
    }

    for (; i >= 0 && dt; --i) {
      var i2_3 = t2[i].s;

      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }

    mbt = mb;
  }

  return [new u8(tr), mbt];
}; // get the max length and assign length codes


var ln = function (n, l, d) {
  return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
}; // length codes generation


var lc = function (c) {
  var s = c.length; // Note that the semicolon was intentional

  while (s && !c[--s]);

  var cl = new u16(++s); //  ind      num         streak

  var cli = 0,
      cln = c[0],
      cls = 1;

  var w = function (v) {
    cl[cli++] = v;
  };

  for (var i = 1; i <= s; ++i) {
    if (c[i] == cln && i != s) ++cls;else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138) w(32754);

        if (cls > 2) {
          w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;

        for (; cls > 6; cls -= 6) w(8304);

        if (cls > 2) w(cls - 3 << 5 | 8208), cls = 0;
      }

      while (cls--) w(cln);

      cls = 1;
      cln = c[i];
    }
  }

  return [cl.subarray(0, cli), s];
}; // calculate the length of output from tree, code lengths


var clen = function (cf, cl) {
  var l = 0;

  for (var i = 0; i < cl.length; ++i) l += cf[i] * cl[i];

  return l;
}; // writes a fixed block
// returns the new bit pos


var wfblk = function (out, pos, dat) {
  // no need to write 00 as type: TypedArray defaults to 0
  var s = dat.length;
  var o = shft(pos + 2);
  out[o] = s & 255;
  out[o + 1] = s >>> 8;
  out[o + 2] = out[o] ^ 255;
  out[o + 3] = out[o + 1] ^ 255;

  for (var i = 0; i < s; ++i) out[o + i + 4] = dat[i];

  return o + 4 + s << 3;
}; // writes a block


var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
  wbits(out, p++, final);
  ++lf[256];

  var _a = hTree(lf, 15),
      dlt = _a[0],
      mlb = _a[1];

  var _b = hTree(df, 15),
      ddt = _b[0],
      mdb = _b[1];

  var _c = lc(dlt),
      lclt = _c[0],
      nlc = _c[1];

  var _d = lc(ddt),
      lcdt = _d[0],
      ndc = _d[1];

  var lcfreq = new u16(19);

  for (var i = 0; i < lclt.length; ++i) lcfreq[lclt[i] & 31]++;

  for (var i = 0; i < lcdt.length; ++i) lcfreq[lcdt[i] & 31]++;

  var _e = hTree(lcfreq, 7),
      lct = _e[0],
      mlcb = _e[1];

  var nlcc = 19;

  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc);

  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
  if (flen <= ftlen && flen <= dtlen) return wfblk(out, p, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p, 1 + (dtlen < ftlen)), p += 2;

  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p, nlc - 257);
    wbits(out, p + 5, ndc - 1);
    wbits(out, p + 10, nlcc - 4);
    p += 14;

    for (var i = 0; i < nlcc; ++i) wbits(out, p + 3 * i, lct[clim[i]]);

    p += 3 * nlcc;
    var lcts = [lclt, lcdt];

    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];

      for (var i = 0; i < clct.length; ++i) {
        var len = clct[i] & 31;
        wbits(out, p, llm[len]), p += lct[len];
        if (len > 15) wbits(out, p, clct[i] >>> 5 & 127), p += clct[i] >>> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }

  for (var i = 0; i < li; ++i) {
    if (syms[i] > 255) {
      var len = syms[i] >>> 18 & 31;
      wbits16(out, p, lm[len + 257]), p += ll[len + 257];
      if (len > 7) wbits(out, p, syms[i] >>> 23 & 31), p += fleb[len];
      var dst = syms[i] & 31;
      wbits16(out, p, dm[dst]), p += dl[dst];
      if (dst > 3) wbits16(out, p, syms[i] >>> 5 & 8191), p += fdeb[dst];
    } else {
      wbits16(out, p, lm[syms[i]]), p += ll[syms[i]];
    }
  }

  wbits16(out, p, lm[256]);
  return p + ll[256];
}; // deflate options (nice << 13) | chain


var deo = new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]); // empty

var et = new u8(0); // compresses data into a raw DEFLATE buffer

var dflt = function (dat, lvl, plvl, pre, post, lst) {
  var s = dat.length;
  var o = new u8(pre + s + 5 * (1 + Math.floor(s / 7000)) + post); // writing to this writes to the output buffer

  var w = o.subarray(pre, o.length - post);
  var pos = 0;

  if (!lvl || s < 8) {
    for (var i = 0; i <= s; i += 65535) {
      // end
      var e = i + 65535;

      if (e < s) {
        // write full block
        pos = wfblk(w, pos, dat.subarray(i, e));
      } else {
        // write final block
        w[i] = lst;
        pos = wfblk(w, pos, dat.subarray(i, s));
      }
    }
  } else {
    var opt = deo[lvl - 1];
    var n = opt >>> 13,
        c = opt & 8191;
    var msk_1 = (1 << plvl) - 1; //    prev 2-byte val map    curr 2-byte val map

    var prev = new u16(32768),
        head = new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3),
        bs2_1 = 2 * bs1_1;

    var hsh = function (i) {
      return (dat[i] ^ dat[i + 1] << bs1_1 ^ dat[i + 2] << bs2_1) & msk_1;
    }; // 24576 is an arbitrary number of maximum symbols per block
    // 424 buffer for last block


    var syms = new u32(25000); // length/literal freq   distance freq

    var lf = new u16(288),
        df = new u16(32); //  l/lcnt  exbits  index  l/lind  waitdx  bitpos

    var lc_1 = 0,
        eb = 0,
        i = 0,
        li = 0,
        wi = 0,
        bs = 0;

    for (; i < s; ++i) {
      // hash value
      var hv = hsh(i); // index mod 32768

      var imod = i & 32767; // previous index with this value

      var pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod; // We always should modify head and prev, but only add symbols if
      // this data is not yet processed ("wait" for wait index)

      if (wi <= i) {
        // bytes remaining
        var rem = s - i;

        if ((lc_1 > 7000 || li > 24576) && rem > 423) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
          li = lc_1 = eb = 0, bs = i;

          for (var j = 0; j < 286; ++j) lf[j] = 0;

          for (var j = 0; j < 30; ++j) df[j] = 0;
        } //  len    dist   chain


        var l = 2,
            d = 0,
            ch_1 = c,
            dif = imod - pimod & 32767;

        if (rem > 2 && hv == hsh(i - dif)) {
          var maxn = Math.min(n, rem) - 1;
          var maxd = Math.min(32767, i); // max possible length
          // not capped at dif because decompressors implement "rolling" index population

          var ml = Math.min(258, rem);

          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i + l] == dat[i + l - dif]) {
              var nl = 0;

              for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl);

              if (nl > l) {
                l = nl, d = dif; // break out early when we reach "nice" (we are satisfied enough)

                if (nl > maxn) break; // now, find the rarest 2-byte sequence within this
                // length of literals and search for that instead.
                // Much faster than just using the start

                var mmd = Math.min(dif, nl - 2);
                var md = 0;

                for (var j = 0; j < mmd; ++j) {
                  var ti = i - dif + j + 32768 & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti + 32768 & 32767;
                  if (cd > md) md = cd, pimod = ti;
                }
              }
            } // check the previous match


            imod = pimod, pimod = prev[imod];
            dif += imod - pimod + 32768 & 32767;
          }
        } // d will be nonzero only when a match was found


        if (d) {
          // store both dist and len data in one Uint32
          // Make sure this is recognized as a len/dist with 28th bit (2^28)
          syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
          var lin = revfl[l] & 31,
              din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i + l;
          ++lc_1;
        } else {
          syms[li++] = dat[i];
          ++lf[dat[i]];
        }
      }
    }

    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos); // this is the easiest way to avoid needing to maintain state

    if (!lst) pos = wfblk(w, pos, et);
  }

  return slc(o, 0, pre + shft(pos) + post);
}; // CRC32 table


var crct = new u32(256);

for (var i = 0; i < 256; ++i) {
  var c = i,
      k = 9;

  while (--k) c = (c & 1 && 0xEDB88320) ^ c >>> 1;

  crct[i] = c;
} // CRC32


var crc = function () {
  var c = 0xFFFFFFFF;
  return {
    p: function (d) {
      // closures have awful performance
      var cr = c;

      for (var i = 0; i < d.length; ++i) cr = crct[cr & 255 ^ d[i]] ^ cr >>> 8;

      c = cr;
    },
    d: function () {
      return c ^ 0xFFFFFFFF;
    }
  };
}; // Alder32


var adler = function () {
  var a = 1,
      b = 0;
  return {
    p: function (d) {
      // closures have awful performance
      var n = a,
          m = b;
      var l = d.length;

      for (var i = 0; i != l;) {
        var e = Math.min(i + 5552, l);

        for (; i < e; ++i) n += d[i], m += n;

        n %= 65521, m %= 65521;
      }

      a = n, b = m;
    },
    d: function () {
      return (a & 255) << 24 | a >>> 8 << 16 | (b & 255) << 8 | b >>> 8;
    }
  };
};

; // deflate with opts

var dopt = function (dat, opt, pre, post, st) {
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 12 + opt.mem, pre, post, !st);
}; // Walmart object spread


var mrg = function (a, b) {
  var o = {};

  for (var k in a) o[k] = a[k];

  for (var k in b) o[k] = b[k];

  return o;
}; // worker clone
// This is possibly the craziest part of the entire codebase, despite how simple it may seem.
// The only parameter to this function is a closure that returns an array of variables outside of the function scope.
// We're going to try to figure out the variable names used in the closure as strings because that is crucial for workerization.
// We will return an object mapping of true variable name to value (basically, the current scope as a JS object).
// The reason we can't just use the original variable names is minifiers mangling the toplevel scope.
// This took me three weeks to figure out how to do.


var wcln = function (fn, fnStr, td) {
  var dt = fn();
  var st = fn.toString();
  var ks = st.slice(st.indexOf('[') + 1, st.lastIndexOf(']')).replace(/ /g, '').split(',');

  for (var i = 0; i < dt.length; ++i) {
    var v = dt[i],
        k = ks[i];

    if (typeof v == 'function') {
      fnStr += ';' + k + '=';
      var st_1 = v.toString();

      if (v.prototype) {
        // for global objects
        if (st_1.indexOf('[native code]') != -1) fnStr += st_1.slice(9, st_1.indexOf('(', 11));else {
          fnStr += st_1;

          for (var t in v.prototype) fnStr += ';' + k + '.prototype.' + t + '=' + v.prototype[t].toString();
        }
      } else fnStr += st_1;
    } else td[k] = v;
  }

  return [fnStr, td];
}; // worker onmessage


var wom = function (ev) {
  for (var k in ev.data[0]) self[k] = ev.data[0][k];

  onmessage = new Function('return ' + ev.data[1])();
};

var ch = []; // clone bufs

var cbfs = function (v) {
  var tl = [];

  for (var k in v) {
    if (v[k] instanceof u8 || v[k] instanceof u16 || v[k] instanceof u32) tl.push((v[k] = new v[k].constructor(v[k])).buffer);
  }

  return tl;
}; // use a worker to execute code


var wrkr = function (fns, init, id, cb) {
  var _a;

  if (!ch[id]) {
    var fnStr = '',
        td_1 = {},
        m = fns.length - 1;

    for (var i = 0; i < m; ++i) _a = wcln(fns[i], fnStr, td_1), fnStr = _a[0], td_1 = _a[1];

    ch[id] = wcln(fns[m], fnStr, td_1);
  }

  var td = mrg({}, ch[id][1]);
  return node_worker_1["default"](ch[id][0] + ';onmessage=' + wom.toString(), id, [td, init.toString()], cbfs(td), cb);
}; // base async inflate fn


var bInflt = function () {
  return [u8, u16, fleb, flebmsk, fdeb, fdebmsk, clim, fl, fd, flrm, fdrm, rev, hMap, max, bits, bits16, shft, slc, inflt, inflateSync, pbf, gu8];
};

var bDflt = function () {
  return [u8, u16, u32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf];
}; // gzip extra


var gze = function () {
  return [gzh, gzhl, wbytes, crc, crct];
}; // gunzip extra


var guze = function () {
  return [gzs, gzl];
}; // zlib extra


var zle = function () {
  return [zlh, wbytes, adler];
}; // unzlib extra


var zule = function () {
  return [zlv];
}; // post buf


var pbf = function (msg) {
  return postMessage(msg, [msg.buffer]);
}; // get u8


var gu8 = function (o) {
  return o && o.size && new u8(o.size);
}; // async helper


var cbify = function (dat, opts, fns, init, id, cb) {
  var w = wrkr(fns, init, id, function (err, dat) {
    w.terminate();
    cb(err, dat);
  });
  if (!opts.consume) dat = new u8(dat);
  w.postMessage([dat, opts], [dat.buffer]);
  return function () {
    w.terminate();
  };
}; // auto stream


var astrm = function (strm) {
  strm.ondata = function (dat, final) {
    return postMessage([dat, final], [dat.buffer]);
  };

  return function (ev) {
    return strm.push(ev.data[0], ev.data[1]);
  };
}; // async stream attach


var astrmify = function (fns, strm, opts, init, id) {
  var t;
  var w = wrkr(fns, init, id, function (err, dat) {
    if (err) w.terminate(), strm.ondata.call(strm, err);else {
      if (dat[1]) w.terminate();
      strm.ondata.call(strm, err, dat[0], dat[1]);
    }
  });
  w.postMessage(opts);

  strm.push = function (d, f) {
    if (t) throw 'stream finished';
    if (!strm.ondata) throw 'no stream handler';
    w.postMessage([d, t = f], [d.buffer]);
  };

  strm.terminate = function () {
    w.terminate();
  };
}; // read 2 bytes


var b2 = function (d, b) {
  return d[b] | d[b + 1] << 8;
}; // read 4 bytes


var b4 = function (d, b) {
  return d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24;
}; // write bytes


var wbytes = function (d, b, v) {
  for (; v; ++b) d[b] = v, v >>>= 8;
}; // gzip header


var gzh = function (c, o) {
  var fn = o.filename;
  c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3; // assume Unix

  if (o.mtime != 0) wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1000));

  if (fn) {
    c[3] = 8;

    for (var i = 0; i <= fn.length; ++i) c[i + 10] = fn.charCodeAt(i);
  }
}; // gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start


var gzs = function (d) {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8) throw 'invalid gzip data';
  var flg = d[3];
  var st = 10;
  if (flg & 4) st += d[10] | (d[11] << 8) + 2;

  for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++]);

  return st + (flg & 2);
}; // gzip length


var gzl = function (d) {
  var l = d.length;
  return d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24;
}; // gzip header length


var gzhl = function (o) {
  return 10 + (o.filename && o.filename.length + 1 || 0);
}; // zlib header


var zlh = function (c, o) {
  var lv = o.level,
      fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
  c[0] = 120, c[1] = fl << 6 | (fl ? 32 - 2 * fl : 1);
}; // zlib valid


var zlv = function (d) {
  if ((d[0] & 15) != 8 || d[0] >>> 4 > 7 || (d[0] << 8 | d[1]) % 31) throw 'invalid zlib data';
  if (d[1] & 32) throw 'invalid zlib data: preset dictionaries not supported';
};

function AsyncCmpStrm(opts, cb) {
  if (!cb && typeof opts == 'function') cb = opts, opts = {};
  this.ondata = cb;
  return opts;
} // zlib footer: -4 to -0 is Adler32

/**
 * Streaming DEFLATE compression
 */


var Deflate = /*#__PURE__*/function () {
  function Deflate(opts, cb) {
    if (!cb && typeof opts == 'function') cb = opts, opts = {};
    this.ondata = cb;
    this.o = opts || {};
  }

  Deflate.prototype.p = function (c, f) {
    this.ondata(dopt(c, this.o, 0, 0, !f), f);
  };
  /**
   * Pushes a chunk to be deflated
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Deflate.prototype.push = function (chunk, final) {
    if (this.d) throw 'stream finished';
    if (!this.ondata) throw 'no stream handler';
    this.d = final;
    this.p(chunk, final || false);
  };

  return Deflate;
}();

exports.Deflate = Deflate;
/**
 * Asynchronous streaming DEFLATE compression
 */

var AsyncDeflate = /*#__PURE__*/function () {
  function AsyncDeflate(opts, cb) {
    astrmify([bDflt, function () {
      return [astrm, Deflate];
    }], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
      var strm = new Deflate(ev.data);
      onmessage = astrm(strm);
    }, 6);
  }

  return AsyncDeflate;
}();

exports.AsyncDeflate = AsyncDeflate;

function deflate(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (!cb) throw 'no callback';
  return cbify(data, opts, [bDflt], function (ev) {
    return pbf(deflateSync(ev.data[0], ev.data[1]));
  }, 0, cb);
}

exports.deflate = deflate;
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */

function deflateSync(data, opts) {
  if (opts === void 0) {
    opts = {};
  }

  return dopt(data, opts, 0, 0);
}

exports.deflateSync = deflateSync;
/**
 * Streaming DEFLATE decompression
 */

var Inflate = /*#__PURE__*/function () {
  /**
   * Creates an inflation stream
   * @param cb The callback to call whenever data is inflated
   */
  function Inflate(cb) {
    this.s = {};
    this.p = new u8(0);
    this.ondata = cb;
  }

  Inflate.prototype.e = function (c) {
    if (this.d) throw 'stream finished';
    if (!this.ondata) throw 'no stream handler';
    var l = this.p.length;
    var n = new u8(l + c.length);
    n.set(this.p), n.set(c, l), this.p = n;
  };

  Inflate.prototype.c = function (c, final) {
    this.d = this.s.i = final;
    var bts = this.s.b;
    var dt = inflt(this.p, this.o, this.s);
    this.ondata(slc(dt, bts, this.s.b), final || false);
    this.o = slc(dt, this.s.b - 32768), this.s.b = 32768;
    this.p = slc(this.p, this.s.p >>> 3), this.s.p &= 7;
  };
  /**
   * Pushes a chunk to be inflated
   * @param chunk The chunk to push
   * @param final Whether this is the final chunk
   */


  Inflate.prototype.push = function (chunk, final) {
    this.e(chunk), this.c(chunk, final);
  };

  return Inflate;
}();

exports.Inflate = Inflate;
/**
 * Asynchronous streaming DEFLATE decompression
 */

var AsyncInflate = /*#__PURE__*/function () {
  /**
   * Creates an asynchronous inflation stream
   * @param cb The callback to call whenever data is deflated
   */
  function AsyncInflate(cb) {
    this.ondata = cb;
    astrmify([bInflt, function () {
      return [astrm, Inflate];
    }], this, 0, function () {
      var strm = new Inflate();
      onmessage = astrm(strm);
    }, 7);
  }

  return AsyncInflate;
}();

exports.AsyncInflate = AsyncInflate;

function inflate(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (!cb) throw 'no callback';
  return cbify(data, opts, [bInflt], function (ev) {
    return pbf(inflateSync(ev.data[0], gu8(ev.data[1])));
  }, 1, cb);
}

exports.inflate = inflate;
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */

function inflateSync(data, out) {
  return inflt(data, out);
}

exports.inflateSync = inflateSync; // before you yell at me for not just using extends, my reason is that TS inheritance is hard to workerize.

/**
 * Streaming GZIP compression
 */

var Gzip = /*#__PURE__*/function () {
  function Gzip(opts, cb) {
    this.c = crc();
    this.l = 0;
    this.v = 1;
    Deflate.call(this, opts, cb);
  }
  /**
   * Pushes a chunk to be GZIPped
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Gzip.prototype.push = function (chunk, final) {
    Deflate.prototype.push.call(this, chunk, final);
  };

  Gzip.prototype.p = function (c, f) {
    this.c.p(c);
    this.l += c.length;
    var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, !f);
    if (this.v) gzh(raw, this.o), this.v = 0;
    if (f) wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
    this.ondata(raw, f);
  };

  return Gzip;
}();

exports.Gzip = Gzip;
exports.Compress = Gzip;
/**
 * Asynchronous streaming GZIP compression
 */

var AsyncGzip = /*#__PURE__*/function () {
  function AsyncGzip(opts, cb) {
    astrmify([bDflt, gze, function () {
      return [astrm, Deflate, Gzip];
    }], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
      var strm = new Gzip(ev.data);
      onmessage = astrm(strm);
    }, 8);
  }

  return AsyncGzip;
}();

exports.AsyncGzip = AsyncGzip;
exports.AsyncCompress = AsyncGzip;

function gzip(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (!cb) throw 'no callback';
  return cbify(data, opts, [bDflt, gze, function () {
    return [gzipSync];
  }], function (ev) {
    return pbf(gzipSync(ev.data[0], ev.data[1]));
  }, 2, cb);
}

exports.gzip = gzip;
exports.compress = gzip;
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */

function gzipSync(data, opts) {
  if (opts === void 0) {
    opts = {};
  }

  var c = crc(),
      l = data.length;
  c.p(data);
  var d = dopt(data, opts, gzhl(opts), 8),
      s = d.length;
  return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}

exports.gzipSync = gzipSync;
exports.compressSync = gzipSync;
/**
 * Streaming GZIP decompression
 */

var Gunzip = /*#__PURE__*/function () {
  /**
   * Creates a GUNZIP stream
   * @param cb The callback to call whenever data is inflated
   */
  function Gunzip(cb) {
    this.v = 1;
    Inflate.call(this, cb);
  }
  /**
   * Pushes a chunk to be GUNZIPped
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Gunzip.prototype.push = function (chunk, final) {
    Inflate.prototype.e.call(this, chunk);

    if (this.v) {
      var s = gzs(this.p);
      if (s >= this.p.length && !final) return;
      this.p = this.p.subarray(s), this.v = 0;
    }

    if (final) {
      if (this.p.length < 8) throw 'invalid gzip stream';
      this.p = this.p.subarray(0, -8);
    } // necessary to prevent TS from using the closure value
    // This allows for workerization to function correctly


    Inflate.prototype.c.call(this, chunk, final);
  };

  return Gunzip;
}();

exports.Gunzip = Gunzip;
/**
 * Asynchronous streaming GZIP decompression
 */

var AsyncGunzip = /*#__PURE__*/function () {
  /**
   * Creates an asynchronous GUNZIP stream
   * @param cb The callback to call whenever data is deflated
   */
  function AsyncGunzip(cb) {
    this.ondata = cb;
    astrmify([bInflt, guze, function () {
      return [astrm, Inflate, Gunzip];
    }], this, 0, function () {
      var strm = new Gunzip();
      onmessage = astrm(strm);
    }, 9);
  }

  return AsyncGunzip;
}();

exports.AsyncGunzip = AsyncGunzip;

function gunzip(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (!cb) throw 'no callback';
  return cbify(data, opts, [bInflt, guze, function () {
    return [gunzipSync];
  }], function (ev) {
    return pbf(gunzipSync(ev.data[0]));
  }, 3, cb);
}

exports.gunzip = gunzip;
/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */

function gunzipSync(data, out) {
  return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
}

exports.gunzipSync = gunzipSync;
/**
 * Streaming Zlib compression
 */

var Zlib = /*#__PURE__*/function () {
  function Zlib(opts, cb) {
    this.c = adler();
    this.v = 1;
    Deflate.call(this, opts, cb);
  }
  /**
   * Pushes a chunk to be zlibbed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Zlib.prototype.push = function (chunk, final) {
    Deflate.prototype.push.call(this, chunk, final);
  };

  Zlib.prototype.p = function (c, f) {
    this.c.p(c);
    var raw = dopt(c, this.o, this.v && 2, f && 4, !f);
    if (this.v) zlh(raw, this.o), this.v = 0;
    if (f) wbytes(raw, raw.length - 4, this.c.d());
    this.ondata(raw, f);
  };

  return Zlib;
}();

exports.Zlib = Zlib;
/**
 * Asynchronous streaming Zlib compression
 */

var AsyncZlib = /*#__PURE__*/function () {
  function AsyncZlib(opts, cb) {
    astrmify([bDflt, zle, function () {
      return [astrm, Deflate, Zlib];
    }], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
      var strm = new Zlib(ev.data);
      onmessage = astrm(strm);
    }, 10);
  }

  return AsyncZlib;
}();

exports.AsyncZlib = AsyncZlib;

function zlib(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (!cb) throw 'no callback';
  return cbify(data, opts, [bDflt, zle, function () {
    return [zlibSync];
  }], function (ev) {
    return pbf(zlibSync(ev.data[0], ev.data[1]));
  }, 4, cb);
}

exports.zlib = zlib;
/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */

function zlibSync(data, opts) {
  if (opts === void 0) {
    opts = {};
  }

  var a = adler();
  a.p(data);
  var d = dopt(data, opts, 2, 4);
  return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}

exports.zlibSync = zlibSync;
/**
 * Streaming Zlib decompression
 */

var Unzlib = /*#__PURE__*/function () {
  /**
   * Creates a Zlib decompression stream
   * @param cb The callback to call whenever data is inflated
   */
  function Unzlib(cb) {
    this.v = 1;
    Inflate.call(this, cb);
  }
  /**
   * Pushes a chunk to be unzlibbed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Unzlib.prototype.push = function (chunk, final) {
    Inflate.prototype.e.call(this, chunk);

    if (this.v) {
      if (this.p.length < 2 && !final) return;
      this.p = this.p.subarray(2), this.v = 0;
    }

    if (final) {
      if (this.p.length < 8) throw 'invalid zlib stream';
      this.p = this.p.subarray(0, -4);
    } // necessary to prevent TS from using the closure value
    // This allows for workerization to function correctly


    Inflate.prototype.c.call(this, chunk, final);
  };

  return Unzlib;
}();

exports.Unzlib = Unzlib;
/**
 * Asynchronous streaming Zlib decompression
 */

var AsyncUnzlib = /*#__PURE__*/function () {
  /**
   * Creates an asynchronous Zlib decompression stream
   * @param cb The callback to call whenever data is deflated
   */
  function AsyncUnzlib(cb) {
    this.ondata = cb;
    astrmify([bInflt, zule, function () {
      return [astrm, Inflate, Unzlib];
    }], this, 0, function () {
      var strm = new Unzlib();
      onmessage = astrm(strm);
    }, 11);
  }

  return AsyncUnzlib;
}();

exports.AsyncUnzlib = AsyncUnzlib;

function unzlib(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (!cb) throw 'no callback';
  return cbify(data, opts, [bInflt, zule, function () {
    return [unzlibSync];
  }], function (ev) {
    return pbf(unzlibSync(ev.data[0], gu8(ev.data[1])));
  }, 5, cb);
}

exports.unzlib = unzlib;
/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */

function unzlibSync(data, out) {
  return inflt((zlv(data), data.subarray(2, -4)), out);
}

exports.unzlibSync = unzlibSync;
/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */

var Decompress = /*#__PURE__*/function () {
  /**
   * Creates a decompression stream
   * @param cb The callback to call whenever data is decompressed
   */
  function Decompress(cb) {
    this.G = Gunzip;
    this.I = Inflate;
    this.Z = Unzlib;
    this.ondata = cb;
  }
  /**
   * Pushes a chunk to be decompressed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Decompress.prototype.push = function (chunk, final) {
    if (!this.ondata) throw 'no stream handler';

    if (!this.s) {
      if (this.p && this.p.length) {
        var n = new u8(this.p.length + chunk.length);
        n.set(this.p), n.set(chunk, this.p.length);
      } else this.p = chunk;

      if (this.p.length > 2) {
        var _this_1 = this;

        var cb = function () {
          _this_1.ondata.apply(_this_1, arguments);
        };

        this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(cb) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(cb) : new this.Z(cb);
        this.s.push(this.p, final);
        this.p = null;
      }
    } else this.s.push(chunk, final);
  };

  return Decompress;
}();

exports.Decompress = Decompress;
/**
 * Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression
 */

var AsyncDecompress = /*#__PURE__*/function () {
  /**
  * Creates an asynchronous decompression stream
  * @param cb The callback to call whenever data is decompressed
  */
  function AsyncDecompress(cb) {
    this.G = AsyncGunzip;
    this.I = AsyncInflate;
    this.Z = AsyncUnzlib;
    this.ondata = cb;
  }
  /**
   * Pushes a chunk to be decompressed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  AsyncDecompress.prototype.push = function (chunk, final) {
    Decompress.prototype.push.call(this, chunk, final);
  };

  return AsyncDecompress;
}();

exports.AsyncDecompress = AsyncDecompress;

function decompress(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (!cb) throw 'no callback';
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzip(data, opts, cb) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflate(data, opts, cb) : unzlib(data, opts, cb);
}

exports.decompress = decompress;
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */

function decompressSync(data, out) {
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, out) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, out) : unzlibSync(data, out);
}

exports.decompressSync = decompressSync; // flatten a directory structure

var fltn = function (d, p, t, o) {
  for (var k in d) {
    var val = d[k],
        n = p + k;
    if (val instanceof u8) t[n] = [val, o];else if (Array.isArray(val)) t[n] = [val[0], mrg(o, val[1])];else fltn(val, n + '/', t, o);
  }
};
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */


function strToU8(str, latin1) {
  var l = str.length;
  if (!latin1 && typeof TextEncoder != 'undefined') return new TextEncoder().encode(str);
  var ar = new u8(str.length + (str.length >>> 1));
  var ai = 0;

  var w = function (v) {
    ar[ai++] = v;
  };

  for (var i = 0; i < l; ++i) {
    if (ai + 5 > ar.length) {
      var n = new u8(ai + 8 + (l - i << 1));
      n.set(ar);
      ar = n;
    }

    var c = str.charCodeAt(i);
    if (c < 128 || latin1) w(c);else if (c < 2048) w(192 | c >>> 6), w(128 | c & 63);else if (c > 55295 && c < 57344) c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i) & 1023, w(240 | c >>> 18), w(128 | c >>> 12 & 63), w(128 | c >>> 6 & 63), w(128 | c & 63);else w(224 | c >>> 12), w(128 | c >>> 6 & 63), w(128 | c & 63);
  }

  return slc(ar, 0, ai);
}

exports.strToU8 = strToU8;
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */

function strFromU8(dat, latin1) {
  var r = '';
  if (!latin1 && typeof TextDecoder != 'undefined') return new TextDecoder().decode(dat);

  for (var i = 0; i < dat.length;) {
    var c = dat[i++];
    if (c < 128 || latin1) r += String.fromCharCode(c);else if (c < 224) r += String.fromCharCode((c & 31) << 6 | dat[i++] & 63);else if (c < 240) r += String.fromCharCode((c & 15) << 12 | (dat[i++] & 63) << 6 | dat[i++] & 63);else c = ((c & 15) << 18 | (dat[i++] & 63) << 12 | (dat[i++] & 63) << 6 | dat[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
  }

  return r;
}

exports.strFromU8 = strFromU8;
; // read zip header

var zh = function (d, b) {
  var u = b2(d, b + 6) & 2048,
      c = b2(d, b + 8),
      sc = b4(d, b += 18),
      su = b4(d, b + 4),
      fnl = b2(d, b + 8),
      fn = strFromU8(d.subarray(b += 12, b += fnl), !u);
  return [sc, c, su, fn, b];
}; // write zip header


var wzh = function (d, b, c, cmp, su, fn, u, o, ce, t) {
  var fl = fn.length,
      l = cmp.length;
  wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
  if (ce != null) d[b] = 20, b += 2;
  d[b] = 20, b += 2; // spec compliance? what's that?

  d[b++] = t == 8 && (o.level == 1 ? 6 : o.level < 6 ? 4 : o.level == 9 ? 2 : 0), d[b++] = u && 8;
  d[b] = t, b += 2;
  var dt = new Date(o.mtime || Date.now()),
      y = dt.getFullYear() - 1980;
  if (y < 0 || y > 119) throw 'date not in range 1980-2099';
  wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >>> 1);
  b += 4;
  wbytes(d, b, c);
  wbytes(d, b + 4, l);
  wbytes(d, b + 8, su);
  wbytes(d, b + 12, fl), b += 16; // skip extra field, comment

  if (ce != null) wbytes(d, b += 10, ce), b += 4;
  d.set(fn, b);
  b += fl;
  if (ce == null) d.set(cmp, b);
}; // write zip footer (end of central directory)


var wzf = function (o, b, c, d, e) {
  wbytes(o, b, 0x6054B50); // skip disk

  wbytes(o, b + 8, c);
  wbytes(o, b + 10, c);
  wbytes(o, b + 12, d);
  wbytes(o, b + 16, e);
};

function zip(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  var r = {};
  fltn(data, '', r, opts);
  var k = Object.keys(r);
  var lft = k.length,
      o = 0,
      tot = 0;
  var slft = lft,
      files = new Array(lft);
  var term = [];

  var tAll = function () {
    for (var i = 0; i < term.length; ++i) term[i]();
  };

  var cbf = function () {
    var out = new u8(tot + 22),
        oe = o,
        cdl = tot - o;
    tot = 0;

    for (var i = 0; i < slft; ++i) {
      var f = files[i];
      wzh(out, tot, f.c, f.d, f.m, f.n, f.u, f.p, null, f.t);
      wzh(out, o, f.c, f.d, f.m, f.n, f.u, f.p, tot, f.t), o += 46 + f.n.length, tot += 30 + f.n.length + f.d.length;
    }

    wzf(out, o, files.length, cdl, oe);
    cb(null, out);
  };

  if (!lft) cbf();

  var _loop_1 = function (i) {
    var fn = k[i];
    var _a = r[fn],
        file = _a[0],
        p = _a[1];
    var c = crc(),
        m = file.length;
    c.p(file);
    var n = strToU8(fn),
        s = n.length;
    var t = p.level == 0 ? 0 : 8;
    if (n.length > 65535) throw 'filename too long';

    var cbl = function (e, d) {
      if (e) {
        tAll();
        cb(e, null);
      } else {
        var l = d.length;
        files[i] = {
          t: t,
          d: d,
          m: m,
          c: c.d(),
          u: fn.length != l,
          n: n,
          p: p
        };
        o += 30 + s + l;
        tot += 76 + 2 * s + l;
        if (! --lft) cbf();
      }
    };

    if (!t) cbl(null, file);else if (m < 160000) cbl(null, deflateSync(file, opts));else term.push(deflate(file, opts, cbl));
  }; // Cannot use lft because it can decrease


  for (var i = 0; i < slft; ++i) {
    _loop_1(i);
  }

  return tAll;
}

exports.zip = zip;
/**
 * Synchronously creates a ZIP file. Prefer using `zip` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */

function zipSync(data, opts) {
  if (opts === void 0) {
    opts = {};
  }

  var r = {};
  var files = [];
  fltn(data, '', r, opts);
  var o = 0;
  var tot = 0;

  for (var fn in r) {
    var _a = r[fn],
        file = _a[0],
        p = _a[1];
    var t = p.level == 0 ? 0 : 8;
    var n = strToU8(fn),
        s = n.length;
    if (n.length > 65535) throw 'filename too long';
    var d = t ? deflateSync(file, p) : file,
        l = d.length;
    var c = crc();
    c.p(file);
    files.push({
      t: t,
      d: d,
      m: file.length,
      c: c.d(),
      u: fn.length != s,
      n: n,
      o: o,
      p: p
    });
    o += 30 + s + l;
    tot += 76 + 2 * s + l;
  }

  var out = new u8(tot + 22),
      oe = o,
      cdl = tot - o;

  for (var i = 0; i < files.length; ++i) {
    var f = files[i];
    wzh(out, f.o, f.c, f.d, f.m, f.n, f.u, f.p, null, f.t);
    wzh(out, o, f.c, f.d, f.m, f.n, f.u, f.p, f.o, f.t), o += 46 + f.n.length;
  }

  wzf(out, o, files.length, cdl, oe);
  return out;
}

exports.zipSync = zipSync;
/**
 * Asynchronously decompresses a ZIP archive
 * @param data The raw compressed ZIP file
 * @param cb The callback to call with the decompressed files
 * @returns A function that can be used to immediately terminate the unzipping
 */

function unzip(data, cb) {
  var term = [];

  var tAll = function () {
    for (var i = 0; i < term.length; ++i) term[i]();
  };

  var files = {};
  var e = data.length - 22;

  for (; b4(data, e) != 0x6054B50; --e) {
    if (!e || data.length - e > 65558) throw 'invalid zip file';
  }

  ;
  var lft = b2(data, e + 8);
  if (!lft) cb(null, {});
  var c = lft;
  var o = b4(data, e + 16);

  var _loop_2 = function (i) {
    var off = b4(data, o + 42);
    o += 46 + b2(data, o + 28) + b2(data, o + 30) + b2(data, o + 32);

    var _a = zh(data, off),
        sc = _a[0],
        c_1 = _a[1],
        su = _a[2],
        fn = _a[3],
        b = _a[4];

    var cbl = function (e, d) {
      if (e) {
        tAll();
        cb(e, null);
      } else {
        files[fn] = d;
        if (! --lft) cb(null, files);
      }
    };

    if (!c_1) cbl(null, slc(data, b, b + sc));else if (c_1 == 8) {
      var infl = data.subarray(b, b + sc);
      if (sc < 320000) cbl(null, inflateSync(infl, new u8(su)));else inflate(infl, {
        size: su
      }, cbl);
    } else throw 'unknown compression type ' + c_1;
  };

  for (var i = 0; i < c; ++i) {
    _loop_2(i);
  }

  return tAll;
}

exports.unzip = unzip;
/**
 * Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @returns The decompressed files
 */

function unzipSync(data) {
  var files = {};
  var e = data.length - 22;

  for (; b4(data, e) != 0x6054B50; --e) {
    if (!e || data.length - e > 65558) throw 'invalid zip file';
  }

  ;
  var c = b2(data, e + 8);
  if (!c) return {};
  var o = b4(data, e + 16);

  for (var i = 0; i < c; ++i) {
    var off = b4(data, o + 42);
    o += 46 + b2(data, o + 28) + b2(data, o + 30) + b2(data, o + 32);

    var _a = zh(data, off),
        sc = _a[0],
        c_2 = _a[1],
        su = _a[2],
        fn = _a[3],
        b = _a[4];

    if (!c_2) files[fn] = slc(data, b, b + sc);else if (c_2 == 8) files[fn] = inflateSync(data.subarray(b, b + sc), new u8(su));else throw 'unknown compression type ' + c_2;
  }

  return files;
}

exports.unzipSync = unzipSync;
},{"./node-worker":"77xEs"}],"77xEs":[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var ch2 = {};

exports["default"] = function (c, id, msg, transfer, cb) {
  var u = ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([c], {
    type: 'text/javascript'
  })));
  var w = new Worker(u);

  w.onerror = function (e) {
    return cb(e.error, null);
  };

  w.onmessage = function (e) {
    return cb(null, e.data);
  };

  w.postMessage(msg, transfer);
  return w;
};
},{}]},{},["347E4","3GkXV","77qLy","3BJrQ"], "3BJrQ", "parcelRequirebaf8")

//# sourceMappingURL=index.e5f29bf6.js.map
