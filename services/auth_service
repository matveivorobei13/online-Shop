const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth_repository'); // Our new DB layer

async function registerService(user, avatarPath) {
    // 1. Check for duplicates using DB layer
    const existingUsers = await authRepository.findUserByNameOrEmail(user.name, user.email);
    
    if (existingUsers.length !== 0) {
        const foundUser = existingUsers[0];
        if (foundUser.name === user.name) throw new Error('NAME_ALREADY_EXISTS');
        if (foundUser.email === user.email) throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const hash = await bcrypt.hash(user.password, 10);
    
    // 2. Save user and create cart using DB layer
    const newUser = await authRepository.createUser(user.name, user.email, hash, avatarPath);
    await authRepository.createUserCart(newUser.id);

    // 3. Generate tokens
    const access = jwt.sign({ id: newUser.id, role: "user"  }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refresh = crypto.randomBytes(40).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 4. Save refresh token via DB layer
    await authRepository.saveRefreshToken(newUser.id, refresh, expiresAt);

    delete newUser.password_hash;
    return { user: newUser, access, refresh };
}

async function loginService(user) {
    let hash
    const dbUser = await authRepository.findUserByName(user.name);
    if (!dbUser) {hash = process.env.FAKE_HASH}
    else{hash = dbUser.password_hash}
    

    const isPasswordValid = await bcrypt.compare(user.password, hash);
    if (!isPasswordValid) throw new Error("INCORRECT_DATA");

    const access = jwt.sign({ id: dbUser.id, role: "user"  }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refresh = crypto.randomBytes(40).toString('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await authRepository.saveRefreshToken(dbUser.id, refresh, expiresAt);
    
    delete dbUser.password_hash;
    return { user: dbUser, access, refresh };
}

async function meService(id) {
    return await authRepository.findUserById(id);
}

async function refreshService(oldRefreshToken) {
    const refreshToken = await authRepository.findRefreshToken(oldRefreshToken);
    if (!refreshToken) throw new Error("TOKEN_NOT_FOUND");
    
    if (new Date(refreshToken.expires_at) < new Date()) {
        await authRepository.deleteRefreshToken(refreshToken.id);
        throw new Error("TOKEN_EXPIRED");
    }
    
    await authRepository.deleteRefreshToken(refreshToken.id);
    const user = await authRepository.findUserById(refreshToken.user_id)
    const access = jwt.sign({ id: refreshToken.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refresh = crypto.randomBytes(40).toString('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await authRepository.saveRefreshToken(refreshToken.user_id, refresh, expiresAt);

    return { access, refresh };
}

async function logoutService(token){
    const isToken = await authRepository.findRefreshToken(token)
    if(!isToken) throw new Error("TOKEN_NOT_FOUND")
    await authRepository.deleteRefreshToken(isToken.id)
    return true
}

module.exports = {
    registerService,
    loginService,
    meService,
    refreshService,
    logoutService
};
