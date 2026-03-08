import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    authorUserId: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    content: string;

    @Column({nullable: true})
    url_image: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true, type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ default: 1 })
    status: number;
}
