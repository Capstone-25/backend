import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

/**
 * 모든 예외(AllExceptions)를 처리하기 위한 필터입니다.
 * - HttpException, 일반 Error 등 모든 예외를 포괄적으로 잡아서,
 *   공통된 형태로 응답을 내려줄 수 있습니다.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 기본값 설정
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // NestJS의 HttpException 인스턴스라면 status와 response를 꺼냄
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 예외 response가 문자열일 수도 있고, 객체일 수도 있음
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as Record<string, any>).message || message;
      }
    } else if (exception instanceof Error) {
      // 일반 Error 객체인 경우
      message = exception.message || message;
    }

    // 로그 출력
    this.logger.error(
      `HTTP Status: ${status}\nError Message: ${JSON.stringify(message)}`
    );

    // 공통된 JSON 형태로 응답
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
