var player, playerImg, playerAttack;
var P_health, O_health, damage;
var opponent, opponentImg, opponentAttack;
var invisibleGround, edges;
var k_sound, p_sound, music, ko;
var gameState , outCome;

function preload(){

  opponentImg = loadAnimation("opbox - 2.png","opbox - 1.png","opbox - 3.png","opbox - 1.png");
  playerImg = loadAnimation("box - 2.png","box - 1.png","box - 3.png","box - 1.png");

  p_sound = loadSound("236WSXQ-head-kick.mp3");
  k_sound = loadSound("mixkit-martial-arts-punch-2052.wav");

  music = loadSound("mixkit-game-level-music-689.wav");
  ko = loadSound("XRQGFVY-fighting-game-designed-defense-deep-transition-swe.mp3")
}
function setup(){
  createCanvas(800,300);
  // creating player
  player = createSprite(100,265,10,10);
  player.addAnimation("box", playerImg);
  player.scale = 0.2; 
  player.setCollider("rectangle",0,0,100,150);
  P_health = 300;
  playerAttack = createSprite(player.x,player.y,10,10);
  playerAttack.setCollider("circle",10,0,30);
  playerAttack.visible = false;

  // creating opponent
  opponent = createSprite(700,265,10,10);
  opponent.addAnimation("box", opponentImg);
  opponent.scale = 0.2;
  opponent.setCollider("rectangle",0,0,100,150);
  O_health = -300;
  opponentAttack = createSprite(opponent.x,opponent.y,10,10);
  opponentAttack.setCollider("circle",-10,0,30);
  opponentAttack.visible = false;

  damage = random(10,30);
  edges = createEdgeSprites();
  invisibleGround = createSprite(0,270,1600,10);
  invisibleGround.visible = false;
  gameState = "serve";
}

function draw(){

  background("lightblue");
  strokeWeight(0);
  fill("red");
  rect(10,10,300,10);
  rect(790,10,-300,10);
  fill(0,255,20);
  rect(0,260,800,50);
  if (O_health < 0){
    rect(790,10,O_health,10);
  }
  if (P_health > 0){
    rect(10,10,P_health,10);
  }
  
  if (gameState === "play"){

    opponent.velocityY = opponent.velocityY + 1
    player.velocityY = player.velocityY + 1;
    player.collide(invisibleGround);
    opponent.collide(invisibleGround);

    // player only part
    if (keyIsDown(UP_ARROW) && player.y >= 250){
      player.velocityY = -13;
    }
    if (keyIsDown(LEFT_ARROW)){
      player.x -= 1.5;
    }
    if (keyIsDown(RIGHT_ARROW)){
      player.x += 3;
    }
    if (keyDown("p") && playerAttack.isTouching(opponent) && frameCount % 2 === 0){
      O_health += damage;
      console.log("O_health", O_health);
      opponent.x += random(20,50);
      p_sound.play();
    }
    if (keyDown("k") && playerAttack.isTouching(opponent) && frameCount % 60 === 0){
      O_health += damage*2;
      console.log("O_health", O_health);
      opponent.x += random(30,60);
      k_sound.play();
    }

    // opponent only part
    if(frameCount % 60 === 0){
      let rand1 = Math.round(random(1,6))
      switch (rand1){
        case 1 || 2 || 3:
          opponent.velocityX = -3;
        case 4 || 5:
          opponent.velocityY = -13;
        case 6:
          opponent.velocityX = -3;
          opponent.velocityY = -13;
      }
    }
    if (player.x > opponent.x){
      player.x = opponent.x - 50;
    }
    if (opponentAttack.isTouching(player)){
      let rand = Math.round(random(1,6));
      switch (rand){
        case 1 || 2 || 3:
          P_health = P_health - damage;
          player.x = player.x - damage
          p_sound.play();
        case 4 || 5:
          if (frameCount % 60 === 0){
            P_health = P_health - damage*2;
            player.x = player.x - damage*2;
            k_sound.play();
          }
        case 6:
          P_health = P_health;
      }
    }
    if (frameCount%10 === 0 && O_health > -300){
      O_health -= 2;
    }
    if (frameCount%10 === 0 && P_health < 300){
      P_health += 2;
    }
  }
  if (P_health <= 0 || O_health >= 0){
    gameState = "end";
  }
  if (gameState === "end"){
    player.velocityX=0;
    player.velocityY=0;

    opponent.velocityX=0;
    opponent.velocityY=0;
    fill("orange");
    textFont("Franklin Gothic Heavy");
    textAlign(CENTER, CENTER);
    textSize(50);
    strokeWeight(5);
    text("K.O.",400,150);
    text(outCome,400,200);
  }
  if (keyDown("space") && gameState === "end" || gameState === "serve"){
    P_health = 300;
    O_health = -300;
    gameState = "play";
    opponent.x = 700;
    player.x = 100;
    ko.play();
  }
  
  if (P_health <= 0){
    outCome = "YOU LOSE";
  }
  if (O_health >= 0){
    outCome = "YOU WIN";
  }
  player.bounceOff(edges);
  opponent.bounceOff(edges);

  opponentAttack.x=opponent.x;
  opponentAttack.y=opponent.y;

  playerAttack.x = player.x;
  playerAttack.y = player.y;

  drawSprites();
}