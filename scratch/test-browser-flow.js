const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runBrowserTest() {
  console.log('🤖 Starting Headless Browser Flow Check...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Set viewport to a desktop size
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // Step 1: Navigate to admin login page
    console.log('🌐 Navigating to Admin Login page...');
    await page.goto('http://127.0.0.1:3000/admin', { waitUntil: 'domcontentloaded', timeout: 90000 });

    // Step 2: Fill login details
    console.log('⏳ Waiting for login form elements to hydrate...');
    await page.waitForSelector('input[type="text"]', { timeout: 15000 });
    
    console.log('✍️ Typing credentials...');
    await page.type('input[type="text"]', 'mahi');
    await page.type('input[type="password"]', 'Mahendra@10');

    // Step 3: Click login button
    console.log('🔐 Clicking Login button...');
    await page.click('button[type="submit"]');

    // Step 4: Wait for dashboard redirect
    console.log('⏳ Waiting for dashboard to render (sidebar elements)...');
    await page.waitForSelector('nav', { timeout: 30000 });

    const currentUrl = page.url();
    console.log('📍 Current URL after login:', currentUrl);

    if (!currentUrl.includes('/admin/dashboard')) {
      throw new Error(`Failed to redirect to dashboard. Stopped at: ${currentUrl}`);
    }
    console.log('✅ Dashboard reached successfully!');

    // Wait a brief moment for dashboard data load
    await new Promise(r => setTimeout(r, 2000));

    // Confirm dashboard cards are rendered
    const hasTotalStudentsCard = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('p, div, span')).map(el => el.textContent);
      return texts.some(t => t.includes('Total Students') || t.includes('Total Directory Students') || t.includes('Students'));
    });
    console.log(`📊 Dashboard loaded students info card: ${hasTotalStudentsCard ? 'YES' : 'NO'}`);

    // Step 5: Navigate to Student Directory page
    console.log('🌐 Navigating to Students Directory tab...');
    await page.goto('http://127.0.0.1:3000/admin/students', { waitUntil: 'domcontentloaded', timeout: 90000 });
    
    console.log('⏳ Waiting for Moodle student list to fetch and load...');
    await new Promise(r => setTimeout(r, 4000)); // wait for API call

    // Check if table contains loaded students
    const studentRowsCount = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length;
    });

    console.log(`👥 Found ${studentRowsCount} student rows in the browser table.`);

    const sampleStudentName = await page.evaluate(() => {
      // Get the name from the first student row if present
      const firstRowName = document.querySelector('tbody tr td:nth-child(2)');
      return firstRowName ? firstRowName.textContent.trim() : 'None';
    });
    console.log(`👤 First student name shown on screen: "${sampleStudentName}"`);

    // Capture screenshot as verification artifact
    const screenshotPath = path.join(__dirname, 'admin_students_screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot captured and saved to: ${screenshotPath}`);

  } catch (error) {
    console.error('❌ Browser Flow Test Error:', error.message);
    const errorScreenshotPath = path.join(__dirname, 'error_screenshot.png');
    await page.screenshot({ path: errorScreenshotPath });
    console.log(`📸 Error screenshot captured and saved to: ${errorScreenshotPath}`);
  } finally {
    await browser.close();
    console.log('🏁 Browser test complete. Browser closed.');
  }
}

runBrowserTest();
