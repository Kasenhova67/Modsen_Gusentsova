import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ERROR_CATEGORY_NOT_FOUND, ERROR_CATEGORY_ALREADY_EXISTS, ERROR_CATEGORY_HAS_TRANSACTIONS } from '../constants';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const allCategories = await this.repo.find();
    for (let i = 0; i < allCategories.length; i++) {
      if (allCategories[i].name === dto.name) {
        throw new ConflictException(ERROR_CATEGORY_ALREADY_EXISTS);
      }
    }
    const newCategory = new Category();
    newCategory.name = dto.name;
    newCategory.color = dto.color;

    return await this.repo.save(newCategory);
  }

  async findAll(page: number = 1, limit: number = 20, search: string = '') {
    let allCategories = await this.repo.find();
    if (search !== '') {
      const filtered = [];
      for (let i = 0; i < allCategories.length; i++) {
        const name = allCategories[i].name.toLowerCase();
        const searchTerm = search.toLowerCase();
        if (name.includes(searchTerm)) {
          filtered.push(allCategories[i]);
        }
      }
      allCategories = filtered;
    }
    allCategories.sort(function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    const totalCount = allCategories.length;
    const startIndex = (page - 1) * limit;
    const data = [];
    for (let i = startIndex; i < startIndex + limit && i < allCategories.length; i++) {
      data.push(allCategories[i]);
    }

    return {data: data, total: totalCount, page: page, limit: limit, totalPages: Math.ceil(totalCount / limit), };
  }

  async findOne(id: string) {
    const category = await this.repo.findOne({ where: { id: id } });
    if (!category) {
      throw new NotFoundException(ERROR_CATEGORY_NOT_FOUND);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (dto.name !== undefined) {
      category.name = dto.name;
    }
    if (dto.color !== undefined) {
      category.color = dto.color;
    }
    return await this.repo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);    
    try {
      await this.repo.remove(category);
    } catch (error) {
      throw new ConflictException(ERROR_CATEGORY_HAS_TRANSACTIONS);
    }
  }
}