import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {

    @ApiPropertyOptional({ description: 'Estado del post', example: 1 })
    @IsOptional()
    @IsNumber()
    status?: number;

}
