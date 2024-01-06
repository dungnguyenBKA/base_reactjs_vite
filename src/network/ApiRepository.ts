import ApiClient from "./ApiClient.ts";

export default class ApiRepository {
  private axiosClient = ApiClient.getInstance();

  private static instance: ApiRepository | undefined = undefined
  private constructor() {
  }
}
