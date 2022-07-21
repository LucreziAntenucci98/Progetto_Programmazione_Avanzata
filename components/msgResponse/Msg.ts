import { ResponseHttp } from "../response/ResponseHttp";

export interface Msg {
    getMsg(data?:any):ResponseHttp;
}