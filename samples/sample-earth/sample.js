let i = 0;
const r = 5;
setInterval(function() {
  gr("#main")("#earth").attr("rotation", `y(${i}d)`);
  gr("#main")("#earth").attr("position", `${r * Math.cos(-i / 300)},0,${r * Math.sin(-i / 300)}`);
  i++;
}, 30);