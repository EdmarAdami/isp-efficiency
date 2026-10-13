import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyTenantToken, type TenantContext } from './tenant-context';
export type AuthenticatedRequest = { headers: { authorization?: string }; tenantContext?: TenantContext };
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    try {
      request.tenantContext = verifyTenantToken(request.headers.authorization,process.env.API_SERVICE_TOKEN,process.env.API_TENANT_ID);
      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
