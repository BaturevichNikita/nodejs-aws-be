import {
  Controller,
  Get,
  HttpStatus,
  HttpException,
  Res,
  Req,
  Inject,
  CACHE_MANAGER,
  All,
} from '@nestjs/common';
import Axios, { AxiosRequestConfig } from 'axios';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';

const cacheKey = 'products';

@Controller()
export class AppController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @All()
  async getProducts(@Req() req: Request, @Res() res: Response): Promise<void> {
    const [_, recipient, ...rest] = req.url.split('/');
    const recipientURL = process.env[recipient];

    if (!recipientURL) throw new HttpException(res, HttpStatus.BAD_GATEWAY);

    let shouldSetCache = false;

    if (recipient === 'product' && !rest.length) {
      const data = await this.cacheManager.get(cacheKey);
      if (!data) {
        shouldSetCache = true;
      } else {
        console.log('Using cache...');
        res.json(data);
        return;
      }
    }

    const axiosConfig = <AxiosRequestConfig>{
      method: req.method,
      url: `${recipientURL}/${rest.join('/')}`,
      ...(Object.keys(req.body || {}).length && { data: req.body }),
    };

    console.log('Axios config', axiosConfig);

    try {
      const { data } = await Axios(axiosConfig);
      if (shouldSetCache) {
        console.log('Setting cache...', data);
        await this.cacheManager.set(cacheKey, data, { ttl: 120 });
      }
      res.json(data);
    } catch (err) {
      console.log('Error from recipient', JSON.stringify(err));

      if (err.response) {
        const { status, data } = err.response;
        res.status(status).json(data);
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: err.message });
      }
    }
  }
}
