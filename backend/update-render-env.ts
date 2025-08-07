import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const SERVICE_ID = process.env.RENDER_SERVICE_ID;

if (!RENDER_API_KEY || !SERVICE_ID) {
  console.error('Please set RENDER_API_KEY and RENDER_SERVICE_ID environment variables');
  process.exit(1);
}

const envPath = path.resolve(process.cwd(), 'backend/.env.production');
if (!fs.existsSync(envPath)) {
  console.error(`.env.production file not found at ${envPath}`);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envConfig = dotenv.parse(envContent);

type EnvVar = {
  key: string;
  value: string;
};

const envVars: EnvVar[] = Object.entries(envConfig).map(([key, value]) => ({
  key,
  value,
}));

const apiUrl = `https://api.render.com/v1/services/${SERVICE_ID}/env-vars`;

async function updateEnvVars() {
  try {
    // Fetch existing env vars
    const existingResponse = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${RENDER_API_KEY}` },
    });

    if (!existingResponse.ok) {
      throw new Error(`Failed to fetch existing env vars: ${existingResponse.statusText}`);
    }

    const existingVars: EnvVar[] = await existingResponse.json();

    // Merge existing and new vars (new overrides old)
    const mergedVarsMap = new Map<string, EnvVar>();
    existingVars.forEach((v) => mergedVarsMap.set(v.key, v));
    envVars.forEach((v) => mergedVarsMap.set(v.key, v));

    const mergedVars = Array.from(mergedVarsMap.values());

    // Update env vars on Render
    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mergedVars),
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update env vars: ${updateResponse.statusText}`);
    }

    console.log('Environment variables updated successfully.');
  } catch (error) {
    console.error('Error updating environment variables:', error);
    process.exit(1);
  }
}

updateEnvVars();
