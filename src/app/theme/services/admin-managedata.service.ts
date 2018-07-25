
import {Injectable} from "@angular/core";
import {HttpHelperService} from "./http-helper.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PmvHeading} from "../models/pmv-heading.model";
import {PmvSubHeading} from "../models/pmv-subheading.model";




@Injectable()

export class AdminManagedService{

    constructor(private httpHelper: HttpHelperService,private http: HttpClient,){}

    getPmvHeadings = (): Observable<PmvHeading[]> => {
        return this.httpHelper.getDataWithoutAuthentication<PmvHeading[]>('getPmvHeadings');
    }

    getPmvSubHeadingsByHeadingId = (headingId:number): Observable<PmvSubHeading[]> => {
        return this.httpHelper.getDataWithoutAuthentication<PmvSubHeading[]>('getPmvSubHeadings'+ "?"+"headingId="+headingId);
    }


}