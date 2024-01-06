import ApiClient from "../ApiClient.ts";

export default abstract class BaseService {
  axiosClient = ApiClient.getInstance();
}

const serviceRepo = <BaseService[]>[];

export function inject<ClzType extends BaseService>(Clz: new () => ClzType): ClzType {
  serviceRepo.forEach((service) => {
    if (service instanceof Clz) {
      return service;
    }
  });

  const service = new Clz();
  serviceRepo.push(service);
  return service;
}
