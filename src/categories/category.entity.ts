import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  private _id: string;

  @Column({ unique: true })
  private _name: string;

  @Column()
  private _color: string;

  @CreateDateColumn()
  private _createdAt: Date;

  @UpdateDateColumn()
  private _updatedAt: Date;

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get color(): string { return this._color; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  static create(name: string, color: string): Category {
    const category = new Category();
    category._name = name;
    category._color = color;
    return category;
  }

  updateName(newName: string): void {
    if (newName.length < 2 || newName.length > 50) {
      throw new Error('Name must be between 2 and 50 characters');
    }
    this._name = newName;
  }

  updateColor(newColor: string): void {
    if (!/^#([A-Fa-f0-9]{6})$/.test(newColor)) {
      throw new Error('Color must be in HEX format (#RRGGBB)');
    }
    this._color = newColor;
  }
}