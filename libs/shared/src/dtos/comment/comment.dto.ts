import { ApiProperty } from "@nestjs/swagger";

export class CommentDto {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    content!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}