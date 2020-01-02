import User from "common/app/User";

export default interface IUsersDal {
    getUserById(id: number): Promise<User>;
    createUser(firstname: string, lastname: string, email: string): Promise<User>;
}