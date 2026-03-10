import { registerAs } from "@nestjs/config";

export default registerAs('reqres', () => ({
    reqresUrl: process.env.REQ_RES_URL || 'https://reqres.in/api/login',
    reqresKey: process.env.REQ_RES_KEY || 'reqres_fd9ff8918b3f4e8a985e4a717f26e9ba',
}));