/**
  * dativejs v2.0.0-alpha.0
  * (c) 2021-2022 Tobithedev <ucheemekatobi@gmail.com>
  * https://github.com/dativeJs/dativejs
  * Released under the MIT License.
*/
/**
 * Converts String To HTML
 * @param {String} str
 * @returns {HTMLBodyElement}
 */
function stringToHTML(str) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(str, "text/html");
  return doc.body;
}
/** @type {Document} */
var doc = document !== undefined ? document : {};
/** @type {Boolean} */
var isClient = !!doc;

/**
 * Configuration For DativeJs Applications
 *
 * @example
 * ```ts
 *    Dative.config.foo = 'bar'
 * ```
 *
 *
 * @type {{
 *      slient: boolean
 *      mode: string
 *      noop: Function
 *      CurrentInstance: null
 * }}
 */
var config = {
  slient: isClient ? false : true,
  mode: "development",
  /** Please Do Not Append it */
  noop: function () {},
  CurrentInstance: null,
  // errorHandler: []
};
/**
 *
 * @param {any} msg
 * @param  {...any} others
 */
function warn(msg, ...others) {
  if (config.slient === false) {
    console.error("[dative Warn]: ", msg, ...others);
  }
}
/**
 *
 * @param {any} msg
 * @param  {...any} others
 */
function tip(msg, ...others) {
  if (config.slient === false) {
    console.warn("[dative tips]: ", msg, ...others);
  }
}
function _type$$(object) {
  let class2type = {},
    type = class2type.toString.call(object),
    typeString =
      "Boolean Number String Function Array Date RegExp Object Error Symbol";

  if (object == null) {
    return object + "";
  }

  typeString.split(" ").forEach((type) => {
    class2type[`[object ${type}]`] = type.toLowerCase();
  });

  return typeof object === "object" || typeof object === "function"
    ? class2type[type] || "object"
    : typeof object;
}

function isReserved(string) {
  // 0x24: $, 0x5F: _.
  const char = `${string}`.charCodeAt(0);
  return char === 0x24 || char === 0x5f;
}

function isPlainObject(object) {
  let proto,
    ctor,
    class2type = {},
    toString = class2type.toString,
    hasOwn = class2type.hasOwnProperty,
    fnToString = hasOwn.toString,
    ObjectFunctionString = fnToString.call(Object);

  if (!object || toString.call(object) !== "[object Object]") {
    return false;
  }

  proto = Object.getPrototypeOf(object);
  if (!proto) {
    return true;
  }

  ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  return (
    typeof ctor === "function" && fnToString.call(ctor) === ObjectFunctionString
  );
}
let uid = 0;
class Dep$1 {
  constructor() {
    this.id = uid++;
    this.subs = {};
  }
  addSub(sub) {
    // avoid repeated additions
    if (!this.subs[sub.uid]) this.subs[sub.uid] = sub;
  }
  notify() {
    for (let uid in this.subs) {
      this.subs[uid].update();
    }
  }
}
Dep$1.target = null;
function defineReactive(object, key) {
  let value = object[key],
    dep = new Dep$1();
  Object.defineProperty(object, key, {
    get() {
      Dep$1.target && dep.addSub(Dep$1.target);
      return value;
    },
    set(newValue) {
      value = newValue;
      dep.notify();
    },
  });
  return object;
}
function observe(data) {
  if (_type$$(data) != "object") return;
  var obj;
  for (let key in data) {
    obj = defineReactive(data, key);
  }
  return obj;
}

