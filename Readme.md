![Dative](/public/logo.svg)
# DativeJs
DativeJs is a javascript frameeork for building interactive user interface.
# [Installation](#)
```html
<!--development-->
<script src="https://cdn.jsdelivr.net/gh/Tobithedev/DativeJs@main/dist/dative.js"></script>
<!--production-->
<script src="https://cdn.jsdelivr.net/gh/Tobithedev/DativeJs@main/dist/dative.min.js"></script>

```
## [Usage](#)
```html
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/gh/Tobithedev/DativeJs@main/dist/dative.min.js"></script>
<script>
  var app = new Dative({
    el: "#app",
    data:{
      msg: "Hello World"
    },
    template(){
      return `<h1>{{ msg }}</h1>`
    }
  });
  app.render();
</script>
```