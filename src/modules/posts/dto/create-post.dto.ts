import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreatePostDto {

    @ApiProperty({ description: 'ID del usuario autor del post', example: 1 })
    @IsNumber()
    authorUserId: number;

    @ApiProperty({ description: 'Título del post', example: 'Mi primer post' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Contenido del post', example: 'Este es el contenido de mi primer post' })
    @IsString()
    content: string;

    @ApiProperty({ description: 'URL de la imagen del post', example: 'https://example.com/image.jpg' })
    @IsString()
    url_image: string;
}
