
# DativeJs
DativeJs is a modern javascript framework for building interactive user interface.
# [Installation](#)
```html
<!--development-->
<script src="https://cdn.jsdelivr.net/npm/dativejs@2.0.0-alpha/dist/dative.js"></script>
<!--production-->
<script src="https://cdn.jsdelivr.net/npm/dativejs@2.0.0-alpha/dist/dative.min.js"></script>

```
## [Usage](#)
```html
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/npm/dativejs@2.0.0-alpha/dist/dative.min.js"></script>
<script type="text/dative" id="template">
  <div>
    <h1>Hello {{msg}}</h1>
  </div>
</script>

<script>
  var app = new Dative({
    el: "#app",
    data:{
      msg: "World"
    },
    template: "#template"
  });
  app.render();
</script>
```
