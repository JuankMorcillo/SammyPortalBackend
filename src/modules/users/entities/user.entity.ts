import { Post } from "src/modules/posts/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryColumn()
    id: number;

    @Column()
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ nullable: true, type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];
}
