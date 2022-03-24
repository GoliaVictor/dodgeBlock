let intersection = new Intersection();
// let width = window.innerWidth;
// let height = window.innerHeight;
let width = 600;
let height = 600;


if (localStorage.getItem('highscore') === null) {
    localStorage.setItem('highscore',0);
}

let themesCycle = ['light', 'dark'];
let themeIndex = 0;
const themes = {
    'light': {
        bird:{r: 50, g: 50, b: 50}, 
        dodgesColours:[[213,52,52],[113, 226, 113],[26, 113, 226]], 
        background:[255,255,255], 
        text: [255,255,255],
    },
    'dark': {
        bird: {r: 205, g: 205, b: 205}, 
        dodgesColours:[[42,203,203],[142, 29, 142],[229, 142, 29]], 
        background:[0,0,0], 
        text: [0,0,0], 
    }
}

function setup() {
    canvas = createCanvas(width,height);
    canvas.parent('sketch')
}

let score = 0;

let bird = new Bird(300,height-height/6,width/600*3.5,height/600*25,height/600*25,themes[themesCycle[themeIndex]].bird,undefined);

let dodges = [];
let dodgesSpeed = height/600*5;
let dodgeColourIndex = 0;

let spawnRate = 125;
let spawn = 0;

let xoff = 0;
let gap = {left:undefined,right:undefined,middle:undefined};
let autopilot = false;
let birdsOnScreen = [];

let gameOver = false;
let menu = false;