function proxy(sourceKey, key) {
  let self = this;
  Object.defineProperty(self, key, {
    configurable: true,
    enumerable: true,
    get: function reactivegetter() {
      return self[sourceKey][key];
    },
    set: function reactivesetter(newVal) {
      self[sourceKey][key] = newVal;
      self.render();
      return true;
    },
  });
}
function sanitizeStr(obj) {
  return obj.replace(/javascript:/gi, "").replace(/[^\w-_. ]/gi, function (c) {
    return `&#${c.charCodeAt(0)};`;
  });
}
function initData(options, dative) {
  let data = options.data;
  data = dative.data =
    typeof data === "function" ? data.apply(dative, [dative]) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    warn(
      "options data should return an object." +
        "https://dativejs.js.org/api#why-data-should-return-object/"
    );
  }

  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    var val = data[keys[i]];
    if (typeof val === "string" && dative.sanitize) {
      data[keys[i]] = sanitizeStr(data[keys[i]]);
    }
    if (!isReserved()) dative.proxy(`data`, keys[i]);
  }
  observe(data);
}
var _typeof$1 =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function (obj) {
        return typeof obj;
      }
    : function (obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

function type(object) {
  var class2type = {};
  var type = class2type.toString.call(object);
  var typeString =
    "Boolean Number String Function Array Date RegExp Object Error Symbol";

  if (object == null) return "" + object;

  typeString.split(" ").forEach(function (type) {
    return (class2type["[object " + type + "]"] = type.toLowerCase());
  });

  return (typeof object === "undefined" ? "undefined" : _typeof$1(object)) ===
    "object" || typeof object === "function"
    ? class2type[type] || "object"
    : typeof object === "undefined"
    ? "undefined"
    : _typeof$1(object);
}

function eachparse(options) {
  return (_, char) => {
    if (!char.includes("as")) {
      warn("Expected keyword 'as' But got " + "'  '" + "");
    }
    char = char.replace(/as/, "of");
    var each = char.split("of");
    function d(c) {
      if (c[1].startsWith("{") && c[1].split(" ") && c[1].endsWith("}")) {
        var space = c[1].split(" ");
        for (const {} in space) {
          var cx = space.join(",");
          return `[${c[0]}, ${cx}]`;
        }
      }
      return `[${c[0]},${c[1]}]`;
    }

    return `for (const ${
      each[1].includes(",")
        ? d(each[1].split(","))
        : each[1].startsWith("{") && each[1].endsWith("}")
        ? each[1]
        : each[1]
    } of ${
      !each[1].startsWith("{") && each[1].includes(",")
        ? `Object.entries(${each[0].trim()})`
        : each[0]
    }) {`;
  };
}
function ifparse(_, char) {
  return `if (${char}) {`;
}
function elseifparse(_, char) {
  return `} else if (${char}) {`;
}
function elseparse(_, char) {
  return "} else {";
}

function withparse(_, char) {
  return `with (${char}) {`;
}

function debugparse(_, char) {
  return `_c(console[console.debug ? 'debug' : 'log']({${char}}));\n debugger`;
}

function commentparse(_, char, charr) {
  return `/** ${charr} **/`;
}

function variableparse(_, char) {
  return `let ${char};`;
}

function isFunction(val) {
  return typeof val === "function";
}

var inBrowser = typeof window !== "undefined";

const range = 2;

function generateCodeFrame(source, start = 0, end = source.length) {
  // Split the content into individual lines but capture the newline sequence
  // that separated each line. This is important because the actual sequence is
  // needed to properly take into account the full line length for offset
  // comparison
  let lines = source.split(/(\r?\n)/);
  // Separate the lines and newline sequences into separate arrays for easier referencing
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
  lines = lines.filter((_, idx) => idx % 2 === 0);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count +=
      lines[i].length +
      ((newlineSequences[i] && newlineSequences[i].length) || 0);
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) continue;
        const line = j + 1;
        res.push(
          `${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${
            lines[j]
          }`
        );
        const lineLength = lines[j].length;
        const newLineSeqLength =
          (newlineSequences[j] && newlineSequences[j].length) || 0;
        if (j === i) {
          // push underline
          const pad = start - (count - (lineLength + newLineSeqLength));
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start
          );
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + newLineSeqLength;
        }
      }
      break;
    }
  }
  return res.join("\n");
}
//{{(.+?)}}
var string$ = /`/g;

function parse(html, options, elem) {
  html = html.trim();
  var re = /{{(.+?)}}/g,
    reExp =
      /(^( )?(var|let|const|await|if|for|else|{|}|#each|\/each|#if|:else|:else if|\/if|#with|\/with|debugger|@debug|\$:|;))(.*)?/g,
    code = "with(obj) { var r=[]; ",
    cursor = 0,
    result = "",
    match;
  code += "var _c = (msg)=>{ return r.push(msg)}; ";
  var add = function (line, js) {
    js
      ? (code += line.match(reExp)
          ? line
              .replace(/#each ((?:.|)+)/g, eachparse())
              .replace(/\/each/g, "\n}")
              .replace(/#if ((?:.|)+)/g, ifparse)
              .replace(/:else if ((?:.|)+)/g, elseifparse)
              .replace(/:else/g, elseparse)
              .replace(/\/if/g, "}")
              .replace(/#with ((?:.|)+)/g, withparse)
              .replace(/\/with/g, (_) => `}`)
              .replace(/@debug\s+?((?:.|)+)/g, debugparse)
              .replace(/\$:\s+((?:.|)+)/g, variableparse) + "\n"
          : "_c(" + line.replace(/!(--)?((?:.|)+)?/g, commentparse) + ");\n")
      : (code +=
          line != ""
            ? "_c(`" +
              line.replace(string$, "\\`").replace(/\${/g, "$\\{") +
              "`);"
            : "");

    return add;
  };
  while ((match = re.exec(html))) {
    add(html.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }

  add(html.substr(cursor, html.length - cursor));
  code = (code + 'return r.join(""); }').replace(/[\t]/g, "").trim();
  try {
    result = new Function("obj", code).apply(options, [options]);
  } catch (err) {
    console.error(
      "Compiler " +
        err.name +
        ": " +
        err.message +
        " at \n" +
        generateCodeFrame(options.template)
    );
  }
  return result;
}

function stringToHTML$__(str) {
  // Create document
  let parser = new DOMParser();
  let doc = parser.parseFromString(str, "text/html");

  return doc.body || document.createElement("body");
}

/**
 * Get the content from a node
 * @param  {Node}   node The node
 * @return {String}      The content
 */
function getNodeContent(node) {
  return node.childNodes && node.childNodes.length ? null : node.textContent;
}

/**
 * Check if two nodes are different
 * @param  {Node}  node1 The first node
 * @param  {Node}  node2 The second node
 * @return {Boolean}     If true, they're not the same node
 */
function isDifferentNode(node1, node2) {
  return (
    node1.nodeType !== node2.nodeType ||
    node1.tagName !== node2.tagName ||
    node1.id !== node2.id ||
    node1.src !== node2.src
  );
}

/**
 * Check if the desired node is further ahead in the DOM existingNodes
 * @param  {Node}     node           The node to look for
 * @param  {NodeList} existingNodes  The DOM existingNodes
 * @param  {Integer}  index          The indexing index
 * @return {Integer}                 How many nodes ahead the target node is
 */
function aheadInTree(node, existingNodes, index) {
  return Array.from(existingNodes)
    .slice(index + 1)
    .find(function (branch) {
      return !isDifferentNode(node, branch);
    });
}

/**
 * If there are extra elements in DOM, remove them
 * @param  {Array} existingNodes      The existing DOM
 * @param  {Array} templateNodes The template
 */
function trimExtraNodes(existingNodes, templateNodes) {
  let extra = existingNodes.length - templateNodes.length;
  if (extra < 1) return;
  for (; extra > 0; extra--) {
    existingNodes[existingNodes.length - 1].remove();
  }
}

/**
 * Diff the existing DOM node versus the template
 * @param  {Element} template The template HTML
 * @param  {Node}  elem     The current DOM HTML
 * @param  {Array} polyps   Attached components for this element
 */
