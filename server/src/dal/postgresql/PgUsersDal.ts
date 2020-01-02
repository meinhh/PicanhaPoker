import IUsersDal from "dal/IUsersDal";
import BasePostgresqlDal from "./BasePostgresqlDal";
import User from "common/app/User";

export default class PgUsersDal extends BasePostgresqlDal implements IUsersDal {
    public async getUserById(userId: number): Promise<User> {
        const results = await this.queryExecutor.query<User[]>("select * from users where user_id = $1", [userId]);
        
        if (results.length == 0) {
            return null;
        }

        return results[0];
    }

    public async createUser(firstname: string, lastname: string, email: string): Promise<User> {
        const results = await this.queryExecutor.query<User[]>("insert into users (first_name, last_name, email, date_created) values ($1, $2, $3, $4) returning *", [
            firstname, 
            lastname,
            email,
            new Date()
        ]);

        if (results.length == 0) {
            throw 'User was not created';
        }

        return results[0];
    }
}