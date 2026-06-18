import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "./prisma/prisma.module";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { ArticlesModule } from "./articles/articles.module";
import { BannersModule } from "./banners/banners.module";
import { LinksModule } from "./links/links.module";
import { LeadersModule } from "./leaders/leaders.module";
import { UploadsModule } from "./uploads/uploads.module";
import { AdmissionsModule } from "./admissions/admissions.module";
import { RecruitmentsModule } from "./recruitments/recruitments.module";
import { PublicQueryModule } from "./public-query/public-query.module";
import { SystemModule } from "./system/system.module";

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
    AuditModule,
    AuthModule,
    CategoriesModule,
    ArticlesModule,
    BannersModule,
    LinksModule,
    LeadersModule,
    UploadsModule,
    AdmissionsModule,
    RecruitmentsModule,
    PublicQueryModule,
    SystemModule,
  ],
})
export class AppModule {}
