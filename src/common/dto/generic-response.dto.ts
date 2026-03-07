import { ApiProperty } from "@nestjs/swagger";

export class GenericResponsesDto {

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Dato creado/actualizado/eliminado',
  })
  message: string

  @ApiProperty({
    description: 'Código de estado de la respuesta',
    example: 201,
  })
  statusCode: number

  @ApiProperty({
    description: 'Nombre del error',
    example: 'Not Found'
  })
  error: string

}