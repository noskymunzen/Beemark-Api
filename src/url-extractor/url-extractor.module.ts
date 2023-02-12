import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { URLExtractorService } from './url-extractor.service';

@Module({
  imports: [HttpModule],
  providers: [URLExtractorService],
  exports: [URLExtractorService],
})
export class URLExtractorModule {}
