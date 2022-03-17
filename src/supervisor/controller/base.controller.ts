export type ResponsePack<T> = {
  message: string,
  data: T
};

export default class BaseController {
  protected _message: string;

  message(message: string): BaseController {
    this._message = message;
    return this;
  }

  data<T>(data: T = null): ResponsePack<T> {
    return { message: this._message, data };
  }
}