function compiler(template, elem, polyps = []) {
  // Get arrays of child nodes
  let domMap = elem.childNodes;
  let templateMap = template.childNodes;
  // Diff each item in the templateMap
  templateMap.forEach(function (node, index) {
    if (template.querySelectorAll("template")) {
      var temps = template.querySelectorAll("template");
      for (var temp of temps) {
        const fragg = document.createElement("div");
        fragg.innerHTML = temp.innerHTML;
        temp.replaceWith(fragg);
      }
    }
    // If element doesn't exist, create it
    if (!domMap[index]) {
      elem.append(node.cloneNode(true));
      return;
    }
    // If element is not the same type, update the DOM accordingly
    if (isDifferentNode(node, domMap[index])) {
      // Check if node exists further in the tree
      let ahead = aheadInTree(node, domMap, index);

      // If not, insert the node before the current one
      if (!ahead) {
        domMap[index].before(node.cloneNode(true));
        return;
      }

      // Otherwise, move it to the current spot
      domMap[index].before(ahead);
    }
    // If element is an attached component, skip it
    let isPolyp = polyps.filter(function (polyp) {
      return ![3, 8].includes(node.nodeType) && node.matches(polyp);
    });

    if (isPolyp.length > 0) return;
    // If content is different, update it
    let templateContent = getNodeContent(node);
    if (templateContent && templateContent !== getNodeContent(domMap[index])) {
      domMap[index].textContent = templateContent;
    }

    // If target element should be empty, wipe it
    if (domMap[index].childNodes.length > 0 && node.childNodes.length < 1) {
      domMap[index].innerHTML = "";
      return;
    }

    // If element is empty and shouldn't be, build it up
    // This uses a document fragment to minimize reflows
    if (domMap[index].childNodes.length < 1 && node.childNodes.length > 0) {
      let fragment = document.createDocumentFragment();
      compiler(node, fragment, polyps);
      domMap[index].appendChild(fragment);
      return;
    }

    // If there are existing child elements that need to be modified, diff them
    if (node.childNodes.length > 0) {
      compiler(node, domMap[index], polyps);
    }
  });

  // If extra elements in DOM, remove them
  trimExtraNodes(domMap, templateMap);
}
var processor = function (elem, template, data) {
  if (elem instanceof Element) {
    var temp = stringToHTML(template);
    if (temp.childElementCount > 1) {
      warn(
        "Multiple root nodes returned from template. Template",
        "should return a single root node. \n",
        temp.innerHTML,
        "\n" +
          "^".repeat(
            temp.innerHTML.length / temp.lastChild.textContent.length - 2
          )
      );
      return;
    }
    if (temp.querySelector("script")) {
      warn(
        "<script> inside template will not be compiled and will give errors"
      );
      return;
    }

    if (temp.querySelector("style")) {
      warn("<style> inside template will not be compiled and will give errors");
    }

    compiler(stringToHTML$__(parse(template, data)), elem);
  } else {
    warn(typeof elem + " not a Node");
  }
};
function event(data, expression, elem, evt) {
  var _$ = "with(obj){ var $on = []; var _on = (c)=> $on.push(c);";
  _$ += "_on((($event,$self)=>{" + expression + "})($event,$self));";
  _$ = _$ + 'return $on.join("") }';
  try {
    new Function("obj", "$event", "$self", _$).apply(data, [data, evt, elem]);
  } catch (err) {
    const message__ =
      "Compiler (Event) " +
      err.name +
      ": " +
      err.message +
      " found at: \n" +
      elem.outerHTML +
      "\n" +
      "^".repeat(elem.outerHTML.length) +
      "\n";
    warn(message__);
  }
}
function attributeparser(data, elem$$, self) {
  var result;
  var code = "with (obj) { var att = []; var _a = (c)=> att.push(c);";
  code += `_a(${elem$$});`;
  code = code + 'return att.join(""); }';
  try {
    result = new Function("obj", code).apply(data, [data]);
  } catch (err) {
    const message__ =
      "Compiler (Directives) " +
      err.name +
      ": " +
      err.message +
      " found at: \n" +
      self.outerHTML +
      "\n^^^^^^^^\n";
    warn(message__);
  }
  return result;
}
var warnDuplicate = function (target, key, property) {
  warn(
    'Property "' +
      key +
      '" is already defined in the ' +
      property +
      "property" +
      target || ""
  );
};

/**
 * @param {Element|String} el
 */
function query(el) {
  if (typeof el === "string") {
    var elem = document.querySelector(el);
    if (!elem) {
      warn("Can't find this element " + el);
      return document.createElement("div");
    }
    return elem;
  } else {
    if (el.shadowRoot) {
      return el.shadowRoot.host;
    } else {
      return el;
    }
  }
}

/**
 * @param {string} id
 */
