export class AppConstants {
  static token: string = "";
  static base_url_api: string = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
  static domain: string = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  static redirect_url: string = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  static login_url: string = `${process.env.NEXT_PUBLIC_API_BASE_URL}/signin`;
}
