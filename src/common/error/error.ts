import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = 'Error';
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {       
        const responseObj = exceptionResponse as Record<string, unknown>;        
        if (typeof responseObj.message === 'string') {
          message = responseObj.message;
        }
        if (typeof responseObj.error === 'string') {
          error = responseObj.error;
        }
        if (responseObj.details !== undefined) {
          details = responseObj.details;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      details,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

}