function idToTemplate(id) {
  var el = query(id);
  if (el.tagName.toLowerCase() !== "script") {
    warn(`Template element with id ${id}, must be a <script> element
      Instead of <${el.tagName.toLowerCase()} id='${id.replace(/#/g, "")}' ${
      el.hasAttribute("class")
        ? `class="${el.getAttribute("class")}"`
        : el.hasAttribute("style")
        ? `style="${el.getAttribute("style")}"`
        : ""
    } ...>...</${el.tagName.toLowerCase()}> Use <script type="text/dative" id="${id.replace(
      /#/g,
      ""
    )}" ...>...</script>`);
    return;
  }
  return el && el.innerHTML;
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
function uuid_() {
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}
/**
 * Prefix for directives
 */
function prefix(subject = "") {
  return "dv-" + subject;
}
function valps(val, data) {
  var sub = val.split(".");
  if (sub.length > 1) {
    var temp = data;
    sub.forEach((item) => {
      if (!temp[item]) return;
      temp = temp[item];
    });
    return temp;
  } else if (!data[val]) return;
  return data[val];
}

/**
 * @param {Dative} Dative
 */
function initRender(Dative) {
  /**
   * @param {string|object} obj new object for the data
   * @param {any} data new object for the data
   **/
  Dative.prototype.set = function set(obj, data) {
    var $this = this;
    if (typeof obj !== "object") {
      $this[obj] = data;
      $this.render();
    } else {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          $this[key] = obj[key];
          $this.render();
        }
      }
    }
  };
  Dative.prototype.get = function get(value = "") {
    return value === "" ? this : valps(value, this);
  };
  function kebabToCamel(str, options = { prefix: "", ignorePrefix: "" }) {
    const { prefix, ignorePrefix } = options;
    let ignoredStr = str;
    if (
      ignorePrefix !== undefined &&
      ignorePrefix !== null &&
      ignorePrefix !== ""
    ) {
      ignoredStr = ignoredStr.replace(new RegExp(`^${ignorePrefix}-`), "");
    }
    const camelStr = ignoredStr
      .split("-")
      .filter((s) => s !== "")
      .reduce((r, s) => (r = r + `${s[0].toUpperCase()}${s.slice(1)}`));
    if (prefix !== undefined && prefix !== null && prefix !== "") {
      return `${prefix}${camelStr.replace(/^([a-z])/, (m, p) =>
        p.toUpperCase()
      )}`;
    }
    return camelStr;
  }
  /**
   *
   * @param {Element} target
   * @param {string} key
   * @param {Element} elem
   * @param {boolean} isDirective
   */
  var warnDuplicate$ = function (target, key, elem, isDirective = false) {
    target &&
      warn(
        `'${key}' is in ${elem} already.Do not duplicate ${
          isDirective ? "directives" : "attributes"
        }`
      );
  };

  /**
   *
   * @param {Array<any>} polyps
   * @param {any} dv
   * @returns {void}
   */
  function renderPolyps(polyps, dv) {
    if (!polyps) return;
    polyps.forEach(function (component) {
      if (component.attached.includes(dv))
        return err(
          `"${dv.$el}" has attached nodes that it is also attached to, creating an infinite loop.`
        );
      if ("render" in component) component.render();
    });
  }
  /**
   * Credits: DativeAnimate
   * @link https://tobithedev.github.io/dative-animation
   * @param {HTMLElement|Element} el Element to be animated
   * @param {Number} duration duration for the animation
   * @param {Number} delay
   * @param {Boolean} once
   */
  function fadeIn(el, duration, delay = 0, once = true) {
    var op = 0;
    var animate = el.animate([{ opacity: op }, { display: "block" }], {
      duration,
      delay,
      easing: "linear",
    });
    var timer = setInterval(function () {
      if (op >= 1.0) {
        clearInterval(timer);
        if (once) {
          animate.pause();
        }
      }
      animate = el.animate([{ transition: "2s" }, { opacity: op }], {
        duration,
        delay,
        easing: "linear",
      });
      op = op + 0.1;
      if (once) {
        animate.cancel();
      }
    }, duration);
  }

  /**
   * Credits: DativeAnimate
   * @param {HTMLElement|Element} el Element to be animated
   * @param {Number} duration duration for the animation
   * @param {Number} delay
   * @param {Boolean} once
   */
  function bounce(el, duration, delay = 0, once = false) {
    var animate = el.animate(
      [
        {
          animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          transform: "translateY(-25%)",
        },
        {
          animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          transform: "translateY(0)",
        },
      ],
      {
        duration,
        delay,
        easing: "linear",
        iterations: Infinity,
      }
    );
    if (once === true) {
      animate.cancel();
    }
  }
  /**
   * returns the template to the dom
   * @returns {Element}
   **/
  Dative.prototype.render = function () {
    var $app = this;
    $app.kebabToCamel = kebabToCamel;
    let template =
      type(this.options.template) === "function"
        ? this.options.template()
        : this.options.template || "";
    if (typeof template === "string") {
      if (template[0] === "#") {
        template = idToTemplate(template);
      }
    }
    /** @type {string} */
    this.template = template;
    $app.isMounted = true;
    $app.isUnmounted = false;
    var target = $app.options.target || $app.options.el;
    if (target) {
      $app.$el = query(target);
      $app.$el.setAttribute("data-dative-app", "");
    }
    if (
      $app.$el == document.documentElement ||
      $app.$el == document.body ||
      $app.$el === doc.head
    ) {
      this.$el.remove();
      $app.isUnmounted = true;
      warn("Can't mount on <head> or <body>");
    }
    if (this.$el && !template) {
      $app.isUnmounted = true;
      warn(
        "You did not provide a template for this instance or template returned " +
          typeof template
      );
    }
    $app.$el.dative_app = $app;
    /** @type {Element} */
    var elem = this.$el;
    if ($app.isMounted) {
      $app.attached.map(function (polyp) {
        return polyp.$el;
      });
      processor(elem, template.trim(), this);

      renderPolyps($app.attached, $app);
      for (const el of elem.querySelectorAll("*")) {
        if ($app.options.css) {
          el.setAttribute("data-dative-css", $app.cssId_);
        }
        for (const name of el.getAttributeNames()) {
          if (name.startsWith(prefix("on:")) || name.startsWith("on:")) {
            var eventName = name.slice(6);
            if (name.startsWith("on:")) {
              eventName = name.slice(3);
            }

            const handlerName = el.getAttribute(name);
            if ($app.events) {
              for (const events in $app.events) {
                const vall = $app.events[events];
                // console.log(events,vall);
                if (eventName === events) {
                  vall(el, event.bind(this));
                }
              }
            }
            el.addEventListener(eventName, (evt) => {
              event(this, handlerName, el, evt);
            });

            el.removeAttribute(name);
          } else if (name.startsWith("transition") || name.startsWith("#")) {
            name.slice(11);
            if (name.startsWith("#")) {
              name.slice(1);
            }
            var transyName = el.getAttribute(name);
            let modifiersregexp = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
            let modifiers = modifiersregexp.map((i) => i.replace(".", ""));
            var transitionMap = {
              enter: function enter(klass) {
                el.classList.add(klass + "-enter");
              },
              "before-enter": function enter(klass) {
                el.classList.add(klass + "-before-enter");
              },
              leave: function enter(klass) {
                el.classList.add(klass + "-leave");
              },
              "before-leave": function enter(klass) {
                el.classList.add(klass + "-before-leave");
              },
            };
            if (transyName !== null) {
              modifiers.map(($value) => {
                if ($value == "leave") transitionMap[$value](transyName);
                else if ($value == "enter") transitionMap[$value](transyName);
                else if ($value == "before-enter")
                  transitionMap[$value](transyName);
                else if ($value == "before-leave")
                  transitionMap[$value](transyName);
              });
            } else {
              modifiers.map(($value) => {
                if ($value == "leave") {
                  el.style.transition = {
                    opacity: 0,
                    transform: `scale(1)`,
                  };
                } else if ($value == "enter") {
                  el.style.transition = {
                    opacity: 1,
                    transform: `scale(1)`,
                  };
                } else if ($value == "before-enter") {
                  el.style.transition = {
                    opacity: 0,
                    transform: `scale(1)`,
                  };
                } else if ($value == "before-leave") {
                  el.style.transition = {
                    opacity: 1,
                    transform: `scale(1)`,
                  };
                }
              });
            }
            el.removeAttribute(name);
          } else if (name.startsWith("animate:") || name.startsWith("@")) {
            var animation_name = name.slice(8);
            if (name.startsWith("@")) {
              animation_name = name.slice(1);
            }
            const checkani = el.getAttribute(name).split(",");

            var animationName = {
              duration: checkani[0],
              delay: checkani[1],
              ease: checkani[2],
            };
            const delay = animationName.delay;
            const duration = animationName.duration;
            const ease = animationName.ease;
            if ($app.animate) {
              for (const animate in $app.animate) {
                const vall = $app.animate[animate];
                const setStyle = (options) => {
                  for (const key in options) {
                    if (Object.hasOwnProperty.call(options, key)) {
                      const property = options[key];
                      el.style[key] = property;
                    }
                  }
                };
                if (animation_name === animate) {
                  vall({
                    animate: el.animate.bind(el),
                    setStyle,
                    duration: Number(duration),
                    delay: Number(delay),
                    ease: ease,
                  });
                }
              }
            }
            if (animation_name === "fadein") {
              fadeIn(el, Number(duration) || 200, Number(delay) || 200);
            } else if (animation_name === "bounce") {
              bounce(el, Number(duration) || 200, Number(delay) || 200);
            }
            el.removeAttribute(name);
          } else if (name === prefix("ref") || name === "ref") {
            if (el.ref) {
              warnDuplicate$(el, "ref", el, true);
              return;
            }
            const refName = el.getAttribute(name);
            this.$ref[refName] = el;
            el.removeAttribute(name);
          } else if (
            name.startsWith(prefix("bind:")) ||
            name.startsWith("bind:")
          ) {
            let propName = name.slice(8);
            if (name.startsWith("bind:")) {
              propName = name.slice(5);
            }
            const dataName = el.getAttribute(name);
            if (propName === "this") {
              if (el.ref) {
                warnDuplicate$(el, "bind:this", el, true);
                return;
              }
              this.$ref[dataName] = el;
              el.removeAttribute(name);
            } else {
              el[this.kebabToCamel(propName)] = attributeparser(
                this,
                dataName,
                el
              );
              el.removeAttribute(name);
            }
          } else if (name === prefix("cloak")) {
            if (el.getAttribute(name) !== "") {
              warn(
                "`dv-cloak` doesn't accepts any value.\nShould be\n<" +
                  el.tagName.toLowerCase() +
                  " dv-cloak ...>...</" +
                  el.tagName.toLowerCase() +
                  ">"
              );
            }
            queueMicrotask(() => el.removeAttribute(name));
          }

          for (var keys in $app.directives) {
            var val = $app.directives[keys];
            if (typeof val === "function") {
              var $name = keys;
              if (name.startsWith(prefix($name))) {
                var binding = el.getAttribute(name);
                let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
                val(el, {
                  bind: {
                    value: attributeparser(this, binding, el),
                    args: name.split(":")[1],
                    name: name,
                    expression: binding,
                    modifiers: modifiers.map((i) => i.replace(".", "")),
                  },
                });
                val._dv_directives_ = el._dv_directives_ = {
                  active: true,
                  args: name.split(":")[1],
                  value: attributeparser(this, binding, el),
                  expression: binding,
                  name: name,
                  modifiers: modifiers.map((i) => i.replace(".", "")),
                };
                el.removeAttribute(name);
              }
            }
          }
        }
      }

      return elem;
    }
  };
  /**
   * Attach a component to this one
   * @param  {Function|Array<Function>} component The component(s) to attach
   */
  Dative.prototype.attach = function (component) {
    var ref = this;
    // Attach components
    let polyps = type(component) === "array" ? component : [component];
    for (let polyp of polyps) {
      ref.attached.push(polyp);
    }
  };
}

