(function(){

  var c = document.querySelector('canvas');
  var cx = c.getContext('2d');
  var mousedown = false;
  var oldx = null;
  var oldy = null;
  var pixels = null;
  var letterpixels = null;

  function setupCanvas() {
    c.height = 480;
    c.width = 320;
    cx.lineWidth = 20;
    cx.lineCap = 'round';
    cx.strokeStyle = 'rgb(0, 0, 50)';
    cx.font = 'bold 300px helvetica';
    cx.fillStyle = 'rgb(255, 0, 0)';
    cx.textBaseline = 'middle';
    drawletter('y');
    pixels = cx.getImageData(0, 0, c.width, c.height);
    letterpixels = getpixelamount(255, 0, 0);
  }

  function drawletter(letter) {
    var centerx = (c.width - cx.measureText(letter).width) / 2;
    var centery = c.height / 2;
    cx.fillText(letter, centerx, centery);
  };

  function showerror(error) {
    mousedown = false;
    alert(error);
  };

  function paint(x, y) {
    var colour = getpixelcolour(x, y);
    if (colour.a === 0) {
      showerror('you are outside');
    } else {
      cx.beginPath();
      if ((oldx > 0 && oldy > 0) &&
          (Math.abs(oldx - x) < cx.lineWidth / 2 && Math.abs(oldy - y) < cx.lineWidth / 2)) {
        cx.moveTo(oldx, oldy);
      }
      cx.lineTo(x, y);
      cx.stroke();
      cx.closePath();
      oldx = x;
      oldy = y;
    }
  };

  function getpixelcolour(x, y) {
    var index = ((y * (pixels.width * 4)) + (x * 4));
    return {
      r: pixels.data[index],
      g: pixels.data[index + 1],
      b: pixels.data[index + 2],
      a: pixels.data[index + 3]
    };
  }

  function getpixelamount(r, g, b) {
    var pixels = cx.getImageData(0, 0, c.width, c.height);
    var all = pixels.data.length;
    var amount = 0;
    for (i = 0; i < all; i += 4) {
      if (pixels.data[i] === r &&
          pixels.data[i + 1] === g &&
          pixels.data[i + 2] === b) {
        amount++;
      }
    }
    return amount;
  };

  function pixelthreshold() {
    if (getpixelamount(0, 0, 50) / letterpixels > 0.35) {
     alert('you got it!');
    }
  };

  function onmousedown(ev) {
    mousedown = true;
    ev.preventDefault();
  };
  function onmouseup(ev) {
    mousedown = false;
    pixelthreshold();
    ev.preventDefault();
  };
  function onmousemove(ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    if (mousedown) {
      paint(x, y);
    }
  };

  c.addEventListener('mousedown', onmousedown, false);
  c.addEventListener('mouseup', onmouseup, false);
  c.addEventListener('mousemove', onmousemove, false);

  setupCanvas();

})()