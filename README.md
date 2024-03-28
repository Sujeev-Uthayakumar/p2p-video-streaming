# Secure Video Streaming Service

## Overview

This project is a secure peer-to-peer (P2P) video streaming service, designed to facilitate direct video streaming between users. The frontend is built using React, providing a dynamic and responsive user interface. The backend is powered by `simple-peer`, `Express.js`, and `Node.js`, ensuring efficient handling of peer-to-peer connections and server-side functionalities.

## Features

- **Real-Time Video Streaming:** Direct P2P video streaming for reduced latency and increased efficiency.
- **Responsive UI:** A React-based frontend that adapts to various screen sizes and devices.
- **Easy Navigation:** User-friendly interface with intuitive controls for streaming and viewing videos.
- **Secure Connections:** Implementation of secure peer connections to ensure privacy and data integrity.
- **Private and Public Rooms:** Allows video streaming to the users that are intended to view the streams.
- **User Chat Functionality:** Allows users a chat box to message communicate.

## Security Features

- **User Authentication:** Uses MongoDB and JSON Web Tokens(JWT) to authenticate users before creating/joining a room
- **AES Encrypted Video Streaming:** Uses AES encryption to encrypt the video stream from the host to the users
- **Encrypted Video Download:** Transmits an encrypted video file to user via HTTPS download request




## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v12 or higher)
- npm (Node Package Manager)
- A modern web browser (Chrome, Firefox, etc.)

## Installation

1. **Clone the Repository**
   ```bash
   git clone git@github.com:Sujeev-Uthayakumar/p2p-video-streaming.git
   ```
2. **Install Backend Dependencies**
   ```bash
   npm install
   ```
3. **Install Frontend Dependencies**
   ```bash
   cd frontend/
   npm install
   ```

## Running the Application

1. **Start the Backend Server**
   ```bash
   npm run start
   ```

2. **Run the React Frontend**
   ```bash
   npm run start
   ```

The React app will launch in your default browser at `localhost:3000`. With the Express api server running at `localhost:3001`, which the React app will use to establish the peer-to-peer connection.
