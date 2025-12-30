import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { User } from '../users/entities/user.entity';
import { TodoResonseDto } from './dto/todo-response.dto';
import { UpdateTodoDto } from './dto/update-todo-dto';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepo: Repository<Todo>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async create(title: string, userId: number): Promise<TodoResonseDto> {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const todo = this.todoRepo.create({
            title,
            user,
        });

        const saved = await this.todoRepo.save(todo);

        return this.toResponseDto(saved);
    }

    async findByUser(userId: number): Promise<TodoResonseDto[]> {
        const todos = await this.todoRepo.find({
            where: { user: { id: userId } },
        });

        return todos.map((todo) => this.toResponseDto(todo))
    }

    async update(
        todoId: number,
        userId: number,
        dto: UpdateTodoDto,
    ): Promise<TodoResonseDto> {
        const todo = await this.todoRepo.findOne({
            where: { id: todoId },
            relations: ['user']
        })

        if (!todo) {
            throw new NotFoundException('Todo not found');
        }

        if (todo.user.id !== userId) {
            throw new ForbiddenException('You are not the owner of this todo');
        }

        Object.assign(todo, dto);

        const saved = await this.todoRepo.save(todo);
        return this.toResponseDto(saved);
    }

    async remove(todoId: number, userId: number): Promise<void> {
        const todo = await this.todoRepo.findOne({
            where: { id: todoId },
            relations: ['user'],
        });

        if (!todo) {
            throw new NotFoundException('Todo not found');
        }

        if (todo.user.id !== userId) {
            throw new ForbiddenException('You are not the owner of this todo');
        }

        await this.todoRepo.remove(todo);
    }

    async findByUserPaginated(
        userId: number,
        page = 1,
        limit = 10,
    ) {
        const [items, total] = await this.todoRepo.findAndCount({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            items: items.map((todo) => this.toResponseDto(todo)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }



    private toResponseDto(todo: Todo): TodoResonseDto {
        return {
            id: todo.id,
            title: todo.title,
            isCompleted: todo.isCompleted,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt,
        };
    }
}
