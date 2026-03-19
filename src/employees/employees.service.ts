import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Employee, employeeAttributes } from '@/entities/employee.entity';
import { createSelect } from '@/utils/orm/create-select';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { UpdateEmployeeDto, UpdateEmployeeStatusDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      isActive: createEmployeeDto.isActive ?? true,
    });
    return this.employeeRepository.save(employee);
  }

  async findAll(filterDto: FilterEmployeeDto): Promise<{ rows: Employee[]; count: number }> {
    const { search, isActive, department, sortBy, sortType, STARTPAGE, PERPAGE } = filterDto;

    let whereConditions: any = {};

    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }
    if (department) {
      whereConditions.department = ILike(`%${department}%`);
    }

    if (search) {
      const baseWhere = { ...whereConditions };
      whereConditions = [
        { ...baseWhere, firstName: ILike(`%${search}%`) },
        { ...baseWhere, lastName: ILike(`%${search}%`) },
        { ...baseWhere, email: ILike(`%${search}%`) },
        { ...baseWhere, position: ILike(`%${search}%`) },
      ];
    }

    const orderConditions: any = {};
    if (sortBy && sortType) {
      orderConditions[sortBy] = sortType.toUpperCase();
    } else {
      orderConditions['createdAt'] = 'DESC';
    }

    const findOptions: FindManyOptions<Employee> = {
      skip: STARTPAGE,
      take: PERPAGE,
      select: createSelect<Employee>(employeeAttributes),
      where: whereConditions,
      order: orderConditions,
    };

    const [rows, count] = await this.employeeRepository.findAndCount(findOptions);
    return { rows, count };
  }

  async findOne(id: string): Promise<Employee> {
    return this.employeeRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string, excludeId?: string): Promise<Employee> {
    const qb = this.employeeRepository.createQueryBuilder('employee')
      .where('LOWER(employee.email) = LOWER(:email)', { email });
    if (excludeId) {
      qb.andWhere('employee.id != :excludeId', { excludeId });
    }
    return qb.getOne();
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<number> {
    const { affected } = await this.employeeRepository.update(id, updateEmployeeDto);
    return affected;
  }

  async updateStatus(id: string, statusDto: UpdateEmployeeStatusDto): Promise<number> {
    const { affected } = await this.employeeRepository.update(id, {
      isActive: statusDto.isActive,
      updatedBy: statusDto.updatedBy,
    });
    return affected;
  }

  async remove(id: string): Promise<number> {
    const { affected } = await this.employeeRepository.delete(id);
    return affected;
  }
}
