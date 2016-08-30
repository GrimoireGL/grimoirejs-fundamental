setInterval(()=>{
  gr("#main2")("renderers").attr("bgColor","red");
  console.log(gr("#main")("mesh").attr("position"));
},1000);
