var player;
var myObstacles = [];
var myBackground;
var myScore;

const up = 87;
const left = 65;
const down = 83;
const right = 68;

// addeventlistener untuk bisa mengendalikan karakter
window.addEventListener("keydown", move);
window.addEventListener("keyup", stopMove);

function startGame() {
  player = new component(140, 75, "img/player.png", 10, 190, "image");
  myScore = new component("30px", "Consolas", "black", 280, 40, "text");
  myBackground = new component(
    1200,
    600,
    "img/background.png",
    0,
    0,
    "background"
  );
  myGameArea.start();
}
// let canvas = DOCzzz
var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 1200;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener("keydown", function (e) {
      myGameArea.key = e.keyCode;
    });
    window.addEventListener("keyup", function (e) {
      myGameArea.key = e.keyCode;
    });
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  },
};

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image" || type == "background") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.toX = 0;
  this.toY = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;

    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }

    if (type == "image" || type == "background") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if (type == "background") {
        ctx.drawImage(
          this.image,
          this.x + this.width - 6,
          this.y,
          this.width,
          this.height
        );
      }
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.movement = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.hitTop();
    this.hitBottom();
    this.hitRight();
    this.hitLeft();
  };
  this.movementBack = function () {
    this.x += this.toX;
    this.y += this.toY;
    if (this.type == "background") {
      if (this.x == -this.width) {
        this.x = 0;
      }
    }
  };
  this.crashWith = function (otherobj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };

  // function hit untuk memberi batasan agar karakter dan obstcales tidak melewati batas canvas
  this.hitTop = function () {
    let objTop = this.height - this.height;
    if (this.y < objTop) {
      this.y = objTop;
    }
  };

  this.hitBottom = function () {
    let objBottom = 600 - this.height;
    if (this.y > objBottom) {
      this.y = objBottom;
    }
  };

  this.hitLeft = function () {
    let objLeft = 1200 - this.width;
    if (this.x > objLeft) this.x = objLeft;
  };

  this.hitRight = function () {
    let objRight = this.width - this.width;
    if (this.x < objRight) {
      this.x = objRight;
    }
  };
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

function updateGameArea() {
  var x,
    minHeight,
    maxHeight,
    height,
    minGap,
    maxGap,
    gap1,
    minHeight1,
    maxHeight1,
    height1,
    minGap1,
    maxGap1,
    gap;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (player.crashWith(myObstacles[i])) {
      myGameArea.stop();
      return;
    }
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyinterval(50)) {
    x = myGameArea.canvas.width;
    minHeight = 0;
    maxHeight = 260;
    height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    minGap = 300;
    maxGap = 560;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    minHeight1 = 200;
    maxHeight1 = 900;
    height1 = Math.floor(
      Math.random() * (maxHeight1 - minHeight1 + 1) + minHeight1
    );
    minGap1 = 300;
    maxGap1 = 700;
    gap1 = Math.floor(Math.random() * (maxGap1 - minGap1 + 1) + minGap1);
    myObstacles.push(
      new component(200, 75, "img/nuklir.png", x + gap1, height, "image")
    );
    myObstacles.push(
      new component(200, 75, "img/nuklir.png", x + height1, gap, "image")
    );
  }
  myBackground.movementBack();
  myBackground.update();
  myBackground.toX = -2;
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -10;
    myObstacles[i].update();
  }

  myScore.text = "SCORE: " + myGameArea.frameNo;
  myScore.update();
  player.movement();
  player.update();
}

function move(event) {
  const keyPressed = event.keyCode;
  if (keyPressed == left) {
    player.speedX = -10;
  } else if (keyPressed == right) {
    player.speedX = 5;
  } else if (keyPressed == up) {
    player.speedY = -5;
  } else if (keyPressed == down) {
    player.speedY = 5;
  }
}

function stopMove(event) {
  const keyPressed = event.keyCode;
  if (keyPressed == left) {
    player.speedX = 0;
  } else if (keyPressed == right) {
    player.speedX = 0;
  } else if (keyPressed == up) {
    player.speedY = 0;
  } else if (keyPressed == down) {
    player.speedY = 0;
  }
}
