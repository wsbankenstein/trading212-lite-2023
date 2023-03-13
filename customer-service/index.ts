import express, { Express, Request, Response } from 'express'

const app: Express = express()
const port = 8081

app.get('/', (req: Request, res: Response) => {
  res.send(':|')
})

app.listen(port, () => {
  console.log(
    `⚡️[server]: Customer Service is running at http://localhost:${port}`
  )
})
