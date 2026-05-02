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

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl

    // Check if it's a static file
    if (pathname.startsWith('/_next/static/')) {
      const filePath = path.join(__dirname, '.next', pathname.slice(1))
      
      // Try to serve the file
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

    // Public folder files - check after static to avoid conflicts
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
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
