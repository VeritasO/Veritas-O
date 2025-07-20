import app from './app'

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`🚀 Veritas-O server running on port ${port}`)
  console.log(`🔗 API available at http://localhost:${port}/api`)
  console.log(`❤️ Health check at http://localhost:${port}/health`)
})