function draw() {
    if (menu) {
        gameOver = true;
        background(255);
        
    }
    else {
        if (!gameOver) {
            xoff = random(0,100000);
            background(themes[themesCycle[themeIndex]].background);
    
            push();
            textAlign(CENTER,CENTER);
            textSize(height/600*50);
            fill(themes[themesCycle[themeIndex]].dodgesColours[dodgeColourIndex]);
            text(score,width/2,height/6);
            pop();
    
            birdsOnScreen = [];
            if (-bird.sizeX < bird.playerLeft.vars.shapeX && bird.playerLeft.vars.shapeX < width) {
                birdsOnScreen.push(bird.playerLeft);
            }
            if (-bird.sizeX < bird.player.vars.shapeX && bird.player.vars.shapeX < width) {
                birdsOnScreen.push(bird.player);
            }
            if (-bird.sizeX < bird.playerRight.vars.shapeX && bird.playerRight.vars.shapeX < width) {
                birdsOnScreen.push(bird.playerRight);
            }
    
            if (bird.direction == 1 && bird.x >= width-bird.sizeX) {
                bird.x = bird.x-width;
            }
            else if (bird.direction == -1 && bird.x <= 0) {
                bird.x = bird.x+width
            }
    
            for (let n = 0; n < dodges.length; n++) {
                dodges[n].update()
            }
    
            spawn++;
            if (spawn % spawnRate == 0) {
                if (score % 10 == 0) {
                    if (score != 0) {
                        dodgesSpeed += height/600*0.5;
                        bird.speed += width/600*0.5;
                        
                        themeIndex += 1;
                        if (themeIndex == themesCycle.length) {
                            themeIndex = 0;
                        }
    
                        bird.fill = themes[themesCycle[themeIndex]].bird;
                    }
                }
    
                if (spawn != spawnRate) {
                    dodgeColourIndex += 1;
                    if (dodgeColourIndex == themes[themesCycle[themeIndex]].dodgesColours.length) {
                        dodgeColourIndex = 0;
                    }
                }
    
                xoff+=1;
                gap.middle = noise(xoff)*width;
                gap.left = gap.middle-width/12;
                gap.right = gap.middle+width/12;
    
                for (let n = 0; n < dodges.length; n++) {
                    if (dodges[n].y >= height) {
                        intersection.remove(dodges[n].player);
                        dodges.splice(n,1);
                    }
                }
                dodges.push(new Dodge(0,0,dodgesSpeed,gap.left,height/600*18,themes[themesCycle[themeIndex]].dodgesColours[dodgeColourIndex],'left'))
                dodges.push(new Dodge(gap.right,0,dodgesSpeed,width-gap.right,height/600*18,themes[themesCycle[themeIndex]].dodgesColours[dodgeColourIndex],'right'))
                dodges.push(new Dodge(gap.left,0,dodgesSpeed,gap.right-gap.left,height/600*18,undefined,'middle'))
            }
            intersections = intersection.update(false);
    
            if (dodges.length != 0) {
                if ((dodges[0].y+dodges[0].sizeY >= bird.y-dodges[0].speed && dodges[0].y <= bird.y+bird.sizeY+dodges[0].speed) || (dodges[1].y+dodges[1].sizeY >= bird.y-dodges[1].speed && dodges[1].y <= bird.y+bird.sizeY+dodges[1].speed) || (dodges[2].y+dodges[2].sizeY >= bird.y-dodges[2].speed && dodges[2].y <= bird.y+bird.sizeY+dodges[2].speed)) {
                    for (let m = 0; m < dodges.length; m++) {
                        if (dodges[m].type == 'middle') {
                            for (let n = 0; n < birdsOnScreen.length; n++) {
                                if (intersection.isIntersecting(dodges[m].player,birdsOnScreen[n])) {
                                    score += 1;
                                    dodges[m].player.vars.intersects = false;
                                }
                            }
                        } 
                        else if (dodges[m].type == 'left' || dodges[m].type == 'right') {
                            for (let n = 0; n < birdsOnScreen.length; n++) {
                                if (intersection.isIntersecting(dodges[m].player,birdsOnScreen[n])) {
                                    gameOver = true;
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            
            if (autopilot) {
                bird.x = gap.middle-bird.sizeX/2;
            }
            bird.update()
        }
        else {
            if (int(localStorage.getItem('highscore')) < score) {
                bigText = 'New High Score!';
                localStorage.setItem('highscore', score);
            }
            else {
                bigText = 'Game Over!';
            }
            push();
            fill(themes[themesCycle[themeIndex]].dodgesColours[dodgeColourIndex])
            noStroke();
            rect(width/4,height/3,width/2,height/3,20)
            textAlign(CENTER, CENTER)
            fill(themes[themesCycle[themeIndex]].text[0],themes[themesCycle[themeIndex]].text[1],themes[themesCycle[themeIndex]].text[2])
            textSize(width/18)
            text(bigText,width/2,height/2-height/12)
            textSize(width/36)
            text('Score: ' + score + '  HI: ' + localStorage.getItem('highscore'),width/2,height/2)
            text('Spacebar to play again!',width/2,height/2+height/12)
            pop();
        }
    }
}

function tap() {
    if (!gameOver) {
        bird.jump();
    }
    else {
        intersection.objects = [];

        themeIndex = 0;
        bird = new Bird(300,height-height/6,width/600*3.5,height/600*25,height/600*25,themes[themesCycle[themeIndex]].bird,undefined);

        dodges = [];
        dodgeColourIndex = 0;
        dodgesSpeed = height/600*5;

        spawnRate = 125;
        spawn = 0;

        xoff = 0;
        gap = {left:undefined,right:undefined,middle:undefined};

        score = 0;

        gameOver = false;
    }
}

function keyTyped() {
    if (key === ' ') {
        tap();
    }
    else if (key === 'm') {
        if (menu) {
            menu = !menu;
            tap();
        }
        else {
            menu = !menu;
        }
    }
    else if (key === 'r') {
        gameOver = true;
        tap();
    }
    else if (key === 'a') {
        autopilot = !autopilot;
    }
}
function mousePressed() {
    tap();
}

window.addEventListener('touchstart', function() {
	tap();
});

onkeydown = function (e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.view.event.preventDefault();
    }
}
