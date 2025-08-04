#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

# Create evaluation_plots directory if it doesn't exist
mkdir -p evaluation_plots 