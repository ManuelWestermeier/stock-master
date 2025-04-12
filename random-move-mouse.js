export default function randomMoveMouse(page) {
  // Define circle parameters
  const centerX = 500; // X-coordinate of the circle's center
  const centerY = 500; // Y-coordinate of the circle's center
  const radius = 100; // Radius of the circle
  let angle = 0; // Starting angle in radians
  // Set up the interval to move the mouse every 20 ms
  return setInterval(() => {
    // Increase the angle by a random increment between 0.05 and 0.25 radians
    angle += Math.random() * 0.2 + 0.05;

    // Calculate new x, y coordinates along the circle
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // Move the mouse to the new coordinates
    page.mouse.move(x, y);
  }, 20);
}
