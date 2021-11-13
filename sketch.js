var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;
var fim
var inicio
var sompulo
var somcheckinpoint
var somdie

function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  imagemfim = loadImage("gameOver.png")
  imageminicio = loadImage("restart.png")
  sompulo = loadSound("jump.mp3")
  somcheckinpoint = loadSound("checkPoint.mp3")
  somdie = loadSound("die.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(width-1200,height-50,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("colidiu" , trex_colidiu)
  trex.scale = 0.5;
  trex.setCollider("rectangle",0,0,70,90)
  trex.debug = false;
  fim = createSprite (width/2, height/2, 20, 20)
  inicio= createSprite (width/2, height/2+50, 15, 15)
  fim.addImage (imagemfim)
  inicio.addImage (imageminicio)
  inicio.scale = 0.5
  
  solo = createSprite(width,height-20,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  
  
  soloinvisivel = createSprite(width-1200,height-10,400,10);
  soloinvisivel.visible = false;
  fim.scale = 0.6
  
  fim.visible = false
  inicio.visible = false
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  console.log("Oi" + 5);
  
  pontuacao = 0;
}

function draw() {
  background("white");
  text("Pontuação: "+ pontuacao, 500,50);
   
  
  if(estadoJogo === JOGAR){
    if (grupodeobstaculos.isTouching(trex)){
      somdie.play()
      
      estadoJogo = ENCERRAR
    }
    if(pontuacao%500 == 0 && pontuacao>0){
      somcheckinpoint.play()
    }
    //mover o solo
    solo.velocityX = -(4 + pontuacao/200);
    if(touches.length>0||keyDown("up")&& trex.y >= height-40) {
       trex.velocityY = -13;
      sompulo.play()
      touches =[]
  }
    if(keyDown("down")) {
       trex.velocityY = 13;
  }
    pontuacao = pontuacao + Math.round(frameCount/60)   
    //gerar as nuvens
    gerarNuvens();
    //gerar obstáculos no solo
    gerarObstaculos();
    if (solo.x < 0){
       solo.x = solo.width/2;
      
    }
    trex.velocityY = trex.velocityY + 0.8
  }
  else if(estadoJogo === ENCERRAR){
    //parar o solo
    solo.velocityX = 0;
    trex.changeAnimation("colidiu",trex_colidiu)
  grupodeobstaculos.setVelocityXEach(0)
    grupodenuvens.setVelocityXEach(0)
    grupodeobstaculos.setLifetimeEach(-1)
    grupodenuvens.setLifetimeEach(-1)
    trex.velocityY = 0
    
    fim.visible = true
    inicio.visible = true
  }
 
    trex.collide(soloinvisivel);
  
  if(touches.length>0||mousePressedOver(inicio)){
     reset();
    touches =[]
     }
    
    drawSprites();
}
function reset(){
  if (estadoJogo == ENCERRAR){
    estadoJogo = JOGAR
    grupodeobstaculos.destroyEach()
    grupodenuvens.destroyEach()
    fim.visible = false
    inicio.visible = false
    trex.changeAnimation("running")
    pontuacao = 0
    grupodeobstaculos.setVelocityXEach(0)
    grupodenuvens.setVelocityXEach(0)
  }
  }
function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(width,height-30,10,40);
  obstaculo.velocityX = -(6 + pontuacao/200);
      
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}




function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(100,400));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 250;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adicionando nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}