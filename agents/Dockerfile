# Dockerfile for Clay-I Server

# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the base working directory
WORKDIR /app

# Copy the requirements file and install dependencies first
COPY requirements.txt .
RUN apt-get update && apt-get install -y \
    python3-dev \
    libasound2-dev \
    libportaudio2 \
    libportaudiocpp0 \
    ffmpeg \
    libavdevice-dev \
    libavfilter-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsndfile1 \
    espeak && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

# Debug with separate test step
RUN python3 -c "import pygame; import pyaudio"

# Now, copy the application code into a subdirectory
COPY core_intelligence ./core_intelligence
COPY voice_synthesis ./voice_synthesis

# Set the final working directory to where the app is
WORKDIR /app/core_intelligence

# Make port 8000 available
EXPOSE 8000

# Define environment variables
ENV OPENAI_API_KEY=""

# Correct command to run the application with reload in the correct directory
CMD ["uvicorn", "clay_i_server:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "debug", "--reload", "--reload-dir", "/app/core_intelligence"]
