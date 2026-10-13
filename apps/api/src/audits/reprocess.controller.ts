import {BadRequestException,Body,Controller,Post,Req,UseGuards} from '@nestjs/common';
import {TenantGuard,type AuthenticatedRequest} from '../security/tenant.guard';
import {ReprocessService} from './reprocess.service';
@Controller('v1/audits')
@UseGuards(TenantGuard)
export class ReprocessController {
  constructor(private readonly service:ReprocessService){}
  @Post('reprocess')
  async reprocess(@Req() req:AuthenticatedRequest,@Body() body:{journeyId?:string}){
    if(typeof body?.journeyId!=='string'||!body.journeyId||body.journeyId.length>128)throw new BadRequestException('Invalid journeyId');
    return this.service.reprocess(req.tenantContext!.tenantId,body.journeyId);
  }
}
