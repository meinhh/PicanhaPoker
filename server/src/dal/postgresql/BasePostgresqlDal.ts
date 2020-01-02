import Postgresql from "./Postgresql";

export default abstract class BasePostgresqlDal {
    public constructor(protected queryExecutor: Postgresql) {}
}