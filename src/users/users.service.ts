import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PBKDF2, lib } from 'crypto-js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const now = new Date();

    const user = new User();
    user.name = createUserDto.name;
    user.company_id = createUserDto.company_id;
    user.email = createUserDto.email;
    user.cpf = createUserDto.cpf;
    user.cnpj = createUserDto.cnpj;
    user.phone = createUserDto.phone;
    user.role = createUserDto.role;
    user.birthday = createUserDto.birthday;
    user.created_at = now;
    user.updated_at = now;

    const salt = this.generateRandomKey();
    const passwordHash = this.encrypt({
      password: createUserDto.password,
      salt,
    });

    user.password = passwordHash;
    user.salt = salt;

    const createdUser = await this.usersRepository.save(user);

    return {
      ...createdUser,
      password: undefined,
      salt: undefined,
    };
  }

  encrypt({ password, salt }) {
    return PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 10000,
    }).toString();
  }

  compare({ passwordHash, passwordSalt, password }) {
    const hashedPassword = this.encrypt({
      password,
      salt: passwordSalt,
    });

    return hashedPassword === passwordHash;
  }

  generateRandomKey() {
    return lib.WordArray.random(16).toString();
  }

  async findOneEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOneCpf(cpf: string): Promise<User> {
    return this.usersRepository.findOneBy({ cpf });
  }

  async findOnePhone(phone: string): Promise<User> {
    return this.usersRepository.findOneBy({ phone });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
