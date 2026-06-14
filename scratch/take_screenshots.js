const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 3000;
const API_PORT = 8000;
const BASE_URL = `http://localhost:${PORT}`;
const API_URL = `http://localhost:${API_PORT}`;
const OUTPUT_DIR = 'C:/Users/Swastika/.gemini/antigravity/brain/2cfbca7e-3ca8-4dee-838f-42a727f135e6';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to fetch flight list and find AI102 ID
function getFlightId() {
  return new Promise((resolve, reject) => {
    http.get(`${API_URL}/api/flights`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const flights = JSON.parse(data);
          const flight = flights.find(f => f.flight_number === 'AI102');
          if (flight) {
            console.log(`Found Flight AI102 with ID: ${flight.flight_id}`);
            resolve(flight.flight_id);
          } else {
            console.log(`Flight AI102 not found in list. Defaulting to first flight.`);
            resolve(flights[0] ? flights[0].flight_id : '1');
          }
        } catch (e) {
          console.error('Failed to parse flight list', e);
          resolve('1');
        }
      });
    }).on('error', (err) => {
      console.error('API request error', err);
      resolve('1');
    });
  });
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  console.log('Retrieving flight ID for AI102...');
  const flightId = await getFlightId();
  
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Landing Page
  console.log('Navigating to Landing Page...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await delay(2000); // Wait for transition animations
  const landingPath = path.join(OUTPUT_DIR, 'landing_page.png');
  await page.screenshot({ path: landingPath });
  console.log(`Saved Landing Page screenshot to ${landingPath}`);

  // 2. Dashboard
  console.log('Navigating to Dashboard...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.radar-sweep-effect', { timeout: 10000 });
  await delay(3000); // Allow radar animations and API values to load
  const dashboardPath = path.join(OUTPUT_DIR, 'dashboard.png');
  await page.screenshot({ path: dashboardPath });
  console.log(`Saved Dashboard screenshot to ${dashboardPath}`);

  // 3. Flight Detail Page (AI102)
  console.log(`Navigating to Flight Detail Page for ID ${flightId}...`);
  await page.goto(`${BASE_URL}/dashboard/flight/${flightId}`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('svg text', { timeout: 10000 });
  await delay(2000);
  const flightPath = path.join(OUTPUT_DIR, 'flight_detail.png');
  await page.screenshot({ path: flightPath });
  console.log(`Saved Flight Detail screenshot to ${flightPath}`);

  // 4. Fleet Health Page
  console.log('Navigating to Fleet Health Page...');
  await page.goto(`${BASE_URL}/dashboard/fleet`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.glass-panel', { timeout: 10000 });
  await delay(2000);
  const fleetPath = path.join(OUTPUT_DIR, 'fleet_health.png');
  await page.screenshot({ path: fleetPath });
  console.log(`Saved Fleet Health screenshot to ${fleetPath}`);

  // 5. AI Assistant Focus
  console.log('Focusing on AI Assistant and executing a command...');
  // Navigate back to dashboard where ChatPanel is loaded
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[placeholder="Execute safety operations directive..."]', { timeout: 10000 });
  
  // Click quick diagnostic macro: "Is Flight AI102 safe to operate?"
  // Based on ChatPanel structure, suggestions are buttons. Let's find one that contains AI102.
  const buttons = await page.$$('button');
  let targetBtn = null;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('AI102 safe')) {
      targetBtn = btn;
      break;
    }
  }
  
  if (targetBtn) {
    console.log('Clicking diagnostic macro for AI102 risk query...');
    await targetBtn.click();
    // Wait for loader to disappear or text to appear
    await delay(5000); // Wait for API stream to reply
  } else {
    console.log('Macro button not found, typing query manually...');
    await page.type('input[placeholder="Execute safety operations directive..."]', 'Is Flight AI102 safe to operate?');
    await page.keyboard.press('Enter');
    await delay(5000);
  }

  // Take screenshot of the Chat Panel element specifically
  console.log('Capturing AI Assistant panel...');
  const chatPanelElement = await page.$('aside');
  if (chatPanelElement) {
    const aiAssistantPath = path.join(OUTPUT_DIR, 'ai_assistant.png');
    await chatPanelElement.screenshot({ path: aiAssistantPath });
    console.log(`Saved AI Assistant screenshot to ${aiAssistantPath}`);
  } else {
    console.log('Aside element not found, taking full page screenshot for AI Assistant...');
    const aiAssistantPath = path.join(OUTPUT_DIR, 'ai_assistant.png');
    await page.screenshot({ path: aiAssistantPath });
  }

  console.log('Closing browser...');
  await browser.close();
  console.log('Screenshot generation complete!');
}

run().catch(err => {
  console.error('Error during screenshot execution:', err);
  process.exit(1);
});
