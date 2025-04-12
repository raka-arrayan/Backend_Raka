const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");

const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    const { email, password, name } = req.query; 

    if (!email || !password || !name) {
        return baseResponse(res, false, 400, "Missing email, password, or name", null);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    let errorMessages = [];

    if (!emailRegex.test(email)) {
        errorMessages.push("Invalid email format");
    }

    if (!passwordRegex.test(password)) {
        errorMessages.push("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
    }

    if (errorMessages.length > 0) {
        return baseResponse(res, false, 400, errorMessages.join(" & "), null);
    }

    try {
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return baseResponse(res, false, 409, "Email already used", null);
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await userRepository.createUser({
            name,
            email,
            password: hashedPassword 
        });

        return baseResponse(res, true, 201, "User created", newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        return baseResponse(res, false, 500, "Server error", null);
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.query; 

    if (!email || !password) {
        return baseResponse(res, false, 400, "Missing email or password", null);
    }

    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 401, "Invalid email or password", null);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return baseResponse(res, false, 401, "Invalid email or password", null);
        }

        return baseResponse(res, true, 200, "Login success", user);
    } catch (error) {
        console.error("Error during login:", error);
        return baseResponse(res, false, 500, "Server error", null);
    }
};




exports.getUserByEmail = async (req, res) => {
    const { email } = req.params; 

    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        return baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return baseResponse(res, false, 500, "Server error", null);
    }
};




exports.updateUser = async (req, res) => {
    const { id, email, password, name } = req.body;

    if (!id || !email || !password || !name) {
        return baseResponse(res, false, 400, "Missing required fields", null);
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    let errorMessages = [];

    if (!emailRegex.test(email)) {
        errorMessages.push("Invalid email format");
    }

    if (!passwordRegex.test(password)) {
        errorMessages.push("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
    }

    if (errorMessages.length > 0) {
        return baseResponse(res, false, 400, errorMessages.join(" & "), null);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await userRepository.updateUser({ id, email, password: hashedPassword, name });

        if (!updatedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        return baseResponse(res, true, 200, "User updated", updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return baseResponse(res, false, 500, "Server error", null);
    }
};



const { validate: isUUID } = require("uuid");

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    // Cek apakah ID valid UUID
    if (!isUUID(id)) {
        return baseResponse(res, false, 400, "Invalid user ID format", null);
    }

    try {
        const deletedUser = await userRepository.deleteUser(id);

        if (!deletedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        return baseResponse(res, true, 200, "User deleted", deletedUser);
    } catch (error) {
        console.error("Error deleting user:", error);
        return baseResponse(res, false, 500, "Server error", null);
    }
};

exports.topUpBalance = async (req, res) => {
    const { id, amount } = req.query;

    if (!id || !amount) {
        return baseResponse(res, false, 400, "Missing user ID or amount", null);
    }

    const topUpAmount = parseInt(amount, 10);
    if (isNaN(topUpAmount) || topUpAmount <= 0) {
        return baseResponse(res, false, 400, "Amount must be larger than 0", null);
    }

    try {
        const updatedUser = await userRepository.topUpUserBalance(id, topUpAmount);
        
        if (!updatedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        const hashedPassword = await bcrypt.hash(updatedUser.password, 10);
        
        updatedUser.password = hashedPassword;

        return baseResponse(res, true, 200, "Top up successful", updatedUser);
    } catch (error) {
        console.error("Error during top-up:", error);
        return baseResponse(res, false, 500, "Server error", null);
    }
};
