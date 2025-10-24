const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    console.log(`Request received at: ${new Date().toISOString()}`);
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello Node.js Super APP</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                padding: 3rem;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
                border: 1px solid rgba(255, 255, 255, 0.18);
            }
            h1 {
                color: white;
                font-size: 3rem;
                margin: 0 0 1rem 0;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                font-weight: 300;
            }
            .subtitle {
                color: rgba(255, 255, 255, 0.8);
                font-size: 1.2rem;
                margin: 0;
                font-weight: 300;
            }
            .footer {
                margin-top: 2rem;
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.9rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hello Node.js Super TEST</h1>
            <p class="subtitle">Welcome to your Node.js application</p>
            <div class="footer">
                <p>Version: ${process.env.APP_VERSION || '1.0.0'}</p>
                <p>Server time: ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});