import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {  ERROR_CATEGORY_NOT_FOUND, ERROR_CATEGORY_ALREADY_EXISTS, ERROR_CATEGORY_HAS_TRANSACTIONS,ERROR_INVALID_UUID,ERROR_INVALID_COLOR,} from '../constants';
import { filterBySearch, sortByField, paginate } from '../common/other/functions';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  private isValidUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  async create(dto: CreateCategoryDto) {
    const exists = await this.repo.findOne({ where: { name: dto.name } });
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
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(ERROR_INVALID_UUID); 
    }
    
    const category = await this.repo.findOne({ where: { id } });
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