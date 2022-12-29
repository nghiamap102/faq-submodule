import Cookies from "js-cookie";
import { FC, useEffect, useState } from "react";
import { AuthService } from "services/auth.service";

const CountDown: FC = () => {
    const [date, setDate] = useState(new Date().getTime())
    const authService = new AuthService();

    useEffect(() => {
        setInterval(() => {
            console.log(date);
            setDate(new Date().getTime());
        }, 1000)
    }, [])


    useEffect(() => {
        const expiresTime = Cookies.get('expires_in') || new Date().getTime()
        console.log(expiresTime);
        if (date > expiresTime) {
            console.log(expiresTime);
            refreshToken();
        }
    }, [date])


    const refreshToken = async () => {
        await authService.refreshToken(Cookies.get('refresh_token'));
    }

    return (
        <></>
    )
};

export default CountDown
