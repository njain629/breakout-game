var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');
var x=(canvas.width/2)+Math.floor(Math.random()*10)-10;
var y=(canvas.height-30)+Math.floor(Math.random()*10)-10;
var dx=5;
var dy=-5;
var ballrad=10;
var paddle_height=10;
var paddle_width=100;
var paddlex=(canvas.width-paddle_width)/2;
var rightpress=false;
var leftpress=false;
var brickrow=4;
var brickcol=9;
var brickwidth=80;
var brickheight=20;
var brickpadding=5;
var brickoffsettop=40;
var brickoffsetleft=20;
var score=0;
var lives=3;
var level=1;
var maxlevel=5;
var paused=false;

var bricks=[];
initbricks();
function initbricks() {
  for (var c = 0; c < brickcol; c++) {
    bricks[c]=[];
    for (var r = 0; r < brickrow; r++) {
      bricks[c][r]={x:0, y:0, status:1};
    }
  }
}

document.addEventListener("keydown",keyDownHandler);
document.addEventListener("keyup",keyUpHandler);

function drawbricks() {
  for (var c = 0; c < brickcol; c++) {
    for (var r = 0; r < brickrow; r++) {
      if (bricks[c][r].status == 1) {
        var brickx=(c*(brickwidth+brickpadding))+brickoffsetleft;
        var bricky=(r*(brickheight+brickpadding))+brickoffsettop;
        bricks[c][r].x=brickx;
        bricks[c][r].y=bricky;
        colorrect(brickx,bricky,brickwidth,brickheight,'white');
      }
    }
  }
}

function keyDownHandler(e) {
  if (e.keyCode==39) {
    rightpress=true;
  }else if (e.keyCode==37) {
    leftpress=true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode==39) {
    rightpress=false;
  }else if (e.keyCode==37) {
    leftpress=false;
  }
}

function drawball() {
  ctx.beginPath();
  ctx.arc(x,y,ballrad,0,Math.PI*2);
  ctx.fillStyle='white';
  ctx.fill();
  ctx.closePath();
}

function drawpaddle() {
  colorrect(paddlex,canvas.height-paddle_height-5,paddle_width,paddle_height);
}

function collision() {
  for (var c = 0; c < brickcol; c++) {
    for (var r = 0; r < brickrow; r++) {
      var b=bricks[c][r];
      if (b.status==1) {
        if (x>b.x && x<b.x+brickwidth && y>b.y && y < b.y+brickheight) {
          dy=-dy;
          b.status=0;
          score++;
          if (score==brickrow*brickcol) {
            if (level==maxlevel) {
              alert("You Win. Congratulations");
              document.location.reload();
            }else {
              level++;
              brickrow++;
              initbricks();
              score=0;
              dx+=1;
              dy=-dy;
              dy-=1;
              x=canvas.height/2;
              y=canvas.height-30;
              paddlex=(canvas.width-paddle_width)/2;
              paused=true;
              colorrect(0,0,canvas.width,canvas.height,'#0095DD');
              ctx.font="16px Arial";
              ctx.fillStyle="#ffffff";
              ctx.fillText("Level "+(level-1)+" completed, starting next level..",300,270);
              setTimeout(function () {
                paused=false;
                draw();
              },2000);
            }
          }
        }
      }
    }
  }
}

function drawlives() {
  ctx.font="16px Arial";
  ctx.fillStyle="#0095DD";
  ctx.fillText("Lives: "+lives,canvas.width-65,20);
}

function drawscore() {
  ctx.font="16px Arial";
  ctx.fillStyle="#0095DD";
  ctx.fillText("Score: "+score, 8,20);
}
function drawlevel() {
  ctx.font="16px Arial";
  ctx.fillStyle="#0095DD";
  ctx.fillText("Level: "+level,canvas.width/2-65,20);
}

function draw() {
  colorrect(0,0,canvas.width,canvas.height,'black');
  drawball();
  drawpaddle();
  drawbricks();
  drawscore();
  drawlives();
  drawlevel();
  collision();
  x+=dx;
  y+=dy;
  if (y<ballrad) {
    dy=-dy;
  }
  if (y>canvas.height-(ballrad+paddle_height)) {
    if (x>paddlex && x<paddlex+paddle_width) {
      dy=-dy;
    }else {
      lives--;
      if (!lives) {
        alert("Game Over. Your score is "+score);
        document.location.reload();
      }else {
        x=canvas.width/2;
        y=canvas.height-30;
        dx=5;
        dy=-5;
        paddlex=(canvas.width-paddle_width)/2;
      }
    }
  }
  if (x<ballrad) {
    dx=-dx;
  }
  if (x>canvas.width-ballrad) {
    dx=-dx;
  }
  if (rightpress && paddlex<(canvas.width-paddle_width)) {
    paddlex+=5;
  }
  else if (leftpress && paddlex>0) {
    paddlex-=5;
  }
  if (!paused) {
    requestAnimationFrame(draw);
  }
}

function colorrect(leftx,topy,width,height,color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(leftx,topy,width,height);
  ctx.closePath();
  }
  document.addEventListener("mousemove",mousemovehandler)

  function mousemovehandler(e) {
    var relativex=e.clientX-canvas.offsetLeft;
    if (relativex>0+paddle_width/2 && relativex<canvas.width-paddle_width/2) {
      paddlex=relativex-paddle_width/2;
    }
  }
draw();
