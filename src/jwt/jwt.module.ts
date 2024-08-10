import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '1d' }
        })
    })
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}