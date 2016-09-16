// var i = 0;
//
// setInterval(function(){
//   gr("#main2")("renderers").attr("bgColor","rgb("+i%256+",0,0)");
//   // gr("#main")("renderers").attr("bgColor","green");
//   i++;
// },3);

var dof = document.getElementById("dof");

dof.addEventListener('input', function()
{
    gr("#main")("#depth").attr("depthOffset",dof.value/100);
});
