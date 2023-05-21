import {sign} from 'jsonwebtoken';
import EnvVars from 'src/constants/EnvVars';

class RefreshToken {
    constructor(init?: Partial<RefreshToken>) {
        Object.assign(this, init);
    }

    id: number;
    userId: number;
    userAgent: string;
    ipAddress: string;

    sign(): string {
        return sign({...this}, EnvVars.RefreshSecret);
    }
}

export default RefreshToken;