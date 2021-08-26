function debounceRender(instance) {

  // If there's a pending render, cancel it
  if (instance.debounce) {
    window.cancelAnimationFrame(instance.debounce);
  }
  // Setup the new render to run at the next animation frame
  instance.debounce = window.requestAnimationFrame(function() {
    instance.render();
    instance.updated = true;
  });
}
function stringToHTML(str) {

  // Create document
  let parser = new DOMParser();
  let doc = parser.parseFromString(str, 'text/html');

  //If there are items in the head, move them to the body
  if (doc.head && doc.head.childNodes && doc.head.childNodes.length > 0) {
    Array.from(doc.head.childNodes).reverse().forEach(function(node) {
      doc.body.insertBefore(node, doc.body.firstChild);
    });
  }

  return doc.firstChild.lastChild
}
/**
 * Create settings and getters for data Proxy
 * @param  {Constructor} instance The current instantiation
 * @return {Object} The setter and getter methods for the Proxy
 */
function dataHandler(instance) {
  return {
    get: function(obj, prop) {
      if (['object', 'array'].indexOf(trueTypeOf(obj[prop])) > -1) {
        return new Proxy(obj[prop], dataHandler(instance));
      }
      return obj[prop];
    },
    set: function(obj, prop, value) {
      if (obj[prop] === value) return true;
      obj[prop] = value;
      debounceRender(instance);
      return true;
    }
  };
}
/**
 * Create a proxy from a data object
 * @param  {Object}     options  The options object
 * @param  {Contructor} instance The current Reef instantiation
 * @return {Proxy}               The Proxy
 */
function makeProxy(options, instance) {
  var data = (typeof options.data === 'function' ? options.data() : options.data);
  return new Proxy(data || {}, dataHandler(instance));
}
function trueTypeOf(obj) {
		return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
	}
var config = ({
  slient: true,
  mode: 'Production'
})
function warn() {
  if(!config.slient){
    console.error('[dative Warn]: ', arguments[0])
  }
}
function tip(){
  console.warn('[DativeJs tips]: ', arguments[0]);
}
var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
function each(items, callback) {
    var len = void 0,
        i = 0;

    if (Array.isArray(items)) {
        len = items.length;
        for (; i < len; i++) {
            if (callback.call(items[i], items[i], i) === false) return items;
        }
    } else {
        for (i in items) {
            if (callback.call(items[i], items[i], i) === false) return items;
        }
    }

    return items;
}

function type(object) {
    var class2type = {};
    var type = class2type.toString.call(object);
    var typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol';

    if (object == null) return '' + object;

    typeString.split(' ').forEach(function (type) {
        return class2type['[object ' + type + ']'] = type.toLowerCase();
    });

    return (typeof object === 'undefined' ? 'undefined' : _typeof$1(object)) === 'object' || typeof object === 'function' ? class2type[type] || 'object' : typeof object === 'undefined' ? 'undefined' : _typeof$1(object);
}
// reference: https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/class-util.js#L32-L61
function addClass(el, cls) {
  if (!cls || !(cls = cls.trim())) return;

  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function(c) {
        return el.classList.add(c);
      });
    } else {
      el.classList.add(cls);
    }
  } else {
    var current = ' ' + (el.getAttribute('class') || '') + ' ';
    if (current.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (current + cls).trim());
    }
  }
}

