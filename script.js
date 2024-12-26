const canvas = document.getElementById("ecosystemCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20; // Grid size for cells
const rows = canvas.height / gridSize;
const cols = canvas.width / gridSize;

let environment = [];
let agents = [];

// Initialize environment grid
function createEnvironment() {
  environment = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );

  // Add plants (value 1)
  for (let i = 0; i < 50; i++) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    environment[y][x] = 1; // Plants represented by 1
  }

  // Add fewer obstacles (value -1)
  for (let i = 0; i < 5; i++) { // Reduced to 5 obstacles
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    environment[y][x] = -1; // Obstacles represented by -1
  }
}

// Draw environment grid
function drawEnvironment() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (environment[y][x] === 1) {
        ctx.fillStyle = "green"; // Plants are green
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      } else if (environment[y][x] === -1) {
        ctx.fillStyle = "red"; // Obstacles are red
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }
  }
}

// Reset environment and agents
document.getElementById("resetEnvironment").addEventListener("click", () => {
  agents = [];
  createEnvironment();
  drawEnvironment();
});

createEnvironment();
drawEnvironment();

// Agent class
class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.reward = 0;
    this.size = gridSize; // Initial size of the agent
    this.maxSize = gridSize * 2; // Max size the agent can reach
    this.minSize = gridSize; // Min size (can shrink)
  }

  // Move based on action
  move(action) {
    if (action === 0 && this.y > 0) this.y--; // Up
    if (action === 1 && this.y < rows - 1) this.y++; // Down
    if (action === 2 && this.x > 0) this.x--; // Left
    if (action === 3 && this.x < cols - 1) this.x++; // Right
  }

  // Check for rewards (plants) or penalties (obstacles)
  checkReward() {
    if (environment[this.y][this.x] === 1) {
      this.reward += 10; // Reward for eating plant
      environment[this.y][this.x] = 0; // Remove plant
      // Increase the agent's size when it eats
      if (this.size < this.maxSize) {
        this.size += 2; // Increase size by 2 each time it eats
      }
    } else if (environment[this.y][this.x] === -1) {
      this.reward -= 10; // Penalty for hitting an obstacle
      // Shrink the agent's size when it hits an obstacle
      if (this.size > this.minSize) {
        this.size -= 2; // Decrease size by 2 each time it hits an obstacle
      }
    } else {
      this.reward -= 1; // Penalty for steps without reward
    }
  }

  // Draw the agent
  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x * gridSize, this.y * gridSize, this.size, this.size);
  }
}

// Add an agent to the environment
function addAgent() {
  const x = Math.floor(Math.random() * cols);
  const y = Math.floor(Math.random() * rows);
  agents.push(new Agent(x, y));
}

// Start the simulation loop
function startSimulation() {
  setInterval(() => {
    drawEnvironment();
    agents.forEach((agent) => {
      const action = Math.floor(Math.random() * 4); // Random action for now
      agent.move(action);
      agent.checkReward();
      agent.draw();
    });
  }, 100);
}

document.getElementById("startSimulation").addEventListener("click", () => {
  if (agents.length === 0) addAgent(); // Add an agent if none exists
  startSimulation();
});
