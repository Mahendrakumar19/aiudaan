const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// MIME types mapping
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

// Robust error handler for build issues
const checkBuildExists = () => {
  const nextDir = path.join(__dirname, '.next')
  if (!fs.existsSync(nextDir)) {
    console.error('❌ CRITICAL ERROR: .next build directory not found!')
    console.error('Solution: Run these commands on server:')
    console.error('  1. npm install')
    console.error('  2. npm run build')
    console.error('  3. npm start')
    process.exit(1)
  }
  console.log('✅ Build directory found')
}

// Check build exists before preparing app
checkBuildExists()

app.prepare()
  .then(() => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // Check if it's a static file
      if (pathname.startsWith('/_next/static/')) {
        const filePath = path.join(__dirname, '.next', pathname.slice(1))
        
        try {
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath)
            const contentType = mimeTypes[ext] || 'application/octet-stream'
            
            res.setHeader('Content-Type', contentType)
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
            res.setHeader('Access-Control-Allow-Origin', '*')
            
            const fileStream = fs.createReadStream(filePath)
            fileStream.pipe(res)
            fileStream.on('error', (err) => {
              console.error('Error serving static file:', err)
              res.statusCode = 500
              res.end('Internal Server Error')
            })
            return
          }
        } catch (err) {
          console.error('Error accessing static file:', err)
        }
      }

      // Public folder files
      if (!pathname.startsWith('/_next')) {
        const publicPath = path.join(__dirname, 'public', pathname)
        try {
          if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
            const ext = path.extname(publicPath)
            const contentType = mimeTypes[ext] || 'application/octet-stream'
            
            res.setHeader('Content-Type', contentType)
            res.setHeader('Cache-Control', 'public, max-age=3600')
            
            const fileStream = fs.createReadStream(publicPath)
            fileStream.pipe(res)
            fileStream.on('error', (err) => {
              console.error('Error serving public file:', err)
              handle(req, res, parsedUrl)
            })
            return
          }
        } catch (err) {
          console.error('Error accessing public file:', err)
        }
      }

      // Handle all other requests through Next.js
      handle(req, res, parsedUrl)
    })

    const PORT = process.env.PORT || 3000
    server.listen(PORT, (err) => {
      if (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
      }
      console.log(`> Ready on http://localhost:${PORT}`)
      console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  })
  .catch((err) => {
    console.error('❌ Failed to prepare Next.js app:', err)
    console.error('\nMake sure:')
    console.error('  1. npm install was run')
    console.error('  2. npm run build was run (creates .next directory)')
    console.error('  3. All dependencies are installed')
    process.exit(1)
  })
