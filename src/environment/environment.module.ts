import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './environment.config';

@Module({
  imports: [ConfigModule.forFeature(config)],
})
export class EnvironmentModule {}
