import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { BodyWithCreatedBy } from '@/decorator/created-by.decorator';
import { BodyWithUpdatedBy } from '@/decorator/updated-by.decorator';
import { QueryPage } from '@/decorator/pagination.decorator';
import { MSG_MASTER } from '@/message/msg-master';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { EmployeeDto } from './dto/employee.dto';

@ApiTags('Employees')
@ApiBearerAuth()
@ApiExtraModels(CreateEmployeeDto, FilterEmployeeDto, EmployeeDto)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Post()
  @ApiOperation({ summary: 'Create Employee (สร้างพนักงาน)' })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiOkResponse({ type: EmployeeDto })
  async create(
    @BodyWithCreatedBy() createEmployeeDto: CreateEmployeeDto,
    @Res() res: FastifyReply,
  ) {
    const duplicate = await this.employeesService.findByEmpNum(createEmployeeDto.EmpNum);
    if (duplicate) {
      throw new HttpException(
        MSG_MASTER.DUPLICATE_ENTRY,
        MSG_MASTER.DUPLICATE_ENTRY.httpStatus,
      );
    }

    const createdData = await this.employeesService.create(createEmployeeDto);
    if (!createdData) {
      throw new HttpException(
        MSG_MASTER.INVALID_PARAMETERS,
        MSG_MASTER.INVALID_PARAMETERS.httpStatus,
      );
    }
    return res.status(201).send(createdData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Employees (ดูรายชื่อพนักงานทั้งหมด)' })
  @ApiQuery({ type: FilterEmployeeDto })
  @ApiOkResponse({ type: [EmployeeDto] })
  async findAll(
    @Res() res: FastifyReply,
    @QueryPage() filterEmployeeDto: FilterEmployeeDto,
  ) {
    const { STARTPAGE, RANGEEND } = filterEmployeeDto;
    const { rows, count } = await this.employeesService.findAll(filterEmployeeDto);
    return res
      .header('Content-Range', `${STARTPAGE + 1}-${RANGEEND}/${count}`)
      .send(rows);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Employee by EmpNum (ดูข้อมูลพนักงานตามรหัส)' })
  @ApiOkResponse({ type: EmployeeDto })
  async findOne(@Res() res: FastifyReply, @Param('id') id: string) {
    const employee = await this.employeesService.findOne(id);
    if (!employee) {
      throw new HttpException(
        MSG_MASTER.NOT_FOUND,
        MSG_MASTER.NOT_FOUND.httpStatus,
      );
    }
    return res.send(employee);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Employee by EmpNum (แก้ไขข้อมูลพนักงาน)' })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiOkResponse({ type: Number })
  async update(
    @BodyWithUpdatedBy() updateEmployeeDto: UpdateEmployeeDto,
    @Param('id') id: string,
    @Res() res: FastifyReply,
  ) {
    const employee = await this.employeesService.findOne(id);
    if (!employee) {
      throw new HttpException(
        MSG_MASTER.NOT_FOUND,
        MSG_MASTER.NOT_FOUND.httpStatus,
      );
    }

    const updated = await this.employeesService.update(id, updateEmployeeDto);
    return res.send(updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Employee by EmpNum (ลบพนักงาน)' })
  @ApiOkResponse({ type: Number })
  async remove(@Res() res: FastifyReply, @Param('id') id: string) {
    const employee = await this.employeesService.findOne(id);
    if (!employee) {
      throw new HttpException(
        MSG_MASTER.NOT_FOUND,
        MSG_MASTER.NOT_FOUND.httpStatus,
      );
    }
    const deleted = await this.employeesService.remove(id);
    if (!deleted) {
      throw new HttpException(
        MSG_MASTER.INVALID_PARAMETERS,
        MSG_MASTER.INVALID_PARAMETERS.httpStatus,
      );
    }
    return res.send(deleted);
  }
}
