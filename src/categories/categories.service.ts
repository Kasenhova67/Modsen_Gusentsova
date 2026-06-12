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

  async findAll(
    page: number = 1,
    limit: number = 20,
    search: string = '',
    sortBy: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC' ,
  ){
    let allCategories = await this.repo.find();

    if(search != ''){
      const filter = [];
      for(let i = 0; i < allCategories.length; i++){
        const name = allCategories[i].name.toLowerCase();
        const searchName = name.toLowerCase();
        if( name.includes(searchName)){
          filter.push(allCategories[i]);
        }
      }
      allCategories = filter;
    }
    allCategories.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      if( sortBy === 'cretedAt'){
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }      
      if (sortOrder === 'ASC') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const totalCount = allCategories.length;
    const startIndex = (page - 1) * limit;
    const data = [];
    for (let i = startIndex; i < startIndex + limit && i < allCategories.length; i++) {
      data.push(allCategories[i]);
    }
    
    return { data, total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) };
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