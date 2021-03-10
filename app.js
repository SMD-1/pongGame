const canvas = document.getElementById('pong');
const context = canvas.getContext("2d");

// // Draw rectangle
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
} 

// // canvas fill with black
drawRect(0, 0, canvas.width, canvas.height, "#000");

// // Draw circle
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

// // Draw text 
function drawText(text, x, y) {
    context.fillStyle = "WHITE";
    context.font = "75px consolas";
    context.fillText(text, x, y);
}


// create user 
const user = {
    x: 0,
    y: (canvas.height - 100)/2,
    width : 15,
    height: 100,
    color: "WHITE",
    score: 0,
}

// create computer
const comp = {
    x: canvas.width - 15,
    y: (canvas.height - 100)/2,
    width: 15,
    height: 100,
    color: "WHITE",
    score: 0,
}

// create ball
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,                         // valocity = speed + direction
    velocityY: 5,
    color: "WHITE"
}

// Create and Draw the net
const net = {
    x: (canvas.width - 2)/2,
    y:0,
    width: 2,
    height: 10,
    color: "WHITE",

}

// Draw net
function drawNet() {
    for(let i=0; i<=canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}
drawNet();


// Draw user paddle
drawRect(user.x, user.y, user.width, user.height, user.color);

// Draw comp paddle
drawRect(comp.x, comp.y, comp.width, comp.height, comp.color);

// Draw ball
drawCircle(ball.x, ball.y, ball.radius, ball.color);


// // Draw Text
drawText(user.score, canvas.width/4, canvas.height/5);
drawText(comp.score, 3*canvas.width/4, canvas.height/5);


// Render the Game
function render() {
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    // draw the net
    drawNet();
    // Draw score
    drawText(user.score, canvas.width/4, canvas.height/5);
    drawText(comp.score, 3*canvas.width/4, canvas.height/5);

    // Draw the user and computer paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(comp.x, comp.y, comp.width, comp.height, comp.color);

    // Draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

}

// Reset function
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
    ball.speed = 5;
}

//Movement, position, Score update, .... 
function update() {
     // update the score
    if(ball.x - ball.radius < 0) {
        comp.score++;
        resetBall();

    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
    // Simple AI to control the computer paddle
    comp.y += ((ball.y - (comp.y + comp.height/2))) * 0.1;

    ball.x += ball.velocityX; 
    ball.y += ball.velocityY;
    
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x + ball.radius < canvas.width/2) ? user : comp;
    if(collision(ball, player)) {
        // ball.velocityX = -ball.velocityX;

        // X direction of ball when its hit 
        let direction = (ball.x < canvas.width/2) ? 1 : -1; 
        // where the player hit the player
        let collidePoint = (ball.y - (player.y + player.height/2));

        // normalization
        collidePoint = collidePoint / (player.height / 2);

        // calculate angle in radian 
        let angleRad = (Math.PI/4) * collidePoint;

        // change velocity of X and Y
        ball.velocityX = direction * ball.speed + Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // every time the ball hits a paddle , we increase its speed
        ball.speed += 0.5; 
    }
    
}


 
       //call game() 50 times every 1 sec




// collision detection 
function collision (b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
}

// Control users paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(e) {
    let rect = canvas.getBoundingClientRect();
    user.y = e.clientY - rect.top - user.height/2;
}



function game() {
    update();           
    render();
}

const framePerSecond = 50;
setInterval(game, 1000/framePerSecond); 


