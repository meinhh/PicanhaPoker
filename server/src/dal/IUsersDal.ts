import User from "common/app/User";

export default interface IUsersDal {
    getById(id: number): Promise<User>;
    insert(firstname: string, lastname: string, email: string): Promise<User>;
}