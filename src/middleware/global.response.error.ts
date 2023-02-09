export const GlobalResponseError: (
  statusCode: number,
  message: string,
) => IResponseError = (statusCode: number, message: string): IResponseError => {
  return {
    statusCode: statusCode,
    message,
    timestamp: new Date().toISOString(),
  };
};

export interface IResponseError {
  statusCode: number;
  message: string;
  timestamp: string;
}
