import { ApiProperty } from "@nestjs/swagger";
import { plainToClass, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { LessThan, MoreThan } from "typeorm";

export class QueryCommon {
   
    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit: number;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    offset: number;
  
    @ApiProperty({ required: false, example: 'createAt'  })
    @IsOptional()
    @IsString()
    sortField: string;
  
    @ApiProperty({ required: false, example:'DESC' })
    @IsOptional()
    @Type(() => String)
    @IsString()
    sortType: String;
  
    getQueryCommonObject(): QueryCommon {
      const options = {};
      if (this.limit && this.offset) {
        options['take'] = this.limit;
        options['skip'] = this.offset;
      }
      options['order'] = { [this.sortField || 'id']: this.sortType || 'DESC' };
      return plainToClass(QueryCommon, options);
    }
  }
  
  export class QueryPostProperty extends QueryCommon {
   

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title?: string;
  
    @ApiProperty({ required: false , description: 'tags=TypeScript,nodejs'})
    @IsOptional()
    @IsString()
    tags?: string;
  
    getQueryPostObject(): QueryPostProperty {
      const postQueryObject = {};
      if (this.tags) postQueryObject['tags'] = this.tags;
      if (this.title) postQueryObject['title'] = this.title;
      const queryOptions = Object.assign({}, this.getQueryCommonObject(), {
        where: postQueryObject,
      });
      return plainToClass(QueryPostProperty, queryOptions);
    }
  }