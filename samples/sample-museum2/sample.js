setTimeout(function() {
  setImage("./../image/image.png", "image1");
  setImage("./../image/image.png", "image2");
  setImage("./../image/image.png", "image3");
  setImage("./../image/image.png", "image4");
  setImage("./../image/image.png", "image5");
  setImage("./../image/image.png", "image6");
  resize();
}, 30);

function resize() {
  let width, height;
  window.addEventListener("resize", () => {
    const e = document.getElementById("screen");
    width = e.children[0].width;
    height = e.children[0].height;
    console.log(width / height);
    gr("#main")("#main-camera").attr("aspect", width / height);
  });
}

function setImage(path, material) {
  const img = new Image();
  img.src = path;
  img.onload = function() {
    console.log(img.naturalWidth);
    const s = img.naturalWidth * img.naturalHeight / 3000;
    gr("#main")("#" + material).attr("texture", path);
    let scale = gr("#main")("#" + material + "-mesh").attr("scale");
    gr("#main")("#" + material + "-mesh").attr("scale", `${scale.X * img.naturalWidth / s},${scale.Y * img.naturalHeight / s},1`);
    scale = gr("#main")("#" + material + "-mesh").attr("scale");
    gr("#main")("#" + material + "-frame").attr("scale", `${scale.X * 1.1},${scale.Y * 1.1},${scale.Z}`);
  }
}