/**
 * Detach a linked component to this one
 * @param  {Function|Array<Function>} component The linked component(s) to detach
 */
Dative.prototype.detach = function (component) {
  // Detach components
  let polyps = type(component) === "array" ? component : [component];
  for (let polyp of polyps) {
    let index = this.attached.indexOf(polyp);
    if (index < 0) return;
    this.attached.splice(index, 1);
  }
};
/**
 * @param {String} str
 * @param {boolean} expectsLowerCase
 */
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let lists in list) {
    map[list[lists]] = true;
  }
  return expectsLowerCase
    ? (val) => !!map[val.toLowerCase()]
    : (val) => !!map[val];
}

var BuiltinNames = makeMap(
  "object, function,switch,const,eval,var,let,Object,Array,in,of,if,else,instanceof,this,class,export,import,default,try,catch"
);

/**
 * @param {Dative} dative
 */
function initMethods(dative) {
  let methods = dative.methods;
  if (methods) {
    for (const key in methods) {
      if (key in dative.data) {
        warnDuplicate(this, key, "data");
        return;
      }
      if (BuiltinNames(key)) {
        warn(
          "Don't use Valid Javascript Builtin names for functions in methods to avoid errors"
        );
      }
      if (typeof methods[key] !== "function") {
        warn(
          `Method "${key}" has type "${typeof methods[
            key
          ]}" in the component definition. ` +
            `Did you reference the function correctly?`
        );
        return;
      }
      if (key in dative && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Dative instance method. ` +
            `Avoid defining component methods that start with _ or $.`
        );
        return;
      }
      dative[key] =
        methods[key] == null
          ? config.noop
          : typeof methods[key] == "function"
          ? methods[key].bind(dative)
          : "";
      dative[key]._dv_function = true;
    }
  }
}

/**
 * idtotemplate converter for style
 * @param {string} id
 */
function idToTemplate$1(id) {
  var el = query(id);
  if (el.tagName.toLowerCase() !== "style") {
    warn(
      `Template element with id ${id}, must be a <style> element.\nInstead of <${el.tagName.toLowerCase()} id='${id.replace(
        /#/g,
        ""
      )}' ${
        el.hasAttribute("class")
          ? `class="${el.getAttribute("class")}"`
          : el.hasAttribute("style")
          ? `style="${el.getAttribute("style")}"`
          : ""
      } ...>...</${el.tagName.toLowerCase()}> Use <style type="text/dss" id="${id.replace(
        /#/g,
        ""
      )}" ...>...</style>`
    );
    return;
  }
  return el && el.innerHTML;
}
/** @type {Number} */
var $$uid = 0;

/**
 * Install Dative plugin
 * @param  {Array<Dative>} args The Dative plugin
 */
function use() {
  var arguments$1 = arguments;

  var _this = this;
  var plugins = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    plugins[_i] = arguments$1[_i];
  }
  plugins.forEach(function (p) {
    if (p.install && isFunction(p.install)) {
      p.install({
        proto: _this.constructor.prototype,
        Dative: _this.constructor,
        instance: _this,
      });
    } else {
      p({
        proto: _this.constructor.prototype,
        Dative: _this.constructor,
        instance: _this,
      });
    }
  });
  return this;
}
var ReservedProperties = makeMap("el,ref");

class DeprecatedError extends Error {
  constructor(message) {
    super(message);
    this.name = "DeprecatedError";
    this.message = message;
  }
}

