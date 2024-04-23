export function parseJwt(token: string): any {
  const base64Url: string = token.split('.')[1];
  const base64: string = base64Url.replace('-', '+').replace('_', '/');
  const decoded: string = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c: string) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(decoded);
}
