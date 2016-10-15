let i = 0;
const r = 125;
gr("#main")("#earth").attr("rotation", `x(-23.4d)`);
setInterval(function() {
  gr("#main")("#earth").attr("rotation", `y(${i}d)`);
  gr("#main")("#earth").attr("position", `${-120 + r * Math.cos(-i / 3000)},0,${r * Math.sin(-i / 3000)}`);
  let earthP = gr("#main")("#earth").attr("position");
  gr("#main")("#moon").attr("position", `${earthP.X + 2 * Math.cos(-i / 30)},0,${earthP.Z + 2 * Math.sin(-i / 30)}`);
  gr("#main")("#earth").attr("rotation", `y(${i}d)`);
  i++;
}, 30);