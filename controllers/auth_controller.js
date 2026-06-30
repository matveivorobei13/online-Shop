const authService = require('../services/auth_service');
const { z } = require("zod")


// 1. REGISTER CONTROLLER
async function registerController(req, res) {
    try {
        // Safe check if file exists to prevent server crash
        const imgPath = req.file ? req.file.filename : null;
        const userData = req.body;

        const { user, access, refresh } = await authService.registerService(userData, imgPath);
        
        res.cookie("refresh", refresh, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({ status: "ok", user, access });
    }
    catch (e) {
        if (e.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ status: "error", message: "This email is already registered" });
        }
        if (e.message === 'NAME_ALREADY_EXISTS') {
            return res.status(409).json({ status: "error", message: "This username is already taken" });
        }
        console.error(e);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

// 2. LOGIN CONTROLLER
async function loginController(req, res) {
    try {
        const loginData = req.body;

        const { user, access, refresh } = await authService.loginService(loginData);

        res.cookie("refresh", refresh, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({ status: "ok", user, access });
    }
    catch (e) {
        // Fixed typo: INCORRECT_DATA and changed response status to 401 Unauthorized
        if (e.message === "INCORRECT_DATA") {
            return res.status(401).json({ status: "error", message: "Invalid username or password" });
        }
        console.error(e);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

// 3. ME CONTROLLER (GET PROFILE)
async function meController(req, res) {
    try {
        // Fixed: Added const to prevent global variable leakage
        const userId = req.user.id;
        
        const user = await authService.meService(userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        return res.json({ status: "ok", user });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

// 4. REFRESH CONTROLLER
async function refreshController(req, res) {
    const refreshToken = req.cookies.refresh;

    if (!refreshToken) {
        return res.status(401).json({ status: "error", message: "Refresh token is missing" });
    }
    try {
        const { access, refresh } = await authService.refreshService(refreshToken);
        
        res.cookie("refresh", refresh, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Fixed typo from acces to access
        return res.json({ status: "ok", access });
    }
    catch (e) {
        if (e.message === "TOKEN_NOT_FOUND" || e.message === "TOKEN_EXPIRED") {
            return res.status(401).json({ status: "error", message: "Session expired. Please log in again" });
        }
        console.error(e);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

module.exports = {
    registerController,
    loginController,
    meController,
    refreshController
};
