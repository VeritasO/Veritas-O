# Project Title

## Overview
This project is designed to seed a database with initial data for books and agents. It includes a seed script that loads data from a JSON file, validates the data, and inserts it into the database.

## File Structure
```
server
├── seed.ts          # Seed script for loading data into the database
├── db.ts            # Database connection and configuration
├── schema.ts        # Schema definitions for database tables
├── seed.json        # JSON file containing seed data
└── README.md        # Documentation for the project
```

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:
   Ensure you have Node.js installed, then run:
   ```
   npm install
   ```

3. **Configure the database**:
   Update the database connection settings in `db.ts` as needed.

4. **Prepare the seed data**:
   Modify `seed.json` to include the desired books and agents data.

## Usage
To seed the database, run the following command:
```
node seed.ts
```
This will execute the seed script, which will log the progress of the seeding process and exit upon completion or failure.

## Notes
- Ensure that the database is running before executing the seed script.
- The agent statuses are validated against the allowed values: `['active', 'inactive', 'pending']`. Any invalid statuses will default to `active`.