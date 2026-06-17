import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { ArticlesModule } from "./articles/articles.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "school-api-dev-secret-change-me",
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
      },
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ArticlesModule,
  ],
})
export class AppModule {}
