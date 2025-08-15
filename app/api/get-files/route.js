// File: app/api/get-files/route.js

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Path to your companies directory
  const directoryPath = path.join(process.cwd(), 'public/data/companies');

  try {
    // Read all filenames from the directory
    const files = fs.readdirSync(directoryPath);

    // Filter to include only .csv files
    const csvFiles = files.filter(file => file.endsWith('.csv'));

    // Send the list of files as the response
    return NextResponse.json(csvFiles);

  } catch (error) {
    // Handle potential errors, like the directory not being found
    return NextResponse.json({ error: 'Failed to read directory' }, { status: 500 });
  }
}