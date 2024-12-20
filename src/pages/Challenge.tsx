import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Challenge = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scoreDiv = scoreRef.current;
    
    if (!canvas || !scoreDiv) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 200; // Account for navbar and padding
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Game variables
    let player1Score = 0;
    let player2Score = 0;
    const paddleWidth = 10;
    const paddleHeight = 100;
    const ballSize = 10;

    // Paddle positions
    const paddle1 = { x: 20, y: canvas.height / 2 - paddleHeight / 2 };
    const paddle2 = { x: canvas.width - 30, y: canvas.height / 2 - paddleHeight / 2 };

    // Ball position and velocity
    const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 5, dy: 3 };

    // Background color variables
    let hue = 0;

    // Handle player 1 paddle movement (W/S and T/A keys)
    const keys: { [key: string]: boolean } = {};
    const handleKeyDown = (e: KeyboardEvent) => keys[e.key.toLowerCase()] = true;
    const handleKeyUp = (e: KeyboardEvent) => keys[e.key.toLowerCase()] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    function update() {
      // Move paddle 1 (W/S or T/A keys)
      if ((keys['w'] || keys['t']) && paddle1.y > 0) paddle1.y -= 8;
      if ((keys['s'] || keys['a']) && paddle1.y < canvas.height - paddleHeight) paddle1.y += 8;

      // Move paddle 2 (AI control)
      if (paddle2.y + paddleHeight / 2 < ball.y) paddle2.y += 6;
      if (paddle2.y + paddleHeight / 2 > ball.y) paddle2.y -= 6;

      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision with top and bottom walls
      if (ball.y <= 0 || ball.y >= canvas.height - ballSize) {
        ball.dy *= -1;
      }

      // Ball collision with paddles
      if (ball.x <= paddle1.x + paddleWidth &&
          ball.y + ballSize >= paddle1.y &&
          ball.y <= paddle1.y + paddleHeight) {
        ball.dx *= -1;
        ball.x = paddle1.x + paddleWidth; // Avoid sticking
      }

      if (ball.x + ballSize >= paddle2.x &&
          ball.y + ballSize >= paddle2.y &&
          ball.y <= paddle2.y + paddleHeight) {
        ball.dx *= -1;
        ball.x = paddle2.x - ballSize; // Avoid sticking
      }

      // Scoring
      if (ball.x <= 0) {
        player2Score++;
        resetBall();
      } else if (ball.x >= canvas.width) {
        player1Score++;
        resetBall();
      }

      // Update score display
      scoreDiv.textContent = `Player 1: ${player1Score} | Player 2: ${player2Score}`;

      // Update background color
      hue = (hue + 1) % 360;
    }

    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
      ball.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
    }

    function draw() {
      if (!ctx) return;
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(paddle1.x, paddle1.y, paddleWidth, paddleHeight);
      ctx.fillRect(paddle2.x, paddle2.y, paddleWidth, paddleHeight);

      // Draw ball
      ctx.fillRect(ball.x, ball.y, ballSize, ballSize);
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <div className="relative pt-20">
        <div 
          ref={scoreRef} 
          className="absolute top-24 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white z-10"
        >
          Player 1: 0 | Player 2: 0
        </div>
        <div className="p-4">
          <div className="mb-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to the EduMaCation Challenge Arena!</h1>
            <h2 className="text-2xl font-semibold mb-4">Test Your Skills in Pong</h2>
            <p className="text-lg">Use 'W'/'S' or 'T'/'A' keys to move your paddle up and down</p>
            <p className="text-sm mt-2">Challenge yourself against the AI opponent!</p>
          </div>
          <canvas 
            ref={canvasRef} 
            className="mx-auto border border-white"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Challenge;