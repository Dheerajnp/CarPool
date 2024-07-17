export class AdminType{
    constructor (
        public readonly email? : string,
        public readonly name? : string,
        public readonly password? : string,
        public readonly phone? : string,
        public readonly profile? : string,
    ){}
}