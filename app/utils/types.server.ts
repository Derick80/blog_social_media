export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
}

export interface CreateOrEditPost {
  title: string;
  body: string;
  postImg: string;
  userId: string;
}

export interface CategoryForm {
    name: string;
}
