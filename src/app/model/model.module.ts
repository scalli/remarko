import { NgModule } from "@angular/core";

import { Model } from "./repository.model";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { RestDataSource, REST_URL } from "./rest.datasource";
import { FileUtil }                     from '../csvutils/file.util';
import { Constants }                    from '../csvutils/tests.constants';

@NgModule({
    imports: [HttpClientModule, HttpClientJsonpModule],
    providers: [Model, RestDataSource, FileUtil, Constants,
        { provide: REST_URL, useValue: `http://restfulapi.test` }] 
        //https://notatis.org 
        //https://spring.remarko.net
        // http://localhost:8080
        //http://remarko.eu-central-1.elasticbeanstalk.com
})
export class ModelModule { }