function depd(namespace) {
  return function deprecated(message) {
    console.warn(new DeprecatedError(`${namespace} ${message}`));
  };
}
function _init($this) {
  $this.oncreated = $this.options.oncreated || config.noop;
  $this.onmounted = $this.options.onmounted || config.noop;
  $this.methods = $this.options.methods || Object.create(null);
  $this.directives = $this.options.directives || Object.create(null);
  $this.animate = $this.options.animate || Object.create(null);
  $this.$ref = Object.create(null);
  $this.isUnmounted = false;
  $this.isMounted = false;
  $this.ondestroy = $this.options.ondestroy || config.noop;
  $this.attached = [];
  $this.sanitize =
    $this.options.sanitize === undefined ? false : $this.options.sanitize;
  if ($this.options.css) $this.cssId_ = uuid_();
  initData($this.options, $this);
  initMethods($this);
  var attach = $this.options.attach
    ? type($this.options.attach) === "array"
      ? $this.options.attach
      : [$this.options.attach]
    : [];
  if ($this.oncreated !== undefined && $this.oncreated !== null) {
    $this.oncreated();
  }
  $this._uid = $$uid += 1;
  if ($this.options.store) {
    var deprecated$ = depd("store");
    deprecated$(
      "options has been deprecated in Dyte" +
        (config.dyte ? " " + config.dyte.version : "") +
        " and in DativeJs " +
        Dative.version +
        ".Access it globally after installing Dyte.\n`app.use(store);`"
    );
  }
  if ($this.options.update) {
    var deprecated$$ = depd("update");
    deprecated$$(
      "options has been deprecated in " +
      Dative.version
    );
  }

  /**
   * initialize mounted hooks
   **/
  if ($this.onmounted !== undefined && $this.onmounted !== null) {
      $this.onmounted();
  } else if (
    $this.isUnmounted &&
    $this.ondestroy !== null &&
    $this.ondestroy !== undefined
  ) {
    $this.ondestroy();
  }
  const computed = $this.options.computed || Object.create(null);
  if (!computed) return false;
  for (let key in computed) {
    const value = computed[key];
    if (key in $this.data || key in $this.methods) {
      warnDuplicate($this, key, key in $this.data ? "data" : "methods");
      return;
    }
    if (typeof value === "function") {
      Object.defineProperty($this, key, {
        get: value,
        enumerable: true,
        configurable: true,
      });
    } else if (
      typeof value === "string" ||
      (typeof value !== "function" && typeof value !== "object")
    ) {
      warn(
        "computed options accepts ``Object|Function`` but got " + typeof value
      );
      return;
    } else if (typeof value === "object") {
      Object.defineProperty($this, key, {
        get: value.get || config.noop,
        set: value.set || config.noop,
        configurable: true,
      });
    }
  }
  var property$ = $this.options.property || Object.create(null);
  for (var prop in property$) {
    if (ReservedProperties(prop)) {
      WarnReserved$(prop);
      return;
    }
    const vall = property$[prop];
    if (typeof vall === "function") {
      Object.defineProperty($this, "$" + prop, {
        get: function propertygetter() {
          return vall($this);
        },
        configurable: true,
      });
    }
  }

  if (attach.length) {
    attach.forEach(function (component) {
      if ("attach" in component) {
        component.attach($this);
      }
    });
  }

  if ($this.$el) $this.render();
}

/**
 * Create the Dative Application
 * @param {Object} options The component options
 */
function Dative(options) {
  options = options || {};
  if (!("DOMParser" in window)) warn("Your Browser Doesnt support DativeJs.");
  if (!(this instanceof Dative)) warn("Dative Must be called as a constructor");
  var $this = this;
  $this.options = options;
  config.CurrentInstance = $this;
  var $plugins = $this.options.use || [];
  var styles = $this.options.css;

  if (styles) {
    warn(
      "css options is not supported on per-instance. Use it in \n var Component = Dative.extend({ \n ...,\n css: '/** Your css **/' });\n var comp = new Component({ ... });"
    );
  }
  if ($plugins) {
    if (Array.isArray($this.options.use)) {
      $this.use.apply($this, $this.options.use);
    }
  }
  _init($this);
  
}

initRender(Dative);
/**
 * Destroys the current instance
 */
Dative.prototype.$destroy = function () {
  var $this = this;
  if ($this.isUnmounted) {
    warn("Instance can't be unmounted again");
  }
  if ($this.isMounted) {
    this.$el.firstChild.remove();
    delete this.onmounted;
    delete this.$el.dative_app;
    $this.isUnmounted = true;
    $this.isMounted = false;
    $this.ondestroy();
  } else {
    warn("Cannot use $destroy() on an instance that's not mounted");
  }
};

Dative.prototype.proxy = proxy;
Dative.prototype.use = use;

var configs = { enumerable: true, configurable: true };
configs.get = function () {
  return config;
};
{
  configs.set = function () {
    warn(
      "Do not replace the Dative.config object, set individual fields instead."
    );
  };
}
Object.defineProperty(Dative, "config", configs);
var WarnReserved$ = function (key, target) {
  warn(
    ["`" + key + "` is a reserved property.\n", "Try using another name"].join(
      ""
    ),
    target
  );
};

/**
 * @param {string} name name of the property
 * @param {Function} callback callback function
 */

var property = function (name, callback) {
  if (ReservedProperties(name)) {
    WarnReserved$(name);
    return;
  }
  Object.defineProperty(Dative.prototype, "$" + name, {
    get: function propertygetter() {
      return callback();
    },
    set: function propertysetter(v) {
      warn("Dative.defineProperty is readonly");
    },
    configurable: true,
    enumerable: true,
  });
};

/**
 * @param {any} options
 */
var defineApp = function defineApp(options) {
  if (options.data) {
    if (typeof options.data !== "function") {
      warn(`Data should be a function,But got ${typeof options.data}`);
      return;
    }
  }
  return new Dative(options);
};

