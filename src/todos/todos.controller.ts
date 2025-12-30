import {
    Controller,
    Param,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    UseGuards,
    Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth-guard';
import { CurrentUser } from '../common/decorators/user.decoretor';
import { TodosService } from './todos.service';
import { UpdateTodoDto } from './dto/update-todo-dto';
import { QueryTodoDto } from './dto/query-todo.dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Post()
    create(
        @Body('title') title: string,
        @CurrentUser() user: { userId: number; email: string },
    ) {
        return this.todosService.create(title, user.userId);
    }

    @Get()
    findMyTodos(
        @Query() query: QueryTodoDto,
        @CurrentUser() user: { userId: number },
    ) {
        const { page = 1, limit = 10 } = query;
        return this.todosService.findByUserPaginated(
            user.userId,
            page,
            limit,
        );
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateTodoDto,
        @CurrentUser() user: { userId: number },
    ) {
        return this.todosService.update(Number(id), user.userId, dto);
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @CurrentUser() user: { userId: number },
    ) {
        await this.todosService.remove(Number(id), user.userId);
        return null; // interceptor akan bungkus
    }
}
