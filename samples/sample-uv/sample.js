let i = 0;
const g = [
  "triangle",
  "quad",
  "cube",
  "sphere",
  "cylinder",
  "cone",
  "circle",
  "plane"
];
setInterval(function() {
  i = i % g.length;
  gr("#main")(".geo").attr("geometry", g[i]);
  i++;
}, 300);