function initProps(options, dative, prop) {
  let props = options.props;
  props = dative.props = props || Object.create(null);
  if (!Array.isArray(props) && !isPlainObject(props)) {
    props = {};
    warn("options props should return an object.");
  }

  const props_ = prop;
  for (let propss in props_) {
    if (typeof prop[propss] === "string" && dative.sanitize) {
      prop[propss] = sanitizeStr(prop[propss]);
    }
    if (!isReserved())
      dative.proxyProps(
        `props`,
        propss,
        props_[propss].type || props_[propss],
        propss,
        props_[propss].default
      );
  }
  observe(props);
}
function proxyProps(sourceKey, key, value, name, defaultvalue) {
  let self = this;
  Object.defineProperty(self, key, {
    configurable: true,
    enumerable: true,
    get: function reactivepropsgetter() {
      var va = self[sourceKey][key];
      if (value === String && typeof va !== "string") {
        warn(
          'Props "' +
            name +
            '" requires String as the value but got ' +
            typeof va
        );
        return "undefined";
      } else if (value === Number && typeof va !== "number") {
        warn(
          'Props "' +
            name +
            '" requires Number as the value but got ' +
            typeof va
        );
        return "undefined";
      } else if (value === Number && typeof va !== "number") {
        warn(
          'Props "' +
            name +
            '" requires Number as the value but got ' +
            typeof va
        );
        return "undefined";
      } else if (value === Function && typeof va !== "function") {
        warn(
          'Props "' +
            name +
            '" requires Function as the value but got ' +
            typeof va
        );
        return "undefined";
      } else if (value === Object && typeof va !== "object") {
        warn(
          'Props "' +
            name +
            '" requires Object as the value but got ' +
            typeof va
        );
        return "undefined";
      } else if (value === Array && type(va) !== "array") {
        warn(
          'Props "' +
            name +
            '" requires Array as the value but got ' +
            typeof va
        );
        return "undefined";
      } else if (value === Boolean && typeof va !== "boolean") {
        warn(
          'Props "' +
            name +
            '" requires Boolean as the value but got ' +
            typeof va
        );
        return "undefined";
      } else if (value === null) {
        return self[sourceKey][key] || defaultvalue;
      } else {
        return self[sourceKey][key] || defaultvalue;
      }
    },
    set: function reactivepropssetter(newVal) {
      if (value === String && typeof newVal !== "string") {
        warn(
          'Props "' +
            name +
            '" requires String as the value but got ' +
            typeof newVal
        );
        return;
      } else if (value === Number && typeof newVal !== "number") {
        warn(
          'Props "' +
            name +
            '" requires Number as the value but got ' +
            typeof newVal
        );
        return;
      } else if (value === Function && typeof newVal !== "function") {
        warn(
          'Props "' +
            name +
            '" requires Function as the value but got ' +
            typeof newVal
        );
        return;
      } else if (value === Object && typeof newVal !== "object") {
        warn(
          'Props "' +
            name +
            '" requires Object as the value but got ' +
            typeof newVal
        );
        return;
      } else if (value === Boolean && typeof newVal !== "boolean") {
        warn(
          'Props "' +
            name +
            '" requires Boolean as the value but got ' +
            typeof newVal
        );
        return;
      } else if (value === Array && type(newVal) !== "array") {
        warn(
          'Props "' +
            name +
            '" requires Array as the value but got ' +
            typeof newVal
        );
        return;
      } else if (value === null) {
        self[sourceKey][key] = newVal;
        self.render();
      } else {
        self[sourceKey][key] = newVal;
        self.render();
        return true;
      }
    },
  });
}

var PREFIX = "/* Dative.js component styles */";
function makeStyle(id) {
  if (doc) {
    var el = doc.createElement("style");
    el.type = "text/css";
    el.setAttribute("data-dative-css", id || "");
    doc.getElementsByTagName("head")[0].appendChild(el);
    return el;
  }
}
function getStyle(id) {
  return (
    doc &&
    (doc.querySelector('[data-dative-css="' + id + '"]') || makeStyle(id))
  );
}

