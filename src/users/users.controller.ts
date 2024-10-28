import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Version('1')
  @Get(':id')
  findOne(@Request() req, @Param('id') id: number) {
    return this.usersService.findOne(id, req.user.company);
  }

  @Version('1')
  @Get()
  @Roles(Role.CompanyAdmin)
  findAllCompany(@Request() req) {
    return this.usersService.findAllCompany(req.user.company);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, req.user.company, updateUserDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.usersService.remove(+id, req.user.company);
  }
}
