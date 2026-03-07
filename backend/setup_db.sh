#!/bin/bash

echo "🗄️  Setting up database..."

# Activate virtual environment
source venv/bin/activate

# Create tables and seed data
python3 scripts/seed_db.py

echo "✅ Database setup complete!"
