import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'node:path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setGlobalPrefix('api')
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/'
  })

  app.enableCors({
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:5174',
      'http://localhost:5174'
    ],
    credentials: true
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    })
  )

  const port = Number(process.env.PORT || 3001)
  await app.listen(port, '127.0.0.1')

  console.log(`School API is running at http://127.0.0.1:${port}/api`)
}

bootstrap()
