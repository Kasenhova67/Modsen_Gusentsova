import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;        
      message = response.message || message;
      error = response.error || error;
      details = response.details || null;
    } 
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    response.status(status).json({status,error,message,details,path: request.url,timestamp: new Date().toISOString(),});
  }
}
