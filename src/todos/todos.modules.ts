import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { User } from '../users/entities/user.entity';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, User])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule { }
