import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Trainer } from './entities/trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HelpersService } from 'src/helpers/helpers.service';

@Injectable()
export class TrainerService {
  constructor(
    @InjectModel(Trainer.name)
    private readonly trainerModel: Model<Trainer>,
    private readonly helpersService: HelpersService,
  ) {}

  async create(createTrainerDto: CreateTrainerDto) {
    createTrainerDto.token = this.helpersService.idGenerator();
    createTrainerDto.password = await bcrypt.hash(
      createTrainerDto.password,
      10,
    );
    try {
      const createdTrainer = await this.trainerModel.create(createTrainerDto);
      return createdTrainer;
    } catch (error) {
      this.handleException(error);
    }
    return 'This action adds a new trainer';
  }

  async confirm(token: string) {
    const trainer = await this.trainerModel.findOne<Trainer>({ token });
    if (!trainer) {
      throw new BadRequestException('Invalid token');
    }

    try {
      trainer.token = null;
      trainer.confirmed = true;
      return await trainer.save();
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll() {
    return `This action returns all trainer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trainer`;
  }

  update(id: number, updateTrainerDto: UpdateTrainerDto) {
    return `This action updates a #${id} trainer`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainer`;
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Trainer already exists ${JSON.stringify(error.keyValue)}`,
      );
    } else {
      throw new InternalServerErrorException(
        'An error occurred. Please try again',
      );
    }
  }
}
