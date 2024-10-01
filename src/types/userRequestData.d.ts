import { Optional } from "sequelize";

interface UserCreationAttributes {
    username: string;
    password: string;
    email: string;
    role: 'admin' | 'common';
}

interface UserLoginAttributes {
    email: string;
    password: string;
}