import { Module } from '@nestjs/common';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';
import { ReferenceDataController } from './reference-data.controller';

@Module({
  controllers: [LookupsController, ReferenceDataController],
  providers: [LookupsService],
  exports: [LookupsService],
})
export class LookupsModule {}
