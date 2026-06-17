

const MOODLE_URL = 'https://moodle.aiudaanbootcamp.com';
const TOKENS = {
  MOODLE_TOKEN: '4d39ac96033cf9b633da0dd2d6c303a1',
  MOODLE_COURSE_TOKEN: 'c127235bbc4da188cd6782ac85c0f558',
  MOODLE_CREATE_USER_TOKEN: '3f07d21e55d9fb5bf45fc5aafc2a50af',
  MOODLE_ENROL_TOKEN: '7d0ebfe49d4d497da0bccc09da2e93dd'
};

async function testToken(tokenName, tokenValue) {
  const params = new URLSearchParams();
  params.append('wstoken', tokenValue);
  params.append('wsfunction', 'core_enrol_get_users_courses');
  params.append('moodlewsrestformat', 'json');
  params.append('userid', '10'); // User ID for 'mahi'

  const endpoint = `${MOODLE_URL}/webservice/rest/server.php`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const data = await response.json();
    console.log(`Token: ${tokenName} -> Result:`, JSON.stringify(data).substring(0, 300));
  } catch (err) {
    console.error(`Token: ${tokenName} failed:`, err.message);
  }
}

async function run() {
  for (const [name, val] of Object.entries(TOKENS)) {
    await testToken(name, val);
  }
}

run();
