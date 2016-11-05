gr(function() {
  var video = document.getElementById("targetVideo");
  setTimeout(function() {
    gr("#main")("material").setAttribute("texture", video);
  }, 1000);
});
