import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
const metascraper = require('metascraper');

const scraper = metascraper([
  require('metascraper-title')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo-favicon')(),
]);

@Injectable()
export class URLExtractorService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Extract data of the url
   * @param url
   */
  async extract(url: string): Promise<{
    description: string;
    title: string;
    logo: string;
    image: string;
  }> {
    const response = await this.httpService.axiosRef.get(url, {
      responseType: 'document',
    });
    if (response.status !== 200) {
      throw new Error('Something has gone wrong');
    }

    const metadata = await scraper({ html: response.data, url });
    return metadata;
  }
}
