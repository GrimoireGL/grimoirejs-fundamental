setTimeout(function() {
    setImage("./../image/image.png", "image1");
    setImage("./../image/image.png", "image2");
    setImage("./../image/image.png", "image3");
    setImage("./../image/image.png", "image4");
    setImage("./../image/image.png", "image5");
    setImage("./../image/image.png", "image6");
}, 30);

function setImage(path, material) {
    const img = new Image();
    img.src = path;
    img.onload = function() {
        const s = img.naturalWidth * img.naturalHeight / 3000;
        gr("#main")("#" + material).attr("texture", path);
        let scale = gr("#main")("#" + material + "-mesh").attr("scale");
        gr("#main")("#" + material + "-mesh").attr("scale", `${scale.X * img.naturalWidth / s},${scale.Y * img.naturalHeight / s},1`);
        scale = gr("#main")("#" + material + "-mesh").attr("scale");
        gr("#main")("#" + material + "-frame").attr("scale", `${scale.X * 1.1},${scale.Y * 1.1},${scale.Z}`);
    }
}