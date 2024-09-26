import { Optional } from "sequelize";

interface UserCreationAttributes {
    username: string;
    password: string;
    email: string;
    role: 'admin' | 'common';
}