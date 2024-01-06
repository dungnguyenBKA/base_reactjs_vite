import BaseService from "./BaseService.ts";
import UserModel from "../models/UserModel.ts";

type LoginModelRequest = {
  username: string,
  password: string
}
export default class AuthService extends BaseService {
  login(request: LoginModelRequest) {
    return this.axiosClient.post<UserModel>("/api/accounts/login", {
      ...request
    });
  }
}

