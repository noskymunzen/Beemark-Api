import { registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentDTO } from './dtos/environment.dto';

export const config = registerAs('environment', () => {
  const environment = plainToClass(EnvironmentDTO, process.env);
  const errors = validateSync(environment, { skipMissingProperties: false });

  if (errors.length) {
    throw new Error(errors.toString());
  }
  return environment;
});
