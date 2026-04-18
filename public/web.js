!(function () {
  let isMainFrame = !1,
    isProductionHost = !1,
    isPuppeteer = !1;
  try {
    ((isMainFrame = !window.ReactNativeWebView && window.self === window.top),
      (isProductionHost =
        window.self?.location?.host &&
        (window.self.location.host.includes(".netlify.app") ||
          window.self.location.host.includes(".public.builtwithrocket.new") ||
          !window.self.location.host.includes("localhost:"))),
      (isPuppeteer = navigator?.userAgent?.includes("Puppeteer")));
  } catch (M) {}
  let configBaseUrl = "",
    trackingBaseUrl = "";
  try {
    const scriptSrc = (function () {
        const scriptTags = document.getElementsByTagName("script");
        for (let script of scriptTags) if (script.src.includes("rocket-web.js")) return script.src;
        return null;
      })(),
      scriptUrl = new URL(scriptSrc),
      queryParams = new URLSearchParams(scriptUrl?.search);
    ((configBaseUrl = queryParams.get("_cfg") || ""), (trackingBaseUrl = queryParams.get("_be") || ""));
  } catch (H) {}
  try {
    "true" === new URLSearchParams(window.location.search).get("rk_owner") &&
      window?.localStorage?.setItem("rk_owner", "true");
  } catch (k) {}
  function getStorageItem(key) {
    try {
      return window?.localStorage?.getItem(key);
    } catch (e) {
      return null;
    }
  }
  function setStorageItem(key, value) {
    try {
      return (window?.localStorage?.setItem(key, value), !0);
    } catch (e) {
      return !1;
    }
  }
  function getQueryParams() {
    try {
      return Object.fromEntries(new URLSearchParams(window.location.search));
    } catch (e) {
      return {};
    }
  }
  function getLocale() {
    try {
      return navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.userLanguage ||
            navigator.language ||
            navigator.browserLanguage ||
            "en";
    } catch (e) {
      return "en";
    }
  }
  function sendErrorLog(errorData) {
    isMainFrame ||
      isPuppeteer ||
      fetch(`${configBaseUrl}/log-error`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorData),
      }).catch((error) => {});
  }
  function sendGeneralLog(logData) {
    isMainFrame ||
      isPuppeteer ||
      fetch(`${configBaseUrl}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      }).catch((error) => {});
  }
  function trackPreview(callback) {
    if (isMainFrame && isProductionHost && !isPuppeteer) {
      const visitorId = (function () {
          const visitorKey = "rk_visitor_id";
          let vid = getStorageItem(visitorKey);
          try {
            vid ||
              ((vid = `${Date.now()}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`),
              setStorageItem(visitorKey, vid));
          } catch (e) {}
          return vid || "";
        })(),
        sessionId = (function () {
          const sessionKey = "rk_session_id";
          try {
            let sid = (function (name) {
              try {
                const cookieStr = `; ${document.cookie}`.split(`; ${name}=`);
                return 2 === cookieStr.length ? cookieStr.pop().split(";").shift() : null;
              } catch (e) {
                return null;
              }
            })(sessionKey);
            const domain = (function () {
              try {
                return window.location.host.split(":")[0];
              } catch (e) {
                return null;
              }
            })();
            return (
              sid ||
                (sid = `${Date.now()}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`),
              (function (name, val, days, dom) {
                try {
                  const expires = new Date();
                  expires.setTime(expires.getTime() + 18e5);
                  const expiryStr = `expires=${expires.toUTCString()}`,
                    domStr = dom ? `; domain=${dom}` : "";
                  return (
                    (document.cookie = `${name}=${val}; ${expiryStr}${domStr}; path=/; Secure; SameSite=Lax`),
                    !0
                  );
                } catch (e) {
                  return !1;
                }
              })(sessionKey, sid, 0, domain),
              sid
            );
          } catch (e) {
            return "";
          }
        })(),
        isOwner = (function () {
          const ownerKey = "rk_owner";
          try {
            if (
              "true" ===
              new URLSearchParams(window.location.search).get("rk_owner")
            )
              return (setStorageItem(ownerKey, "true"), !0);
          } catch (e) {}
          return "true" === getStorageItem(ownerKey);
        })();
      !(function (data, next) {
        if (!trackingBaseUrl) return;
        const payload = { ...data };
        fetch(`${trackingBaseUrl}/preview/v1/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Bad response");
            return res.json();
          })
          .then((resJson) => {
            next(resJson);
          })
          .catch((err) => {});
      })(
        {
          event: "Public Preview Viewed",
          baseUrl: window.location.origin,
          previewUrl: window.location.href,
          visitorId: visitorId,
          sessionId: sessionId,
          queryParams: getQueryParams(),
          timestamp: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer,
          userAgent: window.navigator.userAgent,
          locale: getLocale(),
          ...(isOwner && { isOwner: isOwner }),
        },
        (res) => {
          "function" == typeof callback && res?.isPublic && callback();
        },
      );
    }
  }
  function notifyPathChange() {
    isMainFrame ||
      window.parent.postMessage(
        {
          type: "WEB_IFRAME_PATHNAME_CHANGE",
          pathname: window.location.pathname,
        },
        "*",
      );
  }
  function notifyDocumentLoaded() {
    isMainFrame || window.parent.postMessage({ type: "WEB_IFRAME_DOCUMENT_LOADED" }, "*");
  }
  (isMainFrame || window.parent.postMessage({ type: "WEB_IFRAME_LOADING" }, "*"), notifyPathChange());
  try {
    const processedShadowRoots = new WeakSet();
    
    // Optimized: Only check element nodes and sub-shadow roots
    function hideNextJsErrorsFromNode(node) {
      if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
      const isNextApp = window?.next;
      if (!isNextApp) return;

      try {
        if (node.classList?.contains("nextjs-toast-errors-parent") || 
            node.querySelector?.('[class*="nextjs-toast-errors-parent"]')) {
          const targets = node.querySelectorAll?.('[class*="nextjs-toast-errors-parent"]') || [];
          targets.forEach(el => {
            el.style.display = "none";
            el.style.visibility = "hidden";
          });
        }
        
        // Check shadow root if exists
        if (node.shadowRoot) hideNextJsErrorsFromNode(node.shadowRoot);
      } catch (e) {}
    }

    function observeShadowRoots(node) {
      if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.shadowRoot && !processedShadowRoots.has(node.shadowRoot)) {
        processedShadowRoots.add(node.shadowRoot);
        domMutationObserver.observe(node.shadowRoot, { childList: !0, subtree: !0 });
        hideNextJsErrorsFromNode(node.shadowRoot);
      }
      // Only scan children for shadow roots on initial or large injections
      node.querySelectorAll?.("*").forEach(el => {
        if (el.shadowRoot && !processedShadowRoots.has(el.shadowRoot)) {
           processedShadowRoots.add(el.shadowRoot);
           domMutationObserver.observe(el.shadowRoot, { childList: !0, subtree: !0 });
        }
      });
    }

    const domMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            hideNextJsErrorsFromNode(node);
            observeShadowRoots(node);
          }
        });
      });
    });

    const initDomObserver = () => {
      try {
        if (document.documentElement) {
          domMutationObserver.observe(document.documentElement, { childList: !0, subtree: !0 });
          hideNextJsErrorsFromNode(document.documentElement);
          observeShadowRoots(document.documentElement);
        }
      } catch (e) {}
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
      initDomObserver();
    } else {
      document.addEventListener("DOMContentLoaded", initDomObserver);
    }
  } catch (W) {}
  if (
    (    document.addEventListener("DOMContentLoaded", () => {
      (notifyDocumentLoaded(), trackPreview());
    }),
    document.addEventListener("readystatechange", () => {
      "complete" === document.readyState && notifyDocumentLoaded();
    }),
    window.history && window.history.pushState)
  ) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function () {
      (originalPushState.apply(this, arguments), notifyPathChange(), trackPreview());
    };
    const originalReplaceState = window.history.replaceState;
    ((window.history.replaceState = function () {
      (originalReplaceState.apply(this, arguments), notifyPathChange(), trackPreview());
    }),
      window.addEventListener("popstate", function () {
        (notifyPathChange(), trackPreview());
      }));
  }
  (window.addEventListener("hashchange", function () {
    (notifyPathChange(), trackPreview());
  }),
    (window.__COMPONENT_ERROR__ = function (error, errorInfo) {
      let stack = error?.stack || null,
        isMessageInStack = !1;
      stack && stack.includes(error.message) && (isMessageInStack = !0);
      let fullMessage = stack ? (isMessageInStack ? stack : `${error.message}\n\n${stack}`) : error.message;
      (errorInfo.componentStack && (fullMessage += errorInfo.componentStack),
        sendErrorLog({
          errorType: "RUNTIME_ERROR",
          message: fullMessage,
          timestamp: new Date().toISOString(),
        }));
    }),
    (window.onerror = function (message, source, lineno, colno, error) {
      const stack = error?.stack || null,
        formattedError = stack ? `${message}\n\n${stack}` : message;
      (sendGeneralLog({
        type: "CONSOLE_ERROR",
        message: formattedError,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      }),
        sendErrorLog({
          errorType: "RUNTIME_ERROR",
          message: formattedError,
          timestamp: new Date().toISOString(),
        }));
    }),
    (window.onunhandledrejection = function (event) {
      const reasonMsg = event.reason?.message || String(event.reason),
        stack = event.reason?.stack || null,
        fullReason = stack ? `${reasonMsg}\n\n${stack}` : reasonMsg;
      (sendGeneralLog({
        type: "CONSOLE_ERROR",
        message: fullReason,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      }),
        sendErrorLog({
          errorType: "RUNTIME_ERROR",
          message: fullReason,
          timestamp: new Date().toISOString(),
        }));
    }));
  const originalConsoleError = console.error,
    originalConsoleLog = console.log,
    originalConsoleWarn = console.warn,
    originalConsoleInfo = console.info,
    originalConsoleDebug = console.debug;
  function formatConsoleArgs(args) {
    return args
      ?.map((arg) => {
        if (arg instanceof Error) {
          const stack = arg?.stack || null;
          return stack ? `${arg.message}\n\n${stack}` : arg.message;
        }
        return arg instanceof HTMLElement
          ? arg.outerHTML
          : "object" == typeof arg && null !== arg
            ? JSON.stringify(arg, null, 2)
            : String(arg);
      })
      .join(" ");
  }
  ((console.error = function (...args) {
    setTimeout(() => {
      const isFromErrorBoundary = args.some((arg) => !0 === arg?.__ErrorBoundary);
      (sendGeneralLog({
        type: "CONSOLE_ERROR",
        message: formatConsoleArgs(args),
        timestamp: new Date().toISOString(),
        url: window.location.href,
      }),
        isFromErrorBoundary ||
          sendErrorLog({
            errorType: "RUNTIME_ERROR",
            message: formatConsoleArgs(args),
            timestamp: new Date().toISOString(),
          }),
        originalConsoleError.apply(console, args));
    }, 100);
  }),
    (console.log = function (...args) {
      (sendGeneralLog({
        type: "CONSOLE_LOG",
        message: formatConsoleArgs(args),
        timestamp: new Date().toISOString(),
        url: window.location.href,
      }),
        originalConsoleLog.apply(console, args));
    }),
    (console.warn = function (...args) {
      (sendGeneralLog({
        type: "CONSOLE_WARN",
        message: formatConsoleArgs(args),
        timestamp: new Date().toISOString(),
        url: window.location.href,
      }),
        originalConsoleWarn.apply(console, args));
    }),
    (console.info = function (...args) {
      (sendGeneralLog({
        type: "CONSOLE_INFO",
        message: formatConsoleArgs(args),
        timestamp: new Date().toISOString(),
        url: window.location.href,
      }),
        originalConsoleInfo.apply(console, args));
    }),
    (console.debug = function (...args) {
      (sendGeneralLog({
        type: "CONSOLE_DEBUG",
        message: formatConsoleArgs(args),
        timestamp: new Date().toISOString(),
        url: window.location.href,
      }),
        originalConsoleDebug.apply(console, args));
    }));
  let activeComponentId = null,
    editModeAbortController = null;
  const STYLE_MAP = {
    MARGIN_TOP: "margin-top",
    MARGIN_RIGHT: "margin-right",
    MARGIN_BOTTOM: "margin-bottom",
    MARGIN_LEFT: "margin-left",
    PADDING_TOP: "padding-top",
    PADDING_RIGHT: "padding-right",
    PADDING_BOTTOM: "padding-bottom",
    PADDING_LEFT: "padding-left",
    BACKGROUND_COLOR: "background-color",
    BORDER_RADIUS_TOP_LEFT: "border-top-left-radius",
    BORDER_RADIUS_TOP_RIGHT: "border-top-right-radius",
    BORDER_RADIUS_BOTTOM_RIGHT: "border-bottom-right-radius",
    BORDER_RADIUS_BOTTOM_LEFT: "border-bottom-left-radius",
    FONT_SIZE: "font-size",
    FONT_WEIGHT: "font-weight",
    TEXT_ALIGN: "text-align",
    TEXT_COLOR: "color",
    LINE_HEIGHT: "line-height",
    TEXT_TRANSFORM: "text-transform",
    LETTER_SPACING: "letter-spacing",
    BORDER_STYLE: "border-style",
    BORDER_COLOR: "border-color",
    BORDER_RIGHT_WIDTH: "border-right-width",
    BORDER_BOTTOM_WIDTH: "border-bottom-width",
    BORDER_LEFT_WIDTH: "border-left-width",
    BORDER_TOP_WIDTH: "border-top-width",
    TEXT_CONTENT: "text-content",
    OBJECT_FIT: "object-fit",
    IMAGE_SRC: "image-src",
    DISPLAY: "display",
    FLEX_DIRECTION: "flex-direction",
    JUSTIFY_CONTENT: "justify-content",
    ALIGN_ITEMS: "align-items",
    GRID_TEMPLATE_COLUMNS: "grid-template-columns",
    GRID_TEMPLATE_ROWS: "grid-template-rows",
    GRID_COLUMN_GAP: "grid-column-gap",
    GRID_ROW_GAP: "grid-row-gap",
    PLACE_ITEMS: "place-items",
    FLEX_GAP: "gap",
  };
  function disableEditMode() {
    if (editModeAbortController)
      try {
        editModeAbortController.abort();
      } catch (e) {
      } finally {
        editModeAbortController = null;
      }
  }
  function isInputElement(el) {
    if (!el) return !1;
    const tagName = el.tagName?.toLowerCase?.();
    return "input" === tagName || "textarea" === tagName || "select" === tagName;
  }
  function preventInputEvent(e) {
    const target = e.target;
    target && target instanceof HTMLElement && isInputElement(target) && e.preventDefault();
  }
  function blurInputOnInteraction(e) {
    const target = e.target;
    target &&
      target instanceof HTMLElement &&
      isInputElement(target) &&
      (e.preventDefault(),
      e.stopPropagation(),
      "function" == typeof target.blur && target.blur());
  }
  function highlightComponent(e) {
    (e.stopPropagation(), e.preventDefault());
    const target = e.target;
    if (!target.ownerSVGElement && "BODY" !== target.tagName && "HTML" !== target.tagName) {
      const compId = target.dataset.componentId;
      compId &&
        document.querySelectorAll(`[data-component-id="${compId}"]`).forEach((el) => {
          el.setAttribute("data-component-hovered", "true");
        });
      const rect = target.getBoundingClientRect(),
        highlighter = document.getElementById("highlighter");
      highlighter &&
        ((highlighter.style.display = "block"),
        (highlighter.innerText = target.tagName?.toLowerCase()),
        (function (el, targetRect) {
          try {
            if (!el || !targetRect) return;
            const viewportWidth =
                window.innerWidth || document.documentElement.clientWidth || 0,
              viewportHeight =
                window.innerHeight ||
                document.documentElement.clientHeight ||
                0;
            if (viewportWidth <= 0 || viewportHeight <= 0) return;
            ((el.style.top = "-9999px"),
              (el.style.left = "-9999px"),
              el.offsetHeight);
            const elRect = el.getBoundingClientRect(),
              elHeight = elRect.height || 0,
              elWidth = elRect.width || 0;
            if (elHeight <= 0 || elWidth <= 0) return;
            const spaceAbove = targetRect.top || 0,
              spaceBelow = viewportHeight - (targetRect.bottom || 0),
              verticalGap = 5,
              horizontalGap = 2;
            let topPos;
            ((topPos =
              spaceAbove >= elHeight + verticalGap
                ? targetRect.top - elHeight - verticalGap
                : spaceBelow >= elHeight + horizontalGap
                  ? targetRect.bottom + horizontalGap
                  : Math.max(5, targetRect.top || 0)),
              (topPos = Math.max(0, topPos)));
            let leftPos = targetRect.left || 0;
            (leftPos + elWidth > viewportWidth && (leftPos = Math.max(5, viewportWidth - elWidth - 5)),
              leftPos < 0 && (leftPos = 5),
              (leftPos = Math.max(0, leftPos)),
              (el.style.top = `${topPos}px`),
              (el.style.left = `${leftPos}px`));
          } catch (e) {}
        })(highlighter, rect));
    }
  }
  function unhighlightComponent(e) {
    (e.stopPropagation(), e.preventDefault());
    const highlighter = document.getElementById("highlighter");
    highlighter && (highlighter.style.display = "none");
    const compId = e.target.dataset?.componentId;
    compId
      ? document.querySelectorAll(`[data-component-id="${compId}"]`).forEach((el) => {
          el.removeAttribute("data-component-hovered");
        })
      : e.target.removeAttribute("data-component-hovered");
  }
  function handleComponentSelection(e) {
    const { target } = e;
    (function (el) {
      if (!el) return !1;
      const navParent = el.closest("nav"),
        tablistParent = el.closest('[role="tablist"]'),
        tabParent = el.closest('[role="tab"]'),
        isButton = "BUTTON" === el.tagName;
      return !(!(navParent || tablistParent || tabParent) || !isButton);
    })(target) || (e.preventDefault(), e.stopPropagation());
    const styles = (function (el) {
      if (!el) return {};
      const computed = window.getComputedStyle(el),
        styles = {};
      return (
        Object.keys(STYLE_MAP).forEach((key) => {
          styles[STYLE_MAP[key]] = computed.getPropertyValue(STYLE_MAP[key]);
        }),
        styles
      );
    })(target);
    (document
      .querySelectorAll('[data-component-selected="true"]')
      .forEach((el) => {
        el.removeAttribute("data-component-selected");
      }),
      document
        .querySelectorAll('[data-component-active="true"]')
        .forEach((el) => {
          el.removeAttribute("data-component-active");
        }));
    const compId = target.dataset.componentId;
    compId &&
      (document.querySelectorAll(`[data-component-id="${compId}"]`).forEach((el) => {
        el.setAttribute("data-component-selected", "true");
      }),
      target.setAttribute("data-component-active", "true"));
    const isTextElement = (function (el) {
        if (!el) return !1;
        if (!el.innerText?.trim() && !el.textContent?.trim()) return !1;
        if (
          [
            "P",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "SPAN",
            "A",
            "BUTTON",
            "LABEL",
            "LI",
            "TD",
            "TH",
            "BLOCKQUOTE",
            "FIGCAPTION",
            "CAPTION",
          ].includes(el.tagName)
        )
          return !0;
        const inlineTags = [
            "SPAN",
            "STRONG",
            "EM",
            "B",
            "I",
            "U",
            "MARK",
            "SMALL",
            "SUB",
            "SUP",
            "CODE",
            "A",
            "BR",
          ],
          children = Array.from(el.children);
        if (0 === children.length && el.childNodes.length > 0) return !0;
        if (children.length > 0) {
          if (children.every((child) => inlineTags.includes(child.tagName))) return !0;
          if (
            Array.from(el.childNodes).some(
              (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
            )
          )
            return !0;
        }
        return !1;
      })(target),
      isImageElement = target instanceof HTMLImageElement;
    activeComponentId = compId;
    const startLine = target.dataset?.componentLine ?? "0",
      endLine = target.dataset?.componentEndLine ?? "0",
      startLineNum = Number(startLine),
      endLineNum = Number(endLine),
      instanceCount = compId
        ? document.querySelectorAll(`[data-component-id="${compId}"]`).length
        : 1,
      metaData = {
        filePath: target.dataset?.componentPath ?? "",
        lineNumber: Number.isNaN(startLineNum) ? 0 : startLineNum,
        ...(!Number.isNaN(endLineNum) && { endLineNumber: endLineNum }),
        content: target.dataset?.componentContent ?? "",
        elementName: target.tagName?.toLocaleLowerCase() ?? "",
        componentId: compId ?? "",
        componentName: target.dataset?.componentName ?? "",
        componentInstances: instanceCount,
      },
      payload = {
        styles: styles,
        browserClassNames: target.className?.trim?.() || "",
        metaData: metaData,
      };
    if (isTextElement) {
      const isComposite = target.childNodes.length > 1;
      Object.assign(payload, {
        textData: {
          textContent: e.target?.innerText ?? "",
          isCompositeText: isComposite,
        },
      });
    }
    if (isImageElement) {
      const insidePicture = null !== target.closest("picture");
      Object.assign(payload, {
        imageData: {
          imageSrc: target.src ?? "",
          imageAlt: target.alt ?? "",
          isImgInsidePictureElement: insidePicture,
        },
      });
    }
    window.parent.postMessage({ type: "SET_INITIAL_DATA", payload: payload }, "*");
  }
  (window.addEventListener("message", function (event) {
    try {
      const data = "string" == typeof event.data ? JSON.parse(event.data) : event.data;
      if (
        ("SET_EDIT_MODE" === data.type && window.toggleEditMode(data.payload),
        "NAVIGATION_REQUEST" === data.type &&
          (window?.next && window.next?.router
            ? window.next.router.push(data.url)
            : (history.pushState({}, "", data.url),
              window.dispatchEvent(new PopStateEvent("popstate")))),
        !activeComponentId)
      )
        return;
      if ("UPDATE_STYLES" === data.type) {
        const payloadStyles = data.payload;
        document.querySelectorAll(`[data-component-id="${activeComponentId}"]`).forEach((el) => {
          Object.assign(el.style, payloadStyles);
        });
      }
      if ("UPDATE_TEXT" === data.type) {
        const textContent = data.payload?.textContent;
        if ("string" == typeof textContent) {
          const targetEl = document.querySelector(
            `[data-component-id="${activeComponentId}"][data-component-active="true"]`,
          );
          targetEl && (targetEl.innerText = textContent);
        }
      }
      if ("UPDATE_IMAGE_SRC" === data.type) {
        const imageSrc = data.payload?.imageSrc,
          insidePicture = data.payload?.isImgInsidePictureElement ?? !1;
        if ("string" == typeof imageSrc) {
          const targetEl = document.querySelector(
            `[data-component-id="${activeComponentId}"][data-component-active="true"]`,
          );
          if (targetEl) {
            if (insidePicture && targetEl.closest("picture")) {
              targetEl.closest("picture")
                .querySelectorAll("source")
                .forEach((source) => {
                  (source.hasAttribute("srcset") && (source.srcset = imageSrc),
                    source.hasAttribute("src") && (source.src = imageSrc));
                });
            }
            targetEl instanceof HTMLImageElement && (targetEl.src = imageSrc);
          }
        }
      }
      if ("UPDATE_CLASSNAMES" === data.type) {
        const payloadClasses = data.payload;
        "string" == typeof payloadClasses?.classNames &&
          document
            .querySelectorAll(`[data-component-id="${activeComponentId}"]`)
            .forEach((el) => {
              el.className = payloadClasses.classNames;
            });
      }
      "DELETE_ELEMENT" === data.type &&
        document.querySelectorAll(`[data-component-id="${activeComponentId}"]`).forEach((el) => {
          el.remove();
        });
    } catch (e) {}
  }),
    (window.toggleEditMode = function (enabled) {
      enabled
        ? (function () {
            disableEditMode();
            try {
              editModeAbortController = new AbortController();
              const signal = editModeAbortController.signal;
              ((function () {
                if (
                  ((function () {
                    const styleEl = document.createElement("style");
                    styleEl.innerHTML =
                      '\n            #highlighter {\n                position: fixed;\n                z-index: 10000;\n                pointer-events: none;\n                background-color: #0da2e7;\n                color: white;\n                padding: 4px 8px;\n                border-radius: 4px;\n                font-size: 14px;\n                font-weight: bold;\n                line-height: 1;\n                white-space: nowrap;\n                display: none;\n                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n                transition: opacity 0.2s ease-in-out;\n                margin: 0;\n            }\n            /* Highlight styling for hovered components */\n            [data-component-hovered] {\n                position: relative;\n            }\n            [data-component-hovered]::before {\n                content: \'\';\n                position: absolute;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                border-radius: 0px;\n                border: 1px dashed #0da2e7 !important;\n                box-sizing: border-box;\n                z-index: 10000;\n                pointer-events: none;\n            }\n            /* Highlight styling for selected components */\n            [data-component-selected] {\n                position: relative;\n            }\n            [data-component-selected]::before {\n                content: \'\';\n                position: absolute;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                border-radius: 0px;\n                border: 1px dashed #0da2e7 !important;\n                box-sizing: border-box;\n                z-index: 10000;\n                pointer-events: none;\n            }\n            /* Direct border styling for form controls and media elements that don\'t support pseudo-elements */\n            :is(input, img, textarea, select, video, audio, iframe, canvas, svg)[data-component-hovered] {\n                border: 1px dashed #0da2e7 !important;\n                box-sizing: border-box;\n            }\n            :is(input, img, textarea, select, video, audio, iframe, canvas, svg)[data-component-selected] {\n                border: 1px dashed #0da2e7 !important;\n                box-sizing: border-box;\n            }\n            /* Disable border on editable content to prevent visual conflicts */\n            [data-component-selected][contenteditable] {\n                border: none !important;\n            }\n            /* Handle elements that are clipped by parent overflow containers */\n            :is([class*="overflow-hidden"], [class*="overflow-clip"]) > :is(img, video, iframe, canvas):is([data-component-hovered], [data-component-selected]) {\n                border: none !important;\n            }\n            /* Style the overflow container parent when it contains highlighted media elements */\n            :is([class*="overflow-hidden"], [class*="overflow-clip"]):has(> :is(img, video, iframe, canvas)[data-component-hovered]) {\n                border: 1px dashed #0da2e7 !important;\n                box-sizing: border-box;\n            }\n            :is([class*="overflow-hidden"], [class*="overflow-clip"]):has(> :is(img, video, iframe, canvas)[data-component-selected]) {\n                border: 1px dashed #0da2e7 !important;\n                box-sizing: border-box;\n            }\n        ';
                    const linkStyles = document.head.querySelectorAll(
                      'link[rel="stylesheet"]',
                    );
                    if (linkStyles.length > 0) document.head.insertBefore(styleEl, linkStyles[0]);
                    else {
                      const otherStyles = document.head.querySelectorAll("style");
                      otherStyles.length > 0
                        ? document.head.insertBefore(styleEl, otherStyles[0])
                        : document.head.appendChild(styleEl);
                    }
                  })(),
                  !document.getElementById("highlighter"))
                ) {
                  const highlighterEl = document.createElement("div");
                  highlighterEl.id = "highlighter";
                  const body =
                    document.body || document.getElementsByTagName("body")[0];
                  body && body.appendChild(highlighterEl);
                }
              })(),
                document.addEventListener("mouseover", highlightComponent, {
                  capture: !0,
                  signal: signal,
                }),
                document.addEventListener("mouseout", unhighlightComponent, {
                  capture: !0,
                  signal: signal,
                }),
                document.addEventListener("click", handleComponentSelection, {
                  capture: !0,
                  signal: signal,
                }),
                document.addEventListener("mousedown", blurInputOnInteraction, {
                  capture: !0,
                  signal: signal,
                }),
                document.addEventListener("focusin", blurInputOnInteraction, {
                  capture: !0,
                  signal: signal,
                }),
                document.addEventListener("beforeinput", preventInputEvent, {
                  capture: !0,
                  signal: signal,
                }),
                document.addEventListener("keydown", preventInputEvent, {
                  capture: !0,
                  signal: signal,
                }),
                document.addEventListener("paste", preventInputEvent, {
                  capture: !0,
                  signal: signal,
                }));
            } catch (e) {}
          })()
        : disableEditMode();
    }),
    (function () {
      const handleUserInteraction = (eventType, event) => {
          try {
            if (isMainFrame || isPuppeteer) return;
            const interactionData = ((el, eventObj) => {
              try {
                const isDocNode =
                    el === window ||
                    el === document ||
                    el === document.documentElement,
                  vpWidth = window.innerWidth || document.documentElement.clientWidth,
                  vpHeight =
                    window.innerHeight || document.documentElement.clientHeight,
                  scrollX = window.scrollX,
                  scrollY = window.scrollY;
                let mouseCoords = null;
                if (eventObj) {
                  const clientX = eventObj.clientX || eventObj.touches?.[0]?.clientX,
                    clientY = eventObj.clientY || eventObj.touches?.[0]?.clientY;
                  if (
                    void 0 !== clientX &&
                    void 0 !== clientY &&
                    ((mouseCoords = {
                      viewport: { x: Math.round(clientX), y: Math.round(clientY) },
                      page: { x: Math.round(clientX + scrollX), y: Math.round(clientY + scrollY) },
                    }),
                    !isDocNode && el?.getBoundingClientRect)
                  ) {
                    const rect = el.getBoundingClientRect();
                    mouseCoords.element = {
                      x: Math.round(clientX - rect.left),
                      y: Math.round(clientY - rect.top),
                    };
                  }
                }
                if (isDocNode)
                  return {
                    tag: "document",
                    id: "",
                    position: { x: scrollX, y: scrollY, width: vpWidth, height: vpHeight },
                    viewport: { width: vpWidth, height: vpHeight },
                    scroll: { x: scrollX, y: scrollY },
                    mouse: mouseCoords,
                  };
                if (!el?.getBoundingClientRect) return null;
                const bounding = el.getBoundingClientRect();
                return {
                  tag: el.tagName?.toLowerCase() || "",
                  id: el.id || "",
                  position: {
                    x: Math.round(bounding.left + scrollX),
                    y: Math.round(bounding.top + scrollY),
                    width: Math.round(bounding.width),
                    height: Math.round(bounding.height),
                  },
                  viewport: { width: vpWidth, height: vpHeight },
                  scroll: { x: scrollX, y: scrollY },
                  mouse: mouseCoords,
                };
              } catch (e) {
                return null;
              }
            })(event.target || event.srcElement, event);
            if (!interactionData) return;
            const payload = {
              eventType: eventType,
              timestamp: new Date().toISOString(),
              element: interactionData,
              page: window.location.pathname,
            };
            window.parent.postMessage(
              { type: "USER_INTERACTION", payload: payload },
              "*",
            );
          } catch (e) {}
        },
        o = (() => {
          let e;
          return function (...n) {
            (clearTimeout(e),
              (e = setTimeout(() => {
                (clearTimeout(e),
                  ((e) => {
                    t("mousemove", e);
                  })(...n));
              }, 10)));
          };
        })();
      (document.addEventListener("mousemove", throttledMouseMove),
        document.addEventListener("click", (e) => handleUserInteraction("click", e)),
        document.addEventListener("dblclick", (e) => handleUserInteraction("dblclick", e)),
        (window.addEventListener("mousedown", (e) => handleUserInteraction("mousedown", e)),
          window.addEventListener("mouseup", (e) => handleUserInteraction("mouseup", e)),
          window.addEventListener("touchstart", (e) => handleUserInteraction("touchstart", e)),
          window.addEventListener("touchend", (e) => handleUserInteraction("touchend", e)),
          window.addEventListener("scroll", (e) => handleUserInteraction("scroll", e), !0)),
        document.addEventListener("keydown", (e) => handleUserInteraction("keydown", e)));
      const inputElements = [
        "input",
        "textarea",
        "select",
        "button",
        '[contenteditable="true"]',
      ];
      (document.addEventListener("focusin", (e) => {
        r.some((t) => e.target.matches(t)) && t("focus", e);
      }),
        document.addEventListener("focusout", (e) => {
          r.some((t) => e.target.matches(t)) && t("blur", e);
        }));
      const i = (type) => (event) => {
          handleUserInteraction(type, event);
      };
      
      const onScroll = i("scroll");
      const onScrollEnd = i("scrollend");

      // Optimized: Only track main window scrolls to prevent element-level overhead
      window.addEventListener("scroll", onScroll, { passive: !0 });
      window.addEventListener("scrollend", onScrollEnd, { passive: !0 });
    })());
})();