var remove = /\/\*(?:[\s\S]*?)\*\//g;
var escape =
  /url\(\s*(['"])(?:\\[\s\S]|(?!\1).)*\1\s*\)|url\((?:\\[\s\S]|[^)])*\)|(['"])(?:\\[\s\S]|(?!\2).)*\2/gi;
var value = /\0(\d+)/g;
/**
 * Removes comments and strings from the given CSS to make it easier to parse.
 *
 * @param css
 * @param callback receives the cleaned CSS
 * @param additionalReplaceRules
 */
function cleanCss(css, callback, additionalReplaceRules) {
  if (additionalReplaceRules === void 0) {
    additionalReplaceRules = [];
  }
  var values = [];
  css = css
    .replace(escape, function (match) {
      return "\0" + (values.push(match) - 1);
    })
    .replace(remove, "");
  additionalReplaceRules.forEach(function (pattern) {
    css = css.replace(pattern, function (match) {
      return "\0" + (values.push(match) - 1);
    });
  });
  var reconstruct = function (css) {
    return css.replace(value, function (_match, n) {
      return values[n];
    });
  };
  return callback(css, reconstruct);
}
var selectorsPattern = /(?:^|\}|\{|\x01)\s*([^\{\}\0\x01]+)\s*(?=\{)/g;
var importPattern = /@import\s*\([^)]*\)\s*;?/gi;
var importEndPattern = /\x01/g;
var keyframesDeclarationPattern =
  /@keyframes\s+[^\{\}]+\s*\{(?:[^{}]+|\{[^{}]+})*}/gi;
var selectorUnitPattern =
  /((?:(?:\[[^\]]+\])|(?:[^\s\+\>~:]))+)((?:::?[^\s\+\>\~\(:]+(?:\([^\)]+\))?)*\s*[\s\+\>\~]?)\s*/g;
var excludePattern = /^(?:@|\d+%)/;
var globe = /^(?:\:|\d+%)/g;
var dataRvcGuidPattern = /\[data-dative-css~="[a-z0-9-]"]/g;
function trim(str) {
  return str.trim();
}
function extractString(unit) {
  return unit.str;
}
function transformSelector(selector, parent) {
  var selectorUnits = [];
  var match;
  while ((match = selectorUnitPattern.exec(selector))) {
    selectorUnits.push({
      str: match[0],
      base: match[1],
      modifiers: match[2],
    });
  }
  // For each simple selector within the selector, we need to create a version
  // that a) combines with the id, and b) is inside the id
  var base = selectorUnits.map(extractString);
  var transformed = [];
  var i = selectorUnits.length;
  while (i--) {
    var appended = base.slice();
    // Pseudo-selectors should go after the attribute selector
    var unit = selectorUnits[i];
    appended[i] = unit.base + parent + unit.modifiers || "";
    var prepended = base.slice();
    prepended[i] = parent + " " + prepended[i];
    transformed.push(appended.join(" "), prepended.join(" "));
  }
  return transformed.join(", ");
}
function transformCss(css, id) {
  var dataAttr = '[data-dative-css~="' + id + '"]';
  var transformed;
  if (dataRvcGuidPattern.test(css)) {
    transformed = css.replace(dataRvcGuidPattern, dataAttr);
  } else {
    transformed = cleanCss(
      css,
      function (css, reconstruct) {
        css = css
          .replace(importPattern, "$&\x01")
          .replace(selectorsPattern, function (match, $1) {
            // don't transform at-rules and keyframe declarations
            if (excludePattern.test($1)) {
              return match;
            }
            if (globe.test($1)) return match;
            var selectors = $1.split(",").map(trim);
            var transformed =
              selectors
                .map(function (selector) {
                  return transformSelector(selector, dataAttr);
                })
                .join(", ") + " ";
            return match.replace($1, transformed);
          })
          .replace(importEndPattern, "");
        return reconstruct(css);
      },
      [keyframesDeclarationPattern]
    );
  }
  return PREFIX + "\n" + transformed;
}

var extend = function extend(options) {
  if (options.el || options.target) {
    warn(
      `Dative.extend doesn't accept ${
        options.el
          ? "el: " + options.el
          : options.target
          ? "target: " + options.target
          : ""
      }.\nThe el or target should be pass to the var app = Dative.extend({...});\n new app({ ${
        options.el
          ? "el: '" + options.el + "'"
          : options.target
          ? "target: '" + options.target + "'"
          : ""
      }',.... })`
    );
    return;
  }
  /** @type {Dative} */
  var Parent = this;
  function DativeComponent(initialProps) {
    if (!(this instanceof DativeComponent)) {
      warn("Dative.extend class has to be called with the `new` keyboard");
      return;
    }
    var $this = this;
    $this.options = options;
    if (initialProps.el || initialProps.target) {
      $this.options.el = initialProps.el || initialProps.target;
    } else {
      $this.options.el = doc.createDocumentFragment();
    }
    var $plugins = $this.options.use || [];
    if ($plugins) {
      if (Array.isArray($this.options.use)) {
        $this.use.apply($this, $this.options.use);
      }
    }

    if ($this.options.data) {
      if (typeof $this.options.data !== "function") {
        tip(
          `Data should be a function,But got ${typeof $this.options.data}\n ${
            typeof $this.options.data === "object"
              ? "Replace data:{ \n \t msg: '....' \n } with data(){ return{ \n \t msg:'....' \n } }"
              : ""
          }`
        );
      }
    }

    if (!$this.options.attach && initialProps.attach) {
      $this.options.attach = initialProps.attach;
    }

    if (options.props && initialProps.props)
      initProps(initialProps, $this, options.props);

    _init($this);
    var styles = $this.options.css;
    $this.cssScoped = $this.options.cssScoped || true;
    const scoped = $this.cssScoped;
    if (styles) {
      if (styles[0] === "#") {
        styles = idToTemplate$1(styles);
      }

      var compiled_styles = parse(styles, $this);
      if (scoped) {
        var compiled = transformCss(compiled_styles, $this.cssId_);
        $this.css = {
          value: compiled_styles,
          transformed: { active: true, value: compiled },
        };
        if (doc.querySelector("style[data-dative-css]")) {
          var st = doc.querySelector("style[data-dative-css]");
          st.innerHTML = st.innerHTML + compiled;
        } else {
          var style = getStyle();
          style.innerHTML = compiled;
        }
      }
    }
  }
  initRender(DativeComponent);
  var proto = Object.create(Parent.prototype);
  proto.constructor = DativeComponent;
  //DativeComponent['super']
  DativeComponent.prototype = proto;
  DativeComponent.prototype.proxyProps = proxyProps;

  Object.defineProperties(DativeComponent, {
    extend: { value: Parent.extend, configurable: true, enumerable: true },
    defineApp: {
      value: Parent.defineApp,
      configurable: true,
      enumerable: true,
    },
    defineProperty: {
      value: Parent.defineProperty,
      configurable: true,
      enumerable: true,
    },
    utlis: {
      value: { warn: Parent.utlis.warn },
      configurable: true,
      enumerable: true,
    },
    version: { value: Parent.version, configurable: true, enumerable: true },
  });
  return DativeComponent;
};

var __version__ = "V2.0.0-alpha";
Dative.version = __version__;
Dative.defineProperty = property;
Dative.defineApp = defineApp;
Object.defineProperty(Dative, "utlis", {
  value: {
    warn: warn,
  },
  configurable: true,
  enumerable: true,
});
Dative.extend = extend;

var deprecatedMethods = [
  "use",
  "importStyle",
  "ref",
  "reactive",
  "watchEffect",
];

deprecatedMethods.forEach((methods) => {
  Object.defineProperty(Dative, methods, {
    /** @deprecated */
    value: function () {
      var deprecate = depd(methods);
      // tip(`${methods} Has been deprecated in v2-alpha`)
      deprecate(`Has been deprecated in v2-alpha`);
    },
    configurable: true,
    enumerable: true,
  });
});

if (inBrowser) {
  var welcomeIntro_1 = [
    "%cDative.js %c" + Dative.version + " %cin debug mode, %cmore...",
    "color: #FF3E00;font-weight: bold;",
    "color: #111; font-weight: 600;",
    "color: rgb(85, 85, 255); font-weight: normal;",
    "color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;",
  ];
  var message = [
    `You're running Dative ${Dative.version} in debug mode - messages will be printed to the console to help you fix problems and optimise your application.
    
  To disable debug mode, add this line at the start of your app:
  Dative.config.slient = true;
  
  Get help and support:
      http://dativejs.js.org`,
  ];
  if (!config.slient) {
    if (typeof console !== "undefined") {
      var hasCollpased = !!console.groupCollapsed;
      if (hasCollpased) {
        console[hasCollpased ? "groupCollapsed" : "group"].apply(
          console,
          welcomeIntro_1
        );
        console[console.info ? "info" : "log"].apply(console, message);
        console.groupEnd();
      } else {
        console[console.info ? "info" : "log"].apply(console, message);
      }
    }
  }
}

export { Dative as default, defineApp, property as defineProperty, __version__ as version, warn };
//# sourceMappingURL=dative.esm.js.map
