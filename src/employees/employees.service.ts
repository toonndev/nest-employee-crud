import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Employee, employeeAttributes } from '@/entities/employee.entity';
import { createSelect } from '@/utils/orm/create-select';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) { }

  private async generateEmpNum(depNo: string): Promise<string> {
    const prefix = (depNo ?? '00').padStart(2, '0');
    const last = await this.employeeRepository.findOne({
      where: { DepNo: depNo },
      order: { EmpNum: 'DESC' },
      select: ['EmpNum'],
    });
    const seq = last ? parseInt(last.EmpNum.slice(-2), 10) + 1 : 1;
    return prefix + String(seq).padStart(2, '0');
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const EmpNum = await this.generateEmpNum(createEmployeeDto.DepNo ?? '00');
    const employee = this.employeeRepository.create({ ...createEmployeeDto, EmpNum });
    return this.employeeRepository.save(employee);
  }

  async findAll(filterDto: FilterEmployeeDto): Promise<{ rows: Employee[]; count: number }> {
    const { search, DepNo, sortBy, sortType, STARTPAGE, PERPAGE } = filterDto;

    let whereConditions: any = {};

    if (DepNo) {
      whereConditions.DepNo = DepNo;
    }

    if (search) {
      const baseWhere = { ...whereConditions };
      whereConditions = [
        { ...baseWhere, EmpName: ILike(`%${search}%`) },
        { ...baseWhere, Position: ILike(`%${search}%`) },
      ];
    }

    const orderConditions: any = {};
    if (sortBy && sortType) {
      orderConditions[sortBy] = sortType.toUpperCase();
    } else {
      orderConditions['EmpNum'] = 'ASC';
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

  async findByEmpNum(empNum: string): Promise<Employee> {
    return this.employeeRepository.findOne({ where: { EmpNum: empNum } });
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<number> {
    const { affected } = await this.employeeRepository.update({ id }, updateEmployeeDto);
    return affected;
  }

  async remove(id: string): Promise<number> {
    const { affected } = await this.employeeRepository.delete({ id });
    return affected;
  }
}
