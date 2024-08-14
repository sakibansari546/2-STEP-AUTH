import jwt from "jsonwebtoken";

export const genrateTokenAndSetCookie = async (res, userId) => {
    try {
        // console.log(res);

        let token = jwt.sign({ userId }, process.env.SECRET_ACCESS_KEY, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // In development, keep it false
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return token;
    } catch (error) {
        console.log(error);
    }
}
