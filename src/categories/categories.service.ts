import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ERROR_CATEGORY_NOT_FOUND, ERROR_CATEGORY_ALREADY_EXISTS, ERROR_CATEGORY_HAS_TRANSACTIONS } from '../constants';
import { filterBySearch, sortByField, paginate } from '../common/other/functions';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const exists = await this.repo
      .createQueryBuilder('category')
      .where('category._name = :name', { name: dto.name })
      .getOne();
    
    if (exists) {
      throw new ConflictException(ERROR_CATEGORY_ALREADY_EXISTS);
    }
    const category = Category.create(dto.name, dto.color);
    return await this.repo.save(category);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    search: string = '',
    sortBy: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    let categories = await this.repo.find();
    categories = filterBySearch(categories, search, c => c.name);
    categories = sortByField(categories, sortBy as keyof Category, sortOrder);
    return paginate(categories, page, limit);
  }

  async findOne(id: string) {
    const category = await this.repo
      .createQueryBuilder('category')
      .where('category._id = :id', { id })
      .getOne();
    
    if (!category) {
      throw new NotFoundException(ERROR_CATEGORY_NOT_FOUND);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (dto.name !== undefined) {
      category.updateName(dto.name);
    }
    if (dto.color !== undefined) {
      category.updateColor(dto.color);
    }
    return await this.repo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    try {
      await this.repo.remove(category);
    } catch {
      throw new ConflictException(ERROR_CATEGORY_HAS_TRANSACTIONS);
    }
  }
}