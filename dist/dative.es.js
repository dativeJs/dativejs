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

  return doc.firstChild.lastChild.innerHTML
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
let debug = false;
function setDebug (on) {
		debug = on ? true : false;
}
function warn() {
  if(debug){
    console.error('[DativeJs Warn]: ', arguments[0])
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
var textInterpole = /\"((?:.|\n)+?)\"/g;
var textInterpole_ = /\'((?:.|\n)+?)\'/g;
function parsetext(text,opts,store) {
 return text.replace(/\{\{((?:.|\n)+?)\}\}/g, function(match) {
   var text$ = match.slice(3, -3) || match.slice(2, -2);
   if (textInterpole.test(text$)) {
     return text$.replace(textInterpole,function(mt,val){
       return val
     })
   }
   if (textInterpole_.test(text$)) {
     return text$.replace(textInterpole_, function(mt, val) {
       return val
     })
   }
   var sub = text$.split('.');
   if (sub.length > 1) {
     var temp = opts || store;
     sub.forEach(function(item) {
       if (!temp[item]) {
         return eval(item);
       }
       temp = temp[item];
     });
     return temp;
   }else{
     var self = opts;
     if (!self[text$]) return eval(text$);
     return self[text$]
   }
  })
}
var dif$$ = function(elem, template,data,store){
  if ((elem instanceof Node)) {
  var temp = stringToHTML(template)
  elem.innerHTML = parsetext(temp,data,store);
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
    //$this.elem = $this.options.target;
    var _data = makeProxy(options, $this)
    $this.template = $this.options.template;
    $this.created = $this.options.created;
    $this.mounted = $this.options.mounted;
    $this.update = $this.options.update;
    $this.methods = $this.options.methods;
    $this.store = $this.options.store;
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
 * returns the template to the dom
**/
Dative.prototype.render = function(){
 if (!this.options.target && !this.options.el){ warn('You did not provide a target for DativeJs');}
 let template =  trueTypeOf(this.template) === 'function' ? this.template() : this.template || `${document.querySelector('script[type="text/dative"]').innerHTML}`;
 if (!this.options || !template) warn('You did not provide a template for this instance.'); 
    var target = this.options.target || this.options.el;
    this.elem = trueTypeOf(target) === 'string' ? document.querySelector(`${target}`) : target;
    if (target == document.body || target == 'body' || target == document.head || target == 'head') {
      this.elem.style.display = 'none';
      warn('Can\'t mount on <body> or <head>')
    }
    var elem = this.elem;
    dif$$(elem,template, this.data);
    // @depreciated will be removed in version 2
    Dative.emit(elem, 'render', this.data);
    if (this.update !== undefined && this.update !== null) {
      if(this.updated){
        this.update({ data: this.data});
      }
    }
    for (const el of elem.querySelectorAll('*')) {
      for (const name of el.getAttributeNames()) {
        if (name.startsWith('@')) {
          const eventName = name.slice(1);
          const handlerName = el.getAttribute(name);
          el.addEventListener(eventName, (evt) => this.methods[handlerName].call(this, evt));
          el.removeAttribute(name)
        } else if (name.startsWith('on:')) {
          const eventName = name.slice(3);
          const handlerName = el.getAttribute(name);
          el.addEventListener(eventName, (evt) => this.methods[handlerName].call(this, evt));
          el.removeAttribute(name)
        }else if (name === 'ref') {
          const refName = el.getAttribute(name);
          this.$ref[refName] = el;
          el.removeAttribute(name)
        }else if (name.startsWith('on')) {
          const name$$ = el.getAttribute(name);
          const name$$$ = name$$.split(":");
          const eventName = name$$$[0];
          const handlerName = name$$$[1];
          el.addEventListener(eventName, (evt) => this.methods[handlerName].call(this, evt));
          el.removeAttribute(name)
        }else if (name === ':show') {
          const show = el.getAttribute(name);
          el.style.display = attributeparser(this.data,show) ? `block` : `none`;
          el.removeAttribute(name)
        }else if (name === ':text') {
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
        }else if (name === ':html') {
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
        }else if (name.startsWith('bind:')) {
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
          el[propName] = attributeparser(this.data,dataName);
          el.removeAttribute(name)
        }else if (name.startsWith(':')) {
          const propName$ = name.slice(1);
          const dataName$ = el.getAttribute(name);
          el[propName$] = attributeparser(this.data, dataName$);
          el.removeAttribute(name)
        }else if(name === 'if'){
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
      }
    }
/**
 * Two way Binding for Dative
**/
const inputElements = document.querySelectorAll('[model]');
const boundElements = document.querySelectorAll('[bind]');
let scope = {};
  for (let el of inputElements) {
    if (el.tagName.toLowerCase() !== 'input') {
      tip('<'+el.tagName.toLowerCase()+'>'+'</'+el.tagName.toLowerCase()+'>\n can\'t be used with this directive. \n '+'<'+el.tagName.toLowerCase()+'>')
    }else{
      if (el.type === 'text' || el.type === 'number' || el.type === 'password') {
      let propName = el.getAttribute('model');
      el.addEventListener('keyup', e => {
        scope[propName] = el.value;
      });
      setPropUpdateLogic(propName);
    }
  }
  }
function setPropUpdateLogic(prop) {
  if (!scope.hasOwnProperty(prop)) {
    let value;
    Object.defineProperty(scope, prop, {
      set: (newValue) => {
        value = newValue;
        for (let el of inputElements) {
          if (el.getAttribute('model') === prop) {
            if (el.type) {
              el.value = newValue;
            }
          }
        }
        for (let el of boundElements) {
          if (el.getAttribute('bind') === prop) {
            if (!el.type) {
              el.innerHTML = newValue;
            }
          }
        }
      },
      get: () => {
        return value;
      },
      enumerable: true
    })
  }
}
}
Dative.debug = setDebug;
Dative.warn = warn;
/**
 * @param {String} href css link
 * @example
 * Dative.importstyle('style')
**/
Dative.importstyle = function(href){
  if (href === undefined || href === null) {
    warn('href needs a value to be a file');
  }
    var style = document.createElement('link');
    style.href = href + '.css';
    style.type = 'text/css';
    style.rel = 'stylesheet';
    document.head.appendChild(style);
}
function checkType(element, type) {
  return typeof element === type;
}
function NotType(element, type) {
  return typeof element !== type;
}
function kebabToCamel(str, options = { prefix: '', ignorePrefix: '' }){
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
let activeEffect = null;
  class Dep {
      subscribers = new Set()
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
Dative.version = 'V1.0.0';  
Dative.reactive = reactive;
Dative.watchEffect = watchEffect;
Dative.ref = ref;
/**
 * Emit a custom event
 * @param  {Node} elem The element to emit the custom event on
 * @param  {String}  name The name of the custom event
 * @param  {*} detail Details to attach to the event
 * @param  {Boolean} noCancel If false, event cannot be cancelled
**/
function $$emit(elem, name, detail, noCancel=true) {
  let event;
  if (!elem || !name) return warn('You did not provide an element or event name.');
  event = new CustomEvent(name, {
    bubbles: true,
    cancelable: !noCancel,
    detail: detail
  });
  return elem.dispatchEvent(event);
}
Dative.emit = $$emit;
/**
 * Install Dative plugin
 * @param  {Constructor} plugin The Dative plugin
 */
Dative.use = function (plugin) {
	var args = arguments[1];
  var installedPlugins = [];
  if (installedPlugins.hasOwnProperty(plugin)) {
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
	installedPlugins.push(plugin);
};
export default Dative;
export { watchEffect,reactive, $$emit as emit, ref }