// reference: https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/class-util.js#L32-L61
function removeClass(el, cls) {
  if (!cls || !(cls = cls.trim())) return;

  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function(c) {
        return el.classList.remove(c);
      });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) el.removeAttribute('class');
  } else {
    var cur = ' ' + (el.getAttribute('class') || '') + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    cur ? el.setAttribute('class', cur) : el.removeAttribute('class');
  }
}
function parsetext(text,opts,store) {
 return text.replace(/\{\{((?:.|\n)+?)\}\}/g, function(match) {
   var text$ = match.slice(3, -3) || match.slice(2, -2);
   var sub = text$.split('.');
   if (sub.length > 1) {
     var temp = opts || store;
     sub.forEach(function(item) {
       if (!temp[item]) {
         return '';
       }
       temp = temp[item];
     });
     return temp;
   }else{
     var self = opts;
     if (!self[text$]) return '';
     return self[text$]
   }
  })
}
var dif$$ = function(elem, template,data,store){
  if ((elem instanceof Node)) {
  var temp = stringToHTML(template);
  elem.innerHTML = parsetext(temp.innerHTML,data,store);
  }else{
    warn((typeof elem)+' not a Node');
  }
}
function attributeparser(data, elem$$) {
  var sub = elem$$.split('.');
  if (sub.length > 1) {
    var temp = data;
    sub.forEach(function(item) {
      if (!temp[item]) {
        return;
      }
      temp = temp[item];
    });
    return temp;
  } else {
    if (!data[elem$$]) return;
    return data[elem$$];
  }
}
/**
 * Create the Dative Instance
 * @param {Object} options The component options
 */
function Dative(options = {}) {
  if (!('DOMParser' in window)) warn('Your Browser Doesnt support DativeJs.');
  if (!(this instanceof Dative)) warn('Dative Must be called as a constructor');
    var $this = this;
    $this.options = options;
    var _data = makeProxy(options, $this)
    $this.template = $this.options.template;
    $this.created = $this.options.created;
    $this.mounted = $this.options.mounted;
    $this.update = $this.options.update;
    $this.methods = $this.options.methods;
    $this.store = $this.options.store;
    $this.directives = $this.options.directives;
    $this.$ref = {};
    $this.debounce = null;
    $this.updated = false;
    Object.defineProperty(this, 'data', {
      get: function() {
        return _data;
      },
      set: function(data) {
        _data = new Proxy(data || {}, dataHandler(this));
        debounceRender(this);
        return true;
      },
      configurable: true
    })
  if (this.created !== undefined && this.created !== null) {
      this.created();
    }  	
  /**
   * initialize mounted hooks
  **/  
    if (this.mounted !== undefined && this.mounted !== null) {
    this.mounted();
  }
  const computed = $this.options.computed;
  if (!computed) return false;
  for (let key in computed) {
    const value = computed[key];
    if (typeof value === 'function') {
      Object.defineProperty(this.data, key, {
        get: value,
        enumerable: true,
        configurable: true,
      });
    }
  }
  this.render();
}
/**
  * @param {object} obj coverts a string to object 
**/
  var clone = function(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
/**
 * @param {Object} obj new object for the data
**/
 Dative.prototype.set = function (obj) {
		if (trueTypeOf(obj) !== 'object') warn('The provided data is not an object.');
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				this.data[key] = obj[key];
			}
		}
}
Dative.prototype.get = function() {
   return clone(this.data);
}
function once(fn) {
  var called = false;
  return function(){
    if (!called) {
      called = true;
      fn.apply(this,arguments)
    }
  }
}
/**
 * @param {Element|String} el
 * borrowed from Vuejs
 */
function query(el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
        warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}
/**
 * @param {Element} el element
 * @param {Event} event eventname
 * @param {Function} cb callback function
 */
Dative.prototype.$on = function(el, event, cb) {
  el.addEventListener(event, cb);
}
/**
 * @param {Element} el element
 * @param {Event} event eventname
 * @param {Function} cb callback function
 */
