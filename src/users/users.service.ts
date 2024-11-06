import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const duplicate = await this.prisma.user.findUnique({
      where: {
        username: createUserDto.username,
      },
    });

    if (duplicate) {
      throw new HttpException('Credentials already taken', HttpStatus.CONFLICT);
    }

    const newUser = await this.prisma.user.create({ data: createUserDto });

    return newUser;
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new NotFoundException();
    }

    return userExists;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) throw new NotFoundException();

    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });

    return updatedUser;
  }

  async delete(id: number) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) throw new NotFoundException();

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
