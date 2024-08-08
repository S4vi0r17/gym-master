import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientSchema } from './entities/client.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
  imports: [
    MongooseModule.forFeature([{ name: 'Client', schema: ClientSchema }]),
    AuthModule,
  ],
})
export class ClientModule {}