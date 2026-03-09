import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UserPostsRequestDto {

    @ApiPropertyOptional({
        description: 'Filter posts by user name (first name or last name)',
        required: false,
        example: ''
    })
    @IsOptional()
    userName?: string;

    @ApiPropertyOptional({
        description: 'Filter posts by title',
        required: false,
        example: ''
    })
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({
        description: 'Order of the posts (ASC or DESC)',
        required: false,
        example: 'ASC'
    })
    @IsOptional()
    order?: 'ASC' | 'DESC';
}