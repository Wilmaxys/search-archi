import { AxiosResponse } from 'axios';

export function raceToSuccess(
  promises: Promise<AxiosResponse<any>>[]
): Promise<AxiosResponse<any>> {
  // Get first successful request = invert logic of Promise.all
  return Promise.all(
    promises.map((p) => {
      return p.then(
        (val) => Promise.reject(val),
        (err) => Promise.resolve(err)
      );
    })
  ).then(
    (errors) => Promise.reject(errors),
    (val) => Promise.resolve(val)
  );
}
