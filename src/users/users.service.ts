import { BadRequestException, Injectable } from '@nestjs/common';
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

  async updateCompany(userId: number, company_id: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.company_id = company_id;
    await this.usersRepository.save(user);
  }

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

  async updatePassword(userId: number, newPassword: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const salt = this.generateRandomKey();
    const passwordHash = this.encrypt({ password: newPassword, salt });

    user.password = passwordHash;
    user.salt = salt;
    await this.usersRepository.save(user);
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

  async findOne(id: number, company_id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id, company_id });
  }

  async findOneCpf(cpf: string): Promise<User> {
    return this.usersRepository.findOneBy({ cpf });
  }

  async findOnePhone(phone: string): Promise<User> {
    return this.usersRepository.findOneBy({ phone });
  }

  async findAllCompany(company_id: number) {
    return this.usersRepository.findBy({ company_id });
  }

  async update(id: number, company_id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOneBy({ id, company_id });

      if (!user) {
        return {
          message: 'User not found',
        };
      }

      const now = new Date();

      user.name = updateUserDto.name;
      user.email = updateUserDto.email;
      user.cpf = updateUserDto.cpf;
      user.cnpj = updateUserDto.cnpj;
      user.phone = updateUserDto.phone;
      user.role = updateUserDto.role;
      user.birthday = updateUserDto.birthday;
      user.updated_at = now;

      const updatedUser = await this.usersRepository.save(user);

      return {
        ...updatedUser,
        password: undefined,
        salt: undefined,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number, company_id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id, company_id });

      if (!user) {
        return {
          message: 'User not found',
        };
      }

      return await this.usersRepository.remove(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