Dative.prototype.$off = function(el, event, cb) {
  el.removeEventListener(event, cb)
}
function kebabToCamel(str, options = { prefix: '', ignorePrefix: '' }) {
  const { prefix, ignorePrefix } = options;
  let ignoredStr = str;
  if (ignorePrefix !== undefined && ignorePrefix !== null && ignorePrefix !== '') {
    ignoredStr = ignoredStr.replace(new RegExp(`^${ignorePrefix}-`), '');
  }
  const camelStr = ignoredStr
    .split('-')
    .filter((s) => s !== '')
    .reduce((r, s) => r = r + `${s[0].toUpperCase()}${s.slice(1)}`);
  if (prefix !== undefined && prefix !== null && prefix !== '') {
    return `${prefix}${camelStr.replace(/^([a-z])/, (m, p) => p.toUpperCase())}`;
  }
  return camelStr;
}
/**
 * returns the template to the dom
**/
Dative.prototype.render = function(){
 var $app = this;
 $app.kebabToCamel = kebabToCamel;
 let template =  trueTypeOf(this.template) === 'function' ? this.template() : this.template || '';
 if (!this.options || !template) warn('You did not provide a template for this instance.'); 
    var target = this.options.target || this.options.el;
    $app.elem = query(target);
    if (target == document.head || target == 'head') {
      this.elem.style.display = 'none';
      warn('Can\'t mount on <head>')
    }
    var elem = this.elem;
    dif$$(elem,template, this.data);
    if (this.update !== undefined && this.update !== null) {
      if(this.updated){
        this.update({ data: this.data });
      }
    }
    for (const el of elem.querySelectorAll('*')) {
      for (const name of el.getAttributeNames()) {
        if (name.startsWith('dv-on:')) {
          const eventName = name.slice(6);
          const handlerName = el.getAttribute(name);
          this.$on(el,eventName, (evt) => this.methods[handlerName].call(this, evt));
          el.removeAttribute(name)
        }else if (name === 'dv-ref') {
          const refName = el.getAttribute(name);
          this.$ref[refName] = el;
          el.removeAttribute(name)
        }else if (name.startsWith('dv-on')) {
          const name$$ = el.getAttribute(name);
          const name$$$ = name$$.split(":");
          const eventName = name$$$[0];
          const handlerName = name$$$[1];
          this.$on(el,eventName, (evt) => this.methods[handlerName].call(this, evt));
          el.removeAttribute(name)
        }else if (name === 'dv-show') {
          const show = el.getAttribute(name);
          el.style.display = attributeparser(this.data,show) ? `block` : `none`;
          el.removeAttribute(name)
        }else if (name === 'dv-text') {
          const text = el.getAttribute(name)
          el.textContent = attributeparser(this.data,text) === undefined ? '' : attributeparser(this.data,text);
          el.removeAttribute(name)
        }else if (name === ':value') {
          const value = el.getAttribute(name)
          el.value = attributeparser(this.data,value) === undefined ? '' : attributeparser(this.data,value);
          el.removeAttribute(name)
        }else if (name === ':src') {
          const src = el.getAttribute(name)
          el.src = attributeparser(this.data,src);
          el.removeAttribute(name)
        }else if (name === ':style') {
          const styles = el.getAttribute(name);
          each(attributeparser(this.data,styles), function(item, i) {
            if (type(item) === 'object') {
              each(item, function(value, key) {
                return el.style[key] = value;
              });
            } else {
              el.style[i] = item;
            }
          });
          el.removeAttribute(name);
        }else if (name === 'dv-html') {
          const html = el.getAttribute(name)
          el.innerHTML = attributeparser(this.data,html) === undefined ? '' : attributeparser(this.data,html);
          el.removeAttribute(name)
        }else if (name === ':class') {
          var classnames = el.getAttribute(name);
          each(attributeparser(this.data,classnames), function(item, i) {
            if (type(item) === 'object') {
              each(item, function(value, key) {
                return value ? addClass(el, key) : removeClass(el, key);
              });
            } else {
              var className = type(i) === 'number' ? item : i;
              item ? addClass(el, className) : removeClass(el, className);
            }
          })
          el.removeAttribute(name)
        }else if (name.startsWith('dv-bind:')) {
          const propName = name.slice(5);
          const dataName = el.getAttribute(name);
          if (propName === 'html') {
            el.innerHTML = attributeparser(this.data,dataName) === undefined ? '' : attributeparser(this.data,dataName);
            el.removeAttribute(name)
          }
          if (propName === 'show') {
            el.style.display = attributeparser(this.data,dataName) ? `block` : `none`;
            el.removeAttribute(name)
          }
          if (propName === 'text') {
            el.textContent = attributeparser(this.data,dataName) === undefined ? '' : attributeparser(this.data,dataName);
            el.removeAttribute(name)
          }
          if (propName === 'value') {
            el.value = attributeparser(this.data,dataName) === undefined ? '' : attributeparser(this.data,dataName);
            el.removeAttribute(name)
          }
          if (propName === 'src') {
            el.src = attributeparser(this.data, dataName);
            el.removeAttribute(name)
          }
          if (propName === 'class') {
            each(attributeparser(this.data, dataName), function(item, i) {
              if (type(item) === 'object') {
                each(item, function(value, key) {
                  return value ? addClass(el, key) : removeClass(el, key);
                });
              } else {
                var className = type(i) === 'number' ? item : i;
                item ? addClass(el, className) : removeClass(el, className);
              }
            })
            el.removeAttribute(name)
          }
          el[this.kebabToCamel(propName)] = attributeparser(this.data,dataName);
          el.removeAttribute(name)
        }else if (name.startsWith(':')) {
          const propName$ = name.slice(1);
          const dataName$ = el.getAttribute(name);
          el[this.kebabToCamel(propName$)] = attributeparser(this.data, dataName$);
          el.removeAttribute(name)
        }else if(name === 'dv-if'){
          const ifstatement = el.getAttribute(name);
          var iff = document.createComment('if');
          if (attributeparser(this.data,ifstatement)) {
            el.innerHTML = el.innerHTML
            el.removeAttribute(name)
          }else{
            el.innerHTML = '';
            el.appendChild(iff)
            el.removeAttribute(name)
          }
        }
        for (var keys in this.directives) {
          var val = this.directives[keys];
          if (typeof val === 'function') {
            var $name = keys;
            if (name.startsWith('dv-' + $name)) {
              var binding = el.getAttribute(name);
              val(el, { bind: { value: binding, args: name.split(':')[1] }, name: name })
              el.removeAttribute(name)
            }
          }
        }
      }
    }
}
Dative.config = config;
/**
 * @param {String} href css link
 * @example
 * Dative.importstyle('style')
**/
Dative.importstyle = function(href,type=''){
  if (href === undefined || href === null) {
    warn('href needs a value to be a file');
  }
    var style = document.createElement('link');
    style.href = href + '.css';
    style.type = `text/${type ? type : 'css'}`;
    style.rel = 'stylesheet';
    document.head.appendChild(style);
}
function checkType(element, type) {
  return typeof element === type;
}
function NotType(element, type) {
  return typeof element !== type;
}
let activeEffect = null;
  class Dep {
      constructor(){
        this.subscribers = new Set()
      }
      depend() {
          if (activeEffect) this.subscribers.add(activeEffect)
      }
      notify() {
          this.subscribers.forEach((sub) => sub());
      }
  }
  function watchEffect(fn) {
        activeEffect = fn
        fn()
        activeEffect = null
    }
    function reactive(obj) {
        Object.keys(obj).forEach((key) => {
            const dep = new Dep()
            let value = obj[key]
            Object.defineProperty(obj, key, {
                get() {
                    dep.depend()
                    return value
                },
                set(newValue) {
                    if (newValue !== value) {
                        value = newValue
                        dep.notify()
                    }
                },
            })
        })
        return obj
    }
const ref = (initialValue) => {
  var current;
  current = initialValue;
  return { current }
}  


/**
 * Dative Version
 **/    
Dative.version = 'V2.0.0';  
Dative.reactive = reactive;
Dative.watchEffect = watchEffect;
Dative.ref = ref;
/**
 * Install Dative plugin
 * @param  {Constructor} plugin The Dative plugin
 */
Dative.use = function (plugin) {
	var args = arguments[1];
  var installedPlugins = new Set();
  if (installedPlugins.has(plugin)) {
      warn(`${plugin} is already installed`);
    return this
  }
	if (!plugin.install || typeof plugin.install !== 'function') return;
		if (typeof plugin.install === 'function') {
		  plugin.install(Dative,args); 
		}
	 if (typeof plugin === 'function') {
		  plugin(Dative,args);
		}
	installedPlugins.add(plugin);
};
module.exports = Dative;
module.exports = { watchEffect,reactive, ref }